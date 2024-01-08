<template>
    <div class="main-content">
    <form-list
            :kjywrid="param.kjywrid"
            :columns="columns"
            :searchRow="searchList"
            :api="api"
            :title="title"
            :param="param"
            v-loading="loading"
            :height="height"
            :backpath="backpath"
            ref="list">
        <template #topTool>
            <div class="toolbar mb10">
                <div class="toolbar-left">
                    {{obligorDetail.qymc}}
                </div>
                <div class="toolbar-right">
                    <el-button type="primary" @click="showDialog">专项附加更新</el-button>
                    <el-button plain type="primary" @click="handleReport">一键报送</el-button>
                    <el-button type="primary" @click="handleAdd">添加</el-button>
                </div>
            </div>
        </template>
        <template #myscope="row">
            <el-button plain type="primary" @click="handleDetail(row.data)">详情</el-button>
            <el-button plain type="primary" @click="handleDeduct(row.data)">专项附加查看</el-button>
            <el-button :disabled="row.data.hzfygbz!='否'" plain type="primary" @click="handleEdit(row.data)">修改</el-button>
            <el-button :disabled="row.data.hzfygbz!='否' || !row.data.canCut" plain type="danger" @click="handleRemove(row.data)">减员</el-button>
            <el-button :disabled="(row.data.sbzt!=1 && row.data.sbzt!=3) || !row.data.canDelete" plain type="danger" @click="handleDelete(row.data)">删除</el-button>
        </template>
        <!--<template #hzfygbz="row">
            {{row.data.hzfygbz=="否" ? "合作方员工" : "内部员工"}}
        </template>-->
        <template #xm="row">
            {{decryptXm(row.data.xm)}}
        </template>
        <template #zzhm="row">
            {{decryptZzhm(row.data.zzhm)}}
        </template>
        <template #lxdh="row">
            {{decryptphone(row.data.lxdh)}}
        </template>
       <!-- <template #hzfmc="row">
            {{row.data.hzfygbz=="否" ? row.data.hzfmc : ""}}
        </template>-->
        <template #sbzt="row">
            <span :type="row.data.sbzt==1?'other': row.data.sbzt==2?'other': row.data.sbzt==4 ? 'success':'failed'">
                <a style="color: #FF0000;" v-if="row.data.sbzt==3" href="javascript:void(0);" @click="showErrorMsg(row.data)">
                    报送失败
                </a>
                <template v-else>
                    {{row.data.sbzt==1 ? "待报送" : row.data.sbzt==2 ? "报送中" : row.data.sbzt==4 ? " 报送成功" : row.data.sbzt==5 ? " 申报后自动减员" : ""}}
                </template>
            </span>
        </template>
    </form-list>
    <el-dialog
        title="减员"
        :visible.sync="dialogVisible"
        width="400px">
        <div>
            <span class="demonstration">离职日期</span>
            <el-date-picker v-model="leaveDate" align="right" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="ryDeduct">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog
            title="选择税款属期"
            :visible.sync="taxVisible"
            width="400px">
        <div style="margin-top: 10px;">
            <span class="demonstration">税款属期</span>
            <el-date-picker v-model="taxPeriod" align="right" type="month" value-format="yyyyMM" placeholder="选择税款属期"></el-date-picker>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="taxVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSpecialsUpdate">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import FormList from '@/components/FormList.vue';
export default {
    name: "EmployeeMaintain",
    components: {
      FormList
    },
    data() {
      return {
        api:require('./EmployeeMaintainApi'),
        business:require('@/utils/business'),
        backpath: "/employeeManage-EmployeeList",
        taxVisible:false,
        taxPeriod: "",
        loading: false,
        param: {
            pageSize: 100,
            pageNo: 1,
        },
        obligorDetail: {},
        title: "人员维护",
        collapsed: false,
        dialogVisible: false,
        leaveDate:"",
        ryid: "",
        columns: [
            {type: "selection",width: 50},
            {title: "姓名",width: 80,dataIndex: "xm",align:"left",slot:"xm"},
            {title: "状态",width: 80,dataIndex: "nsrzt",align:"left"},
            {title: "报送状态",width: 100,dataIndex: "sbzt",slot: "sbzt",align:"left"},
            {title: "证件类型", width: 100,dataIndex: "zzlx",align:"left" },
            {title: "证件号码",width: 180,dataIndex: "zzhm", align:"left",slot:"zzhm"},
            {title: "性别", width: 60,dataIndex: "xb",align:"left"},
            {title: "国籍",width: 60,dataIndex: "gj",align:"left"},
            {title: "手机号",width: 120, dataIndex: "lxdh",align:"left",slot: "lxdh"},
            {title: "任职受雇从业类型",width: 160, dataIndex: "sfgy",align:"left"},
            /*{title: "范围",width: 100,dataIndex: "hzfygbz",slot: "hzfygbz",align:"left"},*/
            /*{title: "合作方企业",width: 150,dataIndex: "hzfmc",slot: "hzfmc",align:"left"},*/
            {title: "最后操作人",width: 75,dataIndex: "updaterName",align:"left"},
            {title: "操作",key: "action",width: 380,fixed:"right",scopedSlots: { customRender: "action" }}
        ],
        searchList: [
            {key: "xm",val: "",type: "input",label: "搜索",placeholder: "员工姓名/身份证号"},
            /*{key: "hzfygbz",val: "",type: "select",
                options: [
                    {value:"",label:"全部"},
                    {value:"否",label:"合作方员工"},
                    {value:"是",label:"内部员工"},
                ],
                label: "范围",
                placeholder: "",
            },*/
            /*{key: "hzfmc",val: "",type: "input",label: "合作方企业", placeholder: ""},*/
            {key: "nsrzt",val: "",type: "select",
                options: [
                    {value:"",label:"全部"},
                    {value:"正常",label:"正常"},
                    {value:"非正常",label:"非正常"},
                ],
                label: "状态",
                placeholder: ""
            },
            {key: "sbzt",val: "",type: "select",
                options: [
                    {value:"",label:"全部"},
                    {value:"1",label:"待报送"},
                    {value:"2",label:"报送中"},
                    {value:"3",label:"报送失败"},
                    {value:"4",label:"报送成功"},
                    {value:"5",label:"申报后自动减员"},
                ],
                label: "报送状态",
                placeholder: ""
            },
        ],
        zdlsb: ""
      };
    },
    methods: {
        showDialog(){
          this.taxVisible = true;
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
        handleOk(){
            this.$refs.list.reload()
        },
        //合作方专项更新
        handleSpecialsUpdate(){
            const vm = this;
            if(!vm.taxPeriod){
                vm.$message.info('请选择税款属期');
                return;
            }
            this.taxVisible = false;
            let selections = this.$refs.list.getSelections();
            let idArray = [];
            if(selections.length > 0){
                vm.loading = true;
                selections.forEach(item => {
                    idArray.push(item.id);
                });
                vm.api.doSpecialsUpdate({ryids: idArray, kjywrid: this.param.kjywrid},vm.taxPeriod,result => {
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
            }else {
                vm.$message.info('请选择数据');
            }
        },
        //一键报送
        handleReport(){
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
                    vm.api.doReport({"taxId":this.param.kjywrid, "ids":idArray},result => {
                        let res = result.data;
                        if(res.code==0){
                            if(res.data.code==1){
                                vm.$message.error(res.data.msg);
                            }else {
                                vm.$message({
                                    message: res.data.msg,
                                    type: 'success',
                                });
                            }
                            vm.handleOk();
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
        //详情
        handleDetail(data){
            this.$router.push({path:"/employeeManage/employeeEdit",query:{kjywrid:this.param.kjywrid, opt:'detail', rowid:data.id,rydq: (data.rydq=='境内'? 1 : 0) }})
        },
        //添加
        handleAdd(){
            this.$router.push({path:"/employeeManage/employeeEdit",query:{kjywrid: this.param.kjywrid, opt:'add',zdlsb:this.zdlsb}})
        },
        //修改
        handleEdit(data){
            this.$router.push({path:"/employeeManage/employeeEdit",query:{kjywrid:this.param.kjywrid, opt:'edit',zdlsb:this.zdlsb, rowid:data.id,rydq: (data.rydq=='境内'? 1 : 0)}})
        },
        //减员
        handleRemove(data){
            this.ryid = data.id;
            this.dialogVisible = true;
        },
        ryDeduct(){
            let that = this;
            if(!that.leaveDate){
                that.$message.error("请选择离职日期");
                return;
            }
            this.business.customPost(that.request_host+"/Employees/checkCutPerson",
                {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                JSON.stringify({"taxId":that.param.kjywrid, "lzrq": that.leaveDate}),
                res => {
                    if(res.code==0){
                        let msg = "";
                        if(res.data.code==1){
                            msg = res.data.msg + "属期未完成申报，点击确认后将在申报完成后自动进行减员，取消减员请点击取消";
                        }else {
                            msg = "您确定要减员吗？";
                        }
                        that.$confirm(msg, '警告', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.business.customPost(that.request_host+"/Employees/cutPerson",
                                {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                                JSON.stringify({"taxId":that.param.kjywrid, "ids": [that.ryid], "lzrq": that.leaveDate}),
                                res => {
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
                                    that.dialogVisible = false;
                                    that.loading = false;
                                }
                            );

                        });

                    }else {
                        that.$message.error(res.data.msg);
                    }
                    that.dialogVisible = false;
                    that.loading = false;
                }
            );
        },
        //专项附加扣除
        handleDeduct(data){
            this.$router.push({path:"/employeeManage/employeeDeduct",query:{kjywrid:this.param.kjywrid, rowid: data.id}})
        },
        //删除
        handleDelete(data){
            let vm = this;
            this.$confirm(`您确定要删除该人员吗？`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                vm.$confirm(`请再次确认！`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    vm.api.del(data.id, result => {
                        let res = result.data;
                        if(res.code==0){
                            if(res.data.code==1){
                                vm.$message.error(res.data.msg);
                            }else {
                                vm.$message({message: res.data.msg,type: 'success'});
                                vm.handleOk();
                            }
                        }else {
                            vm.$message.error(res.data.msg);
                        }
                    });
                })
            });
        }
    },
    activated(){
        this.$set(this.param, "kjywrid", this.$route.query.rowid);
        this.$set(this, "zdlsb", this.$route.query.zdlsb);
        if(this.param.kjywrid){
            this.fetchObligorDetail(this.param.kjywrid);
        }
    },
    mounted(){
        this.$set(this, "zdlsb", this.$route.query.zdlsb);
        if(this.param.kjywrid){
            this.fetchObligorDetail(this.param.kjywrid);
        }
    },
    computed:{
        height(){
            return window.innerHeight-280;
        },
        request_host() {
            return this.$store.state.app.host
        },
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
