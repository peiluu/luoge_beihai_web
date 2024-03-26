<template>
    <div class="lg_dialog">
        <el-dialog
        :title="title"
        :visible="visible"
        :width="width"
        @update:visible="updateVisible"
        :before-close="handleClose">
           <article class="dailog_info">
            
            <el-form ref="formTick" :model="pushForm" label-width="180px">
                    <el-form-item label="发票号码：">
                        <span>{{ typeStatus.type === 'HGJKS'?pushForm.hgjkshm:typeStatus.type === 'DKDJWSPZ'?pushForm.dkdjwspzh:pushForm.fphm }}</span>
                    </el-form-item>
                    <el-form-item label="开票日期：">
                        <span>{{ pushForm.kprq || pushForm.tfrq }}</span>
                    </el-form-item>
                    <!-- <el-form-item label="发票类型：">
                        <span>{{ optionList.invoiceType.find(k=> k.value === pushForm.fppzDm)?.label }}</span>
                    </el-form-item> -->
                    <!-- <el-form-item label="收票状态：">
                        <el-radio-group v-model="pushForm.radio">
                            <el-radio :label="3">备选项</el-radio>
                            <el-radio :label="6">备选项</el-radio>
                            <el-radio :label="9">备选项</el-radio>
                        </el-radio-group>     
                    </el-form-item> -->
                    <el-form-item label="财务备注：">
                        <el-input
                            type="textarea"
                            :rows="4"
                            maxlength="100"
                            placeholder="请输入内容"
                            show-word-limit
                            v-model="pushForm.cwbz">
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
import {postPoolTick,getMainList} from '@/api/pool/index.js'
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
        },
        rowData:{
            type:Object,
            default:()=> ({})
        },
        typeStatus:{
            type: Object,
            default: ()=> ({})
        }
    },
    components: {},
    data() {
        return {
            pushForm: {...this.rowData,},
            options:[],
            types:{...this.typeStatus,}
        };
    },
    computed: {},
    watch: {
        rowData:{
            handler(val){
                this.pushForm = {...val};
            },
            deep:true
        },
        typeStatus:{
            handler(val){
                this.types = {...val};
            },
            deep:true
        }
    },
    methods: {
        /* 关闭 */
        updateVisible(value) {
            this.$emit('update:visible', value);
        },

        /* 确认 */
        handleConfirm(){
            //this.updateVisible(false);
            //this.handleCloseModal(false);
            this.handleFormRequired();
        },

        /* 关闭前 */
        handleClose(){
            this.updateVisible(false)
        },
        /* 1 2 */
         /* 表单验证 */
         handleFormRequired(){
            this.$refs.formTick.validate((valid) => {
                if (valid) {
                    this.handleSubmitForm();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        /* 提交 */
        async handleSubmitForm(){
            let data = {
                type:this.types.type,
                state:this.typeStatus.status,
                ...this.pushForm,
                spzt: this.rowData.spzt === '1' ? '2' : '1'
            }
           
            try{
                const res = await postPoolTick(data)
                if([0,'0'].includes(res.code)){
                    this.$message.success("提交成功！")
                    this.updateVisible(false)
                    this.$emit("successDone",true)
                }else{
                    this.$message.error("提交错误！请联系管理员！")
                }
            }finally{}
        },
        /*进项税对应费用会计科目编码与名称 */
        async handleGetSelectList(){
            try{
                let params = {
                    nsrsbh:this.pushForm.gmfnsrsbh,
                }
                const res = await getMainList(params);
                if([0,'0'].includes(res.code)){
                    this.accSegmentOptions = res.data.map(k=> {return {label:k['accSegmentName'],value:k.accSegmentCode}})
                }
            }catch{

            }
        }
    },
    inject: ['optionList'],
    created() {
        this.handleGetSelectList()
    },
    mounted() {
        console.log(this.pushForm,"00")
    },
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