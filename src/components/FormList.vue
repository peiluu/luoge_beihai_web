<!-- 通用列表页-->
<template>
  <div class="form-list">
    <template v-if="showSearch">
      <form-search :searchKey="searchKey" :rebulidForm="rebulidForm" ref="search" :exportLabel="exportLabel" :resetSearch="reset" :param="param" :searchList="searchRow" @handleExport="handleExport" :switchLabel="switchLabel" :showSearchBtn="showSearchBtn"
        @handleSwitch="handleSwitch" :checkLockM="checkLockM" @search="handleSearch" @reset="handleReset" :backpath="backpath" :notSearchContract="notSearchContract" @getNextList="getNextList" :resetAll="resetAll"></form-search>
    </template>
    
    <div class="custom-table">
      <slot name="topTool"></slot>
      <el-table
        row-key="id"
        :reserve-selection="true"
        ref="table" 
        :data="data"
        :border="border" 
        :height="height"
        stripe 
        @row-click="rowClcik"
        :header-cell-style="{fontWeight: 400,borderTop: '1px solid #adb4bc',background: '#f7f9fd',color: '#333333',padding: '7px 0'}"
        tooltip-effect="dark"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :span-method="spanMethod"
        v-loading="loading"
        class="table-body-warpper"
        :row-class-name="tableSelectedRow"
        @selection-change="handleSelection"
      >
        <template v-for="(column, columnIndex) in columns">
          <template v-if="!column.hidden">
            <el-table-column v-if="column.slot" :key="columnIndex"  :prop="column.dataIndex" :label="column.title" :fixed="column.fixed" :sortable="column.sortable" :align="column.align" :min-width="column.width"  :show-overflow-tooltip="column.showTooltip">
              <template slot-scope="scope">
                <slot :name="column.slot" :data="scope.row" :index="scope.$index">{{ scope.row[column.dataIndex] }}</slot>
              </template>
            </el-table-column>
            <el-table-column v-else-if="column.dataIndex" :key="columnIndex" :prop="column.dataIndex" :label="column.title" :sortable="column.sortable"  :align="column.align" :formatter="column.format"
              :min-width="column.width" :show-overflow-tooltip="column.showTooltip">
            </el-table-column>
            <el-table-column v-else-if="column.type == 'selection' || column.type == 'index'" :selectable="column.selectable" :key="columnIndex" :type="column.type" :label="column.title" :sortable="column.sortable"
              :align="column.align" :min-width="column.width" :reserve-selection="true" :fixed="column.fixed">
            </el-table-column>
            <el-table-column v-else-if="column.type == 'radio'" :key="columnIndex" :align="column.align" :min-width="column.width">
              <template slot-scope="scope">
                <vxe-radio-group v-model="radioValue" @change="radioChange(scope.row)">
                  <vxe-radio :label="scope.row.id"></vxe-radio>
                </vxe-radio-group>
              </template>
            </el-table-column>
            <el-table-column v-else :key="columnIndex" type="index" :label="column.title" :sortable="column.sortable" :align="column.align" :fixed="column.fixed" :width="column.width">
              <template v-if="column.key == 'action'" slot-scope="scope">
                <slot name="myscope" :data="scope.row">{{ scope.row[column.dataIndex] }}</slot>
              </template>
            </el-table-column>
          </template>
        </template>

        <template #empty>
            <span>
              <img src="@/assets/no-data.png" style="width: 80px;height: 80px;">
              <p>未搜索到数据</p>
            </span>
        </template>
      </el-table>
      <!-- 表尾 -->
      <slot name="tableFooter"></slot>
      <!-- 表尾合计 -->
      <TableCounter ref="tableCounter" :totalEntity="totalEntity" v-if="tableCounterShow" :tableCounterConfig="tableCounterConfig"/>

      <div class="pagination" v-if="showPagination">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageNo" :page-sizes="pageSizes" :page-size="pagination.pageSize"
          :layout="pageLayout" :total="pagination.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import TableCounter from './TableCounter.vue';
import FormSearch from "./FormSearch.vue";
import cloneDeep from 'lodash/cloneDeep';
export default {
  name: "FormList",
  components: {
    FormSearch,
    TableCounter
  },
  props: {
    border: {
      type: Boolean,
      default: true
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    pageSizes: {
      type: Array,
      default: ()=>[10, 20, 30, 40, 50, 100, 500, 1000],
    },
    pageLayout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    },
    switchLabel: {
      type: String,
      default: ""
    },
    checkLockM: {
      type: Boolean,
      default: false
    },
    exportLabel: {
      type: String,
      default: ""
    },
    mergeCell: {
      type: Boolean,
      default: false
    },
    kjywrid: {
      type: Number,
      default: null,
    },
    reset: {
      type: Number,
      default: null,
    },
    columns: {
      type: Array,
      default: ()=>[],
    },
    searchRow: {
      type: Array,
      default: ()=>[],
    },
    backpath: {
      type: String,
      default: "",
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
    showSearchBtn: {
      // 显示搜索栏按钮
      type: Boolean,
      default: true,
    },
    showPagination: {
      // 显示分页
      type: Boolean,
      default: true,
    },
    param: {
      // 列表传参
      type: Object,
      default: ()=>({}),
    },
    buildFunction: {
      // 列表数据处理方法
      type: Function,
      default: null,
    },
    firstLoading: {
      // 是否加载时调用
      type: Boolean,
      default: true,
    },
    height: {
      type: Number,
    },
    singleSelect: {
      type: Boolean,
    },
    // 查询列表收缩
    notSearchContract: {
      type: Boolean,
      default: false,
    },
    searchKey: {
      type: String,
      default: "",
    },

    rebulidForm: {
      type: Boolean,
      default: false,
    },
    tableCounterShow: {},
    tableCounterConfig: {},
    resetAll: {
      type: Boolean,
    },
    defaultRadioValue: {
      type:[String,Number],
      default: '' ,
    },
    otherParam: {
      type: Object,
      default: ()=>({}),
    }
  },
  watch: {
    "param.nsrsbh": function (val) {
      if (val) {
        this.$emit('getOrgList', val)
      }
    },
    defaultRadioValue: {
      handler(val){
        this.radioValue = val;
      }
    },
    param: function(val){
      this.formParams = cloneDeep({...this.formParams, ...val})
    }
  },
  data() {
    return {
      data: [],
      loading: false,//加载状态
      tableSize: "medium", //表格大小 default | medium / small / mini
      searchParam: {},
      formParams: cloneDeep(this.param),
      pagination: {
        pageNo: 1,
        pageSize: this.pageSize,
        total: 0,
        showQuickJumper: true,
        showTotal: (total) => `共${total}条`,
      },
      radioValue: this.defaultRadioValue || '',
      selectedRow: {},
      totalEntity: {},
      keepSelections: false,
    };
  },
  methods: {
    radioChange(e) {

      this.selectedRow = e;
    },
    // 给每一个选中行增加样式
    tableSelectedRow({ row }) {
      return this.$refs.table.selection.find((item) => item.id && item.id === row.id) ? 'current-row' : null
    },
    handleSwitch(e) {
      this.$emit("handleSwitch", e);
    },
    handleExport() {
      this.$emit("handleExport");
    },
    handleSelection(e) {
      if (this.tableCounterShow) {
        this.$refs.tableCounter.getSelecedInfo(e)
      }
      this.$emit("handleSelection", e);
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.pagination.pageNo = 1;
      const searchParam = this.searchParam;
      this.$nextTick(() => {
        this.handleGetData(searchParam);
      });
    },
    handleCurrentChange(pageNo) {
      const searchParam = this.searchParam;
      this.pagination.pageNo = pageNo;
      this.$nextTick(() => {
        this.handleGetData(searchParam, {}, true);
      });
    },
    async handleGetData(obj, args, keepSelections) {
      // this.keepSelections = false;
            this.searchParam = obj;
      let param = {};
      Object.keys(obj).map(key => {
      if (obj[key] != null) {
      // 用obj[key].length > 0 只能判断字符串，会过滤掉数字
      // if (obj[key].length > 0) {
      //   param[key] = obj[key];
      // }
      if (obj && obj[key]) {
      param[key] = obj[key];
      }
        }
      });
      
      let res;
      const vm = this;
      let data = [];
      let pagination = this.pagination;
      this.loading = true;
      for (var field in args) {
        param[field] = args[field];
      }
      if(Object.keys(this.otherParam).length !== 0){
        param = {...param, ...this.otherParam}
      }
      try {
        res = await this.api.getList({
          // startNumber: startNumber,
          ...param,
          pageNo: pagination.pageNo,
          pageSize: pagination.pageSize,

        });
        if (res && res.code == "0") {
          // 向父组件传递参数
          this.$emit('getSearchParam', param)
          this.$emit('getTableData', res.data)
          if(this.$listeners.callback && typeof this.$listeners.callback === 'function'){
            this.$listeners.callback(res)
          }
          // 在切换页面时不清空选中的数据
          if (!keepSelections) {
            // console.log('--this.$refs.table--', this.$refs.table)
            this.$refs.table && this.$refs.table.clearSelection();
          }
          if (vm.buildFunction) {
            data = vm.buildFunction(res.data);
          } else {
            data = res.data;
          }
          if (data && data.length > 0) {
            vm.data = data.map((each, index) => {
              return {
                ...each,
                index: index + 1,
              };
            });
            // this.setSelections(data || []);
          } else {
            vm.data = []
          }
          vm.pagination = {
            ...res,
            pageNo: res.pageNo || 1,
            pageSize: res.pageSize || 10,
            total: res.totalCount || 0
          }
          if (res.total) {
            vm.$emit('sumTotal', res.total);
          }
        } else {
          vm.$message.error(res.msg);
        }
      } catch (e) {
        vm.$message.error(e.msg);
      } finally {
        vm.loading = false
      }
    },
    // 搜索
    handleSearch(val, type) {
        let param = this.formParams;
        
      // 不需要添加多余的参数
      if (this.resetAll || type == 'reset') {
       
        this.formParams = {...val, ...this.param};
        this.handleGetData(this.formParams);
        
      } else if (param) {
        param.pageNo = 1;
        this.pagination.pageNo = 1;
        // 修复重置问题
        Object.assign(param, val);
        this.formParams = param;
        this.handleGetData({...param, ...val});
        
      }
    },
    // 重置搜索内容
    handleReset() {
      this.searchParam = this.kjywrid == null ? {} : { kjywrid: this.kjywrid };
      this.handleGetData(this.searchParam);
    },
    // 刷新
    reload(args) {
      const param = { ... this.param, ...this.searchParam, ...args }
      this.handleGetData(param);
    },
    async deleteApi(id, param = {}) {
      let res;
      let vm = this;
      try {
        res = await this.api.del(id, param);
        if (res && res.code == 0) {
          vm.reload();
          vm.$message.success('删除成功');
        } else if (res.msg && res.msg.length > 0) {
          vm.$message.error(res.msg);
        }
      } catch (e) {
        console.log('del err>>>>>', e)
      }
    },
    // 删除操作
    deleteData(id, param = {}) {
      const vm = this;
      this.$confirm(`您确定要删除该条数据吗？`, '警告', {
        // this.$confirm(`您确定要删除该条数据吗？[${id}]`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.deleteApi(id, param);
      }).catch(() => { }) // 添加错误捕获
    },
    async stopApi(id, param, title) {
      let res;
      let vm = this;
      try {
        res = await this.api.stop(id, param);
        if (res && res.code == 0) {
          vm.$message.success(`${title}成功`);
        } else {
          vm.$message.error(res.msg);
        }
        vm.reload();
      } catch (e) {
        console.log('del err>>>>>', e)
      }
    },
    // 启用禁用
    stop(id, param, title) {
      const vm = this;
      vm.stopApi(id, param, title);
    },
    // 获取多选数据
    getSelections() {
      return this.$refs.table.selection;
    },
    // 初始化多选数据
    setSelections(list) {
      list?.map((item) => {
        this.$refs.table.toggleRowSelection(item)
      })

    },
    // 清空多选
    clearSelection() {
      this.$refs.table.clearSelection();
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      //    this.$emit("spanMethod",{row, column, rowIndex, columnIndex});
      if (this.mergeCell) {
        if (!row.children || row.children.length == 0) {
          if (columnIndex === 0) {
            return {
              rowspan: 1,
              colspan: 3
            };
          } else if (columnIndex === 1 || columnIndex === 2) {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }
    },
    rowClcik(row, column, event) {
      if (this.singleSelect) {
        this.radioValue = row.id;
        this.selectedRow = row;

      } else {
        this.$refs.table.toggleRowSelection(row);
      }
    },
    getNextList(val, type) {
      this.$emit('getNextList', val, type)
    },
  },
  activated() {
    if (this.firstLoading) {
      this.$nextTick(() => {
        this.handleGetData(this.formParams);
      });
    }
  },
  updated(){
    this.$refs['table'].doLayout()
  }
};
</script>
<style lang="scss" scoped>
.form-list {
  padding-top: 12px;
}

::v-deep .el-table td.el-table__cell div {
  /* 关键代码 */
  text-overflow: ellipsis;
  /* 溢出显示省略号 */
  overflow: hidden;
  /* 溢出隐藏 */
  white-space: nowrap;
  /* 强制不换行 */
}
</style>
