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
        :show-close="false"
        :wrapper-closable="false"
        :before-close="handleClose">
        <template v-slot:title>
            <article class="header" >
                <div class="title">{{ title }}</div>
                <div>
                    <el-button @click="updateVisible(false)">关闭</el-button>
                    <el-button type="primary" @click="handleAddSingle">保存</el-button>
                </div>
            </article>
        </template>
           <article class="drawer_content">
                <el-row :gutter="20">
                    <el-col :span="10">
                        <app-left-list v-if="isShow" :mode="mode" @handleNodeClick="handleNodeClick" />
                    </el-col>
                    <el-col :span="14">
                        <el-card shadow="never" :body-style="{height:'100%', height: 'calc(100vh - 116px)',overflow: 'auto'}"> 
                            <el-form :model="addForm" :rules="ruleAddForm" ref="ruleAddForm" label-width="200px" class="demo-ruleForm">
                                <el-row :gutter="20" >
                                    <el-col :span="24">
                                        <el-form-item label="所属开票点" prop="orgids">
                                            <el-select style="width:100%" v-model="addForm.orgids" placeholder="请选择">
                                                <el-option
                                                v-for="item in []"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="项目商品名称" prop="name">
                                            <el-input v-model="addForm.name"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="商品和服务税收分类合并编码" prop="taxclasscode">
                                            <el-input v-model="addForm.taxclasscode" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="商品和服务税收分类名称" prop="sphfwmc" >
                                            <el-input v-model="addForm.sphfwmc" disabled ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="商品和服务税收分简称" prop="sphfwfljc">
                                            <el-input v-model="addForm.sphfwfljc" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="优惠政策及简易计税" prop="xsyhzc">
                                            <el-radio-group v-model="addForm.xsyhzc">
                                            <el-radio label="Y" >是</el-radio>
                                            <el-radio label="N" >否</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="优惠政策及简易计税类型" prop="zzstsgl">
                                            <el-select style="width:100%" v-model="addForm.zzstsgl" placeholder="请选择">
                                                <el-option
                                                v-for="item in []"
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
                                                v-for="item in []"
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
import {addCommonditySingle,getUnitList} from '../../api.js';
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
    },  
    components: {AppLeftList},
    data() {
        return {
            mode:null,
            isShow: false,
            addForm:{},
            ruleAddForm:{},
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
                
            ]
        };
    },
    computed: {},
    watch: {},
    methods: {

        /* save */
        handleAddSingle(){
            this.handlerSubmit();
        },
        /* 提交 */
       async handlerSubmit(){
        let data = {...this.addForm}
           const res = await  addCommonditySingle(data)
           console.log(res);
        },
        /* 点击回调 */
        handleNodeClick(val){
            console.log(val)
            if(val.sfhzx === '是') return
            const {id,sphfwssflhbbm,sphfwmc,sphfwfljc} = val || {}
            this.addForm ={
                ...this.addForm,
                classid: id,
                taxclasscode:sphfwssflhbbm,
                sphfwmc,
                sphfwfljc
            }
        },
        
        /* 打开 */
        handleOpen(){
            this.mode = 1;
            this.isShow = true;
        },

        /* 单位字典下拉获取 */
        handleUnitDictList(){
            getUnitList().then(res=>{
                if(res.code === '0'){
                    this.dwOptions = [...res.data];
                }
               
            })
        },
        /*关闭前 */
        handleClose(){
            this.updateVisible(false);
        },

        /* 关闭 */
        updateVisible(value) {
            this.$emit('update:visible', value);
        },
    },
    created() {},
    mounted() {
        this.handleUnitDictList()
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
