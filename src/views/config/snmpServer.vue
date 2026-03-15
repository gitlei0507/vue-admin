<template>
    <div class="user-list-container">
        <!-- 搜索栏 -->
        <el-card class="search-card" shadow="never">
            <el-form :inline="true" :model="searchForm" class="search-form">
                <el-form-item label="服务器IP">
                    <el-input v-model="searchForm.serverip" placeholder="请输入服务器IP" clearable class="!w-48" />
                </el-form-item>
                <el-form-item label="服务器名称">
                    <el-input v-model="searchForm.servername" placeholder="请输入服务器名称" clearable class="!w-48" />
                </el-form-item>
                <el-form-item label="版本">
                    <el-input v-model="searchForm.ver" placeholder="请输入版本" clearable class="!w-48" />
                </el-form-item>
                <el-form-item label="是否启用">
                    <el-select v-model="searchForm.enable" placeholder="请选择是否启用" clearable class="!w-48">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
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
                <el-button type="warning" @click="handleToolbarEdit" :icon="Edit">编辑</el-button>
                <el-button type="danger" @click="handleToolbarDelete" :icon="Delete">删除</el-button>
            </div>

            <!-- 数据列表容器 -->
            <div class="table-wrapper">
                <el-table :data="tableData" v-loading="loading" stripe border style="width: 100%" height="100%"
                    :default-sort="{ prop: 'serverip', order: 'ascending' }" @sort-change="handleSortChange"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="index" label="" width="70" align="center"
                        :index="(index) => (currentPage - 1) * pageSize + index + 1" />
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="servername" label="服务器名称" width="200" align="center" sortable="custom" />
                    <el-table-column prop="serverip" label="服务器IP" min-width="200" show-overflow-tooltip align="center"
                        sortable="custom" />
                    <el-table-column prop="ver" label="版本" min-width="200" align="center"
                        sortable="custom"></el-table-column>
                    <el-table-column prop="enable" label="启用" min-width="100" align="center" sortable="custom">
                        <template #default="scope">
                            <el-tag v-if="scope.row.enable === '0'" type="danger" effect="dark">停用</el-tag>
                            <el-tag v-else-if="scope.row.enable === '1'" type="success" effect="dark">启用</el-tag>
                            <span v-else>{{ scope.row.enable }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="memo" label="备注" min-width="300" align="center"
                        sortable="custom"></el-table-column>
                    <el-table-column prop="ctuser" label="创建人" min-width="200" align="center"
                        sortable="custom"></el-table-column>
                    <el-table-column prop="cttime" label="创建时间" min-width="200" align="center"
                        sortable="custom"></el-table-column>
                    <el-table-column prop="upuser" label="更新人" min-width="200" align="center"
                        sortable="custom"></el-table-column>
                    <el-table-column prop="uptime" label="更新时间" min-width="200" align="center"
                        sortable="custom"></el-table-column>

                    <el-table-column label="操作" width="240" align="center" fixed="right">
                        <template #default="scope">
                            <el-button link type="info" size="small" @click="openViewDialog(scope.row)" :icon="View">
                                查看
                            </el-button>
                            <el-button link type="primary" size="small" @click="openEditDialog(scope.row)" :icon="Edit">
                                编辑
                            </el-button>
                            <el-button link type="danger" size="small" @click="handleDelete(scope.$index, scope.row, {
                                nameField: 'servername',
                                confirmText: '确认要删除SNMP服务器'
                            }, deleteSnmpServer)" :icon="Delete">
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


    <!-- snmp服务器表单弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isView ? 'SNMP服务器配置-查看' : (isEdit ? 'SNMP服务器配置-编辑' : 'SNMP服务器配置-新增')"
        width="800px" :close-on-click-modal="false" :destroy-on-close="true" draggable>
        <el-form :model="snmpServerForm" ref="snmpServerFormRef" :rules="rules" label-width="120px" class="user-form">
            <el-form-item label="servercode" prop="servercode" v-show="false">
                <el-input v-model="snmpServerForm.servercode" />
            </el-form-item>

            <el-form-item label="SNMP版本" prop="ver">
                <el-select v-model="snmpServerForm.ver" placeholder="请选择SNMP版本" :disabled="isView || isEdit"
                    style="width: 100%" size="large">
                    <el-option label="v2c" value="v2c">
                    </el-option>
                    <el-option label="v3" value="v3">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="服务器名称" prop="servername">
                <el-input v-model="snmpServerForm.servername" placeholder="请输入服务器名称" :readonly="isView" clearable
                    size="large">
                </el-input>
            </el-form-item>
            <el-form-item label="服务器IP" prop="serverip">
                <el-input v-model="snmpServerForm.serverip" placeholder="请输入服务器IP" :readonly="isView" clearable
                    size="large">
                </el-input>
            </el-form-item>
            <el-form-item label="端口" prop="port">
                <el-input v-model.number="snmpServerForm.port" placeholder="请输入端口" :readonly="isView" clearable
                    size="large">
                </el-input>
            </el-form-item>

            <template v-if="isV3">
                <el-form-item label="v3安全用户名" prop="username">
                    <el-input v-model="snmpServerForm.username" placeholder="请输入v3安全用户名" :readonly="isView" clearable
                        size="large">
                    </el-input>
                </el-form-item>
                <el-form-item label="认证方式" prop="certmethod">
                    <el-select v-model="snmpServerForm.certmethod" placeholder="请选择认证方式" :disabled="isView"
                        style="width: 100%" size="large">
                        <el-option label="SHA" value="1"></el-option>
                        <el-option label="MD5" value="2"></el-option>
                        <el-option label="SHA2-256" value="3"></el-option>
                        <el-option label="不认证" value="99"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="认证密码" prop="certpwd">
                    <el-input v-model="snmpServerForm.certpwd" placeholder="请输入认证密码"
                        :readonly="isView || isCertPwdReadonly" clearable size="large">
                    </el-input>
                </el-form-item>
                <el-form-item label="加密方式" prop="encryptmethod">
                    <el-select v-model="snmpServerForm.encryptmethod" placeholder="请选择认证方式" :disabled="isView"
                        style="width: 100%" size="large">
                        <el-option label="3DES" value="1"></el-option>
                        <el-option label="AES-128" value="2"></el-option>
                        <el-option label="AES-192" value="3"></el-option>
                        <el-option label="AES-256" value="4"></el-option>
                        <el-option label="DES-56" value="5"></el-option>
                        <el-option label="不加密" value="99"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="加密密码" prop="encryptpwd">
                    <el-input v-model="snmpServerForm.encryptpwd" placeholder="请输入加密密码"
                        :readonly="isView || isEncryptPwdReadonly" clearable size="large">
                    </el-input>
                </el-form-item>
            </template>

            <template v-else>
                <el-form-item label="v2c团体名" prop="community">
                    <el-input v-model="snmpServerForm.community" placeholder="请输入v2c团体名" :readonly="isView" clearable
                        size="large">
                    </el-input>
                </el-form-item>
            </template>


            <el-form-item label="备注" prop="memo">
                <el-input v-model="snmpServerForm.memo" type="textarea" :rows="3" resize="none" placeholder="请输入备注"
                    :readonly="isView" size="large">
                </el-input>
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
    import { createSnmpServer, deleteSnmpServer, list, updateSnmpServer } from '@/api/snmpServer';
    import { useSnmpServer } from '@/composables/useSnmpServer';
    import { useTable } from '@/composables/useTable';
    import { Delete, Edit, Plus, Refresh, Search, View } from '@element-plus/icons-vue';
    import { reactive } from 'vue';

    const searchForm = reactive({
        serverip: '',
        servername: '',
        ver: '',
        enable: ''
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
        handleSizeChange,
        handleSortChange
    } = useTable(list, searchForm, { prop: 'serverip', order: 'ascending' })

    const {
        dialogVisible,
        submitLoading,
        snmpServerForm,
        snmpServerFormRef,
        isEdit,
        isView,
        isV3,
        isCertPwdReadonly,
        isEncryptPwdReadonly,
        openAddDialog,
        openEditDialog,
        openViewDialog,
        handleSelectionChange,
        handleToolbarEdit,
        handleToolbarDelete,
        submitForm,
        rules
    } = useSnmpServer(createSnmpServer, updateSnmpServer, handleSearch)

</script>

<style scoped>
    .user-list-container {
        padding: 20px;
        background-color: #f0f2f5;
        height: 100%;
        min-height: 0;
        box-sizing: border-box;
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

    :deep(.el-textarea__inner[readonly]) {
        background-color: #f5f7fa;
        box-shadow: 0 0 0 1px #e4e7ed inset;
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
