<template>
    <div class="">
        <el-dialog
        :title="title"
        :visible="visible"
        :width="width"
        @update:visible="updateVisible"
        :before-close="handleClose">
            <article>
                <el-form :model="creditForm" :rules="creditFormRule" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="操作" prop="sqlx">
                        <el-select v-model="creditForm.sqlx" placeholder="请选择" style="width:100%">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="金额" prop="sqed">
                        <el-input-number style="width:100%" v-model="creditForm.sqed" :precision="2"
                         :controls="false"></el-input-number>
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
import { actionCredit } from '../Api.js'

export default {
    name:'downCreditPage',
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
            default: '25%'
        },
        dataObj:{
            type:Object,
            default: ({})
        }
    },
    components: {},
    data() {
        return {
            creditForm:{},
            creditFormRule:{
                sqlx:[ { required: true, message: '请选择', trigger: 'blur' }],
                sqed:[{ required: true, message: '请输入', trigger: 'blur' }]
            },
            options:[
                {
                    label:'下载',
                    value: 0
                },
                {
                    label:'退回',
                    value: 1
                },
            ]
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
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    
                    let data = {nsrsbh:this.dataObj?.nszt,...this.creditForm};
                    actionCredit(data).then(res=>{
                        if( res.data.code === '00'){
                            this.$message.success('操作成功');
                            this.updateVisible(false);
                            this.$emit("handeSuccess",true)
                        }else{
                            this.$message.error(res.msg);
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
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
::v-deep .el-input-number.is-without-controls .el-input__inner{
    text-align: left;
}
</style>