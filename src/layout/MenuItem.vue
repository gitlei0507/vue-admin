<template>
    <el-sub-menu v-if="hasChildren" :index="menu.path">
        <template #title>
            <el-icon>
                <component :is="menuIcon" />
            </el-icon>
            <span>{{ menuTitle }}</span>
        </template>

        <MenuItem v-for="child in menu.children" :key="child.path" :menu="child" />
    </el-sub-menu>

    <el-menu-item v-else :index="menu.path">
        <el-icon>
            <component :is="menuIcon" />
        </el-icon>
        <span>{{ menuTitle }}</span>
    </el-menu-item>
</template>

<script setup>
    import { getMenuIcon } from '@/router/dynamic-routes';
    import { computed } from 'vue';

    const props = defineProps({
        menu: {
            type: Object,
            required: true
        }
    })


    // 通过 children 长度判断当前节点是否为父级菜单
    const hasChildren = computed(() => Array.isArray(props.menu.children) && props.menu.children.length > 0)
    // 菜单标题优先使用后端字段 menu_name，缺失时显示兜底文案
    const menuTitle = computed(() => props.menu?.menu_name || '未命名菜单')
    // 图标优先取 meta.icon，再回退 icon，并映射为可渲染的图标组件
    const menuIcon = computed(() => getMenuIcon(props.menu?.meta?.icon || props.menu?.icon))
</script>
