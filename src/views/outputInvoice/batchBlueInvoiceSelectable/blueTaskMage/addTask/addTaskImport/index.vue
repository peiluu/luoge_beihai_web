<template>
    <div class="">
        <el-dialog
        :title="title"
        :visible="visible"
        :width="width"
        :append-to-body="true"
        @update:visible="updateVisible"
        :before-close="handleClose">
        <div  class="upload-template" v-loading="importing">
          <span class="right">
            <el-button type="primary" plain @click="downloadTemplate" >下载模板</el-button>
          </span>
          <el-upload ref="fileUpload" :file-list="fileList" 
          :action="action" :drag="drag" :accept="accept" :show-file-list="false" :limit="limit" 
          :on-success="handleSuccess"
          :on-change="handleChange"
          :http-request="ajaxUpload" >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text" v-if="fileList.length <=0">
              将文件拖到此处，
              <em >或 点击选择</em>
            </div>
            <div class="el-upload__text"  v-else>
              将文件拖到此处，
              <em >或 点击选择</em><br>
              <em >已选择 {{fileList[0].name??''}}</em>
            </div>
          </el-upload>
        </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="" @click="updateVisible(false)">取 消</el-button>
                <el-button type="primary" @click="handleConfirm ">上 传</el-button>
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
            globelFormData:null,
            fileList:[],
            
        };
    },
    computed: {},
    watch: {},
    methods: {
        /* 自定义上传 */
        ajaxUpload(content){
            let that = this;
            const  {kpdId,nsrsbh,nsrmc,orgId} = this.$route.query || {};
            let formData = new FormData();
            formData.append('file', content.file);
            formData.append('kpdId', kpdId);
            formData.append('nsrsbh', nsrsbh);
            formData.append('nsrmc', nsrmc);
            formData.append('orgId', orgId);
            //this.importExl(formData)
            this.globelFormData = formData;
        },
        // 直接导入模版
        importExl(formData){
            console.log(formData)
            let that = this;
            that.importing = true;
            customPost(`${config.host}/tradenum/upload`, { 'Content-Type': 'multipart/form-data' }, formData, res => {
                
                this.handleSuccess();
                if (res.code === '0') {
                that.$message({
                    message: '文件导入成功',
                    type: 'success',
                });
                that.$emit('handleOk',res.data);
                this.updateVisible(false)
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
            const fileName = `流水信息导入模板.xlsx`;
            await download(`${config.host}/tradenum/downLoadTemplate`, {
                // reqData: {type:1},
                fileName,
            });
        },
        /* 上传变化 */
        handleChange(file, fileList){
            console.log(file, fileList,"--")
            this.fileList = [...fileList];
        },
        /* 关闭 */
        updateVisible(value) {
            this.$emit('update:visible', value);
        },

        /* 确认 */
        handleConfirm(){
            this.importExl(this.globelFormData)
           
        },

        /* 关闭前 */
        handleClose(){
            this.updateVisible(false)
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
::v-deep .el-dialog__body{
    padding-top: 0;
}
</style>