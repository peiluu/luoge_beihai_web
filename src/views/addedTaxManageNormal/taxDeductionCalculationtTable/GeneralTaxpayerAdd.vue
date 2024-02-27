<template>
  <vxe-table :min-height="height" align="center" border show-overflow keep-source ref="xTable" :data="tableData" v-loading="loading">
    <vxe-column type="seq" width="60" title="序号" />
    <vxe-column min-width="190" title="项目名称" field="jjdjxmmc">
      <!-- <template slot-scope="{ row }">{{ row.jjdjxmlx == '0' ? '一般项目加计抵减额计算' : '即征即退项目加计抵减计算' }}</template> -->
    </vxe-column>
    <vxe-column min-width="100" title="期初余额" field="qcye">
      <template #default="{ row }"> {{ formatMoney(row.qcye) }} </template>
    </vxe-column>
    <vxe-column min-width="100" title="加计抵减比例" field="jjdjbl" />
    <vxe-column min-width="100" title="本期发生额" field="bqfse">
      <template #default="{ row }"> {{ formatMoney(row.bqfse) }} </template>
    </vxe-column>
    <vxe-column min-width="100" title="本期调减额" field="bqtje">
      <template #default="{ row }"> {{ formatMoney(row.bqtje) }} </template>
    </vxe-column>
    <vxe-column min-width="100" title="本期应抵减税额" field="bqydjse">
      <template #default="{ row }"> {{ formatMoney(row.bqydjse) }} </template>
    </vxe-column>
    <vxe-column min-width="120" title="本期实际抵减税额" field="bqsjdje">
      <template #default="{ row }"> {{ formatMoney(row.bqsjdje) }} </template>
    </vxe-column>
    <vxe-column min-width="100" title="期末余额" field="qmye">
      <template #default="{ row }"> {{ formatMoney(row.qmye) }} </template>
    </vxe-column>
    <template #empty>
      <span>
        <img src="@/assets/no-data.png" style="width: 80px;height: 80px;">
        <p>未搜索到数据</p>
      </span>
    </template>
  </vxe-table>
</template>

<script>
export default {
  name: "GeneralTaxpayerAdd",
  components: {
  },
  props: {
    canUpdate: {},
    tableData: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      data: [],
      loading: false,
    }
  },
  computed: {
    height() {
      return window.innerHeight - 310;
    },
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
      if (!data.length) return null
      const footerData = [
        columns?.map((column, _columnIndex) => {
          if (_columnIndex === 0) {
            return '合计'
          }
          if (['age', 'rate'].includes(column.property)) {
            return this.formatMoney(this.sumNum(data, 'age'))
          }
          return null
        }),
      ]
      return footerData
    },
    footerColspanMethod({ $rowIndex, _columnIndex }) {
      if ($rowIndex === 0) {
        if (_columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 3
          }
        } else if ([1, 2].includes(_columnIndex)) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
  },
};
</script>
