<template>
    <div class="">
        <el-dialog
        :title="title"
        :visible="visible"
        :width="width"
        append-to-body
        @update:visible="updateVisible"
        :before-close="handleClose">
           <article>
            <lg-add-custion :detailInfo="detailInfo" @onOk="onOk" @onClose="handleOnClose">
                
            </lg-add-custion>
           </article>
        </el-dialog>
    </div>
</template>

<script>
import LgAddCustion from '@/views/custom/Detail.vue'
export default {
    name:'addCustomPage',
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
    components: {LgAddCustion},
    data() {
        return {
            detailInfo:{},
        };
    },
    computed: {},
    watch: {},
    methods: {
        /* 关闭 */
        updateVisible(value) {
            this.$emit('update:visible', value);
        },
        onOk(val){
            this.$emit('handleDone', true);
            this.updateVisible(false);
        },
        handleOnClose(){
            this.updateVisible(false);
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
::v-deep .el-dialog__body{
    padding:10px 0;
    
}
</style>