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
            ref="list">
        <template #topTool>
            <div class="toolbar mb10">
                <div class="toolbar-left"></div>
                <div class="toolbar-right">
                    <el-button plain type="primary" @click="handleBatchReport">一键报送</el-button>
                    <el-button type="primary" @click="handleImport">导入</el-button>
                    <el-button type="primary" @click="handleExport">导出</el-button>
                    <el-button type="primary" @click="handleAdd">添加</el-button>
                    <el-button type="danger" @click="handleDel">删除</el-button>
                </div>
            </div>
        </template>
        <template #myscope="row">
            <el-button type="primary" plain @click="handleDetail(row.data)">详情</el-button>
            <el-button type="primary" plain @click="handleEdit(row.data)">修改</el-button>
            <el-button :disabled="row.data.state==1 || row.data.tbzt==4" type="primary" plain @click="handleReport(row.data)">报送</el-button>
            <el-button :disabled="row.data.state==1" type="danger" plain @click="handleDestroy(row.data)">注销</el-button>
        </template>
        <template #zdlsb="row">
            <el-switch class="switch" :value="row.data.zdlsb===1" @change="switchThis(row, $event)" active-text="是" inactive-text="否"></el-switch>
        </template>
        <template #sftbhs="row">
            {{row.data.sftbhs==1 ? "是" : "否" }}
        </template>
        <template #tbzt="row">
            <span :type="row.data.tbzt==0 || row.data.tbzt==2 ? 'failed' : row.data.tbzt==1 ? 'success' : 'other'">
                <a style="color: #FF0000;" v-if="row.data.tbzt==0 || row.data.tbzt==2" href="javascript:void(0);" @click="showErrorMsg(row.data)">
                    报送失败
                </a>
                <template v-else>
                    {{row.data.tbzt==1 ? "报送成功" : row.data.tbzt==3 ? "待报送" :  row.data.tbzt==4 ? "报送中" : "" }}
                </template>
            </span>
        </template>
        <template #state="row">
            {{row.data.state==1 ? "注销" : "有效" }}
        </template>
    </form-list>
  </div>
</template>
<script>
import FormList from '@/components/FormList.vue';
export default {
    name: "ObligorList",
    components: {
      FormList
    },
    data() {
      return {
        api:require('./ObligorManageApi'),
        business: require('@/utils/business'),
        param: {
          pageSize: 100,
          pageNo: 1,
        },
        title: "扣缴义务人",
        collapsed: false,
        columns: [
            {type: "selection",width: 50},
            {title: "纳税人识别号",width: 180,dataIndex: "nsrsbm",align:"left"},
            {title: "企业名称",width: 180,dataIndex: "qymc",align:"left"},
            {title: "自动零申报",width: 100,dataIndex: "zdlsb",slot:"zdlsb",align:"center"},
            {title: "状态",width: 100,dataIndex: "tbzt",slot:"tbzt",align:"left"},
            {title: "企业状态",width: 100,dataIndex: "state",slot:"state",align:"left"},
            {title: "登记序号",width: 200,dataIndex: "djxhid",align:"left"},
            {title: "法人姓名", width: 100,dataIndex: "frxm",align:"left"},
            {title: "联系电话",width: 120,dataIndex: "lxdh",align:"left"},
            {title: "最后操作人",width: 75,dataIndex: "updaterName",align:"left"},
            {title: "操作",key: "action",width: 260,fixed: "right",scopedSlots: { customRender: "action" }},
        ],
        searchList: [
            {index: 0,key: "nsrsbm",val: "",type: "autocomplete",label: "搜索",placeholder: "企业名称/纳税人识别号"},
            {key: "tbzt",val: "",type: "select",
                options: [
                    {value:"",label:"全部"},
                    {value:"3",label:"待报送"},
                    {value:"1",label:"报送成功"},
                    {value:"2",label:"报送失败"},
                    {value:"4",label:"报送中"},
                ],
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
            {key: "state",val: "",type: "select",
                options: [
                    {value:"",label:"全部"},
                    {value:"0",label:"有效"},
                    {value:"1",label:"注销"},
                ],
                label: "企业状态",
                placeholder: "",
            },
        ],
      };
    },
    methods: {
        handleOk(){
            this.$refs.list.reload()
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
                    selections.forEach(item => {
                        idArray.push(item.id);
                    });
                    vm.api.doReport(idArray,data =>{
                        vm.$message({
                            message: '报送中，请稍后查询报送结果',
                            type: 'success',
                        });
                        vm.$refs.list.reload();
                    });
                });
            }else {
                vm.$message.info('请选择数据');
            }
        },
        //导入
        handleImport(){
            this.$router.push({path: "/obligorManage/obligorImport"})
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
            that.api.exportData(nsrsbhArray, res => {
                 that.loading = false;
             });
        },
        //添加
        handleAdd(){
            this.$router.push({path: "/obligorManage/obligorAdd", query: {opt: "add"}})
        },
        //删除
        handleDel(){
            const vm = this;
            let selections = this.$refs.list.getSelections();
            let idArray = [];
            if(selections.length > 0){
                this.$confirm(`您确定要删除数据吗？`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    vm.$confirm(`请再次确认！`, '警告', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        selections.forEach(item => {
                            idArray.push(item.id);
                        });
                        vm.api.del(idArray,result => {
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
            }else {
                vm.$message.info('请选择数据');
            }
        },
        //详情
        handleDetail(data){
            this.$router.push({path: "/obligorManage/obligorAdd",query: {rowid : data.id, type: "detail"}})
        },
        //修改
        handleEdit(data){
            this.$router.push({path: "/obligorManage/obligorAdd",query: {rowid : data.id, opt:'edit'}})
        },
        //报送
        handleReport(data){
            const vm = this;
            vm.business.customPost(vm.request_host + "/Taxpayer/taxPayerOneRegister",
                {"Content-Type":"application/json","Data-Type":"json"},
                JSON.stringify({id:data.id}),
                res => {
                    vm.$message({
                        message: '报送中，请稍后查询报送结果',
                        type: 'success',
                    });
                    vm.$refs.list.reload();
                }
            );
        },
        showErrorMsg(data){
            this.$confirm(
                '<p style="font-size:14px;color: #999999;">' + data.tbsbyy + '</p>',
                `错误信息`, {
                customClass: "my-confirm",
                dangerouslyUseHTMLString: true,
                cancelButtonText: '返回',
                showConfirmButton: false,
                type: 'warning'
            }).then(() => {

            });
        },
        //切换自动零申报
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
        handleDestroy(data){
            let that = this;
            this.$confirm(`您确定要注销该企业吗？`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.$confirm(`请再次确认！`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.api.destroy({id: data.id, state: 1}, result => {
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
                    });
                })
            });
        }
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
        this.param.tbzt = this.tbzt;
        this.param.zdlsb = this.zdlsb;
    },
    computed:{
        height(){
            return window.innerHeight-280;
        },
        request_host() {
            return this.$store.state.app.host
        },
        tbzt() {
            return this.$route.query.tbzt
        },
        zdlsb(){
            return this.$route.query.zdlsb
        },
        reset(){
            return this.$route.query.reset
        }
    }
  };
</script>

<style lang="scss" scoped>
    @import '@/styles/switch.scss';
</style>