# 功能模块设计：商品库存与出入库管理（CRUD 训练版）

> 目标：在现有 `vue-admin` 项目中，继续练习“增删改查”，并有意识地引入当前项目还未使用的 Element Plus 组件（建议先引入 2 个：`el-steps`、`el-descriptions`）。

---

## 1. 为什么选这个模块

这个模块非常适合练习 CRUD，因为它天然包含：

- 商品档案：新增、查询、编辑、删除。
- 出入库单：新增、查询、审核、删除（可选）。
- 库存台账：根据单据正负变动。
- 可扩展性高：后面可以继续加统计图、权限控制、导出等。

同时，页面上容易引入新组件：

- `el-steps`：用于“新建出入库单”的步骤引导。
- `el-descriptions`：用于商品详情或单据详情展示。

---

## 2. 功能范围（第一阶段）

建议拆成 3 个页面：

1. **商品管理页**（核心 CRUD）
   - 查询：按商品编码/名称/分类/状态筛选。
   - 新增：弹窗表单新增商品。
   - 编辑：修改商品基础信息。
   - 删除：逻辑删除。
   - 查看：用 `el-descriptions` 展示只读详情。

2. **出入库单页**（主从 CRUD）
   - 查询：按单号、类型（入库/出库）、状态、时间范围筛选。
   - 新增单据：通过 `el-steps` 分 3 步创建。
   - 编辑单据：未审核状态可修改。
   - 删除单据：未审核状态可删除。

3. **库存台账页**（只读查询）
   - 查询：按商品、时间范围、变动类型筛选。
   - 列表：展示每一次库存变化。

---

## 3. 页面交互设计（从浅入深）

### 3.1 初级版本（先跑通）

- 商品管理只做单表 CRUD。
- 出入库单先不做复杂审核流，只做创建和列表。
- 库存台账可先用后端返回的 mock 数据。

### 3.2 进阶版本（提升实战能力）

- 出入库单增加状态机：`草稿 -> 待审核 -> 已完成`。
- 出库时校验库存不足。
- 商品删除改为逻辑删除，避免历史台账失联。

### 3.3 高级版本（贴近生产）

- 增加“并发库存扣减”保护（乐观锁版本号）。
- 增加操作日志与审计字段。
- 增加导出 Excel 与批量导入能力。

---

## 4. 数据库表设计（MySQL 示例）

> 命名规则：
> - 主键统一 `BIGINT`。
> - 时间统一 `DATETIME`。
> - 删除统一 `is_deleted` 逻辑删除。
> - 所有表保留 `created_by / updated_by`。

### 4.1 商品主表 `inv_product`

```sql
CREATE TABLE `inv_product` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `product_code` VARCHAR(32) NOT NULL COMMENT '商品编码',
  `product_name` VARCHAR(128) NOT NULL COMMENT '商品名称',
  `category_id` BIGINT DEFAULT NULL COMMENT '分类ID',
  `unit` VARCHAR(16) NOT NULL DEFAULT '件' COMMENT '单位',
  `sale_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '售价',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态:1启用,0禁用',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `is_deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '逻辑删除:0否,1是',
  `created_by` VARCHAR(64) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_product_code` (`product_code`),
  KEY `idx_product_name` (`product_name`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品主表';
```

### 4.2 商品分类表 `inv_category`

```sql
CREATE TABLE `inv_category` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(64) NOT NULL,
  `parent_id` BIGINT NOT NULL DEFAULT 0,
  `sort_no` INT NOT NULL DEFAULT 0,
  `status` TINYINT NOT NULL DEFAULT 1,
  `is_deleted` TINYINT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类';
```

### 4.3 库存表 `inv_stock`

```sql
CREATE TABLE `inv_stock` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT NOT NULL,
  `qty` INT NOT NULL DEFAULT 0 COMMENT '当前库存数量',
  `version` INT NOT NULL DEFAULT 0 COMMENT '乐观锁版本号',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='实时库存';
```

### 4.4 出入库单主表 `inv_order`

```sql
CREATE TABLE `inv_order` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `order_no` VARCHAR(32) NOT NULL COMMENT '单据编号',
  `order_type` TINYINT NOT NULL COMMENT '1入库 2出库',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '0草稿 1待审核 2已完成 3已驳回',
  `biz_date` DATE NOT NULL COMMENT '业务日期',
  `operator_name` VARCHAR(64) DEFAULT NULL COMMENT '经办人',
  `remark` VARCHAR(255) DEFAULT NULL,
  `is_deleted` TINYINT NOT NULL DEFAULT 0,
  `created_by` VARCHAR(64) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(64) DEFAULT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_order_type` (`order_type`),
  KEY `idx_status` (`status`),
  KEY `idx_biz_date` (`biz_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='出入库单主表';
```

### 4.5 出入库单明细表 `inv_order_item`

```sql
CREATE TABLE `inv_order_item` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL,
  `qty` INT NOT NULL COMMENT '数量',
  `unit_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '单价',
  `amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '金额',
  `remark` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='出入库单明细';
```

### 4.6 库存流水表 `inv_stock_log`

```sql
CREATE TABLE `inv_stock_log` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT NOT NULL,
  `biz_type` TINYINT NOT NULL COMMENT '1入库 2出库 3调整',
  `ref_order_no` VARCHAR(32) DEFAULT NULL COMMENT '关联单号',
  `change_qty` INT NOT NULL COMMENT '变动数量，可正可负',
  `before_qty` INT NOT NULL,
  `after_qty` INT NOT NULL,
  `created_by` VARCHAR(64) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_ref_order_no` (`ref_order_no`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='库存流水';
```

---

## 5. 后端接口设计（REST 示例）

### 5.1 商品管理

- `POST /inventory/product/page`：分页查询
- `POST /inventory/product/create`：新增
- `POST /inventory/product/update`：编辑
- `POST /inventory/product/delete`：删除（逻辑）
- `GET /inventory/product/detail/{id}`：详情

### 5.2 出入库单

- `POST /inventory/order/page`
- `POST /inventory/order/create`
- `POST /inventory/order/update`
- `POST /inventory/order/delete`
- `POST /inventory/order/submit`（提交审核）
- `POST /inventory/order/approve`（审核通过后写库存）

### 5.3 台账

- `POST /inventory/stock-log/page`

---

## 6. 前端开发建议（对应当前项目结构）

### 6.1 目录建议

```text
src/
  api/
    inventory.js
  composables/
    useInventoryProduct.js
    useInventoryOrder.js
  views/
    inventory/
      product-list.vue
      order-list.vue
      stock-log.vue
```

### 6.2 路由与菜单

- 新增一级菜单：`库存管理`
- 子菜单：`商品管理`、`出入库单`、`库存台账`
- 对应 `component` 路径：
  - `inventory/product-list`
  - `inventory/order-list`
  - `inventory/stock-log`

### 6.3 表单与表格字段映射

- 商品列表字段：商品编码、名称、分类、单位、售价、状态、更新时间。
- 出入库主表字段：单号、类型、状态、业务日期、经办人。
- 出入库明细字段：商品、数量、单价、金额。

---

## 7. Element Plus 组件训练点（本次重点）

### 7.1 `el-steps`（建议放在“新建出入库单”弹窗）

- Step1：填写主信息（类型、业务日期、经办人）
- Step2：维护明细行（商品、数量、单价）
- Step3：确认提交（汇总金额、提示）

训练目标：

- 学会在一个弹窗里做“分步表单”。
- 学会按步骤做校验与状态切换。

### 7.2 `el-descriptions`（建议放在“商品详情”抽屉）

- 展示：商品编码、名称、分类、单位、状态、创建时间。
- 可组合 `el-tag` 显示状态，提升可读性。

训练目标：

- 学会做只读详情场景。
- 学会将列表行数据转换为详情展示数据。

---

## 8. 业务流程（关键逻辑）

1. 创建出库单（草稿）
2. 提交审核（待审核）
3. 审核通过：
   - 校验库存 >= 出库数量
   - 写入库存流水 `inv_stock_log`
   - 更新库存表 `inv_stock`
   - 单据置为已完成

> 注意：库存更新与流水写入必须在同一事务中。

---

## 9. 开发排期建议（7 天训练节奏）

- Day1：建表 + 后端商品 CRUD + 前端商品列表
- Day2：商品新增/编辑/删除 + `el-descriptions` 详情
- Day3：出入库单主表 CRUD
- Day4：出入库明细（主从）+ `el-steps` 分步创建
- Day5：审核与库存变动
- Day6：库存台账 + 联调修复
- Day7：回归测试 + 文档补齐

---

## 10. 验收清单（Definition of Done）

- [ ] 商品管理支持完整 CRUD。
- [ ] 出入库单支持新增、编辑、删除、提交、审核。
- [ ] 审核通过后库存正确增减，并写入流水。
- [ ] 页面已使用并掌握 2 个新组件：`el-steps`、`el-descriptions`。
- [ ] 数据库字段、索引、状态字典有文档。
- [ ] 至少完成 20 条覆盖正常/异常流的自测用例。

---

## 11. 自测用例示例（节选）

1. 新增商品编码重复，应拦截并提示。
2. 商品禁用后，不允许出现在新建单据商品下拉（可选策略）。
3. 出库数量大于库存，应提交失败。
4. 删除未审核单据成功，删除已完成单据失败。
5. 审核通过后，库存与流水数量一致。

---

## 12. 你可以立刻开始的最小任务

1. 先做 `商品管理` 单页 CRUD（延续你现在的用户管理写法）。
2. 给“查看商品”功能换成 `el-descriptions`。
3. 再做“新建出入库单”弹窗，先把 `el-steps` 的 3 步流程跑通（哪怕先用 mock）。

这样就能在当前项目中，快速达成：**继续练 CRUD + 新增 1~2 个 Element Plus 组件实战**。
