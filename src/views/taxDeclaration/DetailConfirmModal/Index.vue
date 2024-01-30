<template>
  <vxe-modal :draggable="true" :value="detailConfirmVisible" width="800" @close="handleClose" :position="{top:150}">
    <template #title>
      <Step :stepData="{current:current,total:total,title:stepTitle}"></Step>
    </template>
    <template #default>
      <el-descriptions :column="2">
        <el-descriptions-item label="当前操作企业">{{curRow.nsrmc}}</el-descriptions-item>
        <el-descriptions-item label="纳税属期">{{curRow.declareDate}}</el-descriptions-item>
      </el-descriptions>
      <vxe-table
        style="margin: 0 20px;"
        border
        stripe
        ref="xTable"
        align="center"
        size="mini"
        :data="confirmInfos">
        <vxe-column type="seq" min-width="50" title="序号"></vxe-column>
        <vxe-column field="mc" min-width="400" title="数据维护项目" ></vxe-column>
        <vxe-column field="sjzt" min-width="100" title="状态" >
          <template #default="{row, rowIndex, $rowIndex}">
            {{fmtSjzt(row.sjzt)}}
          </template>
        </vxe-column>
        <vxe-column field="xmmc" min-width="150" title="操作">
          <template #default="{row, rowIndex, $rowIndex}">
            <el-button type="success" v-if="row.sjzt==2" @click="doConfirm(row)">确认</el-button>
            <el-button plain @click="toDetail(row)">查询</el-button>
          </template>
        </vxe-column>
      </vxe-table>
      <el-footer>
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="success" @click="batchConfirm">一键确认</el-button>
        <el-button :disabled="!canNext" @click="nextStep">下一步</el-button>
      </el-footer>
    </template>
  </vxe-modal>
</template>

<script>

import Step from '@/components/Step.vue';
export default {
  name: 'DetailConfirmModal',
  components: {
    Step,
  },
  props: {
    detailConfirmVisible: {
      type: Boolean
    },
    curRow: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      api: require('./Api'),
      sjlx: 0,
      current:1,
      total: 3,
      stepTitle:'申报明细数据确认',
      confirmInfos: [],
      canNext: false,
    }
  },
  watch: {
    // 'curRow.id': {
    //   handler: function(newVal, oldVal){
    //     if(newVal){
    //       this.sjlx = 0;
    //       this.current = 1;
    //       this.total = 3;
    //       this.stepTitle = '申报明细数据确认';
    //       this.listLegerConfirm(newVal, this.sjlx);
    //     }
    //   }, 
    //   immediate: true
    // },
    // sjlx(newVal, oldVal){
    //   this.listLegerConfirm(this.curRow.id, newVal);
    // },
    confirmInfos(){
      this.canNext = this.checkCanNext();
    }
  },
  mounted(){
    this.stepTitle = '申报明细数据确认';
    this.listLegerConfirm(this.curRow.id, this.sjlx);
  },
  methods: {
    listLegerConfirm(id, sjlx){
      this.api.listLegerConfirm(id, sjlx).then(res=>{
        if(res.data.length==0){
          //明细为空，直接查询台账
          this.current = 1;
          this.total = 2;
          this.stepTitle = '申报台账数据确认'
          this.$set(this, 'sjlx', 1);
        }else {
          this.confirmInfos = res.data;
        }
      })
    },
    handleClose(){
      this.$emit("closeDetailConfirm");
    },
    nextStep(){
      if(this.sjlx==1){
        this.$emit("submitDetailConfirm");
      }else {
        this.current = 2;
        this.total = 3;
        this.stepTitle = '申报台账数据确认';
        const newSjlx = this.sjlx + 1
        this.$set(this, "sjlx", newSjlx);
        this.listLegerConfirm(this.curRow.id, newSjlx);
      }
    },
    checkCanNext(){
      let flag = true;
      this.confirmInfos.forEach(e=>{
        if( e.sjzt!=4 && e.sjzt!=5){
          flag = false;
          return;
        }
      });
      return flag;
    },
    fmtSjzt(status){
      if(!status){
        return "待生成"
      }else if(status==1){
        return "生成中"
      }else if(status==2){
        return "待确认"
      }else if(status==3){
        return "生成失败"
      }else if(status==4){
        return "已确认"
      }else if(status==5){
        return "已锁定"
      }
    },
    doConfirm(row){
      this.api.doConfirm({ids: [row.statusId], sbsz : this.curRow.sbsz}).then(res=>{
        this.$message({message: '确认成功！',type: 'success'});
        this.listLegerConfirm(this.curRow.id, this.sjlx);
      })
    },
    batchConfirm(){
      let ids = [];
      let flag = true;
      this.confirmInfos.forEach(e=>{
        if(e.sjzt==2){
          ids.push(e.statusId);
        }else if(!e.sjzt || e.sjzt==1 || e.sjzt==3){
          flag = false;
          return;
        }
      });
      if(!flag) {
        this.$message({message: '存在不能确认的记录！',type: 'warning'});
      }else if(ids.length > 0){
        this.api.doConfirm({ids: ids, sbsz : this.curRow.sbsz}).then(res=>{
          this.$message({message: '确认成功！',type: 'success'});
          this.listLegerConfirm(this.curRow.id, this.sjlx);
        })
      }
    },
    toDetail(row){
     // console.log(row);
      this.$router.push({
        path: row.url,
        query:{
          nsrsbh: this.curRow.nsrsbh,
          ssq: this.curRow.declareDate,
          tbzq: this.curRow.period
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  /deep/ .el-dialog__header{
    border-bottom: 1px solid #ccc;
  }
  /deep/ .el-dialog__body{
    padding: 0;
  }
  .el-header{
    display: flex;
    justify-content: space-between;
    height: 40px !important;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
  }
  .el-footer{
    margin-top: 10px;
    text-align: center;
  }
  /deep/ .vxe-modal--content{
    padding: 0 !important;
  }
  /deep/ .step{
    font-weight: normal;
    font-size: 20px;
  }
  .el-descriptions{
    padding: 10px 20px;
  }
  /deep/ .el-descriptions--mini{
    font-size: 14px !important;
  }
</style>
