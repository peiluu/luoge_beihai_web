<template>
    <div style="padding: 20px;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-if="form.rydq=='境内' || opt=='add'" label="境内人员" name="inner" key="inner" :lazy="true">
                <EmployeeInnerForm :zdlsb="zdlsb" :qymc="obligorDetail.qymc" :partners="partners" :opt="opt" @handleBack="handleBack" @handleSubmit="handleSubmit" :form="form"></EmployeeInnerForm>
            </el-tab-pane>
            <el-tab-pane v-if="form.rydq=='境外' || opt=='add'" label="境外人员" name="outer" key="outer" :lazy="true">
                <EmployeeOuterForm :zdlsb="zdlsb" :qymc="obligorDetail.qymc" :partners="partners" :opt="opt" @handleBack="handleBack" @handleSubmit="handleSubmit" :form="form"></EmployeeOuterForm>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import EmployeeInnerForm from './EmployeeInnerForm.vue'
    import EmployeeOuterForm from './EmployeeOuterForm.vue'
export default {
    name: "EmployeeEdit",
    components: {
        EmployeeInnerForm,
        EmployeeOuterForm
    },
    data() {
      return {
          business: require('@/utils/business'),
          api:require('./EmployeeManageApi'),
          form:{
              nsrzt: "正常",
              hzfygbz: "否",
              rydq: "",
              sfzdw: '是',
              zzlx: '居民身份证',
              gj:'中国',
              jcjzd: [],
              wjrlxdz: [],
              hjszd: [],
          },
          activeName: "inner",
          obligorDetail:{},
          partners: [],
      };
    },
    computed: {
        zdlsb() {
            return this.$route.query.zdlsb;
        },
        rowid() {
            return this.$route.query.rowid;
        },
        kjywrid(){
            return this.$route.query.kjywrid;
        },
        opt(){
            return this.$route.query.opt;
        },
        rydq(){
            return this.$route.query.rydq
        },
        request_host() {
            return this.$store.state.app.host
        },
    },
    activated(){
        if(this.rowid){
            this.fetchDetail(this.rowid)
        }
        if(this.kjywrid){
            this.fetchObligorDetail(this.kjywrid);
        }
        this.initTab(this.rydq);
        this.initPartners();
    },
    mounted(){
        if(this.rowid){
            this.fetchDetail(this.rowid)
        }
        if(this.kjywrid){
            this.fetchObligorDetail(this.kjywrid);
        }
        this.initTab(this.rydq);
        this.initPartners();
    },
    methods: {
        initPartners() {
            let that = this;
            this.business.customPost(that.request_host+"/Partner/listForSelect",
                {'Content-Type': 'application/text; charset=utf-8'},
                {},
                res => {
                    if(res.code==0){
                        that.partners = res.data
                    }
                }
            );
        },
        initTab(rydq){
            this.form.rydq = (rydq == 1 || !rydq) ? '境内' : '境外';
            this.activeName  = (rydq == 1 || !rydq) ? 'inner' : 'outer';
        },
        handleClick(tab, event) {
            if(tab.name=='inner'){
                if(this.form.rydq != "境内"){
                    this.form = {nsrzt: "正常",hzfygbz: "否",rydq: "",sfzdw: '是',zzlx: '居民身份证',gj:'中国',jcjzd: [], wjrlxdz: [],hjszd: []};
                }
                this.form.rydq = "境内"
            }
            else {
                if(this.form.rydq != "境外"){
                    this.form = {nsrzt: "正常",hzfygbz: "否",rydq: "",sfzdw: '是',zzlx: '',gj:'',jcjzd: [], wjrlxdz: [],hjszd: []};
                }
                this.form.rydq = "境外";
            }
        },
        fetchObligorDetail(id){
            let that = this;
            this.business.customPost(that.request_host+"/Taxpayer/detail",
                {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                JSON.stringify({"id": id}),
                res => {
                    if(res.code==0){
                        that.obligorDetail = res.data
                    }
                }
            );
        },
        fetchDetail(id){
            let that = this;
            this.business.customPost(that.request_host+"/Employees/detail",
                {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                JSON.stringify({"id": id}),
                res => {
                    if(res.code==0){
                        that.form = res.data;
                        if(res.data.sssx){
                            that.form.sssx = res.data.sssx.split(',');
                        }
                        that.form.jcjzd = [];
                        that.form.wjrlxdz = [];
                        that.form.hjszd = [];
                        //处理地址
                        if (res.data.lxdzSheng) that.form.jcjzd.push(res.data.lxdzSheng);
                        if (res.data.lxdzShi) that.form.jcjzd.push(res.data.lxdzShi);
                        if (res.data.lxdzQx) that.form.jcjzd.push(res.data.lxdzQx);
                        if (res.data.lxdzJd) that.form.jcjzd.push(res.data.lxdzJd);

                        if (res.data.wjrlxdzSheng) that.form.wjrlxdz.push(res.data.wjrlxdzSheng);
                        if (res.data.wjrlxdzShi) that.form.wjrlxdz.push(res.data.wjrlxdzShi);
                        if (res.data.wjrlxdzQx) that.form.wjrlxdz.push(res.data.wjrlxdzQx);
                        if (res.data.wjrlxdzJd) that.form.wjrlxdz.push(res.data.wjrlxdzJd);

                        if (res.data.hjszdSheng) that.form.hjszd.push(res.data.hjszdSheng);
                        if (res.data.hjszdShi) that.form.hjszd.push(res.data.hjszdShi);
                        if (res.data.hjszdQx) that.form.hjszd.push(res.data.hjszdQx);
                        if (res.data.hjszdJd) that.form.hjszd.push(res.data.hjszdJd);
                    }
                }
            );
        },
        handleSubmit(data){
            let that = this;
            data.nsrsbh = that.obligorDetail.nsrsbm;
            data.kjywrid = that.kjywrid;
            delete data.updateTime;
            delete data.createTime;
            that.api.saveEmployee(data, result => {
                let res = result.data;
                if(res.code==0){
                    if(res.data.code==1){
                        that.$message.error(res.data.msg);
                    }else {
                        that.$message({message: res.data.msg ,type: 'success'});
                        that.handleBack();
                    }
                }else {
                    that.$message.error(res.data.msg);
                }
            });
        },
        handleBack(){
            this.$router.push({path: "/employeeManage/employeeMaintain",query:{rowid: this.kjywrid}})
        }
    },
    watch:{
        form(form){
            if(this.opt!='add'){
                for(var field in form){
                    if(field=='grgbze'){
                        this.ceil(form, field, 2);
                    }
                    if(field=='grgbbl'){
                        this.ceil(form, field, 4);
                    }
                }
            }

        },
    },
  };
</script>
<style lang="scss" scoped>
    ::v-deep .el-form{
        width: 100%;
        .el-form-item{
            width: calc(33.3% - 20px);
            .el-form-item__content{
                width: calc(100% - 180px);
            }
        }
    }
    .main{
        overflow: scroll;
    }
    ::v-deep .el-divider--horizontal{
        margin: 12px 0;
    }

    ::v-deep .custom-content {
        background-color: #FFFFFF;
        border-radius: 8px;
        margin: 15px 0;
        overflow: scroll;
        height: calc(100vh - 180px);
        padding-top:10px;
        .main-table-header-cell {
            background-color: #F5F5F5 !important;
            color: #343435;
        }
    }

    ::v-deep .el-tabs__item{
        padding-left: 20px !important;
    }
</style>
