<template>
    <div class="common-layout h-screen w-full">
        <el-container class="h-full">
            <!-- 菜单组件 -->
            <Menus></Menus>

            <!-- 右侧容器：包含导航和主体 -->
            <el-container direction="vertical">
                <!-- 导航组件 -->
                <Nav></Nav>

                <!-- 主体部分 -->
                <el-main class="bg-gray-50">
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
    import Menus from './Menus.vue';
    import Nav from './Nav.vue';
</script>