<template>
    <div class="main-content">
        <form-list
                :reset="reset"
                v-loading="loading"
                :columns="columns"
                :searchRow="searchList"
                :api="api"
                :title="title"
                :param="param"
                :height="height"
                :firstLoading="false"
                ref="list">
            <template #topTool>
                <div class="toolbar mb10">
                    <div class="toolbar-left" style="width:30%;">税款属期：
                        <el-date-picker
                                size="small"
                                :clearable="false"
                                v-model="payPeriod"
                                type="month"
                                value-format="yyyyMM"
                                placeholder="选择税款属期">
                        </el-date-picker>
                    </div>
                    <div style="color: red;width: 30%;margin-top: 8px;">点击【一键缴税】后，请在3-5分钟后点击【查询】获取缴税结果</div>
                    <div class="toolbar-right" style="width:40%;">
                        <el-button plain type="primary" @click="showPaytax">一键缴税</el-button>
                        <el-button plain type="primary" @click="handleDownloadVoucher">下载完税凭证</el-button>
                        <el-button plain type="primary" @click="syncPaytax">同步缴税记录</el-button>
                    </div>
                </div>
            </template>
            <template #myscope="row">
                <el-button plain type="primary" @click="handleBankInfo(row.data)">选择三方账户</el-button>
                <el-button plain type="primary" @click="handleDetail(row.data)">详情</el-button>
                <el-button plain type="primary" @click="showPaytaxInfo(row.data)">缴税信息</el-button>
                <el-button plain type="primary" @click="previewPayProve(row.data)">查看完税凭证</el-button>
                <!--<el-button plain type="primary" @click="handleCancel(row.data)">下载完税凭证</el-button>-->
            </template>
            <template #sszt="row">
                <span :type="formatState(row.data.sszt).clazz">
                    <a style="color: #FF0000;" v-if="row.data.sszt==11" href="javascript:void(0);" @click="showErrorMsg(row.data)">
                        {{formatState(row.data.sszt).txt}}
                    </a>
                    <template v-else>
                        {{formatState(row.data.sszt).txt}}
                    </template>
                </span>
            </template>
        </form-list>

        <el-dialog
                title="选择三方账户"
                :visible.sync="dialogVisible"
                width="600px">
            <div>
                <span>请选择缴税账号</span>
                <el-button type="primary" plain @click="getBankInfos" class="dialog-bar-button">刷新</el-button>
                <el-button :disabled="mills>0" type="primary" plain @click="synch" class="dialog-bar-button" style="margin-right:5px;">{{syncText}}</el-button>
            </div>
            <el-divider></el-divider>
            <template v-if="bankInfos.length>0">
                <el-radio-group v-model="bankInfoId" v-loading="dialogLoading" element-loading-background="rgba(0, 0, 0, 0.5)" element-loading-text="加载中">
                    <el-radio v-for="(bankInfo, index) in bankInfos" :key="bankInfo.id"  :label="bankInfo.id" size="medium">
                        <div class="dialog-row">
                            <div class="dialog-row-bank">{{bankInfo.yhhbmc}} </div>
                            <div class="dialog-row-bank">{{bankInfo.jkzh}} </div>
                            <div class="dialog-row-bank">{{bankInfo.sfxyh}} </div>
                        </div>
                        <el-divider v-if="index != bankInfos.length-1"></el-divider>
                    </el-radio>
                </el-radio-group>
            </template>
            <template v-else>
                <div>暂无银行卡信息，请点击“同步三方信息”同步企业银行卡信息。</div>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveBankInfo">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="请确认缴税账号"
                :visible.sync="payVisible"
                width="1200px">
            <el-table stripe border :header-cell-class-name="'main-table-header-cell'" :data="tableData">
                <el-table-column align="left" prop="nsrsbm" label="纳税人识别号" min-width="150"></el-table-column>
                <el-table-column align="left" prop="qymc" label="企业名称" min-width="200"></el-table-column>
                <el-table-column align="left" prop="yhmc" label="缴税银行" min-width="200"></el-table-column>
                <el-table-column align="left" prop="jkzh" label="缴税账号" min-width="200"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="payVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleBatchPaytax">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="缴税信息"
                :visible.sync="infoVisible"
                width="600px">
            <el-table stripe border :header-cell-class-name="'main-table-header-cell'" :data="infoData">
                <el-table-column align="left" prop="sdmc" label="所得类型" min-width="150"></el-table-column>
                <el-table-column align="right" prop="ybtse" label="应补退税额" min-width="100"></el-table-column>
                <el-table-column align="right" prop="znje" label="滞纳金" min-width="100"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="infoVisible = false">返 回</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import FormList from '@/components/FormList.vue';
    export default {
        name: "PaytaxList",
        components: {
            FormList,
        },
        data() {
            return {
                api:require('./PaytaxManageApi'),
                business:require('@/utils/business'),
                param: {
                    pageSize: 100,
                    pageNo: 1,
                },
                loading: false,
                payPeriod: "",
                tableData: [],
                dialogVisible: false,
                dialogLoading: false,
                payVisible: false,
                infoVisible: false,
                infoData: [],
                nsrsbm: "",
                bankInfoId: "",
                bankInfos: [],
                mills: 0,
                syncText: "同步三方信息",
                title: "缴税管理",
                collapsed: false,
                columns: [
                    {type: "selection",width: 50},
                    {title: "纳税人识别号",width: 200,dataIndex: "nsrsbm",align:"left"},
                    {title: "企业名称",width: 200,dataIndex: "qymc",align:"left"},
                    {title: "状态",width: 150,dataIndex: "sszt",align:"left",slot:"sszt"},
                    {title: "本期应缴合计",width: 120,dataIndex: "ynse",align:"right" ,format: this.numberFmt},
                    {title: "缴税银行",width: 200,dataIndex: "yhmc",align:"left"},
                    {title: "缴税账号",width: 200,dataIndex: "jkzh",align:"left"},
                    {title: "纳税人次",width: 80,dataIndex: "nsrc",align:"right",slot:"zrs"},
                    {title: "收入总额",width: 120,dataIndex: "sre",align:"right",format: this.numberFmt},
                    {title: "总人数",width: 80,dataIndex: "zrs",align:"right"},
                    /*{title: "内部员工",width: 120,dataIndex: "nbyg",align:"right"},
                    {title: "合作方员工人数",width: 140,dataIndex: "wbyg",align:"right"},*/
                    {title: "最后操作人",width: 75,dataIndex: "updaterName",align:"left"},
                    {title: "操作",key: "action",width: 400,scopedSlots: { customRender: "action" },fixed: "right"},
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
                ],
            };
        },
        methods: {
            handleOk(){
                this.$refs.list.reload()
            },
            //维护银行信息
            handleBankInfo(data){
                this.dialogVisible = true;
                this.bankInfoId = data.yhid + "";
                this.nsrsbm = data.nsrsbm;
                this.getBankInfos();
            },
            getBankInfos(){
                let that = this;
                that.dialogLoading = true;
                that.business.customPost(that.request_host+"/Agreement/getByTaxpayer/"+that.nsrsbm,
                    {'Content-Type': 'application/text'},
                    {},
                    res => {
                        that.bankInfos = res.data;
                        that.dialogLoading = false;
                    }
                );
            },
            syncBankInfos(){
                let that = this;
                let nsrsbhArray = [];
                nsrsbhArray.push(that.nsrsbm);
                that.business.customPost(that.request_host+"/Agreement/queryAgreement/"+this.$store.state.user.payPeriod,
                    {'Content-Type': 'application/json'},JSON.stringify(nsrsbhArray),
                    res => {
                        if(res.code==0){
                            if(res.data[0].code!=0){
                                that.$message.error(res.data[0].msg);
                            }else {
                                that.$message({message:res.data[0].msg,type: 'success'});
                            }
                        }else {
                            that.$message.error(res.data[0].msg);
                        }
                    }
                );
            },
            saveBankInfo(){
                let that = this;
                if(!this.bankInfoId){
                    this.$message({message:'请选择缴税银行卡',type: 'info'});
                }
                that.business.customPost(that.request_host+"/Agreement/updateDefaultAgreement",
                    {'Content-Type': 'application/json'},JSON.stringify({id: that.bankInfoId, nsrsbh: that.nsrsbm}),
                    res => {
                        if(res.code==0){
                            if(res.data.code!=0){
                                that.$message.error(res.data.msg);
                            }else {
                                that.handleOk();
                                that.dialogVisible = false;
                                that.$message({message:res.data.msg,type: 'success'});
                            }
                        }else {
                            that.$message.error(res.data.msg);
                        }
                    }
                );
            },
            synch(){
                let that = this;
                that.$set(that, "mills", 59);
                that.syncBankInfos();
                let interval = setInterval(function(){
                    if(that.mills > 0) {
                        that.syncText = that.mills + "s之后重新点击";
                        that.mills --;
                    }else {
                        that.syncText = "同步三方信息";
                        clearInterval(interval);
                    }
                },1000)
            },
            //详情
            handleDetail(data){
                this.$router.push({path: "/paytaxManage/paytaxDetail",query:{rowid:data.id}})
            },
            //一键缴税
            handleBatchPaytax(){
                const that = this;
                let selections = that.$refs.list.getSelections();
                let nsrsbhArray = [];
                if(selections.length > 0){
                    that.payVisible = false;
                    this.$confirm(`请您再次确认需要一键缴税吗？`, '警告', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        that.loading = true;
                        selections.forEach(item => {
                            nsrsbhArray.push(item.nsrsbm);
                        });
                        that.api.batchPaytax(nsrsbhArray, result => {
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
            //查看完税凭证
            previewPayProve(data){
                let that = this;
                that.business.customPost(that.request_host+"/ComprehensiveIncome/checkPayProve/"+this.$store.state.user.payPeriod,
                    {'Content-Type': 'application/json'},JSON.stringify({id: data.id}),
                    res => {
                        if(res.code==0){
                            if(res.data.code!=0){
                                that.$message.error(res.data.msg);
                            }else {
                                window.open(that.request_host+"/ComprehensiveIncome/previewPayProve/" + that.$store.state.user.payPeriod +"?taxId="+data.id,'_blank')
                            }
                        }else {
                            that.$message.error(res.data.msg);
                        }
                    }
                );
            },
            //下载缴税凭证
            handleDownloadVoucher(){
                let that = this;
                let selections = that.$refs.list.getSelections();
                let nsrsbhArray = [];
                if(selections.length > 0){
                    that.loading = true;
                    selections.forEach(item => {
                        nsrsbhArray.push(item.nsrsbm);
                    });
                    that.api.downloadVoucher(nsrsbhArray, res => {
                        that.loading = false;
                    });
                }else {
                    that.$message.info('请选择数据');
                }
            },
            //缴税
            handlePaytax(data){
                const that = this;
                let nsrsbhArray = [];
                nsrsbhArray.push(data.nsrsbm);
                that.loading = true;
                that.api.batchPaytax(nsrsbhArray, result => {
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
            showPaytax(){
                const that = this;
                let selections = that.$refs.list.getSelections();
                that.tableData = [];
                if(selections.length > 0){
                    for(var i=0; i<selections.length; i++){
                        var item = selections[i];
                        if(item.sszt!=6 && item.sszt!=11){
                            that.tableData = [];
                            this.$message.info('只允许对申报成功或缴税失败的数据进行缴税！');
                            return;
                        }else {
                            that.tableData.push(item)
                        }
                    }
                    this.payVisible = true;
                }else {
                    that.$message.info('请选择数据');
                }
            },
            showPaytaxInfo(data){
                let that = this;
                that.infoVisible = true;
                that.dialogLoading = true;
                that.business.customPost(that.request_host+"/Arrearage/getList/"+this.$store.state.user.payPeriod,
                    {'Content-Type': 'application/json'},JSON.stringify({bblx: 1, nsrsbh: data.nsrsbm}),
                    res => {
                        that.infoData = res.data;
                    }
                );
            },
            syncPaytax(){
                let that = this;
                let selections = that.$refs.list.getSelections();
                let taxIdList = [];
                if(selections.length > 0){
                    for(var i=0; i<selections.length; i++){
                        var item = selections[i];
                        if(item.sszt!=6 && item.sszt!=9&& item.sszt!=10&& item.sszt!=11){
                            this.$message.info('只能同步申报成功并且未缴税成功的数据！');
                            return;
                        }else {
                            taxIdList.push(item.id)
                        }
                    }
                }else {
                    that.$message.info('请选择数据');
                }
                if(taxIdList.length>0){
                    that.business.customPost(that.request_host+"/Payment/queryTaxPayment/"+this.$store.state.user.payPeriod+"/1",
                        {'Content-Type': 'application/json'},JSON.stringify(taxIdList),
                        res => {
                            if(res.data.code==1){
                                that.$message.error('同步失败！');
                            }else {
                                that.$message({message: '同步成功！',type: 'success'});
                                that.handleOk();
                            }
                        }
                    );
                }
            }
        },
        activated() {
            this.mills = sessionStorage.getItem("mills") || 0;
            if(!this.$store.state.user.payPeriod){
                this.business.lastMonth(data => {
                    this.payPeriod = data.data.sy;
                    this.$store.state.user.payPeriod = this.payPeriod
                })
            }else {
                this.payPeriod = this.$store.state.user.payPeriod;
            }
            var suggestions = [];
            const createFilter = function (queryString) {
                return (item) => {
                    return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            };
            this.searchList[0].fetchSuggestions = function(queryString,cb){
                var results = queryString ? suggestions.filter(createFilter(queryString)) : suggestions;
                // 调用 callback 返回建议列表的数据
                cb(results)
            };
            if(this.sszt){
                this.param.sszt = this.sszt;
            }
        },
        watch: {
            payPeriod(val){
                this.$store.state.user.payPeriod = val;
                this.handleOk();
            }
        },
        computed:{
            height(){
                return window.innerHeight-280;
            },
            request_host() {
                return this.$store.state.app.host
            },
            sszt() {
                return this.$route.query.sszt
            },
            reset(){
                return this.$route.query.reset
            }
        },
    };
</script>

<style lang="scss" scoped>
    ::v-deep .el-dialog__header{
        background-color: #F5F5F5;
        box-shadow: 0 1px 2px #e9e9e9;
    }
    ::v-deep .el-dialog__body{
        padding: 12px 20px;
    }
    .el-divider--horizontal{
        margin: 12px 0;
    }
    .dialog-bar-button{
        padding:3px 5px;
        float:right;
    }
    .el-radio{
        display: flex;
        ::v-deep .el-radio__input{
            height: 50px;
            line-height: 50px;
        }
    }
    .dialog-row{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
        .dialog-row-bank{
            margin-left:20px;
            line-height:50px;
        }
    }
    ::v-deep .el-dialog__footer{
        border-top: 1px solid #e9e9e9;
        padding: 10px 20px;
    }

</style>