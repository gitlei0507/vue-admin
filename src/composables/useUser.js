import { ElMessage } from "element-plus"
import { ref } from "vue"


export function useUser(createUser, handleSearch) {

    const dialogVisible = ref(false)
    const submitLoading = ref(false)
    const userFormRef = ref()

    // 初始化表单数据
    const userForm = reactive({
        uid: '',
        username: '',
        password: '',
        email: '',
        role: 'user'
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

    // 打开弹窗并重置表单
    const openAddDialog = () => {
        userForm.uid = ''
        userForm.username = ''
        userForm.password = ''
        userForm.email = ''
        userForm.role = 'user'
        dialogVisible.value = true
    }

    // 提交表单
    const submitForm = async () => {
        if (!userFormRef.value) return

        const valid = await userFormRef.value.validate().catch(() => false)
        if (!valid) return

        submitLoading.value = true
        try {
            const res = await createUser(userForm)
            if (res == 1) {
                ElMessage.success('新增用户成功')
                dialogVisible.value = false
                handleSearch()
            } else {
                ElMessage.error('新增用户失败')
            }
        } catch (error) {
            ElMessage.error('新增用户失败', error)
        } finally {
            submitLoading.value = false
        }
    }

    return {
        dialogVisible,
        submitLoading,
        userForm,
        userFormRef,
        openAddDialog,
        submitForm,
        rules
    }
}