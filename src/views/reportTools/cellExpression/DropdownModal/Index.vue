<template>
  <vxe-modal :draggable="true" title="下拉框配置" :value="dropdownVisible" width="800" @close="handleClose" :position="{top:200}">
    <el-container style="padding: 10px;">
      <el-main>
        <el-input type="textarea" v-model="expression" placeholder="请输入，多个值以逗号分隔"></el-input>
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
    dropdownVisible: {
      type: Boolean
    },
    expCellExpression: {
      type: Object
    }
  },
  data() {
    return {
      expression: '',
    }
  },
  watch: {
    dropdownVisible(newVal, oldVal){
      if(newVal){
        this.initData()
      }
    }
  },
  mounted(){

  },
  methods: {
    initData(){
      if(this.expCellExpression){
        this.expression = this.expCellExpression.expression
      }else {
        this.expression = ''
      }
    },
    handleClose(){
      this.$emit("closeDropdown");
    },
    handleSubmit(){
      this.$emit("submitDropdown",{expression:this.expression})
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
</style>
