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


    const hasChildren = computed(() => Array.isArray(props.menu.children) && props.menu.children.length > 0)
    const menuTitle = computed(() => props.menu?.menu_name || '未命名菜单')
    const menuIcon = computed(() => getMenuIcon(props.menu?.meta?.icon || props.menu?.icon))
</script>
