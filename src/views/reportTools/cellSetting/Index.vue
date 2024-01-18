<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <form-list :columns="columns"
               :searchRow="SearchList"
               :api="api"
               :param="param"
               :height="height"
               v-loading="loading"
               ref="list">
      <template #editorType="row">
        <template v-if="row.data.editorType == 0">
          表间公式
        </template>
        <template v-else-if="row.data.editorType == 1">
          手工输入
        </template>
        <template v-else-if="row.data.editorType == 2">
          公式弹窗
        </template>
        <template v-else-if="row.data.editorType == 3">
          动态行
        </template>
        <template v-else-if="row.data.editorType == 4">
          下拉框
        </template>
        <template v-else-if="row.data.editorType == 5">
          基础配置
        </template>
        <template v-else-if="row.data.editorType == 6">
          文本
        </template>
      </template>

      <template #sheetOrder="row">{{row.data.sheetOrder+1}}</template>
      <template #rowStart="row">{{row.data.rowStart+1}}</template>
      <template #rowEnd="row">{{row.data.rowEnd+1}}</template>
      <template #colStart="row">{{row.data.colStart+1}}</template>
      <template #colEnd="row">{{row.data.colEnd+1}}</template>

      <template #myscope="row">
        <el-button @click.stop="editCellSetting(row.data)" type="primary">编辑</el-button>
        <el-button @click.stop="delCellSetting(row.data)" type="danger">删除</el-button>
      </template>

      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button @click="addCellSetting">新增</el-button>
            <el-button @click="copyCellSetting" type="success">复制配置</el-button>
          </div>
        </div>
      </template>
    </form-list>

    <el-dialog :title="title" :visible.sync="dlgVisible" width="1200px" :show-close="false" :before-close="handleClose" class="large" :close-on-click-modal="false">
      <template #title>
        <div style="display: flex; justify-content: space-between;">
          <div style="font-size: 14px;">{{title}}</div>
          <div>
            <el-button @click="handleClose">关闭</el-button>
            <el-button type="success" @click="handleSubmit">保存并继续</el-button>
          </div>
        </div>
      </template>

      <el-form ref="dlgForm" :model="dlgForm" :rules="dlgRules" size="mini" :inline="true" label-position="right">
        <el-form-item label="报表" prop="templateId">
          <el-select filterable  class="form-inline-input" size="small" v-model="dlgForm.templateId">
            <el-option v-for="option in templateOptions" :key="option.id" :label="option.templateName" v-model="option.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input size="small" v-model="dlgForm.description"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="editorType">
          <el-select  class="form-inline-input" size="small" v-model="dlgForm.editorType">
            <el-option key="0" label="表间公式" :value="0"></el-option>
            <el-option key="1" label="手工输入" :value="1"></el-option>
            <el-option key="2" label="公式弹窗" :value="2"></el-option>
            <el-option key="3" label="动态行" :value="3"></el-option>
            <el-option key="4" label="下拉框" :value="4"></el-option>
            <el-option key="5" label="基础配置" :value="5"></el-option>
            <!--<el-option key="6" label="文本" :value="6"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item v-if="dlgForm.editorType==6" label="值" prop="description">
          <el-input size="small" v-model="dlgForm.viewer"></el-input>
        </el-form-item>
      </el-form>
      <div id="luckysheet1" class="luckysheet" ></div>
    </el-dialog>

    <el-dialog title="复制配置" :visible.sync="copyDlgVisible" width="500px" :before-close="closeCopyDlg">
      <el-form ref="copyForm" :model="copyForm" :rules="copyRules" size="mini">
        <el-form-item label="源报表" prop="sourceTemplateId">
          <el-select filterable  class="form-inline-input" size="small" v-model="copyForm.sourceTemplateId">
            <el-option v-for="option in templateOptions" :key="option.id" :label="option.templateName" v-model="option.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标报表" prop="targetTemplateId">
          <el-select filterable  class="form-inline-input" size="small" v-model="copyForm.targetTemplateId">
            <el-option v-for="option in templateOptions" :key="option.id" :label="option.templateName" v-model="option.id"></el-option>
          </el-select>
        </el-form-item>
        <el-footer style="text-align: right;">
          <el-button @click="closeCopyDlg">取 消</el-button>
          <el-button type="success" @click="submitCopyDlg">确 定</el-button>
        </el-footer>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import FormList from '@/components/FormList.vue';
  import LuckyExcel from 'luckyexcel'
  import { luckySetting } from '../settings.js'

  export default {
    name: 'CellSetting',
    components: {
      FormList
    },
    data() {
      return {
        form: {},
        api: require('./Api'),
        templateApi: require('../templateMng/Api'),
        param: {},
        loading: false,

        title: '新增配置',
        dlgVisible: false,
        dlgForm: {
        },
        lastCell:{},
        dlgRules: {
          templateId: [{ required: true, message: '内容必填', trigger: 'blur' }],
        //  description: [{ required: true, message: '内容必填', trigger: 'blur' }],
          sheetOrder: [{ required: true, message: '内容必填', trigger: 'blur' }],
          rowStart: [{ required: true, message: '内容必填', trigger: 'blur' }],
          rowEnd: [{ required: true, message: '内容必填', trigger: 'blur' }],
          colStart: [{ required: true, message: '内容必填', trigger: 'blur' }],
          colEnd: [{ required: true, message: '内容必填', trigger: 'blur' }],
          editorType: [{ required: true, message: '内容必填', trigger: 'blur' }]
        },
        templateOptions: [],
        columns: [
          { title: '序号', type: "index", width: 50 },
          { title: "模板名称", dataIndex: "templateName", width: 200},
          { title: "描述", dataIndex: "description", width: 200},
          { title: "sheet页序号", dataIndex: "sheetOrder",slot:'sheetOrder'},
          { title: "起始行", width: 60, dataIndex: "rowStart",slot:'rowStart'},
          { title: "结束行", width: 60, dataIndex: "rowEnd",slot:'rowEnd'},
          { title: "起始列", width: 60, dataIndex: "colStart" ,slot:'colStart'},
          { title: "结束列", width: 60, dataIndex: "colEnd",slot:'colEnd'},
          { title: "取数方式", width: 60, dataIndex: "editorType",slot:'editorType' },
          {title: "操作",key: "action",width: 150, scopedSlots: { customRender: "action" }},
        ],
        SearchList: [
          {
            label: "申报表模板",
            key: "templateId", val: "", type: "select",
            options: []
          },
        ],
        copyDlgVisible: false,
        copyForm: {},
        copyRules: {
          sourceTemplateId: [{ required: true, message: '内容必填', trigger: 'blur' }],
          targetTemplateId: [{ required: true, message: '内容必填', trigger: 'blur' }],
        }
      };
    },
    mounted() {
      this.$nextTick(()=>{
        this.selectExpTemplateList();
      })
    },
    watch: {
      'dlgForm.templateId'(newVal, oldVal){
        if(newVal){
          this.loadTemplate(newVal);
          this.templateOptions.map(item => {
            if(item.id == newVal){
              this.dlgForm.templateName = item.templateName
            }
          })
        }
      }
    },
    computed: {
      contentHeight() {
        return window.innerHeight - 132;
      },
      height() {
        return window.innerHeight - 310;
      },
    },
    methods: {
      loadTemplate(templateId){
        let that = this;
        that.templateApi.getTemplateDetailJson(templateId).then(res=>{
          if(res.data){
            that.loadExcelJson('luckysheet1', res.data)
          }else {
            that.templateApi.loadTemplate(templateId).then(blob =>{
              let excelFile = new File([blob], '申报表模板.xlsx');
              this.uploadExcel(excelFile)
            });
          }
        });
      },
      uploadExcel(file){
        let that = this;
        let name = file.name;
        let suffixArr = name.split("."), suffix = suffixArr[suffixArr.length-1];
        if(suffix!="xlsx"){
          this.$message.error('只能支持xlsx格式的文件')
          return;
        }
        LuckyExcel.transformExcelToLucky(file, function(exportJson, luckysheetfile){
          if(exportJson.sheets==null || exportJson.sheets.length==0){
            this.$message.error('加载文件失败')
            return;
          }
          that.loadExcelJson('luckysheet1', exportJson.sheets)
        });
      },
      loadExcelJson(id, excelJson){
        let that = this;
        window.luckysheet.destroy();
        this.$store.commit("app/saveExcludePage", ['FillDeclaration','CellExpression']);
        window.luckysheet.create({
          ...luckySetting,
          container: id,
          data: excelJson,
          hook:{
            workbookCreateAfter:function(){
              if(that.dlgForm.rowStart && that.dlgForm.colStart){
                that.lastCell = {...that.dlgForm}
                luckysheet.setCellFormat(that.dlgForm.rowStart, that.dlgForm.colStart, "bg", "#ffb628", {order:that.dlgForm.sheetOrder})
              }
            },
            cellEditBefore:function(e){
              let data = {
                templateId: that.dlgForm.templateId,
                sheetOrder: luckysheet.getSheet().order,
                rowStart: e[0].row[0],
                rowEnd: e[0].row[1],
                colStart: e[0].column[0],
                colEnd: e[0].column[1]
              }
              //获取单元的描述
              that.api.detailCellSetting(data).then(res=> {
                if(res.data ){
                  that.$set(that.dlgForm, 'editorType', res.data.editorType)
                  that.$set(that.dlgForm, 'description', res.data.description)
                }else{
                  that.$set(that.dlgForm, 'editorType', '')
                  that.$set(that.dlgForm, 'description', '')
                }
              })
              that.$set(that.dlgForm, 'sheetOrder', luckysheet.getSheet().order)
              that.$set(that.dlgForm, 'rowStart', e[0].row[0])
              that.$set(that.dlgForm, 'rowEnd', e[0].row[1])
              that.$set(that.dlgForm, 'colStart', e[0].column[0])
              that.$set(that.dlgForm, 'colEnd', e[0].column[1])

              if(that.lastCell.rowStart && that.lastCell.colStart){
                luckysheet.setCellFormat(that.lastCell.rowStart, that.lastCell.colStart, "bg", "", {order:that.lastCell.sheetOrder});
              }
              luckysheet.setCellFormat(that.dlgForm.rowStart, that.dlgForm.colStart, "bg", "#ffb628", {order:that.dlgForm.sheetOrder})
              that.lastCell = {...that.dlgForm}
            },
          },
        });
      },
      selectExpTemplateList(){
        this.templateApi.selectExpTemplateList({}).then(res =>{
          this.templateOptions = res.data
          res.data.map(item => {
            this.SearchList[0].options.push({value:item.id, label: item.templateName})
          })
        })
      },
      handleOk() {
        this.$refs.list.reload()
      },
      handleClose(){
        this.dlgVisible = false;
        this.$set(this,'dlgForm',{})
        this.handleOk();
      },
      handleSubmit(){
        let that = this;
        that.$refs.dlgForm.validate((valid) => {
          if (valid) {
            that.api.saveCellSetting(that.dlgForm).then(res =>{
              if(res.code=='0'){
                that.$message({
                  type: 'success',
                  message: '保存成功!'
                });
             //   that.handleOk();
              //  that.dlgVisible = false;
              }
            });
          }
        });
      },
      addCellSetting(){
        window.luckysheet.destroy();
        this.$set(this.dlgForm,'templateId',this.templateOptions[0].id)
       // this.loadTemplate(this.dlgForm.templateId);
        this.title = '新增配置'
        this.dlgVisible = true;
      },
      editCellSetting(row){
        if(row.templateId == this.dlgForm.templateId){
          this.loadTemplate(this.dlgForm.templateId);
        }
        this.dlgForm = {...row}
        this.title = '编辑配置'
        this.dlgVisible = true;
      },
      delCellSetting(row){
        let that = this;
        this.$confirm('确认删除吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.api.delCellSetting(row.id).then(res =>{
            that.handleOk();
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      copyCellSetting(){
        this.copyForm = {};
        this.copyDlgVisible = true;
      },
      closeCopyDlg(){
        this.copyDlgVisible = false;
      },
      submitCopyDlg(){
        let that = this;
        that.$refs.copyForm.validate((valid) => {
          if (valid) {
            if(this.copyForm.targetTemplateId == this.copyForm.sourceTemplateId){
              this.$message.error('目标报表不能和源报表相同!');
              return;
            }
            that.api.copyCellSetting(that.copyForm).then(res =>{
              if(res.code=='0'){
                that.$message({
                  type: 'success',
                  message: '保存成功!'
                });
                that.handleOk();
                that.copyDlgVisible = false;
              }
            });
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .large{
    /deep/ .el-dialog{
      height: 800px;
      margin-top: 10vh !important;
      .el-dialog__body{
        padding: 10px 20px;
      }
    }
  }
  .form-inline-input{
    width: 100%;
  }
  .luckysheet{
    width: 1158px;
    height: 600px;
  }
</style>
