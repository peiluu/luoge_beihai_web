<template>
    <div class="main-content">
    <form-list
            :columns="columns"
            :searchRow="searchList"
            :api="api"
            :title="title"
            :param="param"
            :height="height"
            ref="list">
        <template #myscope="row">
            <el-button type="primary" plain @click="handleEdit(row.data)">修改</el-button>
        </template>
        <template #bz="row">
            <el-switch class="switch" :value="row.data.bz===1" @change="switchThis(row, $event)" active-text="启用" inactive-text="停用"></el-switch>
        </template>
    </form-list>
  </div>
</template>
<script>
import FormList from '@/components/FormList.vue';
export default {
    name: "RegisterNoManage",
    components: {
      FormList
    },
    data() {
      return {
        api:require('./RegisterNoManageApi'),
        business: require('@/utils/business'),
        dialogVisible: false,
        param: {
          pageSize: 100,
          pageNo: 1,
        },
        title: "多等级序号管理",
        collapsed: false,
        columns: [
            {type: "selection",width: 50},
            {title: "合作方法人全称",width: 250,dataIndex: "hzfmc",align:"left"},
            {title: "启用标志",width: 100,dataIndex: "bz",align:"left",slot:'bz'},
            {title: "创建时间",width: 150,dataIndex: "createTime",align:"center"},
            {title: "创建人",width: 100,dataIndex: "createrName",align:"left"},
            {title: "更新时间",width: 150,dataIndex: "updateTime",align:"left"},
            {title: "修改人",width: 100,dataIndex: "updaterName",align:"left"},
            {title: "操作",key: "action",width: 100,fixed: "right",scopedSlots: { customRender: "action" }},
        ],
        searchList: [
            {index: 0,key: "hzfmc",val: "",type: "autocomplete",label: "搜索",placeholder: "纳税人识别号"}
        ],
      };
    },
    methods: {
        handleOk(){
            this.$refs.list.reload()
        },
        //添加
        handleAdd(){
            this.dialogVisible = true;
        },
        //修改
        handleEdit(data){
            this.form.id = data.id;
            this.form.hzfmc = data.hzfmc;
            this.dialogVisible = true;
        },
        saveHzfqy(){
            let that = this;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let url;
                    if(that.form.id){
                        url = that.request_host+"/Partner/update"
                    }else {
                        url = that.request_host+"/Partner/add"
                    }
                    this.business.customPost(url,
                        {"Content-Type":"application/json","Data-Type":"json"},
                        JSON.stringify(that.form),
                        res => {
                            if(res.data.code==0){
                                that.$message({
                                    message: "保存成功",
                                    type: 'success',
                                    onClose: function(){
                                        that.handleOk();
                                        that.dialogVisible = false;
                                        that.form.hzfmc = '';
                                    }
                                });
                            }else {
                                that.$message.error("已经存在该合作方");
                            }
                        }
                    );
                }
            });
        },
        //注销
        switchThis(row, event) {
            let that = this;
            that.$set(row.data, "bz", event?1:0)
            that.business.customPost(that.request_host + "/Partner/disable/"+row.data.id+'/'+row.data.bz,
                {"Content-Type":"application/text"}, {},
                res => {
                    if(res.code==0){
                        that.$message({
                            message: "操作成功",
                            type: 'success',
                        });
                        that.handleOk()
                    }else {
                        that.$message.error("操作失败");
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
            return window.innerHeight-280;
        },
        request_host() {
            return this.$store.state.app.host
        },
    }
  };
</script>

<style scoped lang="scss">
    @import '@/styles/switch.scss';
    ::v-deep .el-dialog__header{
        background-color: #F5F5F5;
        box-shadow: 0 1px 2px #e9e9e9;
    }
    ::v-deep .el-dialog__body{
        padding: 0;
        .el-form>.el-form-item{
            width: 100%;
            margin-bottom: 10px;
        }
        .el-form .el-form-item .el-form-item__content {
            width: calc(100% - 250px) !important;
        }
    }
    .el-form{
        padding-top: 20px;
    }

    /* 调整按钮的宽度 */
    ::v-deep .switch.el-switch .el-switch__core,.el-switch .el-switch__label {
        width: 70px !important;
        margin: 0;
    }
</style>