<template>
  <div class="main-content">
    <div class="search-box">
      <el-form :key="searchKey" :model="form" :inline="true" ref="searchForm">
        <el-form-item label="纳税主体名称" prop="nsrsbh">
          <el-select v-model="form.nsrsbh" filterable placeholder="请选择" style="width:140px;" @change="initDate">
            <el-option v-for="item in taxBodyList" :key="item.nsrsbh" :label="`${item.nsrmc} ${item.nsrsbh}`" :value="item.nsrsbh" />
          </el-select>
        </el-form-item>
        <el-form-item label="税款所属期" prop="ssq">
          <QuarterDatePicker :key="querySdstbzq" :pickerType="querySdstbzq" propsParam="ssq" :defaultValue="form.ssq" :isInitDefault="true" @getQuarterPickerFrom="getQuarterPickerFrom"
            ref="quarterDatePicker" />
        </el-form-item>
      </el-form>
      <div class="search-btns">
        <el-button type="success" @click="handleSearch">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-left" />
      <div class="toolbar-right">
        <el-button @click="initialization" type="primary" :disabled="!canUpdate">取数</el-button>
        <el-button @click="handleExport" type="primary">导出</el-button>
      </div>
    </div>
    <div class="custom-table" v-loading="loading">
      <table border class="content-table">
        <thead>
          <tr>
            <th colspan="5">所得税预缴计算表</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td width="80">序号</td>
            <td width="280">项目</td>
            <td width="280">本年累计发生数</td>
          </tr>
          <tr v-for="(item, index) in tableData" :key="index">
            <td width="80">{{ index + 1 }}</td>
            <td width="280">{{ item.xmmc }}</td>
            <td width="280">{{ formatMoney(item.value) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import QuarterDatePicker from '@/components/QuarterDatePicker.vue'
import { getCurrentSsq } from "@/utils/tool";

import { initialization, getListByUser, queryLedgerSdsYjskjs, exportLedger, queryStatus } from './Api';

export default {
  name: "IncomeTaxPrepaymentCalculationTable",
  components: {
    QuarterDatePicker
  },
  data() {
    return {
      tableData: [
        { xmmc: '营业收入', propKey: 'yysr' },
        { xmmc: '营业成本', propKey: 'yycb' },
        // { xmmc: '营业收入', propKey: 'yysr' },
        { xmmc: '利润总额', propKey: 'lrze' },
        { xmmc: '特定业务计算的应纳税所得额', propKey: 'tdywynsde' },
        { xmmc: '不征税收入', propKey: 'bzssr' },
        { xmmc: '资产加速折旧、摊销调减额', propKey: 'zczjtxtje' },
        { xmmc: '免税收入', propKey: 'mssr' },
        { xmmc: '减计收入', propKey: 'jjsr' },
        { xmmc: '加计扣除', propKey: 'jjkc' },
        { xmmc: '所得减免', propKey: 'sdjm' },
        { xmmc: '弥补以前年度亏损', propKey: 'mbyqndks' },
        { xmmc: '实际利润额', propKey: 'sjlre' },
        { xmmc: '应纳所得税额', propKey: 'ynssde' },
        { xmmc: '减免所得税额', propKey: 'jmsde' },
        { xmmc: '本年实际已缴纳税额', propKey: 'bnsjyjse' },
        { xmmc: '特定业务预缴所得税额', propKey: 'tdywyjsdse' },
        { xmmc: '本期应补退税额', propKey: 'bqybtse' },
      ],
      form: {
        ssq: '',
        nsrsbh: ''
      },
      taxBodyList: [],
      querySdstbzq: '季',
      searchKey: '',
      querySbStatus: false,
      loading: false
    }
  },
  mounted() {
    this.getListByUser()
  },
  activated() {
    if (this.$route.query.nsrsbh) {
      this.initQueryParam()
    }
  },
  methods: {
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({})
      if (code === '0') {
        this.taxBodyList = data
        if (!this.$route.query.nsrsbh && data.length) {
          this.initForm();
        }
      }
    },

    async handleSearch() {
      this.loading = true;
      try{
        const { code = '', data = {} } = await queryLedgerSdsYjskjs(this.form)
          if (code === '0') {
            this.queryStatus()
            this.tableData = this.tableData.map((item) => {
              return {
                ...item,
                value: data[item.propKey]
              }
            })
          }
      }finally{
        this.loading = false;
      }
      
    },

    // 取数
    async initialization() {
      const { code = '' } = await initialization(this.form)
      if (code === '0') {
        this.$message.success('操作成功');
        this.handleSearch()
      }
    },
    resetForm() {
      this.$refs.searchForm.resetFields();
      this.$refs.quarterDatePicker.reset()
      this.form = {}
      this.handleSearch()
    },
    initForm() {
      const nsrsbh = ( this.taxBodyList && this.taxBodyList.length > 0 ) ? this.taxBodyList[0].nsrsbh : '';
      this.form.nsrsbh = nsrsbh;
      this.initDate(nsrsbh)
      this.handleSearch();
    },
    // 初始化属期时间
    initDate(val) {
      const { sdstbzq } = this.taxBodyList.find((item) => item.nsrsbh === val) || {}
      this.querySdstbzq = sdstbzq || '月'
      const { monthValue, quarterValue } = getCurrentSsq('', 1);
      const value = this.querySdstbzq == '月' ? monthValue : quarterValue
      this.form.ssq = value
      this.form.tbzq = sdstbzq
      this.searchKey = `${val}_${value}`
    },
    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh, ssq, tbzq } = this.$route.query
      this.form.nsrsbh = nsrsbh;
      this.form.ssq = ssq
      this.querySdstbzq = tbzq
      this.form.tbzq = tbzq
      this.handleSearch()
    },
    getQuarterPickerFrom(propsParam, data) {
      this.form[propsParam] = data
    },
    // 导出
    async handleExport() {
      const fileName = `所得税预缴计算表.xlsx`
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
    canUpdate() {
      return !this.querySbStatus
    }
  }
};
</script>
<style scoped lang="scss">
@import '../../../styles/variables.scss';
.search-box {
  display: flex;
  padding-top: 12px;
  justify-content: space-between
}

.toolbar {
  padding: 8px 0;
}

.el-form {
  flex-basis: calc(100% - 170px);

  /deep/ .el-form-item {
    width: calc(33.3% - 10px);
    margin-bottom: 4px !important;

    .el-form-item__label {
      width: 120px;
      font-size: 12px;
    }

    .el-form-item__content {
      width: calc(100% - 120px);

      .el-select {
        width: 100% !important;
      }
    }
  }
}

.custom-table {
  margin-bottom: 12px;
}

.content-table {
  width: 100%;
  text-align: center;
  border: 1px solid #e8eaec;
  color: $mainTextColor;

  thead {
    color: $mainTextColor;
    font-weight: normal;
    background: #f7f9fd;
  }

  td,
  th {
    height: 40px;
  }

  tr:first-of-type {
    background: #f7f9fd;
  }

  .hidden {
    display: none;
  }
}
</style>

