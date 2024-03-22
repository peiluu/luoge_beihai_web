<template>
    <div class="main-content">
      <form-list :key="level" :columns="columns" :searchRow="searchList" :api="api" :param="param" :otherParam="otherParam" :height="height"
        :showSearch="true" ref="list">
        <template #gxfsf="row"> {{ row.data.gxfsf == 0 ? "销售方" : "购买方" }}</template>
  
        <template #ykjhzfpbz="row">{{ row.data.ykjhzfpbz === 'Y' ? '已开具' : '未开具' }}</template>
        <template #shzt="row">
          <span :class="row.data.shzt != null ? examineStatusMap[row.data.shzt].class : ''"> {{ row.data.shzt != null ?
            examineStatusMap[row.data.shzt].label : '-' }}</span>
        </template>
        <!-- （当审核状态为待审核时，用-表示） -->
        <template #hzqrxxztDm="row">
          <span :class="row.data.hzqrxxztDm != null ? confirmStatusMap[row.data.hzqrxxztDm].class : ''"> {{
            row.data.hzqrxxztDm != null ? confirmStatusMap[row.data.hzqrxxztDm].label : '-' }}</span>
        </template>
<!--   
        <template #chyyDm="row">{{ chyyDmMap[row.data.chyyDm] }}</template>
        <template #hzcxje="row">{{ formatMoney(row.data.hzcxje) }}</template>
        <template #hzcxse="row">{{ formatMoney(row.data.hzcxse) }}</template>
   -->
        <!-- 操作按钮 -->
        <template #myscope="{ data }">
          <template>
            <el-button @click.stop="handleInvoice(data)" type="success">修改</el-button>
            <el-button @click.stop="" type="">删除</el-button>

          </template>
        </template>
        <!-- 中间部分 -->
        <template #topTool>
          <div class="toolbar" :style="`visibility: ${otherParam.type === '1' ? 'visible': 'hidden'}`">
            <div class="toolbar-left" />
            <div class="toolbar-right">
              <el-button @click="">新增</el-button>
              <el-button @click="">删除</el-button>
              <el-button @click="">导入</el-button>
              <el-button @click="downloadNoList">导出</el-button>

              <!-- <el-button @click="confirm('Y')">通过</el-button>
              <el-button type="danger" @click="confirm('N')">驳回</el-button> -->
            </div>
          </div>
        </template>
      </form-list>
      <!-- 确认操作 -->
      <ConfirnModal :gxfsf="this.gxfsf" @handleOk="handleOk" ref="confirnModal" />
    </div>
  </template>
  
  <script>
  import FormList from "@/components/FormList.vue";
  import ConfirnModal from "@/components/ConfirnModal/Index.vue";
  import { dateFormat } from "@/utils/tool";
  import { confirmStatusMap, chyyDmMap, examineStatusMap } from "@/views/outputInvoice/redInvoice/constant";
  export default {
    name: "WaitConfirm",
    components: {
      FormList,
      ConfirnModal
    },
  
    data() {
      return {
        api: require("./Api"),
        otherParam: {type: '1'},
        param: { 'gxfsf': '1'},
        gxfsf: '',
        // 待处理的发票数量
        confirmStatusMap,
        examineStatusMap,
        chyyDmMap,
        columns: [
          { type: "selection", width: 50 },
          { title: "序号", type: "index" },
          { title: "企业类型", dataIndex: "gxfsf", slot: "gxfsf", width: 130, },
          { title: "风险尖型", width: 130, dataIndex: "xsfmc" },
          { title: "企业名称", width: 200, dataIndex: "xsfnsrsbh" },
          { title: "地区", width: 130, dataIndex: "gmfmc", },
          { title: "所属税务机关名称", width: 200, dataIndex: "gmfnsrsbh" },
          { title: "纳税人识别号", width: 180, dataIndex: "hzfpxxqrdbh" },
          { title: "经营地点", width: 180, dataIndex: "lzfphm" },
          { title: "案件描述", width: 180, dataIndex: "lzfpdm" },
          { title: "数据来源", dataIndex: "hzcxje", slot: 'hzcxje', align: 'right', width: 100 },
          { title: "生效日期", dataIndex: "hzcxse", slot: 'hzcxse', align: 'right', width: 100 },
          { title: "失效日期", dataIndex: "chyyDm", slot: "chyyDm", width: 100, },
          { title: "确认单状态", width: 170, dataIndex: "hzqrxxztDm", slot: "hzqrxxztDm", formatter: "statusFormatter" },
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
            label: "企业类别",
            key: "gxfsf",
            val: '',
            type: "select",
            options: [
              { value: "1", label: "购买方" },
              { value: "0", label: "销售方" }]
          },
          {
            label: "风险类型",
            key: "gxfsf",
            val: '',
            type: "select",
            options: [
              { value: "1", label: "购买方" },
              { value: "0", label: "销售方" }]
          },
  
        ],
      };
    },
    mounted() {
      this.handleOk()
    },
  
    // 同一页面切换会触发更新
    computed: {
      height() {
        return window.innerHeight - 280;
  
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
      statusFormatter(row) {
        const status = row.status;
        if (status == '02') {
          return "销方录入待购方确认";
        } else if (status == '03') {
          return "购方录入待销方确认";
        } else if (status == '04') {
          return "购销双方已确认";
        }
      },
  
  
      dateFormat,
      handleOk() {
        this.$refs.list.reload()
        this.$emit('getCreditInfo')
      },
      confirm(qrlx, data, e) {
        const selections = this.$refs.list.getSelections()
        if (!selections.length) {
          this.$message.warning('请至少选择一条数据')
          return;
        }
        if (selections.find((item) => item.gxfsf == 0) && selections.find((item) => item.gxfsf == 1)) {
          this.$message.warning('请勿同时操作进项票和销项票')
          return;
        }
        // 操作的时候取反
        this.gxfsf = selections[0].gxfsf == 0 ? '1' : '0'
        this.$refs.confirnModal.confirm(qrlx, data, selections);
        if (e) e.preventDefault();
      },
      /**
       * @description 行内按钮
       */
      handleInvoice(row) {
        this.$router.push({
          path: "/redInvoice/redInfoConfirm",
          query: {
            ...this.$route.query,
            id: row.id,
            level: this.level,
            isFormTodoList: 'Y',
            operateType: row.hzqrxxztDm === '03' ? 'waitConfirm' : 'confirmdetail'
          }
        });
        this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
      },
      handleClick(tab) {
        console.log(tab.name);
        this.otherParam.type = tab.name;
        this.$refs.list.reload({ type: tab.name });
      },
      async downloadNoList() {
      const fileName = `失信人员黑名单.xlsx`
      await this.api.downLoadNoOpenList({
        reqData: { ...this.queryParam },
        fileName
      })
    }
    }
  };
  </script>
  