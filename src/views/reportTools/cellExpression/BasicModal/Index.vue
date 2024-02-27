<template>
  <vxe-modal :draggable="true" title="基础配置" :value="basicVisible" width="500" @close="handleClose" :position="{top:200}">
    <el-container style="padding: 10px;">
      <el-main>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="配置项">
            <el-select v-model="field" placeholder="请选择" size="small" clearable>
              <el-option v-for="(item, index) in declareOptions" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-descriptions-item>
        </el-descriptions>
      </el-main>
    </el-container>

    <el-footer style="height: 40px;">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="success" @click="handleSubmit">确 定</el-button>
    </el-footer>

  </vxe-modal>
</template>

<script>

export default {

  props: {
    basicVisible: {
      type: Boolean
    },
    expCellExpression: {
      type: Object
    }
  },
  data() {
    return {
      api: require('./Api'),

      field: '',
      declareOptions: [],
    }
  },
  watch: {
    basicVisible(newVal, oldVal){
      if(newVal){
        this.initData()
      }
    },
  },
  mounted(){
    this.selectDeclareSettingList();
  },
  methods: {
    initData(){
      if(this.expCellExpression){
        this.field = this.expCellExpression.expression
      }else {
        this.field = ''
      }
    },
    selectDeclareSettingList(){
      this.api.selectDeclareSettingList().then(res=>{
        this.declareOptions = res.data;
      });
    },
    handleClose(){
      this.$emit("closeBasicModal");
    },
    handleSubmit(){
      this.$emit("submitBasicModal",{expression:this.field});
      this.handleClose();
    },
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
    text-align: right;
    margin-top: 20px;
  }
  /deep/ .vxe-modal--content{
    padding: 0 !important;
  }
  /deep/ .el-textarea__inner{
    min-height: 80px !important;
  }
  .el-select{
    width:100%;
  }
</style>
