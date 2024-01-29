<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <div class="search-box">
      <el-form :model="form" :inline="true" ref="searchForm">
        <el-form-item label="纳税主体名称" prop="nsrsbh">
          <el-select collapse-tags v-model="form.nsrsbh" filterable placeholder="请选择" style="width:140px;" @change="getParam">
            <el-option v-for="item in allOrgList" :key="item.nsrsbh" :label="`${item.nsrmc} ${item.nsrsbh}`" :value="item.nsrsbh" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属年度" prop="ssq">
          <el-date-picker v-model="form.ssq" type="year" placeholder="请选择" :clearable="false" value-format="yyyy" :picker-options="pickerOptions" />
        </el-form-item>
      </el-form>
      <div class="search-btns">
        <el-button type="success" @click="handleSearch">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-left">注：如存在除个税通以外的劳务派遣人员，请手动修改从业人数。</div>
      <div class="toolbar-right">
        <el-button @click="updateSmall" type="primary" :disabled="!tableData.length || !canEdit">保存</el-button>
        <el-button @click="fetchSmall" type="primary" :disabled="!canEdit">取数</el-button>
      </div>
    </div>
    <div class="custom-vxe-table">
      <vxe-table align="center" border v-loading="loading" show-footer show-overflow keep-source ref="xTable" :data="tableData" :edit-config="{ trigger: 'click', mode: 'cell', showIcon: false, enabled: canEdit }" :cell-style="cellStyle"
        :span-method="footerColspanMethod" :footer-method="() => []">
        <vxe-column field="ssq" title="税款所属期">
          <template #default="{ row }"> {{ formatAllDate(row.ssq, '季') }} </template>
        </vxe-column>
        <vxe-column field="role" title="项目">
          <template #default="{ row }"> {{ row.lx == 0 ? '从业人数' : '资产总额（万元）' }}</template>
        </vxe-column>

        <vxe-column field="jc" title="季初值" :edit-render="{}" align="right">
          <template #edit="{ row, $rowIndex }">
            <vxe-input type="number" v-model="row.jc" min="0" placeholder="请输入" :disabled="row.sbzt == 'Y' || row.lx != 0" @blur="calcTableData(row, $rowIndex)" />
          </template>
          <template #default="{ row }">{{ getFormatData(row, 'jc') }}</template>

        </vxe-column>

        <vxe-column field="jms" title="季末值" :edit-render="{}" align="right">
          <template #edit="{ row, $rowIndex }">
            <!-- <vxe-input type="number" v-model="row.jms" min="0" placeholder="请输入" :disabled="$rowIndex != currentSsqCyrsIndex" @blur="calcTableData(row, $rowIndex)" /> -->
            <vxe-input type="number" v-model="row.jms" min="0" placeholder="请输入" :disabled="row.sbzt == 'Y' || row.lx != 0" @blur="calcTableData(row, $rowIndex)" />
          </template>
          <template #default="{ row }"> {{ getFormatData(row, 'jms') }} </template>
        </vxe-column>
        <vxe-column field="bjdpjz" title="本季度平均值" align="right">
          <template #default="{ row }"> {{ getFormatData(row, 'bjdpjz') }} </template>
        </vxe-column>
        <vxe-column field="bnjpjz" title="本年度季度平均值" align="right">
          <template #default="{ row }"> {{ getFormatData(row, 'bnjpjz') }} </template>
        </vxe-column>
        <vxe-column field="sffhyq" title="是否符合小型微利企业单项指标" width="200">
          <template #default="{ row }"> {{ row.sffhyq == 1 ? '是' : '否' }} </template>
        </vxe-column>
        <template #empty>
          <span>
            <img src="@/assets/no-data.png" style="width: 80px;height: 80px;">
            <p>未搜索到数据</p>
          </span>
        </template>
      </vxe-table>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { getCurrentSsq } from "@/utils/tool";
import { querySmall, updateSmall, fetchSmall, querySameAllOrg, queryStatus } from './Api';
export default {
  name: "SmallLowProfitEnterpriseLedger",
  components: {
  },
  data() {
    return {
      tableData: [],
      form: {
        ssq: '',
        nsrsbh: ''
      },
      querySbStatus: false,
      allOrgList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      // validRules: {
      //   jc: [{ required: true, message: '请输入', trigger: "blur" }],
      //   jms: [{ required: true, message: '请输入', trigger: "blur" }, { pattern: /^[0-9]*$/, message: '请输入正整数' }],
      // }
      loading:false,
    }
  },
  activated() {
    if (this.$route.query.nsrsbh) {
      this.initQueryParam()
    }
  },
  mounted() {
    this.querySameAllOrg()
  },

  methods: {
    // 获取纳税主体
    async querySameAllOrg() {
      const { code = '', data = [] } = await querySameAllOrg({})
      if (code === '0') {
        this.allOrgList = data;
        if (!this.$route.query.nsrsbh) {
          this.initForm();
        }
      }
    },

    async handleSearch() {
      this.loading = true;
      try{
        const { code = '', data = [] } = await querySmall({ ...this.form })
        if (code === '0') {
          this.tableData = data || []
          // this.queryStatus()
        }
      }catch(e){
        this.loading = false;
      }
      
      this.loading = false;
    },
    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh, ssq, tbzq } = this.$route.query
      this.form.nsrsbh = nsrsbh;
      this.form.ssq = moment(ssq).format('YYYY')
      this.form.tbzq = tbzq
      this.handleSearch()
    },
    initForm() {
      const { nsrsbh, sdstbzq } = this.allOrgList[0] || {}
      this.form.nsrsbh = nsrsbh
      this.form.tbzq = sdstbzq
      this.form.ssq = moment().format('YYYY')
      this.handleSearch()
    },
    // 更新台账
    async updateSmall() {
      const errMap = await this.$refs.xTable.fullValidate(true).catch(errMap => errMap)
      if (errMap) return;
      const pattern = /^[0-9]*$/;
      if (this.tableData.find((item) => item.lx == 0 && (!item.jc || !item.jms))) {
        this.$message.warning('请输入从业人数！');
        return;
      }
      if (this.tableData.find((item) => item.lx == 0 && (!pattern.test(item.jc) || !pattern.test(item.jms)))) {
        this.$message.warning('从业人数请输入正整数！');
        return;
      }
      const { code = '' } = await updateSmall(this.tableData)
      if (code === '0') {
        this.$message.success('操作成功');
        this.handleSearch()
      }
    },
    // 将资产总额转化为以万元为单位
    getFormatData(row, key) {
      // return row.lx == 0 ? row[key] : row[key] ? this.formatMoney(row[key] / 10000) : 0.00
      return row.lx == 0 ? row[key] : row[key] ? this.formatMoney(row[key]) : 0.00
    },
    // 取数
    async fetchSmall() {
      const { quarterValue } = getCurrentSsq();
      const { code = '' } = await fetchSmall({ ...this.form, ssq: quarterValue })
      if (code === '0') {
        this.$message.success('操作成功');
        this.handleSearch()
      }
    },
    //
    calcTableData(row, rowindex) {
      // 本季度平均值 - （季初值+季末值）÷2，保留小数
      row.bjdpjz = ((parseFloat(row.jc || 0) + parseFloat(row.jms || 0)) / 2)
      const quarterNumber = rowindex ? ((rowindex / 2) + 1) : 1;
      // 本年度季度平均值 - 截至本税款所属期末季度平均值＝截至本税款所属期末各季度平均值之和÷相应季度数
      const totalBnjpjz = this.tableData.filter((item, index) => item.lx == 0 && rowindex >= index).reduce((pre, cur) =>
        pre + parseFloat(cur.bjdpjz || 0), 0)
      row.bnjpjz = Math.round(totalBnjpjz / quarterNumber)
      // 是否符合小型微利企业单项指标 = 若从业人数“本年度季度平均值”≤300人，为“是”；反之，为“否”
      row.sffhyq = row.bnjpjz > 300 ? 0 : 1
    },
    // // 修改单元格样式
    // cellStyle({ row, column, $rowIndex }) {
    //   if (!this.canEdit) return {}
    //   if ($rowIndex == this.currentSsqCyrsIndex && ['jc', 'jms'].includes(column.field)) {
    //     return {
    //       background: '#D9F2FD',
    //       borderBottom: '1px solid #e8eaec'
    //     }
    //   }
    // },
    // 修改单元格样式
    cellStyle({ row, column, $rowIndex }) {
      if (row.lx == 0 && row.sbzt != 'Y' && ['jc', 'jms'].includes(column.field)) {
        return {
          background: '#D9F2FD',
          borderBottom: '1px solid #e8eaec'
        }
      }
    },
    // 合并单元格
    footerColspanMethod({ row, _rowIndex, column, visibleData }) {
      let fields = ['ssq']
      let cellValue = row[column.property]
      if (cellValue && fields.includes(column.property)) {
        let prevRow = visibleData[_rowIndex - 1]
        let nextRow = visibleData[_rowIndex + 1]
        if (prevRow && prevRow[column.property] === cellValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          let countRowspan = 1
          while (nextRow && nextRow[column.property] === cellValue) {
            nextRow = visibleData[++countRowspan + _rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }

      }
    },
    // 查询申报状态
    async queryStatus() {
      // false是当前还没有申报
      const { code = '', data } = await queryStatus({ ...this.form, sbsz: 'sds' })
      if (code === '0') {
        this.querySbStatus = data
      }
    },

    resetForm() {
      this.$refs.searchForm.resetFields();
      this.handleSearch();
      this.form = {}
    },

    getParam() {
      const { sdstbzq } = this.allOrgList.find((item) => item.nsrsbh == this.form.nsrsbh)
      this.form.tbzq = sdstbzq
    },
    handleExport() { },
  },

  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
    height() {
      return window.innerHeight - 240;
    },
    // 当前属期从业人数行
    currentSsqCyrsIndex() {
      return this.tableData.findIndex((item, index) => item.lx == '0' && index == this.tableData.length - 2)
    },
    canEdit() {
      return this.form.nsrsbh
    }
  }
};
</script>
<style scoped lang="scss">
.search-box {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
}

.toolbar {
  padding: 8px 0;
}

.toolbar-left {
  color: #ccc;
  font-weight: bold;
  font-size: 14px;
}

.el-form {
  flex-basis: calc(100% - 170px);

  /deep/ .el-form-item {
    width: calc(33.3% - 10px);
    margin-bottom: 4px !important;

    .el-form-item__label {
      width: 120px;
      font-size: 12px;
    }

    .el-form-item__content {
      width: calc(100% - 120px);

      .el-select,
      .el-date-editor,
      .el-cascader,
      .el-input {
        width: 100% !important;
      }
    }
  }
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

/deep/ .hidden {
  opacity: 1;
}
</style>

