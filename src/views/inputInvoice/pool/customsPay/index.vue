<template>
    <div class="">
        <el-card shadow="never">
      <app-search-form @search="handlerSearch" @resst="handleRest"></app-search-form>
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
        <article>
          <el-table
            :data="tableData"
            :border="true"
            @row-click="handleRowClick"
            highlight-current-row
            :row-class-name="rowClassName"
            @selection-change="handleSelectionChange"
            v-loading="loading"
            height="340"
            style="width: 100%;"
            ref="topTableRef"
            row-key="id"
          >
            <el-table-column type="selection" width="55" fixed="left" align="center">
            </el-table-column>
            <el-table-column type="index" width="55" label="序号" align="center">
            </el-table-column>
            <el-table-column prop="hgjkshm" label="海关缴款书号码" minWidth="170" align="center">
            </el-table-column>
            <el-table-column prop="tprq" label="填发日期" minWidth="140" align="center">
            </el-table-column>
            <el-table-column prop="skje" label="税款金额" minWidth="160" align="center">
              <template slot-scope="{row}">{{ formatMoney(row.skje) }} </template>
            </el-table-column>
            <el-table-column prop="jkdwrnsrsbh" label="缴款单位人纳税人识别号" minWidth="160" align="center">
            </el-table-column>
            <el-table-column prop="jkdwrnsrmc" label="缴款单位人纳税人名称" minWidth="180" show-overflow-tooltip align="center">
            </el-table-column>
            <el-table-column prop="sfzhsd" label="是否重号锁定" minWidth="120" align="center">
            </el-table-column>
            <el-table-column prop="srzzt" label="入账状态" minWidth="120" align="center">
            </el-table-column>
            <el-table-column prop="spzt" label="收票状态" minWidth="180" align="center">
            </el-table-column>
            <el-table-column prop="sprq" label="收票日期" minWidth="180" align="center">
            </el-table-column>
            <el-table-column prop="zczz" label="转出状态" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="cwbz" label="财务备注" minWidth="120" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="gjrq" label="归集日期" minWidth="180" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="createtime" label="创建时间" minWidth="180" align="center">
            </el-table-column>
            <el-table-column prop="updatetime" label="修改时间" minWidth="180" align="center">
            </el-table-column>
          </el-table>
        </article>
        <article class="table_bottom_page">
            <article class="footer_text_main">
              已选择<span class="footer_sum"> {{ isSelected.length }}</span> 项 | 税款金额合计
            <span class="footer_sum"> {{accountTotal}} </span> 元 
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
          style="width: 100%;"
          height="150px"
        >
          <el-table-column type="index" width="55" label="序号" align="center">
          </el-table-column>
          <el-table-column
            prop="shdm"
            label="税号信息"
            minWidth="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="wsjg"
            label="完税价格"
            minWidth="140"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="hwmc"
            label="货物名称"
            minWidth="120"
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
            prop="sl"
            label="数量"
            minWidth="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="skje"
            label="税款金额"
            minWidth="140"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="hwslv"
            label="增值税税率/征收率"
            minWidth="160"
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
          :page-sizes="page_bottom.sizes"
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
    </div>
</template>

<script>
import AppSearchForm from "./searchForm";
import LgCollectTicketMage from "../componetns/collectTicketMage";
import LgEnterAccountMage from "../componetns/enterAccountMage";
import LgEdieVerified from "../componetns/editeVerified";
import {getPoolCustomsList,getPoolTableSingleDes,postHGDownloadList,postHGDownloadSelect} from '@/api/pool/index.js'
export default {
  name: "poolPage",
  components: {
    AppSearchForm,
    LgCollectTicketMage,
    LgEnterAccountMage,
    LgEdieVerified,
  },
  data() {
    return {
      tableData: [],
      searchForm: {},
      isSelected: [],
      selectedRow: null,
      uploadVisible: false,
      pushVisible: false,
      total: 1000,
      page: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10,15, 25, 50, 75, 100],
      },
      page_bottom: {
        currentPage: 1,
        pageSize: 3,
        pageSizes: [3,15, 25, 50, 75, 100],
      },
      bottom_total: 1000,
      activeName:'first',
      bottomTableData:[],
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
    };
  },
  computed: {
    accountTotal(){
      const totalAmount = this.isSelected.reduce((sum, item) => sum + (Number(item.skje) || 0), 0);
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
      this.handleGetTableList();
    },
    async handleGetTableList(val = {}){
      this.loading = true;
      let parmas = {
        pageNo:this.page.currentPage,
        pageSize:this.page.pageSize,
        ...val,
      }
      try{
        const res = await getPoolCustomsList(parmas);
        if([0,'0'].includes(res.code)){
          this.tableData = [...res.data];
          this.total = res.totalCount
        }
      }finally{
        this.loading = false;
      }
      
    },
    /* size change */
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.handleGetTableList();
    },
    /* Current change */
    handleCurrentChange(val) {
      this.page.currentPage = val
    },
    /* 搜索 */
    handlerSearch(val){
      this.where = {...val};
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
      console.log(this.isSelected)
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
      this.typeStatus = {type:'HGJKS',status:type}
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
      this.typeStatus = {type:'HGJKS',status:type}
      this.rowData = {...this.isSelected[0]}
      this.dialog.enterVisible = true;
    },
    /* 修改入账状态 */
    handleEditeStatus() {
      if(this.isSelected.length >1){
        this.$message.warning("当前操作只支持单个！")
        return
      }else{
        this.typeStatus = {type:'HGJKS'}
        this.rowData = {...this.isSelected[0]}
        this.dialog.editeVisible = true;
      }
      
    },
     /* 导出范围 */
     async handleExportRange(){
      let data = {
        ...this.where,
      };
      let fileName = '海关缴款书.xlsx'
      try{
         await  postHGDownloadList({
        reqData: { ...data,},
        fileName
      })
        

      }catch{

      }
     
    },
    /* 导出已选择 */
    async handleExportSelected(){
      let data = this.isSelected;
      let fileName = '海关缴款书--已选择.xlsx'
      try{
         await  postHGDownloadSelect({
        reqData: data,
        fileName
      })}catch{}
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
      const {id} = row || {};
      this.handleGetTableSingleDes({id})
    },
    async handleGetTableSingleDes(data){
      let params = {
        ...data,
        pageNo:this.page_bottom.currentPage,
        pageSize:this.page_bottom.pageSize,
      }
      try{
        const res = await getPoolTableSingleDes(params);
        if([0,'0'].includes(res.code)){
          this.bottomTableData = [...res.data];
          this.bottom_total = res.totalCount
        }
      }finally{}
    },
    /* 勾选 */
    handleSelectionChange(e) {
      this.isSelected = [...e];
    },
    /* 返回后刷新状态 */
    handleDone(val){
      this.handleGetTableList()
    }
  },
  created() {},
  mounted() {
    this.handleInit();
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {
   this.$nextTick(()=>{
    this.$refs.bottomTableRef.doLayout();
    this.$refs.topTableRef.doLayout();
   })
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
</style>