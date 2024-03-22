<template>
  <div class="com-invoice">
    <form-list :columns="columns" :searchRow="searchList" @getSearchParam="getSearchParam" :api="api" :param="param" @handleSelection="handleSelection" :height="height" :firstLoading="false" v-loading="loading" ref="list"
      :tableCounterShow="true">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button type="success" @click="cancleBatch('04')" v-if="$refs.list && $refs.list.searchParam.cljg == '01'">撤销勾选</el-button>
            <el-button type="success" @click="submitBatch('03')" v-else>提交勾选</el-button>
            <el-button @click="exportInvoiceCheck">导出</el-button>
          </div>
        </div>
      </template>

      <template #cljg="{ data }"> {{ data.cljg == '01' ? '已勾选' : '未勾选' }}</template>
      <template #sfycpz="{ data }"> {{ data.sfycpz == '01' ? '正常' : data.sfycpz == '02' ? '异常' : data.sfycpz == '03' ? '疑似异常' : '' }}</template>
      <template #fplx="{ data }"> {{ inputFplxMap[data.fplx] }} </template>
      <template #fpzt="{ data }">{{ data.fpzt ? fpztMap[data.fpzt] : '' }} </template>


      <template #bdklx="{ data, index }">
        <span v-if="data.cljg == '01'">{{ data.bdklx ? data.bdklx == '5' ? data.bdkyy : bdklxMap[data.bdklx] : '' }}</span>
        <span v-else class="column-text" @click.stop="selectBdklx(data, index)">{{ data.bdklx ? data.bdklx == '5' ? data.bdkyy : bdklxMap[data.bdklx] : '请选择' }}</span>
      </template>
      <template #syncInvoice="{ data }"> {{ data.syncInvoice == 'Y' ? '是' : '否' }}</template>

      <template #purchaserstatus="{ data }">
        {{ data.purchaserstatus ? purchaserstatusMap[data.purchaserstatus] : '' }}
      </template>
      <template #jshj="{ data }">{{ formatMoney(data.jshj) }}</template>
      <template #hjse="{ data }">{{ formatMoney(data.hjse) }}</template>
      <template #yxdkse="{ data }">{{ formatMoney(data.yxdkse) }}</template>
      <template #kprq="{ data }"> {{ data.kprq ? dateFormat('YYYY-MM-DD', data.kprq) : data.kprq }} </template>

      <template #gxsj="{ data }"> {{ data.gxsj ? dateFormat('YYYY-MM-DD', data.gxsj) : '' }} </template>
      <template #accountPeriod="{ data }"> {{ data.accountPeriod ? dateFormat('YYYY-MM', data.accountPeriod) : '' }} </template>
      <template #accountTime="{ data }"> {{ data.accountTime ? dateFormat('YYYY-MM-DD', data.accountTime) : '' }} </template>
      <template #reimburseDate="{ data }"> {{ data.reimburseDate ? dateFormat('YYYY-MM', data.reimburseDate) : '' }} </template>

      <!-- <template #myscope="{ data }">
        <el-button @click.stop="queryDetail(data)">查看</el-button>
      </template> -->
    </form-list>

    <!-- dialog 提交勾选 -->
    <el-dialog title="请确认" :visible.sync="dialogVisibleSubmit" width="40%" :before-close="handleClose" class="submit-dialog">
      <div class="title">
        <i class="el-icon-warning" />本次勾选<span>{{ selections.length }}</span>张发票，税额合计<span>{{ selecedInfo.hjse }}</span>元
      </div>
      <div class="tip">是否确认提交</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleSubmit = false">取 消</el-button>
        <el-button type="success" @click="submitRevokeInvoiceCheck">确 认</el-button>
      </span>
    </el-dialog>

    <SelectReasonModal @submitBdklx="submitBdklx" ref="selectReasonModal" />
  </div>
</template>

<script>
import moment from "moment";
import FormList from '@/components/FormList.vue';
import SelectReasonModal from '../../components/SelectReasonModal.vue';
import { submitRevokeInvoiceCheck, getOrgList, exportInvoiceCheck } from './Api'
import { inputFplxList, inputFplxMap } from '@/config/constant'
import { bdklxList, bdklxMap, purchaserstatusList, purchaserstatusMap, fpztList, fpztMap } from '../../constant'

export default {
  name: 'InvoiceNotDeductionCheckInvoice',
  components: {
    FormList, SelectReasonModal,
  },
  props: {
    currentSq: {}
  },
  data() {
    return {
      form: {},
      inputFplxMap,
      bdklxMap,
      bdklxList,
      purchaserstatusList,
      purchaserstatusMap,
      fpztMap,
      api: require('./Api'),
      param: {
        cljg: '02'
      },
      loading: false,
      columns: [
        { type: "selection", width: 50, },
        { title: '序号', type: "index", width: 50, },
        { title: "勾选状态", width: 80, dataIndex: "cljg", align: "center", slot: 'cljg' },
        { title: "入账状态", dataIndex: "purchaserstatus", align: "center", width: 100, slot: 'purchaserstatus' },
        { title: "发票号码", width: 150, dataIndex: "fphm", },
        { title: "发票代码", width: 150, dataIndex: "zzfpDm", },
        { title: "发票种类", width: 150, dataIndex: "fplx", slot: 'fplx' },
        { title: "开票日期", width: 100, dataIndex: "kprq", align: "center", slot: 'kprq' },
        { title: "销售方名称", dataIndex: "xsfmc", width: 120, },
        { title: "销售方识别号", dataIndex: "xsfnsrsbh", width: 150, },
        // { title: "纳税主体名称", dataIndex: "xsfmc", width: 120, },
        { title: "会计主体", dataIndex: "name", width: 150, },
        { title: "会计期间", dataIndex: "accountPeriod", width: 100, slot: "accountPeriod" },

        // { title: "受票组织", dataIndex: "spzu", width: 100, },
        { title: "价税合计", dataIndex: "jshj", width: 100, align: 'right', slot: 'jshj' },
        { title: "税额", width: 100, dataIndex: "hjse", align: 'right', slot: 'hjse' },
        { title: "可抵扣税额", width: 100, dataIndex: "yxdkse", align: 'right', slot: 'yxdkse' },
        { title: "发票状态", width: 100, dataIndex: "fpzt", slot: 'fpzt' },

        { title: "是否异常凭证", width: 100, dataIndex: "sfycpz", slot: 'sfycpz' },
        // { title: "是否未转内销凭证", width: 130, dataIndex: "kprq", },
        { title: "勾选时间", width: 100, dataIndex: "gxsj", slot: 'gxsj' },
        { title: "勾选人", width: 130, dataIndex: "createrName" },
        // { title: "业务系统单号", dataIndex: "hjje", width: 100, },
        { title: "来源系统", dataIndex: "mideaSrc", align: "center", width: 100, },
        // { title: "项目名称", dataIndex: "hjse", width: 100, },
        { title: "记账人", dataIndex: "accountUser", width: 100, },
        { title: "记账日期", width: 100, dataIndex: "accountTime", slot: 'accountTime' },
        { title: "报销日期", width: 100, dataIndex: "reimburseDate", slot: 'reimburseDate' },
        { title: "是否入发票池", dataIndex: "syncInvoice", width: 100, slot: 'syncInvoice' },

        {
          title: "不抵扣原因",
          fixed: "right",
          width: 150,
          slot: 'bdklx',
          scopedSlots: { customRender: "action" }
        },
        // {
        //   title: "操作",
        //   key: "action",
        //   fixed: "right",
        //   width: 90,
        //   scopedSlots: { customRender: "action" }
        // }
      ],
      searchList: [
        {
          label: "勾选状态",
          key: "cljg",
          val: "02",
          noClearable: 'Y',
          type: "select",
          options: [
            { value: "02", label: "未勾选" },
            { value: "01", label: "已勾选" },
          ]
        },
        // {
        //   label: "纳税主体",
        //   key: "nsrmc",
        //   val: "",
        //   type: "input",
        //   placeholder: "请输入"
        // },
        {
          label: "发票种类",
          key: "fplx",
          val: '',
          type: "select",
          options: [{ value: '', label: '全部' }].concat(inputFplxList),
        },
        {
          label: "发票号码",
          key: "fphm",
          val: "",
          type: "input",
          placeholder: "请输入"
        },
        {
          label: "发票代码",
          key: "zzfpDm",
          val: "",
          type: "input",
          placeholder: "请输入"
        },
        {
          label: "发票状态",
          key: "fpzt",
          val: '',
          type: "select",
          options: [{ value: '', label: '全部' }].concat(fpztList),
        },
        {
          label: "销售方识别号",
          key: "xsfnsrsbh",
          val: "",
          type: "input",
          placeholder: "请输入"
        },
        {
          label: "销售方名称",
          key: "xsfmc",
          val: "",
          type: "input",
          placeholder: "请输入"
        },
        {
          label: "受票组织",
          key: "orgid",
          val: "",
          type: "select",
          options: [],
        },
        {
          label: "是否异常凭证",
          key: "sfycpz",
          val: '',
          type: "select",
          options: [
            { value: "", label: "全部" },
            { value: "01", label: "正常" },
            { value: "02", label: "异常" },
            { value: "03", label: "疑似异常" }
          ]
        },

        {
          label: "发票日期",
          key: "kprqList",
          val: [],
          type: "daterange",
          placeholder: '请选择',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }
        },

        {
          label: "会计期间",
          key: "accountPeriod",
          val: [],
          type: "monthrange",
          placeholder: '请选择',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }
        },
        {
          label: "入账状态",
          key: "purchaserstatus",
          val: '',
          type: "select",
          options: [{ value: "", label: "全部" }].concat(purchaserstatusList)
        },
        {
          label: "是否入发票池",
          key: "syncInvoice",
          val: '',
          type: "select",
          options: [{ value: "", label: "全部" }, { value: "Y", label: "是" }, { value: "N", label: "否" }],
        },

        // {
        //   label: "是否为转内销凭证",
        //   key: "sasst",
        //   val: '',
        //   type: "select",
        //   options: [
        //     { value: "", label: "全部" },
        //     { value: "1", label: "是" },
        //     { value: "2", label: "否" }
        //   ]
        // },
        // {
        //   label: "是否提交付款单状态",
        //   key: "sat",
        //   val: '',
        //   type: "select",
        //   options: [
        //     { value: "", label: "全部" },
        //     { value: "1", label: "已提交付款单" },
        //     { value: "2", label: "未提交付款单" }
        //   ]
        // },
      ],
      dialogVisible: false,
      dialogVisibleSubmit: false,
      gxlxDm: '', // 勾选类型代码
      abnormalList: [],
      currentIndex: '',
      selecedInfo: {
        number: 0,
        hjje: 0,
        hjse: 0,
        jshj: 0,
      },
      selections: [],
      currentRow: {},
      queryParam: {},
    };
  },
  mounted() {
    this.getList()
  },

  activated() {
    this.getList()

  },
  computed: {
    height() {
      return window.innerHeight - 460;
    },
  },

  methods: {
    dateFormat(fmt, val) {
      return moment(val).format(fmt)
    },
    async getOrgList() {
      const { code = '', data = [] } = await getOrgList({
        nsrsbh: this.$route.query.nsrsbh,
        isInvoice: 'N'
      })
      const index = this.searchList.findIndex((item) => item.key === 'orgid');
      if (code === '0') {
        this.searchList[index].options = [{ value: '', label: '全部' }].concat(data.map((item) => {
          return {
            ...item,
            value: item.id,
            label: item.name
          }
        }))
      }
    },
    // 勾选抵扣
    selectBdklx(data, index) {
      this.currentIndex = index
      this.$refs.selectReasonModal.form = { ...data }
      this.$refs.selectReasonModal.dialogVisible = true
    },
    // 提交抵扣勾选原因
    submitBdklx(data) {
      this.$set(this.$refs.list.data, this.currentIndex, data)
      const index = this.selections.findIndex((item) => item.id === data.id)
      if (index > -1) {
        this.selections.splice(index, 1, data)
        // this.$set(this.selections, this.currentIndex, { ...this.selections[this.currentIndex], ...data })
      }
    },

    // 撤销勾选
    cancleBatch(gxlxDm) {
      if (this.selections.length == 0) {
        this.$message.warning("请至少选择一条数据");
        return;
      }
      this.gxlxDm = gxlxDm
      this.$confirm(`您确定撤销勾选吗？`, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitRevokeInvoiceCheck();
      }).catch((res) => { })
    },

    // 提交勾选
    submitBatch(gxlxDm) {
      if (this.selections.length == 0) {
        this.$message.warning("请至少选择一条数据");
        return;
      }
      console.log(this.selections)

      if (this.selections.filter((item) => !item.bdklx).length > 0) {
        this.$message.warning("必须选择勾选不抵扣原因");
        return;
      }
      this.gxlxDm = gxlxDm
      this.dialogVisibleSubmit = true;
    },

    // 提交数据
    async submitRevokeInvoiceCheck() {
      const { code = '' } = await submitRevokeInvoiceCheck({
        gfsbh: this.$route.query.nsrsbh,
        skssq: this.currentSq.dateValue,
        gxlxDm: this.gxlxDm,
        fpmx: this.selections.map((item) => {
          return {
            ...item,
            fpdm: item.zzfpDm,
          }
        })
      })
      this.dialogVisibleSubmit = false;
      if (code === '0') {
        this.$message.success('提交成功');
        this.$refs.list.reload()
      }
    },

    getSearchParam(param) {
      this.queryParam = param;
    },
    // 导出发票数据
    async exportInvoiceCheck() {
      const fileName = `进项发票信息列表.xlsx`
      await exportInvoiceCheck({
        reqData: { ...this.queryParam, sign: 'N', pageNo: 1, pageSize: 9999999 },
        fileName
      })
    },
    // 处理多选
    handleSelection(rows) {
      this.selections = rows;
      let hjje = 0,
        hjse = 0,
        jshj = 0;
      rows.forEach(item => {
        hjje += item.hjje
        hjse += item.hjse;
        jshj += hjse + hjje
      });

      this.selecedInfo = {
        number: rows.length,
        hjje: hjje.toFixed(2),
        hjse: hjse.toFixed(2),
        jshj
      };
    },
    getList() {
      this.param.skssq = this.currentSq.dateValue;
      this.param.gfsbh = this.$route.query.nsrsbh;
      this.getOrgList();
      this.$nextTick(() => {
        this.$refs.list.reload()
      })
    },
    handleClose() {
      this.dialogVisibleSubmit = false;
    },
    // 查看
    queryDetail() { }
  }
};
</script>
