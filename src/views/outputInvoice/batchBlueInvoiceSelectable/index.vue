<template>
  <div class="main-content">
    <el-card shadow="hover" class="f-el-card">
      <el-form :model="form" label-width="80px">
        <el-row>
          <el-col :span="8" :body-style="{ paddingBottom: 0 }">
            <el-form-item label="搜索" :model="form">
              <el-input
                v-model="form.name"
                placeholder="请输入纳税人名称/账套名称/开票点名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :body-style="{ paddingBottom: 0 }">
            <el-form-item label="" :model="form" label-width="30px">
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="handlerRest">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="hover" :body-style="{height: 'calc(100vh - 240px)'}">
      <article>
        <el-table ref="batchBlueInvoiceRef" :data="tableData" style="width: 100%;height: calc(100vh - 320px);overflow:hidden auto;" :border="true" :v-loading="loading">
            <el-table-column type="index" label="序号" width="55" :header-align="'center'" :align="'center'">
          </el-table-column>
          <el-table-column prop="name" label="开票点名称" minWidth="180" show-overflow-tooltip  :header-align="'center'" :align="'center'">
          </el-table-column>
          <el-table-column prop="ssztName" label="所属账套" minWidth="180" show-overflow-tooltip :header-align="'center'" :align="'center'">
          </el-table-column>
          <el-table-column prop="nsrmc" label="纳税人名称" minWidth="180" show-overflow-tooltip :header-align="'center'" :align="'center'">
          </el-table-column>
          <el-table-column prop="nsrsbh" label="纳税人识别号" minWidth="140" show-overflow-tooltip :align="'center'">
          </el-table-column>
          <el-table-column  label="操作" width="180"  :align="'center'"> 
            <template slot-scope="scope">
                <el-button  type="primary"  @click="handleACtion(scope)">操作</el-button>
                <!-- <el-button type="text"  @click="handleACtion(scope,'02')">开普票</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </article>
      <article>
        <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="page.pageSizes"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
        </el-pagination>
      </article>
    </el-card>
    
  </div>
</template>

<script>
import {getList} from '../blueInvoice/Api';

export default {
  name: "batchBlueInvoicePage",
  components: {},
  props: {},
  data() {
    return {
      form: {
        name: "",
      },
      tableData:[],
      loading:false,
      page:{
        currentPage:1,
        pageSizes:[10,20,30,40,50,100,500,1000],
        pageSize:10,
        total:0,
      },
      visible:false,
      title:'title',
      respData:{},
    };
  },
  computed: {},
  watch: {},
  methods: {
    /* 获取数据 */
    handlerGetList(){
        this.loading = true;
        let data ={
            pageNo: this.page.currentPage || 1,
            pageSize: this.page.pageSize || 10,
            name:this.form.name || ''
        }
        getList(data).then(res=>{
            
            if(res.code === 0 || res.code === '0'){
                this.tableData = [...res.data];
                this.page.currentPage = res.pageNo;
                this.page.pageSize = res.pageSize;
                this.page.total = res.totalCount;
            }
        }).finally(()=>{
            this.loading = false;
        })
    },
    /* 分页 */
    handleSizeChange(val) {
        
        this.page.pageSize = val;
        this.handlerGetList();
      },
    handleCurrentChange(val) {
    
    this.page.currentPage = val;
    this.handlerGetList();
    },

    /* 搜索 */
    handleSearch(){
        this.handlerGetList();
    },

    /* 重置 */
    handlerRest(){
        this.form.name = '';
        this.handlerGetList();
    },
    /* 操作 */
    /*  01专 02 普 */
    handleACtion(scope){
      console.log(scope.row,"row")
        const {id,nsrmc,nsrsbh,kpdId} = scope.row || {}
        this.$router.push({path:'/outputInvoice/batchBlueInvoiceSelectable/blueTaskMage',query:{kpdId,orgId:id,nsrsbh,nsrmc}});
        // this.title = type === '01' ? '批量专票': '批量普票';
        // this.respData = {orgId:scope.row.id,fppz:type};
        // this.visible = true;
    }
  },
  created() {},
  mounted() {
    this.handlerGetList();
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {
    this.$refs.batchBlueInvoiceRef.doLayout();
  },
  beforeDestroy() {},
  destroyed() {},
  activated() {},
};
</script>
<style scoped>
/*@import url(); 引入公共css类*/
</style>