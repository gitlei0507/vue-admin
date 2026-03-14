<template>
    <div class="bg-white border-b px-4">
        <el-tabs v-model="activeTab" type="card" class="tags-tabs" @tab-click="handleTabClick"
            @tab-remove="handleTabRemove">
            <el-tab-pane v-for="tab in tabs" :key="tab.path" :label="tab.title" :name="tab.path"
                :closable="tab.closable" />
        </el-tabs>
    </div>
</template>

<script setup>
    import { computed, ref, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    const route = useRoute();
    const router = useRouter();

    // 首页标签固定保留，关闭标签时也作为兜底跳转目标
    const HOME_PATH = '/dashboard';
    const HOME_TITLE = '首页';

    const tabs = ref([]);

    const activeTab = computed({
        get: () => route.path,
        set: (val) => val
    });

    const createTab = (currentRoute) => ({
        path: currentRoute.path,
        // 标题优先取路由元信息，其次是路由名，最后回退为路径
        title: currentRoute.meta?.title || currentRoute.name || currentRoute.path,
        closable: currentRoute.path !== HOME_PATH
    });

    const ensureHomeTab = () => {
        const existed = tabs.value.some((tab) => tab.path === HOME_PATH);
        if (existed) {
            return;
        }

        const homeRoute = router.resolve(HOME_PATH);
        tabs.value.unshift(
            createTab({
                path: HOME_PATH,
                meta: { title: homeRoute.meta?.title || HOME_TITLE },
                name: homeRoute.name || HOME_TITLE
            })
        );
    };

    const addTabIfNotExists = (currentRoute) => {
        // 忽略无效路径与根路径，避免生成空白标签
        if (!currentRoute?.path || currentRoute.path === '/') {
            return;
        }

        // 同一路径只保留一个标签
        const existed = tabs.value.some((tab) => tab.path === currentRoute.path);
        if (!existed) {
            tabs.value.push(createTab(currentRoute));
        }
    };

    const handleTabClick = (tabPane) => {
        const targetPath = tabPane?.props?.name;
        if (targetPath && targetPath !== route.path) {
            router.push(targetPath);
        }
    };

    const handleTabRemove = (targetPath) => {
        const currentIndex = tabs.value.findIndex((tab) => tab.path === targetPath);
        if (currentIndex === -1) {
            return;
        }

        tabs.value.splice(currentIndex, 1);

        if (route.path !== targetPath) {
            return;
        }

        // 关闭当前激活标签后，优先跳转到右侧标签，没有则退到左侧，再兜底首页
        const nextTab = tabs.value[currentIndex] || tabs.value[currentIndex - 1];
        const fallbackPath = nextTab?.path || HOME_PATH;
        router.push(fallbackPath);
    };

    watch(
        () => route.path,
        () => {
            ensureHomeTab();
            // 路由变化时同步标签列表；immediate 确保首次加载时也创建当前标签
            addTabIfNotExists(route);
        },
        { immediate: true }
    );
</script>

<style scoped>
    :deep(.tags-tabs .el-tabs__header) {
        margin-bottom: 0;
    }

    :deep(.tags-tabs .el-tabs__nav-wrap::after) {
        height: 0;
    }
</style>
