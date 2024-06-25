<template>
    <div class="" v-loading="importing">
        <el-dialog
        :title="title"
        :visible="visible"
        :width="width"
        @update:visible="updateVisible"
        :before-close="handleClose">
            <article >
                <el-upload
                class="upload-demo"
                drag
                :show-file-list="false"
                :action="action"
                :http-request="ajaxUpload"
                >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
                </el-upload>
            </article>
            <article slot="footer" class="dialog-footer">
               
                <el-button type="primary" @click="updateVisible(false)">取 消</el-button>
            </article>
        </el-dialog>
    </div>
</template>

<script>
import { config } from '@/config';
import { customPost, } from '@/utils/request';
export default {
    name:'',
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
        },
        importData:{
            type:Object,
            default:()=> ({})
        }
    },
    components: {},
    data() {
        return {
            receiveData:{...this.importData},
            action:'',
            importing:false,
        };
    },
    computed: {},
    watch: {
        importData:{
            handler(val){
                this.receiveData = {...val};
            }
        }
    },
    methods: {
        //ajax上传
    ajaxUpload(content) {
      let that = this;
      let formData = new FormData();
      formData.append('file', content.file);
      formData.append('sfhs',this.receiveData.sfhs)
      this.importExl(formData)
    },
    // 直接导入模版
    importExl(formData){
      let that = this;
      that.importing = true;
      customPost(`${config.host}/applyInvoiceUpload/uploadDetailExcel`, { 'Content-Type': 'multipart/form-data' }, formData, res => {
        that.importing = false;
        //this.handleSuccess();
        if (res.code === '0') {
          that.$message({
            message: '文件导入成功',
            type: 'success',
          });
          that.$emit('handleOk',res.data);
          this.updateVisible(false);
        }
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
            this.updateVisible(false);
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

</style>