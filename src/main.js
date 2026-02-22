/**
 * 应用入口文件
 * 负责初始化 Vue 应用并配置全局插件和组件
 */

// 导入路由实例
import router from '@/router';
// 导入 Pinia 状态管理库
import { createPinia } from 'pinia';
// 导入 Pinia 持久化
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
// 导入 Vue 核心方法
import { createApp } from 'vue';
// 导入根组件
import App from './App.vue';


// 引入 Tailwind CSS 样式
import './assets/main.css';

// 引入 Element Plus 样式
import 'element-plus/dist/index.css';

// 导入 Element Plus 所有图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 导入 Element Plus 中文语言包
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

// 导入动态路由初始化函数
import { initDynamicRoutes } from '@/router/dynamic-routes';
// 导入用户 Store
import { useUserStore } from '@/stores/user';

// 创建 Vue 应用实例
const app = createApp(App)

// 全局注册所有 Element Plus 图标组件
// 注册后可以在任何组件中直接使用，如 <el-icon><Edit /></el-icon>
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 使用 Element Plus 并配置中文语言包
app.use(ElementPlus, { locale: zhCn })
// 使用 Pinia 状态管理
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// 在挂载应用前预加载动态路由
const userStore = useUserStore()
const menus = userStore.userInfo?.menus || []
if (menus.length > 0) {
    console.log('[main] 预加载动态路由...')
    initDynamicRoutes(router, menus)
    userStore.setHasLoadedAsyncRoutes(true)
}

// 使用路由
app.use(router)
// 将应用挂载到 #app 元素上
app.mount('#app')