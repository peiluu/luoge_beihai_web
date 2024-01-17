<template>
  <vxe-table align="center" border show-footer show-overflow keep-source ref="xTable" :data="data" :edit-config="{ trigger: 'click', mode: 'cell', showIcon: false, enabled: canUpdate }" v-loading="loading"
    :edit-rules="validRules" :cell-style="cellStyle" :footer-method="footerMethod" :footer-span-method="footerColspanMethod">
    <vxe-column width="60" title="序号">
      <template slot-scope="{ row, $rowIndex }">
        <div :class="{ 'delete-icon': getIsAddLine($rowIndex) }">
          <template v-if="getIsAddLine($rowIndex)">
            <i class="el-icon-remove-outline" @click="deleteLine(row, $rowIndex)" />
          </template>
          <span v-else> {{ row.sort }}</span>
        </div>
      </template>
    </vxe-column>

    <vxe-column min-width="100" title="项目分类" field="djjmlx">
      <template slot-scope="{ row }">{{ row.djjmlx == '0' ? '税额抵减' : '税额减免' }}</template>
    </vxe-column>

    <vxe-column min-width="180" title="项目名称" field="djjmxmmc" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-select v-model="row.djjmxmmc" placeholder="请选择" :disabled="!row.isAdd" @change="getDjjmxmmc(row)">
          <vxe-option v-for="(item, index) in jmdmTaxList" :key="index" :value="`${item.mc}_${item.dm}`" :label="`${item.mc}_${item.dm}`" />
        </vxe-select>
      </template>
    </vxe-column>
    <vxe-column min-width="120" title="期初余额" field="qcye">
      <template #default="{ row }"> {{ formatMoney(row.qcye) }} </template>
    </vxe-column>

    <vxe-column field="bqfse" title="本期发生额" min-width="120" :edit-render="{}">
      <template #edit="{ row, $rowIndex }">
        <vxe-input v-model="row.bqfse" type="number" min="0" :disabled="!(canUpdatexmdm.includes(row.djjmdm) || getIsAddLine($rowIndex))" @blur="calcTableData(row, 'bqfse')" />
      </template>
      <template #default="{ row }"> {{ formatMoney(row.bqfse) }} </template>
    </vxe-column>

    <!-- 如果为0,可以删除新增行 -->
    <vxe-column min-width="120" title="本期应抵减税额" field="bqydjse">
      <template #default="{ row }"> {{ formatMoney(row.bqydjse) }} </template>
    </vxe-column>

    <vxe-column min-width="120" title="本期实际抵减税额" field="bqsjdjse">
      <template #default="{ row }"> {{ formatMoney(row.bqsjdjse) }} </template>
    </vxe-column>
    <vxe-column min-width="120" title="期末余额" field="qmye">
      <template #default="{ row }"> {{ formatMoney(row.qmye) }} </template>
    </vxe-column>
    <!-- 一般纳税人 -->
    <vxe-column :key="nsrlx" field="jsxm" title="计税项目分类" min-width="130" :edit-render="{}" v-if="nsrlx == 1">
      <template #edit="{ row }">
        <vxe-select v-model="row.jsxm" placeholder="请选择">
          <vxe-option value="0" label="一般项目" />
          <vxe-option value="1" label="即征即退项目" />
        </vxe-select>
      </template>
      <template #default="{ row }">{{ row.jsxm == 0 ? '一般项目' : row.jsxm == 1 ? '即征即退项目' : '-' }}</template>
    </vxe-column>
    <!-- 小规模纳税人 -->
    <vxe-column :key="nsrlx" field="zsxm" title="征税项目分类" min-width="130" :edit-render="{}" v-if="nsrlx == 2">
      <template #edit="{ row }">
        <vxe-select v-model="row.zsxm" placeholder="请选择" :disabled="['1', '1.1', '1.2'].includes(row.sort)">
          <vxe-option v-for="( item, index ) in zsxmList" :key="index" :value="item.value" :label="item.label" />
        </vxe-select>
      </template>
      <template #default="{ row }">{{ row.zsxm == 1 ? '货物及劳务' : row.zsxm == 2 ? '服务、不动产和无形资产' : '-' }}</template>
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
import { deleteObj, queryDicSedjjmlx, } from './Api';
export default {
  name: "GeneralTaxpayer",
  components: {},
  props: {
    canUpdate: {},
    nsrlx: {},
    tableData: {
      type: Array
    },
    totalAmount: {
      type: Number
    },
    queryParam: {},
  },
  data() {
    return {
      data: [],
      orginJmdmTaxList: [],
      zsxmList: [{ value: '1', label: '货物及劳务' }, { value: '2', label: '服务、不动产和无形资产' }],
      loading: false,
      validRules: {
        djjmxmmc: [{ required: true, message: '请选择' }],
        bqfse: [{ pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字' }],
      },
      // 总抵减税额
      totaldjse: 150,
      // 可以编辑的项目
      small: [],
      canUpdatexmdm: ['1', '01129914', '01011707'],
      querySbStatus: false
    }
  },
  watch: {
    'tableData': {
      handler: function (newVal, oldVal) {
        this.initData();
      },
      deep: true,
    },
  },
  mounted() {
    this.initData();
    this.queryDicSedjjmlx()
  },
  computed: {
    height() {
      return window.innerHeight - 310;
    },
    jmdmTaxList() {
      return this.orginJmdmTaxList.filter(item => !this.data.find(ele => ele.djjmdm == item.dm));
    }
  },

  methods: {
    // 获取减免性质代码
    async queryDicSedjjmlx() {
      const { code = '', data = [] } = await queryDicSedjjmlx({ lx: this.nsrlx })
      if (code === '0') {
        this.orginJmdmTaxList = data.filter(item => !this.tableData.find(ele => ele.djjmdm == item.dm));
      }
    },
    getDjjmxmmc(row) {
      row.djjmdm = row.djjmxmmc.split('_')[1]
      row.djjmxmmc = row.djjmxmmc.split('_')[0]
    },
    initData() {
      this.data = [...this.tableData]
      this.totaldjse = this.totalAmount
    },

    // 新增一行税额减免
    addLine() {
      // 排序号从最后一行的序号 + 1
      const sort = this.data.length > 0 ? parseFloat(this.data[this.data.length - 1].sort) + 1 : 1
      const record = { ...this.queryParam, nsrlx: this.nsrlx, djjmlx: 1, jsxm: '0', sort, zsxm: 1, bqfse: 0, bqydjse: 0, bqsjdjse: 0, qcye: 0, qmye: 0, isAdd: true, }
      this.data.push(record)
      const $table = this.$refs.xTable
      $table.insertAt(record, -1).then(({ row }) => {
      })
    },
    deleteLine(row, rowIndex) {
      if (row.bqydjse) {
        this.$message.warning('本期应抵减税额不为0，无法删除数据')
        return;
      }
      this.$confirm(`您确定要删除吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (!row.id) {
          // 删除行的后续行都需要重新排序，给sort赋值，逐次 -1
          this.data.splice(rowIndex, 1)
          this.data.forEach((item, index) => {
            if (index >= rowIndex) {
              item.sort = parseFloat(item.sort) - 1
            }
          })
          return;
        }
        const { code = '', data = [] } = await deleteObj({ id: row.id })
        if (code === '0') {
          this.$message.success('刪除成功')
          this.$emit('handleSearch', this.queryParam)
        }
      }).catch(() => {
      });
    },
    // 是新增的项目
    getIsAddLine(rowIndex) {
      // 小规模默认12条, 一般纳税人默认9条
      return this.nsrlx == 1 && rowIndex > 8 || this.nsrlx == 2 && rowIndex > 11
    },
    sumNum(list, field) {
      let count = 0
      list.forEach(item => {
        if (!['1.1', '1.2'].includes(item.sort)) {
          count += Number(item[field])
        }
      })


      return count
    },
    // 修改单个格样式
    cellStyle({ row, column, rowIndex }) {
      if (!this.canUpdate) return
      // 减免性质代码
      if (column.field == 'jsxm' || (column.field == 'djjmxmmc' && this.getIsAddLine(rowIndex)) || ['bqfse'].includes(column.field) && (this.canUpdatexmdm.includes(row.djjmdm) || this.getIsAddLine(rowIndex))) {
        return {
          background: '#D9F2FD',
          borderBottom: '1px solid #e8eaec'
        }
      }
    },
    footerMethod({ columns, data }) {
      if (!this.data.length) return []
      const footerData = [
        columns.map((column, _columnIndex) => {
          if (_columnIndex === 0) {
            return '合计'
          }
          if (['qcye', 'bqfse', 'bqydjse', 'bqsjdjse', 'qmye', 'jsxm'].includes(column.property)) {
            return this.formatMoney(this.sumNum(data, column.property))
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

    // 表格数据计算
    calcTableData(row, column) {
      switch (column) {
        // 期初余额（1）、本期发生额（2）
        case 'bqfse':
          // case 'qcye':
          // 本期应抵减税额(bqydjse)(3)  =  1 + 2
          row.bqydjse = row.qcye + parseFloat(row.bqfse)
          // 本期实际抵减税额(4)
          this.getBqsjdjse()
          // 期末余额 '=3列-4列
          // row.qmye = parseFloat(row.bqydjse) - parseFloat(row.bqsjdjse)
          break
      }
    },
    // 计算本期实际抵减税额
    // 计算<增值税应纳税额计算表>一般计税应纳税额+简易计税应纳税额-加计抵减本期实际抵减额后，
    // 一般纳税人 || 与本期应抵减税额比较，按照上述序号6、7、8、新增项目、1、2、3、4、5的顺序依次抵减至0。
    // 小规模纳税人 || 与本期应抵减税额比较，按照上述序号10、7、8、9、新增项目、2、3、4、5、6的顺序依次抵减至0。
    // totaldjse 总抵减税额
    getBqsjdjse() {
      let totaldjse = this.totaldjse;
      // 按项目分类降序排序 先抵减税额减免再抵减税额抵减
      this.data.sort((a, b) => parseFloat(b.djjmlx) - parseFloat(a.djjmlx))
      const tempData = this.data.map(item => {
        // 当前本期发生额
        const itemBqydjse = item.bqydjse || 0
        // 本期实际抵减税额 = 应抵减税额 || 剩余总抵减税额
        // 小规模的1,1.1, 1.2已经抵减完成，不参与运算
        const isSubItem = ['1', '1.1', '1.2'].includes(item.sort) && this.nsrlx == 2
        // 全部抵减的实际抵减税额为当前实应抵减税额，未全部抵减的为剩余的总抵减额税额
        const bqsjdjse = (totaldjse - itemBqydjse >= 0) ? itemBqydjse : totaldjse
        // 数据递减
        totaldjse = isSubItem ? totaldjse : totaldjse - bqsjdjse
        return {
          ...item,
          bqsjdjse: isSubItem ? item.bqsjdjse : bqsjdjse,
          // 期末月
          qmye: isSubItem ? item.qmye : (itemBqydjse - bqsjdjse)
        }
      }).sort((a, b) => parseFloat(a.sort) - parseFloat(b.sort))
      this.$nextTick(() => {
        this.data = tempData
      })
    },
  },


};
</script>
<style scoped lang="scss">
@import '../../../styles/variables.scss';
.el-icon-remove-outline {
  cursor: pointer;
}

.delete-icon:hover {
  span {
    // display: none;
  }

  .el-icon-remove-outline {
    display: block
  }
}

/deep/ .vxe-footer--row .vxe-cell {
  color: $mainTextColor;
}

/deep/ .vxe-body--row:not(:first-of-type) {
  .vxe-select-option--wrapper {
    position: absolute;
    top: -78px;
  }
}
</style>
