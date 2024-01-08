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
            <span>{{incomeTypes[incomeType-1]}}导入</span>
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
                    ref="table"
                    stripe
                    border
                    :data="tableData"
                    v-loading="importing"
                    :header-cell-class-name="'main-table-header-cell'"
                    :height="height"
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
                <el-table-column prop="nsrsbh" label="纳税人识别号" align="left" min-width="180"></el-table-column>
                <el-table-column prop="xm" label="姓名" align="left" min-width="120"></el-table-column>
                <el-table-column prop="zzlx" label="证件类型" align="left" min-width="180"></el-table-column>
                <el-table-column prop="zzhm" label="证件号码" align="left" min-width="180"></el-table-column>
                <template v-for="(column) in columns">
                    <el-table-column :key="column.prop" :prop="column.prop" :label="column.label" :align="column.align" :min-width="column.width"></el-table-column>
                </template>
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
    name: "IncomeImport",
    components: {
    },
    data() {
      return {
          business: require('@/utils/business'),
          loading: false,
          step: 1,
          columns: [],
          tableData: [],
          successCount: "",
          failCount:"",
          incomeTypes: ["正常工资薪金","全年一次性奖金收入","解除劳动合同一次性补偿金","个人股权激励收入","劳务报酬(一般劳务、其他非连续劳务)","劳务报酬(其他连续劳务)"],
          importing: false,
      }
    },
    computed: {
        request_host() {
            return this.$store.state.app.host
        },
        incomeType() {
            return this.$route.query.incomeType;
        },
        taxPeriod(){
            return this.$route.query.taxPeriod;
        },
        height(){
            return window.innerHeight-340;
        },
    },
    mounted(){
        this.initColumns();
    },
    activated(){
        this.initColumns();
    },
    methods: {
        initColumns(){
            if(this.incomeType == 1){
                this.columns = [
                    {prop: 'sre', label: '本期收入', align:'right', width:'100'},
                    {prop: 'mssd', label: '本期免税收入', align:'right', width:'120'},
                    {prop: 'jbylaobxf', label: '基本养老保险费', align:'right', width:'140'},
                    {prop: 'jbylbxf', label: '基本医疗保险费', align:'right', width:'140'},
                    {prop: 'sybxf', label: '失业保险费', align:'right', width:'100'},
                    {prop: 'zfgjj', label: '住房公积金', align:'right', width:'100'},
                    {prop: 'nj', label: '企业(职业)年金', align:'right', width:'120'},
                    {prop: 'qt', label: '其他', align:'right', width:'80'},
                    {prop: 'jmse', label: '减免税额', align:'right', width:'100'},
                    {prop: 'bz', label: '备注', align:'left', width:'150'},
                ];
            }else if(this.incomeType == 2){
                this.columns = [
                    {prop: 'sre', label: '全年一次性奖金', align:'right', width:'140'},
                    {prop: 'mssd', label: '免税收入', align:'right', width:'120'},
                    {prop: 'qt', label: '其他', align:'right', width:'120'},
                    {prop: 'jmse', label: '减免税额', align:'right', width:'120'},
                    {prop: 'bz', label: '备注', align:'left', width:'120'},
                ]
            }else if(this.incomeType == 3){
                this.columns = [
                    {prop: 'sre', label: '一次性补偿收入', align:'right', width:'140'},
                    {prop: 'mssd', label: '免税收入', align:'right', width:'120'},
                    {prop: 'qt', label: '其他', align:'right', width:'120'},
                    {prop: 'jmse', label: '减免税额', align:'right', width:'120'},
                    {prop: 'bz', label: '备注', align:'left', width:'120'},
                ]
            }else if(this.incomeType == 4){
                this.columns = [
                    {prop: 'sre', label: '本月股权激励收入', align:'right', width:'160'},
                    {prop: 'ljsre', label: '本年累计股权激励收入(不含本月)', align:'right', width:'300'},
                    {prop: 'mssd', label: '本年累计免税收入', align:'right', width:'160'},
                    {prop: 'qt', label: '本年累计其他', align:'right', width:'120'},
                    {prop: 'jmse', label: '本年累计减免税额', align:'right', width:'160'},
                    {prop: 'ykjse', label: '本年累计已缴税额', align:'right', width:'160'},
                    {prop: 'bz', label: '备注', align:'left', width:'120'},
                ]
            }else if(this.incomeType == 5 || this.incomeType == 6){
                this.columns = [
                    {prop: 'sdxm', label: '所得项目', align:'left', width:'200'},
                    {prop: 'sre', label: '本期收入', align:'right', width:'100'},
                    {prop: 'mssd', label: '本期免税收入', align:'right', width:'120'},
                    {prop: 'qt', label: '其他', align:'right', width:'120'},
                    {prop: 'yxkcsf', label: '允许扣除的税费', align:'right', width:'140'},
                    {prop: 'jmse', label: '减免税额', align:'right', width:'120'},
                    {prop: 'bz', label: '备注', align:'left', width:'120'},
                ]
            }
        },
        handleBack(){
            this.$router.push({path: "/caltaxManage-CaltaxList"})
        },
        //ajax上传
        ajaxUpload(content){
            let that = this;
            let formData = new FormData();
            formData.append("file", content.file);
            formData.append("gztype", that.incomeType);
            formData.append("skssq", that.taxPeriod);
            that.step = 2;
            that.importing = true;
            that.business.customPost(
                that.request_host+"/ComprehensiveTax/uploadExcel",
                {'Content-Type': 'multipart/form-data'},
                formData,
                res => {
                    if(res.code==0){
                        that.$message({
                            message: '文件上传成功',
                            type: 'success'
                        });
                        that.business.customPost(
                            that.request_host+"/ComprehensiveTax/selectUploadPage",
                            {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                            JSON.stringify({"gztype": that.incomeType, "skssq" : that.taxPeriod}),
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
            window.open(this.request_host+"/ComprehensiveTax/downLoadTemplate?gztype="+this.incomeType, "_target");
        },
        //下载导入失败数据
        downloadFailed(){
            window.open(this.request_host+"/ComprehensiveTax/downLoadExcel?gztype="+this.incomeType+"&skssq="+this.taxPeriod, "_target");
        },
        handleConfirm(){
            let that = this;
            that.importing = true;
            that.business.customPost(
                that.request_host+"/ComprehensiveTax/confirmSave",
                {'Content-Type': 'application/json; charset=utf-8'},
                {"gztype": that.incomeType, "skssq" : that.taxPeriod},
                data => {
                    that.$message({
                        message: '导入成功',
                        type: 'success'
                    });
                    that.importing = false;
                    that.$router.push({path: "/caltaxManage-CaltaxList"})
                }
            )
        },
        handleCancel(){
            let that = this;
            that.business.customPost(
                that.request_host+"/ComprehensiveTax/cancelSave",
                {'Content-Type': 'application/json; charset=utf-8'},
                {"gztype": that.incomeType, "skssq" : that.taxPeriod},
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
