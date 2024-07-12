<template>
  <div class="">
    <article class="top_margin_common">
            <el-card shadow="never">
              <el-form ref="where" :model="where" label-width="105px">
                <el-row :gutter="12">
                    <el-col :span="8">
                        <el-form-item label="商品/服务名称">
                            <el-input v-model="where.name" placeholder="请输入商品和服务名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="增值税税率">
                          <el-select style="width:100%" v-model="where.slzf" placeholder="请选择增值税税率">
                              <el-option
                                v-for="item in taxOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                          </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" style="text-align: right;">
                        <el-button type="primary" @click="handleSerch">查询</el-button>
                        <el-button @click="handleReset">重置</el-button>
                    </el-col>
                </el-row>
               
              </el-form>
            </el-card>
          </article>
          <article class="top_margin_common">
            <el-card shadow="never">
             <article class="table_header">
              <article>
                <span style="font-size:12px">当前项目商品分类名称:<span style="font-weight:bold;font-size:14px">{{ commodityName }}</span></span>
              </article>
                <article >
                  <!-- <el-button type="primary" @click="handleImportBatch">批量导入</el-button> -->
                    <el-button type="primary" @click="handleAddCommondity">新增</el-button>
                    <!-- <el-button type="primary">导入</el-button>
                    <el-button type="primary">导出</el-button> -->
                </article>
             </article>
            </el-card>
          </article>
          <el-card shadow="never">
            <article>
              <el-table
                height="calc(100vh - 399px)"
                :data="tableData"
                :border="true"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="loading"
              >
                <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
                <el-table-column type="index" width="50" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="项目商品名称" width="180">
                </el-table-column>
                <el-table-column prop="marclassname" label="项目商品分类名称" width="180">
                </el-table-column>
                <el-table-column prop="taxclasscode" label="商品和服务税收分类合并编码" width="200">
                </el-table-column>
                <el-table-column prop="taxclassname" label="商品和服务税收分类名称" width="200">
                </el-table-column>
                <el-table-column prop="taxclassjc" label="商品和服务税收分类简称" min-width="200">
                </el-table-column>
                <el-table-column prop="sl" label="税率/征收率" min-width="200">
                </el-table-column>
                <el-table-column prop="xsyhzc" label="优惠政策以及简易计税" min-width="200">
                  <template slot-scope="scope">
                   
                   {{ scope.row.xsyhzc === 'Y'?'是':scope.row.xsyhzc === 'N'?'否':'' }}
                 </template>
                </el-table-column>
                <el-table-column prop="zzstsgl" label="优惠政策及简易计税类型" min-width="200">
                 
                </el-table-column>
                <el-table-column prop="dj" label="单价" min-width="120">
                </el-table-column>
                <el-table-column prop="dw" label="单位" min-width="120">
                </el-table-column>
                <el-table-column prop="ggxh" label="规格型号" min-width="120">
                </el-table-column>
                <el-table-column prop="address" label="操作" width="140" fixed="right">
                    <template slot-scope="scope">
                     
                        <el-button  type="text" size="small" @click="handlerEdite(scope)">编辑</el-button>
                        <el-popconfirm
                          title="确定删除当前行吗？"
                          @confirm="handleDel(scope) ">
                            <el-button type="text" size="small" slot="reference"><span style="color:red">删除</span></el-button>
                         </el-popconfirm>
                      </template>
                </el-table-column>
              </el-table>
            </article>
            <article>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="page.currentPage"
                :page-sizes="[15, 25, 75, 100]"
                :page-size="page.pageSize"
                layout="sizes, prev, pager, next"
                :total="total"
              >
              </el-pagination>
            </article>
          </el-card>
    <app-add-commodity v-if="addVisible" :commodity-active-id="activeId"  
    :data-ls="taxOption" :visible.sync="addVisible" 
    :title="title" :row-data="rowData"
    @saveDone="handleSaveDone"
    width="75%" ></app-add-commodity>
    <!--<article >
      <el-dialog
      title="商品明细批量导入"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
       <article>
        <div>
          <el-button type="text">下载模板</el-button>
        </div>
        <div style="text-align:center">
          <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        </div>
      </article>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
</el-dialog>

    </article> -->
  </div>
</template>

<script>
// import AppAddCommodity from '../componetns/dataAddDrawer/index.vue';
import AppAddCommodity from '../componetns/dataAddDrawerOnly/index.vue';
import {getTableSourceList,getTaxrateList,delTableRowSingle} from '../api.js';
const RESET_FORM = {
  name:'',
  slzf:null
}
export default {
  name: "tableThemePage",
  props:{
    currentId:{
      type:[String,Number],
      default:null
    },
    currentName:{
      type:[String,Number],
      default:''
    }
  },
  components: {AppAddCommodity},
  data() {
    return {
      // dialogVisible:false,
      tableData: [],
      page: {
        currentPage: 1,
        pageSize: 15,
      },
      total: 0,
      multipleSelection: [],
      addVisible: false,
      title:'',
      where:{},
      activeId: this.currentId || null,
      taxOption:[],
      loading:false,
      commodityName:this.currentName,
      rowData: {},
    };
  },
  computed: {
    // useCurrentId(){
    //   return this.currentId || null;
    // }
  },
  watch: {
    currentId:{
      handler(val){
        
        this.activeId = val;
        this.handleGetList()
      }
    },
    currentName:{
      handler(val){
        this.commodityName = val;
      }
    },
   
  },
  methods: {
    handleSizeChange(e) {
      console.log(e,'1')
      this.page.pageSize = e;
      this.handleGetList()
    },
    handleCurrentChange(e) {
      console.log(e)
      this.page.currentPage = e;
      this.handleGetList()
    },
    /* 初始化 */
    handlerInit(){
      this.handleGetList();
      let query = this.$route.query;
      if(query?.is_open){
        this.title = '商品添加'
        this.addVisible = true;
      }
    },
    /* 获取table数据 */
    handleGetList(){
      this.loading = true;
      let params = {
        ...this.where,
        pageNo:this.page.currentPage,
        pageSize:this.page.pageSize,
        marclassid:this.activeId || null,
      }
      getTableSourceList(params).then(res=>{
        console.log(res)
        if(res.code === '0'){
          this.total = res.totalCount;
          this.tableData = [...res.data];
        }
        this.loading = false;
      }).catch(e=>{
        this.loading = false;
      })
    },
    handleSaveDone(val){
      console.log(val);
      if(val){
        this.handleGetList();
      }
    },
    /* 获取点击ID */
    // handleNodeClick(val){
    //   debugger;
    //   console.log(val.id)
    //   this.activeId = val.id;
    //   this.handleGetList()
    // },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //编辑
    handlerEdite(scope){
      this.title = '商品编辑';
      this.rowData = {...scope.row};
      this.addVisible = true;
        console.log(scope.row)
    },
    /* Del */
    handleDel(scope){
      if(scope.row.id){
        this.handleDelSubmit([scope.row.id])
      }
    },
    /* 删除提交 */
    handleDelSubmit(data){
      if(!data || data.length <=0) return
      this.loading = true;
        delTableRowSingle(data).then(res=>{
          console.log(res)
          if(res.code === '0'){
            this.handleGetList();
            this.$message.success('删除成功！')
            
          }
         
        }).finally(()=>{
          this.loading = false;
        })
    },
    /* 新增商品 */
    handleAddCommondity(){
      this.rowData = {};
      this.title = '商品添加'
      this.addVisible = true;
      
    },
    
    /* 查询 */
    handleSerch(){
      this.handleGetList();
    },

    /* 重置 */
    handleReset(){
      this.where = {...RESET_FORM};
      
      this.page = {
        currentPage: 1,
        pageSize: 15,
      }
      this.handleGetList();
    },
    /* 获取税率list */
    handlerGetTaxRateLIst(){
      getTaxrateList().then(res=>{
        console.log(res)
        if(res.code === '0'){
          this.taxOption = res.data.map(k=> {return {...k,label:k.mc,value:k.slzf}});
        }
      })
    },
    /* 批量导入 */
    // handleImportBatch(){
    //   this.dialogVisible = true;
    // },
  },
  created() {
    this.handlerGetTaxRateLIst();
  },
  mounted() {
    this.handlerInit()
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
};
</script>
<style scoped lang="scss">
/*@import url(); 引入公共css类*/

::v-deep{
    .el-form-item--mini.el-form-item{
        margin-bottom:0px
    }
}
.top_margin_common{
    margin-bottom: 12px;
}
.btn_list{
    text-align: right;
}
.table_header{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>