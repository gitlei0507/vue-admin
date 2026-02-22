import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref } from 'vue'

export function useTable(apiFn, searchForm, deleteUser, defaultSort = {}) {
    const tableData = ref([])
    const loading = ref(false)
    // 分页参数
    const currentPage = ref(1)
    const pageSize = ref(5)
    const total = ref(0)
    // 排序参数，支持默认值
    // defaultSort.order 为 Element Plus 格式(ascending/descending)，需转换为后端格式(asc/desc)
    const sortField = ref(defaultSort.prop || '')
    const sortOrder = ref(
        defaultSort.order
            ? (defaultSort.order === 'ascending' ? 'asc' : 'desc')
            : ''
    )

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

            // 添加排序参数
            if (sortField.value && sortOrder.value) {
                payload.sortField = sortField.value
                payload.sortOrder = sortOrder.value
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
    const handleSearch = () => {
        currentPage.value = 1
        fetchData()
    }

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

    // 排序
    const handleSortChange = ({ column, prop, order }) => {
        // order: ascending(升序) / descending(降序) / null(取消排序)
        // 只处理升序和降序，忽略取消排序的操作
        if (!order) {
            return
        }

        sortField.value = prop
        // 将 Element Plus 的排序值转换为后端需要的格式
        sortOrder.value = order === 'ascending' ? 'asc' : 'desc'

        // 排序时回到第一页
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
        handleSizeChange,
        handleSortChange
    }
}