<template>
  <div>
    <div class="main-content" :style="'min-height: ' + contentHeight + 'px;'">
      <el-button icon="el-icon-back" class="back-btn" size="mini" @click="close" style="marginBottom: 8px">返回</el-button>

      <Step :stepData="{ current: 3, total: 3, title: '提交成功' }"></Step>
      <div class="content-header"> <img src="@/assets/success.png" alt=""></div>
      <div class="conetent-tip">
        <!-- <div>您提交的红字发票信息表，已成功申请</div> -->
        <!-- shzt为0不需要审核 -->
        <div class="tip-txt">{{ detail.shzt == 0 ? '您已成功提交红字开票申请，本确认单无需审核，已为您开具红字发票' : '您已成功提交红字开票申请，本确认单需审核，请等待审核人员审核' }}</div>
        <div class="tip-txt">请定时更新红字发票开具状态</div>
      </div>
      <el-card class="content-info">
        <div class="info-title">发票简要信息</div>
        <div class="info-list">
          
          <div class="item">确认方名称 : {{ detail.lrfsf == '0' ? detail.gmfmc : detail.xsfmc }}</div>
          <div class="item">价税合计（元） : {{ formatMoney(detail.hzcxje + detail.hzcxse) }}</div>
          <div class="item">提交时间 : {{ dateFormat('YYYY-mm-dd', detail.lrrqq) }}</div>
          <!-- <div class="item">提交时间 : {{ formatMoney(detail.hzcxje + detail.lzhjje) }}</div> -->
          <!-- <div class="item">发票号码 : {{ detail.lzfphm }}</div>
          <div class="item">发票代码 : {{ detail.lzfpdm }}</div> -->
        </div>
      </el-card>
    </div>
    <div class="fixed-footer">
      <el-button @click="close">关闭</el-button>
      <el-button type="success" @click="viewConfirm">查看确认单</el-button>
    </div>
  </div>
</template>

<script>
import Step from '@/components/Step.vue';
import { dateFormat, } from "@/utils/tool";
import { getRedInvoice } from './Api';

export default {
  name: 'RedApplySuccess',
  components: { Step },
  data() {
    return {
      detail: {},
    };
  },
  mounted() {
    const { id = "" } = this.$route.query;
    debugger;
    if (id) {
      
      this.getRedInvoice(id);
    }
  },
  computed: {

    contentHeight() {
      return window.innerHeight - 156;
    },

  },
  methods: {
    dateFormat,
    // 查看红字确认单申请详情
    async getRedInvoice(id) {
      this.dataList = []
      const { code = "", data = {} } = await getRedInvoice({ id });
      debugger;
      if (code === "0") {
        this.detail = data;
      }
    },
    close() {
      this.$router.push({
        path: '/redInvoice/infoTable',
        query: this.$route.query
      })
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
    },
    // 查看确认单
    viewConfirm() {
      this.$router.push({
        path: '/redInvoice/redInfoConfirm',
        query: {
          ...this.$route.query,
          id: this.detail.id,
          operateType: 'confirmDetail'
        }
      })
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);

    },
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
.back-btn{
  align-self: flex-start;
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
  margin-top: 32px;
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
</style>
