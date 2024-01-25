<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <form-list :columns="columns" :searchKey="propsKey" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" @getSearchParam="getSearchParam" @getNextList="getOrgList"
      :firstLoading="false" ref="list">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <template #xmje="{ data }">{{ formatMoney(data.xmje) }}</template>
      <template #xmse="{ data }">{{ formatMoney(data.xmse) }}</template>
      <template #kplx="{ data }">{{ data.kplx == 1 ? '红票' : '蓝票' }}</template>
      <template #kprq="{ data }"> {{ dateFormat('YYYY-mm-dd', data.kprq) }} </template>
    </form-list>
  </div>
</template>

<script>
import FormList from '@/components/FormList.vue';
import { dateFormat } from "@/utils/tool";
import { zsxmList, fplxList, jsfsList, slvList } from '../constant'
import { getListByUser, getOrgList, exportInvoiceDetailList } from './Api.js'

export default {
  name: 'OutputInvoiceDetails',
  components: {
    FormList,
  },
  data() {
    return {
      param: {},
      api: require('./Api'),
      loading: false,
      columns: [
        { type: "selection", width: 50 },
        { title: '序号', type: "index", width: 50 },
        { title: "纳税主体名称", width: 200, dataIndex: "nsrmc", },
        { title: "会计主体名称", width: 200, dataIndex: "orgName", },
        { title: "发票种类", width: 150, dataIndex: "fplxMc", },
        { title: "发票号码", width: 150, dataIndex: "fphm", },
        { title: "开票类型", width: 100, dataIndex: "kplx", slot: 'kplx' },
        { title: "开票日期", width: 100, dataIndex: "kprq", slot: 'kprq', align: 'center' },
        { title: "发票金额", width: 100, dataIndex: "xmje", slot: 'xmje', align: 'right' },
        { title: "发票税额", width: 100, dataIndex: "se", slot: 'se', align: 'right' },
        { title: "税率", width: 100, dataIndex: "sl", },
        { title: "征税项目", width: 100, dataIndex: "zsxmMc", },
        { title: "税款所属期", width: 100, dataIndex: "srssq", align: 'center' },
        { title: "计税方式", width: 100, dataIndex: "jsfsMc", align: 'center' },
      ],
      searchList: [
        { label: "纳税主体名称", key: "nsrsbh", val: "", type: "select", placeholder: '请选择', options: [], isQueryNext: true, nextPropskey: 'orgid' },
        { label: "会计主体名称", key: "orgid", val: "", type: "select", placeholder: '请选择' },
        {
          label: "开票日期", key: "kprq", val: [], type: "daterange", placeholder: '请选择', pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }
        },
        { label: "发票种类", key: "fplx", val: "", type: "select", placeholder: '请选择', options: [{ value: '', label: '全部' }].concat(fplxList) },
        { label: "发票号码", key: "fphm", val: "", type: "input", placeholder: '请输入' },
        { label: "计税方式", key: "jsfs", val: "", type: "select", placeholder: '请选择', options: [{ value: '', label: '全部' }].concat(jsfsList) },
        { label: "征税项目", key: "zsxm", val: "", type: "select", placeholder: '请选择', options: [{ value: '', label: '全部' }].concat(zsxmList) },
        { label: "税率", key: "sl", val: "", type: "select", placeholder: '请选择', options: [{ value: '', label: '全部' }].concat(slvList) },
      ],
      taxBodyList: [],
      queryParam: {},
      propsKey: '',
    };
  },
  activated() {
    if (this.$route.query.nsrsbh) {
      this.initQueryParam()
    }
  },
  mounted() {
    this.getListByUser()
  },

  computed: {
    height() {
      return window.innerHeight - 290
    },
    contentHeight() {
      return window.innerHeight - 132;
    },
  },

  methods: {
    dateFormat,
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({})
      if (code === '0') {
        this.searchList[0].options = [{ value: "", label: "全部" }].concat(data.map((item) => {
          return {
            ...item,
            value: item.nsrsbh,
            label: `${item.nsrmc} ${item.nsrsbh}`
          }
        }))
        if (!this.$route.query.nsrsbh) {
          // 直接访问
          this.getOrgList('')
          this.getList()
        }
      }
    },
    // 获取会计主体
    async getOrgList(nsrsbh) {
      const { code = '', data = [] } = await getOrgList({
        nsrsbh,
        isInvoice: 'N' // 关联受票组织
      })
      if (code === '0') {
        this.searchList[1].options = [{ value: "", label: "全部" }].concat(data.map((item) => {
          return {
            ...item,
            value: item.id,
            label: item.name + ' ' + item.code
          }
        }))
        this.searchList[1].val = '';
        this.param.orgid = ''
        this.$set(this.param, 'nsrsbh', nsrsbh)
        const { ssq, tbzq } = this.$route.query
        this.propsKey = `${nsrsbh}_${ssq}_${tbzq}`
      }
    },
    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh } = this.$route.query
      this.$set(this.param, 'nsrsbh', nsrsbh)
      this.searchList[0].val = nsrsbh
      this.$refs.list.handleGetData(this.param)
      this.getOrgList(nsrsbh)
    },
    // 导出
    async handleExport() {
      const fileName = `销项发票明细.xlsx`
      await exportInvoiceDetailList({
        reqData: {
          ...this.queryParam
        },
        fileName
      })
    },
    getList() {
      this.$refs.list && this.$refs.list.reload()
    },
    getSearchParam(param) {
      this.queryParam = param;
    },
  }
};
</script>
