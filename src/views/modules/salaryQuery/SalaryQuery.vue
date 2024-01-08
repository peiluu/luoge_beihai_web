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
                exportLabel="导出"
                @handleExport="handleExport"
                ref="list">
            <template #skssq="row">
                {{row.data.skssq.substring(0,4)}}年{{row.data.skssq.substring(4,6)}}月
            </template>
            <template #zzhm="row">
                {{decryptZzhm(row.data.zzhm)}}
            </template>
        </form-list>
    </div>
</template>
<script>
    import FormList from '@/components/FormList.vue';
    export default {
        name: "PaytaxStatList",
        components: {
            FormList
        },
        data() {
            return {
                api:require('./SalaryQueryApi'),
                business: require('@/utils/business'),
                param: {
                    pageSize: 100,
                    pageNo: 1,
                },
                totalPay:'',
                title: "缴税记录",
                collapsed: false,
                columns: [
                    {title: "税款所属期",width: 120,dataIndex: "skssq",align:"left",slot:"skssq"},
                    {title: "姓名",width: 120,dataIndex: "xm",align:"left"},
                    {title: "证件号码",width: 200,dataIndex: "zzhm",align:"left",slot:"zzhm"},
                    {title: "合作方名称",width: 200,dataIndex: "hzfmc",align:"left"},
                    {title: "纳税人识别号",width: 200,dataIndex: "nsrsbh",align:"left"},
                    {title: "企业名称",width: 200,dataIndex: "qymc",align:"left"},
                    {title: "登记序号",width: 200,dataIndex: "djxhid",align:"left"},
                ],
                searchList: [
                    {index: 0,key: "nsrsbh",val: "",type: "autocomplete",label: "搜索",placeholder: "企业名称/纳税人识别号"},
                    {index: 1, key: "djxhid",val: "",type: "autocomplete",label: "登记序号",placeholder: "登记序号"},
                    {key: "gzlx",val: "1",type: "select",label: "工资类型",placeholder: "",
                        options:[
                            {value:"",label:"全部"},
                            {value:"1",label:"正常工资薪金"},
                            {value:"2",label:"全年一次性奖金收入"},
                            {value:"3",label:"解除劳动合同一次性补偿金"},
                            {value:"4",label:"个人股权激励收入"},
                            {value:"5",label:"劳务报酬(一般劳务、其他非连续劳务)"},
                            {value:"6",label:"劳务报酬(其他连续劳务)"}
                        ]
                    },
                    {key: "sfgy",val:'雇员', type: "select",label: "是否雇员",placeholder: "",
                        options:[
                            {value:"",label:"全部"},
                            {value:"雇员",label:"雇员"},
                            {value:"保险营销人",label:"保险营销人"},
                            {value:"证券经纪人",label:"证券经纪人"},
                            {value:"实习学生（全日制学历教育）",label:"实习学生（全日制学历教育）"},
                            {value:"其他",label:"其他"}
                        ]
                    },
                    {key: "skssq",type: "month",label: "税款所属期",placeholder: "", },
                ],
            };
        },
        methods: {
            handleOk(){
                this.$refs.list.reload()
            },
            handleExport(){
                const vm = this;
                vm.loading = true;
                vm.api.doExport(this.param,data => {
                    vm.loading = false;
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

            const suggestions2 = [];
            const createFilter2 = function (queryString) {
                return (item) => {
                    return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            };
            this.searchList[1].fetchSuggestions = function(queryString,cb){
                var results = queryString ? suggestions2.filter(createFilter(queryString)) : suggestions2;
                // 调用 callback 返回建议列表的数据
                cb(results)
            };
        },
        computed:{
            height(){
                return window.innerHeight-280;
            },
            request_host() {
                return this.$store.state.app.host
            },
            reset(){
                return this.$route.query.reset
            },
        }
    };
</script>

<style lang="scss" scoped>
    @import '@/styles/switch.scss';
</style>