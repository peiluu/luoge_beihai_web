<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <BackBtn path="/foundationaldata/retiredSoldierCollectionDetails" />
    <form-list :columns="columns" :searchKey="propsKey" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" ref="list" @getNextList="getOrgList" @getSearchParam="getSearchParam">
      <template #monthQuota="{ data }">{{ formatMoney(data.monthQuota) }}</template>
      <template #ssq="{ data }"> {{ formatDate('YYYY-MM', data.ssq) }} </template>

      <!-- 中间按钮部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <!-- <el-button @click="addLine({}, 'add')" type="primary">确认申报</el-button>
            <el-button type="primary" @click="previousOffsetDetail">取消申报</el-button> -->
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>
    </form-list>
  </div>
</template>

<script>
import FormList from '@/components/FormList.vue';
import BackBtn from "@/components/BackBtn";

import { getListByUser, detailDownload, getOrgList } from './Api.js'

export default {
  name: 'RetiredSoldierpPreviousOffsetDetail',
  components: {
    FormList, BackBtn
  },
  props: {
  },
  data() {
    return {
      form: {},
      api: require('./Api'),
      param: {},
      loading: false,
      columns: [
        { type: "selection", width: 50 },
        { title: '序号', type: "index", width: 50 },
        { title: "纳税主体名称", width: 180, dataIndex: "nsrmc" },
        { title: "纳税主体识别号", dataIndex: "nsrsbh", width: 180, },
        { title: "会计主体名称", width: 200, dataIndex: "orgname" },
        { title: "税款所属期", width: 100, dataIndex: "ssq", slot: 'ssq', align: 'center' },
        { title: "姓名", width: 100, dataIndex: "idName" },
        { title: "身份证号码", width: 180, dataIndex: "idCard", },
        { title: "抵扣金额", width: 100, dataIndex: "monthQuota", slot: 'monthQuota', align: 'right' },
      ],
      searchList: [
        {
          label: "纳税主体名称",
          key: "nsrsbh",
          val: '',
          type: "select",
          placeholder: '请选择',
          options: [],
          isQueryNext: true,
          nextPropskey: 'orgid'
        },
        {
          label: "会计主体",
          key: "orgid",
          val: "",
          type: "select",
          placeholder: '请选择'
        },
        {
          label: "税款所属期",
          key: "ssq",
          val: [],
          type: "monthrange",
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }
        },
        {
          label: "退役士兵姓名",
          key: "idName",
          val: "",
          type: "input",
          placeholder: '请输入'
        },
      ],
      queryParam: {},
      pickerOptions: {},
      propsKey: '',
    };

  },
  mounted() {
    this.getListByUser();
  },
  computed: {
    height() {
      return window.innerHeight - 350
    },
    contentHeight() {
      return window.innerHeight - 132;
    }
  },

  methods: {
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
        this.getOrgList('')
      }
    },
    //抵减明细
    async previousOffsetDetail() {
      this.$router.push({
        path: "/foundationaldata/previousOffsetDetail",
        query: this.$route.query
      });
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
    },
    handleDelete(data) {
      this.$refs.list.deleteData(data);
    },
    // 获取会计主体
    async getOrgList(nsrsbh) {
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
        this.propsKey = nsrsbh
      }
    },
    getSearchParam(param) {
      this.queryParam = param;
    },
    //导出
    async handleExport() {
      const fileName = `退役士兵抵减明细.xlsx`
      await detailDownload({
        reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999 },
        fileName
      })
    },
  }
};
</script>
