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
                exportLabel="同步"
                v-loading="loading"
                @handleExport="handleBatchSync"
                ref="list">
            <template #skssq="row">
                {{row.data.skssq.substring(0,4)}}年{{row.data.skssq.substring(4,6)}}月
            </template>
            <template #bblx="row">
                {{row.data.bblx==1?'综合所得':row.data.bblx==2?'分类所得':row.data.bblx==3?'非居民所得':row.data.bblx==4?'限售股所得':''}}
            </template>
            <template #ywlx="row">
                {{row.data.ywlx?'申报成功':row.data.bblx==ywlx?'申报作废':row.data.ywlx==3?'缴款成功':''}}
            </template>
            <template #tbxtlx="row">
                {{row.data.tbxtlx==1?'MHR':row.data.tbxtlx==2?'税务系统':''}}
            </template>
            <template #zt="row">
                {{row.data.zt==6?'申报成功':row.data.zt==8?'申报作废':row.data.zt==10?'缴款成功':row.data.zt==12?'申报成功,无需缴款':''}}
            </template>
            <template #myscope="row">
                <el-button plain type="primary" @click="handleSync(row.data)">同步</el-button>
            </template>
        </form-list>
  </div>
</template>
<script>
import FormList from '@/components/FormList.vue';
export default {
    name: "BackMonitorList",
    components: {
      FormList
    },
    data() {
      return {
        api:require('./BackMonitorManageApi'),
        business: require('@/utils/business'),
        param: {
          pageSize: 100,
          pageNo: 1,
        },
        title: "信息同步管理",
          loading: false,
        columns: [
            {type: "selection",width: 50},
            {title: "纳税人识别号",width: 200,dataIndex: "nsrsbh",align:"left"},
            {title: "企业名称",width: 200,dataIndex: "qymc",align:"left"},
            {title: "登记序号",width: 200,dataIndex: "djxhid",align:"left"},
            {title: "税款所属期",width: 150,dataIndex: "skssq",align:"left",slot:'skssq'},
            {title: "申报所得类型",width: 180,dataIndex: "bblx",align:"left",slot:'bblx'},
            {title: "申报表名称",width: 180,dataIndex: "bbmc",align:"left"},
            {title: "业务类型",width: 150,dataIndex: "ywlx",align:"left",slot:'ywlx'},
            {title: "同步系统类型",width: 150,dataIndex: "tbxtlx",align:"left",slot:'tbxtlx'},
            {title: "同步失败原因",width: 250,dataIndex: "tbsbyy",align:"left"},
            {title: "状态",width: 120,dataIndex: "zt",align:"left",slot:'zt'},
            {title: "申报状态",width: 150,dataIndex: "sbzt",align:"left"},
            {title: "反馈状态",width: 120,dataIndex: "fkzt",align:"left"},
            {title: "纳税人次",width: 120,dataIndex: "nsrc",align:"left"},
            {title: "应交款税额",width: 120,dataIndex: "ykjse",align:"left"},
            {title: "创建时间",width: 180,dataIndex: "createTime",align:"left"},
            {title: "操作",key: "action",width: 100,scopedSlots: { customRender: "action"},fixed:'right'},
        ],
        searchList: [
            {index: 0,key: "nsrsbh",val: "",type: "autocomplete",label: "搜索",placeholder: "纳税人识别号"},
            {key: "tbxtlx",val: "",type: "select",
                options: [
                    {value:"", label:"全部"},
                    {value:"1", label:"MHR"},
                    {value:"2",label:"税务系统"},
                ],
                label: "同步系统类型",
                placeholder: "",
            },
        ],
      };
    },
    methods: {
        handleOk(){
            this.$refs.list.reload()
        },
        handleSync(data){
            let that = this;
            that.loading = true;
            this.business.customPost(that.request_host+"/monitor/del/"+data.id,
                {'Content-Type': 'application/text; charset=utf-8'},{},
                res => {
                    if(res.code==0){
                        that.$message({message: '操作成功',type: 'success'});
                        that.handleOk();
                    }else {
                        that.$message.error('操作失败');
                    }
                    that.loading = false;
                }
            );
        },
        handleBatchSync(){
            const that = this;
            let selections = that.$refs.list.getSelections();
            let ids = [];
            if(selections.length > 0){
                that.loading = true;
                selections.forEach(item => {
                    ids.push(item.id);
                });
                that.business.customPost(that.request_host+"/monitor/batchDel",
                    {'Content-Type': 'application/json'},JSON.stringify(ids),
                    res => {
                        if(res.code==0){
                            that.$message({message: '操作成功',type: 'success'});
                            that.handleOk();
                        }else {
                            that.$message.error('操作失败');
                        }
                        that.loading = false;
                    }
                );
            }else {
                that.$message.info('请选择数据');
            }
        },
        submitForm(){
            let that = this;
            let contents = this.form.contents;
            for(var i=0; i<contents.length; i++){
                var content = contents[i];
                if(!content){
                    that.$message.error("请输入更新内容！");
                    return;
                }
            }
            this.business.customPost(that.request_host+"/upgrade/add",
                {"Content-Type":"application/json","Data-Type":"json"},
                JSON.stringify(that.form),
                res => {
                    if(res.code==0){
                        that.$message({
                            message: "保存成功",
                            type: 'success',
                        });
                        this.dialogVisible = false;
                        that.handleOk();
                    }else {
                        that.$message.error("保存失败");
                    }
                }
            );
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