<template>
  <div class="main-content" :style="'min-height: ' + contentHeight + 'px;'">
    <BackBtn path="/outputInvoice/redInvoice/infoTable/Index" :query="$route.query" />
    <div class="content-header">
      <!-- <Step :stepData="{ current: 1, total: 3, title: '查询发票信息' }" /> -->
      <Step :stepData="{ current: 1, total: 3, title: '选择票据' }" />
    </div>


    <form-list :key="propsKey" :searchKey="propsKey" :columns="columns" :searchRow="searchList" :api="api" :param="param" @getTableData="getTableData" :height="height" :firstLoading="false" ref="list">
      <template #fplx="{ data }"> {{ fplxMap[data.fplx] }} </template>
      <template #type>销售方</template>
      <template #kprq="{ data }">{{ dateFormat('YYYY-mm-dd', data.kprq) }}</template>
      <template #hjje="{ data }">{{ formatMoney(data.hjje) }}</template>
      <template #hjse="{ data }">{{ formatMoney(data.hjse) }}</template>
      <template #jshj="{ data }">{{ formatMoney(data.jshj) }}</template>

      <!-- 操作按钮 -->
      <template #myscope="{ data }">
        <!-- <el-button @click.stop="preview(data)">预览</el-button> -->
        <el-button @click.stop="handleInvoice('queryBlue', data)">选择</el-button>
      </template>
    </form-list>

    <!-- 尾部信息 -->
    <div class="content-footer" v-if="showAddRecord">
      <el-button type="success" @click="handleInvoice('addRecord')">手工补录</el-button>
      <!-- <div> 温馨提示：本功能可针对2022年1月1日以前的进项发票提供红字发票开具业务</div> -->
    </div>
  </div>
</template>

<script>
import FormList from '@/components/FormList.vue';
import Step from '@/components/Step.vue';
import BackBtn from "@/components/BackBtn";
import { dateFormat, } from "@/utils/tool";
import { fplxMap, dynamicUrlMap } from '@/config/constant.js'
import { getOrgList, invoiceUsedStatus } from './Api'

export default {
  name: 'AddApplyForm',
  components: { FormList, Step, BackBtn },
  data() {
    return {
      form: {},
      api: require('./Api'),
      param: {},
      fplxMap,
      showAddRecord: false, // 是否能够手工补录
      propsKey: '',
      // columns: [
      //   { title: '序号', type: "index", width: 70, align: 'center' },
      //   { title: "发票票种", dataIndex: "fplx", slot: 'fplx', width: 120 },
      //   { title: "发票号码", dataIndex: "fpHm", width: 120, },
      //   { title: "发票代码", dataIndex: "fpDm", width: 120, },
      //   { title: "开票组织名称", width: 100, dataIndex: "orgName", slot: "orgName" },
      //   { title: "开票日期", dataIndex: "kprq",align:"center", width: 100, slot: 'kprq' },
      //   { title: "购/销身份", dataIndex: "type",align:"center", slot: 'type' },
      //   { title: "对方纳税人名称", dataIndex: "gmfMc", width: 120, },
      //   { title: "合计金额", dataIndex: "hjje", slot: 'hjje', align: 'right' },
      //   { title: "合计税额", dataIndex: "hjse", slot: 'hjse', align: 'right' },
      //   { title: "价税合计", dataIndex: "jshj", slot: 'jshj', align: 'right' },
      //   { title: "操作", key: "action", fixed: 'right', width: 80, scopedSlots: { customRender: "action" } },
      // ],
      columns: [
        { title: '序号', type: "index", width: 70, align: 'center' },
        { title: "开票点", dataIndex: "orgName", width: 120, },
        { title: "销售方名称", dataIndex: "xsfmc", width: 120, },
        { title: "购买方名称", width: 100, dataIndex: "gmfmc", slot: "orgName" },
        { title: "蓝字发票号码", dataIndex: "fphm",align:"center", width: 100, slot: 'kprq' },
        { title: "发票金额", dataIndex: "hjje",align:"center", slot: 'type' },
        { title: "发票税额", dataIndex: "hjse", width: 120, },
        { title: "开票时间", dataIndex: "kprq", slot: 'hjje', align: 'right' },
        { title: "价税合计", dataIndex: "jshj", slot: 'jshj', align: 'right' },
        { title: "操作", key: "action", fixed: 'right', width: 80, scopedSlots: { customRender: "action" } },
      ],
      searchList: [
        {
          label: "购/销方选择",
          placeholder: "请选择",
          disabled: true,
          key: "type", val: '0', type: "select",
          options: [
            { value: '0', label: "我是销售方" },
            // { value: '1', label: "我是购买方" },
          ],
        },
        { label: "对方纳税人名称", key: "dfnsrmc", val: "", type: "input", placeholder: "请输入" },
        { label: "对方纳税人识别号", key: "dfnsrsbh", val: "", type: "input", placeholder: "请输入" },
        { label: "发票号码", key: "fphm", val: "", type: "input", placeholder: "请输入" },
        { label: "发票代码", key: "fpdm", val: "", type: "input", placeholder: "请输入" },
        {
          label: "所属组织",
          key: "orgid",
          val: "",
          type: "select",
          options: [],
        },
        { label: "价税金额", key: "jshj", val: "", type: "input", placeholder: "请输入" },
        {
          label: "开票日期",
          key: "kprq",
          val: [],
          type: "daterange",
          placeholder: "请选择",
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }
        },
      ],
    };
  },
  activated() {
    this.getOrgList()
    this.param = {};
    this.param.taxBodyId = this.$route.query.taxBodyId;
    this.propsKey = this.$route.query.taxBodyId
    this.$nextTick(() => {
      this.$refs.list.reload()
    });
  },
  computed: {
    height() {
      return window.innerHeight - 320;
    },
    contentHeight() {
      return window.innerHeight - 132;
    },
  },

  methods: {
    dateFormat,
    async getOrgList() {
      const { code = '', data = [] } = await getOrgList({
        taxBodyId: this.$route.query.taxBodyId
      })
      const index = this.searchList.findIndex((item) => item.key === 'orgid');
      if (code === '0') {
        this.searchList[index].options = [{ value: '', label: '全部' }, { value: 'noorg', label: '无组织' }].concat(data.map((item) => {
          return {
            ...item,
            value: item.id,
            label: item.name
          }
        }))
      }
    },
    // 检查蓝票是否可以红冲
    async invoiceUsedStatus(row, query) {
      console.log(row,"rowId")
    // debugger;
      if (!row.orgid) {
        this.$message.warning('请到已开票页面维护开票组织');
        return;
      }
      const { code = '', data = {} } = await invoiceUsedStatus({
        fplx: row.fppz,
        fphm: row.fphm,
        kprq: row.kprq,
        nsrsbh: row.xsfnsrsbh // 销方纳税人识别号
      })
      // 可以红冲
      if (code === '0') {
        this.$router.push({
          // 选择默认填充
          path: '/redInvoice/redInfoConfirm',
          query: {
            ...query,
            blueInvoiceId: row.id,
          }
        })
        this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
      }
    },
    getTableData(data) {
      this.showAddRecord = !data.length
    },
    //预览发票
    preview(data) {
      window.open(dynamicUrlMap[process.env.NODE_ENV].frontUrl + "#/invoice/preview?fpqqlsh=" + data, '_blank')
      //  window.open('http://localhost:8080/#/invoice/preview?url=https://s-uat.mideazy.com/midea-sd-invoicesvc/api/service/previewDatas&fpqqlsh=186a64ddbd3743afa413c4c4a6712a32', '_blank')
    },
    // 选择默认填充还是手工补录
    async handleInvoice(operateType, row = {}) {
      const query = {
        ...this.$route.query,
        operateType
      }
      // debugger;
      if (operateType === 'queryBlue') {
        this.invoiceUsedStatus(row, query)
        return
      }
      // 手工补录
      sessionStorage.setItem('clearRedInvoice', 1);
      this.$router.push({
        // 选择默认填充
        path: '/redInvoice/redInfoConfirm',
        query
      })
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
    },
  }
};
</script>

<style lang="scss" scoped>
.content-header {
  display: flex;

  .el-button {
    margin-right: 8px;
  }
}

.content-footer {
  display: flex;
  flex-direction: column;
  align-items: center;

  .el-button {
    width: 6%;
    margin-top: 8px;
  }
}
</style>
