<template>
    <el-header class="border-b flex items-center justify-between px-4 bg-white">
        <div class="text-gray-600">面包屑导航 (待实现)</div>
        <div class="flex items-center gap-2">
            <el-avatar :size="30" :src="userInfo.avatar" />
            <span class="text-sm">用户：{{ userInfo.username }}</span>
            <span class="text-sm">角色：{{ showRole }}</span>
            <el-button type="danger" @click="logout">注销</el-button>
        </div>
    </el-header>
</template>

<script setup>
    import { useMenus } from '@/composables/useMenus';

    const { userInfo, showRole, logout } = useMenus()
</script>

<style scoped></style>