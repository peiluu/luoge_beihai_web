<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <LedgerForm @search="handleSearch" :hideOrgid="true">
      <template #topTool v-if="queryParam.nsrlx != 2">
        <el-button @click="updateLedger" type="primary" :disabled="!canEdit">保存</el-button>
        <el-button @click="reStatistics" type="primary">取数</el-button>
        <el-button @click="exportLedger">导出</el-button>
      </template>
      <template #customeTable v-if="queryParam.nsrlx != 2">
        <el-form ref="editForm" :inline="true" :model="ybxm" :rules="rules">
          <table border class="content-table">
            <thead>
              <tr>
                <th colspan="5">应纳税额计算表</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="2">项目数据名称</td>
                <td width="80">序号</td>
                <td width="280">一般项目</td>
                <td width="280">即征即退项目</td>
              </tr>
              <tr>
                <td rowspan="9" width="200">一般计税应纳税额计算</td>
                <td>本期销项税额</td>
                <td>1</td>
                <td>{{ formatMoney(ybxm.bqxxse) }}</td>
                <td>{{ formatMoney(jzjtxm.bqxxse) }}</td>
              </tr>
              <tr>
                <td colspan="0" class="hidden"></td>
                <td>本期进项税额</td>
                <td>2</td>
                <td>{{ formatMoney(ybxm.bqjxse) }}</td>
                <td>{{ formatMoney(jzjtxm.bqjxse) }}</td>
              </tr>
              <tr>
                <td colspan="0" class="hidden"></td>
                <td>上期留抵税额</td>
                <td>3</td>
                <td>{{ formatMoney(ybxm.sqldse) }}</td>
                <td>{{ formatMoney(jzjtxm.sqldse) }}</td>
              </tr>
              <tr>
                <td colspan="0" class="hidden"></td>
                <td>本期进项税额转出</td>
                <td>4</td>
                <td>{{ formatMoney(ybxm.bqjxsezc) }}</td>
                <td>{{ formatMoney(jzjtxm.bqjxsezc) }}</td>
              </tr>
              <tr>
                <td colspan="0" class="hidden"></td>
                <td>免、抵、退应退税额</td>
                <td>5</td>
                <td class="edit-cell" v-if="canEdit">
                  <el-form-item prop="mdtytse">
                    <el-input v-model="ybxm.mdtytse" placeholder="请输入" @blur="calcTableData" v-thousands class="edit-input" />
                  </el-form-item>
                </td>
                <td v-else>{{ formatMoney(ybxm.mdtytse) }}</td>
                <td>{{ formatMoney(jzjtxm.mdtytse) }}</td>
              </tr>
              <tr>
                <td colspan="0" class="hidden"></td>
                <td>按适用税率计算的纳税检查应补缴税额</td>
                <td>6</td>
                <td class="edit-cell" v-if="canEdit">
                  <el-form-item prop="nsjcybjse">
                    <el-input v-model="ybxm.nsjcybjse" placeholder="请输入" @blur="calcTableData" v-thousands class="edit-input" />
                  </el-form-item>
                </td>
                <td v-else>{{ formatMoney(ybxm.nsjcybjse) }}</td>
                <td>{{ formatMoney(jzjtxm.nsjcybjse) }}</td>
              </tr>
              <tr>
                <td colspan="0" class="hidden"></td>
                <td>应抵扣税额合计</td>
                <td>7</td>
                <td>{{ formatMoney(ybxm.ydksehj) }}</td>
                <td>{{ formatMoney(jzjtxm.ydksehj) }}</td>
              </tr>
              <tr>
                <td colspan="0" class="hidden"></td>
                <td>实际抵扣税额</td>
                <td>8</td>
                <td>{{ formatMoney(ybxm.sjdise) }}</td>
                <td>{{ formatMoney(jzjtxm.sjdise) }}</td>
              </tr>
              <tr>
                <td colspan="0" class="hidden"></td>
                <td>一般计税应纳税额</td>
                <td>9</td>
                <td>{{ formatMoney(ybxm.ybjsynse) }}</td>
                <td>{{ formatMoney(jzjtxm.ybjsynse) }}</td>
              </tr>
              <tr>
                <td rowspan="2" width="200">简易计税应纳税额计算</td>
                <td>简易计税应纳税额</td>
                <td>10</td>
                <td>{{ formatMoney(ybxm.jyjsynse) }}</td>
                <td>{{ formatMoney(jzjtxm.jyjsynse) }}</td>
              </tr>
              <tr>
                <td colspan="0" class="hidden"></td>
                <td>简易方法计算的纳税检查应补缴税额</td>
                <td>11</td>
                <td class="edit-cell" v-if="canEdit">
                  <el-form-item prop="jyffjsnsjcybjse">
                    <el-input v-model="ybxm.jyffjsnsjcybjse" placeholder="请输入" @blur="calcTableData" v-thousands class="edit-input" />
                  </el-form-item>
                </td>
                <td v-else>{{ formatMoney(jzjtxm.jyffjsnsjcybjse) }}</td>
                <td>{{ formatMoney(jzjtxm.jyffjsnsjcybjse) }}</td>
              </tr>
            </tbody>
          </table>
        </el-form>
      </template>

      <template #customeTableEmpty v-if="queryParam.nsrlx == 2">
        <div class="empty-img">
          <img src="@/assets/no-data.png" style="width: 80px;height: 80px;">
          <p>未搜索到数据</p>
        </div>
      </template>
    </LedgerForm>
  </div>
</template>

<script>
import { limitMoneyMsg } from '@/config/constant';
import LedgerForm from '@/components/LedgerForm/Index';
import { selectTaxPayable, reStatistics, updateLedger, exportLedger, queryStatus } from './Api';

export default {
  name: "TaxPayableCalculationTable",
  components: {
    LedgerForm,
  },
  data() {
    return {
      queryParam: {},
      // 一般计税项目
      ybxm: {},
      querySbStatus: false,
      // 简易计税
      jzjtxm: {},
      rules: {
        mdtytse: [{ pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字', }],
        nsjcybjse: [{ pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字', }],
        jyffjsnsjcybjse: [{ pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字', }],
      },
    };
  },
  methods: {
    async handleSearch(queryParam) {
      this.queryParam = queryParam
      this.queryStatus()
      const { code = '', data = {} } = await selectTaxPayable(this.queryParam)
      if (code === '0') {
        this.ybxm = data.ybxm || {}
        this.jzjtxm = data.jzjtxm || {}
        this.inputBlur();
      }
    },
    inputBlur() {
      const eles = document.querySelectorAll(".edit-input > .el-input__inner")
      for (var i = 0; i < eles.length; i++) {
        eles[i].focus()
        eles[i].blur()
      }
    },
    // 取数
    async reStatistics() {
      const { code = '', data = [] } = await reStatistics(this.queryParam)
      if (code === '0') {
        this.$message.success('更新操作成功成功')
        this.handleSearch(this.queryParam)
      }
    },
    // 更新台账
    async updateLedger() {
      this.$refs["editForm"].validate(async valid => {
        if (!valid) return;
        const { code = '', } = await updateLedger(this.ybxm)
        if (code === '0') {
          this.$message.success('操作成功')
          this.handleSearch(this.queryParam)
        }
      })
    },
    calcTableData() {
      const { bqxxse, bqjxse, sqldse, bqjxsezc, } = this.ybxm
      // 应抵扣税额合计 = 2+3-4-5+6
      this.ybxm.ydksehj = bqjxse + sqldse - bqjxsezc - (parseFloat(this.ybxm.mdtytse) || 0) + (parseFloat(this.ybxm.nsjcybjse) || 0)
      // 实际抵扣税额 = MIN(第7列,第1列)
      this.ybxm.sjdise = Math.min(this.ybxm.ydksehj, bqxxse)
      // 一般计税应纳税额 = = 1-8
      this.ybxm.ybjsynse = bqxxse - this.ybxm.sjdise
      // this.ybxm.mdtytse = this.formatMoney(this.ybxm.mdtytse);
    },
    // 导出
    async exportLedger() {
      const fileName = `应纳税额计算表.xlsx`
      await exportLedger({
        reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999 },
        fileName
      })
    },
    // 查询申报状态
    async queryStatus() {
      // false是当前还没有申报
      const { code = '', data } = await queryStatus({ ...this.queryParam, ssq: this.queryParam.srssq, sbsz: 'zzs' })
      if (code === '0') {
        this.querySbStatus = data
      }
    },

  },
  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
    canEdit() {
      return this.judgeIsCurrentSq(this.queryParam.srssq, this.queryParam.tbzq || '月') && !this.querySbStatus
    }
  },

};
</script>
<style scoped lang="scss">
@import '../../../styles/variables.scss';
.content-table {
  width: 100%;
  text-align: center;
  border: 1px solid #e8eaec;
  color: $mainTextColor;

  thead {
    color: $mainTextColor;
    font-weight: normal;
    background: $mainTextColor;
  }

  td,
  th {
    height: 40px;
    padding: 0 10px;
  }

  tr:first-of-type {
    background: #f7f9fd;
  }

  .hidden {
    display: none;
  }

  .el-form-item {
    width: 100%;
  }

  /deep/ .el-form-item__content {
    width: 100%;
  }

  .edit-cell {
    background: #D9F2FD;

    /deep/ .el-input__inner {
      background: #D9F2FD;
    }

  }

  /deep/ .el-input__inner {
    text-align: center;
    border: none;

    &:hover {
      border: 1px solid #00b390;
      background: #fff;
    }
  }

  /deep/ .el-form-item__error {
    width: 100%;
    text-align: center;
  }
}
.empty-img{
  padding: 120px;
}
</style>

