<template>
    <div class="common-layout h-screen w-full">
        <el-container class="h-full">
            <el-aside width="200px" class="bg-gray-800 text-white">
                <div class="p-4 text-center font-bold border-b border-gray-700">
                    管理系统后台
                </div>
                <el-menu router active-text-color="#ffd04b" background-color="#1f2937"
                    class="el-menu-vertical-demo border-none" :default-active="$route.path" text-color="#fff">
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

            <el-container>
                <el-header class="border-b flex items-center justify-between px-4 bg-white">
                    <div class="text-gray-600">面包屑导航 (待实现)</div>
                    <div class="flex items-center gap-2">
                        <el-avatar :size="30" :src="userInfo.avatar" />
                        <span class="text-sm">{{ userInfo.username }}</span>
                        <el-button type="danger" @click="logout">注销</el-button>
                    </div>
                </el-header>

                <el-main class="bg-gray-50">
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>

    import { useUserStore } from '@/stores/user';
    import { useAuth } from '@/utils/auth';
    import { storeToRefs } from 'pinia';
    import { useRouter } from 'vue-router';

    const userStore = useUserStore()
    const { userInfo } = storeToRefs(userStore)
    const { removeUserInfo } = userStore
    const { removeToken } = useAuth()
    const router = useRouter()

    // 注销
    function logout() {
        ElMessageBox.confirm(
            `你确定要注销吗？`,
            '警告',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            // 移除 token
            removeToken()
            // 移除 pinia 中用户信息
            removeUserInfo()
            // 跳转到登录页
            router.push('/login')
        }).catch(() => {
            // 点击取消
        })
    }


</script>