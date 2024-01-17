<template>
  <vxe-table :height="height" :data="data" border align="center" :edit-rules="validRules" show-footer :edit-config="{ trigger: 'click', mode: 'cell', showIcon: false, enabled: !!queryParam.orgid && canUpdate }" :cell-style="cellStyle"
    ref="xTable">
    <vxe-column type="seq" min-width="60" title="序号">
      <template slot-scope="{ $rowIndex }">{{ sortMap[$rowIndex] }}</template>
    </vxe-column>

    <vxe-colgroup title="征收率" header-class-name="header-class">
      <vxe-colgroup header-class-name="hidden">
        <vxe-colgroup field="sl" title="1" min-width="70">
          <template #default="{ row }">{{ slListMap[row.sl] }}</template>
        </vxe-colgroup>
      </vxe-colgroup>
    </vxe-colgroup>

    <vxe-colgroup title="征税项目" header-class-name="header-class">
      <vxe-colgroup header-class-name="hidde1n">
        <vxe-colgroup field="zsxmName" title="2" min-width="220"></vxe-colgroup>
      </vxe-colgroup>
    </vxe-colgroup>
    <vxe-colgroup title="计税方式" header-class-name="header-class">
      <vxe-colgroup header-class-name="hidd1en">
        <vxe-colgroup field="jsfsName" title="3" min-width="100"></vxe-colgroup>
      </vxe-colgroup>
    </vxe-colgroup>

    <vxe-colgroup title="本期开票信息">
      <vxe-colgroup title="本期专用发票销售额">
        <vxe-column field="bqzyfpxse" title="4" min-width="130" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input v-model="row.bqzyfpxse" type="number" min="0" :disabled="getDiabled(row)" @blur="calcTableData(row, 'bqzyfpxse')" />
          </template>
          <template #default="{ row }"> {{ formatMoney(row.bqzyfpxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="专用发票应纳税额">
        <vxe-column field="bqzyfpxxse" title="5" min-width="130" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input v-model="row.bqzyfpxxse" type="number" min="0" :disabled="getDiabled(row)" @blur="calcTableData(row, 'bqzyfpxxse')" />
          </template>
          <template #default="{ row }"> {{ formatMoney(row.bqzyfpxxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="本期普通发票销售额">
        <vxe-column field="bqptfpxse" title="6" min-width="130" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input v-model="row.bqptfpxse" type="number" min="0" :disabled="getDiabled(row)" @blur="calcTableData(row, 'bqptfpxse')" />
          </template>
          <template #default="{ row }"> {{ formatMoney(row.bqptfpxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="普通发票应纳税额">
        <vxe-column field="bqptfpxxse" title="7" min-width="130" :edit-render="{}">
          <template #edit="{ row, }">
            <vxe-input v-model="row.bqptfpxxse" type="number" min="0" :disabled="getDiabled(row)" @blur="calcTableData(row, 'bqptfpxxse')" />
          </template>
          <template #default="{ row }"> {{ formatMoney(row.bqptfpxxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
    </vxe-colgroup>
    <vxe-colgroup title="本期申报收入">
      <vxe-colgroup title="本期应税收入合计">
        <vxe-column field="bqyssrhj" title="8" min-width="130" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input v-model="row.bqyssrhj" type="number" min="0" :disabled="getDiabled(row)" @blur="calcTableData(row, 'bqyssrhj')" />
          </template>
          <template #default="{ row }"> {{ formatMoney(row.bqyssrhj) }} </template>

        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="视同销售收入">
        <vxe-column field="stxssr" title="9" min-width="130" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input v-model="row.stxssr" type="number" min="0" :disabled="getDiabled(row)" @blur="calcTableData(row, 'stxssr')" />
          </template>
          <template #default="{ row }"> {{ formatMoney(row.stxssr) }} </template>

        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="申报收入应纳税额">
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
      <vxe-colgroup title="未开票收入应纳税额">
        <vxe-column field="wkpsrxxse" title="12" min-width="130">
          <template #default="{ row }"> {{ formatMoney(row.wkpsrxxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
    </vxe-colgroup>
    <vxe-colgroup title="合计">
      <vxe-colgroup title="销售额">
        <vxe-column field="hjxse" title="13" min-width="100">
          <template #default="{ row }"> {{ formatMoney(row.hjxse) }} </template>
        </vxe-column>
      </vxe-colgroup>
      <vxe-colgroup title="应纳税额">
        <vxe-column field="hjxxse" title="14" min-width="100">
          <template #default="{ row }"> {{ formatMoney(row.hjxxse) }} </template>
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
  name: "SmallScaleTaxpayer",
  components: {
  },
  props: {
    canUpdate: {},
    tableData: {},
    queryParam: {}
  },
  data() {
    return {
      data: [],
      sortMap: {
        0: 1,
        1: 2,
        2: 2.1,
        3: 3,
        4: 4,
        5: 4.1,
        6: 5,
      },
      slListMap,
      validRules: {
        bqzyfpxse: limitMoneyMsg,
        bqptfpxse: limitMoneyMsg,
        bqzyfpxxse: limitMoneyMsg,
        bqptfpxxse: limitMoneyMsg,
        bqyssrhj: limitMoneyMsg,
        stxssr: limitMoneyMsg
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
  methods: {
    sumNum(list, field) {
      let count = 0
      list.forEach(item => {
        count += Number(item[field])
      })
      return count
    },
    footerMethod({ columns, data }) {
      const footerData = [
        columns.map((column, _columnIndex) => {
          if (['age', 'rate'].includes(column.property)) {
            return this.sumNum(data, 'age')
          }
          if (['req', 'project'].includes(column.property)) {
            return '合计'
          }
          return null
        }),
      ]
      return footerData
    },
    //
    calcTableData(row, column) {
      switch (column) {
        // 本期专用发票销售额 （4）、本期普通发票销售额 (6)
        // 专用发票应纳税额（5）、 本期普通发票应纳税额（7）
        // 本期应税收入合计(8)、视同销售收入（9）
        case 'bqzyfpxse':
        case 'bqptfpxse':
        case 'bqzyfpxxse':
        case 'bqptfpxxse':
        case 'bqyssrhj':
        case 'stxssr':
          // 申报收入应纳税额(10) = （8+9）*税率
          row.sbsrxxse = ((parseFloat(row.bqyssrhj) + parseFloat(row.stxssr)) * geComputedSl(row.sl)).toFixed(2)
          // 本期未开票收入销售额(11)  = 第8列+第9列-第4列-第6列
          row.wkpsrxse = parseFloat(row.bqyssrhj) + parseFloat(row.stxssr) - parseFloat(row.bqzyfpxse) - parseFloat(row.bqptfpxse)
          // 未开票收入应纳税额(12) = 第10列-第5列-第7列
          row.wkpsrxxse = (parseFloat(row.sbsrxxse) - parseFloat(row.bqzyfpxxse) - parseFloat(row.bqptfpxxse)).toFixed(2)
          // 合计销售额(13)  = 第4列+第6列+第11列
          row.hjxse = parseFloat(row.bqzyfpxse) + parseFloat(row.bqptfpxse) + parseFloat(row.wkpsrxse)
          // 合计应纳税额(14) = 第5列+第7列+第12列
          row.hjxxse = (parseFloat(row.bqzyfpxxse) + parseFloat(row.bqptfpxxse) + parseFloat(row.wkpsrxxse)).toFixed(2)
          break
      }
    },
    // 修改单个格样式
    cellStyle({ row, column }) {
      if (!this.queryParam.orgid || !this.canUpdate) {
        return null
      }
      if (['bqzyfpxse', 'bqzyfpxxse', 'bqptfpxse', 'bqptfpxxse', 'bqyssrhj', 'stxssr'].includes(column.field) && row.zsxm == 5 && ['1', '2'].includes(row.sl)) {
        return {
          background: '#D9F2FD',
          borderBottom: '1px solid #e8eaec'
        }
      }
    },
    getDiabled(row) {
      return !(row.zsxm == 5 && ['1', '2'].includes(row.sl))
    },
  },

  computed: {
    height() {
      return window.innerHeight - 240;
    },
  },
};
</script>
