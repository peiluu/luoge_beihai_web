<template>
    <div class="">
        <el-dialog
        :title="title"
        :visible="visible"
        :width="width"
        @update:visible="updateVisible"
        :before-close="handleClose">
           <article class="dailog_info">
            <el-form ref="form" :model="modifyForm" label-width="280px">
                <el-form-item label="会计主体">
                    <el-select style="width:100%" v-model="modifyForm.value" placeholder="请选择" clearable filterable>
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="会计主体">
                    <el-select style="width:100%" v-model="modifyForm.value" placeholder="请选择" clearable filterable>
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否可抵扣">
                    <el-select style="width:100%" v-model="modifyForm.value" placeholder="请选择" clearable filterable>
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="计税项目分类">
                    <el-select style="width:100%" v-model="modifyForm.value" placeholder="请选择" clearable filterable>
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="进项税对应费用会计科目编码与名称">
                    <el-select style="width:100%" v-model="modifyForm.value" placeholder="请选择" clearable filterable>
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="进项税待认证会计科目编码与名称">
                    <el-select style="width:100%" v-model="modifyForm.value" placeholder="请选择" clearable filterable>
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部分抵扣需转出税金">
                    <el-input v-model="modifyForm.name"></el-input>
                </el-form-item>
                <el-form-item label="记账人">
                    <el-input v-model="modifyForm.name"></el-input>
                </el-form-item>
                <el-form-item label="记账备注">
                    <el-input v-model="modifyForm.name"></el-input>
                </el-form-item>
            </el-form>
            <span>若选择【部分抵扣】时，【进项税对应费用会计科目编码与名称】、【进项税待认证会计科目编码与名称】、【部分抵扣需转出税金】为必填项目。</span>
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
    name:'modifyStatusPage',
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
            modifyForm: {},
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