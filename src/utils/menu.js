/**
 * 菜单处理工具
 */

/**
 * 将扁平菜单列表转换为树形结构
 * @param {Array} menus
 * @returns {Array}
 */
export const buildMenuTree = (menus = []) => {
    if (!Array.isArray(menus) || menus.length === 0) {
        return []
    }

    const flatMenus = []
    const collectMenus = (items) => {
        items.forEach((menu) => {
            if (!menu || typeof menu !== 'object') {
                return
            }
            flatMenus.push(menu)
            if (Array.isArray(menu.children) && menu.children.length > 0) {
                collectMenus(menu.children)
            }
        })
    }

    collectMenus(menus)

    const menuMap = new Map()

    flatMenus.forEach((menu) => {
        if (!menu || typeof menu !== 'object') {
            return
        }
        menuMap.set(menu.id, { ...menu, children: [] })
    })

    const roots = []

    menuMap.forEach((menu) => {
        const parentId = Number(menu.parent_id)
        const parent = menuMap.get(parentId)

        if (parentId > 0 && parent) {
            parent.children.push(menu)
            return
        }

        roots.push(menu)
    })

    const sortMenus = (items) => {
        items.sort((a, b) => (a.sort_no ?? 0) - (b.sort_no ?? 0))
        items.forEach((item) => {
            if (item.children.length > 0) {
                sortMenus(item.children)
            }
        })
    }

    sortMenus(roots)
    return roots
}

/**
 * 将树形菜单拍平为一维数组
 * @param {Array} menus
 * @returns {Array}
 */
export const flattenMenus = (menus = []) => {
    if (!Array.isArray(menus)) {
        return []
    }

    const result = []

    const traverse = (items) => {
        items.forEach((item) => {
            if (!item || typeof item !== 'object') {
                return
            }
            const { children, ...rest } = item
            result.push(rest)
            if (Array.isArray(children) && children.length > 0) {
                traverse(children)
            }
        })
    }

    traverse(menus)
    return result
}

/**
 * 获取第一个可用菜单路径
 * @param {Array} menus
 * @returns {string}
 */
export const getFirstMenuPath = (menus = []) => {
    const first = flattenMenus(menus).find((menu) => typeof menu.path === 'string' && menu.path)
    return first?.path || '/dashboard'
}