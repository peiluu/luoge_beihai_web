<template>
    <div class="custom-content">
        <el-form ref="form" :inline="true" :model="form" :rules="rules" label-width="180px">
            <template>
                <div class="form-title">基本信息</div>
                <el-form-item label="纳税人识别号" prop="nsrsbm">
                    <el-input :disabled="type=='detail'||rowid!=null" class="form-inline-input" v-model="form.nsrsbm"></el-input>
                </el-form-item>
                <el-form-item label="企业名称" prop="qymc">
                    <el-input :disabled="type=='detail'" class="form-inline-input" v-model="form.qymc"></el-input>
                </el-form-item>
                <el-form-item label="地区编号" prop="areaid">
                    <el-input :disabled="type=='detail'" class="form-inline-input" v-model="form.areaid"></el-input>
                </el-form-item>
                <el-form-item label="外管证编号" prop="wgzbh">
                    <el-input :disabled="type=='detail'" class="form-inline-input" v-model="form.wgzbh"></el-input>
                </el-form-item>
                <el-form-item label="登记序号" prop="djxhid">
                    <el-input :disabled="type=='detail'" class="form-inline-input" v-model="form.djxhid"></el-input>
                </el-form-item>
                <el-form-item label=" 申报密码" prop="sbmm">
                    <el-input class="form-inline-input" autocomplete="new-password" :show-password="true" v-model="form.sbmm"></el-input>
                </el-form-item>
                <el-form-item label="所属业态" prop="yt">
                    <!-- <el-select @change="getQyList" :disabled="type=='detail'||form.sftbhs==1" class="form-inline-input" v-model="form.yt" style="width: 100%;"> -->
                    <el-select 
                        @change="getQyList" 
                        :disabled="type=='detail'" 
                        class="form-inline-input" 
                        v-model="form.yt" 
                        style="width: 100%;"
                        clearable
                        filterable
                        @blur="selectYtBlur"
                        @clear="selectYtClear"
                    >
                        <el-option v-for="item in ytList" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属区域" prop="qy">
                    <!-- <el-select :disabled="type=='detail'||form.sftbhs==1" class="form-inline-input" v-model="form.qy" style="width: 100%;"> -->
                    <el-select 
                        :disabled="type=='detail'" 
                        class="form-inline-input" 
                        v-model="form.qy" 
                        style="width: 100%;"
                        clearable
                        filterable
                        @blur="selectQyBlur"
                        @clear="selectQyClear"
                    >
                        <el-option v-for="item in qyList" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
            </template>
            <template v-if="rowid">
                <el-divider></el-divider>
                <div class="form-title">税务信息</div>
                <el-form-item label="社会信用代码" prop="shxydm">
                    {{form.shxydm}}
                </el-form-item>
                <el-form-item label="行业代码" prop="hydm">
                    {{form.hydm}}
                </el-form-item>
                <el-form-item label="法人姓名" prop="frxm">
                    {{form.frxm}}
                </el-form-item>
                <el-form-item label=" 联系电话" prop="lxdh">
                    {{form.lxdh}}
                </el-form-item>
                <el-form-item label="生产经营地址" prop="scjydz">
                    {{form.scjydz}}
                </el-form-item>
                <el-form-item label="行业名称" prop="hymc">
                    {{form.hymc}}
                </el-form-item>
                <el-form-item label="经济类型名称代码" prop="jjlxmc">
                    {{form.jjlxmc}}
                </el-form-item>
                <el-form-item label=" 邮政编码" prop="yzbm">
                    {{form.yzbm}}
                </el-form-item>
                <el-form-item label="税收管理员代码" prop="ssglydm">
                    {{form.ssglydm}}
                </el-form-item>
                <el-form-item label=" 经济类型名称" prop="jjlxmc">
                    {{form.jjlxmc}}
                </el-form-item>
                <el-form-item label="街道乡镇代码" prop="jdxzdm">
                    {{form.jdxzdm}}
                </el-form-item>
                <el-form-item label="报税人姓名" prop="bsrxm">
                    {{form.bsrxm}}
                </el-form-item>
                <el-form-item label="税务机关代码" prop="swjgdm">
                    {{form.swjgdm}}
                </el-form-item>
                <el-form-item label=" 扣缴义务人代码" prop="kjywrdm">
                    {{form.kjywrdm}}
                </el-form-item>
                <el-form-item label="主管税务机关名称" prop="zgswjgmc">
                    {{form.zgswjgmc}}
                </el-form-item>
                <el-form-item label="税务机关名称" prop="swjgmc">
                    {{form.swjgmc}}
                </el-form-item>
                <el-form-item label="实名账号" prop="smzh">
                    {{form.smzh}}
                </el-form-item>
                <el-form-item label="主管税务分局所科名称" prop="zgswjgskmc">
                    {{form.zgswjgskmc}}
                </el-form-item>
                <el-form-item label="实名密码" prop="smmm">
                    {{form.smmm}}
                </el-form-item>
            </template>
            <template>
                <el-divider></el-divider>
                <el-form-item class="form-button">
                    <el-button v-if="type!='detail'" type="primary" @click="handleSubmit">保存</el-button>
                    <el-button type="primary" icon="el-icon-back" @click="handleBack">返回</el-button>
                </el-form-item>
            </template>
        </el-form>
    </div>
</template>
<script>
export default {
    name: "ObligorAdd",
    components: {
    },
    data() {
      return {
        business: require('@/utils/business'),
        ytList:[],
        qyList:[],
        form:{
            sftbhs: '0'
        },
        rules: {
            nsrsbm: [
                { required: true, message: '请输入纳税人识别号', trigger: 'blur' },
                { trigger: 'blur',validator: this.validateNsrsbm }
            ],
            qymc: [
                { required: true, message: '请输入企业名称', trigger: 'blur' },
                { min: 1, max: 255, message: '不能超过255个字符', trigger: 'blur' },
            ],
            areaid: [
                { required: true, message: '请输入地区编号', trigger: 'blur' },
                { trigger: 'blur',validator: this.validateDqbh }
            ],
            wgzbh: [
                { trigger: 'blur',validator: this.validateWgzbh }
            ],
            djxhid: [
                { trigger: 'blur',validator: this.validateWgzbh }
            ],
            sbmm: [
                { required: true, message: '请输入申报密码', trigger: 'blur' },
                { trigger: 'blur',validator: this.validatePassword },
            ],
            yt: [
                { required: true, message: '请输入业态', trigger: 'yt' },
            ],
            qy: [
                { required: true, message: '区域', trigger: 'qy' },
            ],
        }
      };
    },
    computed: {
        rowid() {
            return this.$route.query.rowid;
        },
        type(){
            return this.$route.query.type;
        },
        request_host() {
            return this.$store.state.app.host
        },
    },
    activated(){
      if(this.rowid){
        this.fetchDetail(this.rowid)
      }
    },
    mounted(){
        if(this.rowid){
            this.fetchDetail(this.rowid)
        }
        this.getYtList();
    },
    methods: {
        getYtList(){
            let that = this;
            that.business.customPost(that.request_host + "/SalaryGroup/getAllyt",
                {"Content-Type":"application/text"},{},
                res => {
                    that.ytList = res.data;
                }
            );
        },
        getQyList(value){
            let that = this;
            if(value){
                that.business.customPost(that.request_host + "/SalaryGroup/getQyByYt?yt="+value,
                    {"Content-Type":"application/text"},{},
                    res => {
                        that.qyList = res.data;
                        that.$set(that.form,'qy','');
                    }
                );
            }
        },
        selectYtBlur(e) {
            if (e.target.value !== '') {
                this.form.yt = e.target.value;
                this.$forceUpdate()   // 强制更新
            }
        },
        selectYtClear() {
            this.$set(this.form,'yt', '');
            this.$forceUpdate()
        },
        selectQyBlur(e) {
            if (e.target.value !== '') {
                this.$set(this.form,'qy', e.target.value);
                this.$forceUpdate()   // 强制更新
            }
        },
        selectQrClear() {
            this.$set(this.form,'qy', '');
            this.$forceUpdate()
        },
        fetchDetail(id){
            let that = this;
            this.business.customPost(that.request_host+"/Taxpayer/detail",
                {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                JSON.stringify({"id": id}),
                res => {
                    if(res.code==0){
                        that.form = res.data
                        that.form.sftbhs = res.data.sftbhs + '';
                    }
                }
            );
        },
        handleSubmit(){
            let that = this;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let url;
                    if(that.form.id){
                        url = that.request_host+"/Taxpayer/update"
                    }else {
                        url = that.request_host+"/Taxpayer/add"
                    }
                    this.business.customPost(url,
                        {"Content-Type":"application/json","Data-Type":"json"},
                        JSON.stringify(that.form),
                        res => {
                            if(res.code==0){
                                that.$message({
                                    message: "保存成功",
                                    type: 'success',
                                    onClose: function(){
                                        that.$router.push({path: "/obligorManage-ObligorList"})
                                    }
                                });
                            }else {
                                that.$message.error("保存失败");
                            }
                        }
                    );
                }
            });
        },
        handleBack(){
            this.$router.push({path: "/obligorManage-ObligorList"})
        },
        fetchHsInfo(){
            let that = this;
            this.business.customPost(that.request_host+"/Taxpayer/getInfo/"+that.form.nsrsbm,
                {'Content-Type': 'application/text; charset=utf-8'},
                {},
                res => {
                    that.$set(that.form,'yt',res.data && res.data.yt ? res.data.yt : '其他');
                    that.$set(that.form,'qy',res.data && res.data.qy ? res.data.qy : '其他');
                    that.$set(that.form,'qymc',res.data && res.data.qymc ? res.data.qymc : '');
                }
            );
        }
    },
  };
</script>
<style lang="scss" scoped>
.el-form{
    width: 100%;
    margin-bottom: 10px;
    .el-form-item{
        width: calc(50% - 20px);
        ::v-deep .el-form-item__content{
            width: calc(100% - 180px);
        }
    }
}
.main{
    overflow: scroll;
}
</style>
