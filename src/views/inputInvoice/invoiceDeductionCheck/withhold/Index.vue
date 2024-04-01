<template>
  <div class="com-withhold">
    <form-list
      :columns="columns"
      :searchRow="searchList"
      :api="api"
      :param="param"
      :height="height"
      @getSearchParam="getSearchParam"
      @handleSelection="handleSelection"
      v-loading="loading"
      :tableCounterShow="true"
      ref="list"
      :firstLoading="level === '3'"
    >
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button type="success" @click="cancleBatch('02')" v-if="$refs.list && $refs.list.searchParam.cljg == '01'">撤销勾选</el-button>
            <el-button type="success" @click="submitBatch('01')" v-else>提交勾选</el-button>
            <el-button @click="exportWithholdList">导出</el-button>
            <el-button @click="importExcel" v-if="$refs.list && $refs.list.searchParam.cljg == '02'">导入</el-button>

          </div>
        </div>
      </template>
      <template #cljg="{ data }"> {{ data.cljg == '01' ? '已勾选' : '未勾选' }}</template>
      <template #sfycpz="{ data }"> {{ data.sfycpz == '01' ? '正常' : data.sfycpz == '02' ? '异常' : data.sfycpz == '03' ? '疑似异常' : '' }}</template>
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
        <div class="title title-normal">
          <i class="el-icon-warning" />本次勾选<span>{{ selections.length }}</span
          >张发票，税额合计<span>{{ selecedInfo.hjse }}</span
          >元
        </div>
        <div class="tip">是否确认提交</div>
      </template>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="success" @click="batchWithhold">确 认</el-button>
      </span>
    </el-dialog>
    <custom-import
      dialogTitle="发票勾选"
      :dialogVisible="dialogImportVisible"
      @handleClose="handleImportClose"
      @handleOk="handleImportOk"
      downloadTemplateApi="/income/downExcel"
      :downloadTemplateApiParams="{ type: 'DKDJWSPZ' }"
      downloadTemplateName="发票勾选_导入模板"
      :upApi="`/income/uplodeDkdjwspz/${nsrsbh}`"
      importApi="/taxConfig/importPreferentialInfo"
      upTitle="上传发票勾选数据"
      effImport
      :importColumns="importColumns"
    ></custom-import>
  </div>
</template>

<script>
import moment from 'moment';
import FormList from '@/components/FormList.vue';
import { batchWithhold, exportWithholdList } from './Api';
import { inputFplxMap } from '@/config/constant';
import CustomImport from '@/components/CustomImport';

export default {
  name: 'invoiceDeductionCheckWithhold',
  components: {
    FormList,
    CustomImport
  },
  props: {
    level: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialogImportVisible: false, // 导入
      inputFplxMap,
      api: require('./Api'),
      param: {},
      loading: false,
      columns: [
        { type: 'selection', width: 50 },
        { title: '序号', type: 'index', width: 50 },
        { title: '勾选状态', width: 80, dataIndex: 'cljg', slot: 'cljg', align: 'center' },
        { title: '代扣代缴完税凭证号', width: 180, dataIndex: 'dkdjwspzh' },
        { title: '填发日期', width: 150, dataIndex: 'tfrq', slot: 'tfrq' },
        { title: '被扣缴义务人识别号', width: 160, dataIndex: 'bkjnsrsbh' },
        { title: '被扣缴义务人名称', width: 160, dataIndex: 'bkjnsrmc' },
        { title: '有效抵扣税额', dataIndex: 'yxdkse', width: 120 },
        { title: '勾选时间', width: 150, dataIndex: 'gxsj', slot: 'gxsj', align: 'center' },
        { title: '勾选人', width: 130, dataIndex: 'createrName' },
      ],
      searchList: [
        {
          label: '勾选状态',
          key: 'cljg',
          val: '02',
          type: 'select',
          options: [
            { value: '02', label: '未勾选' },
            { value: '01', label: '已勾选' },
          ],
        },
        {
          label: '代扣代缴完税凭证',
          key: 'dkdjwspzh',
          val: '',
          type: 'input',
          placeholder: '请输入',
        },
        {
          label: '被扣缴义务人识别号',
          key: 'bkjnsrsbh',
          val: '',
          type: 'input',
          placeholder: '请输入',
        },
        {
          label: '被扣缴义务人名称',
          key: 'bkjnsrmc',
          val: '',
          type: 'input',
          placeholder: '请输入',
        },
        {
          label: '填发日期',
          key: 'tfrqList',
          val: [],
          type: 'daterange',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          },
        },
      ],
      importColumns: [
        { title: '勾选状态', width: 200, dataIndex: 'nsrmc' },
        { title: '代扣代缴完税凭证号', width: 200, dataIndex: 'orgName' },
        // { title: '填发日期', width: 200, dataIndex: 'orgName' },
        // { title: '被扣缴义务人识别号', width: 200, dataIndex: 'orgName' },
        // { title: '被扣缴义务人名称', width: 200, dataIndex: 'orgName' },
        // { title: '有效抵扣税额', width: 200, dataIndex: 'orgName' },
        // { title: '勾选时间', width: 200, dataIndex: 'orgName' },
        // { title: '勾选人', width: 200, dataIndex: 'orgName' },

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
    };
  },
  watch: {
    level(newV, oldV) {
      if (newV === '3') {
        this.init();
      }
    },
  },
  computed: {
    height() {
      return window.innerHeight - 460;
    },
    nsrsbh() {
      return this.$route.query.nsrsbh
    }
  },

  methods: {
    init() {
      const param = {
        cljg: '02',
        skssq: this.$route.query.skssq,
        kjywrsbh: this.$route.query.nsrsbh,
        // bkjnsrsbh: this.$route.query.nsrsbh,
      };
      this.param = param;
      this.$refs.list.handleGetData(param);
    },
    // 处理多选
    handleSelection(rows) {
      this.selections = rows;
      let hjje = 0,
        hjse = 0,
        jshj = 0;
      rows.forEach(item => {
        hjje += item.hjje;
        hjse += item.hjse;
        jshj += hjse + hjje;
      });

      this.selecedInfo = {
        number: rows.length,
        hjje: hjje.toFixed(2),
        hjse: hjse.toFixed(2),
        jshj,
      };
    },
    // 撤销勾选
    cancleBatch(gxlxDm) {
      if (this.selections.length == 0) {
        this.$message.warning('请至少选择一条');
        return;
      }
      this.gxlxDm = gxlxDm;
      this.$confirm(`您确定撤销勾选吗？`, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.batchWithhold();
      });
    },

    // 提交勾选
    submitBatch(gxlxDm) {
      if (this.selections.length == 0) {
        this.$message.warning('请至少选择一条');
        return;
      }
      this.gxlxDm = gxlxDm;
      this.$confirm(`您确定提交勾选吗？`, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.batchWithhold();
      });

      return;
      // 疑似异常
      // this.abnormalList = this.selections.filter((item) => item.sfycpz === '03')
      // this.dialogVisible = true
    },

    // 提交数据
    async batchWithhold() {
      const { code = '' } = await batchWithhold({
        kjywrsbh: this.$route.query.nsrsbh,
        gxlxDm: this.gxlxDm,
        skssq: this.$route.query.skssq,
        dkdjmx: this.selections,
      });
      if (code === '0') {
        this.$message.success('提交成功');
        this.dialogVisible = false;
        this.$refs.list.reload();
      }
    },

    getSearchParam(param) {
      this.queryParam = param;
    },
    // 导出发票数据
    async exportWithholdList() {
      const fileName = `代扣代缴信息列表.xlsx`;
      await exportWithholdList({
        reqData: { ...this.queryParam, sign: 'Y', pageNo: 1, pageSize: 9999999 },
        fileName,
      });
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
      return moment(val).format(fmt);
    },
  },
};
</script>
