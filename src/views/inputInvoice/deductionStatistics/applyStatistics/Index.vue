<template>
  <div>
    <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
      <div class="content-header">
        <div>纳税人名称： {{ query.nsrmc }}</div>
        <div>纳税人识别号： {{ query.nsrsbh }}</div>
        <div>所属月份： {{ skssqLabel }}</div>
      </div>
      <!-- 抵扣类勾选统计结果 -->
      <DataTable :columns="invoiceCheckStatisticColumns" :tableData="invoiceCheckStatisticList" :title="'抵扣类勾选统计结果'">
        <template #fplx="{ data }"><span class="column-left">{{ inputFplxMap[data.fplx] }}</span> </template>

      </DataTable>
      <!-- <DataTable :columns="columns2" :tableData="tableData" :title="'增值税申报进项抵扣汇总'" /> -->

      <DataTable :columns="problemInvoiceColumns" :tableData="problemInvoice" :title="'问题发票'">
        <template #fplx="{ data }"> {{ inputFplxMap[data.fplx] }} </template>

        <template #fpzt="{ data }">{{ data.fpzt ? fpztMap[data.fpzt] : '' }} </template>
        <template #ycpzzt="{ data }"> {{ data.ycpzzt == '01' ? '正常' : data.ycpzzt == '02' ? '异常' : '疑似异常' }}</template>
      </DataTable>
    </div>

    <div class="fixed-footer">
      <el-button @click="hanldeCose">关闭</el-button>
      <el-button type="success" v-if="operateType == 'apply'" @click="applyConfirmationDeduction(1)">确认统计</el-button>
      <el-button type="success" v-if="operateType == 'cancel'" @click="applyConfirmationDeduction(2)">撤销确认统计</el-button>
    </div>

  </div>
</template>

<script>
import { fplxMap, inputFplxMap } from '@/config/constant.js'
import { fpztMap } from '@/views/inputInvoice/constant'
import { queryHistoryInvoiceCheckStatistics, queryProblemInvoice, applyConfirmationDeduction } from './Api'
import DataTable from './DataTable.vue';
export default {
  name: "StatisticsTable",
  components: {
    DataTable,
  },
  data() {
    return {
      api: require('./Api'),
      loading: false,
      param: {},
      tableData: [],
      fplxMap,
      inputFplxMap,
      invoiceCheckStatisticList: [],
      problemInvoice: [],
      fpztMap,
      invoiceCheckStatisticColumns: [
        { title: "发票类型", dataIndex: "fplx", width: 180, slot: 'fplx', },
        { title: "合计份数", dataIndex: "hjfs", width: 100, align: 'right', color: '#8DBAF9' },
        { title: "有效抵扣税额合计", dataIndex: "hjyxdkse", width: 100, align: 'right' },
        { title: "出口转内销证明份数", dataIndex: "ckznxzmfs", width: 100, align: 'right', color: '#8DBAF9' },
        { title: "出口转内销证明有效抵扣税额合计", dataIndex: "ckznxzmyxdksehj", width: 150, align: 'right' },
        { title: "其他发票份数", dataIndex: "qtfpfs", width: 100, align: 'right', color: '#8DBAF9' },
        { title: "其他发票份数有效抵扣税额合计", dataIndex: "qtfpfsyxdksehj", width: 150, align: 'right' },
      ],
      columns2: [
        { title: "发票类型", dataIndex: "fplx", slot: 'fplx' },
        { title: "份数", dataIndex: "nsrsbh", align: 'right', color: '#8DBAF9' },
        { title: "金额", dataIndex: "nsrsbh", align: 'right' },
        { title: "税额", dataIndex: "nsrsbh", align: 'right' },
      ],
      problemInvoiceColumns: [
        { title: "发票类型", dataIndex: "fplx", slot: 'fplx', },
        { title: "发票号码", dataIndex: "fphm" },
        { title: "发票状态", dataIndex: "fpzt", slot: 'fpzt' },
        { title: "异常凭证", dataIndex: "ycpzzt", slot: 'ycpzzt' }]
    };
  },
  computed: {
    contentHeight() {
      return window.innerHeight - 160
    },
    query() {
      return this.$route.query
    },
    operateType() {
      return this.$route.query.operateType
    },
    skssqLabel() {
      return this.$route.query.skssq ? this.$route.query.skssq.slice(0, 4) + '年' + this.$route.query.skssq.slice(4) + '月' : ''
    },

  },
  activated() {
    const { nsrsbh, skssq, pclsh } = this.$route.query;
    const param = { nsrsbh, skssq, pclsh }
    this.queryHistoryInvoiceCheckStatistics(param)
    this.queryProblemInvoice(param)

  },
  methods: {
    // 查看统计表 - 抵扣类勾选统计结果
    async queryHistoryInvoiceCheckStatistics(param) {
      const { code = '', data = [] } = await queryHistoryInvoiceCheckStatistics(param)
      if (code === '0') {
        this.invoiceCheckStatisticList = data;
      }
    },

    // 问题发票查查询
    async queryProblemInvoice(param) {
      const { code = '', data = [] } = await queryProblemInvoice(param)
      if (code === '0') {
        this.problemInvoice = data
      }
    },

    // 确认统计
    async applyConfirmationDeduction(sqbz) {
      this.$confirm(`确定${sqbz === 1 ? '确认统计' : '撤销确认统计'}吗`, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code = '' } = await applyConfirmationDeduction({
          gfsbh: this.$route.query.nsrsbh,
          sqbz
        })
        if (code === '0') {
          this.hanldeCose();
        }
      });
    },
    hanldeCose() {
      // 选择主体进入 || 直接从历史抵扣统计与明细进去 formHistoryStatistics, 返回的时候不需要带参数 纳税人信息
      const path = ['apply', 'statisticsTable'].includes(this.operateType) ? '/deductionStatistics/list' : '/deductionStatistics/historyStatistics'
      // const query = this.operateType == 'formHistoryStatistics' ? {} : this.$route.query
      this.$router.push({
        path,
        query: this.$route.query
      })
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
    },
  },

};
</script>


<style lang="scss" scoped>
@import '../../../../styles/variables.scss';
.main-content {
  // margin-bottom: 32px;
}

.content-header {
  font-size: 14px;
  padding: 0 16px;
  display: flex;
  color: $mainTextColor;

  div {
    flex-basis: 33%;
  }
}
</style>
