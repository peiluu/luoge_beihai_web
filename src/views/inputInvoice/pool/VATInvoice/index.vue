<template>
    <div class="">
        <el-card shadow="never">
      <app-search-form></app-search-form>
    </el-card>
    <el-card shadow="never">
      <article>
        <article style="padding: 2px">
          <el-row>
            <el-col :span="8">
              <div style="visibility: hidden">1</div>
              <!-- <el-form ref="form" :model="searchForm" label-width="0px">
                <el-form-item label="">
                  <el-input v-model="searchForm.name" placeholder="请输入发票代码/发票号码/销售方名称/支持扫码快速定位发票"></el-input>
                </el-form-item>
              </el-form> -->
            </el-col>
            <el-col :span="16" style="text-align: right">
              <el-button-group>
                <el-button
                  type=""
                  :disabled="isSelected.length <= 0"
                  @click="handleRequire"
                  >发票查验</el-button
                >
                <el-button
                  type=""
                  :disabled="isSelected.length <= 0"
                  @click="handleEditeStatus"
                  >修改待认证科目</el-button
                >
                <el-button
                  type=""
                  :disabled="isSelected.length <= 0"
                  @click="handleEnterAccount(1)"
                  >发票入账</el-button
                >
                <el-button
                  type=""
                  :disabled="isSelected.length <= 0"
                  @click="handleEnterAccount(2)"
                  >撤销入账</el-button
                >
                <el-button
                  type=""
                  :disabled="isSelected.length <= 0"
                  @click="handleStatus(1)"
                  >确认收票</el-button
                >
                <el-button
                  type=""
                  :disabled="isSelected.length <= 0"
                  @click="handleStatus(2)"
                  >撤销收票</el-button
                >
                <el-button type="">导出查询结果</el-button>
                <el-button
                  type=""
                  :disabled="isSelected.length <= 0"
                  @click="handleStatus(1)"
                  >导出选中发票</el-button
                >
              </el-button-group>
              <!-- <el-dropdown style="margin-left: 15px;">
                <el-button type="" >
                  导出查询结果
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :disabled="isSelected.length <= 0">按查询显示结果模板导出（含明细）</el-dropdown-item>
                  <el-dropdown-item :disabled="isSelected.length <= 0">按查询显示结果模板导出（不含明细）</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
            </el-col>
          </el-row>
        </article>
        <article>
          <el-table
            :data="tableData"
            :border="true"
            style="width: 100%;height:100%;max-height:350px;overflow: auto;"
            @row-click="handleRowClick"
            highlight-current-row
            :row-class-name="rowClassName"
            @selection-change="handleSelectionChange"
            ref="tableRef"
          >
            <el-table-column type="selection" width="55" fixed="left" align="center">
            </el-table-column>
            <el-table-column type="index" width="55" label="序号" align="center">
            </el-table-column>
            <el-table-column prop="date" label="发票号码" minWidth="160" align="center">
            </el-table-column>
            <el-table-column prop="name" label="发票代码" minWidth="140" align="center">
            </el-table-column>
            <el-table-column prop="date" label="开票日期" minWidth="160" align="center">
            </el-table-column>
            <el-table-column prop="date" label="发票类型" minWidth="100" align="center">
            </el-table-column>
            <el-table-column prop="date" label="特殊票种" minWidth="100" align="center">
            </el-table-column>
            <el-table-column prop="date" label="凭证号" minWidth="120" align="center">
            </el-table-column>
            <el-table-column prop="date" label="作废日期" minWidth="120" align="center">
            </el-table-column>
            <el-table-column prop="date" label="销方名称" minWidth="180" align="center">
            </el-table-column>
            <el-table-column prop="date" label="销方税号" minWidth="180" align="center">
            </el-table-column>
            <el-table-column prop="date" label="合计金额" minWidth="120" :header-align="'center'" :align="'right'">
            </el-table-column>
            <el-table-column prop="date" label="合计税额" minWidth="120" :header-align="'center'" :align="'right'">
            </el-table-column>
            <el-table-column prop="date" label="价税合计" minWidth="120" :header-align="'center'" :align="'right'">
            </el-table-column>
            <el-table-column prop="date" label="扣除额" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="date" label="发票状态" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="date" label="异常凭证状态" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="date" label="红字锁定标识" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="date" label="发票用途" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="date" label="入账状态" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="date" label="收票状态" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="date" label="收票日期" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="date" label="转出状态" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="date" label="原发票号码" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="date" label="原发票代码" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="date" label="财务备注" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="date" label="归集日期" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="date" label="创建时间" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="date" label="修改时间" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="aciton" fixed="right" label="操作" width="120" :header-align="'center'" :align="'center'">
              <template slot-scope="scope">
                <el-button size="small" type="primary" @click="handleViewInvoice(scope.row)">查看发票</el-button>
              </template>
            </el-table-column>
          </el-table>
        </article>
        <article class="table_bottom_page">
            <article class="footer_text_main">
            金额总额<span class="footer_sum"> 224,181.03</span> 元 / 税额总额
            <span class="footer_sum"> 10,928.27 </span> 元 / 价税合计总额
            <span class="footer_sum"> 235,109.30 </span>元
            </article>
            <article>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-sizes="page.sizes"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
            </article>
        </article>
      </article>
    </el-card>
    <el-card shadow="never" class="bottom_crad">
      <article>
        <el-table
          ref="bottomTableRef"
          :data="bottomTableData"
          :border="true"
          style="width: 100%; height: 150px; overflow: auto"
          @row-click="handleRowClick"
        >
          <el-table-column type="index" width="55" label="序号" align="center">
          </el-table-column>
          <el-table-column
            prop="date"
            label="项目名称"
            minWidth="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="规格型号"
            minWidth="140"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="单位"
            minWidth="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="数量"
            minWidth="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="单价"
            minWidth="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="金额"
            minWidth="140"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="增值税税率/征收率"
            minWidth="160"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="税额"
            minWidth="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="含税金额"
            minWidth="110"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="扣除额"
            minWidth="110"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="商品和服务税收分类合并编码"
            minWidth="180"
            align="center"
          >
          </el-table-column>
        </el-table>
      </article>
      <article>
        <el-pagination
          @size-change="handleBottomSizeChange"
          @current-change="handleBottomCurrentChange"
          :current-page="page_bottom.currentPage"
          :page-sizes="page_bottom.pageSizes"
          :page-size="page_bottom.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="bottom_total"
        >
        </el-pagination>
      </article>
    </el-card>
    <lg-collect-ticket-mage
      v-if="dialog.statusVisible"
      :visible.sync="dialog.statusVisible"
      width="50%"
      :title="dialog.statusTitle"
    ></lg-collect-ticket-mage>
    <lg-enter-account-mage
      v-if="dialog.enterVisible"
      :visible.sync="dialog.enterVisible"
      width="40%"
      :title="dialog.enterTitle"
    ></lg-enter-account-mage>
    <!-- 待修改认证科目 -->
    <lg-edie-verified
      v-if="dialog.editeVisible"
      :visible.sync="dialog.editeVisible"
      width="50%"
      title="修改会计科目操作"
    ></lg-edie-verified>
    <!-- 发票检验 -->
    <lg-invoice-require 
    :visible.sync="dialog.requireVisbile" 
    v-if="dialog.requireVisbile" 
    title="发票检验" width="45%"
    >
    </lg-invoice-require>
    <!-- 查看发票 -->
    <lg-view-invoice :visible.sync="dialog.viewVisible" v-if="dialog.viewVisible">
      <template v-slot:main>
        <h1>弹窗</h1>
      </template>
    </lg-view-invoice>
    </div>
</template>

<script>
import AppSearchForm from "../componetns/searchForm";
import LgCollectTicketMage from "../componetns/collectTicketMage";
import LgEnterAccountMage from "../componetns/enterAccountMage";
import LgEdieVerified from "../componetns/editeVerified";
import LgInvoiceRequire from "./invoiceRequire";
import LgViewInvoice from "../componetns/viewInvoice";
export default {
  name: "poolPage",
  components: {
    AppSearchForm,
    LgCollectTicketMage,
    LgEnterAccountMage,
    LgEdieVerified,
    LgInvoiceRequire,
    LgViewInvoice
  },
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      searchForm: {},
      isSelected: [],
      selectedRow: null,
      bottomTableData:[
      {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
      ],
     
      
      total: 1000,
      page: {
        currentPage: 1,
        pageSize: 3,
        pageSizes: [15, 25, 50, 75, 100],
      },
      page_bottom: {
        currentPage: 1,
        pageSize: 3,
        pageSizes: [3,10, 15, 50, 100, 200],
      },
      bottom_total: 1000,
      activeName:'first',
      dialog:{
        requireVisbile:false,
        editeVisible:false,
        enterVisible:false,
        statusVisible: false,
        viewVisible:false,
        enterTitle:'',
        statusTitle:''
      }
    };
  },
  computed: {},
  watch: {},
  methods: {
    /* size change */
    handleSizeChange() {},
    /* Current change */
    handleCurrentChange() {},
    /* size change */
    handleBottomSizeChange(val) {
      this.page_bottom.pageSize = val;
    },
    /* Current change */
    handleBottomCurrentChange(val) {
      this.page_bottom.currentPage = val;
    },
    /* 确认管理 */
    handleStatus(type) {
      this.dialog.statusTitle = type === 1?'确认收票':'撤销收票';
      this.dialog.statusVisible = true;
    },
    /*  1 发票入账 2 撤销抽入 */
    handleEnterAccount(type) {
      this.dialog.enterTitle = type === 1?'发票入账':'撤销入账';
      this.dialog.enterVisible = true;
    },
    /* 修改入账状态 */
    handleEditeStatus() {
      this.dialog.editeVisible = true;
    },
    /* 表格样式 行 */
    rowClassName({ row, rowIndex }) {
      if (this.selectedRow === row) {
        return "highlight-row";
      }
      return "";
    },
    /*点击行事件 */
    handleRowClick(row) {
      this.selectedRow = row;
    },
    /* 勾选 */
    handleSelectionChange(e) {
      console.log(e, "2");
      this.isSelected = [...e];
    },
    /* 发票检验 */
    handleRequire(){
      this.dialog.requireVisbile = true;
    },
    /* 发票查看 */
    handleViewInvoice(row){
      this.dialog.viewVisible = true;
      console.log(row)
    }
  },
  created() {},
  mounted() {},
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {
    this.$refs.bottomTableRef.doLayout();
    this.$refs.tableRef.doLayout();
  },
  beforeDestroy() {},
  destroyed() {},
  activated() {},
};
</script>
<style scoped lang="scss">
.footer_text_main{
  padding: 8px;
  font-size: 14px;
}
.footer_sum{
  color:#17B3A3;
  font-weight: bold;
}
.table_bottom_page{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.aui-wrapper .el-pagination{
    margin-top: 0;
}
::v-deep .el-table__body-wrapper, .el-table__fixed-body-wrapper{
  min-height: 100px;
}
</style>