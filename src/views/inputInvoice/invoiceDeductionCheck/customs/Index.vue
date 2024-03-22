<template>
  <div class="com-withhold">
    <form-list :columns="columns" :searchRow="searchList" :api="api" :param="searchParam" :height="height"
      @getSearchParam="getSearchParam" @handleSelection="handleSelection" v-loading="loading" :tableCounterShow="true"
      ref="list">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button type="success" @click="cancleBatch('02')" v-if="searchParam.cljg == '01'">撤销勾选</el-button>
          <el-button type="success" @click="submitBatch('01')" v-else>提交勾选</el-button>
            <!-- <el-button @click="exportWithholdList">导出</el-button> -->
            <el-button @click="downloadNoList">导出查询结果</el-button>
            <el-button type="" @click="exportSelectedData">导出选中发票</el-button>
          </div>
        </div>
      </template>
      <template #cljg="{ data }"> {{ data.cljg == '01' ? '已勾选' : '未勾选' }}</template>
      <template #sfycpz="{ data }"> {{ data.sfycpz == '01' ? '正常' : data.sfycpz == '02' ? '异常' : data.sfycpz == '03' ?
      '疑似异常' : '' }}</template>
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
  </div>
</template>

<script>
import moment from "moment";
import FormList from '@/components/FormList.vue';
import { checkCustomsPayment,getKjList } from './Api'
import { inputFplxMap } from '@/config/constant'

export default {
  name: 'customs',
  components: {
    FormList
  },
  data() {
    return {
      inputFplxMap,
      api: require('./Api'),
      param: {},
      loading: false,
      columns: [
        { type: "selection", width: 50, },
        { title: '序号', type: "index", width: 50, },
        { title: "海关缴款书号码", width: 140, dataIndex: "hgjkshm", slot: 'hgjkshm', align: 'center' },
        { title: "填发日期", width: 180, dataIndex: 'tfrq' },
        { title: "有效抵扣税额", width: 150, dataIndex: "tfrq", slot: 'tfrq' },
        { title: "加计扣除额合计", width: 160, dataIndex: "bkjnsrsbh", },
        { title: "加计扣除剩余额 ", width: 160, dataIndex: "bkjnsrmc", },
        { title: "缴款单位人纳税人识别号", dataIndex: "jkdwrnsrsbh", width: 160, },
        { title: "缴款单位人纳税人名称", width: 150, dataIndex: "jkdwrnsrmc", slot: 'jkdwrnsrmc', align: 'center' },
        { title: "是否重号锁定", width: 130, dataIndex: "sfchsd" },
        { title: "认证状态", width: 130, dataIndex: "createrName" },
        { title: "勾选失败原类", width: 130, dataIndex: "createrName" },
        { title: "勾选人", width: 130, dataIndex: "createrName" },
        { title: "勾选时间", width: 130, dataIndex: "createrName" },
        { title: "入账状态", width: 130, dataIndex: " rzzt" },
        { title: "入账日期", width: 130, dataIndex: "createrName" },
        { title: "入账属期", width: 130, dataIndex: "createrName" },

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
          key: "sfchsd",
          val: "",
          type: "select",
          options: [
            { value: "02", label: "锁定" },
            { value: "01", label: "未锁定" },
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
      searchParam: { cljg: '02' },


    };
  },
  mounted() {
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
    this.param = param;
    this.$refs.list.handleGetData(param)
  },
  watch: {
    activeName() {
      this.$router.push({
        path: '/deductionStatistics/list',
        query: this.$route.query
      })
    },
  },
  computed: {
    height() {
      return window.innerHeight - 390;
    },
  },

  methods: {
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
        this.$set(this.searchList[index],'options',options)
      }
    },
    // 导出发票数据
    async exportWithholdList() {
      const fileName = `代扣代缴信息列表.xlsx`
      await exportWithholdList({
        reqData: { ...this.queryParam, sign: 'Y', pageNo: 1, pageSize: 9999999 },
        fileName
      })
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
