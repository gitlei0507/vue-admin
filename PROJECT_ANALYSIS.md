# 项目分析（vue-admin）

## 1. 技术栈与构建体系
- 框架：Vue 3（`script setup` 语法）+ Vue Router 4 + Pinia。
- UI 与样式：Element Plus + Tailwind CSS。
- 请求层：Axios，带统一请求/响应拦截。
- 构建工具：Vite 7，结合 `unplugin-auto-import` 与 `unplugin-vue-components` 自动按需导入 Element Plus 组件与 API。
- 运行环境：Node `^20.19.0 || >=22.12.0`。

## 2. 目录结构与职责
- `src/main.js`：应用入口，注册路由、Pinia、Element Plus 图标并挂载应用。
- `src/router/index.js`：路由表定义 + 全局前置守卫（基于 token 的登录校验）。
- `src/layout/index.vue`：后台整体骨架（侧边栏、顶部栏、内容区）和注销动作。
- `src/views/login/index.vue` + `src/composables/useLogin.js`：登录页面与登录流程逻辑。
- `src/views/user/list.vue` + `src/composables/useTable.js`：用户列表、筛选、删除逻辑。
- `src/utils/request.js`：Axios 实例与拦截器。
- `src/utils/auth.js`：token 的持久化封装（基于 VueUse `useStorage`）。

## 3. 核心业务流
1. **未登录访问保护路由**
   - 路由守卫检测本地 token，若不存在则跳转 `/login`。
2. **登录流程**
   - 登录页收集 `uid/password`，调用 `/api/user/login`。
   - 成功后写入 token，并将用户信息写入 Pinia，随后跳转首页。
3. **列表页流程**
   - 页面挂载时通过 `useTable` 自动加载数据。
   - 查询调用同一 API；重置会清空筛选条件后再次请求。
   - 删除仅做前端列表移除（当前未对接后端删除 API）。
4. **注销流程**
   - 清除 token + 清空 Pinia 用户信息，回到登录页。

## 4. 工程亮点
- 采用 `composables` 抽离登录与表格通用逻辑，可复用性较好。
- 请求层统一拦截，避免业务组件重复处理 token 与错误提示。
- Vite 自动导入减少模板/脚本中的重复 import。

## 5. 当前问题与风险点
1. **页面存在运行时错误风险**
   - `src/views/user/list.vue` 模板中按钮绑定了 `submitForm`，但脚本中未定义该函数。
2. **用户信息状态不一致风险**
   - `removeUserInfo()` 将 `userInfo` 置为 `null`，但布局页直接使用 `userInfo.avatar/username`，在严格场景下可能出现空值访问问题。
3. **登录态恢复不完整**
   - 刷新后 token 在本地可恢复，但 Pinia 的用户资料未自动回填，顶部用户信息可能为空。
4. **鉴权策略较基础**
   - 仅按“是否有 token”判断，不校验过期、无角色权限控制、无白名单策略配置。
5. **API 约定耦合较紧**
   - 响应拦截器以 HTTP `status===200` 为成功标准，若后端采用 `code` 字段语义需额外兼容。

## 6. 建议的优化路线（优先级）
- P0：补齐 `submitForm` 实现或移除无效绑定，消除明显运行时错误。
- P1：在应用启动时增加“根据 token 拉取用户信息”或从本地恢复用户简档，保证刷新后状态一致。
- P1：增强路由守卫（token 过期处理、白名单、基于角色的动态路由）。
- P2：统一接口响应协议（如 `{ code, data, message }`），在请求层做标准化转换。
- P2：将“删除”改为真实后端接口并补充失败回滚与二次确认文案。

## 7. 结论
该项目已经具备典型中后台前端的基础骨架（登录、鉴权、布局、列表与通用请求封装），结构清晰，适合作为小型后台系统起步模板。下一步重点应放在**修复显式缺陷**与**补强登录态/权限链路**，以提高稳定性和可维护性。
