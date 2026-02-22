<template>
    <div class="user-list-container">
        <!-- 搜索栏 -->
        <el-card class="search-card" shadow="never">
            <el-form :inline="true" :model="searchForm" class="search-form">
                <el-form-item label="姓名">
                    <el-input v-model="searchForm.username" placeholder="请输入姓名" clearable class="!w-48" />
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="searchForm.email" placeholder="请输入邮箱" clearable class="!w-48" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch" :icon="Search">查询</el-button>
                    <el-button @click="resetSearch" :icon="Refresh">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 表格区域 -->
        <el-card class="table-card" shadow="never">
            <!-- 操作栏 -->
            <div class="toolbar">
                <el-button type="primary" @click="openAddDialog" :icon="Plus">新增</el-button>
            </div>

            <!-- 数据表格容器 -->
            <div class="table-wrapper">
                <el-table :data="tableData" v-loading="loading" stripe border style="width: 100%" height="100%">
                    <el-table-column type="index" label="序号" width="70" align="center"
                        :index="(index) => (currentPage - 1) * pageSize + index + 1" />
                    <el-table-column prop="username" label="姓名" width="200" align="center" />
                    <el-table-column prop="email" label="邮箱" min-width="200" show-overflow-tooltip align="center" />
                    <el-table-column label="角色" min-width="200" align="center">
                        <template #default="scope">
                            <el-tag v-if="scope.row.role === '1'" type="danger" effect="dark">管理员</el-tag>
                            <el-tag v-else-if="scope.row.role === '2'" type="success" effect="dark">普通用户</el-tag>
                            <span v-else>{{ scope.row.role }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="240" align="center" fixed="right">
                        <template #default="scope">
                            <el-button link type="info" size="small" @click="openViewDialog(scope.row)" :icon="View">
                                查看
                            </el-button>
                            <el-button link type="primary" size="small" @click="openEditDialog(scope.row)" :icon="Edit">
                                编辑
                            </el-button>
                            <el-button link type="danger" size="small" @click="handleDelete(scope.$index, scope.row)"
                                :icon="Delete">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 分页栏区域 -->
            <div class="pagination-container">
                <div class="pagination-wrapper">
                    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                        :page-sizes="[5, 10, 20, 50]" background layout="total, sizes, prev, pager, next, jumper"
                        :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" />
                </div>
            </div>
        </el-card>
    </div>


    <!-- 用户表单弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isView ? '查看用户' : (isEdit ? '编辑用户' : '新增用户')" width="560px"
        :close-on-click-modal="false" :destroy-on-close="true" draggable>
        <el-form :model="userForm" ref="userFormRef" :rules="rules" label-width="90px" class="user-form">
            <el-form-item label="ID" prop="id" v-show="false">
                <el-input v-model="userForm.id" />
            </el-form-item>

            <el-form-item label="用户ID" prop="uid">
                <el-input v-model="userForm.uid" placeholder="请输入用户ID" :readonly="isView" clearable size="large">
                    <template #prefix>
                        <el-icon>
                            <User />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item label="用户名" prop="username">
                <el-input v-model="userForm.username" placeholder="请输入用户名" :readonly="isView" clearable size="large">
                    <template #prefix>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input v-model="userForm.password" type="password" placeholder="请输入密码" :readonly="isView"
                    show-password clearable size="large">
                    <template #prefix>
                        <el-icon>
                            <Lock />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input v-model="userForm.email" placeholder="请输入邮箱地址" :readonly="isView" clearable size="large">
                    <template #prefix>
                        <el-icon>
                            <Message />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item label="角色" prop="role">
                <el-select v-model="userForm.role" placeholder="请选择角色" :disabled="isView" style="width: 100%"
                    size="large">
                    <template #prefix>
                        <el-icon>
                            <Avatar />
                        </el-icon>
                    </template>
                    <el-option label="管理员" value="1">
                        <el-icon style="vertical-align: middle; margin-right: 8px;">
                            <Star />
                        </el-icon>
                        <span>管理员</span>
                    </el-option>
                    <el-option label="普通用户" value="2">
                        <el-icon style="vertical-align: middle; margin-right: 8px;">
                            <User />
                        </el-icon>
                        <span>普通用户</span>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false" size="large" v-if="isView">
                    关闭
                </el-button>
                <template v-else>
                    <el-button @click="dialogVisible = false" size="large">
                        取消
                    </el-button>
                    <el-button type="primary" @click="submitForm" :loading="submitLoading" size="large">
                        {{ submitLoading ? '提交中...' : '确定' }}
                    </el-button>
                </template>
            </div>
        </template>
    </el-dialog>

</template>

<script setup>
    import { createUser, deleteUser, list, updateUser } from '@/api/user';
    import { useTable } from '@/composables/useTable';
    import { useUser } from '@/composables/useUser';
    import { Avatar, Delete, Edit, Lock, Message, Plus, Refresh, Search, Star, User, UserFilled, View } from '@element-plus/icons-vue';
    import { reactive } from 'vue';

    const searchForm = reactive({
        username: '',
        email: ''
    })



    const {
        tableData,
        loading,
        currentPage,
        pageSize,
        total,
        handleSearch,
        resetSearch,
        handleDelete,
        handleCurrentChange,
        handleSizeChange
    } = useTable(list, searchForm, deleteUser)

    const {
        dialogVisible,
        submitLoading,
        userForm,
        userFormRef,
        isEdit,
        isView,
        openAddDialog,
        openEditDialog,
        openViewDialog,
        submitForm,
        rules
    } = useUser(createUser, updateUser, handleSearch)

</script>

<style scoped>
    .user-list-container {
        padding: 20px;
        background-color: #f0f2f5;
        height: calc(100vh - 120px);
        display: flex;
        flex-direction: column;
    }

    .search-card {
        margin-bottom: 16px;
        border-radius: 8px;
        flex-shrink: 0;
    }

    .search-form {
        margin-bottom: 0;
    }

    .table-card {
        border-radius: 8px;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .table-card :deep(.el-card__body) {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }

    .toolbar {
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
    }

    .table-wrapper {
        flex: 1;
        overflow: hidden;
        min-height: 0;
    }

    .pagination-container {
        margin-top: 20px;
        padding-top: 20px;
        display: flex;
        justify-content: flex-end;
        flex-shrink: 0;
        border-top: 1px solid #f0f0f0;
    }

    .pagination-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .page-jump-btn {
        font-weight: bold;
        min-width: 40px;
    }

    :deep(.el-card__body) {
        padding: 20px;
    }

    :deep(.el-table) {
        font-size: 14px;
    }

    :deep(.el-table th.el-table__cell) {
        background-color: #fafafa;
        color: #333;
        font-weight: 600;
    }

    :deep(.el-button + .el-button) {
        margin-left: 8px;
    }

    /* 弹窗样式 */
    .user-form {
        padding: 10px 20px 0;
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }

    :deep(.el-dialog__header) {
        padding: 20px 20px 15px;
        border-bottom: 1px solid #f0f0f0;
        margin-right: 0;
    }

    :deep(.el-dialog__body) {
        padding: 20px 20px 10px;
    }

    :deep(.el-dialog__footer) {
        padding: 15px 20px 20px;
        border-top: 1px solid #f0f0f0;
    }

    :deep(.el-form-item) {
        margin-bottom: 22px;
    }

    :deep(.el-input__prefix) {
        display: flex;
        align-items: center;
    }

    :deep(.el-select .el-input__prefix) {
        left: 8px;
    }

    /* 只读模式样式 */
    :deep(.el-input[readonly] .el-input__wrapper) {
        background-color: #f5f7fa;
        box-shadow: 0 0 0 1px #e4e7ed inset;
        cursor: default;
    }

    :deep(.el-input[readonly] .el-input__inner) {
        color: #606266;
        cursor: default;
    }

    :deep(.el-select.is-disabled .el-input__wrapper) {
        background-color: #f5f7fa;
        box-shadow: 0 0 0 1px #e4e7ed inset;
        cursor: default;
    }

    /* 禁用 el-tag 过渡动画 */
    :deep(.el-tag) {
        transition: none !important;
        min-width: 80px;
        justify-content: center;
    }
</style>
