<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <LedgerForm @search="handleSearch">
      <template #topTool>
        <el-button @click="reStatistics" type="primary" :disabled="!queryParam.nsrsbh || !queryParam.srssq || querySbStatus" :loading="qsLoading">取数</el-button>
        <el-button @click="handleExport" :loading="exLoading">导出</el-button>
      </template>
      <template #customeTable>
        <vxe-table :data="tableData" border align="center" show-footer :footer-method="footerMethod" :footer-span-method="footerColspanMethod" v-loading="loading">
          <vxe-column type="seq" width="80" title="序号" field="seq"></vxe-column>
          <vxe-colgroup title="项目" header-class-name="header-class">
            <vxe-colgroup header-class-name="hidden">
              <vxe-colgroup title="1" field="zclxmc" min-width="220"></vxe-colgroup>
            </vxe-colgroup>
          </vxe-colgroup>

          <vxe-colgroup title="计税项目划分转出税额">
            <vxe-colgroup title="一般项目">
              <vxe-column field="ybxmzcse" title="2" min-width="120">
                <template #default="{ row }"> {{ formatMoney(row.ybxmzcse) }} </template>
              </vxe-column>
            </vxe-colgroup>
            <vxe-colgroup title="即征即退项目">
              <vxe-column field="jzjtxmzcse" title="3" min-width="120">
                <template #default="{ row }"> {{ formatMoney(row.jzjtxmzcse) }} </template>
              </vxe-column>
            </vxe-colgroup>
            <vxe-colgroup title="无法划分项目">
              <vxe-column field="wfhfxmzcse" title="4" min-width="120">
                <template #default="{ row }"> {{ formatMoney(row.wfhfxmzcse) }} </template>
              </vxe-column>
            </vxe-colgroup>
          </vxe-colgroup>
          <vxe-colgroup title="无法划分项目分摊转出税额">
            <vxe-colgroup title="即征即退分摊率">
              <vxe-column field="jzjtftl" title="5" min-width="120"></vxe-column>
            </vxe-colgroup>
            <vxe-colgroup title="一般项目">
              <vxe-column field="wfhfzcybxm" title="6" min-width="120">
                <template #default="{ row }"> {{ formatMoney(row.wfhfzcybxm) }} </template>
              </vxe-column>
            </vxe-colgroup>
            <vxe-colgroup title="即征即退项目">
              <vxe-column field="wfhfzcjzjtxm" title="7" min-width="120">
                <template #default="{ row }"> {{ formatMoney(row.wfhfzcjzjtxm) }} </template>
              </vxe-column>
            </vxe-colgroup>
          </vxe-colgroup>
          <vxe-colgroup title="计税项目合计转出税额">
            <vxe-colgroup title="一般项目">
              <vxe-column field="hjzcybxm" title="8" min-width="120">
                <template #default="{ row }"> {{ formatMoney(row.hjzcybxm) }} </template>
              </vxe-column>
            </vxe-colgroup>
            <vxe-colgroup title="即征即退项目">
              <vxe-column field="hjzcjzjtxm" title="9" min-width="120">
                <template #default="{ row }"> {{ formatMoney(row.hjzcjzjtxm) }} </template>
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
import { selectList, reStatistics, exportLedger, queryStatus } from './Api';

export default {
  name: "InputTransferOutLedger",
  components: {
    LedgerForm,
  },
  data() {
    return {
      loading: false,
      queryParam: {},
      tableData: [],
      querySbStatus: false,
      qsLoading: false,
      exLoading: false,
    };
  },
  methods: {
    async handleSearch(queryParam) {
      try {
        this.loading = true; 
        this.queryParam = queryParam
        this.queryStatus();
        const { code = '', data = [] } = await selectList(queryParam)
        if (code === '0') {
          this.tableData = data;
        }
      } catch (error) {
        
      } finally {
        this.loading = false;
      }
     
    },
    async reStatistics() {
      try {
        this.qsLoading = true
        const { code = '', data = [] } = await reStatistics(this.queryParam)
        if (code === '0') {
          this.$message.success('操作成功')
          this.handleSearch(this.queryParam)
        }
      } catch (error) {
        
      } finally {
        this.qsLoading = false;
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
    // 导出
    async handleExport() {
      try {
        this.exLoading = true;
        const fileName = `进项税额转出台账.xlsx`
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
      return count
    },
    footerMethod({ columns, data }) {

      if (this.tableData.length == 0) return []
      const footerData = [
        columns.map((column, _columnIndex) => {
          if (_columnIndex === 0) {
            return '合计'
          }
          if (['ybxmzcse', 'jzjtxmzcse', 'wfhfxmzcse', 'wfhfzcybxm', 'wfhfzcjzjtxm', 'hjzcybxm', 'hjzcjzjtxm'].includes(column.property)) {
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
            colspan: 2
          }
        } else if ([1].includes(_columnIndex)) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
  },
  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
    height() {
      return window.innerHeight - 300;
    },
  },
};
</script>
<style scoped lang="scss">
@import '../../../styles/variables.scss';
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

/deep/ .hidden {
  opacity: 1
}

/deep/ .vxe-footer--row .vxe-cell {
  color: $mainTextColor;
}
</style>

