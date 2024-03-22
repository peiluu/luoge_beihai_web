<template>
    <div class="lg_dialog">
        <el-dialog
        :title="title"
        :visible="visible"
        :width="width"
        @update:visible="updateVisible"
        :before-close="handleClose">
           <article>
            <slot name="main"></slot>
           </article>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateVisible(false)">关 闭</el-button>
                
            </span>
        </el-dialog>
    </div>
</template>

<script>

export default {
    name:'viewInvoicePage',
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

        };
    },
    computed: {},
    watch: {},
    methods: {
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