<template>
  <vxe-modal :draggable="true" title="动态行配置" :value="modalVisible" width="800" @close="handleClose" :position="{top:200}">
    <el-container style="padding: 10px;">
      <el-descriptions direction="vertical" :column="dynamicRowFiledOptions.length" border>
        <template slot="title">
          {{currentCell && currentCell.row ? "当前第"+(currentCell.row[0]+1)+"行":"未选择行"}}
        </template>
        <template slot="extra">
          <el-select size="small" v-model="dynamicRowId" placeholder="请选择配置项">
            <el-option v-for="item in dynamicRowOptions" :key="item.id" :label="item.name" v-model="item.id"></el-option>
          </el-select>
        </template>
        <el-descriptions-item v-for="item in dynamicRowFiledOptions" :key="item.id" :label="item.name">
          起始列：<el-input size="small" v-model="item.colStart" placeholder="请输入对应起始列"></el-input>
          结束列：<el-input size="small" v-model="item.colEnd" placeholder="请输入对应结束列"></el-input>
        </el-descriptions-item>
      </el-descriptions>
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
    modalVisible: {
      type: Boolean
    },
    currentCell:{
      type: Object
    },
    dynamicSettingId:{
      type: Number
    }
  },
  data() {
    return {
      api: require('./Api'),
      dynamicRowId: '',
      dynamicRowOptions:[],
      dynamicRowFiledOptions:[],
    }
  },
  watch: {
    dynamicSettingId(newVal,oldVal){
      if(newVal){
        this.dynamicRowId = newVal;
      }
    },
    'dynamicRowId'(newVal, oldVal){
      this.clearValue();
      this.dynamicRowOptions.map(e=>{
        if(e.id == newVal){
          this.dynamicRowFiledOptions = e.fieldList
          return;
        }
      })
    }
  },
  mounted(){
    this.selectExpDynamicRowList();
  },
  methods: {
    clearValue(){
      this.dynamicRowFiledOptions.map(e=>{
        e.column = '';
      })
      this.dynamicRowFiledOptions = [];
    },
    handleClose(){
      this.clearValue();
      this.$set(this, 'dynamicRowId','')
      this.$emit("closeModal");
    },
    handleSubmit(){
      let data = {
        dynamicRowId: this.dynamicRowId,
        dynamicRowFiledOptions:this.dynamicRowFiledOptions,
      };
      this.$emit("submitModal", data)
      this.handleClose();
    },
    selectExpDynamicRowList(){
      this.api.selectExpDynamicRowList().then(res=>{
        this.dynamicRowOptions = res.data;
      });
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
  /deep/ .el-descriptions{
    width: 100%;
  }
  /deep/ .el-descriptions__extra{
    margin-left: 20px;
  }
</style>
