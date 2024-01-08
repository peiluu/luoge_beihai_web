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
                <el-form-item label="是否内部员工" prop="hzfygbz" style="display:none;">
                    <el-switch disabled active-text="是" inactive-text="否" active-value="是" inactive-value="否" v-model="form.hzfygbz"></el-switch>
                </el-form-item>
                <!--<el-form-item v-if="form.hzfygbz=='否'" label="合作方企业" prop="hzfmc">
                    <el-select :disabled="opt=='detail'" class="form-inline-input" v-model="form.hzfmc" style="width: 100%;" :placeholder="zdlsb==0?'请选择':'零申报请选择“公共-零申报企业”'">
                        <el-option v-for="item in partners" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>-->
                <el-form-item label="证件类型" prop="zzlx">
                    <el-select :disabled="opt=='detail'&&form.sbzt==4" class="form-inline-input" v-model="form.zzlx" style="width: 100%;" clearable>
                        <el-option key="zghz" label="中国护照" value="中国护照"></el-option>
                        <el-option key="gatxz" label="港澳居民来往内地通行证" value="港澳居民来往内地通行证"></el-option>
                        <el-option key="twtxz" label="台湾居民来往大陆通行证" value="台湾居民来往大陆通行证"></el-option>
                        <el-option key="gajzz" label="中华人民共和国港澳居民居住证" value="中华人民共和国港澳居民居住证"></el-option>
                        <el-option key="twjzz" label="中华人民共和国台湾居民居住证" value="中华人民共和国台湾居民居住证"></el-option>
                        <el-option key="wghz" label="外国护照" value="外国护照"></el-option>
                        <el-option key="wgryjsfz" label="外国人永久居留身份证（外国人永久居留证）" value="外国人永久居留身份证（外国人永久居留证）"></el-option>
                        <el-option key="wgrgzxkz_a" label="中华人民共和国外国人工作许可证（A类）" value="中华人民共和国外国人工作许可证（A类）"></el-option>
                        <el-option key="wgrgzxkz_b" label="中华人民共和国外国人工作许可证（B类）" value="中华人民共和国外国人工作许可证（B类）"></el-option>
                        <el-option key="wgrgzxkz_c" label="中华人民共和国外国人工作许可证（C类）" value="中华人民共和国外国人工作许可证（C类）"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件号码" prop="zzhm">
                    <el-input :disabled="opt=='detail'||form.sbzt==4" class="form-inline-input" v-model="form.zzhm"></el-input>
                </el-form-item>
                <el-form-item label="员工姓名" prop="xm">
                    <el-input :disabled="opt=='detail'||form.sbzt==4" class="form-inline-input" v-model="form.xm"></el-input>
                </el-form-item>
                <el-form-item label="国籍（地区）" prop="gj">
                    <el-select class="form-inline-input" v-model="form.gj" filterable style="width: 100%" :disabled="opt=='detail'||form.zzlx=='中国护照'||form.zzlx=='台湾居民来往大陆通行证' || form.zzlx =='中华人民共和国台湾居民居住证'||form.sbzt==4" clearable>
                        <el-option v-for="item in countrys" :key="item.codeId" :label="item.txt" :value="item.txt"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="其他证件类型" prop="qtzzlx">
                    <el-select :disabled="opt=='detail'" class="form-inline-input" v-model="form.qtzzlx" style="width: 100%;" clearable>
                        <el-option v-for="(qtzzlx, index) in qtzzlxOptions" :key="index" :label="qtzzlx" :value="qtzzlx"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="其他证件号码" prop="qtzzhm">
                    <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.qtzzhm"></el-input>
                </el-form-item>
                <el-form-item label="出生国家（地区）" prop="csd">
                    <el-select :disabled="opt=='detail'" class="form-inline-input" v-model="form.csd" filterable style="width: 100%" clearable>
                        <el-option v-for="item in countrys" :key="item.codeId" :label="item.txt" :value="item.txt"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="中文名" prop="xmzw">
                    <el-input :disabled="opt=='detail'||!form.zzlx || form.zzlx=='中国护照'||form.zzlx=='港澳居民来往内地通行证' || form.zzlx =='台湾居民来往大陆通行证'||form.zzlx=='中华人民共和国港澳居民居住证'||form.zzlx=='中华人民共和国台湾居民居住证'" class="form-inline-input" v-model="form.xmzw"></el-input>
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
                    <el-date-picker :disabled="opt=='detail'" value-format="yyyy-MM-dd" v-model="form.csny" type="date" style="width: 100%"></el-date-picker>
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
                <div class="form-title">任职受雇和出入境信息</div>
                <el-form-item label="任职受雇从业类型" prop="sfgy">
                    <el-select :disabled="opt=='detail'" class="form-inline-input" v-model="form.sfgy" style="width: 100%;" clearable>
                        <el-option key="gy" label="雇员" value="雇员"></el-option>
                        <el-option key="bxyxr" label="保险营销人" value="保险营销人"></el-option>
                        <el-option key="zqjjr" label="证券经纪人" value="证券经纪人"></el-option>
                        <el-option key="sxxs" label="实习学生（全日制学历教育）" value="实习学生（全日制学历教育）"></el-option>
                        <el-option key="qt" label="其他" value="其他"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="涉税事由" prop="sssx">
                    <el-select :disabled="opt=='detail'" class="form-inline-input" v-model="form.sssx" multiple style="width: 100%;" clearable>
                        <el-option key="rzsg" label="任职受雇" value="任职受雇"></el-option>
                        <el-option key="tglslw" label="提供临时劳务" value="提供临时劳务"></el-option>
                        <el-option key="zrcc" label="转让财产" value="转让财产"></el-option>
                        <el-option key="cstzhjyhd" label="从事投资和经营活动" value="从事投资和经营活动"></el-option>
                        <el-option key="qt" label="其他" value="其他"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任职受雇从业日期" prop="rzsgrq" :rules="form.sfgy=='其他'?[{required: false}]:rules.rzsgrq">
                    <el-date-picker :disabled="opt=='detail'" value-format="yyyy-MM-dd" v-model="form.rzsgrq" type="date" style="width: 100%"></el-date-picker>
                </el-form-item>
                <el-form-item v-if="form.nsrzt=='非正常'" label="离职日期" prop="lzrq">
                    <el-date-picker :disabled="opt=='detail'" value-format="yyyy-MM-dd" v-model="form.lzrq" type="date" style="width: 100%"></el-date-picker>
                </el-form-item>
                <!--<el-form-item   label=" 离职日期" prop="lzrq" :rules="form.nsrzt=='正常'?[{required: false}]:rules.lzrq">
                    <el-date-picker :disabled="opt=='detail'" value-format="yyyy-MM-dd" v-model="form.lzrq" type="date" style="width: 100%"></el-date-picker>
                </el-form-item>-->
                <el-form-item label="首次入境时间" prop="scrjsj" :rules="form.sfgy!='雇员'?[{required: false}]:rules.scrjsj">
                    <el-date-picker :disabled="opt=='detail'" value-format="yyyy-MM-dd" v-model="form.scrjsj" type="date" style="width: 100%"></el-date-picker>
                </el-form-item>
                <el-form-item label=" 预计离境时间" prop="yjljsj" :rules="form.sfgy!='雇员'?[{required: false}]:rules.yjljsj">
                    <el-date-picker :disabled="opt=='detail'" value-format="yyyy-MM-dd" v-model="form.yjljsj" type="date" style="width: 100%"></el-date-picker>
                </el-form-item>
                <el-form-item label="是否扣除减除费用" prop="sfzdw">
                    <el-select :disabled="opt=='detail'" class="form-inline-input" v-model="form.sfzdw" style="width: 100%;" clearable>
                        <el-option key="yes" label="是" value="是"></el-option>
                        <el-option key="no" label="否" value="否"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="入职年度就业情形" prop="rzndjyqk">
                    <el-select :disabled="opt=='detail'||form.sfgy!='雇员' && form.sfgy!='保险营销人' && form.sfgy!='证券经纪人'" class="form-inline-input" v-model="form.rzndjyqk" style="width: 100%;" clearable>
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
                                 @change="chooseJcjzd" clearable></el-cascader>
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
                                 @change="chooseWjrlxdz" clearable></el-cascader>
                </el-form-item>
                <el-form-item style="width:calc(33.3% + 160px);" prop="wjrlxdzXxdz">
                    <el-input :disabled="opt=='detail'" v-model="form.wjrlxdzXxdz"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label=" 开户银行" prop="khyh">
                    <el-select :disabled="opt=='detail'" class="form-inline-input" v-model="form.khyh" filterable style="width: 100%" clearable>
                        <el-option v-for="(item,index) in banks" :key="index" :label="item.txt" :value="item.txt"></el-option>
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
                                 @change="chooseHjszd" clearable></el-cascader>
                </el-form-item>
                <el-form-item style="width:calc(33.3% + 160px);" prop="hjszdXxdz">
                    <el-input :disabled="opt=='detail'" v-model="form.hjszdXxdz"></el-input>
                </el-form-item>
            </template>
            <template>
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

    const zzlxData = [
        {"name":"中国护照", "value": 1},
        {"name":"港澳居民来往内地通行证", "value": 2},
        {"name":"台湾居民来往大陆通行证", "value": 3},
        {"name":"中华人民共和国港澳居民居住证", "value": 4},
        {"name":"中华人民共和国台湾居民居住证", "value": 5},
        {"name":"外国护照", "value": 6},
        {"name":"外国人永久居留身份证（外国人永久居留证）", "value": 7},
        {"name":"中华人民共和国外国人工作许可证（A类）", "value": 8},
        {"name":"中华人民共和国外国人工作许可证（B类）", "value": 9},
        {"name":"中华人民共和国外国人工作许可证（C类）", "value": 10},
    ]
    export default {
        name: "EmployeeOuterForm",
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
                format: "yyyy-MM-dd",
                districts: [],
                banks: [],
                countrys: [],
                qtzzlxOptions: [],
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
                        { trigger: 'blur',validator: this.verifyZzhm }
                    ],
                    xm: [
                        { required: true, message: '员工姓名不能为空', trigger: 'blur' },
                        { trigger: 'blur',validator: this.verifyZzhm }
                    ],
                    gj: [
                        { required: true, message: '国籍不能为空', trigger: 'blur' },
                    ],
                    qtzzhm: [
                        { trigger: 'blur',validator: this.verifyZzhm }
                    ],
                    xb: [
                        { required: true, message: '性别不能为空', trigger: 'blur' },
                    ],
                    csny: [
                        { required: true, message: '出生日期不能为空', trigger: 'blur' },
                    ],
                    csd:[
                        { required: true, message: '出生国家（地区）不能为空', trigger: 'blur' },
                    ],
                    cjzh: [{ required: true, message: '残疾证号不能为空', trigger: 'blur' }],
                    sssx: [
                        { required: true, message: '涉税事由不能为空', trigger: 'blur' },
                    ],
                    scrjsj:[{ required: true, message: '首次入境时间', trigger: 'blur' }],
                    yjljsj:[{ required: true, message: '预计离境时间', trigger: 'blur' }],
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
            //初始化国家
            initCountryDict(certType){
                let that = this;
                let param = {};
                if(certType){
                    param.certType = certType;
                }
                this.business.customPost(that.request_host+"/Dict/listDict/4525",
                    {'Content-Type': 'application/json; charset=utf-8'}, param,
                    res => {
                        that.countrys = res.data;
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
            },
            zzlx(){
                return this.form.zzlx;
            }
        },
        watch: {
            zzlx(val){
                if(val=="中国护照"){
                    this.initCountryDict(1);
                    this.$set(this.form, "gj","中国");
                    this.$set(this.form, "qtzzlx","");
                    this.qtzzlxOptions = ["中国护照"];
                }else if(val=="港澳居民来往内地通行证"){
                    this.initCountryDict(2);
                    this.$set(this.form, "gj","");
                    this.$set(this.form, "qtzzlx","");
                    this.qtzzlxOptions = ["中华人民共和国港澳居民居住证"];
                }else if(val=="中华人民共和国港澳居民居住证"){
                    this.initCountryDict(2);
                    this.$set(this.form, "gj","");
                    this.$set(this.form, "qtzzlx","");
                    this.qtzzlxOptions = ["港澳居民来往内地通行证"];
                }else if(val=="台湾居民来往大陆通行证" ){
                    this.initCountryDict(3);
                    this.$set(this.form, "gj","中国台湾");
                    this.$set(this.form, "qtzzlx","");
                    this.qtzzlxOptions = ["中华人民共和国台湾居民居住证"];
                }else if(val=="中华人民共和国台湾居民居住证"){
                    this.initCountryDict(3);
                    this.$set(this.form, "gj","中国台湾");
                    this.$set(this.form, "qtzzlx","");
                    this.qtzzlxOptions = ["台湾居民来往大陆通行证"];
                }else if(val=="外国护照"){
                    this.initCountryDict(4);
                    this.$set(this.form, "gj","");
                    this.$set(this.form, "qtzzlx","");
                    this.qtzzlxOptions = ["外国护照", "外国人永久居留身份证（外国人永久居留证）", "中华人民共和国外国人工作许可证（A类）", "中华人民共和国外国人工作许可证（B类）", "中华人民共和国外国人工作许可证（C类）"];
                }else if(val=="外国人永久居留身份证（外国人永久居留证）"){
                    this.initCountryDict(4);
                    this.$set(this.form, "gj","");
                    this.$set(this.form, "qtzzlx","");
                    this.qtzzlxOptions = ["外国护照"];
                }else {
                    this.initCountryDict();
                    this.$set(this.form, "gj","");
                    this.$set(this.form, "qtzzlx","");
                    this.qtzzlxOptions = ["外国护照"];
                }
            }
        },
        activated() {
            this.initDistrictDict();
            this.initBankDict();
            this.initCountryDict();
            this.initProvinceDict();
        },
        mounted() {
            this.initDistrictDict();
            this.initBankDict();
            this.initCountryDict();
            this.initProvinceDict();
        }
    };
</script>