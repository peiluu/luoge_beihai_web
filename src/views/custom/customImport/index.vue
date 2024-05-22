<template>
    <div class="">
        <el-dialog
        :title="title"
        :visible="visible"
        :width="width"
        @update:visible="updateVisible"
        :before-close="handleClose">
        <div  class="upload-template" v-loading="importing">
          <span class="right">
            <el-button type="text" @click="downloadTemplate" >下载模板</el-button>
          </span>
          <el-upload ref="fileUpload" :action="action" :drag="drag" :accept="accept" :show-file-list="false" :limit="limit" :on-success="handleSuccess" :http-request="ajaxUpload" >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateVisible(false)">完 成</el-button>
                <!-- <el-button type="primary" @click="handleConfirm">确 定</el-button> -->
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { config } from "@/config";
import { customPost, download } from '@/utils/request';
export default {
    name:'customImportPage',
    props:{
        visible: {
            type: Boolean,
            default: false,
        },

        title: {
            type: String,
            default: 'title'
        },

        width: {
            type: String,
            default: '30%'
        }
    },
    components: {},
    data() {
        return {
            importing:false,
            action:'',
            drag:true,
            accept:'.xlsx, .xls',
            limit:1,
        };
    },
    computed: {},
    watch: {},
    methods: {
        /* 自定义上传 */
        ajaxUpload(content){
            let that = this;
            let formData = new FormData();
            formData.append('file', content.file);
            this.importExl()
        },
        // 直接导入模版
        importExl(formData){
            let that = this;
            that.importing = true;
            customPost(`${config.host}/Customer/importExcel`, { 'Content-Type': 'multipart/form-data' }, formData, res => {
                
                this.handleSuccess();
                if (res.code === '0') {
                that.$message({
                    message: '文件导入成功',
                    type: 'success',
                });
                that.$emit('handleOk');
                }
            }).finally(()=>{
                that.importing = false;
            });
        },
        /* 上传成功 */
        handleSuccess(response, file, fileList) {
            //上传成功之后清除历史记录
            this.$refs.fileUpload.clearFiles();
        },
        /* 下载模板 */
        async downloadTemplate(){
            const fileName = `客户信息导入模板.xlsx`;
            await download(`${config.host}/Customer/downLoadTemplate`, {
                // reqData: {type:1},
                fileName,
            });
        },
        /* 关闭 */
        updateVisible(value) {
            this.$emit('update:visible', value);
        },

        /* 确认 */
        handleConfirm(){

        },

        /* 关闭前 */
        handleClose(){

        },
    },
    created() {},
    mounted() {},
    beforeCreate() {},
    beforeMount() {},
    beforeUpdate() {},
    updated() {},
    beforeDestroy() {},
    destroyed() {},
    activated() {},
    }
</script>
<style scoped>
/*@import url(); 引入公共css类*/
.upload-template{
    text-align: center;
}
.right{
    text-align: left;
    display: inline-block;
    width: 100%;
    margin-left: 10px 
}
</style>