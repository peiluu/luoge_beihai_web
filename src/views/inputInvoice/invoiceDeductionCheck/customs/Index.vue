<template>
  <div class="com-withhold">
    <form-list :columns="dynamicCol" :searchRow="searchList" :api="api" :param="param" :height="height"
      @getSearchParam="getSearchParam" @handleSelection="handleSelection" @select="handleSelected"
      @selectAll="selectAll" @getTableData="getTableData" preCheck v-loading="loading" :tableCounterShow="true"
      ref="list" :firstLoading="level === '2'" :selectable="checkSelectable" :reserve-selection="true" 
      @rowClick="rowClick">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button type="success" @click="cancleBatch('02')"
              v-if="$refs.list && $refs.list.searchParam.cljg == '01'">撤销勾选</el-button>
            <el-button type="success" @click="submitBatch('01')" v-else>提交勾选</el-button>
            <el-button @click="exportInvoiceCheck">导出</el-button>
            <el-button @click="importExcel" v-if="$refs.list && $refs.list.searchParam.cljg == '02'">导入</el-button>
            <!-- <el-button type="" @click="exportSelectedData">导出选中发票</el-button> -->
          </div>
        </div>
      </template>
      <template #zczt="{ data }">
        {{
      data.zczt == "1"
        ? "未进项转出"
        : data.zczt == "2"
          ? "已全额转出"
          : data.zczt == "3"
            ? "已部署转出"
            : ""
    }}</template>
      <template #purchaserstatus="{ data }">
        {{
      data.purchaserstatus == "30"
        ? "未收票"
        : data.purchaserstatus == "36"
          ? "报帐中"
          : data.purchaserstatus == "42"
            ? "已记账"
            : ""
    }}</template>
      <template #verifyStatus="{ data }">
        {{
      data.verifyStatus == "1"
        ? "未勾选"
        : data.verifyStatus == "2"
          ? "已勾选"
          : data.verifyStatus == "3"
            ? "已认证"
            : data.verifyStatus == "4"
              ? "已统计"
              : ""
    }}</template>
      <template #spzt="{ data }">
        {{ data.spzt == "1" ? "已收票" : "未收票" }}</template>
      <!-- <template #sfzt="{ data }"> {{ data.sfzt == '1' ? '已收票' : data.sfzt == '2' ? '未收票' : '' }}</template> -->
      <template #sfchsd="{ data }">
        {{ data.sfchsd == "Y" ? "锁定" : "未锁定" }}</template>
      <template #fplx="{ data }"> {{ inputFplxMap[data.fplx] }} </template>
      <template #tfrq="{ data }">
        {{ data.tfrq ? dateFormat("YYYY-MM-DD", data.tfrq) : "" }}
      </template>
      <template #gxsj="{ data }">
        {{ data.gxsj ? dateFormat("YYYY-MM-DD", data.gxsj) : "" }}
      </template>
    </form-list>

    <!-- dialog 提交勾选 -->
    <el-dialog title="请确认" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
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
    }}</span>张发票，税额合计<span>{{ selecedInfo.hjse }}</span>元
        </div>
        <div class="tip">是否确认提交</div>
      </template>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="success" @click="checkCustomsPayment">确 认</el-button>
      </span>
    </el-dialog>
    <custom-import dialogTitle="发票勾选" :dialogVisible="dialogImportVisible" @handleClose="handleImportClose"
      @handleOk="handleImportOk" downloadTemplateApi="/income/downExcel" :downloadTemplateApiParams="{ type: 'HGJKS' }"
      downloadTemplateName="发票勾选_导入模板" :upApi="`/income/uploadHgjks/${nsrsbh}/${skssq}`"
      importApi="/income/checkPreCheckHgjks" upTitle="上传发票勾选数据" effImport
      :importColumns="importColumns"></custom-import>
  </div>
</template>

<script>
import moment from "moment";
import FormList from "@/components/FormList.vue";
import {enterAccountStatus} from '../../constant.js'
import {
  checkCustomsPayment,
  getKjList,
  exportInvoiceCheck,
  checkPreOneHgjks,
  cstateHgjks,
} from "./Api";
import { inputFplxMap } from "@/config/constant";
import CustomImport from "@/components/CustomImport";

export default {
  name: "customs",
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
    sfqkrzgx: {
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
        { title: "序号", type: "index", width: 50 },
        
        {
          title: "海关缴款书号码",
          width: 140,
          dataIndex: "hgjkshm",
          slot: "hgjkshm",
          align: "center",
        },
        // { title: "入账状态", width: 120, dataIndex: 'rzzt' },
        { title: "填发日期", width: 180, dataIndex: "tfrq", slot: "tfrq" },
        {
          title: "有效抵扣税额",
          width: 150,
          dataIndex: "yxdkse",
          slot: "yxdkse",
        },
        { title: "加计扣除额合计", width: 160, dataIndex: "jjkcehj" },
        { title: "加计扣除剩余额 ", width: 160, dataIndex: "jjkcsye" },
        {
          title: "缴款单位人纳税人识别号",
          dataIndex: "jkdwrnsrsbh",
          width: 160,
        },
        {
          title: "缴款单位人纳税人名称",
          width: 150,
          dataIndex: "jkdwrnsrmc",
          slot: "jkdwrnsrmc",
          align: "center",
        },
        {
          title: "是否重号锁定",
          width: 130,
          dataIndex: "sfchsd",
          slot: "sfchsd",
        },
        {
          title: "认证状态",
          width: 130,
          dataIndex: "verifyStatus",
          slot: "verifyStatus",
        },
        // { title: "勾选失败原因", width: 130, dataIndex: "createrName" },
        // { title: "勾选人", width: 130, dataIndex: "createrName" },
        { title: "勾选时间", width: 130, dataIndex: "updateTime" },
        { title: "入账状态", width: 130, dataIndex: " purchaserstatus", slot: "purchaserstatus" },
        { title: "收票状态", width: 130, dataIndex: " spzt", slot: "spzt" },
        { title: "转出状态", width: 130, dataIndex: "zczt", slot: "zczt" },
        // { title: "入账日期", width: 130, dataIndex: "createrName" },
        // { title: "入账属期", width: 130, dataIndex: "createrName" },
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
        // {
        //   label: "受票组织",
        //   key: "orgid",
        //   val: "",
        //   type: "select",
        //   options: [],
        // },
        {
          label: "是否重号锁定",
          key: "sfchsd",
          val: "",
          type: "select",
          options: [
            { value: "Y", label: "锁定" },
            { value: "N", label: "未锁定" },
          ],
        },
        // {
        //   label: "会计科目",
        //   key: "accsegment",
        //   val: "",
        //   type: "select",
        //   options: [],
        // },
        {
          label: "凭证号",
          key: "wspzh",
          val: "",
          type: "input",
          options: [],
          placeholder: "请输入",
        },
        {
          label: "海关缴款书号码",
          key: "hgjkshm",
          val: "",
          type: "input",
          placeholder: "请输入",
        },
        // {
        //   label: "税款金额",
        //   key: "",
        //   val: '',
        //   type: "input",
        //   options: {
        //     min: 0,
        //     max: undefined,
        //     step: 1,
        //   }
        // },
        {
          label: "税款金额",
          key: "skje",
          val: [],
          type: "numberRange",
          options: [],
          placeholder: ["最小金额", "最大金额"],
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
          },
        },
        {
          label: "收票状态",
          key: "spzt",
          val: "",
          type: "select",
          options: [
            { value: "", label: "全部" },
            { value: "1", label: "已收票" },
            { value: "2", label: "未收票" },
          ],
        },
        {
          label: "认证状态",
          key: "verifyStatus",
          val: "",
          type: "select",
          options: [
            { value: "", label: "全部" },
            { value: "1", label: "未勾选" },
            { value: "2", label: "已勾选" },
            { value: "3", label: "已认证" },
            { value: "4", label: "已统计" },
          ],
        },
        {
          label: "入帐状态",
          key: "rzzt",
          val: "",
          type: "select",
          options:  [{ value: "", label: "全部" }].concat(enterAccountStatus),
        },
        {
          label: "转出状态",
          key: "zczt",
          val: "",
          type: "select",
          options: [
            { value: "", label: "全部" },
            { value: "1", label: "未进项转出" },
            { value: "2", label: "已全额转出" },
            { value: "3", label: "已部署转出" },

          ],
        },
      ],
      importColumns: [
        {
          title: "海关缴款书号码",
          width: 140,
          dataIndex: "hgjkshm",
          slot: "hgjkshm",
          align: "center",
        },
        { title: "填发日期", width: 180, dataIndex: "tfrq" },
        {
          title: "有效抵扣税额",
          width: 150,
          dataIndex: "yxdkse",
          slot: "yxdkse",
        },
        { title: "加计扣除额合计", width: 160, dataIndex: "jjkcehj" },
        { title: "加计扣除剩余额 ", width: 160, dataIndex: "jjkcsye" },
        {
          title: "缴款单位人纳税人识别号",
          dataIndex: "jkdwrnsrsbh",
          width: 160,
        },
        {
          title: "缴款单位人纳税人名称",
          width: 150,
          dataIndex: "jkdwrnsrmc",
          slot: "jkdwrnsrmc",
          align: "center",
        },
        {
          title: "是否重号锁定",
          width: 130,
          dataIndex: "sfchsd",
          slot: "sfchsd",
        },
        // { title: "认证状态", width: 130, dataIndex: "createrName" },
        // { title: "勾选失败原因", width: 130, dataIndex: "createrName" },
        // { title: "勾选人", width: 130, dataIndex: "createrName" },
        { title: "勾选时间", width: 130, dataIndex: "updateTime" },
        { title: "入账状态", width: 130, dataIndex: " rzzt", slot: "rzzt" },
        // { title: "入账日期", width: 130, dataIndex: "createrName" },
        // { title: "入账属期", width: 130, dataIndex: "createrName" },
      ],
      selecedInfo: {
        number: 0,
        jjkcsye: 0,
        yxdkse: 0,
        jjkcehj: 0,
      },
      selections: [],
      dialogVisible: false,
      abnormalList: [], // 异常列表
      gxlxDm: "", // 勾选类型代码
      totalEntity: {},
      queryParam: {},
      // isSelected: [],
      selectedRowKeys: [],
      data: [],
    };
  },
  watch: {
    level(newV, oldV) {
      if (newV === "2") {
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
    dynamicCol(){
      return [
        {
          type: "selection",
          width: 50,
          selectable: this.checkSelectable,
        },
        ...this.columns
      ]
    }
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
    getTableData(data) {
      // console.log(3333);
      this.data = data;
      this.getHjje();
    },
    // 点击勾选icon触发handleSelected
    handleSelected(selection, row) {
      this.setPre({
        ids: [row.id],
        nsrsbh: this.nsrsbh,
        preCheck: row.preCheck === "Y" ? "N" : "Y",
      });
    },
    selectAll(rows) {
      // console.log("----rows---", rows, rows.length);
      let ids = [];
      let preCheck = "";
      if (rows.length === 0) {
        ids = this.data.map((item) => item.id);
        preCheck = "N";
      } else {
        rows.forEach((item) => {
          // console.log("--rows--", item.preCheck, item.id);
          if (item.preCheck !== "Y") {
            ids.push(item.id);
            preCheck = "Y";
          }
        });
      }
      this.setPre({ ids, preCheck });
    },
    async setPre({ ids, preCheck }) {
      // console.log("ids----", ids, preCheck);
      try {
        this.loading = true;
        const { code = "0", data } = await checkPreOneHgjks({ ids, preCheck, nsrsbh: this.nsrsbh });
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
      console.log("----handleSelection--", rows);
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
        this.checkCustomsPayment();
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
        this.checkCustomsPayment();
      });

      return;
      // 疑似异常
      // this.abnormalList = this.selections.filter((item) => item.sfycpz === '03')
      // this.dialogVisible = true
    },

    // 提交数据
    async checkCustomsPayment() {
      const hgjksmx = this.selections.map((item) => ({
        jkshm: item.hgjkshm,
        tfrq: item.tfrq,
      }));
      const { code = "" } = await checkCustomsPayment({
        gfsbh: this.nsrsbh,
        gxlx: this.gxlxDm,
        hgjksmx,
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
    // 会计科目列表
    async getKjList() {
      const { code = "", data = [] } = await getKjList({});
      if (code === "0") {
        const index = this.searchList.findIndex((item) => item.key === "kjkm");
        const options = [{ value: "", label: "全部" }].concat(
          data.map((item) => {
            return {
              value: item.accSegmentCode,
              label: item.accSegmentName,
            };
          })
        );
        // debugger;
        this.$set(this.searchList[index], "options", options);
      }
    },
    // 导出发票数据
    async exportInvoiceCheck() {
      const fileName = `发票勾选抵扣.xlsx`;
      await exportInvoiceCheck({
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
      this.init();
    },

    // handleSelectionChange(selection) {
    //   const newSelectedRowKeys = selection.map((item) => item.id);
    //   if (newSelectedRowKeys.length < this.selectedRowKeys.length) {
    //     // 如果当前选中行的数量小于之前记录的，说明有取消勾选的操作
    //     this.getList();
    //   }
    //   this.selectedRowKeys = newSelectedRowKeys;
    // },
    handleClose() {
      this.dialogVisible = false;
      this.form = {};
    },
    checkSelectable(row) {
      // 规则一：sfqkrzgx: 'N' 不校验是否入账, 'Y' 校验是否入账。为“N”时不需要校验第二条规则，可以直接勾选
      // 规则二：row.purchaserstatus === 42 代表已入账，可以勾选，否则不能勾选
      return this.sfqkrzgx === "N" || row.purchaserstatus === 42;
    },
    rowClick(row, column, event) {
      // const f = this.checkSelectable(row);
      // if (!f) {
      //   return;
      // }
      // this.$refs.list.rowClick(row, column, event, true);
      // this.setPre({
      //   ids: [row.id],
      //   nsrsbh: this.nsrsbh,
      //   preCheck: row.preCheck === "Y" ? "N" : "Y",
      // });
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
        skssq: this.skssq,
        gfsbh: this.nsrsbh,
      };
      this.handleGetData(this.searchParam);
    },
    /* 勾选 */
    // handleSelectionChange(e) {
    //   console.log(e, "2");
    //   this.isSelected = [...e];
    // },
    async downloadNoList() {
      const fileName = `海关缴款书.xlsx`;
      await this.api.downLoadNoOpenList({
        reqData: { ...this.queryParam },
        fileName,
      });
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
          const { code = "" } = await checkPreOneHgjks({
            type,
            ids,
            gfsbh: this.nsrsbh,
            skssq: this.skssq,
            bz: this.searchParam.cljg == "01" ? "Y" : "N",
          });
          if (code === "0") {
            this.$message.success("提交成功");
            this.reload();
          }
        })
        .catch(() => { }); // 添加错误捕获
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
        // vm.getHjje();
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
        const { code = "0", data } = await cstateHgjks({
          nsrsbh: this.nsrsbh,
          skssq: this.skssq,
        });
        if (code === "0") {
          this.$refs.list.handleTotalCounst({
            number: data.ygxts,
            hjje: data.jjkcsye,
            hjse: data.yxdkse,
            jshj: data.jjkcehj,
          });
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
./Index.vue
