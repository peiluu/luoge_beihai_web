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
                exportLabel="发布更新"
                @handleExport="publish"
                ref="list">
            <template #myscope="row">
                <el-button plain type="primary" @click="handleDetail(row.data)">查看</el-button>
                <el-button v-if="!row.data.state || row.data.state!=1" plain type="primary" @click="handleEdit(row.data)">修改</el-button>
            </template>
            <template #state="row">
                {{row.data.state==1?'已发布':'已保存'}}
            </template>
        </form-list>
        <el-dialog
                title="功能更新"
                :visible.sync="dialogVisible"
                width="800px"
                custom-class="my-dialog">
            <el-form ref="form" :model="form" label-width="100px">
                <template>
                    <el-form-item label="标题" prop="title">
                        <el-input :disabled="type=='detail'" class="form-inline-input" v-model="form.title"></el-input>
                    </el-form-item>
                    <el-form-item label="版本" prop="version">
                        <el-input :disabled="type=='detail'" class="form-inline-input" v-model="form.version"></el-input>
                    </el-form-item>
                    <el-form-item label="更新内容" prop="contents">
                        <template v-for="(content, index) in form.contents">
                            <el-input :disabled="type=='detail'" style="width: 95%;margin-bottom: 5px;" :key="'input'+index" class="form-inline-input" v-model="form.contents[index]"></el-input>
                            <i v-if="index==0 && type!='detail'" @click="addContent" style="font-size:20px;color:#409EFF;width: 3%;margin-left: 2%;" :key="'i_' + index" class="el-icon-circle-plus"></i>
                            <i v-if="index!=0 && type!='detail'" @click="removeContent(content,index)" style="font-size:20px;width: 3%;margin-left: 2%;" :key="'i_' + index" class="el-icon-delete"></i>
                        </template>
                    </el-form-item>
                    <el-divider></el-divider>
                    <el-form-item class="form-button">
                        <el-button v-if="type!='detail'" @click="submitForm(2)">保 存</el-button>
                        <el-button v-if="type!='detail'" type="primary" @click="submitForm(1)">发 布</el-button>
                        <el-button v-if="type=='detail'" @click="dialogVisible=false">关闭</el-button>
                    </el-form-item>
                </template>
            </el-form>
        </el-dialog>
  </div>
</template>
<script>
import FormList from '@/components/FormList.vue';
export default {
    name: "UpgradeList",
    components: {
      FormList
    },
    data() {
      return {
        api:require('./UpgradeManageApi'),
        business: require('@/utils/business'),
        param: {
          pageSize: 100,
          pageNo: 1,
        },
          title:'功能更新',
        dialogVisible: false,
          type:'',
        form:{
            title:'',
            version:'',
            contents:[''],
        },
        columns: [
            {title: "标题",width: 150,dataIndex: "title",align:"left"},
            {title: "版本",width: 120,dataIndex: "version",align:"left"},
            {title: "状态",width: 120,dataIndex: "state",align:"left",slot:'state'},
            /*{title: "发布时间",width: 150,dataIndex: "publishTime",align:"left"},*/
            {title: "创建时间",width: 150,dataIndex: "createTime",align:"left"},
            {title: "创建人",width: 100,dataIndex: "createrName",align:"left"},
            {title: "操作",key: "action",width: 180,scopedSlots: { customRender: "action"}},
        ],
        searchList: [
            {index: 0,key: "content",val: "",type: "autocomplete",label: "搜索",placeholder: "更新内容"},
            {key: "state",val: "",type: "select",
                options: [
                    {value:"", label:"全部"},
                    {value:"2", label:"已保存"},
                    {value:"1", label:"已发布"},
                ],
                label: "状态",
                placeholder: "",
            },
        ],
      };
    },
    methods: {
        handleOk(){
            this.$refs.list.reload()
        },
        publish(){
            this.form = {title:'',version:'',contents:['']};
            this.type = 'add'
            this.dialogVisible = true;
        },
        addContent(){
            this.form.contents.push('');
        },
        removeContent(content,index){
            this.form.contents.splice(index, 1);
        },
        detail(row){
            let that = this;
            this.business.customPost(that.request_host+"/upgrade/detail/"+row.id,
                {"Content-Type":"application/text"},{},
                res => {
                    that.form.id = row.id;
                    that.form.version = row.version
                    that.form.title = row.title;
                    that.form.contents = res.data;
                }
            );
            this.dialogVisible = true;

        },
        handleDetail(row){
            this.detail(row);
            this.type = 'detail'
        },
        handleEdit(row){
            this.detail(row);
            this.type = 'edit'
        },
        submitForm(type){
            let that = this;
            let contents = this.form.contents;
            this.form.state = type;
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

<style lang="scss" scoped>
    ::v-deep .el-dialog__header{
        background-color: #F5F5F5;
        box-shadow: 0 1px 2px #e9e9e9;
    }
    ::v-deep .el-dialog__body{
        padding: 12px 20px;
    }
    ::v-deep .el-dialog.my-dialog{
        height: auto;
        max-height: 600px;
        overflow-y: auto;
    }
</style>