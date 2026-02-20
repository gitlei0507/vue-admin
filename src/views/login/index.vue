<template>
    <div class="h-screen flex items-center justify-center bg-gray-100">
        <el-card class="w-96 shadow-xl">
            <template #header>
                <h2 class="text-center text-xl font-bold">系统登录</h2>
            </template>
            <el-form :model="loginForm">
                <el-form-item>
                    <el-input v-model="loginForm.uid" placeholder="用户名">
                        <template #prefix>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="loginForm.password" type="password" placeholder="密码" show-password>
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-button type="primary" class="w-full" @click="handleLogin">登录</el-button>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
    import { useLogin } from '@/composables/useLogin';

    const { loginForm, handleLogin } = useLogin()



</script>