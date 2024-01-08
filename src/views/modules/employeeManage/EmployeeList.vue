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
                ref="list">
            <template #topTool>
                <div class="toolbar mb10">
                    <div class="toolbar-left" style="width:10%;"></div>
                    <div style="color: red;width: 30%;margin-top: 8px;">点击【一键报送】后，请在3-5分钟后点击【人员维护】查看报送结果</div>
                    <div class="toolbar-right" style="width:60%;">
                        <el-button plain type="primary" @click="showDialog">专项附加更新</el-button>
                        <el-button plain type="primary" @click="handleBatchReport">一键报送</el-button>
                        <el-button type="primary" @click="handleImport">人员导入</el-button>
                        <el-button type="primary" @click="handleExport">人员导出</el-button>
                        <el-button type="primary" @click="showExport">专项附加导出</el-button>
                    </div>
                </div>
            </template>
            <template #myscope="row">
                <el-button plain type="primary" @click="handleMaintain(row.data)">人员维护</el-button>
            </template>
            <template #zrs="row">
                {{row.data.nbycgyg+row.data.wbycgyg}}/{{row.data.nbyg+row.data.wbyg}}
            </template>
            <template #nbyg="row">
                {{row.data.nbycgyg}}/{{row.data.nbyg}}
            </template>
            <template #wbyg="row">
                {{row.data.wbycgyg}}/{{row.data.wbyg}}
            </template>
        </form-list>
        <el-dialog
                title="选择税款属期"
                :visible.sync="dialogVisible"
                width="400px">
            <div style="margin-top: 10px;">
                <span class="demonstration">税款属期：</span>
                <el-date-picker v-model="taxPeriod" align="right" type="month" value-format="yyyyMM" placeholder="选择税款属期"></el-date-picker>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSpecialsUpdate">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="选择税款属期"
                :visible.sync="exportVisible"
                width="400px">
            <div style="margin-top: 10px;">
                <span class="demonstration">税款属期：</span>
                <el-date-picker v-model="exportPeriod" align="right" type="month" value-format="yyyyMM" placeholder="选择税款属期"></el-date-picker>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="exportVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSpecialsExport">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import FormList from '@/components/FormList.vue';
    export default {
        name: "EmployeeList",
        components: {
            FormList
        },
        data() {
            return {
                api:require('./EmployeeManageApi'),
                loading: false,
                dialogVisible: false,
                taxPeriod: "",
                exportVisible: false,
                exportPeriod: "",
                param: {
                    pageSize: 100,
                    pageNo: 1,
                },
                title: "人员管理",
                collapsed: false,
                columns: [
                    {type: "selection",width: 50,align:"left"},
                    {title: "纳税人识别号",width: 120,dataIndex: "nsrsbm",align:"left"},
                    {title: "企业名称", width: 150,dataIndex: "qymc",align:"left"},
                    {title: "登记序号",width: 150,dataIndex: "djxhid",align:"left"},
                    /*{title: "已报送/总人数",width: 100,dataIndex: "zrs",align:"right",slot: "zrs"},
                    {title: "已报送/内部员工数", width: 100,align:"right",dataIndex: "nbyg",slot: "nbyg"},*/
                    {title: "已报送/员工数",width: 120,align:"right",dataIndex: "wbyg",slot: "wbyg"},
                    {title: "操作",key: "action",width: 100,align:"right",scopedSlots: { customRender: "action" }}
                ],
                searchList: [
                    {index: 0,key: "nsrsbm",val: "",type: "autocomplete",label: "搜索", placeholder: "企业名称/纳税人识别号"},
                    {index: 1,key: "ygxm",val: "",type: "input",label: "员工姓名", placeholder: "员工姓名"},
                    {key: "sbztList",val: "",type: "select", multiple:true,
                        options: [
                            {value:"1",label:"待报送"},
                            {value:"3",label:"报送失败"},
                            {value:"4",label:"报送成功"}
                        ],
                        label: "报送状态",
                        placeholder: ""
                    },
                ],
            };
        },
        methods: {
            handleOk(){
                this.$refs.list.reload()
            },
            showDialog(){
              this.dialogVisible = true;
            },
            //合作方专项更新
            handleSpecialsUpdate(){
                const vm = this;
                if(!vm.taxPeriod){
                    vm.$message.info('请选择税款属期');
                    return;
                }
                this.dialogVisible = false;
                let selections = this.$refs.list.getSelections();
                let idArray = [];
                if(selections.length > 0){
                    vm.loading = true;
                    selections.forEach(item => {
                        idArray.push(item.id);
                    });
                    vm.api.doSpecialsUpdate(idArray, vm.taxPeriod ,result => {
                        let res = result.data;
                        if(res.code==0){
                            if(res.data.code==1){
                                vm.$message.error(res.data.msg);
                            }else {
                                vm.$message({message: res.data.msg ,type: 'success'});
                                vm.handleOk();
                            }
                        }else {
                            vm.$message.error(res.data.msg);
                        }
                        vm.loading = false;
                    });
                    /*this.$confirm(
                        '<p>确定要合作方专项更新吗？</p>' +
                        '<p style="font-size:14px;color: #999999;">当专项附加信息提交给合作方算薪之后，不要再进行更新</p>',
                        `合作方专项更新确认`, {
                        customClass: "my-confirm",
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {

                    });*/
                }else {
                    vm.$message.info('请选择数据');
                }
            },
            //一键报送
            handleBatchReport(){
                const vm = this;
                let selections = this.$refs.list.getSelections();
                let idArray = [];
                if(selections.length > 0){
                    this.$confirm(`您确定要报送数据吗？`, '警告', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        vm.loading = true;
                        selections.forEach(item => {
                            idArray.push(item.id);
                        });
                        vm.api.doReport(idArray,result => {
                            let res = result.data;
                            if(res.code==0){
                                if(res.data.code==1){
                                    vm.$message.error(res.data.msg);
                                }else {
                                    vm.$message({message: res.data.msg ,type: 'success'});
                                    vm.handleOk();
                                }
                            }else {
                                vm.$message.error(res.data.msg);
                            }
                            vm.loading = false;
                        });
                    });
                }else {
                    vm.$message.info('请选择数据');
                }
            },
            //人员导入
            handleImport(){
                this.$router.push({path: "/employeeManage/employeeImport"})
            },
            //人员导出
            handleExport(){
                const vm = this;
                let selections = this.$refs.list.getSelections();
                let idArray = [];
                if(selections.length > 0){
                    vm.loading = true;
                    selections.forEach(item => {
                        idArray.push(item.id);
                    });
                    vm.api.doExport(idArray,data => {
                        vm.handleOk();
                        vm.loading = false;
                    });
                }else {
                    vm.$message.info('请选择数据');
                }
            },
            showExport(){
                let selections = this.$refs.list.getSelections();
                let idArray = [];
                if(selections.length > 0){
                    this.exportVisible = true;
                }else {
                    this.$message.info('请选择数据');
                }
            },
            //合作方专项导出
            handleSpecialsExport(){
                const vm = this;
                if(!vm.exportPeriod){
                    vm.$message.info('请选择税款属期');
                    return;
                }
                this.exportVisible = false;
                let selections = this.$refs.list.getSelections();
                let idArray = [];
                vm.loading = true;
                selections.forEach(item => {
                    idArray.push(item.id);
                });
                vm.api.doSpecialsExport(idArray,vm.exportPeriod,data => {
                    vm.handleOk();
                    vm.loading = false;
                });
            },
            //人员维护
            handleMaintain(data){
                this.$router.push({path: "/employeeManage/employeeMaintain",query: {rowid : data.id, zdlsb: data.zdlsb}})
            },
            //人员报送
            handleReport(data){
                const that = this;
                let idArray = [];
                idArray.push(data.id);
                that.api.doReport(idArray,result => {
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
            },
            //错误信息
            //错误信息
            showErrorMsg(data){
                this.$confirm(
                    '<p style="font-size:14px;color: #999999;">' + data.zxsbyy + '</p>',
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
            const suggestions = [];
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
        },
        computed:{
            height(){
                return window.innerHeight-280;
            },
            reset(){
                return this.$route.query.reset
            }
        }
    };
</script>

