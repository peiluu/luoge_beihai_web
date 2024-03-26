<template>
    <div class="lg_dialog">
        <el-dialog
        :title="title"
        :visible="visible"
        :width="width"
        @update:visible="updateVisible"
        :before-close="handleClose">
           <article class="dailog_info">
            <el-form ref="formEnter" :model="pushForm" :rules="editeRules" label-width="280px">
                    <el-form-item label="申请勾选类型：" prop="rzzt">
                        <el-select style="width:100%" :disabled="isDisabled" v-model="pushForm.rzzt" placeholder="请选择" clearable filterable>
                            <el-option
                            v-for="(item,index) in rzztOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="入账属期：" prop="rzsq">
                        <el-date-picker style="width:100%"
                            v-model="pushForm.rzsq"
                            type="month"
                            placeholder="选择月"
                            :disabled="isDisabled"
                            value-format="yyyy-MM">
                            </el-date-picker>
                    </el-form-item>
                    <el-form-item label="凭证号：">
                        <el-input v-model="pushForm.wspzh" :disabled="isDisabled" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="所属账套：">
                        <el-select style="width:100%" :disabled="isDisabled" v-model="pushForm.orgid" placeholder="请选择" clearable filterable>
                            <el-option
                            v-for="item in orgidList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="进项税对应费用会计科目编码与名称：">
                        <el-select style="width:100%" :disabled="isDisabled" v-model="pushForm.accSegment" placeholder="请选择" clearable filterable>
                            <el-option
                            v-for="item in accSegmentOptions"
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
                <el-button type="primary" @click="handleFormRequired">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {postPoolInAccount,getOrgnizationList,getMainList} from '@/api/pool/index.js'
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
           // useTitle:this.title
           pushForm:{rzzt:'',rzsq:'',...this.rowData},
           
           rzztOptions:[
                {label:'入账(企业所得税税前扣除)',value:'02',},
                {label:'入账(企业所得税不扣除)',value:'03',},
                {label:'入账撤销',value:'06', disabled: true}
           ],
           orgidOptions:[],
           accSegmentOptions:[
                {label:'应交税费/待认证进项税额/工程类',value:'22210401'},
                {label:'应交税费/待认证进项税额/费用类',value:'22210402'}
           ],
           types:{...this.typeStatus,},
           editeRules:{
                rzzt:[{
                    required:true, message:'申请勾选类型不能为空！',tigger:'blur'
                }],
                rzsq:[{
                    required:true, message:'入账属期不能为空',tigger:'blur'
                }]
            },
            isDisabled:false,
            orgidList:[],
        };
    },
    computed: {
        
    },
    watch: {
        rowData:{
            handler(val){
                this.pushForm = {rzzt:'',rzsq:'',...val};
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
        
        /* 关闭前 */
        handleClose(){
            this.updateVisible(false);
        },
        //  1 2
        handleInit(){
            if(this.types.status === 1){
               this.$set(this.pushForm, 'rzzt', '02')
               this.isDisabled = false;
            }else{
                this.rzztOptions = [{label:'入账撤销',value:'06',}]
                this.isDisabled = true;
               this.$set(this.pushForm, 'rzzt', '06')
            }
           
        },
         /* 表单验证 */
         handleFormRequired(){
            this.$refs.formEnter.validate((valid) => {
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
                state:this.types.status,
                ...this.pushForm,
            }
            try{
                const res = await postPoolInAccount(data)
                if([0,'0'].includes(res.code)){
                    this.$message.success("提交成功！")
                    this.updateVisible(false);
                    this.$emit("successDone",true)
                }else{
                    this.$message.error("提交错误！请联系管理员！")
                }
            }finally{}
        },
        /* 所属套账 */
        async handleGetList(){
            let parmas = {
                nsrsbh:this.pushForm.gmfNsrsbh,
                isInvoice:'N',
                isSelectAll:'N',
            }
            try{
                const res = await getOrgnizationList(parmas);
                if([0,'0'].includes(res.code)){
                   
                    this.orgidList = res.data;
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
        this.handleInit()
        this.handleGetSelectList();
    },
    mounted() {
        this.handleGetList();
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