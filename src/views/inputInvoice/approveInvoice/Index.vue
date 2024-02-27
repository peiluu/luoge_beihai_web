<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="发票种类" prop="fplx">
        <el-select v-model="form.fplx" placeholder="请选择">
          <el-option v-for="item in fplxOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发票号码" prop="fphm">
        <el-input v-model="form.fphm" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="发票代码" prop="fpdm" v-if="!['81', '82', '51', '61'].includes(form.fplx)">
        <el-input v-model="form.fpdm" placeholder="请输入" />
      </el-form-item>

      <el-form-item label="发票金额" prop="hjje">
        <el-input v-model="form.hjje" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="开票日期" prop="kprq">
        <el-date-picker v-model="form.kprq" value-format="yyyy-MM-dd" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="销售 (购买)方纳税识别号" prop="nsrsbh">
        <el-input v-model="form.nsrsbh" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="校验码（后6位）" prop="jym">
        <el-input v-model="form.jym" placeholder="请输入" />
      </el-form-item>
      <el-form-item class="content-footer" label="">
        <div>
          <el-button @click="reset">重置</el-button>
          <el-button type="success" @click="submit">查询</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div class="custom-table">
      <el-table stripe ref="table" border tooltip-effect="dark" highlight-current-row :height="height" :data="tableData" :header-cell-style="{
        fontWeight: 400,
        borderTop: '1px solid #adb4bc',
        background: '#f7f9fd',
        color: '#333333',

      }">
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column label="发票号码" prop="fphm" />
        <el-table-column label="发票代码" prop="zzfpDm" />
        <el-table-column label="发票风险等级" prop="sfycpz" align="center">
          <template slot-scope="scope">
            {{
              scope.row.fpzt == '01'
              ? '正常'
              : scope.row.fpzt == '02'
                ? '异常'
                : scope.row.fpzt == '03'
                  ? '疑似异常'
                  : '正常'
            }}
          </template>
        </el-table-column>
        <el-table-column label="是否红冲" prop="fpzt" align="center">
          <template slot-scope="scope">
            {{
              scope.row.fpzt == 0
              ? '正常'
              : scope.row.fpzt == 2
                ? '作废'
                : scope.row.fpzt == 3
                  ? '已红冲'
                  : scope.row.fpzt == 7
                    ? '部分红冲'
                    : scope.row.fpzt == 8
                      ? '全额冲红'
                      : '正常'
            }}
          </template>
        </el-table-column>
        <el-table-column label="查验时间" prop="dateStr" align="center" />
        <el-table-column label="查验结果" prop="resultCode" align="center">
          <template slot-scope="scope">
            {{
              scope.row.resultCode == '00'
              ? '查验一致'
              : scope.row.resultCode == '01'
                ? '查验不一致'
                : scope.row.resultCode == '02'
                  ? '查无数据'
                  : scope.row.resultCode == '03'
                    ? '查验不一致'
                    : scope.row.resultCode == '04'
                      ? '此发票非本单位开具或取得'
                      : '成功'
            }}
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-popover placement="left" trigger="hover" popper-class="customPopper">
              <template>
                <el-button @click="handleViewClick(scope.row)">预览</el-button>
                <el-button @click="handleViewClick(scope.row)">查看用途</el-button>
              </template>
              <el-button slot="reference">操作</el-button>
            </el-popover>
          </template>

        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { approveInvoice } from "./Api";

export default {
  name: "InputInvoiceApproveInvoice",
  components: {},
  data() {
    return {
      tableData: [],
      form: {},
      rules: {
        hjje: [
          { required: true, message: "请输入", trigger: "blur" },
          { pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/, message: "请输入正确的数字金额" }
        ],
        fphm: [{ required: true, message: "请输入", trigger: "blur" }],
        fpdm: [{ required: true, message: "请输入", trigger: "blur" }],
        nsrsbh: [{ required: true, message: "请输入", trigger: "blur" }],
        kprq: [{ required: true, message: "请选择", trigger: "blur" }],
        fplx: [{ required: true, message: "请选择", trigger: "blur" }],
      },
      fplxOptions: [{
        value: '01',
        label: '增值税专用发票'
      }, {
        value: '02',
        label: '货物运输业增值税专用发票'
      }, {
        value: '03',
        label: '机动车销售统一发票'
      }, {
        value: '04',
        label: '增值税普通发票'
      }, {
        value: '08',
        label: '增值税电子专用发票'
      }, {
        value: '10',
        label: '增值税电子普通发票'
      }, {
        value: '11',
        label: '卷式发票'
      }, {
        value: '14',
        label: '通行费发票'
      }, {
        value: '15',
        label: '二手车销售统一发票'
      }, {
        value: '81',
        label: '数电增值税专用发票'
      }, {
        value: '82',
        label: '数电增值税普通发票'
      }, {
        value: '85',
        label: '纸质发票（增值税专用发票）'
      }, {
        value: '86',
        label: '纸质发票（普通发票）'
      }, {
        value: '51',
        label: '数电铁路电子客票'
      }, {
        value: '61',
        label: '数电航空运输客票电子行程单'
      }],
    };
  },

  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
    height() {
      return window.innerHeight - 360;
    },
  },

  methods: {
    /**
     * @description 提交表单，验证数据格式
     */
    async submit() {
      this.$refs["ruleForm"].validate(async valid => {
        if (!valid) return;
        const data = await approveInvoice(this.form);
        if (data.code === '0') {
          this.tableData = data.data;
        }
      })
    },
    reset() {
      this.form = {}
    },
    handleViewClick() { }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-form-item {
  width: calc(33.3% - 10px);

  .el-form-item__label {
    width: 180px;
  }

  .el-form-item__content {
    width: calc(100% - 180px);

    .el-select,
    .el-date-editor,
    .el-input {
      width: 100%;
    }
  }
}

.content-footer {
  &.el-form-item {
    width: 100%;
    padding-right: 10px;
  }

  /deep/ .el-form-item__content {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }
}
</style>

