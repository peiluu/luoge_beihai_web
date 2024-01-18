<template>
  <vxe-modal :draggable="true" title="公式定义" :value="expVisible" width="1200" @close="handleClose">
    <el-container>
      <el-header>
        <div>公式编辑</div>
        <div>
          <el-dropdown placement="top-start" trigger="click" @command="handleOpt">
            <span class="el-dropdown-link">
              运算符<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="+">+ 加</el-dropdown-item>
              <el-dropdown-item command="-">- 减</el-dropdown-item>
              <el-dropdown-item command="*">* 乘</el-dropdown-item>
              <el-dropdown-item command="/">/ 除</el-dropdown-item>
              <el-dropdown-item command="(">( 左括号</el-dropdown-item>
              <el-dropdown-item command=")">) 右括号</el-dropdown-item>
              <el-dropdown-item command="=">= 等于</el-dropdown-item>
              <el-dropdown-item command=">">> 大于</el-dropdown-item>
              <el-dropdown-item command="<">< 小于</el-dropdown-item>
              <el-dropdown-item command="?">? 问号</el-dropdown-item>
              <el-dropdown-item command=":">? 冒号</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown placement="top-start" trigger="click" @command="handleOpt">
            <span class="el-dropdown-link">
              函数<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <!--<el-dropdown-item command="ABS">ABS(绝对值)</el-dropdown-item>-->
              <el-dropdown-item command="ROUND">ROUND(四舍五入)</el-dropdown-item>
              <!--<el-dropdown-item command="SUM">SUM(求和)</el-dropdown-item>
              <el-dropdown-item command="COUNT">COUNT(计数)</el-dropdown-item>
              <el-dropdown-item command="MAX">MAX(最大值)</el-dropdown-item>
              <el-dropdown-item command="MIN">MIN(最小值)</el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <el-input type="textarea" v-model="expression"></el-input>
      </el-main>
      <el-header class="exp_hearder">
        <div>公式列表</div>
        <el-button style="margin: 5px 0;" @click="addSub">添加取数项</el-button>
      </el-header>
      <el-main>
        <el-table
          ref="expTable"
          :data="tableData"
          height="500"
          style="width: 100%">
          <el-table-column prop="gsm" label="公式码" min-width="80"></el-table-column>
          <el-table-column prop="dsTypeView" label="数据源类型" min-width="80"></el-table-column>
          <el-table-column prop="dsIdView" label="数据源" min-width="120">
            <template slot-scope="scope">
              <slot :data="scope.row">{{ scope.row.dsIdView || scope.row.templateName}}</slot>
            </template>
          </el-table-column>
          <el-table-column prop="qsxView" label="取数项" min-width="120">
            <template slot-scope="scope">
              <slot :data="scope.row">{{ scope.row.qsxView || scope.row.declareCellDescrpiton}}</slot>
            </template>
          </el-table-column>
          <el-table-column prop="nsztView" label="纳税主体" min-width="80">
            <template slot-scope="scope">
              <slot :data="scope.row">{{ scope.row.nsztView || '纳税主体'}}</slot>
            </template>
          </el-table-column>
          <el-table-column prop="qjView" label="期间" min-width="120">
            <template slot-scope="scope">
              <slot :data="scope.row">
                <template v-if="scope.row.qjView">{{ scope.row.qjView }}</template>
                <template v-else>
                  <el-select size="small" v-model="scope.row.declareSq">
                    <el-option  key="bndq" label="本年当期" value="bndq"></el-option>
                    <el-option  key="bnsq" label="本年上期" value="bnsq"></el-option>
                    <el-option  key="sntq" label="上年同期" value="sntq"></el-option>
                    <el-option  key="snqm" label="上年期末" value="snqm"></el-option>
                    <el-option  key="sq" label="上期" value="sq"></el-option>
                  </el-select>
                </template>
              </slot>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="primary" @click="editSub(scope.row, scope.$index)">编辑</el-button>
              <el-button type="danger" @click="removeSub(scope.row, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer style="height: 40px;">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="success" @click="handleSubmit">确 定</el-button>
      </el-footer>
    </el-container>

    <vxe-modal :draggable="true" title="添加取数" :value="innerVisible" width="1200" @close="handleCancleSub" :resize="true">
      <ExpSubModal ref="subModal" :innerVisible="innerVisible"
                   :editRow="editRow"
                   @handleCancleSub="handleCancleSub"
                   @handleSubmitSub="handleSubmitSub"/>
    </vxe-modal>

  </vxe-modal>
</template>

<script>

import ExpSubModal from './ExpSubModal'
export default {
  name: 'ExpModal',
  components: {
    ExpSubModal
  },
  props: {
    expVisible: {
      type: Boolean
    },
    expCellExpression: {
      type: Object
    }
  },
  data() {
    return {
      api: require('./Api'),
      tableData: [],
      innerVisible: false,
      editRow: {},
      editIndex: -1,
      expressionId: '',
      expression: '',
      delIds: [],
    }
  },
  watch: {
    expVisible(newVal, oldVal){
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
        this.expressionId = this.expCellExpression.id
        this.expression = this.expCellExpression.expression
        this.tableData = this.expCellExpression.gsmList
      }else {
        this.expressionId = ''
        this.expression = ''
        this.tableData = []
      }
    },
    handleClose(){
      this.$emit("closeExp");
    },
    handleSubmit(){
      this.$emit("submitExp", {
        id: this.expressionId,
        expression:this.expression,
        gsmList: this.tableData,
        delIds: this.delIds
      })
    },
    addSub(){
      this.editRow = {dsType: 0, filters: [], optType:'add'};
      this.editIndex = -1;
      this.innerVisible = true;
      this.title = '添加取数';
      this.$nextTick(()=>{
        this.$refs.subModal.initData();
      })
    },
    handleCancleSub(){
      this.innerVisible = false;
      this.title = '公式定义'
    },
    handleSubmitSub(data){
      if(this.editIndex==-1){
        this.tableData.push(data)
        this.updateExpression({gsm: data.gsm, type: 1})
      }else {
        this.tableData.splice(this.editIndex, 1 , data)
      }
      this.handleCancleSub();
    },
    editSub(row, index){
      this.editRow = row;
      this.editIndex = index;
      this.innerVisible = true;
      this.title = '编辑取数';
      this.$nextTick(()=>{
        this.$refs.subModal.initData();
      })
    },
    removeSub(row, index){
      if(row.id){
        this.delIds.push(row.id)
      }
      this.tableData.splice(index, 1)
      this.updateExpression({gsm: row.gsm, type: 2})
    },
    handleOpt(command){
      this.updateExpression({gsm: command, type: 1})
    },
    updateExpression(data){
      if(data.type==1){
        this.expression += data.gsm;
      }else {
        this.expression = this.expression.replace(new RegExp(data.gsm,"g"), "")
      }
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
  .el-dropdown-menu{
    margin-top:200px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  /deep/ .el-textarea__inner{
    min-height: 80px !important;
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
</style>
