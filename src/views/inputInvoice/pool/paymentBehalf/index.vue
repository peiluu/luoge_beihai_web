<template>
    <div class="">
      <el-card shadow="never" class="card_bottom" body-style="padding: 15px 15px 0;">
        <app-search-form @search="handlerSearch" @resst="handleRest"></app-search-form>
      </el-card>
    <el-card shadow="never" style="margin-top: 10px;" body-style="padding: 15px 15px 0;">
      <article>
        <article style="padding: 0 0 15px">
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
            style="width: 100%"
            @row-click="handleRowClick"
            highlight-current-row
            :row-class-name="rowClassName"
            @selection-change="handleSelectionChange"
            v-loading="loading"
            :height="height"
            row-key="id"
            ref="topTableRef"
          >
            <el-table-column type="selection" width="45" fixed="left">
            </el-table-column>
            <el-table-column type="index" width="45" label="序号">
            </el-table-column>
            <el-table-column prop="dkdjwspzh" label="代扣代缴完税凭证号" minWidth="160">
            </el-table-column>
            <el-table-column prop="pzlx" label="票种类型" minWidth="160">
              <template slot-scope="scope">
              <span>{{ handleParesTableValue(scope.row.pzlx,optionList.ticketType) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="kjywrsbh" label="扣缴义务人识别号（购方）" minWidth="190" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="kjywrmc" label="扣缴义务人名称" minWidth="190" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="tfrq" label="填发日期" minWidth="100" align="center">
            </el-table-column>
            <el-table-column prop="kjrq" label="开具日期" minWidth="120" align="center">
            </el-table-column>
            <el-table-column prop="jsje" label="计税金额" minWidth="120" align="right">
              <template slot-scope="{row}">{{ formatMoney(row.jsje) }} </template>
            </el-table-column>
            <el-table-column prop="sjje" label="实缴金额" minWidth="120" align="right">
              <template slot-scope="{row}">{{ formatMoney(row.sjje) }} </template>
            </el-table-column>
            <el-table-column prop="bkjnsrsbh" label="被扣缴纳税人识别号" minWidth="180" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="bkjnsrmc" label="被扣缴纳税人名称" minWidth="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="srzzt" label="入账状态" minWidth="120" show-overflow-tooltip>
              <!-- <template slot-scope="scope">
                <span>{{ scope.row.rzzt === '01' ?'未入账':scope.row.rzzt === '06'?'入账撤销':'已入账' }}</span>
              </template> -->
            </el-table-column>
            <el-table-column prop="spzt" label="收票状态" minWidth="120" :header-align="'center'" :align="'center'">
              <template slot-scope="scope">
                <span>{{ handleParesTableValue(scope.row.spzt,optionList.collectTicketStatus) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sprq" label="收票日期" minWidth="120" align="center">
            </el-table-column>
            <el-table-column prop="zczt" label="转出状态" minWidth="120" align="center">
              <template slot-scope="scope">
                <span>{{ handleParesTableValue(scope.row.zczt,optionList.rollOntStatus) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="cwbz" label="财务备注" minWidth="180" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="gjrq" label="归集日期" minWidth="120" align="center">
            </el-table-column>
            <el-table-column prop="createtime" label="创建时间" minWidth="140" align="center">
            </el-table-column>
            <el-table-column prop="updatetime" label="修改时间" minWidth="140" align="center">
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
    <el-card shadow="never" class="bottom_crad" style="margin-top: 10px;" body-style="padding: 15px 15px 0;">
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
            prop="spbm"
            label="商品编码"
            minWidth="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="sl"
            label="数量"
            minWidth="140"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="jsje"
            label="计税金额"
            minWidth="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="sjje"
            label="实缴金额"
            minWidth="120"
            align="center"
          >
          </el-table-column>
         
        </el-table>
      </article>
      <article  style="padding: 8px 0;">
        <el-pagination
          @size-change="handleBottomSizeChange"
          @current-change="handleBottomCurrentChange"
          :current-page="page_bottom.currentPage"
          :page-sizes="page_bottom.sizes"
          :page-size="page_bottom.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
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
import {getPoolPayList,getPoolPayTableSingleDes,postDKDJDownloadList,postDKDJDownloadSelect} from '@/api/pool/index.js'
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
      statusVisible: false,
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
      bottom_total: 1,
      activeName:'first',
      loading:false,
      loading_1:false,
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
      activeId:null,
    };
  },
  computed: {
    accountTotal(){
      const totalAmount = this.isSelected.reduce((sum, item) => sum + (Number(item.jsje) || 0), 0);
      // 格式化成带千位符且保留两位小数的字符串
      const formattedTotalAmount = totalAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return formattedTotalAmount
    },
    height(){
      let h = window.innerHeight - 566;
      // return h;
      return h < 300 ? 300 : h;
    }
  },
  watch: {},
  methods: {
    handleInit(){
      this.handleGetPayTableList()
    },
  async handleGetPayTableList(val = {}){
    this.loading = true;
    let parmas = {
      pageNo: this.page.currentPage,
      pageSize: this.page.pageSize,
      ...this.where,
    };
    try{
      const res = await getPoolPayList(parmas)
      if([0,'0'].includes(res.code)){
        this.tableData = [...res.data];
        this.total = res.totalCount || 0
      }
    }catch(e){
      console.error(e)
    }finally{
      this.loading = false;
    }
    
  },
    /* size change */
    handleSizeChange(val) {
      this.page.currentPage = val;
      this.handleGetPayTableList()
    },
    /* Current change */
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.handleGetPayTableList()
    },
    /* 搜索 */
    handlerSearch(val){
      this.where = {...val};
      this.page.currentPage = 1;
      this.handleGetPayTableList(val);
    },
    /* 重置 */
    handleRest(val){
      this.where = {...val};
      this.handleGetPayTableList(val)
    },
    /* size change */
    handleBottomSizeChange(val) {
      this.page_bottom.pageSize = val;
      this.handleGetPaySingleDes({id:this.activeId,})
    },
    /* Current change */
    handleBottomCurrentChange(val) {
      this.page_bottom.currentPage = val;
      this.handleGetPaySingleDes({id:this.activeId,})
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
      this.typeStatus = {type:'DKDJWSPZ',status:type}
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
      this.typeStatus = {type:'DKDJWSPZ',status:type}
      this.rowData = {...this.isSelected[0]}
      this.dialog.enterVisible = true;
    },
    /* 修改入账状态 */
    handleEditeStatus() {
      if(this.isSelected.length >1){
        this.$message.warning("当前操作只支持单个！")
        return
      }else{
        this.typeStatus = {type:'DKDJWSPZ'}
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
      this.selectedRow = row;
      this.activeId = row.id;
      this.handleGetPaySingleDes({id:row.id})
    },
    async handleGetPaySingleDes(val){
      this.loading_1 = true;
      let data = {
        id:val.id,
        pageNo:this.page_bottom.currentPage,
        pageSize:this.page_bottom.pageSize
      }
      try{
        const res = await getPoolPayTableSingleDes(data);
        if([0,'0'].includes(res.code)){
          this.bottomTableData = [...res.data];
          this.bottom_total= res.totalCount
        }
      }finally{
        this.loading_1 = false; 
      }
    },
    /* 勾选 */
    handleSelectionChange(e) {
      console.log(e, "2");
      this.isSelected = [...e];
    },
    /* 导出范围 */
    async handleExportRange(){
      let data = {
        ...this.where,
      };
      let fileName = '代扣代缴.xlsx'
      try{
         await  postDKDJDownloadList({
        reqData: { ...data,},
        fileName
      })
      }catch{}
     
    },
    /* 导出已选择 */
    async handleExportSelected(){
      let data = this.isSelected;
      let fileName = '代扣代缴--已选择.xlsx'
      try{
         await  postDKDJDownloadSelect({
        reqData: data,
        fileName
      })}catch{}
    },
    /* 返回后刷新状态 */
    handleDone(val){
      this.handleGetPayTableList()
    },
    handleParesTableValue(val,option){
      if(option.length <=0 || (val??'') ===''){
        return ''
      }else{
       return option.find(k=> k.value === val)?.label || ''
      }
    },
    refDoLayout(b){
      // !b && (this.loading = true);
      this.$nextTick(()=>{
        this.$refs.bottomTableRef && this.$refs.bottomTableRef.doLayout();
        this.$refs.topTableRef && this.$refs.topTableRef.doLayout();
        // this.loading = false;
      })
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
  // updated() {
  //   this.$refs.bottomTableRef.doLayout();
  // },
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
    padding: 8px 0;
}
.aui-wrapper .el-pagination{
    margin-top: 0;
}
</style>
<style>
.card_bottom .el-card__body{
  padding-bottom: 0;
}
</style>