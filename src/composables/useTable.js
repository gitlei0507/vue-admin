import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref } from 'vue'

export function useTable(apiFn, searchForm) {
    const tableData = ref([])
    const loading = ref(false)

    const fetchData = async () => {
        loading.value = true
        try {
            const res = await apiFn(searchForm)
            tableData.value = res
        } catch (error) {
            console.error('获取失败：', error)
        } finally {
            loading.value = false
        }
    }

    // 查询
    const handleSearch = () => fetchData()

    // 重置
    const resetSearch = () => {
        Object.keys(searchForm).forEach(key => searchForm[key] = '')
        fetchData()
    }

    // 删除
    const handleDelete = (index, row, options = {}) => {

        const { nameField = 'username', confirmText = '确定要删除用户', onSuccess } = options

        ElMessageBox.confirm(
            `${confirmText} 【${row[nameField]}】 吗？`,
            '警告',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            tableData.value.splice(tableData.value.indexOf(row), 1)
            ElMessage.success('删除成功')
            if (onSuccess) onSuccess()
        }).catch(() => {
            // 点击取消
        })
    }

    onMounted(fetchData)

    return {
        tableData,
        loading,
        searchForm,
        handleSearch,
        resetSearch,
        handleDelete
    }
}