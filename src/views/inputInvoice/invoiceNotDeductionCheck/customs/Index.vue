<template>
  <div class="com-invoice">
    <form-list :columns="columns" :searchRow="searchList" @getSearchParam="getSearchParam" :api="api" :param="param"
      @handleSelection="handleSelection" :height="height" :firstLoading="false" v-loading="loading" ref="list"
      :tableCounterShow="true">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button type="success" @click="cancleBatch('04')"
              v-if="$refs.list && $refs.list.searchParam.cljg == '01'">撤销勾选</el-button>
            <el-button type="success" @click="submitBatch('03')" v-else>提交勾选</el-button>
            <el-button @click="exportInvoiceCheck">导出查询结果</el-button>
            <el-button @click="exportSelectedInvoice">导出选中发票</el-button>
          </div>
        </div>
      </template>

      <template #cljg="{ data }"> {{ data.cljg == '01' ? '已勾选' : '未勾选' }}</template>
      <template #sfycpz="{ data }"> {{ data.sfycpz == '01' ? '正常' : data.sfycpz == '02' ? '异常' : data.sfycpz == '03' ?
      '疑似异常' : '' }}</template>
      <template #fplx="{ data }"> {{ inputFplxMap[data.fplx] }} </template>
      <template #fpzt="{ data }">{{ data.fpzt ? fpztMap[data.fpzt] : '' }} </template>


      <template #bdklx="{ data, index }">
        <span v-if="data.cljg == '01'">{{ data.bdklx ? data.bdklx == '5' ? data.bdkyy : bdklxMap[data.bdklx] : ''
          }}</span>
        <span v-else class="column-text" @click.stop="selectBdklx(data, index)">{{ data.bdklx ? data.bdklx == '5' ?
      data.bdkyy : bdklxMap[data.bdklx] : '请选择' }}</span>
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
      <template #accountPeriod="{ data }"> {{ data.accountPeriod ? dateFormat('YYYY-MM', data.accountPeriod) : '' }}
      </template>
      <template #accountTime="{ data }"> {{ data.accountTime ? dateFormat('YYYY-MM-DD', data.accountTime) : '' }}
      </template>
      <template #reimburseDate="{ data }"> {{ data.reimburseDate ? dateFormat('YYYY-MM', data.reimburseDate) : '' }}
      </template>

      <!-- <template #myscope="{ data }">
        <el-button @click.stop="queryDetail(data)">查看</el-button>
      </template> -->
    </form-list>

    <!-- dialog 提交勾选 -->
    <el-dialog title="请确认" :visible.sync="dialogVisibleSubmit" width="40%" :before-close="handleClose"
      class="submit-dialog">
      <div class="title">
        <i class="el-icon-warning" />本次勾选<span>{{ selections.length }}</span>张发票，税额合计<span>{{ selecedInfo.hjse
          }}</span>元
      </div>
      <div class="tip">是否确认提交</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleSubmit = false">取 消</el-button>
        <el-button type="success" @click="checkCustomsPayment">确 认</el-button>
      </span>
    </el-dialog>

    <SelectReasonModal @submitBdklx="submitBdklx" ref="selectReasonModal" />
  </div>
</template>

<script>
import moment from "moment";
import FormList from '@/components/FormList.vue';
import SelectReasonModal from '../../components/SelectReasonModal.vue';
import { checkCustomsPayment, getOrgList, exportInvoiceCheck,getKjList } from './Api'
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
        { title: "海关缴款书号码", width: 150, dataIndex: "hgjkshm", },
        { title: "填发日期", width: 100, dataIndex: "tfrq", align: "center", slot: 'tfrq' },
        { title: "有效抵扣税额", width: 150, dataIndex: "fphm", },
        { title: "加计扣除额合计", width: 150, dataIndex: "fphm", },
        { title: "加计扣除剩余额", width: 150, dataIndex: "fphm", },
        { title: "缴款单位人纳税人识别号", width: 150, dataIndex: "jkdwrnsrsbh", },
        { title: "缴款单位人纳税人名称", width: 150, dataIndex: "jkdwrnsrmc", },
        { title: "是否重号锁定", dataIndex: "sfchsd", width: 100, slot: 'sfchsd' },
        { title: "认证状态", dataIndex: "syncInvoice", width: 100, slot: 'syncInvoice' },
        { title: "勾选失败原类", dataIndex: "syncInvoice", width: 100, slot: 'syncInvoice' },
        { title: "勾选人", dataIndex: "syncInvoice", width: 100, slot: 'syncInvoice' },
        { title: "勾选时间", dataIndex: "syncInvoice", width: 100, slot: 'syncInvoice' },
        { title: "入账状态", dataIndex: "rzzt", width: 100, slot: 'rzzt' },
        { title: "入账日期", dataIndex: "syncInvoice", width: 100, slot: 'syncInvoice' },
        { title: "入账属期", dataIndex: "rzsq", width: 100, slot: 'rzsq' },

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
          label: "受票组织",
          key: "orgid",
          val: "",
          type: "select",
          options: [],
        },
        {
          label: "是否重号锁定",
          key: "cljg",
          val: "02",
          noClearable: 'Y',
          type: "select",
          options: [
            { value: "02", label: "是" },
            { value: "01", label: "否" },
          ]
        },
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
        {
          label: "会计科目",
          key: "kjkm",
          val: "",
          type: "select",
          options: [],
        },
        {
          label: "凭证号",
          key: "pzh",
          val: "",
          type: "input",
          options: [],
        },
        {
          label: "海关缴款书号码",
          key: "hgjkshm",
          val: '',
          type: "input",
          placeholder: "请输入"
        },
        {
          label: "税款金额",
          key: "skje",
          val: "",
          type: "input",
          placeholder: "请输入"
        },
        {
          label: "填发日期",
          key: "tfrq",
          val: [],
          type: "daterange",
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }
        },
        {
          label: "收票状态",
          key: "spzt",
          val: "",
          type: "select",
          options: [],
        },
        {
          label: "认证状态",
          key: "rz",
          val: "",
          type: "select",
          options: [],
        },
        {
          label: "入帐状态",
          key: "rzzt",
          val: "",
          type: "select",
          options: [],
        },
        {
          label: "转出状态",
          key: "zczt",
          val: "",
          type: "select",
          options: [],
        },


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
      selectedInvoices: []
    };
  },
  mounted() {
    // this.getList();
    this.getKjList();
    this.form = this.$route.query;
  },

  activated() {
    this.getList()

  },
  computed: {
    height() {
      return window.innerHeight - 380;
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
        this.checkCustomsPayment();
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
    async checkCustomsPayment() {
      const list = this.selections.map(item=> ({jkshm: item.hgjkshm , tfrq: item.tfrq}))
      const { code = '' } = await checkCustomsPayment({
        gfsbh: this.$route.query.nsrsbh,
        gxlx: this.gxlxDm,
        list,
      })
      if (code === '0') {
        this.$message.success('提交成功');
        this.dialogVisible = false;
        this.$refs.list.reload()
      }
    },

    getSearchParam(param) {
      this.queryParam = param;
    },
    // 导出发票数据
    async exportInvoiceCheck() {
      const fileName = `海关缴款书.xlsx`
      await exportInvoiceCheck({
        reqData: { ...this.queryParam, sign: 'N', pageNo: 1, pageSize: 9999999 },
        fileName
      })
    },
    handleSelectionChange(selection) {
      this.selectedInvoices = selection;
    },

    /**
     * 导出选中的发票数据
     */
    async exportSelectedInvoice() {
      if (this.selectedInvoices.length > 0) {
        const fileName = `选中海关缴款书.xlsx`;
        await exportInvoiceCheck({
          reqData: { list: this.selectedInvoices, sign: 'N' },
          fileName
        });
      } else {
        alert('请先选择要导出的发票！');
      }
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
    queryDetail() { },
    // 会计科目列表
    async getKjList() {
      const { code = '', data = [] } = await getKjList({})
      if (code === '0') {
        const index = this.searchList.findIndex((item) => item.key === 'kjkm');
        const options = [{ value: "", label: "全部" }].concat(data.map((item) => {
          return {
            value: item.accSegmentCode,
            label: item.accSegmentName
          }
        }))
        // debugger;
        this.$set(this.searchList[index], 'options', options)
      }
    },
  }
};
</script>
