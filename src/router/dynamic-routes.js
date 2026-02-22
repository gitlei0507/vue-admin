/**
 * 动态路由配置模块
 * 用于根据后台返回的菜单数据动态生成和注册路由
 */

// 导入 Element Plus 所有图标组件，用于菜单图标的动态渲染
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

/**
 * 使用 Vite 的 glob 导入功能，批量导入 views 目录下的所有 .vue 组件
 * import.meta.glob 返回一个对象，key 是文件路径，value 是动态导入函数
 * 例如: { '/src/views/user/list.vue': () => import('/src/views/user/list.vue') }
 */
const viewModules = import.meta.glob('@/views/**/*.vue')


// 打印 viewModules 的所有 key，方便调试
console.log('[dynamic-route] 可用的组件路径:', Object.keys(viewModules))

/**
 * 规范化视图路径
 * @param {string} viewPath - 原始路径，如 'user/list' 或 '/user/list.vue'
 * @returns {string} - 规范化后的路径，如 'user/list.vue'
 * 
 * 功能：
 * 1. 去除路径开头的斜杠
 * 2. 如果路径没有 .vue 后缀，则自动添加
 */
const normalizeViewPath = (viewPath = '') => {
    // 使用正则表达式去除路径开头的所有斜杠
    const trimmed = viewPath.replace(/^\/+/, '')
    // 如果路径已有 .vue 后缀则直接返回，否则添加 .vue 后缀
    return trimmed.endsWith('.vue') ? trimmed : `${trimmed}.vue`
}

/**
 * 解析并获取组件的动态导入函数
 * @param {string} viewPath - 组件路径，如 'user/list'
 * @returns {Function|undefined} - 返回组件的动态导入函数，如果未找到则返回 undefined
 * 
 * 示例：
 * resolveComponent('user/list') 返回 () => import('@/views/user/list.vue')
 */
const resolveComponent = (viewPath) => {
    // 规范化路径为标准格式
    const normalized = normalizeViewPath(viewPath)
    // 构建完整的模块路径 key
    const key = `/src/views/${normalized}`

    console.log(`[dynamic-route] 尝试加载组件: ${viewPath} -> ${key}`)

    // 从 viewModules 对象中获取对应的动态导入函数
    const component = viewModules[key]

    if (!component) {
        console.warn(`[dynamic-route] viewModules 中不存在该路径: ${key}`)
    }

    return component
}

/**
 * 将单个菜单项转换为路由配置对象
 * @param {Object} menu - 菜单数据对象
 * @param {string} menu.path - 菜单路径
 * @param {string} menu.component - 组件路径
 * @param {string} [menu.name] - 路由名称
 * @param {string} [menu.title] - 菜单标题
 * @param {string} [menu.icon] - 菜单图标
 * @param {Array} [menu.children] - 子菜单数组
 * @param {Object} [menu.meta] - 元信息对象
 * @param {string} [parentPath=''] - 父级路径，用于拼接完整路径
 * @returns {Object|null} - 返回路由配置对象，如果验证失败则返回 null
 * 
 * 路由配置对象结构：
 * {
 *   path: 'user/list',           // 路由路径
 *   name: 'user_list',            // 路由名称（唯一标识）
 *   component: () => import(),    // 组件动态导入函数
 *   meta: {                       // 路由元信息
 *     title: '用户列表',          // 页面标题
 *     icon: 'User',               // 图标名称
 *     hidden: false               // 是否在菜单中隐藏
 *   },
 *   children: []                  // 子路由数组（如果有）
 * }
 */
const mapMenuToRoute = (menu, parentPath = '') => {
    // 验证菜单数据：必须同时存在 path 和 component 属性
    if (!menu?.path || !menu?.component) {
        return null
    }

    // 根据组件路径解析组件的动态导入函数
    const component = resolveComponent(menu.component)
    if (!component) {
        // 如果组件不存在，打印警告信息并返回 null
        console.warn(`[dynamic-route] 未找到组件: ${menu.component}`)
        return null
    }

    // 构建完整路径：如果菜单路径以 / 开头则直接使用，否则拼接父路径
    // 使用正则表达式将多个连续斜杠替换为单个斜杠
    const fullPath = menu.path.startsWith('/') ? menu.path : `${parentPath}/${menu.path}`.replace(/\/+/g, '/')

    // 去除路径开头的斜杠，得到最终的路由路径
    const routePath = fullPath.replace(/^\//, '')

    // 构建路由配置对象
    const route = {
        path: routePath,
        // 路由名称：优先使用 menu.name，否则使用路径（斜杠替换为下划线）
        name: menu.name || routePath.replace(/\//g, '_'),
        // 组件动态导入函数
        component,
        // 路由元信息
        meta: {
            // 标题：优先级 meta.title > title > name > routePath
            title: menu.meta?.title || menu.title || menu.name || routePath,
            // 图标：优先级 meta.icon > icon，默认为空字符串
            icon: menu.meta?.icon || menu.icon || '',
            // 是否隐藏：转换为布尔值
            hidden: Boolean(menu.meta?.hidden || menu.hidden)
        }
    }

    // 递归处理子菜单：如果存在子菜单数组且不为空
    if (Array.isArray(menu.children) && menu.children.length > 0) {
        route.children = menu.children
            // 递归调用 mapMenuToRoute，传入当前完整路径作为父路径
            .map((child) => mapMenuToRoute(child, fullPath))
            // 过滤掉返回值为 null 的项（验证失败的菜单）
            .filter(Boolean)
    }

    return route
}

/**
 * 将菜单数组批量转换为路由配置数组
 * @param {Array} menus - 菜单数据数组，默认为空数组
 * @returns {Array} - 返回路由配置对象数组
 * 
 * 示例：
 * menus = [
 *   { path: '/dashboard', component: 'dashboard/index', name: '首页', icon: 'House' },
 *   { path: '/user', component: 'user/list', name: '用户管理', icon: 'User' }
 * ]
 * 
 * 返回：
 * [
 *   { path: 'dashboard', name: 'dashboard', component: ..., meta: {...} },
 *   { path: 'user', name: 'user', component: ..., meta: {...} }
 * ]
 */
export const buildRoutesFromMenus = (menus = []) => {
    return menus.map((menu) => mapMenuToRoute(menu)).filter(Boolean)
}

/**
 * 根据图标名称获取对应的 Element Plus 图标组件
 * @param {string} iconName - 图标名称，如 'User'、'House' 等
 * @returns {Component} - 返回图标组件，如果未找到则返回默认的 Menu 图标
 * 
 * 使用示例：
 * const UserIcon = getMenuIcon('User')
 * <component :is="UserIcon" />
 */
export const getMenuIcon = (iconName) => {
    return ElementPlusIconsVue[iconName] || ElementPlusIconsVue.Menu
}

/**
 * 初始化动态路由
 * 根据菜单数据生成路由配置，并动态注册到路由实例中
 * 
 * @param {Router} router - Vue Router 实例
 * @param {Array} menus - 菜单数据数组，默认为空数组
 * @returns {Array} - 返回生成的路由配置数组
 * 
 * 功能说明：
 * 1. 将菜单数据转换为路由配置
 * 2. 遍历路由配置，动态注册到 router 实例中
 * 3. 所有动态路由都作为 'layout' 路由的子路由注册
 * 4. 使用 hasRoute 避免重复注册相同名称的路由
 * 
 * 注意：
 * - 需要在路由配置中预先定义名为 'layout' 的父路由
 * - 动态添加的路由在页面刷新后会丢失，需要配合路由守卫重新注册
 */
export const initDynamicRoutes = (router, menus = []) => {
    // 将菜单数据转换为路由配置数组
    const routes = buildRoutesFromMenus(menus)

    // 遍历路由配置数组，逐个动态注册路由
    routes.forEach((route) => {
        // 检查路由是否已存在，避免重复注册
        if (!router.hasRoute(route.name)) {
            // 将路由作为 'layout' 的子路由添加到路由实例中
            router.addRoute('layout', route)
        }
    })

    // 返回生成的路由配置数组，便于调试和后续使用
    return routes
}
