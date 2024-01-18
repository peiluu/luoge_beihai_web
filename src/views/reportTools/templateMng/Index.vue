<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <form-list :columns="columns"
               :searchRow="SearchList"
               :api="api"
               :param="param"
               :height="height"
               v-loading="loading"
               ref="list">

      <template #templateType="row">
        {{formatTemplateType(row)}}
      </template>

      <template #myscope="row">
        <el-button @click.stop="editTemplate(row.data)" type="primary">编辑</el-button>
        <el-button @click.stop="delTemplate(row.data)" type="danger">删除</el-button>
        <!--<el-button @click.stop="downloadTemplate(row.data)">下载</el-button>-->
      </template>

      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button @click="addTemplate">新增</el-button>
          </div>
        </div>
      </template>
    </form-list>

    <el-dialog v-loading="dlgLoading" :title="title" :visible.sync="dlgVisible" width="1300px" top="3vh" :before-close="handleClose">
      <el-container>
        <el-main>
          <el-form ref="dlgForm" :model="dlgForm" :rules="dlgRules" :inline="true" size="small">
            <el-col :span="8">
              <el-form-item label="模板名称" prop="templateName">
                <el-input disabled v-model="dlgForm.templateName" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="模板类型" prop="templateType">
                <el-select filterable  class="form-inline-input" size="small" v-model="dlgForm.templateType">
                  <el-option v-for="option in templateTypeOptions" :key="option.code" :label="option.name" :value="option.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="版本" prop="version">
                <el-input v-model="dlgForm.version"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生效日期" prop="effectiveDate">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="dlgForm.effectiveDate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="失效日期" prop="expiryDate">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="dlgForm.expiryDate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="dlgForm.remark"></el-input>
              </el-form-item>
            </el-col>
            <el-form-item label="选择模板" v-if="!dlgForm.id">
              <el-upload
                ref="upload"
                action=""
                :multiple="true"
                :limit="2"
                :auto-upload="false"
                accept=".xlsx"
                :on-change="changeTemplate"
                :file-list="fileList"
              >
                <el-button size="small" type="primary">选择文件</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-main>
        <el-main v-if="dlgForm.id" style="height: 650px;">
          <iframe ref="templateIframe" :src="templateIframe+'/#/expTemplateDetail?templateId='+dlgForm.id" style="height: 100%" width="100%" frameborder="0"></iframe>
        </el-main>
        <el-footer style="text-align: right;height: 40px;padding-top: 10px;">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="success" @click="handleSubmit">确 定</el-button>
        </el-footer>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
  import FormList from '@/components/FormList.vue';
  import LuckyExcel from 'luckyexcel'
  import { luckySetting } from './settings.js'
  export default {
    name: 'TemplateMng',
    components: {
      FormList
    },
    data() {
      return {
        form: {},
        api: require('./Api'),
        param: {},
        loading: false,

        dlgLoading: false,
        title: '添加模板',
        dlgVisible: false,
        fileList: [],
        dlgForm: {},
        dlgRules: {
          templateName: [{ required: true, message: '内容必填', trigger: 'blur' }],
          version: [{ required: true, message: '内容必填', trigger: 'blur' }],
          effectiveDate: [{ required: true, message: '内容必填', trigger: 'blur' }],
          expiryDate: [{ required: true, message: '内容必填', trigger: 'blur' }],
        },
        columns: [
          { title: '序号', type: "index", width: 40 },
          { title: "模板名称", dataIndex: "templateName", width: 200},
          { title: "模板类型",  width: 80, dataIndex: "templateType", slot:"templateType"},
          { title: "版本",  width: 40, dataIndex: "version"},
          { title: "生效日期", width: 50, dataIndex: "effectiveDate"},
          { title: "失效日期", width: 50, dataIndex: "expiryDate"},
          { title: "备注", width: 120, dataIndex: "remark"},
        //  { title: "创建时间", width: 80, dataIndex: "createTime"},
        //  { title: "修改时间", width: 80, dataIndex: "updateTime"},
          {title: "操作", width: 210,key: "action", scopedSlots: { customRender: "action" }},
        ],
        SearchList: [
          {
            label: "模板名称",
            key: "templateName", val: "", type: "input",
          },
        ],
        templateTypeOptions: [],
        templateIframe: location.origin
      };

    },
    mounted() {
      this.api.selectTemplateTypes().then(res=>{
        this.templateTypeOptions = res.data;
      })
    },
    watch: {

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
            that.$message.error('加载文件失败')
            return;
          }
          that.dlgForm.jsonData = JSON.stringify(exportJson.sheets);
        });
      },
      formatTemplateType(row){
        if(row.data.templateType=='1'){
          return '一般企业所得税'
        }else if (row.data.templateType=='2'){
          return '一般纳税人增值税'
        }else if (row.data.templateType=='3'){
          return '小规模纳税人增值税'
        }else if (row.data.templateType=='4'){
          return '总机构企业所得税'
        }else if (row.data.templateType=='5'){
          return '分支机构企业所得税'
        }
      },
      handleOk() {
        this.$refs.list.reload()
      },
      addTemplate(){
        this.dlgForm = {}
        if(this.$refs.upload){
          this.$refs.upload.clearFiles()
        }
        this.title = '添加模板'
        this.dlgVisible = true;
      },
      changeTemplate(param){
        let suffixArr = param.name.split("."), name = suffixArr[0];
        this.dlgForm.templateName = name;
        this.dlgForm.file = param.raw
        this.fileList = [this.dlgForm.file]
        this.uploadExcel(param.raw);
      },
      handleClose(){
        this.dlgVisible = false;
      },
      handleSubmit(){
        // 手动调用上传，这里会调用我们自己定义的
      //  this.$refs.upload.submit()
        let that = this;
        that.$refs.dlgForm.validate((valid) => {
          if (valid) {
            if(!that.dlgForm.id && !that.dlgForm.file){
              that.$message.error('请选择模板文件')
              return
            }else {
              const iframe = this.$refs.templateIframe;
              if(iframe){
                const excelJsonData = iframe.contentWindow.getExcelJsonData();
                that.dlgForm.jsonData = JSON.stringify(excelJsonData);
              }
            }
            this.dlgLoading = true;
            // 新建form表单
            const fd = new FormData()
            // 将data转换为form-data
            Object.keys(this.dlgForm).forEach(key => {
              fd.append(key, this.dlgForm[key])
            })
            // 调用api提交
            this.api.saveTemplate(fd).then(res => {
              if(res.code=='0'){
                that.$message({
                  type: 'success',
                  message: '保存成功!'
                });
                that.handleOk();
                that.dlgLoading = false;
                that.dlgVisible = false;
              }
            })
          }
        });
      },
      editTemplate(row){
        this.dlgForm = {
          id: row.id,
          templateName: row.templateName,
          templateType: row.templateType+'',
          version: row.version,
          effectiveDate: row.effectiveDate,
          expiryDate: row.expiryDate,
          remark: row.remark
        }
        this.title = '编辑配置'
        this.dlgVisible = true;
      },
      delTemplate(row){
        let that = this;
        this.$confirm('确认删除吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.api.delTemplate(row.id).then(res =>{
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
      downloadTemplate(row){
        this.api.downloadTemplate({reqData:{id:row.id}, fileName: row.templateName+'.xlsx'}).then(res =>{
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  /deep/ .el-form-item__label{
    width: 100px;
  }
  .el-col-12{
    /deep/ .el-form-item__content{
      width: 220px;
    }
  }
  .el-col-24{
    .el-form-item{
      width: 100%;
    }
    /deep/ .el-form-item__content{
      width: calc(50% + 220px);
    }
  }
  /deep/ .el-upload-list{
    width: 500px;
  }
  .el-dialog__header{

  }
  /deep/ .el-dialog__body{
    padding: 10px 20px;
  }
</style>
