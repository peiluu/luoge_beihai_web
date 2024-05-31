<template>
  <div class="main-content">
    <div class="content-tab-header">
      <BackBtn path="/inputInvoice/enterpriseList/deductionCheckStatistics" align="left"
        :query="{ businessType: this.$route.query.businessType }" />
      <BtnTabs :activeName="2" :zt="applyStatisticsStatus.zt" />
    </div>

    <el-form :inline="true" :model="form">
      <el-form-item label="所属属期"><span>{{ currentMonth }}</span></el-form-item>
      <el-form-item label="纳税主体" prop="gfsbh">
        <el-select v-model="form.gfsbh" placeholder="请选择" disabled @change="getData" style="width: 300px">
          <el-option v-for="item in taxBodyList" :key="item.nsrsbh" :label="item.nsrmc + ' ' + item.nsrsbh"
            :value="item.nsrsbh">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="toolbar">
      <el-button @click="handleEntry('history')">查看历史统计</el-button>
    </div>
    <div class="custom-table">
      <el-table row-key="id" ref="table" :data="tableData" :height="120" border stripe :header-cell-style="{
          fontWeight: 400,
          borderTop: '1px solid #adb4bc',
          background: '#f7f9fd',
          color: '#333333',
          padding: '7px 0'
        }" tooltip-effect="dark" v-loading="loading">
        <el-table-column label="纳税主体" prop="gfmc" :min-width="150" />
        <el-table-column label="税款所属期" prop="skssq">
          <template slot-scope="scope"> {{ dateFormat('YYYY-MM', scope.row.skssq) }}</template>
        </el-table-column>

        <el-table-column label="抵扣金额" prop="hjyxdkse" align="right">
          <template slot-scope="scope"> {{ formatMoney(scope.row.hjyxdkse) }}</template>
        </el-table-column>
        <el-table-column label="抵扣张数" prop="hjfs" align="right" />

        <el-table-column label="确认状态" prop="zt">
          <template slot-scope="scope">{{ scope.row.zt == "2" ? '已确认' : '未确认' }}</template>
        </el-table-column>

        <!--sqqrbz: 0 -申请统计(code1)|| 1 - 确认统计(jqzt)  -->
        <!--sqb: 0 -申请操作 || 2 - 撤销操作  -->
        <!-- <el-table-column label="统计状态" prop="gfmc">
          <template slot-scope="{ row }">

            {{ row.sqqrbz == 0 }}
          </template>
        </el-table-column> -->
        <el-table-column label="操作" prop="gfmc" :min-width="120">
          <template slot-scope="scope">
            <el-button @click="handleEntry('statisticsTable', scope.row)">查看统计表</el-button>
            <el-button @click="handleEntry('statisticsDetails', scope.row)">查看明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="content-footer">
      <template v-if="invoiceCheckList.length == 0">
        <div :class="{ 'hidden': invoiceCheckList.length == 0 }">
          <!-- <img src="@/assets/applyStatistics.png" /> -->
        </div>
        <div class="text">本期没有提交抵扣勾选数据</div>
      </template>

      <template v-else>
        <!-- 未统计 -->
        <template v-if="applyStatisticsStatus.zt == 0">
          <el-button type="success" @click="applyRevokeInvoiceCheckStatistics('1')">申请统计</el-button>
          <!-- <div><img src="@/assets/applyStatistics.png" /></div> -->
          <div class="text">当前未申请统计，点击申请统计，进行统计查询</div>
        </template>
        <!-- 已统计 -->
        <template v-if="applyStatisticsStatus.zt == 1">
          <div class="">
            <el-button type="success" @click="applyRevokeInvoiceCheckStatistics('2')">撤销申请</el-button>
            <el-button type="success" @click="applyConfirmationDeduction('1')">确认统计</el-button>
          </div>
          <!-- <div><img src="@/assets/applyStatistics.png" /></div> -->
          <div class="text">未进入统计确认，请进行统计确认 </div>
        </template>
        <!-- 已确认 -->
        <template v-if="applyStatisticsStatus.zt == 2">
          <el-button type="success" @click="applyConfirmationDeduction('2')">撤销统计</el-button>
          <!-- <div><img src="@/assets/applyStatistics.png" /></div> -->
          <!-- <div class="text">本期数据已确认，若取消申请请先撤销统计</div> -->
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import { getCurrentMonthSsq } from "@/utils/tool";
import moment from "moment";
import BackBtn from "@/components/BackBtn";
import { applyRevokeInvoiceCheckStatistics, getListByUser, queryApplyStatisticsStatus, historyDeductionStatisticsDetail, applyConfirmationDeduction, queryInvoiceCheck } from './Api'
import BtnTabs from '../../components/BtnTabs.vue';

export default {
  name: 'DeductionStatisticsList',
  components: { BtnTabs, BackBtn },
  data() {
    return {
      api: require('./Api'),
      param: {},
      form: {},
      loading: false,
      // 申请状态
      applyStatisticsStatus: {},
      tableData: [],
      taxBodyList: [],
      invoiceCheckList: []
    };
  },
  activated() {
    const param = {
      skssq: [this.skssq, this.skssq],
      gfsbh: this.$route.query.nsrsbh,
      nsrmc: this.$route.query.nsrmc,
      // isCurrent: 'true',
    }
    this.form = param;
    this.getListByUser();
    this.getData();
  },

  computed: {
    currentMonth() {
      return getCurrentMonthSsq().dateLabel
      // return `${new Date().getFullYear()}年${new Date().getMonth() + 1}月`
    },
    skssq() {
      return getCurrentMonthSsq().dateValue;
    },
  },

  methods: {
    dateFormat(fmt, val) {
      return moment(val).format(fmt)
    },

    getData() {
      this.historyDeductionStatisticsDetail();
      this.queryApplyStatisticsStatus();
      this.queryInvoiceCheck();
    },
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({})
      if (code === '0') {
        this.taxBodyList = data;
      }
    },
    // 已勾选数据
    async queryInvoiceCheck() {
      const { code = '', data = [] } = await queryInvoiceCheck({
        cljg: '01',
        skssq: this.skssq,
        gfsbh: this.form.gfsbh,
        sign: 'Y'
      })
      if (code === '0') {
        this.invoiceCheckList = data;
      }
    },
    // 查看历史统计
    async historyDeductionStatisticsDetail() {
      const { code = '', data = [] } = await historyDeductionStatisticsDetail({
        ...this.form,
        nsrsbh: this.form.gfsbh
      })
      console.log(data, "0")
      if (code === '0') {
        this.tableData = data
      }
    },
    // 申请统计状态查询
    async queryApplyStatisticsStatus() {
      const { code = '', data = [] } = await queryApplyStatisticsStatus({
        gfsbh: this.form.gfsbh
      })
      if (code === '0') {
        this.applyStatisticsStatus = data
      }
    },
    /**
     * @description 统计申请 / 撤销
      */
    async applyRevokeInvoiceCheckStatistics(sqbz) {
      this.$confirm(`确定${sqbz == '1' ? '申请' : '撤销申请'}统计吗？`, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code = '' } = await applyRevokeInvoiceCheckStatistics({
          skssq: this.skssq,
          gfsbh: this.form.gfsbh,
          sqbz,
        })
        if (code === '0') {
          this.$message.success("操作成功");
          setTimeout(() => {
            window.location.reload(true)
          }, 1000)
        }
      }).catch((res) => { })
    },

    /**
     * @description 统计确认申请 / 撤销
      */
    async applyConfirmationDeduction(sqbz) {
      if (sqbz == 1) {
        this.handleEntry('apply')
        return;
      }
      this.$confirm(`确定${sqbz == '1' ? '申请' : '撤销确认'}统计吗？`, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code = '' } = await applyConfirmationDeduction({
          skssq: this.skssq,
          gfsbh: this.form.gfsbh,
          sqbz,
        })
        if (code === '0') {
          this.$message.success("操作成功");
          setTimeout(() => {
            window.location.reload(true)
          }, 1000)
        }
      }).catch((res) => { })
    },

    // 进入页面
    handleEntry(operateType, data) {
      let route = {};
      console.log(this.form, "-")
      switch (operateType) {
        case 'history':
          route = {
            path: '/deductionStatistics/historyStatistics',
            query: {
              ...this.$route.query,
              nsrsbh: this.form.gfsbh,
              nsrmc: this.form.nsrmc,
              businessType: this.$route.query.businessType
            }
          }
          break;
        case 'statisticsDetails':
          route = {
            path: '/deductionStatistics/statisticsDetails',
            query: {
              ...this.$route.query,
              operateType,
              nsrsbh: data.gfsbh,
              nsrmc: data.gfmc,
              skssq: data.skssq,
              pclsh: data.pclsh,
              businessType: this.$route.query.businessType
            }
          }
          break;
        case 'statisticsTable':
          route = {
            path: '/deductionStatistics/statisticsTable',
            query: {
              ...this.$route.query,
              operateType,
              nsrsbh: data.gfsbh,
              nsrmc: data.gfmc,
              skssq: data.skssq,
              pclsh: data.pclsh,
              businessType: this.$route.query.businessType
            }
          }
          break;
        case 'apply':
          route = {
            path: '/deductionStatistics/applyStatistics',
            query: {
              ...this.$route.query,
              operateType,
              nsrsbh: this.form.gfsbh,
              nsrmc: this.form.nsrmc,
              skssq: this.skssq,
              pclsh: this.tableData[0]?.pclsh
            }
          }
          break;
      }
      this.$router.push(route)
      if (operateType != 'history') {
        this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
      }
    },
    // 导出
    export() { },
  }
};
</script>

<style lang="scss" scoped>
@import '../../../../styles/variables.scss';

/deep/ .el-form {
  margin-top: 12px;

  .el-form-item {
    margin-bottom: 0;
  }

  .el-form-item__label {
    width: 150px;
    font-size: 12px;
  }

  .el-form-item__content span {
    font-weight: bold;
    color: $primaryGreenColor;
  }
}

.hidden {
  opacity: 0;
}


.toolbar {
  display: flex;
  justify-content: flex-end;
}

.content-footer {
  height: calc(100% - 460px);
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-end;
  margin-top: 150px;

  img {
    margin: 12px 0;
  }

  .text {
    margin-top: 12px;
    font-size: 16px;
    color: #AAAAAA;
  }

  .el-button {
    font-size: 14px;
  }
}

.content-tab-header {
  display: flex;
}
</style>
