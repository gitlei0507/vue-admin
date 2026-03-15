import { ElMessage } from "element-plus"
import { nextTick, reactive, ref } from "vue"


export function useSnmpServer(createSnmpServer, updateSnmpServer, handleSearch) {

    const dialogVisible = ref(false)
    const submitLoading = ref(false)
    const snmpServerFormRef = ref()
    const isEdit = ref(false)
    const isView = ref(false)

    // 初始化表单数据
    const snmpServerForm = reactive({
        servercode: '',
        ver: '',
        servername: '',
        serverip: '',
        port: '',
        username: '',
        certmethod: '',
        certpwd: '',
        encryptmethod: '',
        encryptpwd: '',
        community: '',
        memo: '',
    })

    // 表单校验
    const rules = {
        ver: [{ required: true, message: '请输入版本', trigger: 'blur' }],
        servername: [{ required: true, message: '请输入服务器名称', trigger: 'blur' }],
        serverip: [{ required: true, message: '请输入服务器IP', trigger: 'blur' }],
        port: [{ required: true, message: '请输入端口', trigger: 'blur' }],
        username: [{ required: true, message: '请输入v3安全用户名', trigger: 'blur' }],
        certmethod: [{ required: true, message: '请输入认证方式', trigger: 'blur' }],
        certpwd: [{ required: true, message: '请输入认证密码', trigger: 'blur' }],
        encryptmethod: [{ required: true, message: '请输入加密方式', trigger: 'blur' }],
        community: [{ required: true, message: '请输入v2c团体名', trigger: 'blur' }],

    }

    // 打开新增弹窗并重置表单
    const openAddDialog = () => {
        isEdit.value = false
        isView.value = false
        snmpServerForm.servercode = ''
        snmpServerForm.ver = ''
        snmpServerForm.servername = ''
        snmpServerForm.serverip = ''
        snmpServerForm.port = '161'
        snmpServerForm.username = ''
        snmpServerForm.certmethod = ''
        snmpServerForm.certpwd = ''
        snmpServerForm.encryptmethod = ''
        snmpServerForm.encryptpwd = ''
        snmpServerForm.community = ''
        snmpServerForm.memo = ''
        dialogVisible.value = true
        nextTick(() => snmpServerFormRef.value.clearValidate())
    }

    // 打开修改弹窗并重置表单
    const openEditDialog = (row) => {
        isEdit.value = true
        isView.value = false
        snmpServerForm.servercode = row.servercode || ''
        snmpServerForm.ver = row.ver || ''
        snmpServerForm.servername = row.servername || ''
        snmpServerForm.serverip = row.serverip || ''
        snmpServerForm.port = row.port || '161'
        snmpServerForm.username = row.username || ''
        snmpServerForm.certmethod = row.certmethod || ''
        snmpServerForm.certpwd = row.certpwd || ''
        snmpServerForm.encryptmethod = row.encryptmethod || ''
        snmpServerForm.encryptpwd = row.encryptpwd || ''
        snmpServerForm.community = row.community || ''
        snmpServerForm.memo = row.memo || ''
        dialogVisible.value = true
        nextTick(() => userFormRef.value?.clearValidate())
    }

    // 打开查看弹窗
    const openViewDialog = (row) => {
        isEdit.value = false
        isView.value = true
        snmpServerForm.servercode = row.servercode || ''
        snmpServerForm.ver = row.ver || ''
        snmpServerForm.servername = row.servername || ''
        snmpServerForm.serverip = row.serverip || ''
        snmpServerForm.port = row.port || '161'
        snmpServerForm.username = row.username || ''
        snmpServerForm.certmethod = row.certmethod || ''
        snmpServerForm.certpwd = row.certpwd || ''
        snmpServerForm.encryptmethod = row.encryptmethod || ''
        snmpServerForm.encryptpwd = row.encryptpwd || ''
        snmpServerForm.community = row.community || ''
        snmpServerForm.memo = row.memo || ''
        dialogVisible.value = true
    }

    // 提交表单
    const submitForm = async () => {
        if (!userFormRef.value) return

        const valid = await snmpServerFormRef.value.validate().catch(() => false)
        if (!valid) return

        submitLoading.value = true
        const action = isEdit.value ? '修改' : '新增'
        try {
            const apiFn = isEdit.value ? updateSnmpServer : createSnmpServer
            const res = await apiFn(userForm)
            if (res == 1) {
                ElMessage.success(`${action}用户成功`)
                dialogVisible.value = false
                handleSearch()
            } else {
                ElMessage.error(`${action}用户失败`)
            }
        } catch (error) {
            ElMessage.error(`${action}用户失败：${error.message || error}`)
        } finally {
            submitLoading.value = false
        }
    }

    return {
        dialogVisible,
        submitLoading,
        snmpServerForm,
        snmpServerFormRef,
        isEdit,
        isView,
        openAddDialog,
        openEditDialog,
        openViewDialog,
        submitForm,
        rules
    }
}