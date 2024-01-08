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
            mergeCell="true"
            ref="list">
        <template #skssq="row">
            <template v-if="row.data.children">
                {{row.data.skssq.substring(0,4)}}年{{row.data.skssq.substring(4,6)}}月
            </template>
            <template v-else>{{row.data.bbmc}}</template>
        </template>
        <template #sblx="row">
            <template v-if="row.data.children">
                -
            </template>
            <template v-else>{{row.data.sblx}}</template>
        </template>
        <template #sbqdmc="row">
            <template v-if="row.data.children">
                -
            </template>
            <template v-else>{{row.data.sbqdmc}}</template>
        </template>
        <template #sbsj="row">
            <template v-if="row.data.children">
                -
            </template>
            <template v-else>{{row.data.sbsj}}</template>
        </template>
    </form-list>
  </div>
</template>
<script>
import FormList from '@/components/FormList.vue';
export default {
    name: "ReportStatList",
    components: {
      FormList
    },
    data() {
      return {
        api:require('./ReportStatManageApi'),
        business: require('@/utils/business'),
        param: {
          pageSize: 100,
          pageNo: 1,
        },
        title: "申报记录",
        collapsed: false,
        columns: [
            /*{type: "selection",width: 50, selectable: this.selectable},*/
            {title: "税款所属期",width: 120,dataIndex: "skssq",align:"left",slot:'skssq'},
            {title: "纳税人识别号",width: 180,dataIndex: "nsrsbh",align:"left"},
            {title: "企业名称",width: 250,dataIndex: "qymc",align:"left"},
            {title: "申报人次",width: 100,dataIndex: "nsrc",align:"right"},
            {title: "当期收入",width: 120,dataIndex: "srze",align:"right"},
            {title: "应补（退）税额",width: 120,dataIndex: "ybtse",align:"right"},
            {title: "申报类型",width: 120,dataIndex: "sblx",align:"left",slot:'sblx'},
            {title: "申报渠道",width: 120,dataIndex: "sbqdmc",align:"left",slot:'sbqdmc'},
            {title: "申报时间",width: 180,dataIndex: "sbsj",align:"left",slot:'sbsj'},
        ],
        searchList: [
            {index: 0,key: "nsrsbh",val: "",type: "autocomplete",label: "搜索",placeholder: "企业名称/纳税人识别号"},
            {key: "yt",val: "",type: "select",label: "业态",placeholder: "",options:[{value:"",label:"全部"}]},
            {
                key: "skssq",
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
                label: "税款所属期",
            }
        ],
      };
    },
    methods: {
        handleOk(){
            this.$refs.list.reload()
        },
        //导出
        handleExport(){
            const that = this;
            that.loading = true;
            that.api.exportData(that.$refs.list.$refs.search.form, res => {
                 that.loading = false;
            });
        },
        getYtList(){
            let that = this;
            if(!that.searchList[1].options || that.searchList[1].options.length==1){
                that.business.customPost(that.request_host + "/api/taxpayer/ytList",
                    {"Content-Type":"application/text"},{},
                    res => {
                        res.data.map(e=>{
                            var obj = {value:e,label:e};
                            that.searchList[1].options.push(obj);
                        })
                    }
                );
            }
        },
        selectable(row){
            if(!row.children ){
                return false;
            }else {
                return true;
            }

        },
        getLastMonth(){
            var nowdays = new Date();
            let year = nowdays.getFullYear();
            let month = nowdays.getMonth();
            if (month === 0) {
                month = 12;
                year = year - 1;
            }
            if (month < 10) {
                month = '0' + month;
            }
            return year + '-' + month;
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
        this.getYtList();
        let sy = this.getLastMonth()
        this.param.skssq = [sy, sy]
    },
    computed:{
        height(){
            return window.innerHeight-240;
        },
        request_host() {
            return this.$store.state.app.host
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