<template>
    <div class="">
      <article class="space_bottom"></article>
      <article>
        <article>
          <app-search-form></app-search-form>
        </article>
        <article>
          <article>
            <el-row>
              <el-col :span="8">
                  <el-form ref="form" :model="searchForm" label-width="0px">
                      <el-form-item label="">
                          <el-input v-model="searchForm.name" placeholder="请输入纳税人名称/纳税人识别号"></el-input>
                      </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="16" style="text-align: right;">
                  <el-button type="primary" @click="handleHandWork"> 选择转出发票 </el-button>
                  <el-button type=""> 转出凭证推送 </el-button>
                  <el-button type=""> 导出 </el-button>
              </el-col>
          </el-row>
      </article>
          <article>
              <el-table :data="tableData" :border="true" style="width: 100%">
              <el-table-column type="selection" width="55" fixed="left">
              </el-table-column>
              <el-table-column prop="date" label="纳税人名称" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="纳税人识别号" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="address" label="核算账套编码" width="180" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="name" label="会计主体" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="转出日期" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="转出金额" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="转出人" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="应税期" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="EBS凭证号" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="HAP凭证号" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="推送系统" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="科目编码" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="科目名称" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="计税项目分类" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="转出原因" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="转出流水号" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="推送失败原因" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="驳回原因" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="推送凭证状态" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="操作日期" width="180" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="备注" width="180" show-overflow-tooltip>
              </el-table-column>
              </el-table>
           </article>
           <article class="footer_text_main"> 
              已勾选<span class="footer_sum"> 0 </span> 条 /  累计转出金额 <span class="footer_sum"> 0.00 </span> 元 / 价税合计总额
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
      </article>
      <app-handwork :visible.sync = "handleVisible" title="进项转出"></app-handwork>
    </div>
  </template>
  
  <script>
  import AppSearchForm from "../componetns/invoiceSearch";
  import AppHandwork from "../componetns/handwork";
  export default {
    name: "bodyRollOutPage",
    components: { AppSearchForm,AppHandwork },
    data() {
      return {
          tableData:[
              {
                  date: '2016-05-02',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄'
              }, 
          ],
          searchForm:{},
          total:1000,
          page:{
            currentPage:1,
            pageSize:10,
            pageSizes:[15,25,50,75,100]
          },
          handleVisible: false,
      };
    },
    computed: {},
    watch: {},
    methods: {
      /* 手工转出 */
      handleHandWork(){
          this.handleVisible = true;
      },
      /* size change */
      handleSizeChange(){
  
      },
      /* Current change */
      handleCurrentChange(){
  
      },
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
  .footer_text_main{
    padding: 4px;
    font-size: 14px;
  }
  .footer_sum{
    color:#17B3A3;
    font-weight: bold;
  }
  ::v-deep .el-tabs__nav-scroll{
      padding: 0 8px;
  }
  </style>