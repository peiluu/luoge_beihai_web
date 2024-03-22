<template>
  <div class="com-withhold">
    <form-list
      :columns="columns"
      :searchRow="searchList"
      :api="api"
      :param="param"
      @getSearchParam="getSearchParam"
      :height="height"
      v-loading="loading"
      :tableCounterShow="false"
      ref="list"
      :firstLoading="level === '3'"
    >
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button type="success" @click="cancleBatch('04')" v-if="$refs.list && $refs.list.searchParam.cljg == '01'">撤销勾选</el-button>
            <el-button type="success" @click="submitBatch('03')" v-else>提交勾选</el-button>
            <el-button @click="exportWithholdList">导出</el-button>
          </div>
        </div>
      </template>
      <template #cljg="{ data }"> {{ data.cljg == '01' ? '已勾选' : '未勾选' }}</template>
      <template #sfycpz="{ data }"> {{ data.sfycpz == '01' ? '正常' : data.sfycpz == '02' ? '异常' : data.sfycpz == '03' ? '疑似异常' : '' }}</template>
      <template #fplx="{ data }"> {{ inputFplxMap[data.fplx] }} </template>
      <template #tfrq="{ data }"> {{ data.tfrq ? dateFormat('YYYY-MM-DD', data.tfrq) : data.tfrq }} </template>
      <template #gxsj="{ data }"> {{ data.gxsj ? dateFormat('YYYY-MM-DD', data.gxsj) : '' }} </template>

      <template #fpztbz="{ data }">
        {{
          data.fpztbz == '0'
            ? '正数票'
            : data.fpztbz == '1'
            ? '负数票'
            : data.fpztbz == '2'
            ? '空白作废发票'
            : data.fpztbz == '3'
            ? '正数作废发票'
            : data.fpztbz == '4'
            ? '负数作废发票'
            : ''
        }}
      </template>
      <template #bdklx="{ data, index }">
        <span v-if="data.cljg == '01'">{{ data.bdklx ? (data.bdklx == '5' ? data.bdkyy : bdklxMap[data.bdklx]) : '' }}</span>
        <span v-else class="column-text" @click.stop="selectBdklx(data, index)">{{
          data.bdklx ? (data.bdklx == '5' ? data.bdkyy : bdklxMap[data.bdklx]) : '请选择'
        }}</span>
      </template>
    </form-list>
    <SelectReasonModal @submitBdklx="submitBdklx" ref="selectReasonModal" />
  </div>
</template>

<script>
import moment from 'moment';
import { inputFplxMap } from '@/config/constant';
import FormList from '@/components/FormList.vue';
import SelectReasonModal from '../../components/SelectReasonModal.vue';
import { batchWithhold, exportWithholdList } from './Api';
import { bdklxList, bdklxMap } from '../../constant';

export default {
  name: 'InvoiceNotDeductionCheckWithhold',
  components: {
    FormList,
    SelectReasonModal,
  },
  props: {
    level: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      inputFplxMap,
      bdklxMap,
      bdklxList,
      api: require('./Api'),
      param: {},
      loading: false,
      columns: [
        { type: 'selection', width: 50 },
        { title: '序号', type: 'index', width: 50 },
        { title: '勾选状态', width: 80, dataIndex: 'cljg', slot: 'cljg', align: 'center' },
        { title: '代扣代缴完税凭证号', width: 180, dataIndex: 'dkdjwspzh' },
        { title: '填发日期', width: 120, dataIndex: 'tfrq', slot: 'tfrq', align: 'center' },
        { title: '被扣缴义务人识别号', width: 160, dataIndex: 'bkjnsrsbh' },
        { title: '被扣缴义务人名称', width: 160, dataIndex: 'bkjnsrmc' },
        { title: '有效抵扣税额', dataIndex: 'yxdkse', width: 120 },
        { title: '勾选时间', width: 130, dataIndex: 'gxsj', align: 'center' },
        { title: '勾选人', createrName: 130, dataIndex: 'createrName' },
        {
          title: '不抵扣原因',
          fixed: 'right',
          width: 150,
          slot: 'bdklx',
          scopedSlots: { customRender: 'action' },
        },
        // {
        //   title: '操作',
        //   key: 'action',
        //   fixed: 'right',
        //   width: 90,
        //   scopedSlots: { customRender: 'action' },
        // },
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
          placeholder: '+',
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
      dialogVisible: false,
      gxlxDm: '', // 勾选类型代码
      currentIndex: '',
      queryParam: {},
    };
  },
  mounted() {
    
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
      return window.innerHeight - 440;
    },
    selections() {
      return this.$refs.list.getSelections();
    },
  },

  methods: {
    init(){
      const param = {
        cljg: '02',
        skssq: this.$route.query.skssq,
        kjywrsbh: this.$route.query.nsrsbh,
      };
      this.param = param;
      this.$refs.list.handleGetData(param);
    },
    // 勾选抵扣
    selectBdklx(data, index) {
      this.currentIndex = index;
      this.$refs.selectReasonModal.form = { ...data };
      this.$refs.selectReasonModal.dialogVisible = true;
    },
    // 提交抵扣勾选
    submitBdklx(data) {
      this.$set(this.$refs.list.data, this.currentIndex, { ...this.$refs.list.data[this.currentIndex], ...data });
      const index = this.selections.findIndex(item => item.id === data.id);
      if (index > -1) {
        this.$set(this.selections, this.currentIndex, { ...this.selections[this.currentIndex], ...data });
      }
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
      if (this.selections.filter(item => !item.bdklx).length > 0) {
        this.$message.warning('请先填入不抵扣原因再进行勾选');
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
        reqData: { ...this.queryParam, sign: 'N', pageNo: 1, pageSize: 9999999 },
        fileName,
      });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    dateFormat(fmt, val) {
      return moment(val).format(fmt);
    },
  },
};
</script>
