import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref } from 'vue'

export function useTable(apiFn, searchForm, deleteUser) {
    const tableData = ref([])
    const loading = ref(false)
    // 分页参数
    const currentPage = ref(1)
    const pageSize = ref(5)
    const total = ref(0)

    const normalizeListResult = (res) => {
        if (Array.isArray(res)) {
            return {
                rows: res,
                total: res.length
            }
        }

        const rows = res?.records || res?.list || res?.rows || res?.data || []
        const totalCount = res?.total ?? res?.count ?? rows.length

        return {
            rows,
            total: totalCount
        }
    }

    const fetchData = async () => {
        loading.value = true
        try {
            const payload = {
                ...searchForm,
                pageNum: currentPage.value,
                pageSize: pageSize.value
            }
            const res = await apiFn(payload)
            const { rows, total: totalCount } = normalizeListResult(res)
            tableData.value = rows
            total.value = Number(totalCount) || 0
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
        currentPage.value = 1
        fetchData()
    }

    const handleCurrentChange = (page) => {
        currentPage.value = page
        fetchData()
    }

    const handleSizeChange = (size) => {
        pageSize.value = size
        currentPage.value = 1
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
        ).then(async () => {
            try {
                const res = await deleteUser(row)
                if (res === 1) {
                    ElMessage.success('删除用户成功')
                    handleSearch()
                } else {
                    ElMessage.error('删除用户失败')
                }
            } catch (error) {
                ElMessage.error(`删除用户失败：${error.message || error}`)
            }
        }).catch(() => {
            // 点击取消
        })
    }

    onMounted(fetchData)

    return {
        tableData,
        loading,
        currentPage,
        pageSize,
        total,
        searchForm,
        handleSearch,
        resetSearch,
        handleDelete,
        handleCurrentChange,
        handleSizeChange
    }
}