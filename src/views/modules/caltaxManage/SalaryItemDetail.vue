<template>
    <div class="custom-content">
        <div class="mid-margin-40 custom-content-title" style="width: 98%;">
            <div class="custom-content-title-text">{{obligorDetail.qymc}}</div>
            <div class="custom-content-title-date">{{taxPeriod.substring(0,4)+'年'+taxPeriod.substring(4,6)+'月'}}</div>
        </div>
        <el-divider></el-divider>
        <el-form ref="form" :inline="true" :model="form" :rules="rules" label-width="180px" style="margin-bottom: 0;">
            <BasicInfo :sdqjq="sdqjq" :sdqjz="sdqjz" :type="type" :opt="opt" :form="form" :rules="rules" :kjywrid="rowid"></BasicInfo>
            <Salary :opt="opt" v-if="type==1" :form="form" :rules="rules" ref="salary"></Salary>
            <Bonus :opt="opt" v-if="type==2" :form="form" :rules="rules"></Bonus>
            <Compensation :opt="opt" v-if="type==3" :form="form" :rules="rules"></Compensation>
            <Stock :sdqjq="sdqjq" :sdqjz="sdqjz" :opt="opt" v-if="type==4" :form="form" :rules="rules"></Stock>
            <Labour :opt="opt" v-if="type==5 || type==6" :form="form" :rules="rules" :type="type"></Labour>
            <CaltaxResult v-if="opt!='add'" :form="form" :rules="rules"></CaltaxResult>
            <template>
                <el-divider></el-divider>
                <el-form-item class="form-button">
                    <el-button v-if="opt!='detail'" type="primary" @click="handleSubmit">保存</el-button>
                    <el-button type="primary" icon="el-icon-back" @click="handleBack">返回</el-button>
                </el-form-item>
            </template>
        </el-form>
    </div>
</template>
<script>
    import BasicInfo from "./components/BasicInfo";
    import CaltaxResult from "./components/CaltaxResult";
    import Salary from "./components/Salary";
    import Bonus from "./components/Bonus";
    import Compensation from "./components/Compensation";
    import Stock from "./components/Stock";
    import Labour from "./components/Labour";

    export default {
        name: "SalaryItemDetail",
        components: {
            BasicInfo,
            CaltaxResult,
            Salary,
            Bonus,
            Compensation,
            Stock,
            Labour,
        },
        data() {
            return {
                business: require('@/utils/business'),
                obligorDetail: {},
                taxPeriod: "",
                sdqjq: "",
                sdqjz: "",
                form:{
                },
                rules: {
                    xm: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' },
                    ],
                    zzhm: [
                        { required: true, message: '证件号码不能为空', trigger: 'blur' },
                    ],
                    sre: [
                        { required: true, message: '收入不能为空', trigger: 'blur' },
                    ],
                    sdxm: [
                        { required: true, message: '所得项目不能为空', trigger: 'blur' },
                    ]
                },
            };
        },
        computed: {
            request_host() {
                return this.$store.state.app.host
            },
            rowid() {
                return this.$route.query.rowid;
            },
            type(){
                return this.$route.query.type
            },
            opt(){
                return this.$route.query.opt
            },
            id(){
                return this.$route.query.id
            }
        },
        activated(){
            if(!this.$store.state.user.taxPeriod){
                this.business.lastMonth(data => {
                    this.taxPeriod = data.data.sy;
                    this.$store.state.user.taxPeriod = this.taxPeriod
                    this.business.getPeriodRange(this.taxPeriod,  data => {
                        this.sdqjq = data.data.lastMonthBeginDate;
                        this.sdqjz = data.data.lastMonthEndDate;
                    });
                })
            }else {
                this.taxPeriod = this.$store.state.user.taxPeriod;
                this.business.getPeriodRange(this.taxPeriod,  data => {
                    this.sdqjq = data.data.lastMonthBeginDate;
                    this.sdqjz = data.data.lastMonthEndDate;
                });
            }
            if(this.rowid){
                this.fetchObligorDetail(this.rowid)
            }
            if(this.id){
                this.fetchSalaryDetail(this.id);
            }
        },
        mounted(){
            if(!this.$store.state.user.taxPeriod){
                this.business.lastMonth(data => {
                    this.taxPeriod = data.data.sy;
                    this.$store.state.user.taxPeriod = this.taxPeriod
                    this.business.getPeriodRange(this.taxPeriod,  data => {
                        this.sdqjq = data.data.lastMonthBeginDate;
                        this.sdqjz = data.data.lastMonthEndDate;
                    });
                })
            }else {
                this.taxPeriod = this.$store.state.user.taxPeriod;
                this.business.getPeriodRange(this.taxPeriod,  data => {
                    this.sdqjq = data.data.lastMonthBeginDate;
                    this.sdqjz = data.data.lastMonthEndDate;
                });
            }
            if(this.rowid){
                this.fetchObligorDetail(this.rowid)
            }
            if(this.id){
                this.fetchSalaryDetail(this.id);
            }
            if(this.type==1) {
                this.form = {jcfy: '5000.00'};
            }
        },
        watch:{
            form(form){
                //修改和详情
                if(this.opt!='add'){
                    for(var field in form){
                        if(!isNaN(form[field]) && field!='zzhm'&& field!='ryid'&& field!='createTime'&&field!='updateTime'&&field!='sszt'&&field!='zhsdId'&&field!='id'){
                            this.ceil(form, field, 2);
                        }
                        if(field=='sre'){
                            this.blurDecrypt(form, 'sre', 'sreReal')
                        }
                    }
                }
            },
        },
        methods: {
            fetchObligorDetail(kjywrid){
                let that = this;
                that.business.customPost(that.request_host+"/Taxpayer/detail",
                    {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                    JSON.stringify({"id": kjywrid}),
                    res => {
                        if(res.code==0){
                            that.obligorDetail = res.data
                        }
                    }
                );
            },
            fetchSalaryDetail(id){
                let that = this;
                that.business.customPost(that.request_host+"/ComprehensiveTax/detail",
                    {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                    JSON.stringify({"id": id}),
                    res => {
                        if(res.code==0){
                            that.form = res.data;
                        }
                    }
                );
            },
            handleSubmit(){
                let that = this;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        that.form.gztype = that.type;
                        that.form.nsrsbh = that.obligorDetail.nsrsbm;
                        that.form.kjywrid = that.rowid;
                        that.form.sre = that.form.sreReal;
                        let url;
                        if(!that.form.id){
                            url = that.request_host+"/ComprehensiveTax/add/"+that.$store.state.user.taxPeriod;
                        }else {
                            url = that.request_host+"/ComprehensiveTax/update";
                        }
                        that.business.customPost(url,
                            {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                            JSON.stringify(that.form),
                            res => {
                                if(res.code==0){
                                    if(res.data.code==1){
                                        that.$message.error(res.data.msg);
                                    }else {
                                        that.$message({
                                            message: res.data.msg,
                                            type: 'success',
                                            onClose: function(){
                                                that.$router.push({path: "/caltaxManage/SalaryItemInput", query:{rowid: that.rowid, type:that.type}})
                                            }
                                        });
                                    }
                                }else {
                                    that.$message.error(res.data.msg);
                                }
                                that.loading = false;
                            }
                        );
                    }
                })
            },
            handleBack(){
                this.$router.push({path: "/caltaxManage/SalaryItemInput", query:{rowid: this.rowid, type:this.type}})
            },
        },
    };
</script>
<style lang="scss" scoped>
    .el-form{
        width: 100%;
        margin-bottom: 10px;
        ::v-deep .el-form-item{
            width: calc(33% - 20px);
            .el-form-item__content{
                width: calc(100% - 180px);
            }
        }
    }
    .main{
        overflow: scroll;
    }
    ::v-deep .form-inline-input{
        width: 100%;
    }
    ::v-deep .el-date-editor{
        width: 100%;
    }
</style>
