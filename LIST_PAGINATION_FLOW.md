# 列表查询及分页流程分析

本文基于当前项目的用户管理页面（`/user/list`）梳理“列表查询 + 分页”的完整链路。

## 1. 页面入口与路由

1. 用户在左侧菜单点击“用户管理”。
2. 菜单路由跳转到 `/user/list`。
3. 路由配置将该路径映射到 `src/views/user/list.vue` 页面组件。

关键代码：
- 菜单入口：`src/layout/index.vue`
- 路由映射：`src/router/index.js`

## 2. 列表页面如何接入查询/分页能力

`src/views/user/list.vue` 中通过组合式函数：

```js
const {
  tableData,
  loading,
  currentPage,
  pageSize,
  total,
  handleSearch,
  resetSearch,
  handleDelete,
  handleCurrentChange,
  handleSizeChange
} = useTable(list, searchForm, deleteUser)
```

说明：
- `list`：用户列表 API（来自 `src/api/user.js`）。
- `searchForm`：查询条件对象（`username`、`email`）。
- `deleteUser`：删除 API，给 `useTable` 的删除逻辑复用。

页面模板中：
- 表格数据来源于 `tableData`。
- 分页组件绑定 `currentPage`、`pageSize`、`total`。
- 搜索按钮触发 `handleSearch`。
- 重置按钮触发 `resetSearch`。
- 翻页和 pageSize 变更分别触发 `handleCurrentChange` 与 `handleSizeChange`。

## 3. useTable 中的核心状态

`src/composables/useTable.js` 管理了查询与分页通用状态：
- `tableData`: 当前页列表数据
- `loading`: 列表请求中状态
- `currentPage`: 当前页码，默认 `1`
- `pageSize`: 每页条数，默认 `5`
- `total`: 总条数

这套状态被页面直接消费，因此查询和分页逻辑与具体业务页面解耦。

## 4. 请求参数如何组装

`useTable` 的 `fetchData` 会统一组装请求载荷：
- 展开查询条件：`...searchForm`
- 注入分页参数：`pageNum`、`pageSize`

即每次查询/翻页/改每页条数，都会发出形如：

```json
{
  "username": "...",
  "email": "...",
  "pageNum": 1,
  "pageSize": 5
}
```

随后执行 `apiFn(payload)`，在用户页中对应 `list(payload)`。

## 5. API 层与请求拦截流程

`src/api/user.js` 的 `list(data)`：
- 请求地址：`/user/list`
- 请求方法：`POST`
- 请求体：`data`

`src/utils/request.js` 的 axios 实例：
- `baseURL` 为 `/api`，开发时通过 Vite 代理转发到后端 `http://localhost:8080`。
- 请求拦截器会自动带上 `Authorization` token。
- 响应拦截器统一返回 `res.data`（非 200 状态会 reject）。

因此前端业务层拿到的是后端返回体本身，不是 axios 原始响应对象。

## 6. 列表结果的兼容解析

`useTable` 中 `normalizeListResult` 做了多结构兼容：
- 若返回是数组：
  - `rows = res`
  - `total = res.length`
- 若返回是对象：
  - `rows` 优先取 `records | list | rows | data`
  - `total` 优先取 `total | count`，都没有则回退 `rows.length`

这样可以兼容不同后端分页字段命名。

## 7. 分页事件触发链路

### 7.1 首次进入页面
- `onMounted(fetchData)` 自动拉取第一页（pageNum=1, pageSize=5）。

### 7.2 点击搜索
- `handleSearch()` 直接调用 `fetchData()`。
- 注意：当前实现不会自动把页码重置到 1；会沿用当前页码。

### 7.3 点击重置
- `resetSearch()` 将 `searchForm` 所有字段置空。
- 同时强制 `currentPage = 1`。
- 然后调用 `fetchData()`。

### 7.4 切换页码
- `handleCurrentChange(page)` 更新 `currentPage`。
- 调用 `fetchData()` 拉取目标页。

### 7.5 修改每页条数
- `handleSizeChange(size)` 更新 `pageSize`。
- 为避免越界，先把 `currentPage` 重置为 1。
- 再调用 `fetchData()`。

## 8. 分页 UI 与序号计算

页面使用 Element Plus 的 `el-pagination`：
- `v-model:current-page="currentPage"`
- `v-model:page-size="pageSize"`
- `:total="total"`

表格“序号”列不是后端字段，而是前端按分页偏移计算：

```js
(currentPage - 1) * pageSize + index + 1
```

这样跨页时序号连续递增。

## 9. 一句话总结

该项目把“列表查询 + 分页”抽到 `useTable` 中统一管理：页面只负责绑定表单/分页组件，`useTable` 负责状态、参数拼装、请求调用与结果归一化，从而达到复用和后端字段兼容的目的。
