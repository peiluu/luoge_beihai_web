<template>
  <div class="" :style="'height: ' + contentHeight + 'px;'">
    <!-- <Step :stepData="{current:2,total:4,title:'选择发票种类'}"></Step> -->
    <article style="overflow: hidden auto;padding-top: 15px;">
      <el-form :inline="true" :model="formInline" >
        <el-row :gutter="10">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="纳税人名称：" label-width="105px"><span>{{ formInline.nsrmc }}</span></el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item label="纳税人识别号码：" label-width="125px"><span>{{ formInline.nsrsbh }}</span></el-form-item>
          </el-col>
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            <el-form-item label="所属账套：" label-width="105px">
              <span class="">{{ formInline.ssztName }}</span>
            </el-form-item>
          </el-col>
          
        </el-row>
        
      </el-form>
    </article>
    <!-- 选择表单 -->
    <article>
      <el-form  class="content-form" ref="form" :inline="false" :model="form" :rules="rules" size="mini">
      <el-form-item label="选择发票类型" prop="fppz">
        <el-select  class="form-inline-input" v-model="form.fppz" @change="handleInvoiceType" :disabled="(formInline.isType??'')!==''" size="small" clearable>
          <el-option key="sdzp" label="数电增值税专用发票" value="01"></el-option>
          <el-option key="sdpp" label="数电增值税普通发票" value="02"></el-option>
        </el-select>
      </el-form-item>
      <div v-if="!formInline.isType">
      <el-form-item label="是否特定业务" prop="tdys">
        <el-select :disabled="isBlank(form.fppz)"   class="form-inline-input" v-model="form.tdys" size="small" clearable>
          <el-option v-for=" i in fppzOption" :key="i.key" :label="i.label" :value="i.value"></el-option>
        <!-- <el-option key="jzfw" label="建筑服务" value="03"></el-option>
        <el-option key="bdcxs" label="不动产销售" value="05"></el-option>
        <el-option key="bdczl" label="不动产经营租赁服务" value="06"></el-option>
        <el-option key="ylfw(mz)" label="医疗服务（门诊）" value="10"></el-option>
        <el-option key="ylfw(zy)" label="医疗服务（门诊）" value="11"></el-option>
        <el-option key="ncpsg" label="农产品收购发票" value="16"></el-option> -->
      </el-select>
      </el-form-item>
      <el-form-item label="是否差额" prop="cezslxDm">
        <el-select :disabled="!isBlank(form.jazs) || ['10','11'].includes(form.tdys) "  class="form-inline-input" v-model="form.cezslxDm" size="small" clearable>
          <el-option key="qekp" label="差额征税-全额开票" value="01"></el-option>
          <el-option key="cekp" label="差额征税-差额开票" value="02"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否减按征税" prop="jazs">
        <el-select :disabled="isBlank(form.fppz) || form.tdys=='03' || form.tdys=='05'|| !isBlank(form.cezslxDm) || ['10','11'].includes(form.tdys)"  class="form-inline-input" v-model="form.jazs" size="small" clearable>
          <el-option v-if="form.fppz=='02' && isBlank(form.tdys)" key="gdzc" label="销售自己使用过的固定资产" value="01"></el-option>
          <el-option key="zfzl" label="住房租赁" value="02"></el-option>
        </el-select>
      </el-form-item>
    </div>
    </el-form>
    </article>
    
    <!-- <el-form v-else class="content-form" ref="skform" :model="skform" :rules="skrules" size="mini">
      <el-form-item label="选择发票种类" prop="skfplx">
        <el-radio-group v-model="skform.skfplx" >
          <el-radio-button :label="1">增值税电子普通发票</el-radio-button>
          <el-radio-button :label="2">增值税电子专用发票</el-radio-button>
          <el-radio-button :label="3">增值税普通发票</el-radio-button>
          <el-radio-button :label="4">增值税专用发票</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form> -->
<!-- 
    <div class="content-tips">
      <span style="color: #D9001B;margin-right:4px;vertical-align: sub;">*</span>温馨提示：当前企业<template>{{isDigital=='Y'?'已':'未'}}</template>开通数电发票业务
    </div> -->
    <footer class="choose_footer">
      <div>
        <slot :slotData="{...form,...formInline}" ></slot>
      </div>
    </footer>
    <!-- <StepFooter style="margin-top: 80px;" :pre="pre" :next="next" @handlePre="handlePre" @handleNext="handleNext"></StepFooter> -->
  </div>
</template>

<script>
  import {urlMap} from '@/config/constant';
  import Step from '@/components/Step.vue';
  import StepFooter from '@/components/StepFooter.vue';
  import { getOrgDetail } from './Api.js'
  export default {
    name: "ChooseInvoiceType",
    props:{
      nextObj:{
        type:Object,
        default: ()=> {}
      }
    },
    components: {
      Step,
      StepFooter
    },
    data() {
      return {
        // api: require('./Api'),
        pre: true,
        next: true,
        form: {
          fppz: '',
          tdys: '',
          cezslxDm: '',
          jazs: '',
        },
        formInline:{
          ...this.nextObj
        },
        rules: {
          fppz: [
            { required: true, message: '请选择发票票种', trigger: 'blur' },
          ],
        },
        //税控发票种类
        skform: {

        },
        skrules: {
          skfplx: [
            { required: true, message: '请选择发票种类', trigger: 'blur' },
          ],
        },
        fppzOptionArr:[
          {label:'建筑服务',value:'03',key:'jzfw'},
          {label:'不动产销售',value:'05',key:'bdcxs'},
          {label:'不动产经营租赁服务',value:'06',key:'bdczl'},
          {label:'医疗服务（门诊）',value:'11',key:'ylfw(mz)'},
          {label:'医疗服务（住院）',value:'10',key:'ylfw(zy)'},
          {label:'农产品收购发票',value:'16',key:'ncpsg'},
        ],
        fppzOption:[
          // {label:'建筑服务',value:'03',key:'jzfw'},
          // {label:'不动产销售',value:'05',key:'bdcxs'},
          // {label:'不动产经营租赁服务',value:'06',key:'bdczl'},
          // {label:'医疗服务（门诊）',value:'10',key:'ylfw(mz)'},
          // // {label:'医疗服务（住院）',value:'11',key:'ylfw(zy)'},
          // {label:'农产品收购发票',value:'16',key:'ncpsg'},
        ]
      };
    },
    computed:{
      orgid(){
        return this.formInline.orgid
      },
      isDigital(){
        return this.formInline.isDigital
      },
      contentHeight(){
        return window.innerHeight - 134;
      }
    },
    watch:{
      'form.fppz'(val){
        this.$set(this.form, 'tdys', '');
        this.$set(this.form, 'cezslxDm', '');
        this.$set(this.form, 'jazs', '');
      },
      'form.tdys'(val){
        this.$set(this.form, 'cezslxDm', '');
        this.$set(this.form, 'jazs', '');
      },
      nextObj:{
        handler(val){
          console.log(val,"2222")
          if(!val.nsrmc){
            this.form = {
              fppz: '',
              tdys: '',
              cezslxDm: '',
              jazs: '',
            }
            this.getSellerInfoById(val.orgid)
          }
          this.formInline = {...val};
          if(val.isType){
            this.$set(this.form,'fppz','02')
          }
        },
        deep:true
      }
    },
    created(){
     
      // this.$eventBus.$on('chooseInvoiveTypeReset', () => {
      //   try {
      //     this.pre = true;
      //     this.next =true;
      //     this.form = {
      //       fppz: '',
      //       tdys: '',
      //       cezslxDm: '',
      //       jazs: '',
      //     };
      //     this.skform = {}
      //   } catch (error) {
      //     console.log('--error--', error)
      //   }
      // })
      
      
    },
    mounted(){
      // console.log(this.formInline?.isType,"2")
      // if(this.formInline?.isType){
      //   this.$set(this.form,'fppz','02')
      // }
      // this.form.fppz = this.formInline?.isType?'02':'';
    },
    methods: {
      async getSellerInfoById(orgid) {
        try {
          const { code = "", data = {} } = await getOrgDetail({id: orgid});
          sessionStorage.removeItem('reChooseFplx')
          if(code === "0") {
            this.formInline = {
              ...this.formInline,
              nsrmc: data.nsrmc,
              nsrsbh: data.nsrsbh,
              ssztCode: data.ssztCode,
              ssztName: data.ssztName,
              orgid,
            };
          }
        } catch (error) {
          console.log('error', error)
        }
      },
      handlePre(){
        console.log(this.$route.query,"luyou")
        this.$router.push({
          path: '/buleInvoice/index',
        })
        this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
      },
      handleNext(){
        let that = this;
        if(this.isDigital=='Y'){
          //数电
          this.$refs.form.validate((valid) => {
            if (valid) {
              this.$router.push({
                path: '/outputInvoice/blueInvoice/BlueInvoiceForm',
                query: {
                  orgid: this.$route.query.orgid,
                  ...this.form
                }
              })
              sessionStorage.setItem('clearBlueInvoice',1)
            }
          });
        }else {
          //税控
          this.$refs.skform.validate((valid) => {
            if (valid) {
              var resourceUrl = urlMap.handBlueInvoice1.url;
              if(this.skform.skfplx==1){
                resourceUrl = urlMap.handBlueInvoice1.url;
              }else if(this.skform.skfplx==2){
                resourceUrl = urlMap.handBlueInvoice2.url;
              }if(this.skform.skfplx==3){
                resourceUrl = urlMap.handBlueInvoice3.url;
              }if(this.skform.skfplx==4){
                resourceUrl = urlMap.handBlueInvoice4.url;
              }
              this.$router.push({
                path: '/iframe',
                query: {
                  resourceUrl: resourceUrl,
                  orgid: this.orgid
                }
              })
            }
          });
        }
        this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
      },
      /* 表单验证 */
      handleFormValidate() {
        return new Promise((resolve, reject) => {
          this.$refs.form.validate((valid) => {
           
            if (valid) {
              resolve(true);
            } else {
              reject(new Error("Form validation failed"));
            }
          });
        });
      },
      /* 发票类型不同可选特定业务需变化 */
      handleInvoiceType(val){
        console.log(val,"-0-0")
        let generalKey = [];
        switch(val){
          case '01':{
            generalKey = ['03','05','06']
            break;
          }
          case '02':{
            generalKey = ['10','11','16','03','05','06'];
            break;
          }
          default:{
            this.fppzOption = this.fppzOptionArr.map(k=> k.value);
          }
        }
        this.fppzOption = this.fppzOptionArr.filter(k=> generalKey.includes(k.value));
      }
    },
  };
</script>

<style scoped lang="scss">
 .content-form{
      // border: 1px solid #F2F2F2;
      // border-radius: 5px;
      // width: 800px;
      // margin-left: calc(50% - 400px);
      padding: 30px 0 10px 0;
      .el-form-item{
        display: flex;
        align-items: center;
        justify-content: center;
        
      }
      .el-radio-button{
        margin: 0 10px;
        border: 1px solid #DCDFE6;
      }
    }
  .content{
    background-color: #ffffff;
    border-radius: 4px;
    margin: 8px;
    padding: 12px;
    height: calc(100% - 20px);
   
    .content-tips{
      text-align: center;
      font-size: 18px;
      font-weight: 700;
      color: #AAAAAA;
      margin-top: 50px;
    }
  }
  ::v-deep .el-form-item .el-form-item__label{
          width: 180px;
        }
  ::v-deep .el-radio-button__orig-radio:checked+.el-radio-button__inner{
    background-color: #00B390;
    border-color: #00B390;
  }
.choose_footer{
  // position: absolute;
  // bottom: 35px;
  // left: 48%;
}
</style>
