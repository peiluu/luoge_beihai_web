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
      @select="handleSelected"
      @selectAll="selectAll"
      @getTableData="getTableData"
      preCheck
      v-loading="loading"
      :tableCounterShow="true"
      ref="list"
      :firstLoading="level === '3'"
      type="selection"
      :selectable="checkSelectable"
      :reserve-selection="true"
    >
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button
              type="success"
              @click="cancleBatch('02')"
              v-if="$refs.list && $refs.list.searchParam.cljg == '01'"
              >撤销勾选</el-button
            >
            <el-button type="success" @click="submitBatch('01')" v-else
              >提交勾选</el-button
            >
            <el-button @click="exportWithholdList">导出</el-button>
            <el-button
              @click="importExcel"
              v-if="$refs.list && $refs.list.searchParam.cljg == '02'"
              >导入</el-button
            >
          </div>
        </div>
      </template>
      <template #cljg="{ data }">
        {{ data.cljg == "01" ? "已勾选" : "未勾选" }}</template
      >
      <template #sfycpz="{ data }">
        {{
          data.sfycpz == "01"
            ? "正常"
            : data.sfycpz == "02"
            ? "异常"
            : data.sfycpz == "03"
            ? "疑似异常"
            : ""
        }}</template
      >
      <template #fplx="{ data }"> {{ inputFplxMap[data.fplx] }} </template>
      <template #tfrq="{ data }">
        {{ data.tfrq ? dateFormat("YYYY-MM-DD", data.tfrq) : "" }}
      </template>
      <template #gxsj="{ data }">
        {{ data.gxsj ? dateFormat("YYYY-MM-DD", data.gxsj) : "" }}
      </template>
    </form-list>
    <!-- dialog 提交勾选 -->
    <el-dialog
      title="请确认"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <template v-if="abnormalList.length > 0">
        <div class="title">
          <i class="el-icon-warning" />您勾选的发票中含有疑点发票，请谨慎勾选
        </div>
        <div class="tip">是否确认提交</div>
        <div class="list">
          <span v-for="item in abnormalList" :key="item.fphm">{{
            item.fphm
          }}</span>
        </div>
      </template>
      <template v-else>
        <div class="title title-normal">
          <i class="el-icon-warning" />本次勾选<span>{{
            selections.length
          }}</span
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
      :upApi="`/income/uplodeDkdjwspz/${nsrsbh}/${skssq}`"
      importApi="/income/checkPreCheckDkdj"
      upTitle="上传发票勾选数据"
      effImport
      :importColumns="importColumns"
    ></custom-import>
  </div>
</template>

<script>
import moment from "moment";
import FormList from "@/components/FormList.vue";
import { batchWithhold, exportWithholdList, checkPreOneDkdj,cstateDkdj } from "./Api";
import { inputFplxMap } from "@/config/constant";
import CustomImport from "@/components/CustomImport";

export default {
  name: "invoiceDeductionCheckWithhold",
  components: {
    FormList,
    CustomImport,
  },
  props: {
    level: {
      type: String,
      default: "",
    },
    skssq: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dialogImportVisible: false, // 导入
      inputFplxMap,
      api: require("./Api"),
      param: {},
      loading: false,
      columns: [
        { type: "selection", width: 50 },
        { title: "序号", type: "index", width: 50 },
        {
          title: "勾选状态",
          width: 80,
          dataIndex: "cljg",
          slot: "cljg",
          align: "center",
        },
        { title: "代扣代缴完税凭证号", width: 180, dataIndex: "dkdjwspzh" },
        { title: "填发日期", width: 150, dataIndex: "tfrq", slot: "tfrq" },
        { title: "被扣缴义务人识别号", width: 160, dataIndex: "bkjnsrsbh" },
        { title: "被扣缴义务人名称", width: 160, dataIndex: "bkjnsrmc" },
        { title: "有效抵扣税额", dataIndex: "yxdkse", width: 120 },
        {
          title: "勾选时间",
          width: 150,
          dataIndex: "gxsj",
          slot: "gxsj",
          align: "center",
        },
        { title: "勾选人", width: 130, dataIndex: "createrName" },
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
          label: "代扣代缴完税凭证",
          key: "dkdjwspzh",
          val: "",
          type: "input",
          placeholder: "请输入",
        },
        {
          label: "被扣缴义务人识别号",
          key: "bkjnsrsbh",
          val: "",
          type: "input",
          placeholder: "请输入",
        },
        {
          label: "被扣缴义务人名称",
          key: "bkjnsrmc",
          val: "",
          type: "input",
          placeholder: "请输入",
        },
        {
          label: "填发日期",
          key: "tfrqList",
          val: [],
          type: "daterange",
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          },
        },
      ],
      importColumns: [
        { title: "勾选状态", width: 200, dataIndex: "nsrmc" },
        { title: "代扣代缴完税凭证号", width: 200, dataIndex: "orgName" },
        // { title: '填发日期', width: 200, dataIndex: 'orgName' },
        // { title: '被扣缴义务人识别号', width: 200, dataIndex: 'orgName' },
        // { title: '被扣缴义务人名称', width: 200, dataIndex: 'orgName' },
        // { title: '有效抵扣税额', width: 200, dataIndex: 'orgName' },
        // { title: '勾选时间', width: 200, dataIndex: 'orgName' },
        // { title: '勾选人', width: 200, dataIndex: 'orgName' },
      ],
      selecedInfo: {
        number: 0,
        sjje: 0,
        jsje: 0,
        yxdkse: 0,
      },
      selections: [],
      dialogVisible: false,
      abnormalList: [], // 异常列表
      gxlxDm: "", // 勾选类型代码
      totalEntity: {},
      queryParam: {},
      data:[],
    };
  },
  watch: {
    level(newV, oldV) {
      if (newV === "3") {
        this.init();
      }
    },
  },
  computed: {
    height() {
      return window.innerHeight - 460;
    },
    nsrsbh() {
      return this.$route.query.nsrsbh;
    },
  },

  methods: {
    init() {
      const param = {
        cljg: "02",
        skssq: this.$route.query.skssq,
        kjywrsbh: this.$route.query.nsrsbh,
        // bkjnsrsbh: this.$route.query.nsrsbh,
      };
      this.param = param;
      this.$refs.list.handleGetData(param);
    },
    getTableData(data){
      this.data = data;
      this.getHjje();
    },
    // 点击勾选icon触发handleSelected
    handleSelected(selection, row) {
      this.setPre({ids:[row.id], preCheck:row.preCheck === 'Y'?'N':'Y'});
    },
    selectAll(rows) {
      console.log('----rows---',rows,rows.length)
      let ids = [];
      let preCheck = ''
      if (rows.length === 0) {
        ids = this.data.map((item) => item.id);
        preCheck = 'N'
      } else {
        rows.forEach((item) => {
          console.log('--rows--', item.preCheck, item.id)
          if (item.preCheck !== "Y") {
            ids.push(item.id);
            preCheck = 'Y'
          }
        });
      }
      this.setPre({ids,preCheck});
    },
    async setPre({ids,preCheck}) {
      console.log("ids----", ids,preCheck);
      try {
        this.loading = true;
        const { code = "0", data } = await checkPreOneDkdj({ids,preCheck});
        if (code === "0") {
          this.init();
        }
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
    // 处理多选
    handleSelection(rows) {
      console.log('----handleSelection--',rows)
      this.selections = rows;
      // let hjje = 0,
      //   hjse = 0,
      //   jshj = 0;
      // rows.forEach((item) => {
      //   hjje += item.hjje;
      //   hjse += item.hjse;
      //   jshj += hjse + hjje;
      // });

      // this.selecedInfo = {
      //   number: rows.length,
      //   hjje: hjje.toFixed(2),
      //   hjse: hjse.toFixed(2),
      //   jshj,
      // };
    },
    // 撤销勾选
    cancleBatch(gxlxDm) {
      if (this.selections.length == 0) {
        this.$message.warning("请至少选择一条");
        return;
      }
      this.gxlxDm = gxlxDm;
      this.$confirm(`您确定撤销勾选吗？`, "请确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.batchWithhold();
      });
    },

    // 提交勾选
    submitBatch(gxlxDm) {
      if (this.selections.length == 0) {
        this.$message.warning("请至少选择一条");
        return;
      }
      this.gxlxDm = gxlxDm;
      this.$confirm(`您确定提交勾选吗？`, "请确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
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
      const { code = "" } = await batchWithhold({
        kjywrsbh: this.$route.query.nsrsbh,
        gxlxDm: this.gxlxDm,
        skssq: this.$route.query.skssq,
        dkdjmx: this.selections,
      });
      if (code === "0") {
        this.$message.success("提交成功");
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
        reqData: {
          ...this.queryParam,
          sign: "Y",
          pageNo: 1,
          pageSize: 9999999,
        },
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
      this.init()
    },

    handleClose() {
      this.dialogVisible = false;
      this.form = {};
    },

    checkSelectable(row) {
      // 规则一：sfqkrzgx: 'N' 不校验是否入账, 'Y' 校验是否入账。为“N”时不需要校验第二条规则，可以直接勾选
      // 规则二：row.purchaserstatus === 42 代表已入账，可以勾选，否则不能勾选
      return this.sfqkrzgx === "N" || row.purchaserstatus === 42;
    },
    rowClcik(row, column, event) {
      const f = this.checkSelectable(row);
      if (!f) {
        return;
      }
      this.$refs.table.toggleRowSelection(row);
    },

    dateFormat(fmt, val) {
      return moment(val).format(fmt);
    },
    handleReset() {
      this.pagination = {
        ...this.pagination,
        pageSize: 10,
        pageNo: 1,
      };
      this.searchParam = {
        cljg: "02",
        skssq: this.currentSq.dateValue,
        gfsbh: this.$route.query.nsrsbh,
      };
      this.handleGetData(this.searchParam);
    },
    // 提交撤销预勾选
    async submitRevokePreCheck(type) {
      if (this.selections.length == 0) {
        this.$message.warning("请至少选择一条");
        return;
      }
      this.$confirm(
        `您确定要${type === "Y" ? "提交" : "撤销"}预勾选吗？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          const ids = this.selections.map((item) => item.id);
          const { code = "" } = await checkPreOneDkdj({
            type,
            ids,
            gfsbh: this.nsrsbh,
            skssq: this.currentSq.dateValue,
            bz: this.searchParam.cljg == "01" ? "Y" : "N",
          });
          if (code === "0") {
            this.$message.success("提交成功");
            this.reload();
          }
        })
        .catch(() => {}); // 添加错误捕获
    },
    
    // 预勾选导出
    async exportPreCheck() {
      const fileName = `预勾选信息列表.xlsx`;
      await exportPreCheck({
        reqData: { nsrsbh: this.nsrsbh },
        fileName,
      });
    },
        // 统计
        async handleGetData(obj, args, keepSelections) {
      // this.keepSelections = false;
      this.searchParam = obj;
      let param = {};
      Object.keys(obj).map((key) => {
        if (obj[key] != null) {
          // 用obj[key].length > 0 只能判断字符串，会过滤掉数字
          // if (obj[key].length > 0) {
          //   param[key] = obj[key];
          // }
          if (obj && obj[key]) {
            param[key] = obj[key];
          }
        }
      });

      let res;
      const vm = this;
      let data = [];
      let pagination = this.pagination;
      this.loading = true;
      for (var field in args) {
        param[field] = args[field];
      }

      try {
        res = await this.api.getList({
          // startNumber: startNumber,
          ...param,
          pageNo: pagination.pageNo,
          pageSize: pagination.pageSize,
        });
        vm.getHjje();
        if (res && res.code == "0") {
          this.isPerCheck = false;
          // 在切换页面时不清空选中的数据
          if (!keepSelections) {
            this.$refs.table.clearSelection();
          }
          if (vm.buildFunction) {
            data = vm.buildFunction(res.data);
          } else {
            data = res.data;
          }
          if (data && data.length > 0) {
            const checkList = data.filter((item) => item.preCheck == "Y");
            this.setSelections(checkList);
            vm.data = data.map((each, index) => {
              return {
                ...each,
                index: index + 1,
              };
            });
          } else {
            vm.data = [];
          }
          vm.pagination.total = res.totalCount;
          if (res.total) {
            vm.$emit("sumTotal", res.total);
          }
        } else {
          // vm.$message.error(res.msg);
        }
        vm.loading = false;
      } catch (e) {
        vm.loading = false;
      }
    },
    async getHjje() {
      try {
        this.totalLoading = true;
        const { code = "0", data } = await cstateDkdj({
          nsrsbh: this.$route.query.nsrsbh,
          skssq: this.skssq,
        });
        if (code === "0") {
          this.selecedInfo = {
            number: data.ygxts,
            hjje: data.sjje,
            hjse: data.jsje,
            jshj: data.yxdkse,
          };
          this.$refs.list.handleTotalCounst({
            number: data.ygxts,
            hjje: data.jsje,
            hjse: data.sjje,
            jshj: data.yxdkse,
          })
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.totalLoading = false;
      }
    },
  },
};
</script>
