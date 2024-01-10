<template>
  <div class="custom-table">
    <template v-if="canEdit">
      <el-table stripe ref="table" border tooltip-effect="dark" :data="[{}]" :span-method="spanMethod" :header-cell-style="{
        fontWeight: 400,
        borderTop: '1px solid #adb4bc',
        background: '#f7f9fd',
        color: '#333333',
        textAlign: 'center'
      }">

        <el-table-column label="税控设备" class="edit-form">
          <!-- 添加税控设备 -->
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm">
            <el-form-item label="税控设备编号" prop="taxMechCode">
              <el-input v-model="form.taxMechCode" placeholder="请输入">
                <i slot="prefix" class="el-icon-document" @click="showDialog" />
              </el-input>
            </el-form-item>
            <el-form-item label="税控设备名称" prop="taxMechName">
              <el-input v-model="form.taxMechName" placeholder="请输入" maxlength="100" />
            </el-form-item>
            <template v-if="isKp">
              <el-form-item label="税控设备类型" prop="taxSoftVersion">
                <el-select v-model="form.taxSoftVersion" placeholder="请选择" filterable clearable>
                  <el-option value="HX2.1" label="航信金税盘" />
                  <el-option value="BW2.0" label="百望税控盘" />
                  <el-option value="SWUkey" label="税务ukey" />
                  <!-- <el-option value="KPZD" label="虚拟Ukey开票终端" /> -->
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.taxSoftVersion === 'KPZD'" label="开票终端代码" prop="virtualUkeyDM">
                <el-select v-model="form.terminalCode" placeholder="请选择" filterable clearable>
                  <el-option v-for="item in invoicingTerminal" :label="item.name" :value="item.id" :key="item.id" />"、
                </el-select>
              </el-form-item>
              <el-form-item label="发票开具限额" prop="billingLimit">
                <el-input v-model="form.billingLimit" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="编码版本号" prop="bmbBbh">
                <el-select v-model="form.bmbBbh" placeholder="请选择" filterable clearable>
                  <el-option v-for="item in bmb_bbhList" :label="item" :value="item" :key="item" />
                </el-select>
              </el-form-item>
            </template>
            <el-form-item label="发票种类" prop="invoiceType">
              <el-select v-model="form.invoiceType" placeholder="请选择" filterable clearable>
                <el-option value="4" label="增值税专用发票" />
                <el-option value="3" label="增值税普通发票" />
                <el-option value="2" label="增值税电子专用发票" />
                <el-option value="1" label="增值税电子普通发票" />
              </el-select>
            </el-form-item>
            <div class="form-footer">
              <el-button @click="cancel">取消</el-button>
              <el-button type="success" @click="submit">保存</el-button>
            </div>
          </el-form>
        </el-table-column>
      </el-table>

    </template>

    <template v-else>
      <el-table stripe ref="table" border tooltip-effect="dark" :data="taxMechs" align="center" :header-cell-style="{
        fontWeight: 400,
        borderTop: '1px solid #adb4bc',
        background: '#f7f9fd',
        color: '#333333',
        textAlign: 'center'
      }" :cell-style="{ 'text-align': 'center' }">

        <el-table-column label="税控设备编号" prop="taxMechCode" min-width="120" />
        <el-table-column label="税控设备名称" prop="taxMechName" min-width="170" />
        <el-table-column prop="invoiceType" label="发票种类">
          <template slot-scope="{row}">{{ row.invoiceType == 1 ? '增值税电子普通发票' : row.invoiceType == 2 ? '增值税电子专用发票' : row.invoiceType == 3 ? '增值税普通发票' : row.invoiceType == 4 ? '增值税专用发票' : '' }}</template>
        </el-table-column>

        <template v-if="isKp">
          <el-table-column prop="taxSoftVersion" label="税控设备类型">
            <template slot-scope="{row}">
              {{ row.taxSoftVersion == 'HX2.1' ? '航信金税盘' : row.taxSoftVersion == 'BW2.0' ? '百望税控盘' : row.taxSoftVersion == 'SWUkey' ? '税务ukey' : row.taxSoftVersion == 'KPZD' ? '虚拟Ukey开票终端' :
                '' }}</template>
          </el-table-column>
          <el-table-column label="发票开具限额" prop="billingLimit" />
        </template>

        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
            <el-button @click="handleDelete(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!--选择税控设备-->
    <SelectTaxControlEquipmentModal :key="nsrsbh" :nsrsbh="nsrsbh" :isKp="isKp" :taxMechs="taxMechs" @handleSubmit="handleSubmit" ref="taxControl" />
  </div>
</template>

<script>
/**
 * @description 税控设备添加
 */
import { bmb_bbh, queryInvoicingTerminal } from "./Api";
import SelectTaxControlEquipmentModal from '@/components/SelectTaxControlEquipmentModal/Index.vue';
export default {
  name: 'TaxControlEquipment',
  components: { SelectTaxControlEquipmentModal },
  props: {
    isKp: {
      type: Boolean,
    },
    // 添加
    isAdd: {
      type: Boolean,
    },
    nsrsbh: {
      type: String
    },
    taxBodyId: {
      type: String
    },
    taxMechs: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      // 操作按钮列表
      btnList: [{ name: 1 }],
      form: {
        invoiceType: '4',
        taxSoftVersion: 'HX2.1'
      },
      dialogVisible: false,
      isEdit: false,
      bmb_bbhList: [],
      invoicingTerminal: [],
      rules: {
        taxMechCode: [{ required: true, message: "请输入", trigger: "blur" }],
        taxSoftVersion: [{ required: true, message: "请选择", trigger: "blur" }],
        terminalCode: [{ required: true, message: "请选择", trigger: "blur" }],
        billingLimit: [{ required: true, message: "请输入", trigger: "blur" },
        { pattern: /^([1-9][0-9]{0,8})(\.[0-9]{1,2})?$|^([0])(\.[0-9]{1,2})?$/, message: '请输入非0开头，不超过9位数(允许有两位小数)' }],
        bmbBbh: [{ required: true, message: "请选择", trigger: "blur" }],
        invoiceType: [{ required: true, message: "请选择", trigger: "blur" }],
      },
      currentIndex: 0,
    };
  },
  activated() { },
  mounted() {
    this.bmb_bbh();
    this.queryInvoicingTerminal();
  },
  computed: {
    canEdit() {
      return this.isAdd || this.isEdit
    },
  },
  methods: {
    // 【组织管理】获取编码版本号
    async bmb_bbh() {
      const { code = '', data = [] } = await bmb_bbh({})
      if (code === '0') {
        this.bmb_bbhList = data
        this.form.bmb_bbh = data[0]
      }
    },
    // 【组织管理】获取开票终端代码
    async queryInvoicingTerminal() {
      const { code = '', data = [] } = await queryInvoicingTerminal({
        taxBodyId: this.taxBodyId
      })
      if (code === '0') {
        this.invoicingTerminal = data;
      }
    },

    spanMethod({ rowIndex }) {
      if (rowIndex === 0 && this.canEdit) {
        return this.isKp ? {
          rowspan: 1,
          colspan: 6
        } : {
          rowspan: 1,
          colspan: 4
        }
      }
    },
    showDialog() {
      // if (!this.nsrsbh) {
      //   this.$message.warning('请先选择所属主体!')
      //   return
      // }
      this.$refs.taxControl.dialogVisible = true
      this.dialogVisible = true;
    },
    /**
        * @description 提交表单，验证数据格式
        */
    async submit() {
      this.$refs["ruleForm"].validate(async valid => {
        if (!valid) return;
        const taxMechs = this.isEdit ? this.taxMechs.filter((item) => item.id != this.form.id) : this.taxMechs
        if (taxMechs.some((item) => item.invoiceType == this.form.invoiceType)) {
          this.$message.warning('已存在当前票种的税控设备');
          return
        }
        if (this.isEdit) {
          this.taxMechs.splice(this.currentIndex, 1, this.form)

        } else {
          this.taxMechs.push(this.form)
        }

        this.$emit('saveTaxMechs', this.taxMechs)
        this.cancel();
      })
    },
    cancel() {
      this.form = {};
      this.isEdit = false
      this.$emit('handleCancel', this.isKp ? 'isAddKp' : 'isEditRz')
    },

    handleDelete(index) {
      this.taxMechs.splice(index, 1)

    },
    // 提交弹窗选择
    handleSubmit(row, flag) {
      this.form = row
    },
    // 编辑税控设备
    handleEdit(data, index) {
      this.isEdit = true
      this.form = data
      this.currentIndex = index
    },
  }
};
</script>
<style lang="scss" scoped>
@import '../../../styles/variables.scss';
.custom-table {
  padding: 0 64px;
}

::v-deep .el-input__prefix {
  left: initial;
  right: 5px;

  .el-icon-document {
    font-size: 16px;
    color: $primaryGreenColor;
  }
}

::v-deep .el-input--prefix .el-input__inner {
  padding-left: 15px;
}

::v-deep.el-table--enable-row-hover .el-table__body tr:hover>td {
  background-color: #fff !important;
}

::v-deep .el-form {
  margin-top: 12px;

  .cell {
    padding: 0 !important
  }

  .el-form-item {
    width: calc(50% - 10px) !important;
    margin-bottom: 16px;

    .el-form-item__label {
      width: 140px;
    }

    .el-form-item__content {
      width: calc(100% - 150px);

      .el-select,
      .el-date-editor,
      .el-input {
        width: 100%;
      }
    }
  }

  .form-footer {
    margin-bottom: 16px;
    margin-right: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
