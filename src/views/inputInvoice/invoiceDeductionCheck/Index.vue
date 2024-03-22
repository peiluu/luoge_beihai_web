<template>
  <div class="main-content">
    <div class="content-header">
      <div class="content-header-left">
        <BackBtn path="/inputInvoice/choseDate" align="left" :query="$route.query" />
        <BtnTabs :activeName="1" :zt="applyStatisticsStatus.zt" />
      </div>
      <div>勾选属期月份：{{ currentSq.dateLabel }}</div>
    </div>

    <div class="tab-box">
      <el-tabs class="custom-card-tabs" v-model="level" type="card">
        <el-tab-pane label="增值税发票" name="1" />
        <el-tab-pane label="海关缴款书" name="2" />
        <el-tab-pane label="代扣代缴完税凭证" name="3" />
      </el-tabs>
      <div> <i class="el-icon-warning" />当前纳税主体: {{ $route.query.nsrmc }} </div>
    </div>


    <!-- 发票下载 -->
    <Invoice v-show="level === '1'" :level="level" :currentSq="currentSq" />
    <!-- 海关缴款书 -->
    <Customs v-show="level === '2'"  :level="level"/>
    <!-- 代扣代缴完税凭证 -->
    <Withhold v-show="level === '3'" :level="level"/>
  </div>
</template>
<script>
import { getCurrentMonthSsq } from "@/utils/tool";
import BackBtn from "@/components/BackBtn";
import BtnTabs from '../components/BtnTabs.vue';
import Invoice from './invoice/Index.vue';
import Withhold from './withhold/Index.vue';
import Customs from './customs/Index.vue';
import { queryApplyStatisticsStatus } from './invoice/Api'

export default {
  name: 'InvoiceDeductionCheck',
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
    currentSq() {
      return getCurrentMonthSsq()
    }
  },
  activated() {
    this.queryApplyStatisticsStatus();
  },
  methods: {
    // 申请统计状态查询
    async queryApplyStatisticsStatus() {
      const { code = '', data = [] } = await queryApplyStatisticsStatus({
        gfsbh: this.$route.query.nsrsbh
      })
      if (code === '0') {
        this.applyStatisticsStatus = data
      }
    },
  },
  activated(){
    this.level = null;
    this.$nextTick(()=>{
      this.level = '1';
    })
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

/deep/ .el-dialog__body {
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
    color: red;
    font-size: 32px;
  }

  .title-normal {
    .el-icon-warning {
      margin-right: 4px;
      color: #1890ff;
      font-size: 32px;
    }

    span {
      padding: 0 2px;
      color: #000;
      font-weight: bold;
    }
  }

  .tip {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }

  .list {
    text-align: center;
    padding: 12px 24px 0;

    span {
      padding: 8px 8px 8px 0;
      color: #02A7F0
    }
  }
}
</style>
