<template>
  <div class="main-content">
    <LedgerForm @search="handleSearch">
      <template #topTool>
        <el-button @click="reStatisticsVoucher" type="primary" :disabled="!queryParam.nsrsbh || !queryParam.srssq || querySbStatus" :loading="qsLoading">取数</el-button>
        <el-button @click="handleExport" :loading="exLoading">导出</el-button>
      </template>
      <template #customeTable>
        <vxe-table :data="tableData" border align="center" show-footer :footer-method="footerMethod" :footer-span-method="footerColspanMethod" v-loading="loading">

          <vxe-column type="seq" width="80" title="序号" field="seq"></vxe-column>
          <vxe-colgroup title="票据分类" header-class-name="header-class">
            <vxe-colgroup header-class-name="hidden">
              <vxe-colgroup title="1" field="pjfl" min-width="130"></vxe-colgroup>
            </vxe-colgroup>
          </vxe-colgroup>

          <vxe-colgroup title="票据名称" header-class-name="header-class">
            <vxe-colgroup header-class-name="hidden">
              <vxe-colgroup title="2" field="jxpzlxmc" min-width="200"></vxe-colgroup>
            </vxe-colgroup>
          </vxe-colgroup>

          <vxe-colgroup title="份数" header-class-name="header-class">
            <vxe-colgroup header-class-name="hidden">
              <vxe-colgroup title="3" field="fs" min-width="100"></vxe-colgroup>
            </vxe-colgroup>
          </vxe-colgroup>

          <vxe-colgroup title="金额" header-class-name="header-class">
            <vxe-colgroup header-class-name="hidden">
              <vxe-colgroup title="4" field="je" min-width="100">
                <template #default="{ row }"> {{ formatMoney(row.je) }} </template>
              </vxe-colgroup>
            </vxe-colgroup>
          </vxe-colgroup>

          <vxe-colgroup title="税额" header-class-name="header-class">
            <vxe-colgroup header-class-name="hidden">
              <vxe-colgroup title="5" field="se" min-width="100">
                <template #default="{ row }"> {{ formatMoney(row.se) }} </template>
              </vxe-colgroup>
            </vxe-colgroup>
          </vxe-colgroup>

          <vxe-colgroup title="计税项目划分税额">
            <vxe-colgroup title="一般项目">
              <vxe-column field="ybxmse" title="6" min-width="100">
                <template #default="{ row }"> {{ formatMoney(row.ybxmse) }} </template>
              </vxe-column>
            </vxe-colgroup>
            <vxe-colgroup title="即征即退项目">
              <vxe-column field="jzjtxmse" title="7" min-width="100">
                <template #default="{ row }"> {{ formatMoney(row.jzjtxmse) }} </template>
              </vxe-column>
            </vxe-colgroup>
            <vxe-colgroup title="无法划分项目">
              <vxe-column field="wfhfxmse" title="8" min-width="100">
                <template #default="{ row }"> {{ formatMoney(row.wfhfxmse) }} </template>
              </vxe-column>
            </vxe-colgroup>
          </vxe-colgroup>
          <vxe-colgroup title="无法划分项目分摊税额">
            <vxe-colgroup title="即征即退分摊率">
              <vxe-column field="jzjtftl" title="9" min-width="120"></vxe-column>
            </vxe-colgroup>
            <vxe-colgroup title="一般项目">
              <vxe-column field="wfhfybxm" title="10" min-width="100">
                <template #default="{ row }"> {{ formatMoney(row.wfhfybxm) }} </template>
              </vxe-column>
            </vxe-colgroup>
            <vxe-colgroup title="即征即退项目">
              <vxe-column field="wfhfjzjtxm" title="11" min-width="100">
                <template #default="{ row }"> {{ formatMoney(row.wfhfjzjtxm) }} </template>
              </vxe-column>
            </vxe-colgroup>
          </vxe-colgroup>
          <vxe-colgroup title="计税项目合计税额">
            <vxe-colgroup title="一般项目">
              <vxe-column field="hjybxm" title="12" min-width="100">
                <template #default="{ row }"> {{ formatMoney(row.hjybxm) }} </template>
              </vxe-column>
            </vxe-colgroup>
            <vxe-colgroup title="即征即退项目">
              <vxe-column field="hjjzjtxm" title="13" min-width="100">
                <template #default="{ row }"> {{ formatMoney(row.hjjzjtxm) }} </template>
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
    </LedgerForm>
  </div>
</template>

<script>
import LedgerForm from '@/components/LedgerForm/Index';
import { selectList, reStatisticsVoucher, exportLedger, queryStatus } from './Api';

export default {
  name: "InputInvoiceLedger",
  components: {
    LedgerForm,
  },
  data() {
    return {
      tableData: [],
      loading: false,
      param: {},
      querySbStatus: false,
      queryParam: {},
      qsLoading: false,
      exLoading: false,
    };
  },
  methods: {
    async handleSearch(queryParam) {
      try {
        this.loading = true
        this.queryParam = queryParam;
        this.queryStatus();
        const { code = '', data = [] } = await selectList(queryParam)
        if (code === '0') {
          this.tableData = data;
        }
      } catch (error) {
        console.log('----error----', error)
      } finally {
        this.loading = false
      }
      
    },
    // 查询申报状态
    async queryStatus() {
      // false是当前还没有申报
      const { code = '', data } = await queryStatus({ ...this.queryParam, ssq: this.queryParam.srssq, sbsz: 'zzs' })
      if (code === '0') {
        this.querySbStatus = data
      }
    },
    async reStatisticsVoucher() {
      try {
        this.qsLoading = true
        const { code = '' } = await reStatisticsVoucher(this.queryParam)
        if (code === '0') {
          this.$message.success('操作成功')
          this.handleSearch(this.queryParam)
        }
      } catch (error) {
        console.log('--error--', error)
      } finally {
        this.qsLoading = false
      }
      
    },

    // 导出
    async handleExport() {
      try {
        this.exLoading = true;
        const fileName = `进项发票台账.xlsx`
        await exportLedger({
          reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999 },
          fileName
        })
      } catch (error) {
        
      } finally {
        this.exLoading = false;
      }
    },
    sumNum(list, field) {
      let count = 0
      list.forEach(item => {
        count += Number(item[field])
      })
      return count.toFixed(2)
    },
    footerMethod({ columns, data }) {
      if (!this.tableData.length) return []

      const footerData = [
        columns.map((column, _columnIndex) => {
          if (_columnIndex === 0) {
            return '合计'
          }
          if (['fs', 'je', 'se', 'ybxmse', 'jzjtxmse', 'wfhfxmse', 'wfhfybxm', 'wfhfjzjtxm', 'hjybxm', 'hjjzjtxm'].includes(column.property)) {
            // if (['fs', 'je', 'se'].includes(column.property)) {
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
  },
  computed: {
    height() {
      return window.innerHeight - 240;
    },
  },
};
</script>
<style scoped lang="scss">
@import '../../../styles/variables.scss';
/deep/ .hidden {
  opacity: 1;
}

/deep/ .header-class.vxe-header--column {
  position: relative;
  background-image: linear-gradient(#e8eaec, #e8eaec);

  .vxe-cell--title {
    top: 100%;
    text-align: center;
    transform: translate(-50%, -50%);
    position: absolute;
  }
}

/deep/ .vxe-footer--row .vxe-cell {
  color: $mainTextColor;
}
</style>

