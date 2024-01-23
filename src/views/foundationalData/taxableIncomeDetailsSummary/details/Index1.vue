<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <div>
      <vxe-button icon="el-icon-back" size="mini" @click="handleBack">返回</vxe-button>
    </div>
    <form-list :columns="columns" :searchKey="propsKey" :searchRow="searchList" :api="api" :firstLoading="false" :param="param" :height="height" v-loading="loading" @getSearchParam="getSearchParam" @getNextList="getOrgList" ref="list">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button @click="fetchDetail" type="primary" :disabled="!queryParam.nsrsbh">取数</el-button>
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>
      <template #bqdffse="{ data }">{{ formatMoney(data.bqdffse) }}</template>
      <template #bqjffse="{ data }">{{ formatMoney(data.bqjffse) }}</template>
      <template #jzjtje="{ data }">{{ formatMoney(data.jzjtje) }}</template>
      <template #srssq="{ data }"> {{ dateFormat('YYYY-MM', data.srssq) }} </template>
    </form-list>
  </div>
</template>

<script>
import moment from "moment";
import FormList from '@/components/FormList.vue';
import { zsxmList } from '../../constant';
import { getCurrentSsq } from "@/utils/tool";

import { getListByUser, getOrgList, exportIncomeDetailList, fetchDetail } from './Api.js'

export default {
  name: 'TaxableIncomeDetails',
  components: {
    FormList,
  },
  props: {
    taxBodyId: {},
  },
  data() {
    return {
      editForm: {},
      param: {},
      api: require('./Api'),
      loading: false,
      propsKey: '',
      columnsNormal: [
        { type: "selection", width: 50 },
        { title: '序号', type: "index", width: 50 },
        { title: "纳税主体名称", width: 210, dataIndex: "name", },
        { title: "会计主体名称", width: 210, dataIndex: "orgName", },
        { title: "税款所属期", width: 100, dataIndex: "srssq", slot: 'srssq', align: 'center' },
        { title: "科目编码", width: 118, dataIndex: "kmbm" },
        { title: "科目名称", width: 168, dataIndex: "kmmc" },
        { title: "科目类型", width: 118, dataIndex: "kmlxMc" },
        { title: "本期贷方发生额", width: 108, dataIndex: "bqdffse", slot: 'bqdffse', align: 'right' },
        { title: "本期借方发生额", width: 108, dataIndex: "bqjffse", slot: 'bqjffse', align: 'right' },
        { title: "其中：即征即退项目收入金额", width: 180, dataIndex: "jzjtje", slot: 'jzjtje', align: 'right' },
        { title: "征税项目", width: 100, dataIndex: "zsxmMc", },
        { title: "税率", width: 100, dataIndex: "slv", align: 'center' },
        { title: "计税方式", width: 100, dataIndex: "jsfsMc", align: 'center' },
      ],
      columnsSmall: [
        { type: "selection", width: 50 },
        { title: '序号', type: "index", width: 50 },
        { title: "纳税主体名称", width: 210, dataIndex: "name", },
        { title: "会计主体名称", width: 210, dataIndex: "orgName", },
        { title: "税款所属期", width: 100, dataIndex: "srssq", slot: 'srssq', align: 'center' },
        { title: "科目编码", width: 118, dataIndex: "kmbm" },
        { title: "科目名称", width: 168, dataIndex: "kmmc" },
        { title: "科目类型", width: 118, dataIndex: "kmlxMc" },
        { title: "本期贷方发生额", width: 108, dataIndex: "bqdffse", slot: 'bqdffse', align: 'right' },
        { title: "本期借方发生额", width: 108, dataIndex: "bqjffse", slot: 'bqjffse', align: 'right' },
        // { title: "其中：即征即退项目收入金额", width: 180, dataIndex: "jzjtje", slot: 'jzjtje', align: 'right' },
        { title: "征税项目", width: 100, dataIndex: "zsxmMc", },
        { title: "税率", width: 100, dataIndex: "slv", align: 'center' },
        { title: "计税方式", width: 100, dataIndex: "jsfsMc", align: 'center' },
      ],
      searchList: [
        { label: "纳税主体名称", key: "nsrsbh", val: '', type: "select", placeholder: '请选择', options: [], isQueryNext: true, nextPropskey: 'orgid' },
        { label: "会计主体名称", key: "orgid", val: "", type: "select", placeholder: '请选择' },
        { label: "税款所属期", key: "srssq", val: "", type: "monthrange", placeholder: '请选择' },
        { label: "征税项目", key: "zsxm", val: "", type: "select", placeholder: '请选择', options: [{ value: '', label: '全部' }].concat(zsxmList) },
      ],
      taxBodyList: [],
      queryParam: {},
      zsxmList,
      nsrlx: 1,
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
    columns() {
      return this.nsrlx == 2 ? this.columnsSmall : this.columnsNormal
    },
    height() {
      return window.innerHeight - 310
    },
    contentHeight() {
      return window.innerHeight - 132;
    },
  },

  methods: {
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({})
      if (code === '0') {
        this.taxBodyList = data;
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
      const { zzstbzq = '', nsrlx = '' } = this.taxBodyList.find((item) => item.nsrsbh === nsrsbh) || {}
      this.param.tbzq = zzstbzq
      this.nsrlx = nsrlx;
      const { code = '', data = [] } = await getOrgList({ nsrsbh, isInvoice: 'N' })
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
        const { ssq, tbzq, id } = this.$route.query
        this.propsKey = `${nsrsbh}_${ssq}_${tbzq}_${id}`
      }
    },

    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh, id } = this.$route.query
      this.$set(this.param, 'nsrsbh', nsrsbh)
      this.$set(this.param, 'hzId', id)
      this.searchList[0].val = nsrsbh
      this.getList(this.param)
      this.getOrgList(nsrsbh)
    },
    // 导出
    async handleExport() {
      const fileName = `应税收入明细.xlsx`;
      await exportIncomeDetailList({
        reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999 },
        fileName
      })
    },
    async fetchDetail() {
      const { code = '' } = await fetchDetail(this.queryParam)
      if (code === '0') {
        this.$message.success('操作成功')
        this.getList()
      }
    },
    getList(param) {
      this.$refs.list && this.$refs.list.reload(param)
    },

    getSearchParam(param) {
      this.queryParam = param;
      // setTimeout(() => {
      //   this.propskey = `${param.nsrsbh}`
      // }, 1000)
    },
    handleBack() {
      this.$router.push({
        path: "/foundationaldata/taxableIncomeDetails"
      })
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
    },
    dateFormat(fmt, val) {
      return moment(val).format(fmt)
    },
  }
};
</script>


