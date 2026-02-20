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
                <el-button type="primary" @click="openAddDialog" :icon="Plus">新增用户</el-button>
            </div>

            <!-- 数据表格 -->
            <el-table :data="tableData" v-loading="loading" stripe border style="width: 100%">
                <el-table-column type="index" label="序号" width="70" align="center"
                    :index="(index) => (currentPage - 1) * pageSize + index + 1" />
                <el-table-column prop="username" label="姓名" width="150" align="center" />
                <el-table-column prop="email" label="邮箱" min-width="200" show-overflow-tooltip />

                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template #default="scope">
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

            <!-- 分页 -->
            <div class="pagination-container">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[5, 10, 20, 50]" background layout="total, sizes, prev, pager, next, jumper"
                    :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" />
            </div>
        </el-card>
    </div>


    <!-- 用户表单弹窗 --> <!-- 用户表单弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '新增用户'" width="600px" :close-on-click-modal="false">
        <el-form :model="userForm" ref="userFormRef" :rules="rules" label-width="90px">
            <el-form-item label="ID" prop="id" v-show="false">
                <el-input v-model="userForm.id" />
            </el-form-item>
            <el-form-item label="用户ID" prop="uid">
                <el-input v-model="userForm.uid" placeholder="请输入用户ID" clearable />
            </el-form-item>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="userForm.username" placeholder="请输入用户名" clearable />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="userForm.password" type="password" placeholder="请输入密码" show-password clearable />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="userForm.email" placeholder="请输入邮箱" clearable />
            </el-form-item>
            <el-form-item label="角色" prop="role">
                <el-select v-model="userForm.role" placeholder="请选择角色" style="width: 100%">
                    <el-option label="管理员" value="admin" />
                    <el-option label="普通用户" value="user" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button>
        </template>
    </el-dialog>

</template>

<script setup>
    import { createUser, deleteUser, list, updateUser } from '@/api/user';
    import { useTable } from '@/composables/useTable';
    import { useUser } from '@/composables/useUser';
    import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue';
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
        openAddDialog,
        openEditDialog,
        submitForm,
        rules
    } = useUser(createUser, updateUser, handleSearch)





</script>

<style scoped>
    .user-list-container {
        padding: 20px;
        background-color: #f0f2f5;
        min-height: calc(100vh - 120px);
    }

    .search-card {
        margin-bottom: 16px;
        border-radius: 8px;
    }

    .search-form {
        margin-bottom: 0;
    }

    .table-card {
        border-radius: 8px;
    }

    .toolbar {
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .pagination-container {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
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
</style>
