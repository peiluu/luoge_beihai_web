<template>
  <div :class="{'main-content': $route.query.invoiceId && $route.path.indexOf('/buleInvoice/ApplySuccess') !== -1}" :style="'height: ' + contentHeight + 'px;'">
    <!-- <Step :stepData="{ current: 4, total: 4, title: '提交成功' }"></Step> -->
    <div class="content-header"> <img src="@/assets/success.png" alt=""></div>
    <div class="conetent-tip">
      <!-- <div>您提交的红字发票信息表，已成功申请</div> -->
      <!-- shzt为0不需要审核 -->
      <div class="tip-txt">{{ 
      detail.shzt == 0 ? '您已成功提交开票申请，请耐心等待开具结果' : '您已成功提交开票申请，本单需审核，请等待审核人员审核' 
      }}
      </div>
      <div class="tip-txt">请及时关注与更新发票开具状态<router-link to="/outputInvoice/invoicedList/Index">去查询>></router-link></div>
    </div>
    <el-card class="content-info">
      <div class="info-title">发票简要信息</div>
      <div class="info-list">
        <div class="item">购方名称 : {{ detail.gmfmc }}</div>
        <div class="item">购方纳税人识别号码 : {{ detail.gmfnsrsbh }}</div>
        <div class="item">开票时间 : {{ detail.kprq }}</div>
        <div class="item">价税合计（元） : {{ detail.jshj? detail.jshj.toFixed(2):detail.jshj }}</div>
        <!--<div class="item">数电票号码 : {{ detail.fphm }}</div>-->
      </div>
    </el-card>
    <div class="footer">
      <el-button type="primary" @click="make">继续开票</el-button>
    </div>
  </div>
</template>

<script>
  import Step from '@/components/Step.vue';

  export default {
    name: 'BuleInvoiceApplySucce',
    props:{
      invoiceSucId:{
        type:[Number,String]
      }
    },
    components: { Step },
    data() {
      return {
        api: require('./Api'),
        detail: {},
      };
    },
    mounted() {
     
      if (this.invoiceId) {
       
        this.getInvoiceDetail({id : this.invoiceId})
      }
    },
    computed: {
      invoiceId(){
        return this.invoiceSucId || this.$route.query.invoiceId
      },
      contentHeight() {
        return window.innerHeight - 240;
      },

    },
    methods: {
      // 查看红字确认单申请详情
      getInvoiceDetail(param) {
        let that = this;
        that.api.getInvoiceDetailById(param).then(res => {
          that.detail = res.data;
        });
      },
      close() {
        this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
      },
      make(){
        if(this.$route.query.invoiceId){
          this.$router.push({
            path: '/outputInvoice/blueInvoice/Index'
          })
          this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
        } else {
          this.$emit('handleResume',true)
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .main-content {
    font-size: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    color: #7F7F7F;
  }

  .step {
    align-self: start;
  }

  .content-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 24px;
    font-size: 16px;

    img {
      width: 120px;
      margin-bottom: 24px;
    }

    span {
      font-weight: bold;
    }

    .el-button {
      display: flex;
      margin: 12px auto 0;
    }
  }

  .content-info {
    width: 70%;
    margin: 32px auto 0;
    padding: 12px;
    font-size: 15px;
    background: rgba(242, 242, 242, 0.3);

    .info-title {
      color: #000000;
      font-size: 16px;

    }

    .info-list {
      display: flex;
      flex-wrap: wrap;
      padding: 0 24px;
    }

    .item {
      margin-top: 16px;
      flex-basis: 50%;
    }
  }

  .conetent-tip {
    text-align: center;

    .tip-txt {
      padding-top: 16px;
    }
  }
  .footer {
    margin-top: 50px;
    text-align: center;
  }
</style>
