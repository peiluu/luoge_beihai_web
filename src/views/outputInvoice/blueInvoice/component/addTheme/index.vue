<template>
    <div class="">
        <el-dialog
            title="生成模板"
            :visible = "visible"
            width="40%"
            @update:visible="updateVisible"
            :before-close="handleClose">
           <main>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="模板名称" prop="name">
                    <el-input size="small" v-model="ruleForm.name" placeholder="请输入模板名称"></el-input>
                </el-form-item>
            </el-form>
           </main>
            <footer slot="footer" class="dialog-footer" >
                <el-button @click="updateVisible(false)">取 消</el-button>
                <el-button type="primary" @click="handeOk">确 定</el-button>
            </footer>
        </el-dialog>
    </div>
</template>

<script>

export default {
    name:'addThemePage',
    props:{
     visible:{
         type:Boolean,
         default:false
     },
 },
    components: {},
    data() {
        return {
            ruleForm:{
                name:'',
            },

            rules:{
                name: [
                    { required: true, message: '请输入模板名称', trigger: 'blur' },
                   
                ],
            }
        };
    },
    computed: {},
    watch: {},
    methods: {
        /* 更新visible */
      updateVisible(value) {
        this.$emit('update:visible', value);
      },
      
      /*确定 */
      handeOk(){
        this.$refs.ruleForm.validate((valid)=>{
            if(valid){
                this.updateVisible(false)
            }else{
                return
            }
        })
        
      }
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
.dialog-footer{
    text-align: center;
}
</style>