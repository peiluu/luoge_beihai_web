<template>
  <div class="main-content" :style="'min-height: ' + contentHeight + 'px;'">
    <LedgerForm @search="handleSearch" :hideOrgid="true">
      <template #topToolLeft v-if="nsrlx == 1">
        <el-tabs class="custom-card-tabs" v-model="activeName" type="card">
          <el-tab-pane name="1" label="税额抵减" />
          <el-tab-pane name="2" label="税额加计抵减" />
        </el-tabs>
        <!-- <div>税款所属期：{{ queryParam.srssq }}</div> -->
      </template>
      <template #topTool>
        <el-button @click="addLine" type="primary" v-if="activeName == 1" :disabled="!canUpdate || !tableData.length">新增</el-button>
        <el-button @click="saveOrUpdateBatch" type="primary" v-if="activeName == 1" :disabled="!canUpdate || !tableData.length">保存</el-button>
        <el-button @click="dataInitialization" type="primary" :disabled="!canUpdate">取数</el-button>
        <el-button @click="handleExport">导出</el-button>
      </template>

      <template #customeTable>
        <div class="custome-table-header">税额抵减（减免）计算表</div>
        <!-- 税额抵减 -->
        <GeneralTaxpayer v-if="activeName == 1" ref="customeTable" :tableData="tableData" :queryParam="queryParam" :canUpdate="canUpdate" :nsrlx="nsrlx" :totalAmount="totalAmount" @handleSearch="handleSearch" />
        <!-- 加计抵减 -->
        <GeneralTaxpayerAdd v-else :tableData="tableData" />
      </template>
    </LedgerForm>

  </div>
</template>

<script>
import { selectLedger, saveOrUpdateBatch, dataInitialization, queryAmountDeduct, fetchAmountDeduct, exportLedgerReductionSheet, downloadAmountDeduct, queryStatus } from './Api';
import LedgerForm from '@/components/LedgerForm/Index';
import GeneralTaxpayer from './GeneralTaxpayer.vue';
import GeneralTaxpayerAdd from './GeneralTaxpayerAdd';
export default {
  name: "TaxDeductionCalculationtTable",
  components: {
    LedgerForm,
    GeneralTaxpayer,
    GeneralTaxpayerAdd,
  },
  data() {
    return {
      activeName: '1',
      nsrlx: '1', // 纳税人类型
      queryParam: {},
      totalAmount: 0,
      tableData: [],
      querySbStatus: false
    };
  },
  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
    canUpdate() {
      return this.judgeIsCurrentSq(this.queryParam.srssq, this.queryParam.tbzq || '月') && !this.querySbStatus
    }
  },
  mounted() {

  },
  watch: {
    activeName() {
      this.handleSearch(this.queryParam)
    }
  },
  methods: {
    async handleSearch(queryParam) {
      this.queryParam = queryParam
      const api = this.activeName == 1 ? selectLedger : queryAmountDeduct;
      this.queryStatus()
      const { code = '', data = {} } = await api(queryParam)
      if (code === '0') {
        // 查询加计抵减
        if (this.activeName == 2) {
          this.tableData = data || []
          return;
        }
        this.tableData = data.reductionSheetVOList || []
        this.nsrlx = data.nsrlx || 1
        this.totalAmount = data.totalAmount || 0

      }
    },
    // 更新台账
    async saveOrUpdateBatch() {
      const errMap = await this.$refs.customeTable.$refs.xTable.fullValidate(true).catch(errMap => errMap)
      if (errMap) return
      const tableData = this.$refs.customeTable.data;
      const { code = '' } = await saveOrUpdateBatch({
        data: tableData
      })
      if (code === '0') {
        this.$message.success('操作成功');
        this.handleSearch(this.queryParam)
      }
    },

    // 取数
    async dataInitialization() {
      const api = this.activeName == 1 ? dataInitialization : fetchAmountDeduct;
      const { code = '' } = await api(this.queryParam)
      if (code === '0') {
        this.$message.success('操作成功');
        this.handleSearch(this.queryParam)
      }
    },

    addLine() {
      this.$refs.customeTable.addLine();
    },
    // 导出
    async handleExport() {
      const fileName = this.activeName == 1 ? `税额抵减计算表.xlsx` : `税额加计抵减计算表.xlsx`
      const api = this.activeName == 1 ? exportLedgerReductionSheet : downloadAmountDeduct
      await api({
        reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999 },
        fileName
      })
    },
    // 查询申报状态
    async queryStatus() {
      // true 是当前还没有申报
      const { code = '', data } = await queryStatus({ ...this.queryParam, ssq: this.queryParam.srssq, sbsz: 'zzs' })
      if (code === '0') {
        this.querySbStatus = data
      }
    },
  },

};
</script>
<style scoped lang="scss">
@import '../../../styles/variables.scss';
/deep/ .custome-table-header {
  width: 100%;
  padding: 8px 0;
  text-align: center;
  color: $mainTextColor;
  font-weight: bold;
  background: #f7f9fd;
  border: 1px solid #e8eaec;
  border-bottom: none;
}

/deep/ .el-dialog__body {

  .el-form-item {
    width: 100%;

    &:first-of-type {
      margin-bottom: 16px;
    }

    .el-form-item__label {
      width: 200px;
    }

    .el-form-item__content {
      width: calc(100% - 240px);

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

.vxe-body--row {}
</style>

