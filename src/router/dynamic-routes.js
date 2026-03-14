// 根据菜单数据动态生成并注册路由
import { flattenMenus } from '@/utils/menu';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 扫描 views 下所有页面组件，按路径匹配菜单配置
const viewModules = import.meta.glob('@/views/**/*.vue')


// 调试：输出可用组件路径
console.log('[dynamic-route] 可用的组件路径:', Object.keys(viewModules))

// 规范化视图路径，统一为 xxx/yyy.vue
const normalizeViewPath = (viewPath = '') => {
    const trimmed = viewPath.replace(/^\/+/, '')
    return trimmed.endsWith('.vue') ? trimmed : `${trimmed}.vue`
}

// 解析菜单组件路径到动态导入函数
const resolveComponent = (viewPath) => {
    const normalized = normalizeViewPath(viewPath)
    const key = `/src/views/${normalized}`

    console.log(`[dynamic-route] 尝试加载组件: ${viewPath} -> ${key}`)

    const component = viewModules[key]

    if (!component) {
        console.warn(`[dynamic-route] viewModules 中不存在该路径: ${key}`)
    }

    return component
}

// 菜单项转路由，递归处理 children
const mapMenuToRoute = (menu, parentPath = '') => {
    // path 或 component 缺失时跳过
    if (!menu?.path || !menu?.component) {
        return null
    }

    const component = resolveComponent(menu.component)
    if (!component) {
        console.warn(`[dynamic-route] 未找到组件: ${menu.component}`)
        return null
    }

    // 拼接完整路径并合并多余斜杠
    const fullPath = menu.path.startsWith('/') ? menu.path : `${parentPath}/${menu.path}`.replace(/\/+/g, '/')


    const routePath = fullPath.replace(/^\//, '')

    const route = {
        path: routePath,
        name: menu.name || routePath.replace(/\//g, '_'),
        component,
        meta: {
            title: menu.meta?.title || menu.menu_name || menu.title || menu.name || routePath,
            icon: menu.meta?.icon || menu.icon || '',
            hidden: Boolean(menu.meta?.hidden || menu.hidden)
        }
    }

    // 递归生成子路由，并过滤无效项
    if (Array.isArray(menu.children) && menu.children.length > 0) {
        route.children = menu.children
            .map((child) => mapMenuToRoute(child, fullPath))
            .filter(Boolean)
    }

    return route
}

export const buildRoutesFromMenus = (menus = []) => {
    // 先拍平菜单树，再映射为路由
    return flattenMenus(menus).map((menu) => mapMenuToRoute(menu)).filter(Boolean)
}

// 根据图标名获取组件，未命中时使用默认图标
export const getMenuIcon = (iconName) => {
    return ElementPlusIconsVue[iconName] || ElementPlusIconsVue.Menu
}

// 初始化动态路由：挂载到 layout 子路由，并避免重复注册
export const initDynamicRoutes = (router, menus = []) => {
    const routes = buildRoutesFromMenus(menus)

    routes.forEach((route) => {
        if (!router.hasRoute(route.name)) {
            router.addRoute('layout', route)
        }
    })

    return routes
}
