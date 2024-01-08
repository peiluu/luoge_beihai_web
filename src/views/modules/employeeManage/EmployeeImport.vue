<template>
    <div class="custom-content">
        <div class="back-button">
            <el-button type="primary" icon="el-icon-back" size="small" @click="handleBack">返回</el-button>
        </div>
        <div class="mid-margin-40">
            <el-steps :active="step">
                <el-step title="上传"></el-step>
                <el-step title="导入"></el-step>
            </el-steps>
        </div>
        <el-divider></el-divider>
        <div v-if="step===1" class="mid-margin-35 upload-template mb10">
            <span>上传人员清单</span>
            <span class="right"><el-button type="text" @click="downloadTemplate">下载模板</el-button></span>
            <el-upload
                    action=""
                    drag
                    accept=".xlsx,.xls"
                    :limit="1"
                    :http-request="ajaxUpload">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </div>
        <template v-else>
            <div class="mid-margin-35 upload-info mb10">
                <span>有效人员 {{successCount}}人 ,无效人员 {{failCount}}人</span>
                <el-button type="text" @click="downloadFailed">下载</el-button>
                <span style="margin-left: 0;">清单修改</span>
            </div>
            <el-table
                    stripe
                    border
                    :data="tableData"
                    :height="height"
                    v-loading="importing"
                    :header-cell-class-name="'main-table-header-cell'"
                    style="margin: 10px 2% ;width: 96%;">
                <el-table-column prop="yzjg" label="验证" align="left" min-width="80">
                    <template slot-scope="scope">
                        <slot name="myscope" :data="scope.row">
                            <i v-if="scope.row.yzjg==1" style="color: #FF0000;" class="el-icon-error"></i><i v-else style="color:#3ABE19;" class="el-icon-success"></i>{{scope.row.yzjg==1?"失败":"成功"}}
                        </slot>
                    </template>
                </el-table-column>
                <el-table-column label="验证信息" prop="yzxx" align="left" min-width="200">
                    <template slot-scope="scope">
                        <slot name="myscope" :data="scope.row"><span style="color: #FF0000;" v-if="scope.row.yzjg==1">{{scope.row.yzxx}}</span></slot>
                    </template>
                </el-table-column>
                <el-table-column label="纳税人识别号" prop="nsrsbh" align="left" min-width="180"></el-table-column>
                <!--<el-table-column label="是否内部员工" prop="hzfygbz" align="left" min-width="120"></el-table-column>
                <el-table-column label="合作方企业名称" prop="hzfmc" align="left" min-width="180"></el-table-column>-->
                <el-table-column label="姓名" prop="xm" align="left" min-width="100"></el-table-column>
                <el-table-column label="证件类型" prop="zzlx" align="left" min-width="100"></el-table-column>
                <el-table-column label="证件号码" prop="zzhm" align="left" width="180"></el-table-column>
                <el-table-column label="国籍" prop="gj" align="left" min-width="80"></el-table-column>
                <el-table-column label="性别" prop="xb" align="left" min-width="60"></el-table-column>
                <el-table-column label="出生日期" prop="csny" align="center" min-width="120"></el-table-column>
                <el-table-column label="手机号" prop="lxdh" align="left" min-width="140"></el-table-column>
                <el-table-column label="任职受雇从业类型" prop="sfgy" align="left" min-width="150"></el-table-column>
                <el-table-column label="任职受雇从业日期" prop="rzsgrq" align="center" min-width="150"></el-table-column>
            </el-table>
            <div class="footer-button">
                <el-button type="default" @click="handleCancel">上一步</el-button>
                <el-button type="primary" @click="handleConfirm" :disabled="failCount > 0 || importing">导入</el-button>
            </div>
        </template>
  </div>
</template>
<script>
export default {
    name: "EmployeeImport",
    components: {
    },
    data() {
      return {
          business: require('@/utils/business'),
          loading: false,
          step: 1,
          tableData: [],
          successCount: "",
          failCount:"",
          importing: false,
      }
    },
    computed: {
        request_host() {
            return this.$store.state.app.host
        },
        height(){
            return window.innerHeight-340;
        },
    },
    methods: {
        handleBack(){
            this.$router.push({path: "/employeeManage-EmployeeList"})
        },
        //ajax上传
        ajaxUpload(content){
            let that = this;
            let formData = new FormData();
            formData.append("file", content.file);
            that.step = 2;
            that.importing = true;
            that.business.customPost(
                that.request_host+"/Employees/uploadExcel",
                {'Content-Type': 'multipart/form-data'},
                formData,
                res => {
                    if(res.code==0){
                        that.$message({
                            message: '文件上传成功',
                            type: 'success'
                        });
                        that.business.customPost(
                            that.request_host+"/Employees/selectUploadPage",
                            { 'Content-Type': 'application/json; charset=utf-8'},
                            {},
                            data => {
                            that.importing = false;
                            that.tableData = data.data;
                            that.successCount = data.successCount;
                            that.failCount = data.failCount;
                        })
                    }else {
                        that.$message.error('文件上传失败');
                    }
                }
            );
        },
        //下载模板
        downloadTemplate(){
            window.open(this.request_host+"/Employees/downLoadTemplate", "_target");
        },
        //下载导入失败数据
        downloadFailed(){
            window.open(this.request_host+"/Employees/downLoadExcel", "_target");
        },
        handleConfirm(){
            let that = this;
            that.importing = true;
            that.business.customPost(
                that.request_host+"/Employees/confirmSave",
                {'Content-Type': 'application/json; charset=utf-8'},
                {},
                data => {
                    that.$message({
                        message: '导入成功',
                        type: 'success'
                    });
                    that.importing = false;
                    this.$router.push({path: "/employeeManage-EmployeeList"})
                }
            )
        },
        handleCancel(){
            let that = this;
            that.business.customPost(
                that.request_host+"/Employees/cancelSave",
                {'Content-Type': 'application/json; charset=utf-8'},
                {},
                data => {
                    that.tableData = [];
                    that.successCount = 0;
                    that.failCount = 0;
                    that.step = 1;
                }
            )
        },
    },
  };
</script>

<style lang="scss" scoped>
    .mid-margin-40{
        margin: 20px 40% 0 40%;
    }
    .mid-margin-35{
        margin: 20px 35% 10px 35%;
    }
    .upload-template{
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        .right{
            float: right;
        }
    }
    .upload-info{
        font-size: 14px;
        text-align: center;
    }
    ::v-deep .el-step__icon.is-icon {
        width: 24px;
    }
    ::v-deep .el-upload {
        width: 100% ;
    }
    ::v-deep .el-upload .el-upload-dragger{
        width: 100%;
    }
    .footer-button{
        padding: 20px 2% 0 0;
        float: right;
    }
    .main{
        overflow: scroll;
    }
</style>
