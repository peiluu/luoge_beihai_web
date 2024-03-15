<template>
  <div class="ele_body">
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
import LgPaymentBehalf from './paymentBehalf'
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
    };
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {},
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {
    this.$refs.bottomTableRef.doLayout();
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
</style>