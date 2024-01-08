<template>
    <div class="custom-content">
        <el-form ref="form" :inline="true" :model="form" :rules="rules" label-width="180px" style="margin-bottom: 0;">
            <template>
                <div class="form-title">基本信息</div>
                <el-form-item label="企业名称">
                    {{qymc}}
                </el-form-item>
                <el-form-item label="人员状态" prop="nsrzt">
                    <el-switch :disabled="opt=='detail'" active-text="正常" inactive-text="非正常" active-value="正常" inactive-value="非正常" v-model="form.nsrzt"></el-switch>
                </el-form-item>
                <el-form-item label="是否内部员工" prop="hzfygbz" style="display: none;">
                    <el-switch disabled active-text="是" inactive-text="否" active-value="是" inactive-value="否" v-model="form.hzfygbz"></el-switch>
                </el-form-item>
                <!--<el-form-item v-if="form.hzfygbz=='否'" label="合作方企业" prop="hzfmc">
                    <el-select :disabled="opt=='detail'" class="form-inline-input" v-model="form.hzfmc" style="width: 100%;" :placeholder="zdlsb==0?'请选择':'零申报请选择“公共-零申报企业”'">
                        <el-option v-for="item in partners" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>-->
                <el-form-item label="证件类型" prop="zzlx">
                    <el-select :disabled="opt=='detail'||form.sbzt==4" class="form-inline-input" v-model="form.zzlx" style="width: 100%;">
                        <el-option key="jmsfz" label="居民身份证" value="居民身份证"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件号码" prop="zzhm">
                    <el-input :disabled="opt=='detail'||form.sbzt==4" class="form-inline-input" v-model="form.zzhm" @input="generateCsny"></el-input>
                </el-form-item>
                <el-form-item label="员工姓名" prop="xm">
                    <el-input :disabled="opt=='detail'||form.sbzt==4" class="form-inline-input" v-model="form.xm"></el-input>
                </el-form-item>
                <el-form-item label="国籍（地区）" prop="gj">
                    <el-select :disabled="opt=='detail'||form.sbzt==4" class="form-inline-input" v-model="form.gj" style="width: 100%;">
                        <el-option key="zg" label="中国" value="中国"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="性别" prop="xb">
                    <el-select :disabled="opt=='detail'" class="form-inline-input" v-model="form.xb" style="width: 100%;" clearable>
                        <el-option key="nan" label="男" value="男"></el-option>
                        <el-option key="nv" label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学历" prop="xl">
                    <el-select :disabled="opt=='detail'" class="form-inline-input" v-model="form.xl" style="width: 100%;" clearable>
                        <el-option key="yjs" label="研究生" value="研究生"></el-option>
                        <el-option key="dxbk" label="大学本科" value="大学本科"></el-option>
                        <el-option key="dxbkyx" label="大学本科以下" value="大学本科以下"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出生日期" prop="csny">
                    <el-date-picker value-format="yyyy-MM-dd" disabled v-model="form.csny" type="date" style="width: 100%"></el-date-picker>
                </el-form-item>
                <br/>
                <el-form-item label="是否存在以下情形">
                    <el-checkbox :disabled="opt=='detail'" true-label="是" false-label="否" v-model="form.sfcj">残疾</el-checkbox>
                    <el-checkbox :disabled="opt=='detail'" true-label="是" false-label="否" v-model="form.sfls">烈属</el-checkbox>
                    <el-checkbox :disabled="opt=='detail'" true-label="是" false-label="否" v-model="form.sfgl">孤老</el-checkbox>
                </el-form-item>
                <el-form-item label="烈属证号" prop="lszh" v-if="form.sfls=='是'">
                    <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.lszh"></el-input>
                </el-form-item>
                <el-form-item label="残疾证号" prop="cjzh" v-if="form.sfcj=='是'">
                    <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.cjzh"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="备注" prop="bz" style="width:calc(100% - 40px);">
                    <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.bz"></el-input>
                </el-form-item>
            </template>
            <template>
                <el-divider></el-divider>
                <div class="form-title">任职受雇从业信息</div>
                <el-form-item label="任职受雇从业类型" prop="sfgy">
                    <el-select :disabled="opt=='detail'" class="form-inline-input" v-model="form.sfgy" style="width: 100%;" clearable>
                        <el-option key="gy" label="雇员" value="雇员"></el-option>
                        <el-option key="bxyxr" label="保险营销人" value="保险营销人"></el-option>
                        <el-option key="zqjjr" label="证券经纪人" value="证券经纪人"></el-option>
                        <el-option key="sxxs" label="实习学生（全日制学历教育）" value="实习学生（全日制学历教育）"></el-option>
                        <el-option key="qt" label="其他" value="其他"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任职受雇从业日期" prop="rzsgrq">
                    <el-date-picker :disabled="opt=='detail'" value-format="yyyy-MM-dd" v-model="form.rzsgrq" type="date" style="width: 100%"></el-date-picker>
                </el-form-item>
                <el-form-item v-if="form.nsrzt=='非正常'" label="离职日期" prop="lzrq">
                    <el-date-picker :disabled="opt=='detail'" value-format="yyyy-MM-dd" v-model="form.lzrq" type="date" style="width: 100%"></el-date-picker>
                </el-form-item>
                <!--<el-form-item label="离职日期" prop="lzrq" :rules="form.nsrzt=='正常'?[{required: false}]:rules.lzrq">
                    <el-date-picker :disabled="opt=='detail'" value-format="yyyy-MM-dd" v-model="form.lzrq" type="date" style="width: 100%"></el-date-picker>
                </el-form-item>-->
                <el-form-item label="是否扣除减除费用" prop="sfzdw">
                    <el-select :disabled="opt=='detail'" class="form-inline-input" v-model="form.sfzdw" style="width: 100%;" clearable>
                        <el-option key="yes" label="是" value="是"></el-option>
                        <el-option key="no" label="否" value="否"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="入职年度就业情形" prop="rzndjyqk" >
                    <el-select clearable :disabled="opt=='detail' || (form.sfgy!='雇员' && form.sfgy!='保险营销人' && form.sfgy!='证券经纪人')" class="form-inline-input" v-model="form.rzndjyqk" style="width: 100%;">
                        <el-option key="student" label="当年首次入职学生" value="当年首次入职学生"></el-option>
                        <el-option key="other" label="当年首次入职其他人员" value="当年首次入职其他人员"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工号" prop="ryid">
                    <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.ryid"></el-input>
                </el-form-item>
                <el-form-item label=" 职务" prop="zw">
                    <el-select :disabled="opt=='detail'" class="form-inline-input" v-model="form.zw" style="width: 100%;" clearable>
                        <el-option key="gc" label="高层" value="高层"></el-option>
                        <el-option key="pt" label="普通" value="普通"></el-option>
                    </el-select>
                </el-form-item>
            </template>
            <template>
                <el-divider></el-divider>
                <div class="form-title">联系方式</div>
                <el-form-item label="手机号码" prop="lxdh">
                    <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.lxdh"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱" prop="dzyx">
                    <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.dzyx"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="经常居住地" prop="jcjzd">
                    <el-cascader :disabled="opt=='detail'" style="width:100%;" v-model="form.jcjzd"
                                 :options="districts"
                                 filterable
                                 :props="{value:'txt',label:'txt'}"
                                @change="chooseJcjzd"></el-cascader>
                </el-form-item>
                <el-form-item style="width:calc(33.3% + 160px);" prop="lxdz">
                    <el-input :disabled="opt=='detail'" v-model="form.lxdz"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="联系地址" prop="wjrlxdz">
                    <el-cascader :disabled="opt=='detail'" style="width:100%;" v-model="form.wjrlxdz"
                                 :options="districts"
                                 filterable
                                 :props="{value:'txt',label:'txt'}"
                                 @change="chooseWjrlxdz"></el-cascader>
                </el-form-item>
                <el-form-item style="width:calc(33.3% + 160px);" prop="wjrlxdzXxdz">
                    <el-input :disabled="opt=='detail'" v-model="form.wjrlxdzXxdz"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label=" 开户银行" prop="khyh">
                    <el-select :disabled="opt=='detail'" class="form-inline-input" v-model="form.khyh" filterable style="width: 100%" clearable>
                        <el-option v-for="(item, index) in banks" :key="index" :label="item.txt" :value="item.txt"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开户行省份" prop="khyhsfmz">
                    <el-select :disabled="opt=='detail'" class="form-inline-input" v-model="form.khyhsfmz" filterable style="width: 100%" clearable>
                        <el-option v-for="(item,index) in provinces" :key="index" :label="item.txt" :value="item.txt"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="银行账号" prop="yhzh">
                    <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.yhzh"></el-input>
                </el-form-item>
                <el-form-item label="户籍所在地" prop="hjszd">
                    <el-cascader :disabled="opt=='detail'" style="width:100%;" v-model="form.hjszd"
                                 :options="districts"
                                 filterable
                                 :props="{value:'txt',label:'txt'}"
                                 @change="chooseHjszd"></el-cascader>
                </el-form-item>
                <el-form-item style="width:calc(33.3% + 160px);" prop="hjszdXxdz">
                    <el-input :disabled="opt=='detail'" v-model="form.hjszdXxdz"></el-input>
                </el-form-item>
            </template>
            <template style="padding-bottom: 50px;">
                <el-divider></el-divider>
                <div class="form-title">投资信息</div>
                <el-form-item label="个人投资总额" prop="grgbze">
                    <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.grgbze" type="number" @blur="ceil(form, 'grgbze',2)"></el-input>
                </el-form-item>
                <el-form-item label="个人投资比例（%）" prop="grgbbl">
                    <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.grgbbl" type="number" @blur="ceil4(form, 'grgbbl')"></el-input>
                </el-form-item>
            </template>
            <template>
                <el-divider></el-divider>
                <el-form-item class="form-button">
                    <el-button v-if="opt!='detail'" type="primary" @click="handleSubmit">保存</el-button>
                    <el-button type="primary" icon="el-icon-back" @click="handleBack">返回</el-button>
                </el-form-item>
            </template>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: "EmployeeInnerForm",
        props: {
            form: Object,
            opt: String,
            partners: Array,
            qymc: String,
            zdlsb: String,
        },
        data() {
            return {
                business: require('@/utils/business'),
                districts: [],
                banks: [],
                provinces: [],
                rules: {
                    nsrzt: [
                        { required: true, message: '人员状态不能为空', trigger: 'blur' },
                    ],
                    /*hzfmc: [
                        { required: true, message: '合作方名称不能为空', trigger: 'blur' },
                    ],*/
                    hzfygbz: [
                        { required: true, message: '是否内部员工不能为空', trigger: 'blur' },
                    ],
                    zzlx: [
                        { required: true, message: '证件类型不能为空', trigger: 'blur' },
                    ],
                    zzhm: [
                        { required: true, message: '证件号码不能为空', trigger: 'blur' },
                        { trigger: 'blur',validator: this.verify_idcard }
                    ],
                    xm: [
                        { required: true, message: '员工姓名不能为空', trigger: 'blur' },
                        { trigger: 'blur',validator: this.verify_person_name }
                    ],
                    gj: [
                        { required: true, message: '国籍不能为空', trigger: 'blur' },
                    ],
                    xb: [
                        { required: true, message: '性别不能为空', trigger: 'blur' },
                    ],
                    cjzh: [{ required: true, message: '残疾证号不能为空', trigger: 'blur' }],
                    sfgy: [
                        { required: true, message: '任职受雇从业类型不能为空', trigger: 'blur' },
                    ],
                    rzsgrq: [
                        { required: true, message: '任职受雇从业日期不能为空', trigger: 'blur' },
                    ],
                    lzrq: [
                        { required: true, message: '离职日期不能为空', trigger: 'blur' },
                    ],
                    lxdh: [
                        { required: true, message: '手机号码不能为空', trigger: 'blur' },
                        { trigger: 'blur',validator: this.verify_mobile }
                    ],
                    dzyx: [
                        { trigger: 'blur',validator: this.verify_email }
                    ],
                }
            };
        },
        methods: {
            //初始化行政区划
            initDistrictDict(){
                let that = this;
                this.business.customPost(that.request_host+"/Dict/listCascaderDict/1",
                    {'Content-Type': 'application/json; charset=utf-8'},{},
                    res => {
                        that.districts = res.data;
                    }
                );
            },
            //初始化省
            initProvinceDict(){
                let that = this;
                this.business.customPost(that.request_host+"/Dict/listDict/1",
                    {'Content-Type': 'application/json; charset=utf-8'},{},
                    res => {
                        that.provinces = res.data;
                    }
                );
            },
            //初始化银行
            initBankDict(){
                let that = this;
                this.business.customPost(that.request_host+"/Dict/listDict/16349",
                    {'Content-Type': 'application/json; charset=utf-8'},{},
                    res => {
                        that.banks = res.data;
                    }
                );
            },
            generateCsny(){
                if( this.form.zzhm.length >= 14){
                    var syear = this.form.zzhm.substr(6, 4);
                    var smonth = this.form.zzhm.substr(10, 2);
                    var sday = this.form.zzhm.substr(12, 2);
                    this.$set(this.form, "csny", syear + '-' + smonth  + '-' + sday);
                    if(this.getGender(this.form.zzhm)===1){
                        this.$set(this.form, "xb", '女');
                    }else if(this.getGender(this.form.zzhm)===0){
                        this.$set(this.form, "xb", '男');
                    }else {
                        this.$set(this.form, "xb", '');
                    }
                }else {
                    this.$set(this.form, "csny", "");
                    this.$set(this.form, "xb", '');
                }
            },
            chooseJcjzd(value){
                this.form.lxdzSheng = value[0] || '';
                this.form.lxdzShi = value[1] || '';
                this.form.lxdzQx = value[2] || '';
                this.form.lxdzJd = value[3] || '';
            },
            chooseWjrlxdz(value){
                this.form.wjrlxdzSheng = value[0] || '';
                this.form.wjrlxdzShi = value[1] || '';
                this.form.wjrlxdzQx = value[2] || '';
                this.form.wjrlxdzJd = value[3] || '';
            },
            chooseHjszd(value){
                this.form.hjszdSheng = value[0] || '';
                this.form.hjszdShi = value[1] || '';
                this.form.hjszdQx = value[2] || '';
                this.form.hjszdJd = value[3] || '';
            },
            handleSubmit(){
                let that = this;
                that.$refs.form.validate((valid) => {
                    if (valid) {
                        that.$emit('handleSubmit', that.form);
                    } else {
                        return false;
                    }
                });
            },
            handleBack(){
                this.$emit('handleBack');
            },
        },
        computed: {
            request_host() {
                return this.$store.state.app.host
            }
        },
        activated() {
            this.initDistrictDict();
            this.initBankDict();
            this.initProvinceDict();
        },
        mounted() {
            this.initDistrictDict();
            this.initBankDict();
            this.initProvinceDict();
        }
    };
</script>

