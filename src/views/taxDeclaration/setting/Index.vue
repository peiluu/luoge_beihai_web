<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="mini" label-position="right">
      <el-form-item label="纳税人名称" prop="nsrsbh">
        <el-select size="small" filterable v-model="form.nsrsbh" @change="taxBodyChange" style="width: 100%;">
          <el-option v-for="option in taxBodyOptions" :key="option.nsrsbh" :label="`${option.nsrmc} ${option.nsrsbh}`" v-model="option.nsrsbh"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主管税局">
        <el-input disabled size="small" v-model="form.taxArea"></el-input>
      </el-form-item>
      <el-form-item label="所属业态">
        <el-input disabled size="small" v-model="form.business"></el-input>
      </el-form-item>
    </el-form>
    <div class="add-btn">
      <el-button size="small" type="primary" @click.stop="chooseTax">选择税种</el-button>
    </div>
    <div class="_content">
      <el-collapse v-model="activeName" accordion>

        <!--基础设置start-->
        <!-- <el-collapse-item name="1" :disabled="!form.nsrsbh">
          <template slot="title">
            <div class="_left">基础设置</div>
            <el-button v-if="activeName == 1" size="small" type="primary" @click.stop="save(1)">保存</el-button>
          </template>
          <el-form ref="form1" :inline="true" :model="form1" :rules="rules1" size="mini" >
            <el-col :span="6">
              <el-form-item label="是否每月7号自动创建申报表" prop="sfzdscbb">
                <el-checkbox v-model="form1.sfzdscbb"></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同报表系统编码" prop="htbbxtbm">
                <el-input size="small" v-model="form1.htbbxtbm" ></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-collapse-item> -->
        <!--基础设置end-->

        <!--企业所得税start-->
        <el-collapse-item name="2" v-show="hasTaxType('sds')">
          <template slot="title">
            <div class="_left">企业所得税预缴设置</div>
            <el-button v-if="activeName == 2" size="small" type="primary" @click.stop="save(2)">保存</el-button>
          </template>
          <el-form ref="form2" :inline="true" :model="form2" :rules="rules2" size="mini" label-position="right" class="basic-form">

            <el-form-item label="是否启用" prop="enable">
              <el-select size="small" filterable v-model="form2.enable">
                <el-option key="1" label="是" value="Y"></el-option>
                <el-option key="2" label="否" value="N"></el-option>
              </el-select>
            </el-form-item>


            <el-form-item label="是否自动创建申报表" prop="sfzdscbb">
              <el-select size="small" filterable v-model="form2.sfzdscbb">
                <el-option key="1" label="是" value="Y"></el-option>
                <el-option key="2" label="否" value="N"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="税率" prop="slv">
              <el-select size="small" filterable v-model="form2.slv" disabled>
                <el-option key="1" label="15%" :value="0.15"></el-option>
                <el-option key="2" label="25%" :value="0.25"></el-option>
              </el-select>
            </el-form-item>

            <!--<el-col :span="6">
              <el-form-item label="企业类型" prop="qylx">
                <el-select size="small" filterable v-model="form2.qylx" @change="qylxChange">
                  <el-option key="1" label="一般企业" value="1"></el-option>
                  <el-option key="5" label="跨地区经营汇总纳税企业总机构" value="2"></el-option>
                  <el-option key="4" label="跨地区经营汇总纳税企业分支机构" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>-->

            <el-form-item label="预缴方式" prop="yjfs">
              <el-select size="small" filterable v-model="form2.yjfs">
                <el-option key="1" label="按实际利润额预缴" value="1"></el-option>
                <el-option key="2" label="按照上一纳税年度应纳税所得额平均额预缴" value="2"></el-option>
                <el-option key="3" label="按照税务机关确定的其他方法预缴" value="3"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="上年度是否汇算清缴" prop="sfhsqj">
              <el-select size="small" filterable v-model="form2.sfhsqj" @change="sfhsqjChange">
                <el-option key="1" label="是" value="Y"></el-option>
                <el-option key="2" label="否" value="N"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否国家限制或禁止行业" prop="sfgjjzhy">
              <el-select size="small" filterable v-model="form2.sfgjjzhy">
                <el-option key="1" label="是" value="Y"></el-option>
                <el-option key="2" label="否" value="N"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="申报内容" prop="templateId">
              <el-select filterable class="form-inline-input" size="small" v-model="form2.templateId">
                <el-option v-for="option in sdsTemplateOptions" :key="option.id" :label="option.templateName" v-model="option.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="填报周期" prop="tbzq">
              <el-select size="small" filterable v-model="form2.tbzq" disabled>
                <el-option key="1" label="月" value="月"></el-option>
                <el-option key="2" label="季" value="季"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="是否享受减免所得税额优惠" prop="sfjmsds">
              <el-select size="small" filterable v-model="form2.sfjmsds">
                <el-option key="1" label="是" value="Y"></el-option>
                <el-option key="2" label="否" value="N"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="合并报表系统编码" prop="hbbbbmList">
              <MutSelect :selectList="dataHbbbCodeList" :size="'small'" :key="form.nsrsbh" :defaultValue="form2.hbbbbmList || []" propsParam="hbbbbmList" @getMutSelectForm="getMutSelectForm" />
            </el-form-item>

            <div>
              <el-form-item label="是否为总/分公司" prop="sfzfjg">
                <el-radio size="small" v-model="form2.sfzfjg" label="N" @change="qylxChange">一般企业</el-radio>
                <el-radio size="small" v-model="form2.sfzfjg" label="Y" @change="qylxChange">总分机构关系</el-radio>
              </el-form-item>
            </div>

            <div v-if="form2.sfzfjg === 'Y'">

              <el-form-item label=" " prop="sffgs">
                <el-radio size="small" v-model="form2.sffgs" label="N" @change="qylxChange">总公司</el-radio>
                <el-radio size="small" v-model="form2.sffgs" label="Y" @change="qylxChange">分公司</el-radio>
              </el-form-item>

              <el-form-item v-if="form2.sffgs === 'Y'" label="总公司" prop="zgsId">
                <el-select size="small" v-model="form2.zgsId" placeholder="请选择总公司" filterable clearable>
                  <el-option v-for="item in zgsList" :key="item.id" :label="item.nsrmc" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <template v-if="form2.sffgs === 'N'">
                <el-form-item label="是否汇总申报" prop="sfhzsb">
                  <el-select size="small" v-model="form2.sfhzsb" placeholder="请选择" filterable clearable>
                    <el-option key="1" label="是" value="Y"></el-option>
                    <el-option key="2" label="否" value="N"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="汇总申报合并报表系统编码" prop="hzhbbbbm" v-if="form2.sfhzsb === 'Y'">
                  <el-input size="small" v-model="form2.hzhbbbbm" placeholder="请输入" suffix-icon="el-icon-date" />
                </el-form-item> -->
              </template>
            </div>
            <el-form-item class="flex-item" v-if="form2.sfzfjg === 'Y' && form2.sffgs === 'N'" label="总机构的独立生产经营部门" prop="sfdlscjy">
              <el-radio size="small" v-model="form2.sfdlscjy" label="N">无独立生产经营部门</el-radio>
              <el-radio size="small" v-model="form2.sfdlscjy" label="Y">有独立生产经营部门</el-radio>
              <template v-if="form2.sfdlscjy == 'Y'">
                <el-button @click="addFunction" size="small" type="primary">+</el-button>
                <span class="info-tip">存在{{ form2.dlscjybmList.length || 0 }}个部门</span>
              </template>
            </el-form-item>

            <el-col :span="24" v-if="form2.sfjmsds == 'Y'">
              <div style="marginBottom: 10px">
                <el-button size="small" type="primary" @click="addYhfs">添加优惠方式</el-button>
              </div>
              <template v-for="(item, index) in form2.jmyhList">
                <el-descriptions :column="4" size="small" :colon="false" border :key="index">
                  <el-descriptions-item label="减免所得税额类别">
                    <el-select size="small" filterable v-model="item.yhzclb" @change="(e) => getjmyhmc(e, index)">
                      <el-option v-for="option in jmyhflOptions" :key="option.lb" :label="option.lbmc" v-model="option.lb"></el-option>
                    </el-select>
                  </el-descriptions-item>
                  <el-descriptions-item label="减免所得税额事项名称">
                    <el-select size="small" filterable v-model="item.yhzcmc" @change="(e) => selectJmyhfs(e, index)">
                      <el-option v-for="option in item.jmyhmcOptions || []" :key="option.id" :label="option.mc" v-model="option.dm"></el-option>
                    </el-select>
                  </el-descriptions-item>
                  <el-descriptions-item label="减免所得税额方式">
                    <el-select size="small" filterable v-model="item.yhfsid" :disabled="item.disabled == 'Y'">
                      <el-option v-for="option in jmyhfsOptions" :key="option.id" :value="parseInt(option.id)" :label="option.name" v-model="option.id"></el-option>
                    </el-select>
                  </el-descriptions-item>

                  <el-descriptions-item>
                    <template slot="label">
                      <el-button size="small" type="primary" @click="removeYhfs(item, index)">删除</el-button>
                    </template>
                  </el-descriptions-item>
                </el-descriptions>
              </template>
            </el-col>

          </el-form>
        </el-collapse-item>
        <!--企业所得税end-->

        <!--增值税start-->
        <el-collapse-item name="3" v-show="hasTaxType('zzs')">
          <template slot="title">
            <div class="_left">增值税申报设置</div>
            <el-button v-if="activeName == 3" size="small" type="primary" @click.stop="save(3)">保存</el-button>
          </template>
          <el-form ref="form3" :inline="true" :model="form3" :rules="rules3" size="mini">

            <!--<el-form-item label="是否自动创建申报表" prop="enable">
              <el-select size="small" filterable v-model="form3.enable">
                <el-option key="1" label="是" value="Y"></el-option>
                <el-option key="2" label="否" value="N"></el-option>
              </el-select>
            </el-form-item>-->

            <el-form-item label="是否自动创建申报表" prop="sfzdscbb">
              <el-select size="small" filterable v-model="form3.sfzdscbb">
                <el-option key="1" label="是" value="Y"></el-option>
                <el-option key="2" label="否" value="N"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="纳税人类型" prop="nsrlx">
              <el-select size="small" filterable v-model="form3.nsrlx" @change="nsrlxChange">
                <el-option key="1" label="一般纳税人" value="1"></el-option>
                <el-option key="2" label="小规模纳税人" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="企业类型" prop="qylx" v-if="form3.nsrlx == 1">
              <el-select size="small" filterable v-model="form3.qylx">
                <el-option key="1" label="微型企业" value="1"></el-option>
                <el-option key="2" label="小型企业" value="2"></el-option>
                <el-option key="3" label="中型企业" value="3"></el-option>
                <el-option key="4" label="大型企业" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="适用加计抵减政策" prop="syjjdjzc" v-if="form3.nsrlx == 1">
              <el-select size="small" filterable v-model="form3.syjjdjzc">
                <el-option v-for="option in jjdj" :key="option.id" :label="option.sl" v-model="option.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否存在即征即退项目" prop="sfczjzjt" v-if="form3.nsrlx == 1">
              <el-select size="small" filterable v-model="form3.sfczjzjt">
                <el-option key="1" label="是" value="1"></el-option>
                <el-option key="2" label="否" value="2"></el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="减按后征收率" prop="jazsl">
              <el-select size="small" filterable v-model="form3.jazsl">
                <el-option key="1" label="3%" value="1"></el-option>
                <el-option key="2" label="1%" value="2"></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item label="申报内容" prop="templateId">
              <el-select filterable class="form-inline-input" size="small" v-model="form3.templateId">
                <el-option v-for="option in zzsTemplateOptions" :key="option.id" :label="option.templateName" v-model="option.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="填报周期" prop="tbzq">
              <el-select size="small" filterable v-model="form3.tbzq" disabled>
                <el-option key="1" label="月" value="月"></el-option>
                <el-option key="2" label="季" value="季"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="城市维护建设税税率" prop="cjssl">
              <el-select size="small" filterable v-model="form3.cjssl">
                <el-option v-for="option in cswhjs" :key="option.id" :label="option.sl" v-model="option.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="教育费附加征收率" prop="jyfjsl">
              <el-select size="small" filterable v-model="form3.jyfjsl">
                <el-option v-for="option in jyfj" :key="option.id" :label="option.sl" v-model="option.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地方教育费附加征收率" prop="dfjyfjsl">
              <el-select size="small" filterable v-model="form3.dfjyfjsl">
                <el-option v-for="option in dfjyfj" :key="option.id" :label="option.sl" v-model="option.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="本期是否适用小微企业“六税两费”减免政策" prop="sflslf" v-if="form3.nsrlx == 1">
              <el-select size="small" filterable v-model="form3.sflslf">
                <el-option key="1" label="不享受" value="N"></el-option>
                <el-option key="2" label="享受" value="Y"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="六税两费减征政策适用主体" prop="lslfsyzt" v-if="form3.nsrlx == 1 && form3.sflslf == 'Y'">
              <el-select size="small" filterable v-model="form3.lslfsyzt">
                <el-option key="1" label="个体工商户" value="个体工商户"></el-option>
                <el-option key="2" label="小型微利企业" value="小型微利企业"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <!--增值税end-->

        <!--其他税种start-->
        <el-collapse-item name="4" v-show="hasTaxType('qtsz')">
          <template slot="title">
            <div class="_left">其他税种申报设置</div>
            <el-button v-if="activeName == 4" size="small" type="primary" @click.stop="save(4)">保存</el-button>
          </template>
          <el-form ref="form4" :inline="true" :model="form4" :rules="rules4" size="mini">
            <el-form-item label="是否自动创建申报表" prop="sfzdscbb">
              <el-select size="small" filterable v-model="form4.sfzdscbb">
                <el-option key="1" label="是" value="Y"></el-option>
                <el-option key="2" label="否" value="N"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <!--其他税种end-->
      </el-collapse>
    </div>
    <!-- 编辑独立生产经营部门 -->
    <DepartmentDialogForm :dlscjybmList="form2.dlscjybmList" :dataHbbbCodeList="dataHbbbCodeList" @changeDlscjybmList="changeDlscjybmList" :taxBodyId="taxBodyId" ref="departmentDialogForm" />

    <el-dialog title="选择税种" :visible.sync="chooseTaxVisible" width="500px" height="500px">
      <el-checkbox-group
        v-model="checkedTaxType">
        <el-checkbox v-for="taxType in taxTypes" :label="taxType.code" :key="taxType.id">{{taxType.name}}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer">
        <el-button size="mini" @click="closeTaxChoose">取消</el-button>
        <el-button type="success" size="mini" @click="saveTaxChoose">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import DepartmentDialogForm from './DepartmentDialogForm/Index';
import MutSelect from '@/components/MutSelect';
// import CustomeVxePulldown from './CustomeVxePulldown.vue';
import { saveBaseSetting, saveIncomeSetting, saveValueAddSetting, getDataHbbbCode } from "./Api";
import { getTemplateDetailJson } from '../../reportTools/templateMng/Api';
export default {
  name: 'TaxDeclaration',
  components: {
    DepartmentDialogForm, MutSelect
  },
  data() {
    return {
      api: require('./Api'),
      templateApi: require('../../reportTools/templateMng/Api'),
      taxBodyOptions: [],
      activeName: null,

      zzsTemplateOptions: [],
      sdsTemplateOptions: [],
      jmyhmcOptions: [],
      jmyhfsOptions: [],
      jmyhflAllOptions: [],
      jmyhflOptions: [],
      jyfj: [],
      dfjyfj: [],
      cswhjs: [],
      jjdj: [],
      sdsl: [],
      dataHbbbCodeList: [],
      zgsList: [],
      taxBodyId: '',
      form: {},
      rules: {
        nsrsbh: [{ required: true, message: '内容必填', trigger: 'blur' }],
      },
      form1: {
      },
      rules1: {
      },
      form2: {
        jmyhList: [{}],
        dlscjybmList: []
      },
      rules2: {
        slv: [{ required: true, message: '内容必填', trigger: 'blur' }],
        yjfs: [{ required: true, message: '内容必填', trigger: 'blur' }],
        sfhsqj: [{ required: true, message: '内容必填', trigger: 'blur' }],
        templateId: [{ required: true, message: '内容必填', trigger: 'blur' }],
        tbzq: [{ required: true, message: '内容必填', trigger: 'blur' }],
        sfjmsds: [{ required: true, message: '内容必填', trigger: 'blur' }],
        sffgs: [{ required: true, message: "请选择", trigger: "blur" }],
        sfdlscjy: [{ required: true, message: "请选择", trigger: "blur" }],
        sfzfjg: [{ required: true, message: "请选择", trigger: "blur" }],
        zgsId: [{ required: true, message: "请选择", trigger: "blur" }],
        hbbbbm: [{ required: true, message: '内容必填', trigger: 'blur' }],
        hzhbbbbm: [{ required: true, message: '内容必填', trigger: 'blur' }],
        hbbbbmList: [{ required: true, message: '请选择 ', trigger: 'blur' }],
        sfzdscbb: [{ required: true, message: "请选择", trigger: "blur" }],
        sfhzsb: [{ required: true, message: "请选择", trigger: "blur" }],
        enable: [{ required: true, message: "请选择", trigger: "blur" }],
        sfgjjzhy: [{ required: true, message: "请选择", trigger: "blur" }],
      },

      form3: {
        jmyhList: [{}],
      },
      rules3: {
        nsrlx: [{ required: true, message: '内容必填', trigger: 'blur' }],
        syjjdjzc: [{ required: true, message: '内容必填', trigger: 'blur' }],
        sfczjzjt: [{ required: true, message: '内容必填', trigger: 'blur' }],
        jazsl: [{ required: true, message: '内容必填', trigger: 'blur' }],
        templateId: [{ required: true, message: '内容必填', trigger: 'blur' }],
        tbzq: [{ required: true, message: '内容必填', trigger: 'blur' }],
        cjssl: [{ required: true, message: '内容必填', trigger: 'blur' }],
        jyfjsl: [{ required: true, message: '内容必填', trigger: 'blur' }],
        dfjyfjsl: [{ required: true, message: '内容必填', trigger: 'blur' }],
        sflslf: [{ required: true, message: '内容必填', trigger: 'blur' }],
        lslfsyzt: [{ required: true, message: '内容必填', trigger: 'blur' }],
        sfzdscbb: [{ required: true, message: "请选择", trigger: "blur" }],
        enable: [{ required: true, message: "请选择", trigger: "blur" }],
        qylx: [{ required: true, message: "请选择", trigger: "blur" }],

      },
      form4:{},
      rules4:{

      },
      taxTypes: [],
      chooseTaxVisible: false,
      oldCheckedTaxType: [],
      checkedTaxType: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getDicCommon();
      this.getTaxBody({});
      this.getjmyhfl();
      this.getjmyhfs();
      this.getZgsList()
      this.getDataHbbbCode()
      this.getTaxTypes()
    })
  },
  watch: {

  },
  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
  },

  methods: {
    //判断企业是否配置该税种
    hasTaxType(type){
      let flag = false;
      this.checkedTaxType.forEach(e=>{
        if(e==type){
          flag = true;
          return
        }
      });
      return flag;
    },
    getTaxTypes(){
      this.api.getTaxTypes().then(res => {
        this.taxTypes = res.data;
      })
    },
    chooseTax(){
      if(!this.form.nsrsbh){
        this.$message.warning("请先选择纳税主体");
        return;
      }
      this.chooseTaxVisible = true;
    },
    saveTaxChoose(){
      this.api.saveTaxCheckedTypes({checkedTaxTypes: this.checkedTaxType, nsrsbh: this.form.nsrsbh}).then(res => {
        this.$message.success("保存成功");
        this.chooseTaxVisible = false;
        this.getReportSetting(this.form.nsrsbh);
      })
    },
    closeTaxChoose(){
      this.checkedTaxType = [...this.oldCheckedTaxType];
      this.chooseTaxVisible = false;
    },
    getTaxBody(param) {
      this.api.getTaxBody(param).then(res => {
        this.taxBodyOptions = res.data
      })
    },
    /**减免所得税优惠事项*/
    getjmyhfl(param) {
      this.api.getjmyhfl(param).then(res => {
        this.jmyhflAllOptions = res.data
      })
    },
    /**减免所得税优惠事项名称*/
    getjmyhmc(lb, index) {
      this.api.getjmyhmc({ lb }).then(res => {
        this.$set(this.form2.jmyhList, index, { ...this.form2.jmyhList[index], jmyhmcOptions: res.data, yhzcmc: '' })
      })
    },
    selectJmyhfs(e, index) {
      let jmfs = this.form2.jmyhList[index].jmyhmcOptions.find(item => item.dm == e);
      if (jmfs?.jmfs) {
        this.$set(this.form2.jmyhList, index, { ...this.form2.jmyhList[index], yhfsid: jmfs.jmfs, disabled: 'Y' })
      } else {
        this.$set(this.form2.jmyhList, index, { ...this.form2.jmyhList[index], yhfsid: '', disabled: 'N' })
      }
    },
    /**减免所得税优惠方式*/
    getjmyhfs(param) {
      this.api.getjmyhfs(param).then(res => {
        this.jmyhfsOptions = res.data
      })
    },
    /** 合并报表编码*/
    getDataHbbbCode() {
      this.api.getDataHbbbCode({ hbbbbmList: [] }).then(res => {
        this.dataHbbbCodeList = [{ value: 'all', label: '全选', slots: { default: 'checkAll' } }].concat(res.data.map((item) => {
          return {
            ...item,
            value: item.hbztbm,
            label: `${item.hbztmc} ${item.hbztbm}`,
            slots: { default: 'checkbox' }
          }
        }))

      })
    },
    getMutSelectForm(val) {
      this.form2.hbbbbmList = val
    },
    /**sdsl所得税税率，jjdj加计抵减，cswhjs城市维护建设，jyfj教育附加，dfjyfj地方教育附加*/
    getDicCommon(param) {
      this.api.getDicCommon().then(res => {
        this.jyfj = res.data.jyfj;
        this.dfjyfj = res.data.dfjyfj;
        this.cswhjs = res.data.cswhjs;
        this.jjdj = res.data.jjdj;
        this.sdsl = res.data.sdsl;
      })
    },

    sfhsqjChange() {
      if (this.form2.sfhsqj === 'N') {
        this.$message.warning('本项设定为否时， 本年弥补以前年度亏损数据将为0，是否确认？');
      }
    },
    taxBodyChange(value, $event) {
      const option = this.taxBodyOptions.find(item => item.nsrsbh == value);
      this.form.business = option.businessFormat;
      this.taxBodyId = option.id
      this.form.taxArea = option.taxArea;
      this.getReportSetting(value);
    },
    getReportSetting(value){
      this.api.getReportSetting({ nsrsbh: value }).then(res => {
        this.form1 = { ...res.data, sfzdscbb: res.data.sfzdscbb == "Y" };
        this.form2 = {
          ...res.data.sdsSetting,
          dlscjybmList: res.data.sdsSetting.dlscjybmList || []
        };
        if(res.data.taxCheckedType!=null){
          this.oldCheckedTaxType = res.data.taxCheckedType.checkedTaxTypes;
        }else {
          this.oldCheckedTaxType = [];
        }
        this.checkedTaxType = [...this.oldCheckedTaxType];
        this.form3 = res.data.zzsSetting;
        //根据返回结果设置增值税填报周期，月、季
        this.setForm3tbzq(this.form3.nsrlx);
        //企业所得税全部按季申报
        this.form2.tbzq = '季';
        this.form2.slv = 0.25;
        //获取增值税模板列表
        this.selectZzsTemplateList(this.form3.nsrlx);
        //获取所得税模板列表与所得税优惠下拉选项
        this.selectSdsSelect();
        //所得税优惠政策的优惠方式是否可选
        this.checkJmfsDisabled();
      })
    },
    nsrlxChange(value, $event) {
      this.setForm3tbzq(value);
      this.form3.templateId = null;
      this.selectZzsTemplateList(value);
    },
    setForm3tbzq(value) {
      if (value == 2) {
        this.form3.tbzq = '季';
      } else {
        this.form3.tbzq = '月';
      }
    },
    selectZzsTemplateList(value) {
      //申报模板类型：一般纳税人，小规模纳税人等。
      let templateType = null;
      if (value == 1) {
        //一般纳税人
        templateType = 2;
      } else if (value == 2) {
        //小规模纳税人
        templateType = 3;
      }
      if (templateType) {
        let param = { templateType: templateType };
        this.templateApi.selectExpTemplateList(param).then(res => {
          this.zzsTemplateOptions = res.data
        });
      }
    },
    qylxChange() {
      this.form2.jmyhList = [];
      this.form2.templateId = null;
      this.selectSdsSelect();
    },
    selectSdsSelect() {
      //所有优惠政策
      let optionList = this.jmyhflAllOptions;
      let templateType = null;
      //是否总分机构，N一般企业。Y总分机构
      if (this.form2.sfzfjg == "N") {
        //一般企业
        templateType = 1;
      } else {
        //非否分公司：N总公司，Y分公司
        if (this.form2.sffgs == "N") {
          //总机构
          templateType = 4;
        } else {
          //分支机构
          templateType = 5;
          //分支机构只能选择区域性优惠
          optionList = this.jmyhflAllOptions.filter(item => item.lb == 7);
        }
      }
      //优惠类别下拉
      this.jmyhflOptions = optionList;
      //获取模板下拉
      if (templateType) {
        let param = { templateType: templateType };
        this.templateApi.selectExpTemplateList(param).then(res => {
          this.sdsTemplateOptions = res.data
        });
      }
    },
    addYhfs() {
      //总机构最多有2行,其他只能有一行
      let max = 1;
      if (this.form2.sfzfjg == "Y" && this.form2.sffgs == "N") {
        max = 2;
      }
      if (this.form2.jmyhList.length >= max) {
        this.$message.error("最多可添加 " + max + " 条减免优惠");
        return;
      }
      this.form2.jmyhList.push({})
    },
    removeYhfs(item, index) {
      this.form2.jmyhList.splice(index, 1)
    },
    save(type) {
      let that = this;
      that.$refs.form.validate((valid) => {
        if (!valid) return;
        if (type == 1) {
          //保存基础设置
          that.$refs.form1.validate((valid) => {
            if (valid) {
              let param = { ...this.form1, ...this.form };
              saveBaseSetting(param).then(res => {
                this.$message.success("保存成功");
              });
            }
          });
        } else if (type == 2) {
          //保存企业所得税预缴设置
          that.$refs.form2.validate((valid) => {
            if (valid && this.checkSdsYhzc()) {
              // 总分机构下的总公司如果选择了有独立生产经营部门，需要至少选择一个
              if (this.form2.sfzfjg === 'Y' && this.form2.sffgs === 'N' && this.form2.sfdlscjy === 'Y' && this.form2.dlscjybmList.length == 0) {
                this.$message.warning('请至少添加一个独立生产经营部门！');
                return;
               }
              let param = { ...this.form2, ...this.form };
              saveIncomeSetting(param).then(res => {
                if (res.code == 0) {
                  this.$message.success("保存成功");
                }
              });
            }
          });
        } else if (type == 3) {
          //保存增值税申报设置
          that.$refs.form3.validate((valid) => {
            if (valid) {
              let param = { ...this.form3, ...this.form };
              saveValueAddSetting(param).then(res => {
                if (res.code == 0) {
                  this.$message.success("保存成功");
                }
              });
            }
          });
        }
      });
    },
    checkSdsYhzc() {
      let flag = true;
      let msg = "";
      if (this.form2.sfjmsds == 'Y' && this.form2.jmyhList.length == 0) {
        msg = "请添加减免所得税额优惠";
        flag = false
      }
      this.form2.jmyhList.forEach(item => {
        if (!item.yhzclb) {
          msg = "请选择减免所得税额类别";
          flag = false;
        } else if (!item.yhzcmc) {
          msg = "请选择减免所得税额事项名称";
          flag = false
        } else if (!item.yhfsid) {
          msg = "请选择减免所得税额方式";
          flag = false
        }
      });
      if (this.form2.sfzfjg == "Y" && this.form2.sffgs == "N") {
        if (this.form2.jmyhList.length > 1) {
          let qyxzcList = this.form2.jmyhList.filter(item => item.yhzclb == 7);
          let fqyxzcList = this.form2.jmyhList.filter(item => item.yhzclb != 7);
          if (qyxzcList.length != fqyxzcList.length) {
            msg = "最多可选择一个区域性优惠与一个非区域性优惠";
            flag = false
          }
        }
      }
      if (!flag) {
        this.$message.error(msg);
      }
      return flag;
    },
    // 获取所有总公司
    async getZgsList() {
      this.api.getZgsList({}).then(res => {
        this.zgsList = res.data
      })
    },
    // 增加独立生产经营部门
    addFunction() {
      this.$refs.departmentDialogForm.dialogVisible = true
    },
    submitShr(data) {
      this.form = {
        ...this.form,
        ...data
      }
      console.log(this.form)
    },
    changeDlscjybmList(val) {
      this.form2.dlscjybmList = [...val]
    },
    checkJmfsDisabled() {
      this.form2.jmyhList.forEach((item, index) => {
        let jmfs = item.jmyhmcOptions.find(en => en.dm == item.yhzcmc);
        if (jmfs?.jmfs) {
          this.$set(this.form2.jmyhList, index, { ...this.form2.jmyhList[index], disabled: 'Y' })
        } else {
          this.$set(this.form2.jmyhList, index, { ...this.form2.jmyhList[index], disabled: 'N' })
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
._button {
  height: 50px;
  line-height: 50px;
  text-align: right;
  padding-right: 20px;
  background-color: #F8F8F8;
}

._title {
  margin: 10px 0;
}

._left {
  font-weight: 700;
  width: 200px;
  font-size: 16px;
}

.filter {
  display: flex;
  height: 40px;
  line-height: 40px;
  background-color: #ffffff;
}

/deep/ .el-descriptions-item__cell {
  .el-select {
    width: 100%;
  }
}

/deep/ .el-form-item {
  width: calc(33.3% - 10px);

  .el-form-item__label {
    width: 200px;
  }

  .el-form-item__content {
    width: calc(100% - 200px);

    .el-select,
    .vxe-select,
    .el-input {
      width: 100%;
    }
  }
}

.add-btn{
  text-align: right;
  margin: 0 20px 10px 0;
}

/deep/ .el-collapse-item__content {
  padding-bottom: 0;
}

/deep/ .basic-form {
  .flex-item {
    width: 100%;

    button {
      margin: 0 8px 0 24px;
      font-weight: bold;
    }

    .info-tip {
      color: #606266
    }

  }

  .el-radio {
    margin-right: 8px;

    .el-radio__label {
      padding-left: 8px
    }

    &:last-of-type {
      margin-right: 0;
    }
  }

  .el-icon-date {
    opacity: 0;
  }
}
</style>
