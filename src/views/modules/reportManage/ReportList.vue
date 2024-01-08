<template>
    <div class="main-content">
        <form-list
                :reset="reset"
                :columns="columns"
                :searchRow="searchList"
                :api="api"
                :title="title"
                :param="param"
                :height="height"
                v-loading="loading"
                :firstLoading="false"
                ref="list">
            <template #topTool>
                <div class="toolbar mb10">
                    <div class="toolbar-left" style="width:30%;">税款属期：
                        <el-date-picker
                                size="small"
                                :clearable="false"
                                v-model="reportPeriod"
                                type="month"
                                value-format="yyyyMM"
                                placeholder="选择税款属期">
                        </el-date-picker>
                    </div>
                    <div style="color: red;width: 30%;margin-top: 8px;">点击【一键申报】后，请在3-5分钟后点击【查询】获取申报结果</div>
                    <div class="toolbar-right" style="width:40%;">
                        <el-button plain type="primary" @click="handleExport">导出</el-button>
                        <el-button plain type="primary" @click="showReportDialog">一键申报</el-button>
                        <el-button plain type="primary" @click="showZeroDialog">自动零申报</el-button>
                        <el-button plain type="danger" @click="handleBatchCancel">申报作废</el-button>
                    </div>
                </div>
            </template>
            <template #myscope="row">
                <el-button plain type="primary" @click="handleDetail(row.data)">详情</el-button>
                <!--<el-button plain type="primary" @click="handleReport(row.data)">申报</el-button>
                <el-button plain type="danger" @click="handleCancel(row.data)">申报作废</el-button>-->
            </template>
            <template #zrs="row">
                {{row.data.nbyg+row.data.wbyg}}
            </template>
            <template #tbswpt="row">
                {{row.data.tbswpt == 0? "已同步": row.data.tbswpt == 1?"未同步":""}}
            </template>
            <template #tbmhr="row">
                {{row.data.tbmhr == 0? "已同步": row.data.tbmhr==1?"未同步":""}}
            </template>
            <template #sszt="row">
                <span :type="formatState(row.data.sszt).clazz">
                     <a style="color: #FF0000;" v-if="row.data.sszt==7" href="javascript:void(0);" @click="showErrorMsg(row.data)">
                        {{formatState(row.data.sszt).txt}}
                    </a>
                    <template v-else>
                        {{formatState(row.data.sszt).txt}}
                    </template>
                </span>
            </template>
            <template #yjse="row">
                {{numberFmt(null, null, (row.data.jdybtse || 0) + (row.data.znje || 0))}}
            </template>
            <template #zdlsb="row">
                <el-switch class="switch" :value="row.data.zdlsb===1" @change="switchThis(row, $event)" active-text="是" inactive-text="否"></el-switch>
            </template>
        </form-list>
        <el-dialog title="错误信息" :visible.sync="dialogVisible" width="1000px">
            <el-table
                    stripe
                    border
                    max-height="500px"
                    :data="errorData">
                <el-table-column prop="xm" label="姓名" align="left" min-width="80"></el-table-column>
                <el-table-column prop="zzlx" label="证件类型" align="left" min-width="80"></el-table-column>
                <el-table-column prop="zzhm" label="证件号码" align="left" min-width="140"></el-table-column>
                <el-table-column prop="cwxx" label="错误信息" align="left" min-width="300"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>

        <el-dialog title="申报信息" :visible.sync="reportVisible" width="1300px" v-dialogDrag>
            <div style="color:#ff0000; font-size: 18px;padding: 10px 0;">仅核对MHR平台及个税通平台正常工资薪金、全年一次性奖金收入、解除劳动合同一次性补偿金</div>
            <el-table
                    stripe
                    border
                    max-height="500px"
                    :data="reportData">
                <el-table-column min-width="160" align="left" prop="nsrsbh" label="纳税人识别号"></el-table-column>
                <el-table-column min-width="180" align="left" prop="qymc" label="企业名称"></el-table-column>
                <el-table-column v-if="mhrCloShow" label="MHR系统" align="center">
                    <el-table-column min-width="160" align="right" prop="sremhr" label="内部员工收入总额" :formatter="numberFmt"></el-table-column>
                    <el-table-column min-width="180" align="right" prop="ybtsemhr" label="内部员工应补退税额" :formatter="numberFmt"></el-table-column>
                </el-table-column>
                <el-table-column label="个税通系统" align="center">
                    <el-table-column v-if="mhrCloShow" min-width="160" align="right" prop="sre" label="内部员工收入总额" :formatter="numberFmt"></el-table-column>
                    <el-table-column v-if="mhrCloShow" min-width="180" align="right" prop="ybtse" label="内部员工应补退税额" :formatter="numberFmt"></el-table-column>
                    <el-table-column min-width="160" align="right" prop="srewb" label="外部员工收入总额" :formatter="numberFmt"></el-table-column>
                    <el-table-column min-width="180" align="right" prop="ybtsewb" label="外部员工应补退税额" :formatter="numberFmt"></el-table-column>
                    <el-table-column v-if="mhrCloShow" min-width="80" align="left" prop="yzjg" label="状态">
                        <template #default="myscope">
                            <span style="color:#66b1ff;" v-if="myscope.row.yzjg">成功</span>
                            <span style="color: #F56C6C;" v-else>失败</span>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="reportVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleBatchReport">申 报</el-button>
            </span>
        </el-dialog>

        <el-dialog title="零申报信息" :visible.sync="zeroVisible" width="1300px" v-dialogDrag>
            <el-table
                    stripe
                    border
                    max-height="500px"
                    :data="zeroData">
                <el-table-column min-width="160" align="left" prop="nsrsbh" label="纳税人识别号"></el-table-column>
                <el-table-column min-width="180" align="left" prop="djxhid" label="登记序号"></el-table-column>
                <el-table-column min-width="180" align="left" prop="zgswjgskmc" label="主管税务机关科所名称"></el-table-column>
                <el-table-column min-width="180" align="left" prop="scjydz" label="生产经营地址"></el-table-column>
                <el-table-column min-width="180" align="left" prop="jyjg" label="处理方式">
                    <template #default="myscope">
                        <span style="color:red;font-weight: bold;">{{myscope.row.jyjg}}</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="180" align="left" prop="skssq" label="税款属期">
                    <template #default="myscope">
                        {{myscope.row.skssq.substring(0,4)}}年{{myscope.row.skssq.substring(4,6)}}月
                    </template>
                </el-table-column>
                <el-table-column min-width="80" align="left" prop="yzjg" label="状态">
                    <template #default="myscope">
                        <span style="color:#66b1ff;" v-if="myscope.row.bz==1">成功</span>
                        <span style="color: #F56C6C;" v-else>失败</span>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="zeroVisible = false">取 消</el-button>
                <el-button type="primary" @click="zeroTax">申 报</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import FormList from '@/components/FormList.vue';
    export default {
        name: "ReportList",
        components: {
            FormList,
        },
        data() {
            return {
                api:require('./ReportManageApi'),
                business:require('@/utils/business'),
                loading: false,
                reportPeriod: "",
                param: {
                    pageSize: 100,
                    pageNo: 1,
                },
                title: "申报管理",
                collapsed: false,
                columns: [
                    {type: "selection",width: 50,},
                    {title: "纳税人识别号",width: 180,dataIndex: "nsrsbm",align:"left"},
                    {title: "企业名称",width: 200,dataIndex: "qymc",align:"left"},
                    {title: "状态",width: 120,dataIndex: "sszt",align:"left", slot:'sszt'},
                    {title: "自动零申报",width: 120,dataIndex: "zdlsb",slot:"zdlsb",align:"center"},
                    {title: "应申报人数", width: 120,dataIndex: "zrs", align:"right"},
                    {title: "收入总额",width: 100,dataIndex: "sre",align:"right" ,format: this.numberFmt},
                    {title: "申报前应补退税额",width: 140,dataIndex: "ynse",align:"right" ,format: this.numberFmt},
                    {title: "申报后应补退税额",width: 140,dataIndex: "jdybtse",align:"right" ,format: this.numberFmt},
                    {title: "申报后滞纳金",width: 120,dataIndex: "znje",align:"right" ,format: this.numberFmt},
                    {title: "应缴税额",width: 100,dataIndex: "yjse",align:"right" , slot:'yjse'},
                    /*{title: "同步税务平台",width: 120,dataIndex: "tbswpt",align:"left",slot: "tbswpt"},
                    {title: "同步MHR平台",width: 120,dataIndex: "tbmhr",align:"left",slot: "tbmhr"},*/
                    {title: "最后操作人",width: 75,dataIndex: "updaterName",align:"left"},
                    {title: "操作",key: "action",width: 80,fixed:"right",scopedSlots: { customRender: "action"}},
                ],
                searchList: [
                    {index: 0,key: "nsrsbm",val: "",type: "autocomplete",label: "搜索",placeholder: "企业名称/纳税人识别号"},
                    /*{key: "sszt",val: "",type: "select",
                        options: [
                            {value:"",label:"全部"},
                            {value: "3", label: "未算税确认"},
                            {value:"4",label:"已算税确认"},
                            {value:"5",label:"申报中"},
                            {value:"6",label:"申报成功"},
                            {value:"7",label:"申报失败"},
                            {value:"8",label:"申报作废中"},
                            {value:"9",label:"缴税中"},
                            {value:"10",label:"缴税成功"},
                            {value:"11",label:"缴税失败"},
                            {value:"12",label:"申报成功,无需缴税"}
                        ],
                        label: "状态",
                        placeholder: "",
                    },*/
                    {key: "ssztList",val: "",type: "mul-select",
                        options: [
                            {value:"3", label:"未算税确认",checked: false},
                            {value:"4",label:"已算税确认",checked: false},
                            {value:"5",label:"申报中",checked: false},
                            {value:"6",label:"申报成功",checked: false},
                            {value:"7",label:"申报失败",checked: false},
                            {value:"8",label:"申报作废中",checked: false},
                            {value:"12",label:"申报成功,无需缴税",checked: false},
                            {value:"9",label:"缴税中",checked: false},
                            {value:"10",label:"缴税成功",checked: false},
                            {value:"11",label:"缴税失败",checked: false},
                        ],
                        all: ['3','4','5','6','7','8','9','10','11','12'],
                        label: "状态",
                        placeholder: "",
                    },
                    {key: "zdlsb",val: "",type: "select",
                        options: [
                            {value:"",label:"全部"},
                            {value:"1",label:"是"},
                            {value:"0",label:"否"},
                        ],
                        label: "自动零申报",
                        placeholder: "",
                    },
                ],
                dialogVisible: false,
                errorData: [],
                reportVisible: false,
                reportData: [],
                mhrCloShow: false,
                zeroVisible: false,
                zeroData: [],
            };
        },
        watch: {
            reportPeriod(val){
                this.$store.state.user.reportPeriod = val;
                this.handleOk();
            }
        },
        methods: {
            switchThis(row, event){
                let that = this;
                that.$set(row.data, "zdlsb", event?1:0)
                that.business.customPost(that.request_host + "/Taxpayer/setzdlsb",
                    {"Content-Type":"application/json","Data-Type":"json"},
                    JSON.stringify({id:row.data.id, zdlsb: row.data.zdlsb}),
                    res => {
                        if(res.code==0){
                            that.$message({
                                message: "操作成功",
                                type: 'success',
                            });
                        }else {
                            that.$message.error("操作失败");
                        }
                    }
                );
            },
            handleOk(){
                this.$refs.list.reload()
            },
            showReportDialog(){
                let that = this;
                let selections = this.$refs.list.getSelections();
                let nsrsbhArray = [];
                for(var i=0; i<selections.length; i++){
                    var item = selections[i];
                    if(item.zdlsb==1){
                        this.$message({
                            message: '【'+item.qymc+'】已设置自动零申报，请取消设置或选择零申报方式！',
                            duration: 3000,
                        });
                        return;
                    } else if(item.sszt!=4 && item.sszt!=7){
                        nsrsbhArray = [];
                        this.$message({
                            message: '只允许对算税已确认或申报失败的数据进行申报！',
                            duration: 3000,
                        });
                        return;
                    }else {
                        nsrsbhArray.push(item.nsrsbm);
                    }
                }
                if(nsrsbhArray.length > 0){
                    that.business.customPost(that.request_host+"/ComprehensiveIncome/checkDeclareTax/"+this.$store.state.user.reportPeriod,
                        {'Content-Type': 'application/json'},JSON.stringify(nsrsbhArray),
                        res => {
                            if(res.data.code==0){
                                that.reportVisible = true;
                                that.reportData = res.data.data;
                            }else {
                                that.$message.info(res.data.msg);
                            }
                        }
                    );
                }else {
                    this.$message.info('请选择数据');
                }
            },
            //一键申报
            handleBatchReport(){
                const that = this;
                let nsrsbhArray = [];
                for(var i=0; i<that.reportData.length; i++){
                    var item = that.reportData[i];
                    if(!item.yzjg){
                        nsrsbhArray = [];
                        this.$message.info('与MHR的算税结果不一致，无法进行申报');
                        return;
                    }else {
                        nsrsbhArray.push(item.nsrsbh);
                    }
                }
                this.$confirm(`您确定要一键申报吗？`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.loading = true;
                    that.reportVisible = false;
                    that.api.batchReport(nsrsbhArray, result => {
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
            },
            showZeroDialog(){
                let that = this;
                let selections = this.$refs.list.getSelections();
                let ids = [];
                for(var i=0; i<selections.length; i++){
                    var item = selections[i];
                    if(item.zdlsb!=1){
                        this.$message({
                            message: '【'+item.qymc+'】未设置自动零申报，无法进行零申报！',
                            duration: 3000,
                        });
                        ids = [];
                        return;
                    } else {
                        ids.push(item.id);
                    }
                }
                if(ids.length > 0){
                    that.business.customPost(that.request_host+"/api/taxpayer/zeroTax/check/"+this.$store.state.user.reportPeriod,
                        {'Content-Type': 'application/json'},JSON.stringify(ids),
                        res => {
                            if(res.data.code==0){
                                that.zeroVisible = true;
                                that.zeroData = res.data.data;
                            }else {
                                that.$message.info(res.data.msg);
                            }
                        }
                    );
                }else {
                    this.$message.info('请选择数据');
                }
            },
            zeroTax(){
                const that = this;
                let ids = [];
                for(var i=0; i<that.zeroData.length; i++){
                    var item = that.zeroData[i];
                    if(item.bz!=1){
                        ids = [];
                        this.$message.info('存在验证不通过的记录，无法进行零申报');
                        return;
                    }else {
                        ids.push(item.id);
                    }
                }
                this.$confirm(`您确定要一键零申报吗？`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.loading = true;
                    that.zeroVisible = false;
                    that.api.zeroTax(ids, result => {
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
            },
            //申报作废
            handleBatchCancel(){
                const that = this;
                let selections = that.$refs.list.getSelections();
                let nsrsbhArray = [];
                if(selections.length > 0){
                    this.$confirm(`您确定要申报作废吗？`, '警告', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        that.loading = true;
                        selections.forEach(item => {
                            nsrsbhArray.push(item.nsrsbm);
                        });
                        that.api.batchCancel(nsrsbhArray, result => {
                            let res = result.data;
                            if(res.code==0){
                                if(res.data.code==1){
                                    that.$message.error(res.data.msg);
                                }else {
                                    that.$message({message:res.data.msg,type: 'success'});
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
            //详情
            handleDetail(data){
                this.$router.push({path: "/reportManage/reportDetail",query:{rowid:data.id}})
            },
            //申报
            handleReport(data){
                const that = this;
                let nsrsbhArray = [];
                that.loading = true;
                nsrsbhArray.push(data.nsrsbm);
                that.api.batchReport(nsrsbhArray, result => {
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
            //申报作废
            handleCancel(data){
                const that = this;
                let nsrsbhArray = [];
                that.loading = true;
                nsrsbhArray.push(data.nsrsbm);
                that.api.batchCancel(nsrsbhArray, result => {
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
            //错误信息
            showErrorMsg(data){
                let that = this;
                that.dialogVisible = true;
                that.api.fetchErrorMsg({nsrsbh: data.nsrsbm}, res => {
                    that.errorData = res.data;
                });
            },
            //导出
            handleExport(){
                const that = this;
                let selections = that.$refs.list.getSelections();
                let nsrsbhArray = [];
                that.loading = true;
                selections.forEach(item => {
                    nsrsbhArray.push(item.id);
                });
                that.api.exportData(nsrsbhArray,this.reportPeriod, res => {
                    that.loading = false;
                });
            },
        },
        activated() {
            if(!this.$store.state.user.reportPeriod){
                this.business.lastMonth(data => {
                    this.reportPeriod = data.data.sy;
                    this.$store.state.user.reportPeriod = this.reportPeriod
                })
            }else {
                this.reportPeriod = this.$store.state.user.reportPeriod;
            }
            var suggestions = [];
            const createFilter = function (queryString) {
                return (item) => {
                    return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            };
            this.searchList[0].fetchSuggestions = function(queryString,cb){
                var results = queryString ? suggestions.filter(createFilter(queryString)) : suggestions;
                cb(results)
            };
            if(this.sszt){
                this.param.sszt = this.sszt;
            }
        },
        computed:{
            height(){
                return window.innerHeight-280;
            },
            sszt() {
                return this.$route.query.sszt
            },
            reset(){
                return this.$route.query.reset
            },
            request_host() {
                return this.$store.state.app.host
            },
        }
    };
</script>

<style lang="scss" scoped>
    ::v-deep .el-dialog__header{
        background-color: #F5F5F5;
        box-shadow: 0 1px 2px #e9e9e9;
    }
    ::v-deep .el-dialog__body {
        padding: 0 20px 30px 20px;
        color: #606266;
        font-size: 14px;
        word-break: break-all;
    }
</style>

<style lang="scss" scoped>
    @import '@/styles/switch.scss';
</style>