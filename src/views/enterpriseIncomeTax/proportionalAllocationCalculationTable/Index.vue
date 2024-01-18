<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <div class="search-box">
      <el-form :model="form" :inline="true" ref="searchForm">
        <el-form-item label="总机构名称" prop="nsrsbh">
          <el-select v-model="form.nsrsbh" filterable placeholder="请选择" style="width:140px;" @change="initDate">
            <el-option v-for="item in taxBodyList" :key="item.nsrsbh" :label="`${item.nsrmc} ${item.nsrsbh}`" :value="item.nsrsbh" />
          </el-select>
        </el-form-item>
        <el-form-item label="税款所属期" prop="ssq">
          <QuarterDatePicker :pickerType="querySdstbzq" :defaultValue="form.ssq" propsParam="ssq" :isInitDefault="true" @getQuarterPickerFrom="getQuarterPickerFrom" ref="quarterDatePicker" />
        </el-form-item>
      </el-form>
      <div class="search-btns">
        <el-button type="success" @click="handleSearch">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </div>

    <div class="toolbar">
      <!-- <div class="toolbar-left">默认每月8号自动生成</div> -->
      <div class="toolbar-left" />
      <div class="toolbar-right">
        <el-button @click="fetchCalPrepaidShare" type="primary" :disabled="querySbStatus">取数</el-button>
        <el-button @click="handleExport" type="primary">导出</el-button>
      </div>
    </div>
    <div class="custom-vxe-table">
      <!-- <div class="custom-table">
      <el-table border :data="tableData" :header-cell-style="{ fontWeight: 400, borderTop: '1px solid #adb4bc', background: '#f7f9fd', color: '#333333', padding: '7px 0' }">
        <el-table-column type="index" prop="date" label="序号" min-width="50" />
        <el-table-column prop="date" label="总机构名称" align="center" />
        <el-table-column prop="date" label="总机构纳税人识别号" align="center" min-width="100" />
        <el-table-column prop="date" label="分支机构名称" align="center" />
        <el-table-column prop="date" label="分支机构纳税人识别号" align="center" min-width="120" />
        <el-table-column prop="date" label="是否是总机构独立生产经营部门" min-width="140" align="center" />
        <el-table-column label="各分支机构（营收收入\职工薪酬\资产总额）分配表" align="center">
          <el-table-column prop="zip" label="营业收入" align="center" />
          <el-table-column prop="zip" label="职工薪酬" align="center" />
          <el-table-column prop="zip" label="资产总额" align="center" />
        </el-table-column>
        <el-table-column prop="date" label="分配比例" align="center" />
      </el-table>
    </div> -->
      <vxe-table :height="height" :data="tableData" border align="center" ref="xTable">
        <vxe-column type="seq" width="60" title="序号" field="seq" />
        <vxe-column title="总机构名称" field="zjgmc" min-width="130" />
        <vxe-column title="总机构纳税人识别号" field="zjgsbh" min-width="140" />
        <vxe-column title="分支机构名称" field="nsrmc" min-width="180" />
        <vxe-column title="分支机构纳税人识别号" field="nsrsbh" min-width="140" />
        <vxe-column title="是否是总机构独立生产经营部门" field="scjybm" min-width="160">
          <template #default="{ row }">{{ row.scjybm == 'Y' ? '是' : '否' }}</template>
        </vxe-column>
        <vxe-colgroup title="各分支机构（营收收入\职工薪酬\资产总额）分配表">
          <vxe-colgroup title="营业收入" field="yysr" min-width="100">
            <template #default="{ row }">{{ formatMoney(row.yysr) }}</template>
          </vxe-colgroup>
          <vxe-colgroup title="职工薪酬" field="zgyj" min-width="100">
            <template #default="{ row }">{{ formatMoney(row.zgyj) }}</template>

          </vxe-colgroup>
          <vxe-colgroup title="资产总额" field="zcze" min-width="100">
            <template #default="{ row }">{{ formatMoney(row.zcze) }}</template>
          </vxe-colgroup>
          <vxe-column title="分配比例" field="fpbl" min-width="100" align="center" />
        </vxe-colgroup>
        <template #empty>
          <span>
            <img src="@/assets/no-data.png" style="width: 80px;height: 80px;">
            <p>未搜索到数据</p>
          </span>
        </template>
      </vxe-table>
    </div>
  </div>
</template>

<script>
import QuarterDatePicker from '@/components/QuarterDatePicker.vue'
import { getCurrentSsq } from "@/utils/tool";
import { queryCalPrepaidShare, queryAllOrg, fetchCalPrepaidShare, getListByUser, exportLedger, queryStatus } from './Api';

export default {
  name: "ProportionalAllocationCalculationTable",
  components: {
    QuarterDatePicker
  },
  data() {
    return {
      tableData: [],
      taxBodyList: [],
      querySdstbzq: '季',
      querySbStatus: false,
      form: {
        ssq: '',
        nsrsbh: ''
      },
    }
  },
  mounted() {
    this.queryAllOrg()
  },
  activated() {
    if (this.$route.query.nsrsbh) {
      this.initQueryParam()
    }
  },

  methods: {
    // 获取总机构
    async queryAllOrg() {
      const { code = '', data = [] } = await queryAllOrg({})
      if (code === '0') {
        this.taxBodyList = data;
        if (!this.$route.query.nsrsbh) {
          const { nsrsbh = '', sdstbzq = '' } = data[0] || {}
          this.querySdstbzq = sdstbzq
          this.form.nsrsbh = nsrsbh
          this.initForm();
        }
      }
    },

    async handleSearch() {
      const { code = '', data = [] } = await queryCalPrepaidShare(this.form)
      if (code === '0') {
        this.tableData = data || []
        this.queryStatus()
      }
    },
    // 取数
    async fetchCalPrepaidShare() {
      const { code = '' } = await fetchCalPrepaidShare(this.form)
      if (code === '0') {
        this.$message.success('操作成功');
        this.handleSearch(this.form)
      }
    },
    resetForm() {
      this.$refs.searchForm.resetFields();
      this.$refs.quarterDatePicker.reset()
      this.form = {}
      this.handleSearch();
    },
    initForm() {
      const nsrsbh = this.taxBodyList ? this.taxBodyList[0].nsrsbh : '';
      this.form.nsrsbh = nsrsbh;
      this.initDate(nsrsbh)
      this.handleSearch();
    },
    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh, ssq, tbzq } = this.$route.query
      this.form.nsrsbh = nsrsbh;
      this.form.ssq = ssq
      this.form.tbzq = tbzq
      this.handleSearch()
    },
    // 初始化属期时间
    initDate(val) {
      this.querySdstbzq = this.taxBodyList.find((item) => item.nsrsbh === val)?.sdstbzq;
      const { monthValue, quarterValue } = getCurrentSsq();
      const value = this.querySdstbzq == '月' ? monthValue : quarterValue;
      this.form.ssq = value;
      this.form.tbzq = this.querySdstbzq;
    },
    getQuarterPickerFrom(propsParam, data) {
      this.form[propsParam] = data
    },
    // 导出
    async handleExport() {
      const fileName = `分支机构比例分摊计算表.xlsx`
      await exportLedger({
        reqData: { ...this.form, pageNo: 1, pageSize: 99999 },
        fileName
      })
    },
    // 查询申报状态
    async queryStatus() {
      // false是当前还没有申报
      const { code = '', data } = await queryStatus({ ...this.form, sbsz: 'sds' })
      if (code === '0') {
        this.querySbStatus = data
      }
    },
  },

  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
    height() {
      return window.innerHeight - 240;
    },
  }
};
</script>
<style scoped lang="scss">
.search-box {
  padding-top: 12px;
  display: flex;
  justify-content: space-between
}

.el-form {
  flex-basis: calc(100% - 170px);
}

.toolbar {
  padding: 8px 0;

  .toolbar-left {
    color: #ccc;
    font-weight: bold;
  }

}

/deep/ .el-form-item {
  width: calc(33.3% - 10px);
  margin-bottom: 4px !important;

  .el-form-item__label {
    width: 120px;
    font-size: 12px;
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

/deep/ .header-class.vxe-header--column {
  position: relative;
  background-image: linear-gradient(#e8eaec, #e8eaec);

  .vxe-cell--title {
    top: 100%;
    text-align: center;
    transform: translate(-50%, -50%);
    position: absolute;
  }
}

/deep/ .hidden {
  opacity: 1;
}
</style>

