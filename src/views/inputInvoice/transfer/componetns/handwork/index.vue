<template>
    <div class="">
        <el-dialog
        :title="title"
        :visible="visible"
        :width="width"
        @update:visible="updateVisible"
        :before-close="handleClose">
            <article>
                <el-form ref="form" :model="handForm" label-width="140px">
                    <el-form-item label="组织">
                        <el-select style="width:100%" v-model="handForm.value" placeholder="请选择" clearable filterable>
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="纳税人名称">
                        <span></span>
                    </el-form-item>
                    <el-form-item label="税款所属期">
                        <el-date-picker
                            v-model="handForm.value2"
                            type="month"
                            placeholder="选择月">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="本次转出税额">
                        <el-input v-model="handForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="科目">
                        <el-select style="width:100%" v-model="handForm.value" placeholder="请选择" clearable filterable>
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="计税项目分类">
                        <el-select style="width:100%" v-model="handForm.value" placeholder="请选择" clearable filterable>
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="转出原因">
                        <el-select style="width:100%" v-model="handForm.value" placeholder="请选择" clearable filterable>
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注"> 
                        <el-input v-model="handForm.name"></el-input>
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
    name:'handworkPage',
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
            handForm:{},
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

</style>