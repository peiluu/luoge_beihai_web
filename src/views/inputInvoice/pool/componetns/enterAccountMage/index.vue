<template>
    <div class="lg_dialog">
        <el-dialog
        :title="title"
        :visible="visible"
        :width="width"
        @update:visible="updateVisible"
        :before-close="handleClose">
           <article class="dailog_info">
            <el-form ref="form" :model="pushForm" label-width="280px">
                    <el-form-item label="申请勾选类型：">
                        <el-select style="width:100%" v-model="pushForm.value" placeholder="请选择" clearable filterable>
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="入账属期：">
                        <el-date-picker style="width:100%"
                            v-model="pushForm.value2"
                            type="month"
                            placeholder="选择月">
                            </el-date-picker>
                    </el-form-item>
                    <el-form-item label="凭证号：">
                        <el-input v-model="pushForm.value8" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="所属账套：">
                        <el-select style="width:100%" v-model="pushForm.value" placeholder="请选择" clearable filterable>
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="进项税对应费用会计科目编码与名称：">
                        <el-select style="width:100%" v-model="pushForm.value" placeholder="请选择" clearable filterable>
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
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
    name:'enterAccountMagePage',
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
           // useTitle:this.title
           pushForm:{}
        };
    },
    computed: {
        
    },
    watch: {
        // title:{
        //     handler(val){
        //         this.useTitle = val;
        //     }
        // }
    },
    methods: {
        /* 关闭 */
        updateVisible(value) {
            this.$emit('update:visible', value);
        },

        /* 确认 */
        handleConfirm(){
            this.updateVisible(false);
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
.dailog_info{
    min-height: 220px;
    max-height: 520px;
    overflow: hidden;
}
.upload_info{

    width: 100%;
    margin: 15px auto;
}
.upload-demo{
    width: 100%;
    text-align: center;
}
::v-deep .el-upload-dragger{
    width: 421px
}
</style>