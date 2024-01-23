<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <form-list :columns="columns" :searchKey="propsKey" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" @getSearchParam="getSearchParam" @getNextList="getOrgList" ref="list"
      :firstLoading="false">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <!-- <el-button @click="goToDetail">明细</el-button> -->
            <el-button @click="fetchSummaryDetail" type="primary" :disabled="!queryParam.nsrsbh">取数</el-button>
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <template #bqdffse="{ data }">{{ formatMoney(data.bqdffse) }}</template>
      <template #bqjffse="{ data }">{{ formatMoney(data.bqjffse) }}</template>
      <template #zctz="{ data }">{{ formatMoney(data.zctz) }}</template>
      <template #bqyssrhj="{ data }">{{ formatMoney(data.bqyssrhj) }}</template>
      <template #jzjtje="{ data }">{{ formatMoney(data.jzjtje) }}</template>

      <template #srssq="{ data }"> {{ dateFormat('YYYY-MM', data.srssq) }} </template>

      <template #myscope="{ data }">

        <el-button @click="update(data)" type="primary">调整</el-button>
        <!-- <el-popover placement="left" trigger="hover" popper-class="customPopper">
          <template>
            <el-button @click="update(data)" type="primary">调整</el-button>
            <el-button @click="goToDetail(data)">明细</el-button>
          </template>
          <el-button slot="reference">操作</el-button>
        </el-popover> -->
      </template>
    </form-list>

    <el-dialog title="调整" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <el-form :inline="true" :model="editForm" :rules="rules" ref="ruleForm" class="dialog-form">

        <el-form-item label="自查调整（不含税）收入金额" prop="zctz">
          <el-input v-model="editForm.zctz" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="其中：即征即退项目收入金额" prop="jzjtje" v-if="editForm.nsrlx != 2">
          <el-input v-model="editForm.jzjtje" placeholder="请输入" />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="success" @click="submit">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import FormList from '@/components/FormList.vue';
import { getssqArr } from "@/utils/tool";

import { zsxmList } from '../constant'
import { getListByUser, exportIncomeDetailInfo, getOrgList, adjustAmountInfo, fetchSummaryDetail } from './Api.js'

export default {
  name: 'TaxableIncomeDetailsSummary',
  components: {
    FormList,
  },
  data() {
    return {
      editForm: {},
      param: {},
      api: require('./Api'),
      loading: false,
      propsKey: '',
      // 一般纳税人
      columnsNormal: [
        { type: "selection", width: 50 },
        { title: '序号', type: "index", width: 50 },
        { title: "纳税主体名称", width: 210, dataIndex: "name", },
        { title: "会计主体名称", width: 210, dataIndex: "orgName", },
        { title: "税款所属期", width: 100, dataIndex: "srssq", slot: 'srssq', align: 'center' },
        { title: "本期贷方发生额", width: 120, dataIndex: "bqdffse", slot: 'bqdffse', align: 'right' },
        { title: "本期借方发生额", width: 120, dataIndex: "bqjffse", slot: 'bqjffse', align: 'right' },
        { title: "自查调整（不含税）", width: 150, dataIndex: "zctz", slot: 'zctz', align: 'right' },
        { title: "本期应税收入合计", width: 120, dataIndex: "bqyssrhj", slot: 'bqyssrhj', align: 'right' },
        { title: "其中：即征即退项目收入金额", width: 180, dataIndex: "jzjtje", slot: 'jzjtje', align: 'right' },
        { title: "征税项目", width: 100, dataIndex: "zsxmMc", align: 'center' },
        { title: "税率", width: 90, dataIndex: "slv", align: 'center' },
        { title: "计税方式", width: 100, dataIndex: "jsfsMc", align: 'center' },
        {
          title: "操作",
          key: "action",
          width: 80,
          fixed: 'right',
          scopedSlots: { customRender: "action" }
        }
      ],
      // 小规模纳税人
      columnsSmall: [
        { type: "selection", width: 50 },
        { title: '序号', type: "index", width: 50 },
        { title: "纳税主体名称", width: 210, dataIndex: "name", },
        { title: "会计主体名称", width: 210, dataIndex: "orgName", },
        { title: "税款所属期", width: 100, dataIndex: "srssq", slot: 'srssq', align: 'center' },
        { title: "本期贷方发生额", width: 120, dataIndex: "bqdffse", slot: 'bqdffse', align: 'right' },
        { title: "本期借方发生额", width: 120, dataIndex: "bqjffse", slot: 'bqjffse', align: 'right' },
        { title: "自查调整（不含税）", width: 150, dataIndex: "zctz", slot: 'zctz', align: 'right' },
        { title: "本期应税收入合计", width: 120, dataIndex: "bqyssrhj", slot: 'bqyssrhj', align: 'right' },
        { title: "征税项目", width: 100, dataIndex: "zsxmMc", },
        { title: "税率", width: 90, dataIndex: "slv", align: 'center' },
        { title: "计税方式", width: 100, dataIndex: "jsfsMc", align: 'center' },
        {
          title: "操作",
          key: "action",
          width: 80,
          fixed: 'right',
          scopedSlots: { customRender: "action" }
        }
      ],
      searchList: [
        { label: "纳税主体名称", key: "nsrsbh", val: '', type: "select", placeholder: '请选择', options: [], isQueryNext: true, nextPropskey: 'orgid' },
        { label: "会计主体名称", key: "orgid", val: "", type: "select", placeholder: '请选择' },
        { label: "税款所属期", key: "srssq", val: "", type: "monthrange", placeholder: '请选择' },
        {
          label: "税率", key: "sl", val: "", type: "select", placeholder: '请选择', options: [
            { value: '', label: '全部' },
            { value: '0.130000', label: '13%' },
            { value: '0.090000', label: '9%' },
            { value: '0.060000', label: '6%' },
            { value: '0.050000', label: '5%' },
            { value: '0.030000', label: '3%' },
            { value: '0.010000', label: '1%' },
            { value: '0', label: '免税' },
          ]
        },
        {
          label: "计税方式", key: "jsfs", val: "", type: "select", placeholder: '请选择', options: [
            { value: '', label: '全部' },
            { value: '1', label: '一般计税' }, { value: '2', label: '简易计税' },]
        },
        { label: "征税项目", key: "zsxm", val: "", type: "select", placeholder: '请选择', options: [{ value: '', label: '全部' }].concat(zsxmList) },
      ],
      rules: {
        zctz: [{ pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字' }],
        jzjtje: [{ pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字' }]
      },
      dialogVisible: false,
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
    height() {
      return window.innerHeight - 290
    },
    contentHeight() {
      return window.innerHeight - 132;
    },
    columns() {
      return this.nsrlx == 2 ? this.columnsSmall : this.columnsNormal
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
        // 携带参数进入
        if (!this.$route.query.nsrsbh) {
          // 直接访问
          this.getOrgList('')
          this.getList()
        }
      }
    },
    // 获取会计主体
    async getOrgList(nsrsbh) {
      const { zzstbzq = '', nsrlx = '' } = this.taxBodyList.find((item) => item.nsrsbh == nsrsbh) || {}
      this.nsrlx = nsrlx;
      this.param.tbzq = zzstbzq
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
        this.$set(this.param, 'nsrsbh', nsrsbh)
        const { ssq, tbzq } = this.$route.query
        this.propsKey = `${nsrsbh}_${ssq}_${tbzq}`
      }
    },
    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh, ssq, tbzq } = this.$route.query
      this.$set(this.param, 'nsrsbh', nsrsbh)
      this.param.srssq = getssqArr(ssq, tbzq)
      this.searchList[0].val = nsrsbh
      this.searchList[2].val = getssqArr(ssq, tbzq)
      this.$refs.list.handleGetData(this.param)
      this.getOrgList(nsrsbh)
    },
    update(row) {// 调整
      this.editForm = row;
      this.dialogVisible = true
    },
    async submit() { //  保存调整信息
      this.$refs["ruleForm"].validate(async valid => {
        if (!valid) return;
        // 一般纳税人限制即征即退金额不能大于自查调整（不含税）收入金额
        if (this.editForm.nsrlx == 1 &&
          Math.abs(this.editForm.jzjtje) > Math.abs(this.editForm.zctz)) {
          this.$message.warning('即征即退金额不能大于自查调整（不含税）收入金额！')
          return;
        }
        const { code = '', } = await adjustAmountInfo({
          ...this.editForm,
          bqyssrhj: (this.editForm.bqdffse - this.editForm.bqjffse + parseFloat(this.editForm.zctz)).toFixed(2)
        })
        if (code === '0') {
          this.$message.success('操作成功')
          this.handleClose()
          this.$refs.list.reload()
        }
      })
    },

    goToDetail(row) {// 明细
      this.$router.push({
        path: "/foundationaldata/taxableIncomeDetailsSummary/details",
        query: {
          nsrsbh: row.nsrsbh,
          id: row.id,
        }
      })
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
    },

    // 导出
    async handleExport() {
      const fileName = `应税收入汇总明细.xlsx`
      await exportIncomeDetailInfo({
        reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999, isInvoice: 'N' },
        fileName
      })
    },
    getList() {
      this.$refs.list && this.$refs.list.reload()
    },
    async fetchSummaryDetail() {
      const { code = '' } = await fetchSummaryDetail(this.queryParam)
      if (code === '0') {
        this.$message.success('操作成功')
        this.getList()
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.editForm = {}
    },
    getSearchParam(param) {
      this.queryParam = param;
      setTimeout(() => {
        this.propskey = `${param.nsrsbh}`
      }, 1000)
    },
    dateFormat(fmt, val) {
      return moment(val).format(fmt)
    },
  }
};
</script>
<style scoped lang="scss">
/deep/ .el-dialog__body {
  .el-form-item {
    width: 100%;

    &:first-of-type {
      margin-bottom: 16px;
    }

    .el-form-item__label {
      width: 240px;
    }

    .el-form-item__content {
      width: calc(100% - 260px);

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
</style>


