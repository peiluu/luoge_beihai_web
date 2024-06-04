<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <BackBtn
      :path="operateType == 'statisticsDetails' ? '/deductionStatistics/list' : '/deductionStatistics/historyStatistics'"
      :query="$route.query" />

    <form-list :columns="columns" :searchRow="searchList" :api="api" :param="param" :height="height"
      @getSearchParam="getSearchParam" v-loading="loading" ref="list" v-if="isShow">
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right"><el-button @click="exportInvoiceCheckStatistics">导出查询结果</el-button></div>

        </div>
      </template>
      <template #myscope="row">
        <el-button @click="previewPdf(row.data)">查看</el-button>
        <!-- <el-button @click="previewPdf(row.data)">联查凭证</el-button> -->
      </template>

      <template #cljg="{ data }"> {{ data.cljg == '01' ? '已勾选' : '未勾选' }}</template>
      <template #sfycpz="{ data }"> {{ data.sfycpz == '01' ? '正常' : data.sfycpz == '02' ? '异常' : data.sfycpz == '03' ?
    '疑似异常' : '' }}</template>
      <template #fplx="{ data }"> {{ inputFplxMap[data.fplx] }} </template>
      <template #jshj="{ data }"> {{ formatMoney(data.jshj) }} </template>
      <template #hjse="{ data }"> {{ formatMoney(data.hjse) }} </template>
      <template #kprq="{ data }"> {{ dateFormat('YYYY-MM-DD', data.kprq) }} </template>
      <template #gxsj="{ data }"> {{ dateFormat('YYYY-MM-DD', data.gxsj) }} </template>


      <template #fpzt="{ data }">
        {{
    data.fpzt == '0'
      ? '正常'
      : data.fpzt == '1'
        ? '失控'
        : data.fpzt == '2'
          ? '作废'
          : data.fpzt == '3'
            ? '已红冲'
            : data.fpzt == '7'
              ? '部分红冲'
              : data.fpzt == '8'
                ? '全额红冲' : ''
  }}
      </template>
    </form-list>
  </div>
</template>

<script>
import { previewPdf, dateFormat } from "@/utils/tool";
import { inputFplxList, inputFplxMap } from '@/config/constant'
import FormList from '@/components/FormList.vue';
import BackBtn from "@/components/BackBtn";

import { getListByUser, exportInvoiceCheckStatistics } from './Api'

import moment from "moment";

export default {
  name: 'statisticsDetails',
  components: {
    FormList, BackBtn
  },
  data() {
    return {
      api: require('./Api'),
      param: {},
      inputFplxMap,
      loading: false,
      queryParam: {},
      columns: [
        { title: '序号', type: "index", width: 50, fixed: 'left', },
        { title: "发票种类", width: 150, dataIndex: "fplx", slot: 'fplx' },
        { title: "发票号码", width: 150, dataIndex: "zzfphm", },
        { title: "发票代码", width: 100, dataIndex: "zzfpDm", },
        { title: "开票日期", width: 100, dataIndex: "kprq", slot: 'kprq', align: 'center' },
        { title: "销售方名称", dataIndex: "xsfmc", width: 120, },
        { title: "销售方识别号", dataIndex: "xsfnsrsbh", width: 150, },
        // { title: "纳税主体", dataIndex: "hjje", },
        // { title: "确认标记", dataIndex: "hjse", },
        { title: "价税合计", width: 100, dataIndex: "jshj", slot: 'jshj', align: 'right' },
        { title: "税额", width: 100, dataIndex: "hjse", slot: 'hjse', align: 'right' },
        { title: "发票状态", width: 100, dataIndex: "fpzt", slot: 'fpzt', align: 'center' },
        { title: "勾选时间", width: 100, dataIndex: "gxsj", slot: 'gxsj', align: 'center' },
        { title: "勾选人", width: 100, dataIndex: "createrName" },
        // {
        //   title: "操作",
        //   key: "action",
        //   width: 80,
        //   fixed: 'right',
        //   scopedSlots: { customRender: "action" },
        // },
      ],
      searchList: [
        {
          label: "纳税主体",
          key: "gfsbh",
          val: "",
          type: "select",
          options: [],
        },
        {
          label: "发票种类",
          key: "fplx",
          val: '',
          type: "select",
          options: [{ value: '', label: '全部' }].concat(inputFplxList)
        },
        {
          label: "所属月份",
          key: "skssq",
          val: '',
          type: "month",
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }
        },
      ],
      isShow:true,
    };
  },
  activated() {
   
    this.$set(this.param,'skssq',moment(this.$route.query.skssq).format('YYYY-MM'))
    this.$set(this.param,'gfsbh',this.$route.query.nsrsbh);
    this.isShow = false
    this.isShow = true
    this.$nextTick(()=>{
      
    })
    //this.param.skssq = moment(this.$route.query.skssq).format('YYYY-MM')
    //this.param.gfsbh = this.$route.query.nsrsbh
    this.getListByUser();
    
  },

  computed: {
    height() {
      return window.innerHeight - 280;
    },
    contentHeight() {
      return window.innerHeight - 132;
    },
    operateType() {
      return this.$route.query.operateType
    },
  },

  methods: {
    // 预览pdf
    previewPdf,
    dateFormat(fmt, val) {
      return val ? moment(val).format(fmt) : ''
    },
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({})
      const index = this.searchList.findIndex((item) => item.key === 'gfsbh');
      if (code === '0') {
        this.searchList[index].options = data.map((item) => {
          return {
            ...item,
            value: item.nsrsbh,
            label: item.nsrmc
          }
        })
      }
    },
    getSearchParam(param) {
      console.log(param)
      this.queryParam = param;
    },
    async exportInvoiceCheckStatistics() {
      const fileName = `抵扣统计明细.xlsx`
      await exportInvoiceCheckStatistics({
        reqData: { ...this.queryParam, level: this.activeName },
        fileName
      })
    },
  }
};
</script>
