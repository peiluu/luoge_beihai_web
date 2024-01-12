<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <el-tabs class="custom-card-tabs" v-model="activeName" type="card" :key="activeName">
      <el-tab-pane label="纳税主体信息" name="1" />
      <el-tab-pane label="帐套信息" name="3" />
      <el-tab-pane label="开票点信息" name="2" />
    </el-tabs>

    <!-- 纳税主体信息 -->
    <TaxBody v-show="activeName === '1'" @hanldeMaintenance="hanldeMaintenance" />
    <!-- 开票点组织信息 -->
    <InvoicingOrganization v-show="activeName === '2'" :taxBodyId="invoicingTaxBodyId" :key="`${invoicingTaxBodyId}_2`" />
    <!-- 受票组织信息 -->
    <AcceptOrganization v-show="activeName === '3'" :taxBodyId="acceptTaxBodyId" :key="`${acceptTaxBodyId}_3`" />
  </div>
</template>
<script>
import TaxBody from './taxBody/Index.vue';
import InvoicingOrganization from './invoicingOrganization/Index.vue';
import AcceptOrganization from './acceptOrganization/Index.vue';

export default {
  name: 'SettingsManagementOrganization',
  components: {
    TaxBody,
    InvoicingOrganization,
    AcceptOrganization
  },
  data() {
    return {
      acceptTaxBodyId: '',
      invoicingTaxBodyId: '',
      activeName: '1',
    };
  },
  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
  },
  activated() {
    const { activeName = '1' } = this.$route.query;
    this.activeName = activeName
  },
  watch: {
    // activeName(val) {
    //   if (val === '1') {
    //     this.invoicingTaxBodyId = ''
    //     this.acceptTaxBodyId = ''
    //   }
    // }
  },
  methods: {
    // 直接跳转开票点 / 受票点
    hanldeMaintenance(taxBodyId, activeName) {
      if (activeName === '2') {
        this.invoicingTaxBodyId = taxBodyId
      } else {
        this.acceptTaxBodyId = taxBodyId
      }
      this.activeName = activeName
    }
  }

};
</script>
<style lang="scss" scoped>
::v-deep .dialog-form {
  .tips {
    text-align: center;
    color: #d97a7b;

    span {
      padding: 8px;
      height: 32px;
      line-height: 32px;
      background-color: #fdeeef;
    }
  }

  .el-form-item {
    width: 80%;

    .el-form-item__label {
      width: 180px;
    }

    .el-form-item__content {
      width: calc(100% - 180px);

      .el-select,
      .el-date-editor,
      .el-input {
        width: 100%;
      }
    }
  }
}
</style>
