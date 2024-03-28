<template>
  <div class="com-withhold">
    <form-list :columns="columns" :searchRow="searchList" :api="api" :param="param" :height="height"
      @getSearchParam="getSearchParam" @selection-change="handleSelectionChange" @handleSelection="handleSelection" v-loading="loading" :tableCounterShow="true"
      ref="list" :firstLoading="level === '2'">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button type="success" @click="cancleBatch('02')"
              v-if="$refs.list && $refs.list.searchParam.cljg == '01'">撤销勾选</el-button>
            <el-button type="success" @click="submitBatch('01')" v-else>提交勾选</el-button>
            <el-button @click="exportInvoiceCheck">导出</el-button>
            <el-button @click="importExcel" v-if="$refs.list.searchParam.cljg == '02'">导入</el-button>
            <!-- <el-button type="" @click="exportSelectedData">导出选中发票</el-button> -->
          </div>
        </div>
      </template>

      <template #sfchsd="{ data }"> {{ data.sfchsd == 'Y' ? '锁定' : '未锁定' }}</template>
      <template #rzzt="{ data }"> {{ data.rzzt == '01' ? '未入账' : '已入账' }}</template>
      <template #fplx="{ data }"> {{ inputFplxMap[data.fplx] }} </template>
      <template #tfrq="{ data }"> {{ data.tfrq ? dateFormat('YYYY-MM-DD', data.tfrq) : '' }} </template>
      <template #gxsj="{ data }"> {{ data.gxsj ? dateFormat('YYYY-MM-DD', data.gxsj) : '' }} </template>
    </form-list>
    <!-- dialog 提交勾选 -->
    <el-dialog title="请确认" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <template v-if="abnormalList.length > 0">
        <div class="title"><i class="el-icon-warning" />您勾选的发票中含有疑点发票，请谨慎勾选</div>
        <div class="tip">是否确认提交</div>
        <div class="list">
          <span v-for="item in abnormalList" :key="item.fphm">{{ item.fphm }}</span>
        </div>
      </template>
      <template v-else>
        <div class="title title-normal"><i class="el-icon-warning" />本次勾选<span>{{ selections.length
            }}</span>张发票，税额合计<span>{{ selecedInfo.hjse }}</span>元
        </div>
        <div class="tip">是否确认提交</div>
      </template>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="success" @click="checkCustomsPayment">确 认</el-button>
      </span>
    </el-dialog>
    <custom-import
      dialogTitle="发票勾选"
      :dialogVisible="dialogImportVisible"
      @handleClose="handleImportClose"
      @handleOk="handleImportOk"
      downloadTemplateApi="/taxConfig/downExcel"
      downloadTemplateName="发票勾选_导入模板"
      upApi="/taxBody/importTaxBodyExcelInfo"
      importApi="/taxConfig/importPreferentialInfo"
      upTitle="上传发票勾选数据"
      :importColumns="importColumns"
    ></custom-import>
  </div>
</template>

<script>
import moment from "moment";
import FormList from '@/components/FormList.vue';
import { checkCustomsPayment, getKjList, exportInvoiceCheck } from './Api'
import { inputFplxMap } from '@/config/constant'
import CustomImport from '@/components/CustomImport';

export default {
  name: 'customs',
  components: {
    FormList,
    CustomImport
  },
  props: {
    level: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogImportVisible: false, // 导入
      inputFplxMap,
      api: require('./Api'),
      param: { cljg: '02' },
      loading: false,
      columns: [
        { type: "selection", width: 50, },
        { title: '序号', type: "index", width: 50, },
        { title: "海关缴款书号码", width: 140, dataIndex: "hgjkshm", slot: 'hgjkshm', align: 'center' },
        { title: "填发日期", width: 180, dataIndex: 'tfrq' },
        { title: "有效抵扣税额", width: 150, dataIndex: "yxdkse", slot: 'yxdkse' },
        { title: "加计扣除额合计", width: 160, dataIndex: "jjkcehj", },
        { title: "加计扣除剩余额 ", width: 160, dataIndex: "jjkcsye", },
        { title: "缴款单位人纳税人识别号", dataIndex: "jkdwrnsrsbh", width: 160, },
        { title: "缴款单位人纳税人名称", width: 150, dataIndex: "jkdwrnsrmc", slot: 'jkdwrnsrmc', align: 'center' },
        { title: "是否重号锁定", width: 130, dataIndex: "sfchsd", slot: 'sfchsd' },
        { title: "认证状态", width: 130, dataIndex: "createrName" },
        { title: "勾选失败原因", width: 130, dataIndex: "createrName" },
        { title: "勾选人", width: 130, dataIndex: "createrName" },
        { title: "勾选时间", width: 130, dataIndex: "updateTime" },
        { title: "入账状态", width: 130, dataIndex: " rzzt", slot: 'rzzt' },
        { title: "入账日期", width: 130, dataIndex: "createrName" },
        { title: "入账属期", width: 130, dataIndex: "createrName" },

      ],
      searchList: [
        {
          label: "勾选状态",
          key: "cljg",
          val: "02",
          type: "select",
          options: [
            { value: "02", label: "未勾选" },
            { value: "01", label: "已勾选" },
          ],
        },
        {
          label: "受票组织",
          key: "orgid",
          val: "",
          type: "select",
          options: [],
        },
        {
          label: "是否重号锁定",
          key: "sfchsd",
          val: "",
          type: "select",
          options: [
            { value: "Y", label: "锁定" },
            { value: "N", label: "未锁定" },
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
          options: [
          { value: "", label: "全部" },
          { value: "01", label: "已收票" },
          { value: "02", label: "未收票" },

          ],
        },
        {
          label: "认证状态",
          key: "rz",
          val: "",
          type: "select",
          options: [
          { value: "", label: "全部" },
          { value: "01", label: "已认证" },
          { value: "02", label: "未认证" },
          ],
        },
        {
          label: "入帐状态",
          key: "rzzt",
          val: "",
          type: "select",
          options: [
          { value: "", label: "全部" },
          { value: "01", label: "已入账" },
          { value: "02", label: "未入账" },
          ],
        },
        {
          label: "转出状态",
          key: "zczt",
          val: "",
          type: "select",
          options: [
          { value: "", label: "全部" },
          { value: "01", label: "已转出" },
          { value: "02", label: "未转出" },
          ],
        },

      ],
      importColumns: [
        { title: '敏感货物名称', width: 200, dataIndex: 'nsrmc' },
        { title: '风险等级', width: 200, dataIndex: 'orgName' },
      ],
      selecedInfo: {
        number: 0,
        hjje: 0,
        hjse: 0,
        jshj: 0,
      },
      selections: [],
      dialogVisible: false,
      abnormalList: [], // 异常列表
      gxlxDm: '', // 勾选类型代码
      totalEntity: {},
      queryParam: {},
      isSelected: [],
      selectedRowKeys: []
    };
  },
  watch: {
    level(newV, oldV) {
      if (newV === '2') {
        this.init()
      }
    }
  },
  computed: {
    height() {
      return window.innerHeight - 460;
    },
  },

  methods: {
    init() {
      this.getKjList();
      this.form = this.$route.query;

      const param = {
        cljg: '02',
        skssq: this.$route.query.skssq,
        kjywrsbh: this.$route.query.nsrsbh,
        // gfsbh: this.$route.query.gfsbh,
        // gxlx: this.$route.query.gxlx,

        // bkjnsrsbh: this.$route.query.nsrsbh,
      }
      this.param = {
        ...this.param,
        ...param
      }
      this.$refs.list.handleGetData(param)
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
    // 撤销勾选
    cancleBatch(gxlxDm) {
      if (this.selections.length == 0) {
        this.$message.warning("请至少选择一条");
        return;
      }
      this.gxlxDm = gxlxDm
      this.$confirm(`您确定撤销勾选吗？`, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.checkCustomsPayment();
      });
    },

    // 提交勾选
    submitBatch(gxlxDm) {
      if (this.selections.length == 0) {
        this.$message.warning("请至少选择一条");
        return;
      }
      this.gxlxDm = gxlxDm
      this.$confirm(`您确定提交勾选吗？`, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.checkCustomsPayment();
      });

      return
      // 疑似异常
      // this.abnormalList = this.selections.filter((item) => item.sfycpz === '03')
      // this.dialogVisible = true
    },

    // 提交数据
    async checkCustomsPayment() {
      const hgjksmx = this.selections.map(item => ({ jkshm: item.hgjkshm, tfrq: item.tfrq }))
      const { code = '' } = await checkCustomsPayment({
        gfsbh: this.$route.query.nsrsbh,
        gxlx: this.gxlxDm,
        hgjksmx,
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
    // 导出发票数据
    async exportInvoiceCheck() {
      const fileName = `发票勾选抵扣.xlsx`
      await exportInvoiceCheck({
        reqData: { ...this.queryParam, sign: 'Y', pageNo: 1, pageSize: 9999999 },
        fileName
      })
    },
    // 导入
    importExcel() {
      this.dialogImportVisible = true;
    },
    handleImportClose() {
      this.dialogImportVisible = false;
    },
    handleImportOk() {
      this.handleImportClose();
      this.getList();
      this.updateTableSelection();
    },
    updateTableSelection() {
      this.$nextTick(() => {
        this.tableData.forEach(row => {
          if (this.selectedRowKeys.includes(row.id)) {
            this.$refs.table.toggleRowSelection(row, true);
          }
        });
      });
    },
    handleSelectionChange(selection) {
      const newSelectedRowKeys = selection.map(item => item.id);
      if (newSelectedRowKeys.length < this.selectedRowKeys.length) {
        // 如果当前选中行的数量小于之前记录的，说明有取消勾选的操作
        this.getList();
      }
      this.selectedRowKeys = newSelectedRowKeys;
    },
    handleClose() {
      this.dialogVisible = false;
      this.form = {}
    },
    dateFormat(fmt, val) {
      return moment(val).format(fmt)
    },
    /* 勾选 */
    handleSelectionChange(e) {
      console.log(e, "2");
      this.isSelected = [...e];
    },
    async downloadNoList() {
      const fileName = `海关缴款书.xlsx`
      await this.api.downLoadNoOpenList({
        reqData: { ...this.queryParam },
        fileName
      })
    },
    async exportSelectedData() {
      const fileName = `海关缴款书.xlsx`
      await this.api.downLoadNoOpenList({
        reqData: { ...this.queryParam },
        fileName
      })
    }
  }
};
</script>./Index.vue
