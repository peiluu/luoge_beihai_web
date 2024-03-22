<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">


    <div class="content-header">
      <div class="content-header-left">
        <BackBtn path="/inputInvoice/choseDate" align="left" :query="$route.query" />
        <BtnTabs :activeName="3" />
      </div>
      <div>勾选属期月份：{{ currentSq.dateLabel }}</div>
    </div>

    <div class="tab-box">
      <el-tabs class="custom-card-tabs" v-model="level" type="card">
        <el-tab-pane label="发票" name="1" />
        <el-tab-pane label="海关缴款书" name="2" />
        <el-tab-pane label="代扣代缴完税凭证" name="3" />
      </el-tabs>
      <i class="el-icon-warning" />当前纳税主体: {{ $route.query.nsrmc }}
    </div>
    <!-- 发票 -->
    <Invoice v-if="level == 1" :key="level" :currentSq="currentSq" />
    <!-- 海关缴款书 -->
    <Customs v-if="level == 2" :key="level" />
    <!-- 代扣代缴完税凭证 -->
    <Withhold v-if="level == 3" :key="level" />
  </div>
</template>
<script>
import { getCurrentMonthSsq } from "@/utils/tool";
import BackBtn from "@/components/BackBtn";
import Invoice from './invoice/Index.vue';
import Withhold from './withhold/Index.vue';
import BtnTabs from '../components/BtnTabs.vue';
import Customs from './customs/Index.vue';

export default {
  name: 'InvoiceNotDeductionCheck',
  components: {
    BackBtn,
    Withhold,
    Invoice,
    Customs,
    BtnTabs
  },
  data() {
    return {
      level: '1',
      applyStatisticsStatus: {}

    };
  },
  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
    currentSq() {
      return getCurrentMonthSsq()
    }
  },
  methods: {
  }

};
</script>

<style lang="scss" scoped>
@import '../../../styles/variables.scss';
.main-content {
  font-size: 14px;
  color: $mainTextColor;
}

.content-header {
  display: flex;
  justify-content: space-between;
  padding-right: 24px;

  .content-header-left {
    display: flex;
    justify-content: space-between;
  }
}

.tab-box {
  margin-top: 8px;
  display: flex;
  align-items: center;
}

.custom-card-tabs {
  margin: 0;
}


.el-icon-warning {
  margin: 0 4px 0 12px;
  color: #E6A23C;
}

/deep/ .column-text {
  color: #409EFF;
  cursor: pointer;
}

/deep/ .submit-dialog .el-dialog__body {
  padding: 20px 80px;

  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    text-align: center;
    color: $mainTextColor;
    font-size: 15px;
  }

  .el-icon-warning {
    margin-right: 4px;
    color: #1890ff;
    font-size: 32px;
  }

  .tip {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
