import { ElMessage } from "element-plus"
import { nextTick, reactive, ref, watch } from "vue"


export function useSnmpServer(createSnmpServer, updateSnmpServer, handleSearch) {

    const dialogVisible = ref(false)
    const submitLoading = ref(false)
    const snmpServerFormRef = ref()
    const isEdit = ref(false)
    const isView = ref(false)
    const isV3 = ref(true)
    const isCertPwdReadonly = ref(false)
    const isEncryptPwdReadonly = ref(false)

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

    // 根据版本动态切换v3/v2c表单区域
    watch(
        () => snmpServerForm.ver,
        (val) => {
            isV3.value = val === 'v3'
        }
    )

    // 监视认证方式
    watch(
        () => snmpServerForm.certmethod,
        (val) => {
            if (val === '99') {
                // 将认证密码设置为只读
                isCertPwdReadonly.value = true
                snmpServerForm.certpwd = ''
                nextTick(() => snmpServerFormRef.value?.clearValidate(['certpwd']))
                return
            }

            isCertPwdReadonly.value = false
            nextTick(() => snmpServerFormRef.value?.clearValidate(['certpwd']))
        }
    )

    // 监视加密方式
    watch(
        () => snmpServerForm.encryptmethod,
        (val) => {
            if (val === '99') {
                // 将认加密密码设置为只读
                isEncryptPwdReadonly.value = true
                snmpServerForm.encryptpwd = ''
                nextTick(() => snmpServerFormRef.value?.clearValidate(['encryptpwd']))
                return
            }

            isEncryptPwdReadonly.value = false
            nextTick(() => snmpServerFormRef.value?.clearValidate(['certpwd']))
        }
    )

    // 表单校验
    const rules = {
        ver: [{ required: true, message: '请输入版本', trigger: 'blur' }],
        servername: [{ required: true, message: '请输入服务器名称', trigger: 'blur' }],
        serverip: [{ required: true, message: '请输入服务器IP', trigger: 'blur' }],
        port: [{ required: true, message: '请输入端口', trigger: 'blur' }],
        username: [{
            validator: (rule, value, callback) => {
                if (snmpServerForm.ver === 'v3' && value === '') {
                    callback(new Error('请输入v3安全用户名'))
                    return
                }
                callback()
            },
            trigger: 'blur'
        }],
        certpwd: [{
            validator: (rule, value, callback) => {
                if (snmpServerForm.certmethod !== '99' && value === '') {
                    callback(new Error('请输入认证密码'))
                    return
                }
                callback()
            },
            trigger: 'blur'
        }],
        encryptpwd: [{
            validator: (rule, value, callback) => {
                if (snmpServerForm.encryptmethod !== '99' && value === '') {
                    callback(new Error('请输入加密密码'))
                    return
                }
                callback()
            },
            trigger: 'blur'
        }],
        community: [{
            validator: (rule, value, callback) => {
                if (snmpServerForm.ver === 'v2c' && value === '') {
                    callback(new Error('请输入v2c团体名'))
                    return
                }
                callback()
            },
            trigger: 'blur'
        }],

    }

    // 打开新增弹窗并重置表单
    const openAddDialog = () => {
        isEdit.value = false
        isView.value = false
        snmpServerForm.servercode = ''
        snmpServerForm.ver = 'v3'
        snmpServerForm.servername = ''
        snmpServerForm.serverip = ''
        snmpServerForm.port = '161'
        snmpServerForm.username = ''
        snmpServerForm.certmethod = '1'
        snmpServerForm.certpwd = ''
        snmpServerForm.encryptmethod = '4'
        snmpServerForm.encryptpwd = ''
        snmpServerForm.community = ''
        snmpServerForm.memo = ''
        dialogVisible.value = true
        nextTick(() => snmpServerFormRef.value.clearValidate())
    }

    // 打开修改弹窗并重置表单
    const openEditDialog = (row) => {
        console.log(222);

        isEdit.value = true
        isView.value = false
        snmpServerForm.servercode = row.servercode || ''
        snmpServerForm.ver = row.ver || 'v3'
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
        nextTick(() => snmpServerFormRef.value?.clearValidate())
    }

    // 打开查看弹窗
    const openViewDialog = (row) => {
        isEdit.value = false
        isView.value = true
        snmpServerForm.servercode = row.servercode || ''
        snmpServerForm.ver = row.ver || 'v3'
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
        if (!snmpServerFormRef.value) return

        const valid = await snmpServerFormRef.value.validate().catch(() => false)
        if (!valid) return

        submitLoading.value = true
        const action = isEdit.value ? '修改' : '新增'
        try {
            const apiFn = isEdit.value ? updateSnmpServer : createSnmpServer
            const res = await apiFn(snmpServerForm)
            if (res == 1) {
                ElMessage.success(`${action}SNMP服务器成功`)
                dialogVisible.value = false
                handleSearch()
            } else {
                ElMessage.error(`${action}SNMP服务器失败`)
            }
        } catch (error) {
            ElMessage.error(`${action}SNMP服务器失败：${error.message || error}`)
        } finally {
            submitLoading.value = false
        }
    }

    const selectedRows = ref([])

    const handleSelectionChange = (rows) => {
        selectedRows.value = rows
    }

    const handleToolbarEdit = () => {

        if (selectedRows.value.length !== 1) {
            ElMessage.warning('请选择一条数据进行编辑')
            return
        }

        openEditDialog(selectedRows.value[0])
    }




    return {
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
        handleToolbarEdit,
        handleSelectionChange,
        submitForm,
        rules
    }
}