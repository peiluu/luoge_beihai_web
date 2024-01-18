<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <div class="search-box">
      <el-form :key="searchKey" :model="form" :inline="true" ref="searchForm">
        <el-form-item label="纳税主体名称" prop="nsrsbh">
          <el-select clearable v-model="form.nsrsbh" filterable placeholder="请选择" style="width:140px;" @change="initDate">
            <el-option v-for="item in taxBodyList" :key="item.nsrsbh" :label="`${item.nsrmc} ${item.nsrsbh}`" :value="item.nsrsbh" />
          </el-select>
        </el-form-item>
        <el-form-item label="税款所属期" prop="ssq">
          <QuarterDatePicker :key="querySdstbzq" :pickerType="querySdstbzq" :defaultValue="form.ssq" propsParam="ssq" :isInitDefault="true" @getQuarterPickerFrom="getQuarterPickerFrom" ref="quarterDatePicker" />
        </el-form-item>
      </el-form>
      <div class="search-btns">
        <el-button type="success" @click="handleSearch">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-left" />
      <div class="toolbar-right">
        <el-button @click="saveOrUpdateBatch" type="primary" :disabled="!tableData.length || !canUpdate">保存</el-button>
        <el-button @click="initialization" type="primary" :disabled="!canUpdate">取数</el-button>
        <!-- <el-button @click="initialization" type="primary">导出</el-button> -->
      </div>
    </div>

    <div class="custom-vxe-table">
      <vxe-table border show-overflow keep-source ref="xTable" :data="tableData" :edit-config="{ trigger: 'click', mode: 'cell', showIcon: false, enabled: false }" :edit-rules="validRules" :cell-style="cellStyle">
        <vxe-column type="seq" title="序号" width="50" />
        <vxe-column field="nsrmc" title="纳税主体名称" />
        <vxe-column field="ssq" title="税款所属期" align="center">
          <template #default="{ row }"> {{ formatAllDate(row.ssq, querySdstbzq) }} </template>
        </vxe-column>
        <vxe-column field="yhsxmc" title="优惠事项名称" />

        <vxe-column field="jmsdse" title="减免所得税额" :edit-render="{}" align="right">
          <template #edit="{ row }">
            <vxe-input type="number" v-model="row.jmsdse" min="0" :disabled="row.yhsxlb != 9" placeholder="请输入" />
          </template>
          <template #default="{ row }">{{ formatMoney(row.jmsdse) }}</template>
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
import QuarterDatePicker from '@/components/QuarterDatePicker.vue'
import { getCurrentSsq } from "@/utils/tool";

import { queryLedgerSdsJmsdsejs, saveOrUpdateBatch, initialization, getListByUser, queryStatus } from './Api';

export default {
  name: "IncomeTaxReductionCalculationTable",
  components: { QuarterDatePicker },
  data() {
    return {
      tableData: [],
      form: {},
      searchKey: '',
      querySbStatus: false,
      taxBodyList: [],
      editForm: {},
      dialogVisible: false,
      querySdstbzq: '季',
      validRules: {
        jmsdse: [{ required: true, message: "请输入", trigger: "blur" }, { pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字' }]
      },
      rules: {
        jmsdse: [{ required: true, message: "请输入", trigger: "blur" }, { pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字' }]
      },
    }
  },
  mounted() {
    this.getListByUser()
  },
  activated() {
    if (this.$route.query.nsrsbh) {
      this.initQueryParam()
    }
  },
  methods: {
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({})
      if (code === '0') {
        this.taxBodyList = data;
        if (!this.$route.query.nsrsbh && data.length) {
          this.initForm();
        }
      }
    },

    async handleSearch() {
      const { code = '', data = [] } = await queryLedgerSdsJmsdsejs(this.form)
      if (code === '0') {
        this.queryStatus()
        this.tableData = data;
      }
    },
    // 更新台账
    async saveOrUpdateBatch() {
      const errMap = await this.$refs.xTable.fullValidate(true).catch(errMap => errMap)
      if (errMap) return;
      const { code = '' } = await saveOrUpdateBatch({ data: this.tableData })
      if (code === '0') {
        this.$message.success('操作成功');
        this.handleSearch()
      }
    },

    // 取数
    async initialization() {
      const { code = '' } = await initialization(this.form)
      if (code === '0') {
        this.$message.success('操作成功');
        this.handleSearch(this.form)
      }
    },
    resetForm() {
      this.$refs.searchForm.resetFields();
      this.$refs.quarterDatePicker.reset()
      this.form = {}
      this.handleSearch()

    },
    initForm() {
      const nsrsbh = ( this.taxBodyList && this.taxBodyList.length > 0 ) ? this.taxBodyList[0].nsrsbh : '';
      this.form.nsrsbh = nsrsbh;
      this.handleSearch();
      this.initDate(nsrsbh)
    },
    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh, ssq, tbzq } = this.$route.query
      this.form.nsrsbh = nsrsbh;
      this.form.ssq = ssq
      this.querySdstbzq = tbzq
      this.form.tbzq = tbzq
      this.handleSearch()
    },
    handleClose() {
      this.dialogVisible = false;
      this.editForm = {}
    },
    // 初始化属期时间
    initDate(val) {
      const { sdstbzq } = this.taxBodyList.find((item) => item.nsrsbh === val) || {}
      this.querySdstbzq = sdstbzq
      const { monthValue, quarterValue } = getCurrentSsq();
      const value = this.querySdstbzq == '月' ? monthValue : quarterValue

      this.form.ssq = value
      this.form.tbzq = sdstbzq
      this.searchKey = `${val}_${value}`
    },
    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh, ssq, tbzq } = this.$route.query
      this.form.nsrsbh = nsrsbh;
      this.form.ssq = ssq
      this.querySdstbzq = tbzq
      this.form.tbzq = tbzq
      this.handleSearch()
    },
    // 修改单元格样式
    cellStyle({ row, column, $rowIndex }) {
      // yhsxlb：优惠事项类别 9 可以编辑金额
      if (!this.canUpdate) {
        return null
      }
      if (['jmsdse'].includes(column.field) && row.yhsxlb == 9) {
        return {
          background: '#D9F2FD',
          borderBottom: '1px solid #e8eaec'
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
    getQuarterPickerFrom(propsParam, data) {
      this.form[propsParam] = data
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
    canUpdate() {
      return !this.querySbStatus
    }
  }
};
</script>
<style scoped lang="scss">
.search-box {
  display: flex;
  padding-top: 12px;
  justify-content: space-between
}

.el-form {
  flex-basis: calc(100% - 170px);
}

.toolbar {
  padding: 8px 0;
}

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
</style>

