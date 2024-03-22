<template>
  <div class="com-btn-tabs">
    <template v-if="activeName == 3">
      <el-button type="success">不抵扣勾选</el-button>
    </template>
    <template v-else>
      <el-button @click="tabClick(1)" :type="activeName == 1 ? 'success' : ''">发票勾选抵扣</el-button>
      <el-button @click="tabClick(2)" :type="activeName == 2 ? 'success' : ''" :class="{ 'showTip': zt != 2 }">抵扣勾选统计</el-button>
    </template>

  </div>
</template>

<script>

export default {
  name: 'BtnTabs',
  props: {
    activeName: {
      type: Number,
      default: 1
    },
    zt: {

    }
  },
  data() {
    return {
      // 是否已经确认统计， true 未统计 | false 已统计
      // statisticsStatus: true
    }
  },

  methods: {
    tabClick(type) {
      console.log(type)
      if (type == this.activeName) return;
      // const path = this.activeName == 1 ? '/inputInvoice/invoiceDeductionCheck' : '/deductionStatistics/list';
      const path = type == 1 ? '/inputInvoice/invoiceDeductionCheck' : '/deductionStatistics/list'
      console.log(this.$route.query)
      this.$router.push({
        path,
        query: this.$route.query
      })
    },
  },

};
</script>

<style lang="scss" scoped>
@import '../../../styles/variables.scss';
.com-btn-tabs {
  .el-button {
    margin-left: 0;
    font-size: 14px;
    border-radius: 0;

    &:hover {
      background: none;
      color: $primaryGreenColor;
    }
  }

  .showTip {
    position: relative;

    &::after {
      content: '未统计确认';
      top: -5px;
      left: 106px;
      position: absolute;
      padding: 4px 8px;
      font-size: 10px;
      border-radius: 5px;
      background: #D9001B;
      color: #fff;
      opacity: 0.8;
    }
  }
}
</style>
