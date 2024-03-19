<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <BackBtn path="/inputInvoice/enterpriseList/Index" :query="{ businessType: $route.query.businessType }" />

    <el-form :inline="true" :model="form">
      <el-form-item label="当前纳税主体" prop="nsrsbh">
        <el-select v-model="form.nsrsbh" placeholder="请选择" filterable disabled>
          <el-option v-for="item in taxBodyList" :label="item.nsrmc" :value="item.nsrsbh" :key="item.id" />
        </el-select>
      </el-form-item>
      <div class="content-header">
        <el-form-item label="年份" prop="currentYear">
          <el-select v-model="form.year" placeholder="请选择" @change="getList">
            <el-option v-for="item in yearList" :label="item" :value="item" :key="item" />
          </el-select>
        </el-form-item>

        <div class="header-tip">当前税款所属期：{{ currentSq.dateLabel }}</div>
      </div>
      <div class="content-cardbox">
        <el-card v-for="(item, index) in dataList" :key="index">
          <div slot="header" class="clearfix">{{ item.monthStr }}</div>
          <el-button v-if="currentSq.dateValue === item.skssq" @click="hanldeEnter(item)">进入</el-button>
          <template v-else>
            <div class="txt">发票数量 <span>{{ item.invoiceNum }} 份</span></div>
            <div>发票税额 <span>{{ item.invoiceTax }} 元</span></div>
          </template>

        </el-card>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getCurrentMonthSsq, getCurrentYearList } from "@/utils/tool";
import BackBtn from "@/components/BackBtn";

import { getList, getListByUser } from './Api'

export default {
  name: "InputInvoiceChoseDate",
  components: { BackBtn },
  data() {
    return {
      form: {},
      currentYear: '',
      dataList: [],
      taxBodyList: [],
    }
  },
  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
    currentSq() {
      return getCurrentMonthSsq()
    },
    yearList() {
      return getCurrentYearList(3)
    }
  },

  activated() {
    const month = new Date().getMonth() + 1
    this.form = {
      year: month == 1 ? new Date().getFullYear() - 1 : new Date().getFullYear(),
      nsrsbh: this.$route.query.nsrsbh
    }
    this.getList();
    this.getListByUser()
  },
  methods: {
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({})
      if (code === '0') {
        this.taxBodyList = data
      }
    },
    // 获取属期列表
    async getList() {
      const { code = '', data = [] } = await getList(this.form)
      if (code === '0') {
        this.dataList = data.map((item) => {
          const month = item.skssq.substring(4)
          const monthStr = parseFloat(month) < 10 ? `${month.substring(1)}月` : `${month}月`;
          return {
            ...item,
            monthStr,
          }
        })
      }
    },
    // 进入下级页面
    hanldeEnter(item) {
      const { businessType = '' } = this.$route.query
      // 1.发票抵扣勾选 2.发票不抵扣勾选
      const path = businessType === '1' ? '/inputInvoice/invoiceDeductionCheck' : '/inputInvoice/invoiceNotDeductionCheck';
      this.$router.push({
        path,
        query: {
          skssq: item.skssq,
          ...this.$route.query,
        }
      })
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
    },
  },

};
</script>

<style lang="scss" scoped>
@import '../../../styles/variables.scss';
.main-content {
  font-size: 14px;
}

.content-header {
  display: flex;
  align-items: center;
  margin: 16px 0;
  font-size: 12px;

  .header-tip {
    margin-left: 12px;

    .green {
      color: $primaryGreenColor;
    }

    .red {
      color: red
    }
  }
}

/deep/ .el-form-item {
  margin-bottom: 0;
  width: 30%;

  .el-form-item__label {
    font-size: 12px;
    width: 120px;
  }

  .el-form-item__content {
    width: calc(100% - 120px);

    .el-select,
    .el-input {
      width: 100%;
    }
  }
}

.content-cardbox {
  display: flex;
  flex-wrap: wrap;
  padding-left: 24px;

  .el-card {
    flex-basis: 23%;
    margin-bottom: 16px;
    margin-right: 22px;
  }

  .txt {
    padding-bottom: 12px;
  }

  /deep/ .el-card__body {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;

  }

  /deep/ .el-card__header {
    font-weight: bold;
    color: $primaryGreenColor;
  }

  .el-button {
    align-self: end;
    color: $primaryGreenColor;
    border: 1px solid $primaryGreenColor;
  }
}
</style>
