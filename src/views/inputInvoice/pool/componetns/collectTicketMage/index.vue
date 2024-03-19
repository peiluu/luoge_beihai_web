<template>
    <div class="lg_dialog">
        <el-dialog
        :title="title"
        :visible="visible"
        :width="width"
        @update:visible="updateVisible"
        :before-close="handleClose">
           <article class="dailog_info">
            <el-form ref="form" :model="pushForm" label-width="180px">
                    <el-form-item label="发票号码：">
                        <span>{{ pushForm.fphm }}</span>
                    </el-form-item>
                    <el-form-item label="开票日期：">
                        <span>{{ pushForm.fphm }}</span>
                    </el-form-item>
                    <el-form-item label="发票类型：">
                        <span>{{ pushForm.fphm }}</span>
                    </el-form-item>
                    <el-form-item label="收票状态：">
                        <el-radio-group v-model="pushForm.radio">
                            <el-radio :label="3">备选项</el-radio>
                            <el-radio :label="6">备选项</el-radio>
                            <el-radio :label="9">备选项</el-radio>
                        </el-radio-group>     
                    </el-form-item>
                    <el-form-item label="财务备注：">
                        <el-input
                            type="textarea"
                            :rows="4"
                            maxlength="100"
                            placeholder="请输入内容"
                            show-word-limit
                            v-model="textarea">
                            </el-input>
                    </el-form-item>
                </el-form>
           </article>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateVisible(false)">取 消</el-button>
                <el-button type="primary" @click="handleConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

export default {
    name:'collectTicketMagePage',
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
            pushForm: {},
            options:[],
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
            this.updateVisible(false);
            //this.handleCloseModal(false);
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
.dailog_info{
    min-height: 320px;
    max-height: 520px;
    overflow: hidden;
}
</style>