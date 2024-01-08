<template>
    <div class="main-content">
        <form-list
                :columns="columns"
                :searchRow="searchList"
                :api="api"
                :title="title"
                :param="param"
                :height="height"
                :backpath="backpath"
                ref="list">
            <template #topTool>
                <div class="toolbar mb10">
                    <div class="toolbar-left">
                        <div>{{employeeDetail.xm}}</div>
                        <div style="color:#8A8A8A;padding-top: 5px;">{{employeeDetail.zzhm}}</div>
                    </div>
                </div>
            </template>
            <template #myscope="row">
                <el-button plain type="primary" @click="handleDetail(row.data)">详情</el-button>
                <el-button plain type="primary" @click="handleEdit(row.data)">修改</el-button>
                <el-button plain type="danger" @click="handleRemove(row.data)">减员</el-button>
                <el-button plain type="primary" @click="handleDeduct(row.data)">专项附加查看</el-button>
            </template>
            <template #skssq="row">
                {{row.data.skssq.substring(0,4)+"年"+row.data.skssq.substring(4,6)+"月"}}
            </template>
            <template #sbzt="row">
                {{row.data.sbzt==4 ? '有效' : '无效，请重新拉取'}}
            </template>
            <!--<template #hzfygbz="row">
                {{row.data.hzfygbz=="否" ? "合作方员工" : "内部员工"}}
            </template>-->
        </form-list>
    </div>
</template>
<script>
    import FormList from '@/components/FormList.vue';
    export default {
        name: "EmployeeDeduct",
        components: {
            FormList
        },
        data() {
            return {
                api:require('./EmployeeDeductApi'),
                business:require('@/utils/business'),
                param: {
                    pageSize: 100,
                    pageNo: 1,
                },
                employeeDetail: {},
                title: "减员",
                collapsed: false,
                columns: [
                    {title: "属期",width: 150,dataIndex: "skssq",sortable: true ,slot: "skssq",align:'center' },
                    {title: "状态",width: 150,dataIndex: "sbzt",slot: "sbzt",align:'center' },
                    {title: "累计子女教育支出",width: 200,dataIndex: "ljznjyzc",sortable: true ,format: this.numberFmt, align:'right'},
                    {title: "累计租房租金支出",width: 200,dataIndex: "ljzfzjzc",sortable: true,format: this.numberFmt, align:'right'},
                    {title: "累计住房贷款利息支出",width: 200,dataIndex: "ljzfdklxzc",sortable: true,format: this.numberFmt, align:'right'},
                    {title: "累计赡养老人支出",width: 200,dataIndex: "ljsylrzc",sortable: true,format: this.numberFmt, align:'right'},
                    {title: "累计继续教育支出",width: 200,dataIndex: "ljjxjyzc",sortable: true,format: this.numberFmt, align:'right'},
                    {title: "累计非学历继续教育支出",width: 200,dataIndex: "ljfxljxjyzc",sortable: true,format: this.numberFmt, align:'right'},
                    {title: "累计学历继续教育支出",width: 200,dataIndex: "ljxljxjyzc",sortable: true ,format: this.numberFmt, align:'right'},
                    {title: "累计3岁以下婴幼儿照护支出",width: 250,dataIndex: "ljyyezhzc",sortable: true,format: this.numberFmt, align:'right'},
                    {title: "子女教育支出",width: 200,dataIndex: "znjyzc",sortable: true,format: this.numberFmt, align:'right'},
                    {title: "住房贷款利息支出",width: 200,dataIndex: "zfdklxzc",sortable: true,format: this.numberFmt, align:'right'},
                    {title: "赡养老人支出",width: 200,dataIndex: "sylrzc",sortable: true,format: this.numberFmt, align:'right'},
                    {title: "住房租金支出",width: 200,dataIndex: "zfzjzc",sortable: true,format: this.numberFmt, align:'right'},
                    {title: "继续教育支出",width: 200,dataIndex: "jxjyzc",sortable: true,format: this.numberFmt, align:'right'},
                    {title: "非学历继续教育支出",width: 200,dataIndex: "fxljxjyzc",sortable: true,format: this.numberFmt, align:'right'},
                    {title: "3岁以下婴幼儿照护支出",width: 200,dataIndex: "yyezhzc",sortable: true,format: this.numberFmt, align:'right'}
                ],
                searchList: [
                    {
                        key: "searchDate",
                        type: "monthrange",
                        pickerOptions: {
                            disabledDate(time) {
                                return time.getTime() > Date.now();
                            },
                            shortcuts: [{
                                text: '最近一个月',
                                onClick(picker) {
                                    const end = new Date();
                                    var year = end.getFullYear();
                                    var mon = end.getMonth() + 1;
                                    const start = new Date(year, mon - 1);
                                    picker.$emit('pick', [start, end]);
                                }
                            }, {
                                text: '最近三个月',
                                onClick(picker) {
                                    const end = new Date();
                                    var year = end.getFullYear();
                                    var mon = end.getMonth() + 1;
                                    const start = new Date(year, mon - 3);
                                    picker.$emit('pick', [start, end]);
                                }
                            },{
                                text: '最近半年',
                                onClick(picker) {
                                    const end = new Date();
                                    var year = end.getFullYear();
                                    var mon = end.getMonth() + 1;
                                    const start = new Date(year, mon - 6);
                                    picker.$emit('pick', [start, end]);
                                }
                            }]
                        },
                        label: "时间",
                    }
                ],
            };
        },
        methods: {
            fetchEmployeeDetail(ryId){
                let that = this;
                this.business.customPost(that.request_host+"/Employees/detail",
                    {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                    JSON.stringify({"id": ryId}),
                    res => {
                        if(res.code==0){
                            that.employeeDetail = res.data
                        }
                    }
                );
            }
        },
        activated() {
            this.$set(this.param, "ryId", this.$route.query.rowid);
            this.fetchEmployeeDetail(this.param.ryId);
        },
        computed:{
            backpath(){
                return "/employeeManage/employeeMaintain?rowid=" + this.$route.query.kjywrid;
            },
            height(){
                return window.innerHeight-290;
            },
            request_host() {
                return this.$store.state.app.host
            },
        }
    };
</script>
