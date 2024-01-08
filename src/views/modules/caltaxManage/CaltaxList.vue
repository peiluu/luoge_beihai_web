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
                    <div class="toolbar-left" style="width:25%;">税款属期：
                        <el-date-picker
                                size="small"
                                :clearable="false"
                                v-model="taxPeriod"
                                type="month"
                                value-format="yyyyMM"
                                placeholder="选择税款属期">
                        </el-date-picker>
                    </div>
                    <div style="color: red;width: 17%;">点击【一键算税】后，请在3-5分钟后点击【综合所得录入-填写】查看算税结果</div>
                    <div class="toolbar-right" style="width:58%;">
                        <el-button plain type="primary" @click="handleImport">薪资导入</el-button>
                        <!--<el-select v-model="exportType" size="small" style="padding: 0 5px;width: 120px;" placeholder="导出">
                            <el-option key="exportAll" label="汇总导出" value="1"></el-option>
                            <el-option key="exportDetail" label="明细导出" value="2"></el-option>
                        </el-select>-->
                        <el-button plain type="primary" @click="handleExport">算税结果导出</el-button>
                        <el-button plain type="primary" @click="handleBatchCaltax">一键算税</el-button>
                        <el-button plain type="primary" @click="handleBatchConfirm">一键确认</el-button>
                        <el-button plain type="danger" @click="handleBatchCancel">取消确认</el-button>
                        <el-button plain type="danger" @click="handleFailedExport">失败人员导出</el-button>
                    </div>
                </div>
            </template>
            <template #myscope="row">
                <el-button plain type="primary" @click="handleSalaryInput(row.data)">综合所得录入</el-button><!--
                <el-button plain type="primary" @click="handleDetail(row.data)">当期详情</el-button>-->
                <!--<el-button plain type="primary" @click="handleCaltax(row.data)">提交算税</el-button>
                <el-button plain type="primary" @click="handleConfirm(row.data)">算税确认</el-button>
                <el-button plain type="danger" @click="handleCancel(row.data)">取消确认</el-button>-->
            </template>
            <template #zrs="row">
                {{row.data.nbycgyg+row.data.wbycgyg}}
            </template>
            <template #sszt="row">
                 <span :type="formatState(row.data.sszt).clazz">
                    {{formatState(row.data.sszt).txt}}
                </span>
            </template>
        </form-list>

        <el-dialog
                title="薪资导入"
                :visible.sync="dialogVisible"
                width="400px">
            <div>
                <span class="demonstration">所得项目</span>
                <el-select v-model="incomeType">
                    <el-option key="ZCGZXJ" label="正常工资薪金" value="1"></el-option>
                    <el-option key="QNYCXJJ" label="全年一次性奖金收入" value="2"></el-option>
                    <el-option key="LZBCJ" label="解除劳动合同一次性补偿金" value="3"></el-option>
                    <el-option key="GQJLJ" label="个人股权激励收入" value="4"></el-option>
                    <el-option key="FLXLWJ" label="劳务报酬(一般劳务、其他非连续劳务)" value="5"></el-option>
                    <el-option key="LXLWJ" label="劳务报酬(其他连续劳务)" value="6"></el-option>
                </el-select>
            </div>
            <!--<div style="margin-top: 10px;">
                <span class="demonstration">税款属期</span>
                <el-date-picker v-model="taxPeriod" align="right" type="month" value-format="yyyyMM" placeholder="选择税款属期"></el-date-picker>
            </div>-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="importIncome">确 定</el-button>
            </span>
        </el-dialog>
      </div>
</template>
<script>
import FormList from '@/components/FormList.vue';
export default {
    name: "CaltaxList",
    components: {
        FormList,
    },
    data() {
      return {
          api:require('./CaltaxManageApi'),
          business:require('@/utils/business'),
          dialogVisible: false,
          incomeType: "",
          taxPeriod: "",
          loading: false,
          param: {
              pageSize: 100,
              pageNo: 1,
          },
          title: "报送算税",
          collapsed: false,
          columns: [
              {type: "selection",width: 50, selectable: this.selectable},
              {title: "纳税人识别号",width: 200,dataIndex: "nsrsbm",align:"left"},
              {title: "企业名称",width: 240,dataIndex: "qymc",align:"left"},
              {title: "状态",width: 120,dataIndex: "sszt",align:"left", slot:'sszt'},
              {title: "应缴税款总额", width: 120,dataIndex: "ynse",align:"right", format: this.numberFmt},
              {title: "收入总额", width: 100,dataIndex: "sre",align:"right", format: this.numberFmt},
              {title: "算税失败人数",width: 120,dataIndex: "sssbrs",align:"right"},
              {title: "总人数",width: 80,dataIndex: "zrs",align:"right",slot:"zrs"},
              /*{title: "内部员工人数",width: 120,dataIndex: "nbycgyg",align:"right"},
              {title: "合作方员工人数", width: 120,dataIndex: "wbycgyg",align:"right"},*/
              {title: "最后操作人",width: 75,dataIndex: "updaterName",align:"left"},
              {title: "操作",key: "action",width: 140,fixed:"right",scopedSlots: { customRender: "action" }},
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
          exportType:"",
      };
    },
    watch: {
        taxPeriod(val){
            this.$store.state.user.taxPeriod = val;
            this.handleOk();
        },
        exportType(val){
            if(val==1){
                this.handleExport2();
            }else if(val==2){
                this.handleExport();
            }
        }
    },
    methods: {
        handleOk(){
            this.$refs.list.reload()
        },
        //薪资导入
        handleImport(){
            this.dialogVisible = true;
        },
        importIncome(){
            if(!this.incomeType){
                this.$message.error('请选择所得项目');
                return;
            }
            if(!this.taxPeriod){
                this.$message.error('请选择税款属期');
                return;
            }
            this.dialogVisible = false;
            this.$router.push({path: "/caltaxManage/IncomeImport",query:{incomeType:this.incomeType, taxPeriod: this.taxPeriod}})
        },
        //薪资导出
        handleExport(){
            const that = this;
            that.exportType = "";
            let selections = that.$refs.list.getSelections();
            let nsrsbhArray = [];
            if(selections.length > 0){
                that.loading = true;
                selections.forEach(item => {
                    nsrsbhArray.push(item.nsrsbm);
                });
                that.api.exportData(nsrsbhArray, res => {
                    that.loading = false;
                });
            }else {
                that.$message.info('请选择数据');
            }
        },
        handleExport2(){
            const that = this;
            that.exportType = "";
            let selections = that.$refs.list.getSelections();
            let nsrsbhArray = [];
            if(selections.length > 0){
                that.loading = true;
                selections.forEach(item => {
                    nsrsbhArray.push(item.id);
                });
                that.api.exportData2(nsrsbhArray, res => {
                    that.loading = false;
                });
            }else {
                that.$message.info('请选择数据');
            }
        },
        //一键算税
        handleBatchCaltax(){
            const that = this;
            let selections = that.$refs.list.getSelections();
            let nsrsbhArray = [];
            if(selections.length > 0){
                this.$confirm(`您确定要一键算税吗？`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.loading = true;
                    selections.forEach(item => {
                        nsrsbhArray.push(item.nsrsbm);
                    });
                    that.api.batchCaltax(nsrsbhArray, result => {
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
        //一键确认
        handleBatchConfirm(){
            const that = this;
            let selections = that.$refs.list.getSelections();
            let nsrsbhArray = [];
            if(selections.length > 0){
                this.$confirm(`您确定要算税确认吗？`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.loading = true;
                    selections.forEach(item => {
                        nsrsbhArray.push(item.nsrsbm);
                    });
                    that.api.batchConfirm(nsrsbhArray, result => {
                        let res = result.data;
                        if(res.code==0){
                            if(res.data.code==1){
                                that.$message.error(res.data.msg);
                            }else {
                                that.$message({message: res.data.msg ,type: 'success'});
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
        //一键取消
        handleBatchCancel(){
            const that = this;
            let selections = that.$refs.list.getSelections();
            let nsrsbhArray = [];
            if(selections.length > 0){
                this.$confirm(`您确定要取消确认吗？`, '警告', {
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
                                that.$message({message: res.data.msg ,type: 'success'});
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
        //薪资录入
        handleSalaryInput(data){
            this.$router.push({path: "/caltaxManage/salaryInput",query:{rowid:data.id}})
        },
        //当期详情
        handleDetail(data){
            this.$router.push({path: "/caltaxManage/periodDetail",query:{rowid:data.id}})
        },
        handleCaltax(data){
            const that = this;
            let nsrsbhArray = [];
            that.loading = true;
            nsrsbhArray.push(data.nsrsbm);
            that.api.batchCaltax(nsrsbhArray, result => {
                let res = result.data;
                if(res.code==0){
                    if(res.data.code==1){
                        that.$message.error(res.data.msg);
                    }else {
                        that.$message({message: '算税中，请稍后查询结果',type: 'success'});
                        that.handleOk();
                    }
                }else {
                    that.$message.error('算税失败');
                }
                that.loading = false;
            });
        },
        handleConfirm(data){
            const that = this;
            let nsrsbhArray = [];
            that.loading = true;
            nsrsbhArray.push(data.nsrsbm);
            that.api.batchConfirm(nsrsbhArray, result => {
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
        //失败人员导出
        handleFailedExport(){
            const that = this;
            let selections = that.$refs.list.getSelections();
            let nsrsbhArray = [];
            if(selections.length > 0){
                that.loading = true;
                selections.forEach(item => {
                    nsrsbhArray.push(item.nsrsbm);
                });
                that.api.exportFailed(nsrsbhArray, res => {
                    that.loading = false;
                });
            }else {
                that.$message.info('请选择数据');
            }
        },
        selectable(row){
            if(row.wbycgyg == 0){
                return false;
            }else {
                return true;
            }

        }
    },
    activated() {
        if(!this.$store.state.user.taxPeriod){
            this.business.lastMonth(data => {
                this.taxPeriod = data.data.by;
                this.$store.state.user.taxPeriod = this.taxPeriod
            })
        }else {
            this.taxPeriod = this.$store.state.user.taxPeriod;
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
    computed:{
        height(){
            return window.innerHeight-280;
        },
        sszt() {
            return this.$route.query.sszt
        },
        reset(){
            return this.$route.query.reset
        }
    }
  };
</script>

<style lang="scss" scoped>
    .demonstration{
        padding: 20px;
    }
    ::v-deep .el-dialog__header{
        background-color: #F5F5F5;
        box-shadow: 0 1px 2px #e9e9e9;
    }
</style>
