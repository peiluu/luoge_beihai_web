<template>
  <el-dialog title="选择税控设备" :visible.sync="dialogVisible" min-height="600px;" width="70%" :before-close="handleClose">
    <div class="content-right">
      <vxe-toolbar ref="buyerToolbar">
        <template #buttons>
          <vxe-input size="mini" @keyup.enter.native="getTaxMechList" @clear="getTaxMechList" style="width: 500px;" v-model="customerQuery.keyword" placeholder="请输入税控设备编号/税控设备名称/纳税人识别号" clearable>
            <template #prefix>
              <i style="cursor: pointer;color: #00b390;font-size: 16px;" class="vxe-icon-search" @click="getTaxMechList"></i>
            </template>
          </vxe-input>
          <el-button style="margin-left: 12px;" size="mini" type="success" @click="getTaxMechList">查询</el-button>
        </template>

      </vxe-toolbar>

      <vxe-table size="mini" border stripe ref="mutiVxeTable" height="400" id="mutiVxeTable" :data="tableData" :row-config="{ isHover: true, isCurrent: true }">
        <vxe-column type="radio" min-width="2%" />
        <vxe-column field="nsrsbh" title="纳税人识别号" min-width="15%" />
        <vxe-column field="taxMechCode" title="税控设备编号" min-width="15%" />
        <template v-if="isKp">
          <vxe-column field="taxMechName" title="税控设备名称" min-width="15%" />
          <vxe-column field="taxSoftVersion" title="税控设备类型" min-width="15%">
            <!-- <template #default="{ row }"> {{ row.taxSoftVersion == 1 ? '税控盘' : '税控服务器' }}</template> -->
            <template #default="{ row }"> {{ row.taxSoftVersion == 'HX2.1' ? '航信金税盘' : row.taxSoftVersion == 'BW2.0' ? '百望税控盘' : row.taxSoftVersion == 'SWUkey' ? '税务ukey' : row.taxSoftVersion == 'KPZD' ? '虚拟Ukey开票终端' :
              '' }}</template>

          </vxe-column>


        </template>
        <vxe-column field="invoiceType" title="发票种类" min-width="15%">
          <template #default="{ row }"> {{ row.invoiceType == 1 ? '增值税电子普通发票' : row.invoiceType == 2 ? '增值税电子专用发票' : row.invoiceType == 3 ? '增值税普通发票' : row.invoiceType == 4 ? '增值税专用发票' : '' }}</template>
        </vxe-column>
        <vxe-column v-if="isKp" field="billingLimit" title="发票开具限额" min-width="15%" />

      </vxe-table>
      <!-- <vxe-pager size="mini" :current-page="customerPage.currentPage" :page-size="customerPage.pageSize" :total="customerPage.totalResult" :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="handleCustomerPageChange">
      </vxe-pager> -->
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="success" @click="handleSubmit">添加</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getTaxMechList } from './Api';

export default {
  name: 'TaxControlEquipmentModal',
  props: {
    isKp: {
      type: Boolean,
    },
    taxMechs: {
      type: Array,
    },
    nsrsbh: {
      type: String
    }
  },
  data() {
    return {
      tableData: [],
      customerQuery: {},
      dialogVisible: false,
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.getTaxMechList()
      }
    },
  },

  methods: {
    /**
 * @desption 【组织管理】获取税控设备列表
 */
    async getTaxMechList() {
      const { code = '', data = [] } = await getTaxMechList({
        nsrsbh: this.nsrsbh,
        ...this.customerQuery
      })
      if (code === '0') {
        this.tableData = data
      }
    },

    handleClose() {
      this.$refs.mutiVxeTable.removeRadioRow();
      this.dialogVisible = false
    },
    // 提交勾选的数据
    handleSubmit() {
      const row = this.$refs.mutiVxeTable.getRadioRecord()
      if (!row) {
        this.$message.warning('请选择数据！');
        return
      }
      if (this.taxMechs.some((item) => item.invoiceType == row.invoiceType)) {
        this.$message.warning('已存在当前票种的税控设备');
        return
      }
      this.handleClose();
      this.$emit('handleSubmit', row)
    },
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/variables.scss';

::v-deep .el-dialog {
  position: relative;
  z-index: 99999;

  .el-dialog__body {
    display: flex;
    padding: 10px 0;
  }
}

::v-deep .vxe-body--row {
  cursor: pointer;
}

.vxe-toolbar {
  padding: 0;
}

::v-deep .vxe-table {
  .vxe-body--row.row--hover.row--current,
  .row--current,
  .row--hover {
    background: #ccf0ec;
  }
}


.content-right {
  margin: 0 12px;
  width: calc(100% - 24px);

  .right-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  ::v-deep .vxe-table {
    width: 100%;
    margin-top: 10px;

    .vxe-radio--icon,
    .vxe-icon-radio-checked,
    .vxe-icon-radio-unchecked:hover {
      color: $primaryGreenColor !important;
    }
  }
}

::v-deep.el-input {
  width: 50%;

  .el-input__suffix {
    display: flex;
    align-items: center;
    left: 8px;
  }

  .el-input__inner {
    padding-left: 24px;
  }
}
</style>
