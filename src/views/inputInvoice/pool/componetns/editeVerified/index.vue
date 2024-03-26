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
                <el-form ref="formEdite" :model="pushForm" :rules="editeRules" label-width="280px">
                    <el-form-item label="入账状态：">
                        <el-select style="width:100%" disabled v-model="pushForm.rzzt" placeholder="请选择" clearable filterable>
                            <el-option
                            v-for="item in rzztOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="入账属期：">
                        <el-date-picker disabled style="width:100%"
                            v-model="pushForm.rzsq"
                            type="month"
                            placeholder="选择月">
                            </el-date-picker>
                    </el-form-item>
                    <el-form-item label="凭证号：">
                        <el-input v-model="pushForm.wspzh" disabled placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="所属账套：">
                        <el-select style="width:100%" disabled  v-model="pushForm.orgid" placeholder="请选择" clearable filterable>
                            <el-option
                            v-for="(item) in orgidList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="进项税对应费用会计科目编码与名称：" prop="accSegment">
                        <el-select style="width:100%"  v-model="pushForm.accSegment" placeholder="请选择" clearable filterable>
                            <el-option
                            v-for="item in accSegmentOptions"
                            :key="item.value"
                            :label="`${item.label} ${item.value}`"
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
import {postPoolEditebook,getOrgnizationList,getMainList} from '@/api/pool/index.js'
export default {
    name:'editeVerifiedPage',
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
            pushForm:{
                // rzzt:'01',
                // wspzh:'gBmADr3Hzkn9LVdKjwba',
                // rzsq:'2024-02',
                 orgid:'',
                ...this.rowData,
            },
            accSegmentOptions:[
                // {label:'应交税费/待认证进项税额/工程类',value:'22210401'},
                // {label:'应交税费/待认证进项税额/费用类',value:'22210402'}
            ],
            rzztOptions:[
                {label:'未入账',value:'01',},
                {label:'入账(企业所得税税前扣除)',value:'02',},
                {label:'入账(企业所得税不扣除)',value:'03',},
                {label:'入账撤销',value:'06',disabled:true},
            ],
            editeRules:{
                accSegment:[{
                    required:true, message:'请选择进项税对应费用会计科目编码与名称',tigger:'blur'
                }]
            },
            orgidOption:[],
            types:{...this.typeStatus,},
            orgidList:[]
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
            this.handleSubmitForm()
        },

        /* 关闭前 */
        handleClose(){
            this.updateVisible(false);
        },
        /* 表单验证 */
        handleFormRequired(){
            this.$refs.formEdite.validate((valid) => {
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
                ...this.pushForm,
            }
           
            try{
                const res = await postPoolEditebook(data)
                if([0,'0'].includes(res.code)){
                    this.$message.success("提交成功！")
                    this.updateVisible(false)
                    this.$emit("successDone",true)
                }else{
                    this.$message.error("提交错误！请联系管理员！")
                }
            }finally{}
        },
        /* 所属套账 */
        async handleGetList(){
            let parmas = {
                nsrsbh:this.pushForm.gmfnsrsbh,
                isInvoice:'N',
                isSelectAll:'N',
            }
            try{
                const res = await getOrgnizationList(parmas);
                if([0,'0'].includes(res.code)){
                   this.$nextTick(()=>{
                    this.orgidList = res.data;
                    
                   })
                    
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
        this.handleGetList()
    },
    mounted() {
       this.handleGetSelectList()
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