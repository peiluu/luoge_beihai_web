<template>
    <div class="main-content">
        <form-list
                :columns="columns"
                :searchRow="searchList"
                :api="api"
                :title="title"
                :param="param"
                :height="height"
                v-loading="loading"
                :backpath="backpath"
                ref="list">
            <template #topTool>
                <div class="toolbar mb10">
                    <div class="toolbar-left">
                        <div class="custom-content-title-text">{{obligorDetail.qymc}}</div>
                        <div class="custom-content-title-date">{{taxPeriod.substring(0,4)+'年'+taxPeriod.substring(4,6)+'月'}}</div>
                    </div>
                    <div class="toolbar-right">
                       <!-- <el-button plain type="primary" @click="handleBatchCaltax">一键算税</el-button>
                        <el-button plain type="primary" @click="handleBatchConfirm">算税确认</el-button>
                        <el-button plain type="danger" @click="handleBatchCancel">取消确认</el-button>-->
                        <el-button type="primary" @click="handleAdd">添加</el-button>
                        <!--<el-button type="primary" @click="handleImport">导入</el-button>
                        <el-button type="primary" @click="handleExport">导出</el-button>-->
                    </div>
                </div>
            </template>
            <template #myscope="row">
                <el-button plain type="primary" @click="handleDetail(row.data)">详情</el-button>
                <el-button plain  :disabled="row.data.sszt==1 || row.data.sszt>=4" type="primary" @click="handleEdit(row.data)">修改</el-button>
                <el-button plain v-if="row.data.sszt==0 || row.data.sszt==1 || row.data.sszt==2 || row.data.sszt==3" type="danger" @click="handleRemove(row.data)">删除</el-button>
               <!-- <el-button plain type="primary" @click="handleCaltax(row.data)">算税</el-button>
                <el-button plain  v-if="row.data.sszt==2" type="primary" @click="handleConfirmOrCancel(row.data,4)">算税确认</el-button>
                <el-button plain  v-if="row.data.sszt==4" type="danger" @click="handleConfirmOrCancel(row.data,2)">取消确认</el-button>-->
            </template>
            <template #xm="row">
                {{decryptXm(row.data.xm)}}
            </template>
            <template #zzhm="row">
                {{decryptZzhm(row.data.zzhm)}}
            </template>
            <!--<template #hzfygbz="row">
                {{row.data.hzfygbz=="否" ? "合作方员工" : "内部员工"}}
            </template>-->
            <template #sszt="row">
                <span :type="formatCalState(row.data.sszt).clazz">
                     <a style="color: #FF0000;" v-if="row.data.sszt==3" href="javascript:void(0);" @click="showErrorMsg(row.data)">
                        {{formatCalState(row.data.sszt).txt}}
                    </a>
                    <template v-else>
                        {{formatCalState(row.data.sszt).txt}}
                    </template>
                </span>
            </template>
        </form-list>
    </div>
</template>
<script>
import FormList from '@/components/FormList.vue';
export default {
    name: "SalaryItemInput",
    components: {
        FormList
    },
    data() {
        return {
            api:require('./SalaryItemInputApi'),
            business: require('@/utils/business'),
            param: {
                pageSize: 100,
                pageNo: 1,
            },
            loading: false,
            obligorDetail:{},
            taxPeriod: "",
            title: "综合所得录入",
            collapsed: false,
            searchList: [
                /*{key: "hzfygbz",val: "",type: "select",
                    options: [
                        {value:"",label:"全部"},
                        {value:"否",label:"合作方员工"},
                        {value:"是",label:"内部员工"},
                    ],
                    label: "范围",
                    placeholder: "",
                },*/
                { key: "hzfmc",val: "",type: "input", label: "合作方企业",placeholder: "合作方企业"},
        { key: "xm",val: "",type: "input", label: "员工姓名",placeholder: "员工姓名"},
    ],
        };
    },
    methods: {
        handleOk(){
            this.$refs.list.reload()
        },
        fetchObligorDetail(id){
            let that = this;
            that.business.customPost(that.request_host+"/Taxpayer/detail",
                {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                JSON.stringify({"id": id}),
                res => {
                    if(res.code==0){
                        that.obligorDetail = res.data
                    }
                }
            );
        },
        //一键算税
        handleBatchCaltax(){
            const that = this;
            let selections = that.$refs.list.getSelections();
            let ryids = [];
            if(selections.length > 0){
                this.$confirm(`您确定要一键算税吗？`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.loading = true;
                    selections.forEach(item => {
                        ryids.push(item.ryid);
                    });
                    that.api.batchCaltax({ryids: ryids, kjywrid: that.kjywrid, gztype: that.type},result => {
                        let res = result.data;
                        if(res.code==0){
                            if(res.data.code==1){
                                that.$message.error(res.data.msg);
                            }else {
                                that.$message({message: res.data.msg,type: 'success'});
                                that.handleOk();
                            }
                        }else {
                            that.$message.error(res.data.msg);
                        }
                        that.loading = false;
                    });
                });
            }else {
                that.$message.info('请选择数据');
            }
        },
        //算税确认
        handleBatchConfirm(){
            const that = this;
            let selections = that.$refs.list.getSelections();
            let ryids = [];
            if(selections.length > 0){
                this.$confirm(`您确定要算税确认吗？`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.loading = true;
                    selections.forEach(item => {
                        ryids.push(item.ryid);
                    });
                    that.api.batchConfirm({ryids: ryids, kjywrid: that.kjywrid, gztype: that.type}, result => {
                        let res = result.data;
                        if(res.code==0){
                            if(res.data.code==1){
                                that.$message.error(res.data.msg);
                            }else {
                                that.$message({message: res.data.msg,type: 'success'});
                                that.handleOk();
                            }
                        }else {
                            that.$message.error(res.data.msg);
                        }
                        that.loading = false;
                    });
                });
            }else {
                that.$message.info('请选择数据');
            }
        },
        //取消确认
        handleBatchCancel(){
            const that = this;
            let selections = that.$refs.list.getSelections();
            let ryids = [];
            if(selections.length > 0){
                this.$confirm(`您确定要取消确认吗？`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.loading = true;
                    selections.forEach(item => {
                        ryids.push(item.ryid);
                    });
                    that.api.batchCancel({ryids: ryids, kjywrid: that.kjywrid, gztype: that.type}, result => {
                        let res = result.data;
                        if(res.code==0){
                            if(res.data.code==1){
                                that.$message.error(res.data.msg);
                            }else {
                                that.$message({message: res.data.msg,type: 'success'});
                                that.handleOk();
                            }
                        }else {
                            that.$message.error(res.data.msg);
                        }
                        that.loading = false;
                    });
                });
            }else {
                that.$message.info('请选择数据');
            }
        },
        //添加
        handleAdd(){
            this.$router.push({path: "/caltaxManage/salaryItemDetail", query:{opt:"add",rowid: this.kjywrid, type:this.type}})
        },
        //导入
        handleImport(){
            this.$router.push({path: "/caltaxManage/IncomeImport",query:{incomeType:this.type}})
        },
        //导出
        handleExport(){
            const that = this;
            let selections = that.$refs.list.getSelections();
            let ids = [];
            if(selections.length > 0){
                that.loading = true;
                selections.forEach(item => {
                    ids.push(item.id);
                });
                that.api.batchExport({ids: ids, kjywrid: that.kjywrid, gztype: that.type}, res => {
                    that.loading = false;
                });
            }
        },
        //详情
        handleDetail(data){
            this.$router.push({path: "/caltaxManage/salaryItemDetail", query:{opt:"detail",rowid: this.kjywrid, type:this.type, id: data.id}})
        },
        handleEdit(data){
            this.$router.push({path: "/caltaxManage/salaryItemDetail", query:{opt:"edit",rowid: this.kjywrid, type:this.type, id: data.id}})
        },
        //算税
        handleCaltax(data){
            const that = this;
            that.loading = true;
            let ryids = [data.ryid];
            that.api.batchCaltax({ryids: ryids, kjywrid: that.kjywrid, gztype: that.type}, result => {
                let res = result.data;
                if(res.code==0){
                    if(res.data.code==1){
                        that.$message.error(res.data.msg);
                    }else {
                        that.$message({message: res.data.msg,type: 'success'});
                        that.handleOk();
                    }
                }else {
                    that.$message.error(res.data.msg);
                }
                that.loading = false;
            });
        },
        //确认
        handleConfirmOrCancel(data,sszt){
            const that = this;
            that.loading = true;
            that.business.customPost(that.request_host+"/ComprehensiveIncome/confirmOrCancel",
                {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                JSON.stringify({"sszt": sszt, id: data.id, kjywrid: that.kjywrid}),
                res => {
                    if(res.code==0){
                        if(res.data.code==1){
                            that.$message.error(res.data.msg);
                        }else {
                            that.$message({message: res.data.msg,type: 'success'});
                            that.handleOk();
                        }
                    }else {
                        that.$message.error(res.data.msg);
                    }
                    that.loading = false;
                }
            );
        },
        //删除
        handleRemove(data){
            const that = this;
            this.$confirm(`您确定要删除吗？`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.loading = true;
                that.business.customPost(that.request_host+"/ComprehensiveTax/delete",
                    {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                    JSON.stringify({id: data.id}),
                    res => {
                    if(res.code==0){
                        if(res.data.code==1){
                            that.$message.error("删除成功");
                        }else {
                            that.$message({message: "删除成功",type: 'success'});
                            that.handleOk();
                        }
                    }else {
                        that.$message.error("删除成功");
                    }
                    that.loading = false;
                });
            });

        },
        showErrorMsg(data){
            this.$confirm(
                '<p style="font-size:14px;color: #999999;">' + data.sbyy + '</p>',
                `错误信息`, {
                    customClass: "my-confirm",
                    dangerouslyUseHTMLString: true,
                    cancelButtonText: '返回',
                    showConfirmButton: false,
                    type: 'warning'
                }).then(() => {

            });
        },
    },
    activated() {
        if(!this.$store.state.user.taxPeriod){
            this.business.lastMonth(data => {
                this.taxPeriod = data.data.sy;
                this.$store.state.user.taxPeriod = this.taxPeriod
            })
        }else {
            this.taxPeriod = this.$store.state.user.taxPeriod;
        }
        if(this.kjywrid){
            this.fetchObligorDetail(this.kjywrid);
            this.$set(this.param, "kjywrid", this.kjywrid);
        }
        this.$set(this.param, "gztype", this.type+'');
    },
    computed:{
        backpath(){
            return "/caltaxManage/salaryInput?rowid=" + this.$route.query.rowid ;
        },
        height(){
            return window.innerHeight-300;
        },
        request_host() {
            return this.$store.state.app.host
        },
        kjywrid(){
            return this.$route.query.rowid;
        },
        type(){
            return this.$route.query.type;
        },
        columns(){
             let prefixColumns = [
                 /*{type: "selection",width: 30},*/
                 {title: "合作方企业",width: 100,dataIndex: "hzfmc"},
                 {title: "姓名",width: 80,dataIndex: "xm",slot: "xm"},
                 {title: "状态",width: 100,dataIndex: "sszt",slot: "sszt"},
                 {title: "证件类型",width: 100,dataIndex: "zzlx"},
                 {title: "证件号码",width: 150,dataIndex: "zzhm",slot: "zzhm"}
             ];
             let suffixColumns = [
                 {title: "应纳税所得额",width: 120,dataIndex: "ynssde",format: this.decryptJe, align:'right'},
                 {title: "应补退税额",width: 100,dataIndex: "ybtse",format: this.numberFmt, align:'right'},
                 {title: "最后操作人",width: 75,dataIndex: "updaterName",align:"left"},
                 {title: "操作",key: "action",width: 200,scopedSlots: { customRender: "action" }}
             ];
            let specialColumns = [];
            if(this.$route.query.type==1){
                //正常工资薪金
                specialColumns = [
                    {title: "本期收入",width: 100,dataIndex: "sre",format: this.decryptJe, align:'right'}
                ];
            }
            else if(this.$route.query.type==2){
                //全年一次性奖金收入
                specialColumns = [
                    {title: "全年一次性奖金额",width: 160,dataIndex: "sre",format: this.decryptJe, align:'right'}
                ];
            }
            else if(this.$route.query.type==3){
                //一次性补偿金
                specialColumns = [
                    {title: "一次性补偿收入",width: 140,dataIndex: "sre",format: this.decryptJe, align:'right'}
                ];
            }
            else if(this.$route.query.type==4){
                //个人股权激励
                specialColumns = [
                    {title: "本期股权激励收入",width: 160,dataIndex: "sre",format: this.decryptJe, align:'right'},
                ];
            }
            else if(this.$route.query.type==5 || this.$route.query.type==6){
                //劳务报酬(一般劳务、其他非连续劳务)
                specialColumns = [
                    {title: "本期收入",width: 100,dataIndex: "sre",format: this.numberFmt, align:'right'}
                ];
            }
             return prefixColumns.concat(specialColumns).concat(suffixColumns);
        }
    }
};
</script>
