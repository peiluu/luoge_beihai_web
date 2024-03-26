<template>
    <div class="">
        <el-card shadow="never">
      <app-search-form @search="handlerSearch" @resst="handleRest"></app-search-form>
    </el-card>
    <el-card shadow="never" style="margin-top: 10px;">
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
                <el-button type="" @click="handleExportRange">导出查询结果</el-button>
                <el-button
                  type=""
                  :disabled="isSelected.length <= 0"
                  @click="handleExportSelected"
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
        <article style="">
          <el-table
            :data="tableData"
            :border="true"
            @row-click="handleRowClick"
            highlight-current-row
            :row-class-name="rowClassName"
            @selection-change="handleSelectionChange"
            ref="tableRef"
            height="340"
            v-loading="loading"
            row-key="id"
          >
            <el-table-column type="selection" width="45" fixed="left" align="center">
            </el-table-column>
            <el-table-column type="index" width="45" label="序号">
            </el-table-column>
            <el-table-column prop="fphm" label="发票号码" minWidth="160">
            </el-table-column>
            <el-table-column prop="zzfpDm" label="发票代码" minWidth="140">
            </el-table-column>
            <el-table-column prop="kprq" label="开票日期" minWidth="160" align="center">
            </el-table-column>
            <el-table-column prop="fppzDm" label="发票类型" minWidth="140" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ handleParesTableValue(scope.row.fppzDm,optionList.invoiceType) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="tdyslxDm" label="特殊票种" minWidth="100">
            </el-table-column>
            <el-table-column prop="wspzh" label="凭证号" minWidth="180">
            </el-table-column>
            <el-table-column prop="zfrq" label="作废日期" minWidth="120" align="center">
            </el-table-column>
            <el-table-column prop="xsfmc" label="销方名称" minWidth="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="xsfnsrsbh" label="销方税号" minWidth="180">
            </el-table-column>
            <el-table-column prop="hjje" label="合计金额" minWidth="120" :header-align="'center'" :align="'right'">
              <template slot-scope="{row}">{{ formatMoney(row.hjje) }} </template>
            </el-table-column>
            <el-table-column prop="hjse" label="合计税额" minWidth="120" :header-align="'center'" :align="'right'">
              <template slot-scope="{row}">{{ formatMoney(row.hjse) }} </template>
            </el-table-column>
            <el-table-column prop="jshj" label="价税合计" minWidth="120" :header-align="'center'" :align="'right'">
              <template slot-scope="{row}">{{ formatMoney(row.jshj) }} </template>
            </el-table-column>
            <el-table-column prop="kce" label="扣除额" minWidth="120" :header-align="'center'" :align="'center'">
              <template slot-scope="{row}">{{ formatMoney(row.kce) }} </template>
            </el-table-column>
            <el-table-column prop="fpzt" label="发票状态" minWidth="120" :header-align="'center'" :align="'center'">
              <template slot-scope="scope">
                <span>{{ handleParesTableValue(scope.row.fpzt,optionList.invoiceStatus) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sfycpz" label="异常凭证状态" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="sdzt" label="红字锁定标识" minWidth="120" :header-align="'center'" :align="'center'">
              <template slot-scope="scope">
                <span>{{ handleParesTableValue(scope.row.sdzt,[{label:'已锁定',value:'Y'},{label:'未锁定',value:'N'}]) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hxyt" label="发票用途" minWidth="120" :header-align="'center'" :align="'center'">
              <template slot-scope="scope">
                <span>{{ handleParesTableValue(scope.row.hxyt,optionList.invoiceUse) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="srzzt" label="入账状态" minWidth="120" :header-align="'center'" :align="'center'">
              <template slot-scope="scope">
                <span>{{ scope.row.rzzt === '01' ?'未入账':scope.row.rzzt === '06'?'入账撤销':'已入账' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="spzt" label="收票状态" minWidth="120" :header-align="'center'" :align="'center'">
              <template slot-scope="scope">
                <span>{{ handleParesTableValue(scope.row.spzt,optionList.collectTicketStatus) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sprq" label="收票日期" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="zczt" label="转出状态" minWidth="120" :header-align="'center'" :align="'center'">
              <template slot-scope="scope">
                <span>{{ handleParesTableValue(scope.row.zczt,optionList.rollOntStatus) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="yfphm" label="原发票号码" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="yfpdm" label="原发票代码" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="cwbz" label="财务备注" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="gjrq" label="归集日期" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="creattime" label="创建时间" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="updatetime" label="修改时间" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="aciton" fixed="right" label="操作" width="120" :header-align="'center'" :align="'center'">
              <template slot-scope="scope">
                <el-button  type="primary" @click.stop="handleViewInvoice(scope.row)">查看发票</el-button>
              </template>
            </el-table-column>
          </el-table>
        </article>
        <article class="table_bottom_page">
            <article class="footer_text_main">
              已选择<span class="footer_sum"> {{isSelected.length}}</span> 项 | 合计金额
            <span class="footer_sum"> {{ totalje }} </span> 元 | 合计税额
            <span class="footer_sum">{{ totalse }} </span>元 | 价税合计
            <span class="footer_sum"> {{ totaljs }} </span>元
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
          v-loading="loading_1"
          height="150px"
        >
          <el-table-column type="index" width="55" label="序号" align="center">
          </el-table-column>
          <el-table-column
            prop="xmmc"
            label="项目名称"
            minWidth="180"
            :show-overflow-tooltip="true"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="ggxh"
            label="规格型号"
            minWidth="140"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="dw"
            label="单位"
            minWidth="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="fpjysl"
            label="数量"
            minWidth="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="fpjydj"
            label="单价"
            minWidth="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="je"
            label="金额"
            minWidth="140"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="slv"
            label="增值税税率/征收率"
            minWidth="160"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="se"
            label="税额"
            minWidth="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="hsje"
            label="含税金额"
            minWidth="110"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="kce"
            label="扣除额"
            minWidth="110"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="sphfwssflhbbm"
            label="商品和服务税收分类合并编码"
            width="180"
            
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
      :row-data="rowData"
      :type-status="typeStatus"
      @successDone="handleDone"
    ></lg-collect-ticket-mage>
    <lg-enter-account-mage
      v-if="dialog.enterVisible"
      :visible.sync="dialog.enterVisible"
      width="40%"
      :title="dialog.enterTitle"
      :row-data="rowData"
      :type-status="typeStatus"
      @successDone="handleDone"
    ></lg-enter-account-mage>
    <!-- 待修改认证科目 -->
    <lg-edie-verified
      v-if="dialog.editeVisible"
      :visible.sync="dialog.editeVisible"
      width="50%"
      title="修改会计科目操作"
      :row-data="rowData"
      :type-status="typeStatus"
      @successDone="handleDone"
    ></lg-edie-verified>
    <!-- 发票检验 -->
    <lg-invoice-require 
    :visible.sync="dialog.requireVisbile" 
    v-if="dialog.requireVisbile" 
    title="发票检验" width="45%"
    :invoice-number="invoiceNumber"
    >
    </lg-invoice-require>
    <!-- 查看发票 -->
    <lg-view-invoice title="发票预览" width="60%" :visible.sync="dialog.viewVisible" v-if="dialog.viewVisible">
      <template v-slot:main>
        <article style="min-height: 450px; max-height: 550px;">
          <lg-invoice-view :invoice-id="invoiceId" v-if="dialog.viewVisible"></lg-invoice-view>
        </article>
      </template>
    </lg-view-invoice>
    </div>
</template>

<script>
import AppSearchForm from "./searchForm";
import LgCollectTicketMage from "../componetns/collectTicketMage";
import LgEnterAccountMage from "../componetns/enterAccountMage";
import LgEdieVerified from "../componetns/editeVerified";
import LgInvoiceRequire from "./invoiceRequire";
import LgViewInvoice from "../componetns/viewInvoice";
import LgInvoiceView from "@/components/invoiceView";
import {getPoolInvoiceList,getPoolInvoiceSingleDes,postDownloadList,postDownloadSelect} from '@/api/pool/index.js'

export default {
  name: "poolPage",
  components: {
    AppSearchForm,
    LgCollectTicketMage,
    LgEnterAccountMage,
    LgEdieVerified,
    LgInvoiceRequire,
    LgViewInvoice,
    LgInvoiceView
  },
  props:{},
  data() {
    return {
      tableData: [],
      searchForm: {},
      isSelected: [],
      selectedRow: [],
      bottomTableData:[],
      total: 1000,
      page: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10,15, 25, 50, 75, 100],
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
      },
      loading:false,
      rowData:{},
      typeStatus:{},
      where:{},
      loading_1:false,
    };
  },
  computed: { 
    totalje(){
      const totalAmount = this.isSelected.reduce((sum, item) => sum + (item.hjje || 0), 0);
      // 格式化成带千位符且保留两位小数的字符串
      const formattedTotalAmount = totalAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return formattedTotalAmount
    },
    totalse(){
      const totalAmount = this.isSelected.reduce((sum, item) => sum + (item.hjse || 0), 0);
      // 格式化成带千位符且保留两位小数的字符串
      const formattedTotalAmount = totalAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return formattedTotalAmount
      
    },
    totaljs(){
      const totalAmount = this.isSelected.reduce((sum, item) => sum + (item.hjje || 0), 0);
      // 格式化成带千位符且保留两位小数的字符串
      const formattedTotalAmount = totalAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return formattedTotalAmount
    }
  },
  watch: {},
  methods: {
    handleInit(){
      this.handleGetTableList()
    },
    async handleGetTableList(val = {}){
      this.loading= true;
      let parmas = {
        pageNo:this.page.currentPage,
        pageSize:this.page.pageSize,
        ...this.where,
      }
      try{
        const res = await getPoolInvoiceList(parmas);
        if([0,'0'].includes(res.code)){
          this.tableData = [...res.data];
          this.total = res.totalCount;
          this.$refs.tableRef.doLayout();
        }
      }finally{
        this.loading = false
      }
      
     
    },
    /* size change */
    handleSizeChange(page) {
      this.page.pageSize = page;
      this.handleGetTableList()
    },
    /* Current change */
    handleCurrentChange(current) {
      this.page.currentPage =current
      this.handleGetTableList()
    },
    /* 搜索 */
    handlerSearch(val){
      this.where = {...val};
      this.page.currentPage = 1;
      this.handleGetTableList(val);
    },
    /* 重置 */
    handleRest(val){
      this.where = {...val};
      this.handleGetTableList(val)
    },
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
      if(this.isSelected.length >1){
        this.$message.warning("当前操作只支持单个！")
        return
      } 
      if(type=== 1 && this.isSelected[0].spzt === '1'){
        this.$message.warning(`当前发票已确认收票`)
        return
      }
      if(type=== 2 && this.isSelected[0].spzt === '2'){
        this.$message.warning(`当前发票还未确认收票`)
        return
      }
      this.dialog.statusTitle = type === 1?'确认收票':'撤销收票';
      this.typeStatus = {type:'ZZSFP',status:type}
      this.rowData = {...this.isSelected[0]}
      this.dialog.statusVisible = true;
    },
    /*  1 发票入账 2 撤销抽入 */
    handleEnterAccount(type) {
      if(this.isSelected.length >1){
        this.$message.warning("当前操作只支持单个！")
        return
      }
      if(type === 1 && /02|03/.test(this.isSelected[0].rzzt)){
        this.$message.warning(`当前发票已入账`)
        return
      }
      if(type === 2 && !/02|03/.test(this.isSelected[0].rzzt)){
        this.$message.warning(`当前发票还未入账`)
        return
      }
      this.dialog.enterTitle = type === 1?'发票入账':'撤销入账';
      this.typeStatus = {type:'ZZSFP',status:type}
      this.rowData = {...this.isSelected[0]}
      this.dialog.enterVisible = true;
      
      
    },
    /* 修改入账状态 */
    handleEditeStatus() {
      if(this.isSelected.length >1){
        this.$message.warning("当前操作只支持单个！")
        return
      }else{
        this.typeStatus = {type:'ZZSFP'}
        this.rowData = {...this.isSelected[0]}
        this.dialog.editeVisible = true;
      }
      
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
      const {id} = row || {};
      this.selectedRow = row;
      this.handleGetSingleDes({id});
    },
    /* 请求详情 */
    async handleGetSingleDes(data){
      let params = {
        ...data,
        pageNo:this.page_bottom.currentPage,
        pageSize:this.page_bottom.pageSize
      }
      const res = await getPoolInvoiceSingleDes(params);
      if([0,'0'].includes(res.code)){
        this.bottomTableData = [...res.data];
        this.bottom_total = res.totalCount
      }
    },
    /* 勾选 */
    handleSelectionChange(e) {
      console.log(e, "2");
      this.isSelected = [...e];
    },
    /* 发票检验 */
    handleRequire(){
      if(this.isSelected.length > 1){
        this.$message.warning("此操作只支持单个操作！请重试");
        return
      }else{
        this.invoiceNumber = this.isSelected[0]?.fphm;
        this.dialog.requireVisbile = true;
      }
      
    },
    /* 发票查看 */
    handleViewInvoice(row){
      this.invoiceId = row.id || ''
      this.dialog.viewVisible = true;
      
    },
    /* 导出范围 */
    async handleExportRange(){
      let data = {
        ...this.where,
      };
      let fileName = '增值税发票.xlsx'
      try{
         await  postDownloadList({
        reqData: { ...data,},
        fileName
      })
        

      }catch{

      }
     
    },
    /* 导出已选择 */
    async handleExportSelected(){
      let data = this.isSelected;
      let fileName = '增值税发票--已选择.xlsx'
      try{
         await  postDownloadSelect({
        reqData: data,
        fileName
      })}catch{}
    },
    /* 返回后刷新状态 */
    handleDone(val){
      this.handleGetTableList()
    },
    handleParesTableValue(val,option){
      if(option.length <=0 || (val??'') ===''){
        return ''
      }else{
       return option.find(k=> k.value === val).label
      }
    }
  },
  inject: ['optionList'],
  created() {},
  mounted() {
   this.handleInit()
  },
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