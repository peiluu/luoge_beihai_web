<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <form-list :columns="columns" :searchRow="searchList" :searchKey="propskey" :api="api" :param="param" :height="height" v-loading="loading" @getSearchParam="getSearchParam" :firstLoading="false"
      @getNextList="getNextList" ref="list">
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button @click="fetchPrepaidShare" type="primary" :disabled="querySbStatus">取数</el-button>
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>
      <!-- <template #qylx="{ data }"> {{ qylxMap[data.id] }} </template> -->
      <template #ftybtse="{ data }">{{ formatMoney(data.ftybtse) }}</template>
      <template #ssq="{ data }"> {{ formatAllDate(data.ssq, querySdstbzq) }} </template>
      <template #updatetime="{ data }"> {{ dateFormat('YYYY-mm-dd', data.updatetime) }} </template>
    </form-list>
  </div>
</template>

<script>
import FormList from '@/components/FormList.vue';
import { dateFormat, getCurrentSsq } from "@/utils/tool";
import { queryAllOrg, queryBranchOrg, exportLedger, fetchPrepaidShare, queryStatus } from './Api.js'

export default {
  name: 'BranchPrepaymentAllocationLedger',
  components: {
    FormList,
  },
  data() {
    return {
      param: {},
      api: require('./Api'),
      loading: false,
      queryParam: {},
      propskey: '',
      allOrgList: [],
      querySbStatus: false,
      // 所得税填报周期（季、月） - 查询
      querySdstbzq: '季',
      columns: [
        { title: '序号', type: "index", width: 50 },
        { title: "分机构名称", dataIndex: "nsrmc" },
        { title: "分机构纳税识别号", dataIndex: "nsrsbh", },
        { title: "所属总机构名称", dataIndex: "zjgmc", },
        { title: "税款所属期", dataIndex: "ssq", slot: 'ssq', align: 'center' },
        { title: "本期分摊比例", dataIndex: "ftbl", slot: 'ftbl', align: 'center' },
        { title: "本期分摊应补（退）所得税额", dataIndex: "ftybtse", slot: 'ftybtse', align: 'right' },
        { title: "最后修改时间", dataIndex: "updatetime", slot: 'updatetime', align: 'center' },
      ],
      searchList: [
        {
          label: "所属总机构名称", key: "zjgsbh", val: "", type: "select", placeholder: '请选择', isQueryNext: true,
          nextPropskey: 'nsrsbh'
        },
        {
          label: "分机构名称", key: "nsrsbh", val: '', type: "select",
          placeholder: '请选择', options: [],
        },
        {
          label: "税款所属期",
          key: "ssq",
          val: '',
          type: "quarterPicker",
          isInitDefault: true,
          // nextDateDisabled: true,
          placeholder: '请选择',
          pickerType: '季',
          format: 'yyyyMM',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }
        },
      ],
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
  computed: {
    height() {
      return window.innerHeight - 280
    },
    contentHeight() {
      return window.innerHeight - 132;
    },
  },

  methods: {
    // 查询总机构
    async queryAllOrg() {
      const { code = '', data = [] } = await queryAllOrg({})
      if (code === '0') {
        this.allOrgList = data;
        this.searchList[0].options = (data.map((item) => {
          return {
            ...item,
            value: item.nsrsbh,
            label: item.nsrmc + ' ' + item.nsrsbh
          }
        }))
        if (!this.$route.query.nsrsbh) {
          const { nsrsbh = '', sdstbzq = '', id = '' } = data[0] || {}
          this.querySdstbzq = sdstbzq
          this.param.zjgsbh = nsrsbh
          this.param.zjgsbh = nsrsbh
          this.initDate();
          this.queryBranchOrg(id, nsrsbh);
          this.$refs.list.reload()
        }
      }
    },
    // 查询分支机构
    async queryBranchOrg(id, zjgsbh) {
      const { code = '', data = [] } = await queryBranchOrg({ id })
      if (code === '0') {
        this.searchList[1].options = [{ value: '', label: '全部' }].concat(data.map((item) => {
          return {
            ...item,
            value: item.nsrsbh,
            label: `${item.nsrmc} ${item.nsrsbh}`
          }
        }))
        const { ssq, tbzq } = this.$route.query
        this.searchList[0].val = zjgsbh
        this.param.zjgsbh = zjgsbh
        this.propskey = `${zjgsbh}_${ssq}`
      }
    },
    // 初始化属期时间
    initDate() {
      const { monthValue, quarterValue } = getCurrentSsq();
      const value = this.querySdstbzq == '月' ? monthValue : quarterValue
      this.param.ssq = value
      this.param.tbzq = this.querySdstbzq
      this.searchList[2].val = value
      this.searchList[2].pickerType = this.querySdstbzq || '季'

    },
    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh, ssq, tbzq } = this.$route.query
      this.param.zjgsbh = nsrsbh
      this.param.ssq = ssq
      this.param.tbzq = tbzq
      this.searchList[2].val = ssq
      this.searchList[2].pickerType = tbzq

      this.queryBranchOrg(nsrsbh)
    },
    getNextList(val, type) {
      const { sdstbzq, id, nsrsbh } = this.allOrgList.find((item) => item.nsrsbh === val) || {}
      this.querySdstbzq = sdstbzq
      this.queryBranchOrg(id, nsrsbh)
      if (type !== 'reset' && val != 'all') {
        this.initDate();
      }
    },

    // 导出
    async handleExport() {
      const fileName = `企业所得税分支机构预缴分摊台账.xlsx`
      await exportLedger({
        reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999 },
        fileName
      })
    },
    // 取数
    async fetchPrepaidShare() {
      const { code = '' } = await fetchPrepaidShare(this.queryParam)
      if (code === '0') {
        this.$message.success('操作成功');
        this.getList()
      }
    },
    getList() {
      this.$refs.list && this.$refs.list.handleGetData(this.queryParam)
    },
    getSearchParam(param) {
      this.queryParam = param;
      this.queryStatus()
    },
    // 查询申报状态
    async queryStatus() {
      // false是当前还没有申报
      const { code = '', data } = await queryStatus({ ...this.queryParam, sbsz: 'sds' })
      if (code === '0') {
        this.querySbStatus = data
      }
    },
    dateFormat,
  }
};
</script>
