<template>
  <vxe-table :height="height" :data="data" border align="center" :edit-rules="validRules" show-footer :edit-config="{ trigger: 'click', mode: 'cell', showIcon: false, enabled: !!queryParam.orgid && canUpdate }"
    :cell-style="cellStyle" ref="xTable">
    <vxe-column type="seq" min-width="60" title="序号" field="seq"></vxe-column>
    <vxe-colgroup title="税率" header-class-name="header-class">
      <vxe-colgroup header-class-name="hidden">
        <vxe-colgroup field="sl" title="1" min-width="70">
          <template #default="{ row }">{{ slListMap[row.sl] }}</template>
        </vxe-colgroup>
      </vxe-colgroup>

    </vxe-colgroup>
    <vxe-colgroup title="征税项目" header-class-name="header-class">
      <vxe-colgroup header-class-name="hidde1n">
        <vxe-colgroup field="zsxmName" title="2" min-width="220">
          <template #default="{ row }">{{ row.zsxmName || (row.jsfs == 1 ? "税率" : '征收率') }}</template>
        </vxe-colgroup>
      </vxe-colgroup>
    </vxe-colgroup>

    <vxe-colgroup title="计税方式" header-class-name="header-class">
      <vxe-colgroup header-class-name="hidd1en">
        <vxe-colgroup field="jsfsName" title="3" min-width="100"></vxe-colgroup>
      </vxe-colgroup>
    </vxe-colgroup>

    <vxe-colgroup title="本期开票信息">
      <vxe-colgroup title="本期专用发票销售额">
        <vxe-column field="bqzyfpxse" title="4" min-width="130">
          <template #default="{ row }"> {{ formatMoney(row.bqzyfpxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="专用发票销项税额">
        <vxe-column field="bqzyfpxxse" title="5" min-width="130">
          <template #default="{ row }"> {{ formatMoney(row.bqzyfpxxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="本期普通发票销售额">
        <vxe-column field="bqptfpxse" title="6" min-width="130">
          <template #default="{ row }"> {{ formatMoney(row.bqptfpxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="普通发票销项税额">
        <vxe-column field="bqptfpxxse" title="7" min-width="130">
          <template #default="{ row }"> {{ formatMoney(row.bqptfpxxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
    </vxe-colgroup>
    <vxe-colgroup title="本期申报收入">
      <vxe-colgroup title="本期应税收入合计">
        <vxe-column field="bqyssrhj" title="8" min-width="130">
          <template #default="{ row }"> {{ formatMoney(row.bqyssrhj) }} </template>
        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="本期视同销售收入">
        <vxe-column field="stxssr" title="9" min-width="130">
          <template #default="{ row }"> {{ formatMoney(row.stxssr) }} </template>
        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="本期申报收入销项税额">
        <vxe-column field="sbsrxxse" title="10" min-width="140">
          <template #default="{ row }"> {{ formatMoney(row.sbsrxxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
    </vxe-colgroup>
    <vxe-colgroup title="本期未开票收入">
      <vxe-colgroup title="未开票收入销售额">
        <vxe-column field="wkpsrxse" title="11" min-width="130">
          <template #default="{ row }"> {{ formatMoney(row.wkpsrxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="未开票收入销项税额">
        <vxe-column field="wkpsrxxse" title="12" min-width="130">
          <template #default="{ row }"> {{ formatMoney(row.wkpsrxxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
    </vxe-colgroup>

    <vxe-colgroup title="纳税检查调整">
      <vxe-colgroup title="销售额">
        <vxe-column field="nsjctzxse" title="13" min-width="100" :edit-render="{}">
          <template #edit="{ row }">
            <!-- 简易计税不可编辑 -->
            <vxe-input v-model="row.nsjctzxse" type="number" min="0" @blur="calcTableData(row, 'nsjctzxse')" :disabled="row.jsfs == 2" />
          </template>
          <template #default="{ row }"> {{ formatMoney(row.nsjctzxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="其中：即征即退检查调整销售额">
        <vxe-column field="nsjcjzjtxse" title="14" min-width="200" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input v-model="row.nsjcjzjtxse" type="number" min="0" @blur="calcTableData(row, 'nsjcjzjtxse')" :disabled="row.jsfs == 2" />
          </template>
          <template #default="{ row }"> {{ formatMoney(row.nsjcjzjtxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="销项税额">
        <vxe-column field="nsjctzxxse" title="15" min-width="100">
          <template #default="{ row }"> {{ formatMoney(row.nsjctzxxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="其中：即征即退纳税检查调整销项税额">
        <vxe-column field="nsjcjzjtxxse" title="16" min-width="150">
          <template #default="{ row }"> {{ formatMoney(row.nsjcjzjtxxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
    </vxe-colgroup>
    <vxe-colgroup title="合计">
      <vxe-colgroup title="销售额">
        <vxe-column field="hjxse" title="17" min-width="100">
          <template #default="{ row }"> {{ formatMoney(row.hjxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="其中：即征即退销售额">
        <vxe-column field="hjjzjtxse" title="18" min-width="180">
          <template #default="{ row }"> {{ formatMoney(row.hjjzjtxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="销项税额">
        <vxe-column field="hjxxse" title="19" min-width="100">
          <template #default="{ row }"> {{ formatMoney(row.hjxxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="其中：即征即退销项税额">
        <vxe-column field="hjjzjtxxse" title="20" min-width="180">
          <template #default="{ row }"> {{ formatMoney(row.hjjzjtxxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
    </vxe-colgroup>
    <template #empty>
      <span>
        <img src="@/assets/no-data.png" style="width: 80px;height: 80px;">
        <p>未搜索到数据</p>
      </span>
    </template>
  </vxe-table>
</template>
<script>
import { limitMoneyMsg, slListMap } from '@/config/constant';
import { geComputedSl } from "@/utils/tool";

export default {

  name: "TaxableIncomeGeneralTaxpayer",
  components: {},
  props: {
    tableData: {},
    queryParam: {},
    canUpdate: {},
  },
  data() {
    return {
      data: [],
      slListMap,
      validRules: {
        nsjctzxse: [{ pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字', }],
        nsjcjzjtxse: [{ pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字', }],
      },
    }
  },

  watch: {
    'tableData': {
      handler: function (newVal) {
        this.data = newVal;
      }
    },
  },
  mounted() {
    this.data = this.tableData
  },
  computed: {
    height() {
      return window.innerHeight - 240;
    },
  },
  methods: {

    // 表格数据计算
    calcTableData(row, column) {
      switch (column) {
        // 销售额 （13）
        // 其中：即征即退检查调整销售额（14）
        case 'nsjctzxse':
        case 'nsjcjzjtxse':
          // 销项税额 = 销售额(第13列) *税率
          row.nsjctzxxse = (parseFloat(row.nsjctzxse || 0) * geComputedSl(row.sl)).toFixed(2)
          // 其中：即征即退纳税检查调整销项税额 =  即征即退检查调整销售额 （第14列）*税率
          row.nsjcjzjtxxse = (parseFloat(row.nsjcjzjtxse || 0) * geComputedSl(row.sl)).toFixed(2)
          // 合计销售额 第4列+第6列+第11列+第13列
          row.hjxse = (row.bqzyfpxse + row.bqptfpxse + row.wkpsrxse + parseFloat(row.nsjctzxse || 0)).toFixed(2)
          // 合计销项税额 第5列+第7列+第12列+第15列
          row.hjxxse = (row.bqzyfpxxse + row.bqptfpxxse + row.wkpsrxxse + parseFloat(row.nsjctzxxse || 0)).toFixed(2)
          // 合计其中：即征即退销售额 = 初始其中：即征即退销售额 + 其中：即征即退检查调整销售额（14）
          row.hjjzjtxse = parseFloat(row.originHjjzjtxse) + parseFloat(row.nsjcjzjtxse)
          // 合计 其中：即征即退销项税额 =第18列×对应税率 ( 20 )
          row.hjjzjtxxse = row.hjjzjtxse * geComputedSl(row.sl).toFixed(2)
          break

      }
    },

    // 修改单个格样式
    cellStyle({ row, column }) {
      if (!this.queryParam.orgid || !this.canUpdate) {
        return null
      }
      // 只有一般计税可以编辑
      if (['nsjctzxse', 'nsjcjzjtxse'].includes(column.field) && row.jsfs == 1) {
        return {
          background: '#D9F2FD',
          borderBottom: '1px solid #e8eaec'
        }
      }
    }
  },
};
</script>
