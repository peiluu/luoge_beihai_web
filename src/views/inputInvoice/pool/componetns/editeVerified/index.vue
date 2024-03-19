<template>
    <div class="">
        <el-dialog
        :title="title"
        :visible="visible"
        :width="width"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @update:visible="updateVisible"
        :before-close="handleClose">
            <article class="dailog_info">
                <el-form ref="form" :model="pushForm" label-width="280px">
                    <el-form-item label="入账状态：">
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
                <el-button type="primary" @click="handleConfirm">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

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
        }
    },
    components: {},
    data() {
        return {
            pushForm:{},
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
<style scoped lang="scss">
/*@import url(); 引入公共css类*/
.dailog_info{
    min-height: 220px;
    max-height: 520px;
    overflow: hidden;
}
::v-deep .el-dialog__header {
  background: #339966;
  padding: 6px;
  .el-dialog__title {
    color: #fff;
    font-size: 1.25rem;
  }
  .el-dialog__headerbtn {
    top: 10px;
    right: 10px;
    color: #fff;
  }
  .el-dialog__close {
    color: #fff;
  }
}
::v-deep .el-dialog__footer {
  text-align: center;
}
</style>