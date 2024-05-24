<template>
  <div class="main-content">
    <el-card shadow="never" body-style="padding: 0">
      <article class="table_header">
        <div>
          <el-button @click="$router.go(-1)">返回</el-button>
          <el-button type="primary" @click="handleAddTask">添加任务</el-button>
          <el-button type="primary" @click="handlerRefers">刷新状态</el-button>
        </div>
      </article>
      <article>
        <el-table :data="tableData" v-loading="loading" :height="height" :border="true">
          <el-table-column type="index" label="序号" width="55" :align="'center'">
          </el-table-column>
          <el-table-column
            prop="pch"
            label="批次号"
            show-overflow-tooltip
            :header-align="'center'"
            minWidth="130"
            :align="'center'"
          >
          </el-table-column>
          <el-table-column
            prop="nsrmc"
            label="纳税人名称"
            show-overflow-tooltip
            :header-align="'center'"
            minWidth="220"
            :align="'center'"
          >
          </el-table-column>
          <el-table-column
            prop="nsrsbh"
            label="纳税人识别号"
            show-overflow-tooltip
            :header-align="'center'"
            minWidth="180"
            :align="'center'"
          >
          </el-table-column>
          <el-table-column
            prop="fppz"
            label="票种"
            show-overflow-tooltip
            :header-align="'center'"
            minWidth="120"
            :align="'center'"
          >
          <template slot-scope="scope">
            {{ scope.row.fppz === '01' ? '增值税专用发票':'增值税普通发票' }}
          </template>
          </el-table-column>
          
          <el-table-column
            prop="pch"
            label="开票成功"
            show-overflow-tooltip
            :header-align="'center'"
            minWidth="80"
            :align="'center'">
            <template slot-scope="scope">
                <el-link type="success" @click="handleViewDes(scope,'00')">{{ `${scope.row.kpcg} （张）` }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="pch"
            label="开票失败"
            show-overflow-tooltip
            :header-align="'center'"
            minWidth="80"
            :align="'center'">
            <template slot-scope="scope">
                <el-link type="danger" @click="handleViewDes(scope,'02')">{{ `${scope.row.kpsb} （张）` }}</el-link>
            </template>
            
          </el-table-column>
          <el-table-column
            prop="pch"
            label="待开票"
            show-overflow-tooltip
            :header-align="'center'"
            minWidth="80"
            :align="'center'">
            <template slot-scope="scope">
                <el-link type="warning" @click="handleViewDes(scope,'04')">{{`${ scope.row.wkp} （张）` }}</el-link>
            </template>
          </el-table-column>
          
          <el-table-column
            prop="pch"
            label="开票中"
            show-overflow-tooltip
            :header-align="'center'"
            minWidth="80"
            :align="'center'">
            <template slot-scope="scope">
                <el-link type="info" @click="handleViewDes(scope,'01')">{{ `${scope.row.kpz} （张）` }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="zs"
            label="总计"
            show-overflow-tooltip
            :header-align="'center'"
            minWidth="80"
            :align="'center'">
            <template slot-scope="scope">
                <el-link type="info" @click="handleViewDes(scope,'')">{{ `${scope.row.zs} （张）` }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="hjje"
            label="合计金额"
            minWidth="120"
            show-overflow-tooltip
            :header-align="'center'"
            :align="'center'"
          >
          </el-table-column>
          <el-table-column
            prop="hjse"
            label="合计税额"
            minWidth="120"
            show-overflow-tooltip
            :header-align="'center'"
            :align="'center'"
          >
          </el-table-column>
          <el-table-column
            prop="jshj"
            label="价税合计"
            minWidth="120"
            show-overflow-tooltip
            :header-align="'center'"
            :align="'center'"
          >
          </el-table-column>
          <el-table-column
            prop="zt"
            label="状态"
            show-overflow-tooltip
            :header-align="'center'"
            minWidth="120"
            :align="'center'"
          >
          <template slot-scope="scope">
            <el-tag :underline="false" :type="['info','success','danger','warning','primary'][handleParesZT(scope).type]">
                {{ handleParesZT(scope).text }}
            </el-tag>
          </template>
          </el-table-column>
          <el-table-column
            prop="riqi"
            label="时间"
            minWidth="160"
            show-overflow-tooltip
            :header-align="'center'"
            :align="'center'"
          >
          </el-table-column>
         
          <el-table-column label="操作" width="180" :header-align="'center'" :align="'center'" fixed="right">
            <template slot-scope="scope">
              <el-link @click="handleViewDes(scope,'')" type="parmariy" size="small">
                查看
              </el-link>
              <el-divider direction="vertical"></el-divider>
              <!-- :disabled="handleParesZT(scope).ty -->
              <el-popconfirm
                title="是否确认开票？" @confirm="handleOpen(scope)" :disabled="handleParesZT(scope).type!==4">
                    <el-link slot="reference" :type=" handleParesZT(scope).type!==4 ? 'info' : 'parmariy' " size="small" :disabled="handleParesZT(scope).type!==4">开票</el-link>
                </el-popconfirm>
                <el-divider direction="vertical"></el-divider>
                <el-popconfirm
                title="是否确认删除票？" @confirm="handleDel(scope)" :disabled="scope.row.kpz !==0 || scope.row.kpcg !== 0">
                    <el-link slot="reference" :type="scope.row.kpz !==0 || scope.row.kpcg !== 0 ? 'info' : 'danger' " :disabled="scope.row.kpz !==0 || scope.row.kpcg !== 0" size="small">删除</el-link>
                </el-popconfirm>
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
          :total="page.total"
        >
        </el-pagination>
      </article>
    </el-card>
    <app-add-task :visible.sync="addVisible" v-if="addVisible" :resp-data="respData" :title="title" @done="handleAddDone"></app-add-task>
    <app-into-excel :visible.sync="visible" v-if="visible" :title="listTitle" :resp-data="listRespData"></app-into-excel>
  </div>
</template>

<script>
import AppAddTask from './addTask';
import AppIntoExcel from '../intoExcel';
import {getBatchTaskData,postBatchDoOnvoice,delBatchSingleData} from '../api'
export default {
  name: "blueTaskMagePage",
  components: {AppAddTask,AppIntoExcel},
  props: {},
  data() {
    return {
      tableData: [],
      page: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 50, 70, 100, 150, 200],
        pageSize: 10,
        total: 0,
      },
      addVisible:false,
      respData:{},
      title:'title',
      visible:false,
      listTitle:'',
      listRespData:{},
      polling:null,
      loading:false,
    };
  },
   computed: {
    height() {
      return window.innerHeight - 230;
    },
  },
  watch: {},
  methods: {
    /* 分页事件 */
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.handlerGetTaskList()
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.handlerGetTaskList()
    },
    /* 添加任务 */
    handleAddTask(){
        const {orgId,fppz} = this.$route.query || {}
        // this.title = fppz === '01' ? '添加开批量任务': '批量普票任务添加';
        this.title = '添加开批量任务';
        this.respData = {orgId,fppz};
        this.addVisible = true;
    },
    /* 添加任务回调 */
    handleAddDone(val){
        if(val){
            this.handlerGetTaskList();
        }
    },
    /* 查看 */
    handleViewDes(scope,type){
        const {pch} = scope.row || {};
        const {orgId,fppz} = this.$route.query || {}
        this.listRespData = {orgId,fppz,pch,type};
        this.listTitle = '任务详情'
        this.visible = true;
    },
    /* 获取任务 */
    handlerGetTaskList(type){
       this.loading = true;
        let data = {
          "pageNo": this.page.currentPage,
          "pageSize": this.page.pageSize,
        nsrsbh:this?.$route?.query?.nsrsbh || '',
        }
        getBatchTaskData(data).then(res=>{
            if([0,'0'].includes(res.code)){
                this.tableData = [...res.data]
                this.page.total = res.totalCount;
                if(type) this.$message.success("刷新成功！")
            }
        }).finally(()=>{
            this.loading = false;
        })
    },
    /* 手动刷新 */
    handlerRefers(){
        this.handlerGetTaskList(1);
    },
    /* 三分钟刷新一次 */
    handleStartPolling(){
    this.polling = setInterval(() => {
        this.polling = null;
        this.handlerGetTaskList();
      }, 2000);
    },
    handleStopPolling() {
      // 清除定时器
      if (this.polling) {
        clearInterval(this.polling);
      }
    },
    /* 开票 */
    handleDoIncoive(scope){
        this.loading = true;
        const {pch} = scope.row || {};
        let data ={pch}
        postBatchDoOnvoice(data).then(res=>{
            if([0,'0'].includes(res.code)){
                this.$message.success('批量开票中（时间较长），请稍后查询开票结果！');
                this.handlerGetTaskList();
            }else{
                this.$message.error(res.msg);
            }
        }).finally(()=>{
            this.loading = false;
        })
    },
    /* 状态格式化
    [开票成功，解析中，开票失败，开票中，未开票]
    */
    handleParesZT(scope){
        const {kpsb,kpz,wkp,zt,zs} = scope.row || {};
        let status = {
            text:'开票完成',
            type:1
        };
        console.log(kpsb,kpz,wkp,zt)
        if(zt === '1'){
             status.text = '解析中';
             status.type = 0;
             return status
        }else if(kpsb <=0 && kpz <= 0 && wkp<=0){
            status.text = '开票完成';
             status.type = 1;
             return status
        }else if(kpsb >0 ){
            status.text = '开票失败';
             status.type = 2;
             return status
        }else if(kpz >0 ){
            status.text = '开票中';
             status.type = 3;
             return status
        }/*else if(wkp >0 && zs === wkp ){*/
        else if(wkp >0){
            status.text = '待开票';
             status.type = 4;
             return status
        }else{
            return status
        }
       
    },
    /* 二次提醒开票 */
    handleOpen(scope) {
      const {nsrmc,nsrsbh} = scope.row || {};
        this.$confirm(`<div>请再次确认开票主体</div>
        <div>销售方名称：${nsrmc}</div>
        <div>纳税人识别号：${nsrsbh}</div>`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {
          this.handleDoIncoive(scope)
        }).catch(() => {
                  
        });
      },
     async handleDel({row}){
        const {pch} = row || {};
        try{
          const res = await delBatchSingleData(pch);
          if([0,'0'].includes(res.code)){
            this.$message.success("操作成功！")
          }else{
            this.$message.error("操作失败！")
          }
        }catch{
          this.$message.error("操作失败！")
        }
        
      }
  },
  created() {
   // this.handleStartPolling();
  },
  mounted() {
    
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {
    this.handleStopPolling();
  },
  activated() {
    this.handlerGetTaskList();
  },
};
</script>
<style scoped lang="scss">
/*@import url(); 引入公共css类*/
.table_header {
  padding: 12px;
  background: #f5f7fa;
  border: 1px solid #ebeef5;
  border-bottom: none;
}
::v-deep .el-pagination{
  margin: 0;
  padding: 8px 5px;
}
</style>