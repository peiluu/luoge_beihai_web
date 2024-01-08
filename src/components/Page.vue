<template>
    <div class="custom-pagination">
        <div class="info">
            <span>共 {{ total }} 条记录</span>
            <span>第 {{ page }} / {{ pageTotal }} 页</span>
        </div>
        <el-pagination
            background
            class="custom-page"
            layout="prev, pager, next, sizes"
            :page-sizes="pageSizes"
            :current-page="page"
            :page-size="size"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange">
        </el-pagination>
    </div>
</template>

<script>
export default {
    props: {
        page: {
            type: Number,
            default: 1
        },
        size: {
            type: Number,
            default: 10
        },
        total: {
            type: Number,
            default: 0
        },
        pageSizes: {
            type: Array,
            default() {
                return new Array(10, 20, 50, 100);
            },
        }
    },
    computed: {
        pageTotal() {
            const page = Math.ceil(this.total / this.size);
            return page > 0 ? page : 1;
        },
    },
    methods: {
        handleCurrentChange(v) {
            this.$emit('pageChange', v, this.size);
        },
        handleSizeChange(v) {
            this.$emit('pageChange', this.page, v);
        },
    }
}
</script>

<style lang="scss" scoped>
.custom-pagination {
    display: flex;
    justify-content: space-between;
    .info {
        margin-left: 14px;
        margin-top: 25px;
        font-size: 10px;
        color: #00002A;
        &>span:last-child {
            margin-left: 15px;
        }
    }
    .custom-page {
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;
    }
}
</style>