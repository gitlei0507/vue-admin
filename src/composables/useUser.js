import { ElMessage } from "element-plus"
import { nextTick, reactive, ref } from "vue"


export function useUser(createUser, updateUser, handleSearch) {

    const dialogVisible = ref(false)
    const submitLoading = ref(false)
    const userFormRef = ref()
    const isEdit = ref(false)
    const isView = ref(false)

    // 初始化表单数据
    const userForm = reactive({
        id: '',
        uid: '',
        username: '',
        password: '',
        email: '',
        role: ''
    })

    // 表单校验
    const rules = {
        uid: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] }
        ],
        role: [{ required: true, message: '请选择角色', trigger: 'change' }]
    }

    // 打开新增弹窗并重置表单
    const openAddDialog = () => {
        isEdit.value = false
        isView.value = false
        userForm.id = ''
        userForm.uid = ''
        userForm.username = ''
        userForm.password = ''
        userForm.email = ''
        userForm.role = ''
        dialogVisible.value = true
        nextTick(() => userFormRef.value.clearValidate())
    }

    // 打开修改弹窗并重置表单
    const openEditDialog = (row) => {
        console.log('@@', row);

        isEdit.value = true
        isView.value = false
        userForm.id = row.id || ''
        userForm.uid = row.uid || ''
        userForm.username = row.username || ''
        userForm.password = row.password || ''
        userForm.email = row.email || ''
        userForm.role = row.role || ''
        dialogVisible.value = true
        nextTick(() => userFormRef.value?.clearValidate())
    }

    // 打开查看弹窗
    const openViewDialog = (row) => {
        isEdit.value = false
        isView.value = true
        userForm.id = row.id || ''
        userForm.uid = row.uid || ''
        userForm.username = row.username || ''
        userForm.password = row.password || ''
        userForm.email = row.email || ''
        userForm.role = row.role || ''
        dialogVisible.value = true
    }

    // 提交表单
    const submitForm = async () => {
        if (!userFormRef.value) return

        const valid = await userFormRef.value.validate().catch(() => false)
        if (!valid) return

        submitLoading.value = true
        const action = isEdit.value ? '修改' : '新增'
        try {
            const apiFn = isEdit.value ? updateUser : createUser
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
        userForm,
        userFormRef,
        isEdit,
        isView,
        openAddDialog,
        openEditDialog,
        openViewDialog,
        submitForm,
        rules
    }
}