<!-- 通用列表页-->
<template>
    <div class="form-list">
        <template v-if="showSearch">
            <form-search :searchList="searchRow" @search="handleSearch" @reset="handleReset"></form-search>
        </template>
        <div class="custom-table">
            <slot name="topTool"></slot>
            <el-table
                :data="data"
                border
                :header-cell-class-name="'main-table-header-cell'"
                v-loading="loading">
                <template v-for="(column, columnIndex) in columns">
                    <el-table-column
                        v-if="column.dataIndex"
                        :key="columnIndex"
                        :prop="column.dataIndex"
                        :label="column.title"
                        :width="column.width">
                    </el-table-column>
                    <el-table-column
                        v-else
                        :key="columnIndex"
                        type="index"
                        :label="column.title"
                        :width="column.width">
                        <template v-if="column.key == 'action'" slot-scope="scope">
                            <slot name="myscope" :data="scope.row">{{scope.row[column.dataIndex]}}</slot>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pagination.current"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pagination.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import FormSearch from "./FormSearch.vue";

export default {
    name: "FormList",
    components: {
        FormSearch,
    },
    props: {
        columns: {
            type: Array,
            default: new Array(),
        },
        searchRow: {
            type: Array,
            default: new Array(),
        },

        api: {
            required: true,
        },
        title: {
            type: String,
            default: "",
        },
        showTitle: {
            // 显示标题栏
            type: Boolean,
            default: false,
        },
        showSearch: {
            // 显示搜索栏
            type: Boolean,
            default: true,
        },
        param: {
            // 列表传参
            type: Object,
            default: new Object(),
        },
        buildFunction: {
            // 列表数据处理方法 
            type: Function,
            default: null,
        },
        firstLoading: {
            // 是否加载时调用
            type:Boolean,
            default:true,
        }
    },
    data() {
        return {
            data: [],
            loading:false,//加载状态
            tableSize: "medium", //表格大小 default | medium / small / mini
            searchParam: {},
            pagination: {
                current: 1,
                pageSize: 100,
                total: 0,
                showQuickJumper: true,
                showTotal: (total) => `共${total}条`,
            },
        };
    },
    methods: {
        handleSizeChange(size) {
            this.pagination.pageSize = size;
            this.pagination.current = 1;
            const searchParam = this.searchParam;
            this.$nextTick(() => {
                this.handleGetData(searchParam);
            });
        },
        handleCurrentChange(pageNo) {
            const searchParam = this.searchParam;
            this.pagination.current = pageNo;
            this.$nextTick(() => {
                this.handleGetData(searchParam);
            });
        },
        async handleGetData(obj) {
            let param = {};
            Object.keys(obj).map(key => {
                if (obj[key].length > 0) {
                    param[key] = obj[key];
                }
            });
            let res;
            const vm = this;
            let data = [];
            let pagination = this.pagination;
            this.loading = true
            try {
                res = await this.api.getList({
                    // startNumber: startNumber,
                    pageNo: pagination.current,
                    pageSize: pagination.pageSize,
                    ...param,
                });

                if (res && res.code == "0") {
                    if (vm.buildFunction) {
                        data = vm.buildFunction(res.data);
                    } else {
                        data = res.data;
                    }
                    if(data && data.length > 0){
                        vm.data = data.map((each, index) => {
                            return {
                                ...each,
                                index: index + 1,
                            };
                        });
                    }else {
                        vm.data = []
                    }
                    vm.pagination.total = res.totalCount;
                } else {
                    vm.$message.error(res.msg);
                }
                vm.loading = false
            } catch (e) {
                vm.loading = false
            }
        },
        // 搜索
        handleSearch(val) {
            let param = this.param
            if (param) {
                param.pageNo = 1;
                Object.assign(val, param);
                this.param = param;
            }
            this.searchParam = val;
            this.handleGetData(val);
        },
        // 重置搜索内容
        handleReset() {
            this.searchParam = {};
            this.handleGetData(this.param);
        },
        // 刷新
        reload() {
            this.handleGetData(this.param);
        },
        async deleteApi(id,param={}) {
            let res;
            let vm = this;
            try {
                res = await this.api.del(id,param);
                if (res && res.code == 0) {
                    vm.reload();
                    vm.$message.success('删除成功');
                } else if (res.msg && res.msg.length > 0) {
                    vm.$message.error(res.msg);
                }
            } catch (e) {
                console.log('del err>>>>>',e)
            }
        },
        // 删除操作
        deleteData(id,param={}) {
            const vm = this;
            this.$confirm(`您确定要删除该条数据吗？[${id}]`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                vm.deleteApi(id, param);
            });
        },
        async stopApi(id,param,title) {
            let res;
            let vm = this;
            try {
                res = await this.api.stop(id,param);
                if (res && res.code == 0) {
                    
                    vm.$message.success(`${title}成功`);
                } else {
                    vm.$message.error(res.msg);
                }
                vm.reload();
            } catch (e) {
                console.log('del err>>>>>',e)
            }
        },
        // 启用禁用
        stop(id,param,title){
            const vm = this;
            vm.stopApi(id,param,title);
        },
    },
    mounted() {
        if(this.firstLoading){
            this.handleGetData(this.param);
        }
        // let defaultSettings = this.$ls.get("defaultSettings");
        // if (defaultSettings) {
        //     this.tableSize = defaultSettings.tableSize;
        // }
    },
};
</script>
<style lang="scss" scoped>
.form-list {
    // padding: 15px
}
</style>