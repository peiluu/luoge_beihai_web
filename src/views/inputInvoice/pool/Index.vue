<template>
  <div class="ele_body">
    <el-card shadow="never">
      <app-search-form ></app-search-form>
    </el-card>
    <el-card shadow="never">
      <article>
        <article>
          <el-row>
            <el-col :span="8">
              <el-form ref="form" :model="searchForm" label-width="0px">
                <el-form-item label="">
                  <el-input v-model="searchForm.name" placeholder="请输入发票代码/发票号码/销售方名称/支持扫码快速定位发票"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="16" style="text-align: right;">
              <el-button-group>
                <el-button type="" :disabled="isSelected.length <= 0" @click="handleEditeStatus">修改入账状态</el-button>
                <el-button type="" :disabled="isSelected.length <= 0" @click="handleUpload">进项发票新增导入</el-button>
                <el-button type="" :disabled="isSelected.length <= 0" @click="handleUpload">入账信息导入</el-button>
                <el-button type="" :disabled="isSelected.length <= 0" @click="handlePush">认证凭证推送</el-button>
              </el-button-group>
              <el-dropdown style="margin-left: 15px;">
                <el-button type="" >
                  导出查询结果
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :disabled="isSelected.length <= 0">按查询显示结果模板导出（含明细）</el-dropdown-item>
                  <el-dropdown-item :disabled="isSelected.length <= 0">按查询显示结果模板导出（不含明细）</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </article>
        <article>
          <el-table :data="tableData" :border="true" style="width: 100%" @row-click="handleRowClick"
          highlight-current-row
          :row-class-name="rowClassName"  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" fixed="left">
            </el-table-column>
            <el-table-column prop="date" label="会计主体" width="180">
            </el-table-column>
            <el-table-column prop="name" label="发票代码" width="180">
            </el-table-column>
            <el-table-column prop="address" label="发票号码" width="180" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="date" label="开票日期" width="180">
            </el-table-column>
            <el-table-column prop="date" label="购买方名称" width="180">
            </el-table-column>
            <el-table-column prop="date" label="购买方地址电话" width="180">
            </el-table-column>
            <el-table-column prop="date" label="购买方税号" width="180">
            </el-table-column>
            <el-table-column prop="date" label="销售方名称" width="180">
            </el-table-column>
            <el-table-column prop="date" label="销售方地址电话" width="180">
            </el-table-column>
            <el-table-column prop="date" label="销售方税号" width="180">
            </el-table-column>
            <el-table-column prop="date" label="不含税金额" width="180">
            </el-table-column>
            <el-table-column prop="date" label="税额" width="180">
            </el-table-column>
            <el-table-column prop="date" label="价税合计" width="180">
            </el-table-column>
            <el-table-column prop="date" label="报账状态" width="180">
            </el-table-column>
            <el-table-column prop="date" label="问题发票" width="180">
            </el-table-column>
            <el-table-column prop="date" label="凭证号" width="180">
            </el-table-column>
            <el-table-column prop="date" label="来源业务系统" width="180">
            </el-table-column>
            <el-table-column prop="date" label="业务系统单据号" width="180">
            </el-table-column>
            <el-table-column prop="date" label="发票种类" width="180">
            </el-table-column>
            <el-table-column prop="date" label="发票影像链接" width="180">
            </el-table-column>
            <el-table-column prop="date" label="进项税对应费用会计科目编码" width="180">
            </el-table-column>
            <el-table-column prop="date" label="进项税对应费用会计科目名称" width="180">
            </el-table-column>
            <el-table-column prop="date" label="进项税待认证会计科目编码" width="180">
            </el-table-column>
            <el-table-column prop="date" label="进项税待认证会计科目名称" width="180">
            </el-table-column>
            <el-table-column prop="date" label="应交增值税待认证进项税借方发生额" width="180">
            </el-table-column>
            <el-table-column prop="date" label="是否可抵扣" width="180">
            </el-table-column>
            <el-table-column prop="date" label="业务系统转出税金" width="180">
            </el-table-column>
            <el-table-column prop="date" label="税务系统转出税金" width="180">
            </el-table-column>
            <el-table-column prop="date" label="累计转出税额" width="180">
            </el-table-column>
            <el-table-column prop="date" label="已抵扣税额" width="180">
            </el-table-column>
            <el-table-column prop="date" label="认证状态" width="180">
            </el-table-column>
            <el-table-column prop="date" label="抵扣期间" width="180">
            </el-table-column>
            <el-table-column prop="date" label="发票状态" width="180">
            </el-table-column>
            <el-table-column prop="date" label="会计期间" width="180">
            </el-table-column>
            <el-table-column prop="date" label="记账备注" width="180">
            </el-table-column>
            <el-table-column prop="date" label="项目名称" width="180">
            </el-table-column>
            <el-table-column prop="date" label="所属区域" width="180">
            </el-table-column>
            <el-table-column prop="date" label="法人名称" width="180">
            </el-table-column>
            <el-table-column prop="date" label="项目名称(房开)" width="180">
            </el-table-column>
            <el-table-column prop="date" label="项目分期" width="180">
            </el-table-column>
            <el-table-column prop="date" label="合同编号" width="180">
            </el-table-column>
            <el-table-column prop="date" label="合同名称" width="180">
            </el-table-column>
            <el-table-column prop="date" label="HAP系统单据号" width="180">
            </el-table-column>
            <el-table-column prop="date" label="认证推送状态" width="180">
            </el-table-column>
            <el-table-column prop="date" label="日期" width="180">
            </el-table-column>
          </el-table>
        </article>
        <article class="footer_text_main">
          金额总额<span class="footer_sum"> 224,181.03</span> 元 / 税额总额 <span class="footer_sum"> 10,928.27 </span> 元 / 价税合计总额 <span class="footer_sum"> 235,109.30 </span>元
        </article>
        <article>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-sizes="page.sizes"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </article>
      </article>
    </el-card>
    <app-modify-status v-if="statusVisible" :visible.sync="statusVisible" width="50%" title="修改入账状态"></app-modify-status>
    <app-common-upload v-if="uploadVisible" :visible.sync="uploadVisible" width="40%" title="上传文件"></app-common-upload>
    <app-authentication-push v-if="pushVisible" :visible.sync="pushVisible" width="50%" title="认证凭证推送核算系统"></app-authentication-push>
  </div>
</template>

<script>
import AppSearchForm from './componetns/searchForm';
import AppModifyStatus from './componetns/modifyStatus';
import AppCommonUpload from './componetns/commonUpload';
import AppAuthenticationPush from './componetns/authenticationPush'
export default {
  name: "poolPage",
  components: {
    AppSearchForm,AppModifyStatus,AppCommonUpload,AppAuthenticationPush
  },
  data() {
    return {
      tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        searchForm:{},
        isSelected: [],
        selectedRow: null,
        statusVisible:false,
        uploadVisible:false,
        pushVisible:false,
        total:1000,
        page:{
          currentPage:1,
          pageSize:10,
          pageSizes:[15,25,50,75,100]
        }
    };
  },
  computed: {},
  watch: {},
  methods: {
    /* size change */
    handleSizeChange(){

    },
    /* Current change */
    handleCurrentChange(){

    },
    /* 推送 */
    handlePush(){
      this.pushVisible = true;
    },
    /* 上传事件 1 发票新增 2 入账信息导入 */
    handleUpload(){
      this.uploadVisible = true;
    },
    /* 修改入账状态 */
    handleEditeStatus(){
      this.statusVisible = true;
    },  
    /* 表格样式 行 */
    rowClassName({row, rowIndex}) {
      if (this.selectedRow === row) {
        return 'highlight-row';
      }
      return '';
    },
    /*点击行事件 */
    handleRowClick(row){
      
      this.selectedRow = row;
    },  
    /* 勾选 */
    handleSelectionChange(e){
      console.log(e,"2")
      this.isSelected = [...e];
    }
  },
  created() {},
  mounted() {},
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
};
</script>
<style scoped>
/*@import url(); 引入公共css类*/
.ele_body {
  padding: 15px;
}
.footer_text_main{
  padding: 8px;
  font-size: 14px;
}
.footer_sum{
  color:#17B3A3;
  font-weight: bold;
}
</style>