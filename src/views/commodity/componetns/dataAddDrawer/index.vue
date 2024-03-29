<template>
    <div class="">
        <el-drawer
        :title="title"
        :visible="visible"
        direction="rtl"
        :size="width"
        :modal-append-to-body="false"
        @update:visible="updateVisible"
        @open="handleOpen"
        @closed="handleClose"
        :show-close="false"
        :wrapper-closable="false"
       >
        <template v-slot:title>
            <article class="header" >
                <div class="title">{{ title }}</div>
                <div>
                    <el-button @click="updateVisible(false)">关闭</el-button>
                    <el-button type="primary" @click="handleAddSingle" :loading="loading">保存</el-button>
                </div>
            </article>
        </template>
           <article class="drawer_content" v-loading="loadings">
                <el-row :gutter="20">
                    <el-col :span="10">
                        <app-left-list  :mode="mode" @handleNodeClick="handleNodeClick" />
                    </el-col>
                    <el-col :span="14">
                        <el-card shadow="never" :body-style="{height:'100%', height: 'calc(100vh - 116px)',overflow: 'auto'}"> 
                            <el-form :model="addForm" :rules="ruleAddForm" ref="ruleAddForm" label-width="200px" class="demo-ruleForm">
                                <el-row :gutter="20" >
                                    <el-col :span="24">
                                        <el-form-item label="当前商品和服务税收分类编码" prop="orgids">
                                          <span style="">{{ isActiveName }}</span>
                                        </el-form-item>
                                        <el-form-item label="所属开票点" prop="orgids" >
                                            <el-select style="width:100%;" v-model="addForm.orgids" filterable 
                                            placeholder="请选择" clearable multiple @change="handlerOrgidsChange" @remove-tag="handlerRemoveTag">
                                                <el-option
                                                v-for="item in buillingOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="项目商品名称" prop="name">
                                            <el-input v-model="addForm.name" @blur="handleBlurEvent"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="商品和服务税收分类合并编码" prop="taxclasscode">
                                            <el-input v-model="addForm.taxclasscode" disabled></el-input>
                                        </el-form-item>
                                        <!-- <el-form-item label="增值税特殊管理" prop="taxclasscode">
                                            <el-input v-model="addForm.taxclasscode" disabled></el-input>
                                        </el-form-item> -->
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="商品和服务税收分类名称" prop="sphfwmc" >
                                            <el-input v-model="addForm.sphfwmc" disabled ></el-input>
                                            <span v-if="addForm.sm">说明:<span style="color:#333;font-size:12px">{{`${addForm.sm}`}}</span></span>
                                        </el-form-item>
                                        <!-- <el-form-item label="增值税特殊管理类型" prop="sphfwmc" >
                                            <el-input v-model="addForm.sphfwmc" disabled ></el-input>
                                            <span v-if="addForm.sm">说明:<span style="color:#333;font-size:12px">{{`${addForm.sm}`}}</span></span>
                                        </el-form-item> -->
                                    </el-col>
                                    <el-col :span="24">
                                        <!-- 商品和服务税收分简称 -->
                                        <el-form-item label="商品和服务税收分简称" prop="sphfwfljc">
                                            <el-input v-model="addForm.sphfwfljc" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <!-- 优惠政策及简易计税 -->
                                        <el-form-item label="增值税特殊管理" prop="xsyhzc">
                                            <el-radio-group v-model="addForm.xsyhzc" @input="handleRadioinput">
                                            <el-radio label="Y" >是</el-radio>
                                            <el-radio label="N" >否</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <!-- 优惠政策及简易计税类型 -->
                                        <el-form-item label="增值税特殊管理类型" prop="zzstsgl" :rules="[
                                        { required: (addForm.xsyhzc??'')!=='' === 'Y'? true : false, message: '请选择增值税特殊管理类型'},
                                        ]">
                                            <el-select style="width:100%" :disabled="addForm.xsyhzc === 'N'" 
                                            v-model="addForm.zzstsgl" placeholder="请选择" @change="handlertaxAess">
                                                <el-option
                                                v-for="item in taxAssOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="税率/征收率" prop="sl">
                                            <el-select style="width:100%" v-model="addForm.sl" placeholder="请选择">
                                                <el-option
                                                v-for="item in taxRateOption"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="单价" prop="dj">
                                            <el-input v-model="addForm.dj"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        
                                        <el-form-item label="单位" prop="dw">
                                            <!-- <el-input v-model="addForm.dw"></el-input> -->
                                            <el-select
                                            style="width:100%"
                                            filterable
                                            v-model="addForm.dw"
                                            row-key="id"
                                            placeholder="请选择或添加单位">
                                            <el-option
                                            v-for="item in dwOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                            </el-option>
                                        </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="规格型号" prop="ggxh">
                                            <el-input v-model="addForm.ggxh"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                
                            </el-form>
                        </el-card>
                    </el-col>
                </el-row>
            
           </article>
        </el-drawer>
    </div>
</template>

<script>
import AppLeftList from '../../leftList';
import {addCommonditySingle,getUnitList,getallBilling,getCommodityDes,getCommondityDes,updateCommondityRow,getNameDes} from '../../api.js';
export default {
    name:'addcommodityPage',
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

        dataLs: {
            type: [],
            default: ()=> []
        },

        commodityActiveId:{
            type: [String,Number],
            default:null
        },

        rowData:{
            type:Object,
            default: ()=> ({})
        }
    },  
    components: {AppLeftList},
    data() {
        return {
            mode:1,
            isShow: false,
            addForm:{
                
                xsyhzc:'N',
                classid: this.commodityActiveId,
                
            },
            ruleAddForm:{
                name:[{ required: true, message: '项目商品名称', trigger: 'blur' },],
                xsyhzc:[{ required: true, message: '请选择优惠政策及简易计税', trigger: 'blur' },],
                //zzstsgl:[{ required: , message: '请选择优惠政策及简易计税类型', trigger: 'blur' },],
                sl:[{ required: true, message: '请选择税率', trigger: 'blur' },]
            },
            dwOptions:[
                {
                    label:'分',
                    value:'分'
                },
                {
                    label:'角',
                    value:'角'
                },
                {
                    label:'元',
                    value:'元'
                },
                {
                    label:'千元',
                    value:'千元'
                },
                {
                    label:'万元',
                    value:'万元'
                },
                {
                    label:'亿元',
                    value:'亿元'
                },
                {
                    label:'两',
                    value:'两'
                },
                
            ],
            buillingOptions:[],
            taxAssOptions:[
                //{lable:'免税',value:'免税'}
            ],
            taxRateOption:[],
            
            addActiveId:this.commodityActiveId || null,
            loading:false,
            loadings:false,
            isActiveName:'',
            deepOption:[],
        };
    },
    computed: {},
    watch: {
        dataLs:{
            handler(val){
                //this.taxRateOption = [...val];
            }
        },
        commodityActiveId:{
            handler(val){
                this.addActiveId = val || null;
                this.classid = val;
            }
        },
        rowData:{
            handler(val){
                if(Object.keys(val).length > 0){
                    this.handlerEditDes(val)
                }
            },
            deep:true
        }
    },
    methods: {
       /* 编辑详情 */
       handlerEditDes(data){
        getCommondityDes(data).then(res=>{
            if(res.code === '0'){
                const {zsl,zzssl,zzstsgl} = res.data || {}
                this.addForm = {...res.data,taxclasscode:res.data.sphfwssflhbbm}
                this.addForm.orgids = this.addForm.orgids.map(k=> `${k}`);
                if(this.xsyhzc === 'N'){
                    this.addForm.zzstsgl = null;
                    this.addForm.ls = '';

                }
                if(this.addForm.orgids === '0'){
                    this.buillingOptions = this.buillingOptions.map(k=> {return {...k,disabled:true}})
                }
                if((zzstsgl??'') !==''){
                    let arr = zzstsgl.split('、');
                    this.taxAssOptions = arr.map(i=> {return {lable:i,value:i}})
                    console.log(zzstsgl.split(','))
                }
                if((zsl??'')!=='' && (zzssl??'')!==''){
                    let arr_ls = zsl.split('、');
                    let arr_ss = zzssl.split('、');
                    
                    this.deepOption = this.deepClone([
                        ...arr_ls.map(k=>{ return {label:k,value:Number(k.split('%')[0]) / 100}}),
                        ...arr_ss.map(i=> {return {label:i,value:Number(i.split('%')[0]) / 100}})
                    ])
                }
                if(zzstsgl === '免税' || zzstsgl === '不征税'){
                    zzstsgl === '免税'?this.$set(this,'taxRateOption',[{label:'免税',value:0}]):this.$set(this,'taxRateOption',[{label:'不征税',value:0}])
                }else{
                    this.taxRateOption = [...this.deepOption];
                }
                
            }
        })
       },
       /* 离开焦点事件 */
       handleBlurEvent(){
        console.log(this.addForm.name)
        if((this.addForm.name??'') !==''){
            this.handleGetCommodiyDesNameDes(this.addForm.name);
        }else{
            console.log('1')
        }
       },
       /* 请求商品详情 */
       handleGetCommodiyDesNameDes(data){
            this.loadings = true;
            getNameDes({spmc:data??''}).then(res=>{
                if(res.code === '0'){
                const {id,zsl,sphfwssflhbbm,sphfwmc,sphfwfljc,zzstsgl,sm,zzssl} = res.data || {};
                this.addForm ={
                        ...this.addForm,
                        sm:sm,
                        taxclasscode:sphfwssflhbbm,
                        sphfwmc,
                        sphfwfljc
                    }
                if((zzstsgl??'') !==''){
                    let arr = zzstsgl.split('、');
                    this.taxAssOptions = arr.map(i=> {return {lable:i,value:i}})
                    console.log(zzstsgl.split(','))
                }
                if((zsl??'')!=='' && (zzssl??'')!==''){
                        let arr_ls = zsl.split('、');
                        let arr_ss = zzssl.split('、');
                        this.taxRateOption = [
                            ...arr_ls.map(k=>{ return {label:k,value:Number(k.split('%')[0]) / 100}}),
                            ...arr_ss.map(i=> {return {label:i,value:Number(i.split('%')[0]) / 100}})
                        ]
                        this.deepOption = this.deepClone([
                            ...arr_ls.map(k=>{ return {label:k,value:Number(k.split('%')[0]) / 100}}),
                            ...arr_ss.map(i=> {return {label:i,value:Number(i.split('%')[0]) / 100}})
                        ])
                    }
            }
            }).finally(()=>{
                this.loadings = false
            })
       },
        /* save */
        handleAddSingle(){
            this.handlerSubmit();
        },
        /* 提交 */
        handlerSubmit(){
            this.loading = false;
        let data = {...this.addForm};
        this.$refs.ruleAddForm.validate(async (valid) => {
            if(valid){
                this.loading = true;
                try{
                    const res = Object.keys(this.rowData).length <=0? await  addCommonditySingle(data) : await updateCommondityRow(data)
                        if(res.code === '0'){
                            this.$message.success("操作成功！")
                            this.updateVisible(false)
                            this.$emit('saveDone',true)
                        }
                }finally{
                    this.loading = false;
                }
               
                
            }
        })
          
          
        },
        /* 点击回调 */
        handleNodeClick(val){
           
            if(val.sfhzx === '是') return
            this.isActiveName = val.sphfwmc || ''
            this.handleGetCommodiyDes(val)
            this.addForm.xsyhzc = 'N';
            this.addForm.zzstsgl = null;
            this.addForm.sl = '';
        },
        /* 获取商品服务详情信息 */
        handleGetCommodiyDes(data){
            this.taxRateOption = [];
            getCommodityDes(data).then(res=>{
                if(res.code === '0'){
                    console.log(res,"2342432")
                    const {id,zsl,sphfwssflhbbm,sphfwmc,sphfwfljc,zzstsgl,sm,zzssl} = res.data || {};
                    this.addForm ={
                            ...this.addForm,
                            sm:sm,
                            taxclasscode:sphfwssflhbbm,
                            sphfwmc,
                            sphfwfljc
                        }
                    if((zzstsgl??'') !==''){
                        let arr = zzstsgl.split('、');
                        this.taxAssOptions = arr.map(i=> {return {lable:i,value:i}}) ||  []
                        console.log(zzstsgl.split(','))
                    }else{
                        this.taxAssOptions = [];
                    }
                    if((zsl??'')!=='' && (zzssl??'')!==''){
                        let arr_ls = zsl.split('、');
                        let arr_ss = zzssl.split('、');
                        this.taxRateOption = [
                            ...arr_ls.map(k=>{ return {label:k,value:Number(k.split('%')[0]) / 100}}),
                            ...arr_ss.map(i=> {return {label:i,value:Number(i.split('%')[0]) / 100}})
                        ]
                        this.deepOption = this.deepClone([
                            ...arr_ls.map(k=>{ return {label:k,value:Number(k.split('%')[0]) / 100}}),
                            ...arr_ss.map(i=> {return {label:i,value:Number(i.split('%')[0]) / 100}})
                        ])
                    }
                    console.log(this.taxRateOption,this.deepOption,"this.taxRateOption")
                }
            })
        },
        /* 打开 */
        handleOpen(){
          
        },
        /* 获取开票点 */
        handlerGetBuilingList(){
            getallBilling({}).then(res=>{
                console.log(res,"2")
                if(res.code === '0'){
                    this.buillingOptions = res.data.map(k=> {return {...k,label:k.name,value:k.id}});
                    if(this.buillingOptions.length >0){
                        this.buillingOptions.unshift({label:'全部',value:'0'})
                    }
                   
                }
            })
        },
        /* 单位字典下拉获取 */
        handleUnitDictList(){
            getUnitList().then(res=>{
                if(res.code === '0'){
                    this.dwOptions = [...res.data.map(k=> {return {...k,label:k.name,value:k.name}})];
                }
               
            })
        },
        /* 单选变化 */
        handleRadioinput(val){
            this.addForm.zzstsgl = null;
            this.addForm.sl = '';
            if(val === 'N'){
                //this.taxRateOption = [...this.deepOption]
                this.$set(this,'taxRateOption',this.deepOption)
            }else{
               
               if(this.taxAssOptions.map(k=> k.value).includes('免税')){
                this.$set(this,'taxRateOption',[{label:'免税',value:0}])
               }else if(this.taxAssOptions.map(k=> k.value).includes('免征税')){
                this.$set(this,'taxRateOption',[{label:'不征税',value:0}])
               }
            }
            
        },
        /* 变化 */
        handlertaxAess(val){
            console.log(val)
            if(val === '免税' || val === '免征税'){
                //this.$set(this,'taxRateOption',[{label:'0% (免税 / 免征税)',value:0}])
                val === '免税'?this.$set(this,'taxRateOption',[{label:'免税',value:0}]):this.$set(this,'taxRateOption',[{label:'不征税',value:0}])
            }else{
                this.taxRateOption = [...this.deepOption]
            }
        },
        /* 开票点变化事件 */
        handlerOrgidsChange(val){
            const allOptions = this.buillingOptions.map(k => k.value)
            let orgidsIndex = val.indexOf("0");
            // 判断全选选项是否被选中
            if(orgidsIndex !== -1){
                if(val.length === allOptions.length) {  //如果全选后长度相同，则取消全选
                    val = [];
                } else { // 全选被选中且不是全选状态，进行全选
                    val = allOptions;
                }
            }
            this.addForm.orgids = val;
        },
        /* 移除 */
        handlerRemoveTag(val){
            if(val === '0'){
                this.addForm.orgids = [];
            }
        },
        /*关闭前 */
        handleClose(){
           // this.updateVisible(false);
        },

        /* 关闭 */
        updateVisible(value) {
            this.$emit('update:visible', value);
        },
        /*拷贝 */
        deepClone(obj, hash = new WeakMap()) {
            if (obj === null || typeof obj !== 'object') return obj;
            if (hash.has(obj)) return hash.get(obj);

            let clone = Array.isArray(obj) ? [] : {};
            hash.set(obj, clone);

            Object.keys(obj).forEach(key => {
                clone[key] = this.deepClone(obj[key], hash);
            });

            return clone;
        }

    },
    created() {
        
        this.mode = 1;
    },
    mounted() {
        
        this.handlerGetBuilingList();
        this.handleUnitDictList();
        if(Object.keys(this.rowData).length > 0){
            // this.addForm={...this.rowData}
            this.handlerEditDes(this.rowData)
        }
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
.drawer_content{
    padding: 8px;
    overflow: hidden;
}
.header{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .title{
        font-size: 18px;
        color: #000;
        font-weight: bold;
    }
}
::v-deep .el-drawer__header{
    border: 1px solid #eee;
    padding-bottom: 15px;
    margin-bottom: 15px;
}
/*@import url(); 引入公共css类*/
.grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
::v-deep .el-form-item{
    margin-bottom: 26px !important;
}
 
</style>
<style>
.demo-ruleForm .el-select__tags{
    max-height: 100px;
    overflow: hidden auto;
}
</style>
