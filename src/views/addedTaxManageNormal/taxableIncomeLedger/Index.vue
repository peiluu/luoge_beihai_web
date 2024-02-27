<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <LedgerForm @search="handleSearch">
      <template #topTool>
        <el-button @click="updateTaxableIncome" type="primary" :disabled="!tableData.length || !queryParam.orgid || !canUpdate">保存</el-button>
        <el-button @click="fetchTaxableIncome" type="primary" :disabled="!queryParam.nsrsbh || !queryParam.srssq || !canUpdate" :loading="qsLoading">取数</el-button>
        <el-button @click="handleExport" :loading="exLoading">导出</el-button>
      </template>
      <template #customeTable>
        <div v-loading="loading">
          <SmallScaleTaxpayer ref="customeTable" v-if="nsrlx == 2" :canUpdate="canUpdate" :tableData="tableData" :queryParam="queryParam"/>
          <GeneralTaxpayer ref="customeTable" v-else :canUpdate="canUpdate" :tableData="tableData" :queryParam="queryParam" />
        </div>
        
      </template>
    </LedgerForm>
  </div>
</template>

<script>
import { ledgerConfig } from '@/config/constant';
import LedgerForm from '@/components/LedgerForm/Index';
import GeneralTaxpayer from './GeneralTaxpayer';
import SmallScaleTaxpayer from './SmallScaleTaxpayer';
import { queryTaxableIncome, updateTaxableIncome, fetchTaxableIncome, exportLedger, queryStatus } from './Api';


export default {
  name: "TaxableIncomeLedger",
  components: {
    LedgerForm,
    GeneralTaxpayer,
    SmallScaleTaxpayer,
  },
  data() {
    return {
      tableData: [],
      queryParam: {},
      nsrlx: '1',
      querySbStatus: false,
      ledgerConfig,
      zsxmMap: {
        '1': '货物',
        '2': '加工修理修配劳务',
        '3': '服务、不动产和无形资',
        '4': '货物及加工修理修配劳务',
      },
      loading: false,
      qsLoading: false,
      exLoading: false,
    }
  },
  methods: {
    async handleSearch(queryParam) {
      this.queryParam = queryParam
      this.loading = true
      try {
        const { code = '', data = {} } = await queryTaxableIncome(queryParam)
        this.queryStatus()
        if (code === '0') {
          this.nsrlx = data.nsrlx;
          this.tableData = (data.list || []).map((item) => {
            return {
              ...item,
              // 初始值： 其中：即征即退销售额  - 其中：即征即退检查调整销售额
              originHjjzjtxse: item.hjjzjtxse - item.nsjcjzjtxse
            }
          }) || []
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false;
      }
    },
    // 更新台账
    async updateTaxableIncome() {
      const errMap = await this.$refs.customeTable.$refs.xTable.fullValidate(true).catch(errMap => errMap)
      if (errMap) return
      const tableData = this.$refs.customeTable.data;
      if (this.tableData.find((item) => Math.abs(item.nsjcjzjtxse) > Math.abs(item.nsjctzxse))) {
        this.$message.warning('其中：即征即退检查调整销售额不能大于销售额！')
        return;
      }
      const { code = '' } = await updateTaxableIncome(tableData)
      if (code === '0') {
        this.$message.success('操作成功');
        this.handleSearch(this.queryParam)
      }
    },
    // 取数
    async fetchTaxableIncome() {
      try {
        this.qsLoading = true;
        const { code = '' } = await fetchTaxableIncome(this.queryParam)
        if (code === '0') {
          this.$message.success('操作成功');
          this.handleSearch(this.queryParam)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.qsLoading = false;
      }
      
      
    },
    // 导出
    async handleExport() {
      try {
        this.exLoading = true
        const fileName = `应税收入台账.xlsx`
        await exportLedger({
          reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999 },
          fileName
        })
      } catch (error) {
        
      } finally {
        this.exLoading = false
      }
    },
    // 查询申报状态
    async queryStatus() {
      // false是当前还没有申报
      const { code = '', data } = await queryStatus({ ...this.queryParam, ssq: this.queryParam.srssq, sbsz: 'zzs' })
      if (code === '0') {
        this.querySbStatus = data
      }
    },

  },

  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
    canUpdate() {
      return !this.querySbStatus
      // if (this.ledgerConfig.allowUpdatePreData) {
      //   return !this.querySbStatus
      // } else {

      //   console.log(this.judgeIsCurrentSq(this.queryParam.srssq, this.queryParam.tbzq || '月'))
      //   return !this.querySbStatus && this.judgeIsCurrentSq(this.queryParam.srssq, this.queryParam.tbzq || '月')
      // }

    }
    // canUpdate() {
    //   return this.judgeIsCurrentSq(this.queryParam.srssq, this.queryParam.tbzq || '月') && !this.querySbStatus
    // }
  }
};
</script>
<style scoped lang="scss">
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

