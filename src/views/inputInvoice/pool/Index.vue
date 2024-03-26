<template>
  <div class="main-content">
    <el-tabs v-model="activeName">
      <el-tab-pane label="增值税发票" name="1">
        <article>
          <lg-vat-invoice></lg-vat-invoice>
        </article>
      </el-tab-pane>
      <el-tab-pane label="海关缴款书" name="2">
        <article>
          <lg-customs-pay></lg-customs-pay>
        </article>
      </el-tab-pane>
      <el-tab-pane label="代扣代缴完税凭证" name="3">
        <article>
          <lg-payment-behalf></lg-payment-behalf>
        </article>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import LgVatInvoice from "./VATInvoice";
import LgCustomsPay from './customsPay';
import LgPaymentBehalf from './paymentBehalf';
import {getRatepayingMain,getOrganList,getAccountantList} from '@/api/pool/index.js'
import Vue from 'vue';
export default {
  name: "poolPage",
  components: {
    LgVatInvoice,
    LgCustomsPay,
    LgPaymentBehalf
  },
  data() {
    return {
      activeName: "1",
      optionList:Vue.observable({
        /*发票类型 */
        invoiceType:[
          {label:'增值税专用发票',value:'01'},
          {label:'货物运输业增值税专用发票',value:'02'},
          {label:'机动车销售统一发票',value:'03'},
          {label:'增值税普通发票',value:'04'},
          {label:'增值税电子专用发票',value:'08'},
          {label:'增值税电子普通发票',value:'10'},
          {label:'卷式发票',value:'11'},
          {label:'通行费发票',value:'14'},
          {label:'二手车销售统一发票',value:'15'},
          {label:'电子发票（增值税专用发票）',value:'81'},
          {label:'电子发票（普通发票）',value:'82'},
          {label:'纸质发票（增值税专用发票）',value:'85'},
          {label:'纸质发票（普通发票）',value:'86'},
          {label:'电子发票（铁路电子客票）',value:'51'},
          {label:'电子发票（航空运输客票电子行程单）',value:'61'},
        ],
        /* 发票状态 */
        invoiceStatus:[
          {label:'正常',value:'0'},
          {label:'作废',value:'2'},
          {label:'已红冲',value:'3'},
          {label:'部分红冲',value:'7'},
          {label:'全额红冲',value:'8'},
        ],
        /* 认证状态 */
        authenticationStatus:[
          {label:'不需要勾选',value:'1'},
          {label:'未勾选',value:'2'},
          {label:'已勾选',value:'3'},
          {label:'已认证',value:'4'},
          {label:'已统计',value:'5'},
        ],
        /* 入账状态 */
        enterAccountStatus:[
          {label:'未入账',value:'01'},
          {label:'入账（企业所得税税前扣除）',value:'02'},
          {label:'入账（企业所得税不扣除）',value:'03'},
          {label:'入账已撤销',value:'06'},
        ],
        /* 转出状态 */
        rollOntStatus:[
          {label:'未进项转出',value:'1'},
          {label:'已全额转出',value:'2'},
          {label:'已部署转出',value:'3'},
        ],
        /* 收票状态 */
        collectTicketStatus:[
          {label:'未收票',value:'1'},
          {label:'已收票',value:'2'},
          
        ],
        /* 票种类型 */
        ticketType:[
          {label:'增值税代扣代缴完税凭证',value:'1'},
          {label:'消费税代扣代缴完税凭证',value:'2'},
        ],
        lockOption:[
          {label:'锁定',value:'Y'},
          {label:'未锁定',value:'N'},
        ],
        /* 发票用途 */
        invoiceUse:[
        {label:'未使用',value:'0'},
        {label:'已申请抵扣',value:'1'},
        {label:'已申请退税',value:'2'},
        {label:'已申请代办退税',value:'3'},
        {label:'已勾选不抵扣（历史数据）',value:'4'},
        {label:'已申请代办退税（历史数据）',value:'5'},
        {label:'已申请不抵扣',value:'6'},
        {label:'内销转出口',value:'7'},
        {label:'出口转内销',value:'8'},
        {label:'准予退税',value:'9'},
        {label:'不予退税',value:'10'},
        ],
        /* 销售方纳税主体 */
        xsfnsrsbhOptions:[],
        /* 受票组织 */
        orgOption:[],
        /* 会计科目 */
        accountantList:[]
      })
    };
  },
  provide(){
    return {
      optionList:this.optionList ,
    }
    
  },
  computed: {},
  watch: {},
  methods: {
    async hanldeGetns(){
      try {
        const res = await getRatepayingMain();
        if([0,'0'].includes(res.code)){
          this.optionList.xsfnsrsbhOptions = [...res.data]
        }
        
      }catch{
        
      }
    },
    async hanldeGetOrgId(){
      try {
        let params = {
          isInvoice:'N',
          isSelectAll:'N'
        }
        const res = await getOrganList(params);
        if([0,'0'].includes(res.code)){
          this.optionList.orgOption = [... res.data]
        }
       
      }catch{
        
      }
    },
    async hanldeAccount(){
      try {
        const res = await getAccountantList();
        if([0,'0'].includes(res.code)){
          this.optionList.accountantList = [... res.data]
        }
       
      }catch{
        
      }
    },
  },
  created() {},
  mounted() {
    this.hanldeGetOrgId();
    this.hanldeGetns();
    this.hanldeAccount();
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {
    // this.$refs.bottomTableRef.doLayout();
  },
  beforeDestroy() {},
  destroyed() {},
  activated() {},
};
</script>
<style scoped lang="scss">
/*@import url(); 引入公共css类*/
::v-deep .el-tabs__nav-scroll {
  padding: 0 12px;
}
.main-content {
  padding-top: 0;
}
</style>