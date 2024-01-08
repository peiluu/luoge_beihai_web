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
                <div class="toolbar-left" style="margin-top: 5px;">缴税总额：{{totalPay}}</div>
                <div class="toolbar-right">
                    <el-button type="primary" @click="handleDownloadVoucher">下载完税证明</el-button>
                </div>
            </div>
        </template>
        <template #skssq="row">
            {{row.data.skssq.substring(0,4)}}年{{row.data.skssq.substring(4,6)}}月
        </template>
        <template #jszl="row">
            {{row.data.jszl==10?'正税':row.data.jszl==20?'滞纳金':row.data.jszl==50?'利息':''}}
        </template>
        <template #myscope="row">
            <el-button type="primary" plain @click="previewPayProve(row.data)">查看完税凭证</el-button>
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
        api:require('./PaytaxStatManageApi'),
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
            {title: "税款所属期",width: 100,dataIndex: "skssq",align:"left",slot:'skssq'},
            {title: "纳税人识别号",width: 150,dataIndex: "nsrsbh",align:"left"},
            {title: "企业名称",width: 200,dataIndex: "qymc",slot:"zdlsb",align:"left"},
            {title: "报表类型",width: 180,dataIndex: "bbmc",slot:"tbzt",align:"left"},
            {title: "电子税票号",width: 180,dataIndex: "dzsphm",slot:"state",align:"left"},
            {title: "缴税金额",width: 100,dataIndex: "sjje",align:"right"},
            {title: "缴税日期", width: 100,dataIndex: "jsrq",align:"left"},
            {title: "税款种类",width: 120,dataIndex: "jszl",slot:'jszl',align:"left"},
            {title: "缴税方式",width: 120,dataIndex: "jsfs",align:"left"},
            {title: "操作",key: "action",width: 150,fixed: "right",scopedSlots: { customRender: "action" }},
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
        previewPayProve(data){
            let that = this;
            that.business.customPost(that.request_host+"/ComprehensiveIncome/checkPayProve/"+data.skssq,
                {'Content-Type': 'application/json'},JSON.stringify({id: data.taxId}),
                res => {
                    if(res.code==0){
                        if(res.data.code!=0){
                            that.$message.error(res.data.msg);
                        }else {
                            window.open(that.request_host+"/ComprehensiveIncome/previewPayProve/" + data.skssq +"?taxId="+data.taxId,'_blank')
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
                    nsrsbhArray.push({taxId:item.taxId, skssq:item.skssq});
                });
                that.api.downloadVoucher(nsrsbhArray, res => {
                    that.loading = false;
                });
            }else {
                that.$message.info('请选择数据');
            }
        },
        getYtList(){
            let that = this;
            if(!that.searchList[1].options || that.searchList[1].options.length==1) {
                that.business.customPost(that.request_host + "/api/taxpayer/ytList",
                    {"Content-Type": "application/text"}, {},
                    res => {
                        res.data.map(e => {
                            var obj = {value: e, label: e};
                            that.searchList[1].options.push(obj);
                        })
                    }
                );
            }
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
        this.getYtList();
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