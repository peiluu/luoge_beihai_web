<template>
  <div class="com-invoice" >
    <template>
      <form-search ref="search" :key="propsKey" :param="searchParam" :searchList="searchList" @search="handleSearch"
        @reset="handleReset"></form-search>
    </template>
    <div class="custom-table">
      <div class="toolbar">
        <div class="toolbar-left">
          <template v-if="isBusinessFormat">
            <!-- <el-button type="success" @click="showDialogVisiblePercent">修改进销比例</el-button>
            <el-button type="success" @click="calPreCheck">计算</el-button> -->
            <span style="marginleft: 12px">上期销项税额： {{ formatMoney(10000) }}元</span>
            <span style="marginleft: 12px">可抵扣税额合计： {{ formatMoney(selecedInfo.yxdkse) }}元</span>
          </template>
        </div>

        <div class="toolbar-right">
          <template v-if="isBusinessFormat">
            <!-- <el-button type="success" @click="submitRevokePreCheck('Y')">提交预勾选</el-button>
            <el-button @click="submitRevokePreCheck('N')">取消预勾选</el-button> -->
          </template>

          <el-button type="success" @click="cancleBatch('02')" v-if="searchParam.cljg == '01'">撤销勾选</el-button>
          <el-button type="success" @click="submitBatch('01')" v-else>提交勾选</el-button>
          <!-- <el-button @click="exportPreCheck" v-if="isBusinessFormat">导出预勾选数据</el-button> -->
          <el-button @click="exportInvoiceCheck">导出</el-button>
          <el-button @click="importExcel" v-if="searchParam.cljg == '02'">导入</el-button>
        </div>
      </div>
      <el-table row-key="id" :reserve-selection="true" ref="table" :data="data" :height="height" border stripe
        :header-cell-style="{
        fontWeight: 400,
        borderTop: '1px solid #adb4bc',
        background: '#f7f9fd',
        color: '#333333',
        padding: '7px 0',
      }" tooltip-effect="dark" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" v-loading="loading"
        :row-class-name="tableSelectedRow" @selection-change="handleSelection" @select="handleSelected"
        @select-all="seleceAll">
        <el-table-column type="selection" :selectable="checkSelectable" :reserve-selection="true" />
        <el-table-column type="index" label="序号" min-width="50" />
        <el-table-column prop="cljg" label="勾选状态" min-width="100">
          <template slot-scope="{ row }">
            {{ row.cljg == "01" ? "已勾选" : "未勾选" }}
          </template>
        </el-table-column>
        <el-table-column prop="rzzt" label="入账状态" min-width="100">
          <!--          <template slot-scope="{ row }">-->
          <!--            {{-->
          <!--              row.purchaserstatus ? purchaserstatusMap[row.purchaserstatus] : ""-->
          <!--            }}-->
          <!--          </template>-->
          <template slot-scope="{ row }">
            <span>{{ row.rzzt === 1 ? '未入账' : row.rzzt === 6 ? '入账撤销' : '已入账' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="preCheck" label="预勾选状态" min-width="100" v-if="isBusinessFormat">
          <template slot-scope="{ row }">
            {{ row.preCheck == "Y" ? "已预勾选" : "未预勾选" }}
          </template>
        </el-table-column>
        <el-table-column prop="zzfphm" label="发票号码" min-width="180" />
        <el-table-column prop="zzfpDm" label="发票代码" min-width="180" />
        <el-table-column prop="fplx" label="发票种类" min-width="180">
          <template slot-scope="{ row }">
            {{ inputFplxMap[row.fplx] }}
          </template>
        </el-table-column>

        <el-table-column prop="kprq" label="开票日期" min-width="120">
          <template slot-scope="{ row }">
            {{ row.kprq ? dateFormat("YYYY-MM-DD", row.kprq) : "" }}
          </template>
        </el-table-column>
        <el-table-column prop="xsfmc" label="销售方名称" min-width="270" />
        <el-table-column prop="xsfnsrsbh" label="销售方识别号" min-width="180" />
        <!-- <el-table-column prop="fpxsfmchm" label=" " min-width="180" /> -->
        <el-table-column prop="name" label="会计主体" min-width="220" />
        <el-table-column prop="accountPeriod" label="会计期间" min-width="120">
          <template slot-scope="{ row }">
            {{
        row.accountPeriod ? dateFormat("YYYY-MM", row.accountPeriod) : ""
      }}
          </template>
        </el-table-column>
        <el-table-column prop="jshj" label="价税合计" min-width="120" align="right">
          <template slot-scope="{ row }">
            {{ formatMoney(row.jshj) }}
          </template>
        </el-table-column>

        <el-table-column prop="hjse" label="税额" min-width="120" align="right">
          <template slot-scope="{ row }">
            {{ formatMoney(row.hjse) }}
          </template>
        </el-table-column>
        <el-table-column prop="yxdkse" label="可抵扣税额" min-width="120" align="right">
          <template slot-scope="{ row }">
            {{ formatMoney(row.yxdkse) }}
          </template>
        </el-table-column>

        <el-table-column prop="fpzt" label="发票状态" min-width="120">
          <template slot-scope="{ row }">
            {{ row.fpzt ? fpztMap[row.fpzt] : "" }}</template>
        </el-table-column>

        <el-table-column prop="sfycpz" label="是否异常凭证" min-width="120">
          <template slot-scope="{ row }">
            {{
        row.sfycpz == "01"
          ? "正常"
          : row.sfycpz == "02"
            ? "异常"
            : row.sfycpz == "03"
              ? "疑似异常"
              : ""
      }}
          </template>
        </el-table-column>

        <el-table-column prop="gxsj" label="勾选时间" min-width="120">
          <template slot-scope="{ row }">
            {{ row.gxsj ? dateFormat("YYYY-MM-DD", row.gxsj) : "" }}
          </template>
        </el-table-column>
        <el-table-column prop="createrName" label="勾选人" min-width="120" />
        <!-- <el-table-column prop="mideaSrc" label="来源系统" min-width="120" /> -->
        <el-table-column prop="accountUser" label="记账人" min-width="120" />

        <el-table-column prop="accountTime" label="记账日期" min-width="120">
          <template slot-scope="{ row }">
            {{
        row.accountTime ? dateFormat("YYYY-MM-DD", row.accountTime) : ""
      }}
          </template>
        </el-table-column>

        <el-table-column prop="reimburseDate" label="报销日期" min-width="120">
          <template slot-scope="{ row }">
            {{
          row.reimburseDate
            ? dateFormat("YYYY-MM-DD", row.reimburseDate)
            : ""
        }}
          </template>
        </el-table-column>

        <!-- <el-table-column prop="sfycpz" label="是否入发票池" min-width="120">
          <template slot-scope="{ row }">{{
            row.syncInvoice == "Y" ? "是" : "否"
          }}</template>
        </el-table-column> -->
      </el-table>
      <TableCounter ref="tableCounter" v-loading="totalLoading" />

      <div class="pagination" v-if="!isPerCheck">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pagination.pageNo" :page-sizes="[10, 20, 30, 40, 50, 100, 500, 1000]"
          :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
        </el-pagination>
      </div>
    </div>

    <!-- dialog 提交勾选 -->
    <el-dialog title="请确认" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <div class="submit-info">
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
      </div>
      <span slot="footer">
        <el-button @click="dialogVisible = false" :loading="counstLoading">取 消</el-button>
        <el-button type="success" @click="submitRevokeInvoiceCheck" :loading="counstLoading">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 设置税负率 -->
    <el-dialog title="进销比例设置" :visible.sync="dialogVisiblePercent" width="40%" :before-close="handleClose"
      class="submit-dialog">
      <div class="dialog-main">
        请输入进销比例<el-input placeholder="请输入（0-100）%" v-model="lossTaxRate" />%
      </div>
      <span slot="footer">
        <el-button @click="cancel" >取 消</el-button>
        <el-button type="success" @click="incomeOutputScale" >确 认</el-button>
      </span>
    </el-dialog>
    <custom-import dialogTitle="发票勾选" :dialogVisible="dialogImportVisible" @handleClose="handleImportClose"
      @handleOk="handleImportOk" downloadTemplateApi="/income/downExcel" :downloadTemplateApiParams="{ type: 'ZZSFP' }"
      downloadTemplateName="发票勾选_导入模板" :upApi="`/income/uploadZzsfp/${nsrsbh}/${skssq}`"
      importApi="/income/checkPreCheckZzsfp" effImport upTitle="上传发票勾选数据"
      :importColumns="importColumns"></custom-import>
  </div>
</template>

<script>
import moment from "moment";
import TableCounter from "@/components/TableCounter.vue";
import FormSearch from "@/components/FormSearch.vue";
import {
  submitRevokeInvoiceCheck,
  getOrgList,
  incomeOutputScale,
  exportPreCheck,
  queryScale,
  queryBusinessFormat,
  checkPreOneZzsfp,
  calPreCheck,
  exportInvoiceCheck,
  getDetailById,
  cstateZzsfp,
} from "./Api";
import { inputFplxList, inputFplxMap, } from "@/config/constant";
import { enterAccountStatus } from '../../constant.js'
import {
  purchaserstatusList,
  purchaserstatusMap,
  fpztMap,
  fpztList,

} from "@/views/inputInvoice/constant";
import CustomImport from "@/components/CustomImport";

export default {
  name: "InvoiceDeductionCheckInvoice",
  props: {
    currentSq: {},
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
  components: { FormSearch, TableCounter, CustomImport },
  data() {
    return {
      dialogImportVisible: false, // 导入
      form: {},
      inputFplxMap,
      purchaserstatusList,
      purchaserstatusMap,
      fpztMap,
      api: require("./Api"),
      loading: false,
      data: [],
      tableSize: "medium", //表格大小 default | medium / small / mini
      searchParam: { cljg: "02" },
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        showQuickJumper: true,
        showTotal: (total) => `共${total}条`,
      },
      propsKey: "",
      keepSelections: false,

      searchList: [
        {
          label: "勾选状态",
          key: "cljg",
          noClearable: "Y",
          val: "02",
          type: "select",
          options: [
            { value: "02", label: "未勾选" },
            { value: "01", label: "已勾选" },
          ],
        },
        {
          label: "发票种类",
          key: "fplx",
          val: "",
          type: "select",
          options: [{ value: "", label: "全部" }].concat(inputFplxList),
        },
        {
          label: "发票号码",
          key: "fphm",
          val: "",
          type: "input",
          placeholder: "请输入",
        },
        {
          label: "发票代码",
          key: "zzfpDm",
          val: "",
          type: "input",
          placeholder: "请输入",
        },
        {
          label: "发票状态",
          key: "fpzt",
          val: "",
          type: "select",
          options: [{ value: "", label: "全部" }].concat(fpztList),
        },
        {
          label: "销售方识别号",
          key: "xsfnsrsbh",
          val: "",
          type: "input",
          placeholder: "请输入",
        },
        {
          label: "销售方名称",
          key: "xsfmc",
          val: "",
          type: "input",
          placeholder: "请输入",
        },
        {
          label: "受票组织",
          key: "orgid",
          val: "",
          type: "select",
          options: [],
        },

        {
          label: "是否异常凭证",
          key: "sfycpz",
          val: "",
          type: "select",
          options: [
            { value: "", label: "全部" },
            { value: "01", label: "正常" },
            { value: "02", label: "异常" },
            { value: "03", label: "疑似异常" },
          ],
        },
        {
          label: "发票日期",
          key: "kprqList",
          val: [],
          type: "daterange",
          placeholder: "请选择",
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          },
        },
        // {
        //   label: "会计期间",
        //   key: "accountPeriod",
        //   type: "monthrange",
        //   val: [],
        //   placeholder: "请选择",
        //   pickerOptions: {
        //     disabledDate(time) {
        //       return time.getTime() > Date.now();
        //     },
        //   },
        // },
        {
          label: "入账状态",
          key: "purchaserstatus",
          val: "",
          type: "select",
          options: [{ value: "", label: "全部" }].concat(enterAccountStatus),
        },
        // {
        //   label: "是否入发票池",
        //   key: "syncInvoice",
        //   val: "",
        //   type: "select",
        //   options: [
        //     { value: "", label: "全部" },
        //     { value: "Y", label: "是" },
        //     { value: "N", label: "否" },
        //   ],
        // },
        {
          label: "预勾选状态",
          key: "preCheck",
          val: "",
          type: "select",
          options: [
            { value: "", label: "全部" },
            { value: "Y", label: "已预勾选" },
            { value: "N", label: "未预勾选" },
          ],
        },
      ],
      importColumns: [
        // { title: '勾选状态', width: 200, dataIndex: 'nsrmc' },
        // { title: '入账状态', width: 200, dataIndex: 'orgName' },
        { title: "发票号码", width: 200, dataIndex: "fphm" },
        // { title: '发票代码', width: 200, dataIndex: 'orgName' },
        // { title: '发票种类', width: 200, dataIndex: 'orgName' },
        // { title: '开票日期', width: 200, dataIndex: 'orgName' },
        // { title: '销售方名称', width: 200, dataIndex: 'orgName' },
        // { title: '销售方识别号', width: 200, dataIndex: 'orgName' },
        // { title: '会计主体', width: 200, dataIndex: 'orgName' },
        // { title: '会计期间', width: 200, dataIndex: 'orgName' },
        // { title: '价税合计', width: 200, dataIndex: 'orgName' },
        // { title: '税额', width: 200, dataIndex: 'orgName' },
        // { title: '可抵扣税额', width: 200, dataIndex: 'orgName' },
        // { title: '发票状态', width: 200, dataIndex: 'orgName' },
        // { title: '是否异常凭证', width: 200, dataIndex: 'orgName' },
        // { title: '勾选时间', width: 200, dataIndex: 'orgName' },
        // { title: '勾选人', width: 200, dataIndex: 'orgName' },
        // { title: '来源系统', width: 200, dataIndex: 'orgName' },
        // { title: '记账人', width: 200, dataIndex: 'orgName' },
        // { title: '记账日期', width: 200, dataIndex: 'orgName' },
        // { title: '报销日期', width: 200, dataIndex: 'orgName' },
        // { title: '是否入发票池', width: 200, dataIndex: 'orgName' },
      ],
      selecedInfo: {
        number: 0,
        hjje: 0,
        hjse: 0,
        jshj: 0,
        yxdkse: 0,
      },
      selections: [],
      dialogVisible: false,
      dialogVisiblePercent: false,
      abnormalList: [], // 异常列表
      gxlxDm: "", // 勾选类型代码
      lossTaxRate: "",
      isPerCheck: false,
      isBusinessFormat: "", // 物业,需要预勾选操作
      totalLoading: false,
      counstLoading:false,
    };
  },
  watch: {
    level: {
      handler: function (newV, oldV) {
        if (newV === "1") {
          this.getData();
        }
      },
      // immediate: true
    },
  },
  computed: {
    height() {
      return window.innerHeight - 429;
    },
    nsrsbh() {
      return this.$route.query.nsrsbh;
    },
  },
  methods: {
    // 导入
    importExcel() {
      this.dialogImportVisible = true;
    },
    handleImportClose() {
      this.dialogImportVisible = false;
    },
    handleImportOk() {
      this.handleImportClose();
      this.reload();
      // this.updateTableSelection();
    },
    // updateTableSelection() {
    //   this.$nextTick(() => {
    //     this.tableData.forEach(row => {
    //       if (this.selectedRowKeys.includes(row.id)) {
    //         this.$refs.table.toggleRowSelection(row, true);
    //       }
    //     });
    //   });
    // },
    handleClose() {
      this.dialogVisible = false;
      this.form = {};
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
        gfsbh: this.nsrsbh,
      };
      this.handleGetData(this.searchParam);
    },
    // rowClick(row, column, event) {
    //   const f = this.checkSelectable(row);
    //   if (!f) {
    //     return;
    //   }
    //   this.$refs.table.toggleRowSelection(row);
    //   this.setPre({ids:[row.id],nsrsbh: this.nsrsbh, preCheck:row.preCheck === 'Y'?'N':'Y'});
    // },
    dateFormat(fmt, val) {
      return moment(val).format(fmt);
    },
    // 给每一个选中行增加样式
    tableSelectedRow({ row }) {
      return this.$refs.table.selection.find(
        (item) => item.id && item.id === row.id
      )
        ? "current-row"
        : null;
    },

    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.pagination.pageNo = 1;
      const searchParam = this.searchParam;
      this.$nextTick(() => {
        this.handleGetData(searchParam);
      });
    },
    handleCurrentChange(pageNo) {
      const searchParam = this.searchParam;
      this.pagination.pageNo = pageNo;
      this.$nextTick(() => {
        this.handleGetData(searchParam, {}, true);
      });
    },
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
        if (this.searchParam.cljg === '02') {
          vm.getHjje();
        }

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
            if (this.searchParam.cljg === '01') {
              this.selections = [];
              this.$refs.tableCounter.setInfo({ ...this.handleCalc(this.selections, ['hjje', 'hjse', 'jshj']), number: this.selections?.length })

            }
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
        const { code = "0", data } = await cstateZzsfp({
          nsrsbh: this.nsrsbh,
          skssq: this.currentSq.dateValue,
        });
        if (code === "0") {
          this.selecedInfo = {
            number: data.ygxts,
            hjje: data.hjje,
            hjse: data.hjse,
            jshj: data.jshj,
          };
          this.$refs.tableCounter.setInfo(this.selecedInfo);

        }
      } catch (error) {
        console.log(error);
      } finally {
        this.totalLoading = false;
      }
    },
    /* 计算已勾选 */
    handleCalc(array, keys) {
      let result = {};

      keys.forEach(key => {
        result[key] = 0; // 初始化每个键的总和为0
      });

      array.forEach(item => {
        keys.forEach(key => {
          if (key in item) {
            result[key] += item[key];
          }
        });
      });

      return result;
    },
    // 搜索
    handleSearch(val) {
      let param = this.searchParam;
      if (param) {
        param.pageNo = 1;
        this.pagination.pageNo = 1;
        Object.assign(param, val);
        this.searchParam = param;
      }
      this.handleGetData(param);
    },

    // 刷新
    reload(args) {
      this.handleGetData(this.searchParam, args);
    },
    // 初始化多选数据
    setSelections(list) {

      list?.map((item) => {
        if (!this.selections.find((selItem) => selItem.id == item.id)) {
          this.$refs.table.toggleRowSelection(item);
        }
      });

    },
    // 清空多选
    clearSelection() {
      this.$refs.table.clearSelection();
    },
    async getOrgList() {
      const { code = "", data = [] } = await getOrgList({
        nsrsbh: this.nsrsbh,
        isInvoice: "N",
      });
      const index = this.searchList.findIndex((item) => item.key === "orgid");
      if (code === "0") {
        this.searchList[index].options = [{ value: "", label: "全部" }].concat(
          data.map((item) => {
            return {
              ...item,
              value: item.id,
              label: item.name,
            };
          })
        );
      }
    },
    // 点击勾选icon触发handleSelected
    handleSelected(selection, row) {
      this.setPre({ ids: [row.id], nsrsbh: this.nsrsbh, preCheck: row.preCheck === 'Y' ? 'N' : 'Y' });
    },
    seleceAll(rows) {
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
      this.setPre({ ids, preCheck });
    },
    async setPre({ ids, preCheck }) {

      if (this.searchParam?.cljg === '01') return
      try {
        this.loading = true;
        const { code = "0", data } = await checkPreOneZzsfp({ ids, preCheck, nsrsbh: this.nsrsbh });
        if (code === "0") {
          this.handleGetData(this.searchParam);
        }
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
    // 处理多选
    handleSelection(rows) {
      console.log(rows, "change")
      // this.$refs.tableCounter.getSelecedInfo(rows);
      this.selections = rows;
      if (this.searchParam.cljg === '01') {
        this.$refs.tableCounter.setInfo({ ...this.handleCalc(this.selections, ['hjje', 'hjse', 'jshj']), number: this.selections?.length })
      }

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
        this.submitRevokeInvoiceCheck();
      });
    },
    // 提交勾选
    submitBatch(gxlxDm) {
      if (this.selections.length == 0) {
        this.$message.warning("请至少选择一条");
        return;
      }
      // if (!this.selections.every((item) => item.syncInvoice == 'Y')) {
      //   this.$message.warning("请勿勾选未同步的发票");
      //   return;
      // }
      // if (!this.selections.every((item) => item.purchaserstatus == '42')) {
      //   this.$message.warning("请勿勾选未入账的发票，请先修改入账状态");
      //   return;
      // }

      this.gxlxDm = gxlxDm;
      // 疑似异常
      this.abnormalList = this.selections.filter(
        (item) => item.sfycpz === "03"
      );
      this.dialogVisible = true;
    },
    // 获取预勾选计算数据
    // async calPreCheck() {
    //   this.clearSelection();
    //   const { code = "", data = [] } = await calPreCheck({
    //     nsrsbh: this.nsrsbh,
    //   });
    //   if (code === "0") {
    //     this.isPerCheck = true;
    //     this.$refs.tableCounter.getSelecedInfo(data);
    //     this.setSelections(data);
    //     this.data = data;
    //   }
    // },

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
          const { code = "" } = await checkPreOneZzsfp({
            type,
            ids,
            nsrsbh: this.nsrsbh,
            gfsbh: this.nsrsbh,
            skssq: this.currentSq.dateValue,
            bz: this.searchParam.cljg == "01" ? "Y" : "N",
          });
          if (code === "0") {
            this.$message.success("提交成功");
            this.reload();
          }
        })
        .catch(() => { }); // 添加错误捕获
    },

    // 提交数据勾选
    async submitRevokeInvoiceCheck() {
      this.counstLoading = true;
      try {
        const { code = "" } = await submitRevokeInvoiceCheck({
          gfsbh: this.nsrsbh,
          skssq: this.currentSq.dateValue,
          gxlxDm: this.gxlxDm,
          fpmx: this.selections.map((item) => {
            return {
              ...item,
              fpdm: item.zzfpDm,
            };
          }),
        });
        this.dialogVisible = false;
        if (code === "0") {
          this.$message.success("提交成功");
          this.reload();
        }
      } catch (error) {
        console.log(error);
      }finally{
        this.counstLoading = false;
      }
    },
    showDialogVisiblePercent() {
      this.queryScale();
      this.dialogVisiblePercent = true;
    },

    // 查询进销比例
    async queryScale() {
      const { code = "", data } = await queryScale({
        nsrsbh: this.nsrsbh,
      });
      this.lossTaxRate = "";
      if (code === "0") {
        this.lossTaxRate = data * 100 || "";
      }
    },
    // 查询时候否是物业
    async queryBusinessFormat() {
      const { code = "", data } = await queryBusinessFormat({
        nsrsbh: this.nsrsbh,
      });
      if (code === "0") {
        this.isBusinessFormat = data;
      }
    },

    // 设置进销比例
    async incomeOutputScale() {
      if (!this.lossTaxRate) {
        this.$message.warning("请输入进销比例");
        return;
      }
      if (!/^(?:[1-9]?\d|100)$/.test(this.lossTaxRate)) {
        this.$message.warning("请输入0-100范围的进销比例");
        return;
      }
      const { code = "" } = await incomeOutputScale({
        nsrsbh: this.nsrsbh,
        lossTaxRate: this.lossTaxRate / 100,
      });
      this.dialogVisiblePercent = false;
      if (code === "0") {
        this.reload();
        this.$message.success("设置成功");
      }
    },
    // 预勾选导出
    async exportPreCheck() {
      const fileName = `预勾选信息列表.xlsx`;
      await exportPreCheck({
        reqData: { nsrsbh: this.nsrsbh },
        fileName,
      });
    },
    // 导出发票数据
    async exportInvoiceCheck() {
      const fileName = `进项发票信息列表.xlsx`;
      await exportInvoiceCheck({
        reqData: {
          ...this.searchParam,
          sign: "Y",
          pageNo: 1,
          pageSize: 9999999,
        },
        fileName,
      });
    },
    cancel() {
      this.dialogVisiblePercent = false;
      this.lossTaxRate = "";
    },

    async getData() {
      this.getOrgList();
      this.queryScale();
      this.queryBusinessFormat();
      this.searchParam = {
        cljg: "02",
        skssq: this.currentSq.dateValue,
        gfsbh: this.nsrsbh,
      };
      this.handleGetData(this.searchParam);
      this.propsKey = this.nsrsbh + "_" + this.currentSq.dateValue;
      // const { code = '', data } = await getList({
      //   ...this.param
      // })
      // if (code === '0') {
      //   this.$nextTick(() => {
      //     this.$refs.list.setSelections(data);
      //   })
      // }
    },

    handleClose() {
      this.dialogVisiblePercent = false;
      this.dialogVisible = false;
      this.form = {};
    },
    checkSelectable(row) {
      // 规则一：sfqkrzgx: 'N' 不校验是否入账, 'Y' 校验是否入账。为“N”时不需要校验第二条规则，可以直接勾选
      // 规则二：row.purchaserstatus === 42 代表已入账，可以勾选，否则不能勾选
      return this.sfqkrzgx === "N" || row.purchaserstatus === 42;
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog-main {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-input {
    width: 200px;
    margin: 0 4px 0 12px;
  }
}

.toolbar {
  button {
    height: 28px;
  }

  .toolbar-right {
    width: auto;
    flex: 1;
  }
}

/deep/ .search-box {
  padding-top: 12px;
}
</style>
