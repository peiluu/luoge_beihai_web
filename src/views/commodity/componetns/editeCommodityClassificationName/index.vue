<template>
    <div class="">
        <el-dialog
        title="提示"
        :visible="visible"
        :width="width"
        @update:visible="updateVisible"
        :before-close="handleClose">
           <article>
            <el-form  v-loading="loading" ref="treeForm"  :model="treeForm" :rules="treeRules" label-width="80px">
                <el-form-item label="名称：" prop="name">
                    <el-input v-model="treeForm.name"></el-input>
                </el-form-item>
            </el-form>
           </article>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateVisible(false)" :loading="loading">取 消</el-button>
                <el-button type="primary" @click="handleConfirm" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {postcommondityAddSingle,updateCommonditySingle} from '../../api.js'
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
        },

        activeId: {
            type:[String,Number],
            default: 0
        },

        isEdite:{
            type: Boolean,
            default: false,
        },

        editeName: {
            type: String,
            default: ''
        },

        parentId:{
            type:[String,Number],
            default: null
        }
    },
    components: {},
    data() {
        return {
            loading:false,
            treeForm: {
                name: this.editeName
            },
            treeRules:{
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                   
                ],
            }
        };
    },
    computed: {
        useActiveId(){
            return this.activeId || 0;
        },
        useIsEdite(){
            return this.isEdite;
        },
        useEditeName(){
            return this.editeName || ''
        },
        usepActiveId(){
            return this.parentId || null
        }
    },
    watch: {},
    methods: {
        /* 关闭 */
        updateVisible(value) {
            this.$emit('update:visible', value);
        },

        /* 确认 */
        handleConfirm(){
            if(this.useIsEdite){
                this.handleSumbitEdit()
               
            }else{
                this.$refs.treeForm.validate((valid) => {
                if(valid){
                    this.handleSumbit()
                }
            })
            }
            
           
            
        },

        /* 关闭前 */
        handleClose(){

        },

        /* Add 提交 */
        handleSumbit(){
            this.loading = true;
            let data = {
                pid: this.useActiveId,
                name: this.treeForm.name || ''
            }
            postcommondityAddSingle(data).then(res=>{
                if(res.code === '0'){
                     this.$message.success('新增成功!');
                     this.handleDoneSuccess(true);
                    this.updateVisible(false);
                }else{
                    // this.$message.error(res.msg)
                }
                
                // this.updateVisible(false);
            }).catch(e=>{
                this.$message.error(e.msg)
            }).finally(()=>{
                this.loading = false;
            })
        },

        /* edit 提交 */
        handleSumbitEdit(){
            this.loading = true;
            let data = {
                id:this.useActiveId,
                name:this.treeForm.name,
                pid:this.usepActiveId,
            }
           
            updateCommonditySingle(data).then(res=>{
                if(res.code === '0'){
                    this.$message.success('修改成功！');
                    this.handleDoneSuccess(true);
                    this.updateVisible(false);
                }
            }).finally(()=>{
                this.loading = false;
            })
        },
        /* 操作成功后返回 */
        handleDoneSuccess(value){
            this.treeForm.name = '';
            this.$emit('handleDone',value)
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
<style scoped>
/*@import url(); 引入公共css类*/

</style>