<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <div class="content-header">
      <BackBtn path="/outputInvoice/redInvoice/enterpriseList/index" align="left" />
      <el-tabs class="custom-card-tabs" v-model="activeName" type="card">
        <el-tab-pane name="0" label="我发出的" />
        <el-tab-pane name="1" label="我收到的" />
      </el-tabs>
      <div> <i class="el-icon-warning" />当前纳税主体: {{ $route.query.nsrmc }} </div>
    </div>

    <form-list :key="propsKey" :columns="columns" :firstLoading="false" :searchRow="searchList" :api="api" :param="param" :height="height" ref="list" :tableCounterShow="true" :tableCounterConfig="tableCounterConfig"
      @getSearchParam="getSearchParam">
      <template #lrfsf="row">{{ row.data.lrfsf === '0' ? '销售方' : '购买方' }}</template>

      <template #ykjhzfpbz="row">{{ row.data.ykjhzfpbz === 'Y' ? '已开具' : row.data.ykjhzfpbz === 'F' ? '开具失败' : '未开具' }}</template>

      <template #shzt="row">
        <span :class="row.data.shzt != null ? examineStatusMap[row.data.shzt].class : ''">
          <a v-if="row.data.shzt == 3" href="javascript:void(0);" @click="showReason('bhyy', row.data.shxx)">
            {{ row.data.shzt != null ? examineStatusMap[row.data.shzt].label : '-' }}
          </a>
          <template v-else>
            {{ row.data.shzt != null ? examineStatusMap[row.data.shzt].label : '-' }}
          </template>
        </span>
      </template>
      <!-- （当审核状态为待审核时，用-表示） -->
      <template #hzqrxxztDm="row">
        <span :class="row.data.hzqrxxztDm ? confirmStatusMap[row.data.hzqrxxztDm].class : ''"> {{ row.data.hzqrxxztDm ? confirmStatusMap[row.data.hzqrxxztDm].label : '-' }}</span>
      </template>
      <!-- 对方纳税人名称 -->
      <template #dfnsrmc="row">
        <!-- 我发出的 -->
        <template v-if="activeName == 0">
          {{ row.data.lrfsf == '0' ? row.data.gmfmc : row.data.xsfmc }}
        </template>
        <!-- 我收到的 -->
        <template v-else>
          {{ row.data.lrfsf == '0' ? row.data.xsfmc : row.data.gmfmc }}
        </template>
      </template>
      <template #dfnsrsbh="row">
        <!-- 我发出的 -->
        <template v-if="activeName == 0">
          {{ row.data.lrfsf == '0' ? row.data.gmfnsrsbh : row.data.xsfnsrsbh }}
        </template>
        <!-- 我收到的 -->
        <template v-else>
          {{ row.data.lrfsf == '0' ? row.data.xsfnsrsbh : row.data.gmfnsrsbh }}
        </template>

      </template>
      <template #chyyDm="row">{{ chyyDmMap[row.data.chyyDm] }}</template>
      <!-- <template #lrrqq="row">{{ dateFormat('YYYY-mm-dd', row.data.lrrqq) }}</template> -->
      <template #lrrqq="row">{{ dateFormat('YYYY-mm-dd', row.data.lrrqq) }}</template>


      <template #hzcxje="row">{{ formatMoney(row.data.hzcxje) }}</template>
      <template #hzcxse="row">{{ formatMoney(row.data.hzcxse) }}</template>

      <template #myscope="{ data }">
        <el-popover placement="left" trigger="hover" popper-class="customPopper">
          <template>
            <!-- 我发出的，草稿中状态的可以编辑, 删除 -->
            <template v-if="activeName == '0' && data.hzqrxxztDm === '00'">
              <el-button @click.stop="handleInvoice(data, 'edit')" type="success">编辑</el-button>
              <el-button @click.stop="handleDelete(data)" type="danger">删除</el-button>
            </template>
            <!-- 否则只能查看 -->
            <el-button v-else @click.stop="handleInvoice(data)" type="success">查看</el-button>
            <!-- 撤销: 我发出的 1. 我作为销方发出，等待购方确认， 2. 我作为购方发出，等待销方确认 -->
            <el-button v-if="activeName == '0' && ((data.lrfsf == '0' && data.hzqrxxztDm == '02') || (data.lrfsf == '1' && data.hzqrxxztDm == '03'))" @click.stop="confirm('C', data)" type="danger">撤销</el-button>
            <!-- <el-button @click="(e) => confirm('C', data, e)">撤销</el-button> -->

            <!-- 红票已开 -->
            <el-button v-if="data.ykjhzfpbz == 'Y'" @click.stop="previewPdf(data, '/mtc/red/previewPdf')" type="warning">查看红票</el-button>

            <!-- 拒绝原因: 1.我作为销方发起，购方拒绝 hzqrxxztDm 05 2. 我作为销方收到，销方拒绝 hzqrxxztDm 06-->
            <el-button v-if="data.shzt == 3" @click.stop="showReason('bhyy', data.shxx)">驳回原因</el-button>

            <!-- 开具失败原因: 1.我作为销方发出，局端开票失败10-->
            <el-button v-if="data.kjsbyy" @click.stop="showReason('kjsbyy', data.kjsbyy)" type="warning">开具失败原因</el-button>
          </template>
          <el-button slot="reference">操作</el-button>
        </el-popover>
      </template>

      <!-- 批量操作 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button type="danger" @click="addApplyForm">新增红字信息表</el-button>
            <!-- 只有我收到的才能通过驳回 -->
            <template v-if="activeName == '1'">
              <el-button @click="confirm('Y')">通过</el-button>
              <el-button @click="confirm('N')">驳回</el-button>
            </template>
            <!-- 销方发出等待对方确认可撤销 -->
            <el-button v-if="activeName == '0'" @click="confirm('C')">撤销</el-button>
            <el-button @click="downloadConfirmList">导出</el-button>
          </div>
        </div>
      </template>
    </form-list>

    <!-- 红字信息单确认 -->
    <ConfirnModal :lrfsf="lrfsf" @handleOk="handleOk" ref="confirnModal" />

    <el-dialog title="审核驳回原因" :visible.sync="backDialog" width="30%">
      <span style="width: 90%;color: #FF0000;font-size: 18px;">
        {{ this.backMsg }}
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="backDialog = false">关 闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import FormList from "@/components/FormList.vue";
import BackBtn from "@/components/BackBtn";
import ConfirnModal from "@/components/ConfirnModal/Index.vue";
import { getOrgList, check, downLoadApplyList } from "./sendApi";
import { previewPdf, dateFormat } from "@/utils/tool";
import { confirmStatusList, examineStatusList, confirmStatusMap, chyyDmMap, examineStatusMap } from "../constant";

export default {
  name: "InfoTable",
  components: {
    FormList,
    ConfirnModal,
    BackBtn
  },
  data() {
    return {
      activeName: "0",
      form: {},
      sendApi: require("./sendApi"),
      receiveApi: require("./receiveApi"),
      param: {},
      // 待处理的发票数量
      confirmStatusMap,
      examineStatusMap,
      chyyDmMap,
      columns: [
        { type: "selection", width: 50 },
        { title: "序号", type: "index" },
        { title: "购/销方发起身份", width: 130, dataIndex: "lrfsf", align: "center", slot: "lrfsf" },
        { title: "对方纳税人名称", width: 130, dataIndex: "dfnsrmc", slot: 'dfnsrmc' },
        { title: "对方纳税人识别号码", width: 150, dataIndex: "dfnsrsbh", slot: 'dfnsrsbh' },
        { title: "红字通知单编号", width: 130, dataIndex: "hzfpxxqrdbh" },
        { title: "确认单状态", width: 130, align: "center", dataIndex: "hzqrxxztDm", slot: "hzqrxxztDm" },
        { title: "审核状态", width: 110, align: "center", dataIndex: "shzt", slot: "shzt" },
        { title: "对应蓝字发票号码", width: 140, dataIndex: "lzfphm" },
        { title: "对应蓝字发票代码", width: 140, dataIndex: "lzfpdm" },
        { title: "不含税金额", dataIndex: "hzcxje", slot: 'hzcxje', align: 'right', width: 100 },
        { title: "税额", dataIndex: "hzcxse", slot: 'hzcxse', align: 'right', width: 100 },
        { title: "审核人", dataIndex: "hpshr", align: 'center', width: 100 },
        { title: "提交时间", dataIndex: "lrrqq", slot: 'lrrqq', align: "center", width: 100, },
        { title: "冲红原因", dataIndex: "chyyDm", align: "center", slot: "chyyDm", width: 120, },
        { title: "开具状态", dataIndex: "ykjhzfpbz", align: "center", slot: "ykjhzfpbz" },
        { title: "操作", key: "action", fixed: "right", width: 80, scopedSlots: { customRender: "action" } }
      ],
      
      searchList: [
        {
          label: "购/销方选择",
          placeholder: "请选择",
          key: "lrfsf",
          val: "0",
          type: "select",
          options: [
            { value: "0", label: "我是销售方" },
            { value: "1", label: "我是购买方" }
          ]
        },
        {
          label: "对方纳税人名称",
          key: "dfnsrmc",
          val: "",
          type: "input",
          placeholder: "请输入"
        },
        {
          label: "对方纳税人识别号",
          key: "dfnsrsbh",
          val: "",
          type: "input",
          placeholder: "请输入"
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
          key: "fpdm",
          val: "",
          type: "input",
          placeholder: "请输入"
        },
        {
          label: "所属组织",
          key: "orgid",
          val: "",
          type: "select",
          options: [],
        },
        {
          label: "提交时间",
          key: "lrrq",
          val: [],
          type: "daterange",
          placeholder: "请选择",
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }
        },
        {
          label: "不含税金额",
          key: "hzcxje",
          val: "",
          type: "input",
          placeholder: "请输入"
        },
        {
          label: "确认单状态",
          placeholder: "请选择",
          key: "hzqrxxztDm",
          val: "",
          type: "select",
          options: [{ value: "", label: "全部" }, ...confirmStatusList]
        },

        {
          label: "审核状态",
          placeholder: "请选择",
          key: "shzt",
          val: "",
          type: "select",
          options: [{ value: "", label: "全部" }].concat(examineStatusList)
        },
        {
          label: "开票状态",
          placeholder: "请选择",
          key: "kpzt",
          val: "",
          type: "select",
          options: [
            { value: "", label: "全部" },
            { value: "Y", label: "已开具" },
            { value: "N", label: "未开具" },
            { value: "F", label: "开具失败" },
          ]
        }
      ],
      hideShztColumn: false, // 我收到的，我是销方，不展示审核状态
      lrfsf: '',
      tableCounterConfig: {
        hjje: 'lzhjje',
        hjse: 'lzhjse',
      },
      queryParam: {},
      backDialog: false,
      backMsg: '',
      propsKey: '',
    };
  },
  activated() {
    this.getOrgList();
    const { taxBodyId } = this.$route.query
    this.param.taxBodyId = taxBodyId
    this.param.lrfsf = '0' //  购销售方类型
    this.propsKey = `${this.activeName}-${taxBodyId}`
    this.getList()
  },
  watch: {
    activeName() {
      this.getList()
    },
    hideShztColumn(val) {
      const index = this.columns.findIndex((item) => item.dataIndex === 'shzt');
      this.columns[index].hidden = val
    }
  },
  computed: {
    height() {
      return window.innerHeight - 340;
    },
    api() {
      return this.activeName == '0' ? this.sendApi : this.receiveApi
    },
    contentHeight() {
      return window.innerHeight - 132;
    },

  },

  methods: {
    dateFormat,
    // 查询所属组织
    async getOrgList() {
      const { code = '', data = [] } = await getOrgList({
        taxBodyId: this.$route.query.taxBodyId
      })
      const index = this.searchList.findIndex((item) => item.key === 'orgid');
      if (code === '0') {
        this.searchList[index].options = [{ value: "", label: "全部" }].concat(data.map((item) => {
          return {
            ...item,
            value: item.id,
            label: item.name
          }
        }))
      }
    },

    // 红字信息单确认
    confirm(qrlx, data, e) {
      const selections = this.$refs.list.getSelections();
      if (selections.some((item) => item.ykjhzfpbz == 'Y')) {
        this.$message.warning('已开具红字申请单，不可操作')
        return;
      }
      if (qrlx == 'C' && selections.some((item) => !item.hzfpxxqrdbh)) {
        this.$message.warning('存在不允许撤销的数据')
        return;
      }
      this.$refs.confirnModal.confirm(qrlx, data, selections);
      if (e) e.preventDefault();
    },
    // 红字信息单确认回调
    handleOk() {
      this.$refs.list.reload()
    },
    showReason(type, msg) {
      const title = type == 'bhyy' ? '驳回原因' : '拒绝原因'
      // this.$confirm(msg, '', {
      //   confirmButtonText: '确认',
      //   showCancelButton: false,
      // })
      this.backMsg = msg;
      this.backDialog = true;
    },
    getList() {
      this.$nextTick(() => {
        this.$refs.list.reload()
      })
    },

    // 预览pdf
    previewPdf,
    // 新增红色信息表
    async addApplyForm() {
      const { code = '', data = [] } = await check({
        nsrsbh: this.$route.query.nsrsbh || '',
      })
      if (code === '0') {
        this.$router.push({
          path: "/redInvoice/addApplyForm",
          query: this.$route.query
        });
        this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
      }

    },

    /**
     * @description 行内按钮
     * @param operateType 操作类型 edit: 编辑（红字确认单状态为草稿中），waitConfirm: 等待我方确认，detail: 查看详情
     */
    handleInvoice(row, type) {
      let operateType = 'detail';
      // 等待我方确认：我收到的 =>  1. 我作为销方，收到购方发出的等待销方确认
      if (this.activeName === '1' && (row.lrfsf == '1' && row.hzqrxxztDm === '03' || row.lrfsf == '0' && row.hzqrxxztDm === '02')) {
        operateType = 'waitConfirm'
      }
      // 当前购销方身份，我作为
      this.$router.push({
        path: "/redInvoice/redInfoConfirm",
        query: {
          id: row.id,
          nsrsbh: this.$route.query.nsrsbh,
          nsrmc: this.$route.query.nsrmc,
          taxBodyId: this.$route.query.taxBodyId,
          operateType: type || operateType
        }
      });

    },
    handleDelete(data) {
      this.$refs.list.deleteData(data.id);
    },

    getSearchParam(param) {
      this.lrfsf = param.lrfsf
      this.hideShztColumn = this.activeName === '1' && param.lrfsf == '1';
      this.queryParam = param;
    },
    async downloadConfirmList() {
      const fileName = `红字发票信息列表.xlsx`
      await downLoadApplyList({
        reqData: { ...this.queryParam, level: this.activeName },
        fileName
      })
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../../../styles/variables.scss";
.content-header {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: $mainTextColor;

  .el-icon-warning {
    margin: 0 4px 0 12px;
    color: #e6a23c;
  }
}

.table-footer {
  padding-top: 12px;
  font-weight: bold;

  span {
    color: green;
  }
}
</style>
