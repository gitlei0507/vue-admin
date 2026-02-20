<template>
    <div class="p-4 bg-white rounded shadow">
        <div class="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded">
            <el-input v-model="searchForm.username" placeholder="姓名" class="!w-64"></el-input>
            <el-input v-model="searchForm.email" placeholder="邮箱" class="!w-64"></el-input>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
        </div>

        <div class="mb-4">
            <el-button type="success" @click="openAddDialog">新增</el-button>
        </div>

        <el-table :data="tableData" v-loading="loading" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="username" label="姓名" width="180" />
            <el-table-column prop="email" label="邮箱" width="200" />

            <el-table-column label="操作" width="150">
                <template #default="scope">
                    <el-button size="small" type="primary" @click="openEditDialog(scope.row)">
                        修改
                    </el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>


    <el-dialog v-model="dialogVisible" title="新增用户" width="600px" :close-on-click-modal="false">
        <el-form :model="userForm" ref="userFormRef" :rules="rules" label-width="80px">
            <el-form-item label="ID" prop="id" v-show="false">
                <el-input v-model="userForm.id" />
            </el-form-item>
            <el-form-item label="用户ID" prop="uid">
                <el-input v-model="userForm.uid" />
            </el-form-item>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="userForm.username" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="userForm.password" type="password" show-password />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="userForm.email" />
            </el-form-item>
            <el-form-item label="角色">
                <el-select v-model="userForm.role" placeholder="请选择角色">
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
    import { createUser, list, updateUser } from '@/api/user';
    import { useTable } from '@/composables/useTable';
    import { useUser } from '@/composables/useUser';
    import { reactive } from 'vue';

    const searchForm = reactive({
        username: '',
        email: ''
    })



    const { tableData, loading, handleSearch, resetSearch, handleDelete } = useTable(list, searchForm)
    const { dialogVisible, submitLoading, userForm, userFormRef, openAddDialog, openEditDialog, submitForm, rules } = useUser(createUser, updateUser, handleSearch)





</script>
