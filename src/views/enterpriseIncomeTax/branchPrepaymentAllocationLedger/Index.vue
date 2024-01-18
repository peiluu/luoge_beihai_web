<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <div class="custom-query-form">
      <el-form ref="searchForm" :model="form" :inline="true">
        <el-form-item label="所属总机构名称" prop="zjgsbh">
          <el-select v-model="form.zjgsbh" filterable placeholder="请选择" @change="(val) => queryBranchOrg(val)">
            <el-option v-for="item in allOrgList" :key="item.id" :label="`${item.nsrmc} ${item.nsrsbh}`" :value="item.nsrsbh">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分机构名称" prop="nsrsbh">
          <el-select v-model="form.nsrsbh" filterable placeholder="请选择">
            <el-option v-for="item in queryBranchOrgList" :key="item.id" :label="item.label" :value="item.nsrsbh">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="税款所属期" prop="ssq">
          <QuarterDatePicker :key="`${form.ssq}_${pickerType}`" :pickerType="pickerType" :defaultValue="form.ssq" :propsParam="'ssq'" @getQuarterPickerFrom="getQuarterPickerFrom" ref="quarterDatePicker" />
        </el-form-item>
        <template v-if="moreStatus === 'up'">
          <el-form-item label="分机构名称" prop="nsrsbh11">
            <el-select v-model="form.nsrsbh111" filterable placeholder="请选择">
              <el-option v-for="item in queryBranchOrgList" :key="item.id" :label="item.label" :value="item.nsrsbh">
              </el-option>
            </el-select>
          </el-form-item>
        </template>


      </el-form>
      <div class="search-btns">
        <el-button type="success" @click="handleSearch">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button v-show="showMore" :class="moreStatus == 'down' ? 'more' : 'more-down'" icon="el-icon-d-arrow-right" circle @click="handleMore"></el-button>
      </div>
    </div>
    <div class="top-tool">
      <div class="toolbar-left" />
      <div class="toolbar-right">
        <el-button @click="fetchPrepaidShare" type="primary" :disabled="querySbStatus" :loading='loading'>取数</el-button>
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <div class="custom-table">
      <el-table border :data="tableData" :height="height" :header-cell-style="{ fontWeight: 400, borderTop: '1px solid #adb4bc', background: '#f7f9fd', color: '#333333', padding: '7px 0' }">
        <el-table-column label="序号" type="index" min-width="50" />
        <el-table-column label="分机构名称" prop="nsrmc" min-width="200" />
        <el-table-column label="分机构纳税识别号" prop="nsrsbh" min-width="180" />
        <el-table-column label="所属总机构名称" prop="zjgmc" min-width="180" />
        <el-table-column label="税款所属期" prop="ssq" align="center" min-width="100">
          <template slot-scope="{row}">{{ formatAllDate(row.ssq, querySdstbzq) }} </template>
        </el-table-column>
        <el-table-column label="本期分摊比例" prop="ftbl" align='center' min-width="130" />
        <el-table-column label="本期分摊应补（退）所得税额" prop="ftybtse" align="right" min-width="170">
          <template slot-scope="{row}">{{ formatMoney(row.ftybtse) }}</template>
        </el-table-column>
        <el-table-column label="最后修改时间" prop="updatetime" align="center" min-width="100">
          <template slot-scope="{row}">{{ dateFormat('YYYY-mm-dd', row.updatetime) }} </template>
        </el-table-column>
      </el-table>

    </div>
    <div class="pagination">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageNo" :page-sizes="[10, 20, 30, 40, 50, 100, 500, 1000]" :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import QuarterDatePicker from '@/components/QuarterDatePicker';
import { getCurrentSsq, dateFormat } from "@/utils/tool";
import { getList, queryAllOrg, queryBranchOrg, exportLedger, fetchPrepaidShare, queryStatus } from './Api.js'
export default {
  name: "BranchPrepaymentAllocationLedger",
  components: {
    QuarterDatePicker
  },
  data() {
    return {
      form: { nsrsbh: '' },
      showMore: true, //是否显示更多
      moreStatus: "down", //up /down
      param: {},
      tableData: [],
      querySbStatus: false, // 是否已经申报完成
      pickerType: '季',
      allOrgList: [],     // 所属总机构
      queryBranchOrgList: [],    // 分支机构
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        showQuickJumper: true,
        showTotal: (total) => `共${total}条`,
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      loading: false,
    };
  },
  mounted() {
    this.queryAllOrg();
  },
  activated() {
    if (this.$route.query.nsrsbh) {
      this.initQueryParam()
    }
  },
  methods: {
    // 查询总机构
    async queryAllOrg() {
      const { code = '', data = [] } = await queryAllOrg({})
      if (code === '0') {
        this.allOrgList = data;
        if (!this.$route.query.nsrsbh) {
          const { nsrsbh = '', sdstbzq = '', id = '' } = data[0] || {}
          this.querySdstbzq = sdstbzq
          this.form.zjgsbh = nsrsbh
          this.queryBranchOrg(nsrsbh);
          this.$nextTick(() => {
            this.handleSearch()
          })
        }
      }
    },
    // 查询分支机构
    async queryBranchOrg(zjgsbh, type) {
      const { sdstbzq = '', id = '' } = this.allOrgList.find((item) => item.nsrsbh === zjgsbh) || {}
      const { code = '', data = [] } = await queryBranchOrg({ id })
      if (code === '0') {
        this.queryBranchOrgList = [{ value: '', label: '全部' }].concat(data.map((item) => {
          return {
            ...item,
            value: item.nsrsbh,
            label: `${item.nsrmc} ${item.nsrsbh}`
          }
        }));
        // 非初始化查询参数
        if (type !== 'initQueryParam') {
          this.initDate();
          this.querySdstbzq = sdstbzq || '季'
        }

        this.$set(this.form, 'nsrsbh', '')
      }
    },
    // 初始化属期时间
    initDate() {
      const { monthValue, quarterValue } = getCurrentSsq();
      const value = this.querySdstbzq == '月' ? monthValue : quarterValue
      this.form.ssq = value
      this.form.tbzq = this.querySdstbzq
      this.pickerType = this.querySdstbzq
    },
    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh, ssq, tbzq } = this.$route.query
      this.form.zjgsbh = nsrsbh
      this.form.tbzq = tbzq
      this.pickerType = tbzq
      this.form.ssq = ssq
      this.queryBranchOrg(nsrsbh, 'initQueryParam')
    },

    async handleSearch() {
      const res = await getList({
        ...this.form,
        pageNo: this.pagination.pageNo || 1,
        pageSize: this.pagination.pageSize || 10
      })

      this.pagination = { ... { ...res, total: res.totalCount } }
      this.tableData = res.data || [];
      this.queryStatus();
    },
    resetForm() {
      this.$refs.searchForm.resetFields();
      // 重置子组件
      if (this.$refs.quarterDatePicker) {
        this.$refs.quarterDatePicker.reset();
      }
      this.form = {}
      this.handleSearch()
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.pagination.pageNo = 1;
      this.$nextTick(() => {
        this.handleSearch();
      });
    },
    handleCurrentChange(pageNo) {
      this.pagination.pageNo = pageNo;
      this.$nextTick(() => {
        this.handleSearch();
      });
    },
    // 查询申报状态
    async queryStatus() {
      // false 是当前还没有申报
      const { code = '', data } = await queryStatus({ ...this.form, sbsz: 'sds' })
      if (code === '0') {
        this.querySbStatus = data
      }
    },

    selectAllEvent({ checked }) {
      this.selections = this.$refs.xTable.getCheckboxRecords()
    },
    selectChangeEvent({ checked }) {
      this.selections = this.$refs.xTable.getCheckboxRecords()
    },

    handleMore() {
      this.moreStatus = this.moreStatus === 'up' ? 'down' : 'up';
    },
    getQuarterPickerFrom(propsParam, data) {
      this.form[propsParam] = data
    },
    // 取数
    async fetchPrepaidShare() {
      this.loading = true;
      const { code = '' } = await fetchPrepaidShare(this.form)
      if (code === '0') {
        this.$message.success('操作成功');
        this.handleSearch()
      }
      this.loading = false;
    },
    // 导出
    async handleExport() {
      const fileName = `增值税及附加税费预缴台账.xlsx`
      await exportLedger({
        reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999 },
        fileName
      })
    },
    dateFormat,
  },
  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
    height() {
      return window.innerHeight - 300;
    },
    ssqReturnType() {
      return this.$refs.ledgerForm.zzstbzq
    }
  },

};
</script>
<style scoped lang="scss">
@import '../../../styles/variables.scss';
/deep/ .el-dialog__body {
  .el-form-item:nth-of-type(4) {
    .el-form-item__label::before {
      content: '*';
      color: red;
      margin-right: 4px;
    }
  }

  .el-form-item {
    width: calc(50% - 10px);
    margin-bottom: 16px;


    .el-form-item__label {
      width: 210px;
    }

    .el-form-item__content {
      width: calc(100% - 210px);

      .el-select,
      .el-date-editor,
      .vxe-select,
      .vxe-input,
      .el-input {
        width: 100%;
      }
    }

  }
}
.custom-query-form {
  padding-top: 12px;
  display: flex;
  justify-content: space-between;

  .el-form {
    flex: 1;
  }

  .search-btns {
    margin-bottom: 4px;
  }

  /deep/ .el-form-item {
    width: calc(33.3% - 10px);
    margin-bottom: 4px !important;

    .el-form-item__label {
      width: 120px;
      font-size: 12px;
      color: $mainTextColor;
    }

    .el-form-item__content {
      width: calc(100% - 120px);

      .el-select,
      .el-date-editor,
      .el-cascader,
      .el-input {
        width: 100% !important;
      }
    }
  }

  .more {
    transform: rotate(90deg);
  }

  .more-down {
    transform: rotate(-90deg);
    transition-duration: 300ms;
  }

  ::v-deep .el-select__tags {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-wrap: nowrap;
  }
}
.top-tool {
  display: flex;
  justify-content: flex-end;
  margin: 8px 0;
}
</style>

