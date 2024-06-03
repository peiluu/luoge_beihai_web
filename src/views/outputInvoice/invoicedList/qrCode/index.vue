<template>
    <div class="">
        <el-dialog
        :title="title"
        :visible="visible"
        :width="width"
        @update:visible="updateVisible"
        :before-close="handleClose">
            <article style="text-align: center;">
                <vue-qr
                ref="qrCode"
                :text="text"
                :logoSrc="logoSrc"
                :color-dark="randomColor"
                :callback="qrCodeCallback"
                width="200"
                height="200"
                ></vue-qr>
            </article>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="updateVisible(false)">取 消</el-button> -->
                <el-button type="primary" @click="updateVisible(false)">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import VueQr from 'vue-qr';
import {getQrUrl} from '../Api.js'
export default {
    name:'QrCodePage',
    props:{
        visible: {
            type: Boolean,
            default: false,
        },

        title: {
            type: String,
            default: '二维码查看'
        },

        width: {
            type: String,
            default: '30%'
        },
        qrData:{
            type: Object,
            default: ()=> ({})
        }
    },
    components: {VueQr},
    data() {
        return {
            text: '',
            logoSrc: '',
            randomColor: 'black',
            qrCodeUrl: '', // 存放生成的二维码url,
            form:{...this.qrData}
        };
    },
    computed: {},
    watch: {
        qrData:{
            handler(val){
                this.form = {...val}
            }
        }
    },
    methods: {
       async handleGetUlr(data){

            try{
                const res  = await getQrUrl(data);
                if([0,'0'].includes(res.code)){
                    this.text = res.data;
                }
            }catch(e){

            }
        },
        qrCodeCallback(url){
            this.qrCodeUrl = url
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
            this.updateVisible(false)
        },
    },
    created() {},
    mounted() {
        this.handleGetUlr({id:this.form.id || ''})
    },
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