# 菜单层级显示功能实现全流程分析（前后端 + 数据 + 代码）

> 目标：基于当前项目实现，完整解释“菜单层级显示”是如何从数据库数据一路流转到前端左侧菜单渲染，以及动态路由如何与菜单联动。

---

## 1. 功能目标与核心结论

菜单层级显示并不是单一组件能力，而是一个由 **后端数据组织 + 前端状态建模 + 路由动态注册 + 递归组件渲染** 共同完成的链路。

当前项目的核心实现思想：

1. 后端返回用户可见菜单（通常按角色过滤）。
2. 前端登录后把菜单写入 Pinia。
3. 前端用 `buildMenuTree` 把扁平/混合菜单标准化为树。
4. 左侧菜单组件递归渲染树结构（`MenuItem` 自调用）。
5. 同一份菜单数据再被拍平，映射为动态路由并 `addRoute` 注册。
6. 页面刷新时通过持久化恢复菜单并重新注册动态路由，保证“刷新不丢路由”。

---

## 2. 后端数据模型：菜单层级的来源

根据 `doc/db.sql`，菜单层级关系由 `sys_menu.parent_id` 表达：

```sql
CREATE TABLE `sys_menu` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `parent_id` bigint NOT NULL DEFAULT '0',
  `menu_name` varchar(50) NOT NULL,
  `path` varchar(128) NOT NULL,
  `component` varchar(128) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `sort_no` int NOT NULL DEFAULT '0',
  `visible` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
)
```

### 字段语义（与前端菜单直接相关）

- `id`：菜单唯一标识。
- `parent_id`：父菜单 ID，`0` 通常表示顶级菜单。
- `menu_name`：显示名称（前端菜单标题用它）。
- `path`：路由 path。
- `component`：前端页面组件路径（如 `system/user/index`）。
- `icon`：图标名（对应 Element Plus 图标组件）。
- `sort_no`：同级排序。
- `visible`：是否可见（当前前端最终使用 `hidden` 语义进行过滤，常见做法是后端转换 `visible` 到 `hidden`）。

### 权限关系（角色与菜单）

- `sys_role` 定义角色。
- `sys_role_menu` 做角色与菜单关联。
- 登录后后端可基于用户角色返回“该用户有权限的 menus”。

这决定了：**同一前端代码，不同用户会看到不同菜单层级和路由集合**。

---

## 3. 登录到菜单渲染的端到端主流程

下面是当前实现中的关键链路：

1. 登录页调用 `/user/login`。
2. 返回用户信息 + 菜单数据 `menus`。
3. `userStore.setUserInfo` 保存用户数据，并对 `menus` 做树化。
4. 登录成功后调用 `initDynamicRoutes(router, res.menus)` 动态注入路由。
5. 跳转到第一个可用菜单路径。
6. Layout 中的 `Menus.vue` 从 `userInfo.menus` 读取树并渲染。
7. `MenuItem.vue` 通过递归展示多级菜单。

---

## 4. 前端分层职责（按模块）

## 4.1 API 层（请求后端）

文件：`src/api/user.js`

- `login(data)` 请求 `/user/login`。
- Axios 基础实例在 `src/utils/request.js`，统一加 token、统一错误处理。

作用：**拿到包含 menus 的登录响应**。

---

## 4.2 Store 层（菜单数据标准化 + 持久化）

文件：`src/stores/user.js`

`setUserInfo(user)` 做了关键动作：

- 把用户基础信息写入 `userInfo`。
- 对 `user.menus` 调用 `buildMenuTree(user?.menus)`。

这一步非常重要：

- 即便后端返回扁平数组，前端也可还原为树。
- 即便后端返回树，`buildMenuTree` 会先拍平再重组，得到统一结构。

### 刷新不丢菜单的基础

`persist: true` 开启了 Pinia 持久化，`userInfo.menus` 会保存在本地。
刷新后可直接恢复菜单，再恢复动态路由。

---

## 4.3 菜单数据处理工具

文件：`src/utils/menu.js`

### A. `buildMenuTree(menus)`

实现步骤（按代码逻辑）：

1. 校验输入必须是数组。
2. `collectMenus` 递归采集所有节点到 `flatMenus`。
3. 用 `Map(id -> menu)` 重新构建节点，并初始化 `children: []`。
4. 二次遍历：
   - `parent_id > 0` 且能找到父节点 => push 到父节点 children。
   - 否则放入 `roots`。
5. 对 `roots` 和每级 children 按 `sort_no` 升序排序。

结果：得到稳定的树形菜单，支持任意层级。

### B. `flattenMenus(menus)`

- 深度遍历树。
- 把每个节点（不含 children）推进结果数组。

用途：给动态路由模块做“批量路由映射”。

### C. `getFirstMenuPath(menus)`

- 从拍平结果中找第一个有 path 的菜单。
- 找不到时兜底 `/dashboard`。

用途：登录后自动跳首个可访问页面。

---

## 4.4 动态路由模块

文件：`src/router/dynamic-routes.js`

这是菜单功能里第二核心模块。

### A. 组件自动映射机制

```js
const viewModules = import.meta.glob('@/views/**/*.vue')
```

- Vite 在构建期收集 `views` 下所有页面。
- key 形如 `/src/views/system/user/index.vue`。
- value 是懒加载函数。

`resolveComponent(viewPath)` 通过后端给的 `menu.component` 去匹配模块。

### B. `mapMenuToRoute(menu, parentPath)`

做了这些事情：

1. 校验菜单必须有 `path` + `component`。
2. 解析组件，找不到则丢弃该路由并告警。
3. 组装完整路径：支持绝对 path 与相对 path。
4. 规范 route path（去掉开头 `/`，便于作为 layout 子路由）。
5. 生成 `meta`（title/icon/hidden）。
6. 递归处理 children。

### C. `buildRoutesFromMenus(menus)`

- 先 `flattenMenus`。
- 再 `mapMenuToRoute`。
- 过滤无效项。

### D. `initDynamicRoutes(router, menus)`

- 生成 routes。
- 遍历 `router.addRoute('layout', route)` 注册到主布局路由下。

这让“菜单可见页面”与“可访问路由”保持同源数据。

---

## 4.5 登录编排层

文件：`src/composables/useLogin.js`

登录成功后关键步骤顺序：

1. `setToken(res.token)`。
2. `userStore.setUserInfo(res)`（含 menus 树化）。
3. `initDynamicRoutes(router, res.menus)`。
4. `userStore.setHasLoadedAsyncRoutes(true)`。
5. `router.push(getFirstMenuPath(res?.menus))`。

这保证用户首次登录就能：

- 看到对应菜单。
- 直接进入可访问首页。

---

## 4.6 刷新恢复与路由守卫

文件：`src/main.js` + `src/router/index.js`

### 应用启动前预加载（`main.js`）

- 在 `app.use(router)` 前读取 `userStore.userInfo?.menus`。
- 若有菜单，先执行 `initDynamicRoutes`，并标记已加载。

意义：解决“刷新后先匹配路由再注册路由”导致 404/空白的问题。

### 路由守卫二次兜底（`router/index.js`）

- 若有 token 但 `hasLoadedAsyncRoutes` 为 false：
  - 从 store 取 menus。
  - 重新初始化动态路由。
  - `next({ ...to, replace: true })` 重新进入目标页。

双保险策略：

- `main.js` 尽早注册。
- `beforeEach` 防止漏注册。

---

## 4.7 菜单渲染层（递归层级显示）

文件：`src/layout/Menus.vue` + `src/layout/MenuItem.vue`

### Menus.vue

- 从 `useMenus` 取 `userInfo`。
- 计算 `visibleMenus = menus.filter(menu => !menu.hidden)`。
- 遍历顶级菜单并渲染 `MenuItem`。

### MenuItem.vue（关键：递归）

- 若 `menu.children` 有值：渲染 `<el-sub-menu>`。
- 否则渲染 `<el-menu-item>`。
- 在 `<el-sub-menu>` 内继续 `<MenuItem v-for="child in menu.children" ...>`。

这使它天然支持 N 级菜单，而不需要写死二级/三级模板。

---

## 5. “前后端配合”数据样例（建议约定）

建议后端登录返回类似：

```json
{
  "token": "Bearer xxx",
  "id": 1,
  "username": "admin",
  "role": 1,
  "menus": [
    {
      "id": 100,
      "parent_id": 0,
      "menu_name": "系统管理",
      "path": "/system",
      "component": "system/index",
      "icon": "Setting",
      "sort_no": 1,
      "hidden": false
    },
    {
      "id": 110,
      "parent_id": 100,
      "menu_name": "用户管理",
      "path": "/system/user",
      "component": "system/user/index",
      "icon": "User",
      "sort_no": 1,
      "hidden": false
    },
    {
      "id": 120,
      "parent_id": 100,
      "menu_name": "角色管理",
      "path": "/system/role",
      "component": "system/role/index",
      "icon": "Avatar",
      "sort_no": 2,
      "hidden": false
    }
  ]
}
```

说明：

- 若后端返回的是扁平数据，前端会自动树化。
- 若后端已经返回 children 树，也能被 `buildMenuTree` 统一处理。
- `component` 必须真实存在于 `src/views`，否则动态路由会被忽略。

---

## 6. 执行时序图（文本版）

```mermaid
sequenceDiagram
    participant UI as Login.vue
    participant C as useLogin
    participant API as /user/login
    participant Store as userStore
    participant Route as dynamic-routes
    participant Menu as Menus/MenuItem

    UI->>C: 点击登录
    C->>API: login(uid, password)
    API-->>C: token + user + menus
    C->>Store: setUserInfo(res)
    Store->>Store: buildMenuTree(menus)
    C->>Route: initDynamicRoutes(router, res.menus)
    Route->>Route: flattenMenus + mapMenuToRoute + addRoute
    C->>UI: router.push(firstMenuPath)
    UI->>Menu: 渲染 Layout
    Menu->>Menu: 递归渲染 children
```

---

## 7. 为什么层级显示能稳定工作（关键设计点）

1. **数据结构统一**：无论后端树/扁平，进入 store 前统一树化。
2. **渲染与路由同源**：都基于同一份 menus。
3. **递归组件**：层级深度不受限制。
4. **刷新恢复机制**：持久化 + 启动预加载 + 守卫兜底。
5. **组件路径校验**：动态路由加载失败会有明确日志。

---

## 8. 常见问题与排查顺序

### 问题 1：菜单能看到，但点击报 404

排查：

1. 检查 `menu.component` 是否对应真实文件。
2. 查看控制台是否有 `未找到组件` 警告。
3. 确认 `initDynamicRoutes` 是否执行。

### 问题 2：刷新后菜单有，但页面空白

排查：

1. `userInfo.menus` 是否持久化恢复。
2. `main.js` 是否在挂载前预注册。
3. `hasLoadedAsyncRoutes` 状态是否被异常置位。

### 问题 3：父子菜单顺序错乱

排查：

1. 后端是否提供 `sort_no`。
2. `sort_no` 是否为可比较数值。

### 问题 4：菜单不显示

排查：

1. 顶级菜单是否被 `hidden` 过滤掉。
2. `menu_name` 是否为空（会回退为“未命名菜单”）。

---

## 9. 一句话总结

当前实现已经形成完整闭环：

- 后端按权限出菜单数据；
- 前端树化 + 递归渲染实现层级显示；
- 同数据源动态注入路由保障可访问；
- 刷新通过持久化和路由重建保证体验稳定。

如果要继续增强，下一步可加：

- 后端统一返回 `meta`（title/icon/hidden）减少前端适配；
- 菜单缓存版本号（避免旧菜单污染）；
- 面包屑、按钮级权限与菜单权限联动。
