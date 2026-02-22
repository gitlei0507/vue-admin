<template>
    <el-aside width="200px" class="bg-gray-800 text-white">
        <div class="p-4 text-center font-bold border-b border-gray-700">
            管理系统后台
        </div>
        <el-menu router active-text-color="#ffd04b" background-color="#1f2937" class="el-menu-vertical-demo border-none"
            :default-active="$route.path" text-color="#fff">
            <MenuItem v-for="menu in visibleMenus" :key="menu.path" :menu="menu" />
        </el-menu>
    </el-aside>
</template>

<script setup>
    import { useMenus } from '@/composables/useMenus';
    import { computed } from 'vue';
    import MenuItem from './MenuItem.vue';

    const { userInfo } = useMenus()

    // 从用户信息中获取菜单数据，过滤掉隐藏的菜单项
    const visibleMenus = computed(() => {
        return userInfo.value?.menus?.filter(menu => !menu.hidden) || []
    })
</script>

<style scoped></style>