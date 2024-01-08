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
            @sumTotal="sumTotal"
            ref="list">
        <template #topTool>
            <div class="toolbar mb10">
                <div class="toolbar-left" style="margin-top: 5px;">流量统计：{{totalPay}}</div>
            </div>
        </template>
        <template #skssq="row">
            {{row.data.skssq.substring(0,4)}}年{{row.data.skssq.substring(4,6)}}月
        </template>
    </form-list>
  </div>
</template>
<script>
import FormList from '@/components/FormList.vue';
export default {
    name: "TrafficStatList",
    components: {
      FormList
    },
    data() {
      return {
        api:require('./TrafficStatApi'),
        business: require('@/utils/business'),
        param: {
            pageSize: 100,
            pageNo: 1,
            skssq: [],
        },
        totalPay:'',
        title: "缴税记录",
        collapsed: false,
        columns: [
            {type: "selection",width: 50},
            {title: "查询月份",width: 80,dataIndex: "cxyf",align:"left",slot:'cxyf'},
            {title: "纳税人识别号",width: 150,dataIndex: "nsrsbh", align:"left"},
            {title: "企业名称",width: 200,dataIndex: "qymc", align:"left"},
            {title: "流量总数",width: 120,dataIndex: "llzs", align:"left"},
        ],
          searchList: [
              {index: 0,key: "nsrsbh",val: "",type: "autocomplete",label: "搜索",placeholder: "企业名称/纳税人识别号"},
              {
                  key: "skssq",
                  type: "monthrange",
                  pickerOptions: {
                      disabledDate(time) {
                          return time.getTime() > Date.now();
                      },
                  },
                  label: "查询月份",
              }
          ],
      };
    },
    methods: {
        handleOk(){
            this.$refs.list.reload()
        },
        sumTotal(totalPay){
            this.totalPay = totalPay;
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
        let sy = this.getLastMonth()
        this.param.skssq = [sy, sy]
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