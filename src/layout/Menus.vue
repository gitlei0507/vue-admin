<template>
    <el-aside width="200px" class="bg-gray-800 text-white">
        <div class="p-4 text-center font-bold border-b border-gray-700">
            管理系统后台
        </div>
        <el-menu router active-text-color="#ffd04b" background-color="#1f2937" class="el-menu-vertical-demo border-none"
            :default-active="$route.path" text-color="#fff">
            <el-menu-item v-for="menu in userInfo.menus" :index="menu.path">
                <el-icon>
                    <component :is="menu.icon" />
                </el-icon>
                <span>{{ menu.menu_name }}</span>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>

<script setup>
    import { useMenus } from '@/composables/useMenus';

    const { userInfo } = useMenus()


</script>

<style scoped></style>