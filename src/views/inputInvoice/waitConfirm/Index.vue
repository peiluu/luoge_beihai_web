<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <form-list :key="level" :columns="columns" :searchRow="djkpfs == 1 ? rpaSearchList : searchList" :api="api" :param="param" :height="height" :tableCounterShow="true" @getNextList="getNextList"
      :tableCounterConfig="tableCounterConfig" ref="list">
      <template #lrfsf>购买方</template>

      <template #ykjhzfpbz="row">{{ row.data.ykjhzfpbz === 'Y' ? '已开具' : '未开具' }}</template>
      <!-- <template #shzt="row">
        <span :class="row.data.shzt != null ? examineStatusMap[row.data.shzt].class : ''"> {{ row.data.shzt != null ? examineStatusMap[row.data.shzt].label : '-' }}</span>
      </template> -->
      <!-- （当审核状态为待审核时，用-表示） -->
      <template #hzqrxxztDm="row">
        <span :class="row.data.hzqrxxztDm != null ? confirmStatusMap[row.data.hzqrxxztDm].class : ''"> {{ row.data.hzqrxxztDm != null ? confirmStatusMap[row.data.hzqrxxztDm].label : '-' }}</span>
      </template>

      <template #chyyDm="row">{{ chyyDmMap[row.data.chyyDm] }}</template>
      <template #hzcxje="row">{{ formatMoney(row.data.hzcxje) }}</template>
      <template #hzcxse="row">{{ formatMoney(row.data.hzcxse) }}</template>
      <template #lrrqq="row">{{ row.data.lrrqq ? dateFormat('YYYY-mm-dd', row.data.lrrqq) : '' }}</template>

      <!-- 操作按钮 -->
      <template #myscope="{ data }">
        <el-popover placement="left" trigger="hover" popper-class="customPopper">
          <template>
            <!-- 待我确认的 -->
            <el-button @click.stop="handleInvoice(data, 'waitConfirm')" type="success">查看</el-button>
          </template>
          <el-button slot="reference">操作</el-button>
        </el-popover>
      </template>
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button @click="confirm('Y')">通过</el-button>
            <el-button @click="confirm('N')">驳回</el-button>
          </div>
        </div>
      </template>
    </form-list>
    <!-- 确认操作 -->
    <ConfirnModal :lrfsf="'1'" @handleOk="handleOk" ref="confirnModal" />
  </div>
</template>

<script>
import FormList from "@/components/FormList.vue";
import ConfirnModal from "@/components/ConfirnModal/Index.vue";
import { dateFormat } from "@/utils/tool";
import { confirmStatusMap, chyyDmMap, examineStatusList, examineStatusMap } from "@/views/outputInvoice/redInvoice/constant";
import { getListByUser } from "./Api";

export default {
  name: "WaitConfirm",
  components: {
    FormList,
    ConfirnModal
  },
  data() {
    return {
      form: {},
      api: require("./Api"),
      param: {},
      // 待处理的发票数量
      confirmStatusMap,
      examineStatusMap,
      chyyDmMap,
      columns: [
        { type: "selection", width: 50 },
        { title: "序号", type: "index" },
        { title: "购/销方发起身份", width: 130, dataIndex: "lrfsf", slot: "lrfsf", align: 'center' },
        { title: "销售方名称", width: 130, dataIndex: "xsfmc" },
        { title: "销售方识别号", width: 150, dataIndex: "xsfnsrsbh" },
        { title: "购买方名称", width: 130, dataIndex: "gmfmc", },
        { title: "购买方识别号", width: 150, dataIndex: "gmfnsrsbh" },
        { title: "红字通知单编号", width: 130, dataIndex: "hzfpxxqrdbh" },
        { title: "确认单状态", width: 130, dataIndex: "hzqrxxztDm", slot: "hzqrxxztDm" },
        // { title: "审核状态", dataIndex: "shzt", slot: "shzt" },
        { title: "对应蓝字发票号码", width: 140, dataIndex: "lzfphm" },
        { title: "对应蓝字发票代码", width: 140, dataIndex: "lzfpdm" },
        { title: "不含税金额", dataIndex: "hzcxje", slot: 'hzcxje', align: 'right', width: 100 },
        { title: "税额", dataIndex: "hzcxse", slot: 'hzcxse', align: 'right', width: 100 },
        { title: "审核人", dataIndex: "hpshr", align: 'center', width: 100 },
        { title: "提交时间", dataIndex: "lrrqq", slot: 'lrrqq', width: 100, align: 'center' },
        { title: "冲红原因", dataIndex: "chyyDm", slot: "chyyDm", align: 'center', width: 100 },
        { title: "开具状态", dataIndex: "ykjhzfpbz", slot: "ykjhzfpbz", align: 'center' },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          width: 80,
          scopedSlots: { customRender: "action" }
        }
      ],
      searchList: [
        {
          label: "购/销方选择",
          placeholder: "请选择",
          key: "lrfsf",
          val: "我是购买方",
          type: "text",
        },
        {
          label: "购买方纳税主体",
          placeholder: "请选择",
          key: "taxBodyId",
          type: "select",
          nextPropskey: '',
          isQueryNext: true,
          val: "",
          options: []
        },
        {
          label: "销售方名称",
          key: "dfnsrmc",
          val: "",
          type: "input",
          placeholder: "请输入"
        },
        {
          label: "销售方识别号",
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
          label: "不含税金额",
          key: "hzcxje",
          val: "",
          type: "input",
          placeholder: "请输入"
        },
        {
          label: "提交时间",
          key: "lrrq",
          val: [],
          type: "daterange",
          placeholder: '请选择',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }
        },
        // {
        //   label: "审核状态",
        //   placeholder: "请选择",
        //   key: "shzt",
        //   val: "",
        //   type: "select",
        //   options: [{ value: "", label: "全部" }].concat(examineStatusList)
        // },
      ],
      rpaSearchList: [
        {
          label: "购/销方选择",
          placeholder: "请选择",
          key: "lrfsf",
          val: "我是购买方",
          type: "text",
        },
        {
          label: "购买方纳税主体",
          placeholder: "请选择",
          key: "taxBodyId",
          type: "select",
          nextPropskey: '',
          isQueryNext: true,
          val: "",
          options: []
        },
        {
          label: "红字信息单编号",
          key: "hzfpxxqrdbh",
          val: "",
          type: "input",
          placeholder: "请输入"
        },
        // {
        //   label: "红字UUID",
        //   key: "uuid",
        //   val: "",
        //   type: "input",
        //   placeholder: "请输入"
        // },

        {
          label: "开票日期起止",
          key: "kprq",
          val: [],
          type: "daterange",
          placeholder: '请选择',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }
        },
      ],
      tableCounterConfig: {
        hjje: 'lzhjje',
        hjse: 'lzhjse',
      },
      taxBodyIdList: [],
      djkpfs: '0',
    };
  },
  activated() {
    this.getListByUser();
    this.param.taxBodyId = this.$route.query.taxBodyId
  },
  // 同一页面切换会触发更新
  computed: {
    height() {
      return window.innerHeight - 300;
    },
    contentHeight() {
      return window.innerHeight - 132;
    },
    level() {
      // level: output - 销项待确认的 input. 进项待确认
      return this.$route.path == '/outputInvoice/waitConfirm' ? 'output' : 'input'
    },
  },

  methods: {
    dateFormat,
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({
        taxBodyId: this.$route.query.taxBodyId, isDigital: "Y"
      })
      const list = [{ value: "", label: "全部" }].concat(data.map((item) => {
        return {
          ...item,
          value: item.id,
          label: item.nsrmc + ' ' + item.nsrsbh
        }
      }))
      this.taxBodyIdList = data;
      this.searchList[1].options = list
      this.rpaSearchList[1].options = list
    },

    handleDelete(data) {
      this.$refs.list.deleteData(data.id);
    },
    handleOk() {
      this.$refs.list.reload()
    },
    confirm(qrlx, data, e) {
      const selections = this.$refs.list.getSelections()
      this.$refs.confirnModal.confirm(qrlx, data, selections);
      if (e) e.preventDefault();
    },
    /**
     * @description 行内按钮
     * @param operateType 操作类型waitConfirm: 等待我方确认情
     */
    handleInvoice(row, operateType) {
      this.$router.push({
        path: "/redInvoice/redInfoConfirm",
        query: {
          ...this.$route.query,
          id: row.id,
          level: this.level,
          operateType
        }
      });
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
    },
    getNextList(val) {
      // 如果是rpa开票的主体，换一个查询的条件
      this.rpaSearchList[1].val = val;
      this.djkpfs = this.taxBodyIdList.find((item) => item.id == val)?.djkpfs || 0
    },
  }
};
</script>
