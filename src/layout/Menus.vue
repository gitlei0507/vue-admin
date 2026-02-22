<template>
    <el-aside width="200px" class="bg-gray-800 text-white">
        <div class="p-4 text-center font-bold border-b border-gray-700">
            管理系统后台
        </div>
        <el-menu router active-text-color="#ffd04b" background-color="#1f2937" class="el-menu-vertical-demo border-none"
            :default-active="$route.path" text-color="#fff">
            <el-menu-item index="/dashboard">
                <el-icon>
                    <House />
                </el-icon>
                <span>首页</span>
            </el-menu-item>
            <el-menu-item index="/user/list">
                <el-icon>
                    <User />
                </el-icon>
                <span>用户管理</span>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>

<script setup>
    import { House, User } from '@element-plus/icons-vue';
</script>

<style scoped></style>