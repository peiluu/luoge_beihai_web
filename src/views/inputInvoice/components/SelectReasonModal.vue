<template>
  <!-- 驳回原因 -->
  <el-dialog title="请确认原因" :visible.sync="dialogVisible" width="40%" :before-close="handleClose" class="reason-dialog">
    <div class="title"><i class="el-icon-warning" />不抵扣原因</div>
    <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm">
      <el-form-item prop="bdklx">
        <el-radio-group v-model="form.bdklx">
          <el-radio v-for="item in bdklxList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.bdklx === 5" prop="bdkyy">
        <el-input v-model="form.bdkyy" maxlength="50" placeholder="最多输入50个字" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="success" @click="submitBdklx">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { bdklxList } from '../constant'
export default {
  name: 'SelectReasonModal',
  props: { },
  data() {
    return {
      form: {},
      bdklxList,
      rules: {
        bdklx: [{ required: true, message: "请选择", trigger: "blur" }],
        bdkyy: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      dialogVisible: false
    }
  },

  computed: {},

  methods: {
    // 选择不抵扣原因
    submitBdklx() {
      this.$refs["ruleForm"].validate(async valid => {
        if (!valid) return;
        this.$emit('submitBdklx', this.form)
        this.handleClose()
      })
    },

    handleClose() {
      this.dialogVisible = false
      this.form = {}
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../../styles/variables.scss';
/deep/ .el-dialog__body {
  font-size: 15px;
  padding: 4px 80px 12px;

  .title {
    display: flex;
    font-size: 16px;
    align-items: center;
    font-weight: bold;
    text-align: center;
    color: $mainTextColor;
  }

  .el-icon-warning {
    margin-right: 4px;
    color: #1890ff;
    font-size: 30px;
  }

  .el-form {
    padding-left: 32px;
  }

  .el-form-item {
    width: 100%;
    margin-bottom: 8px;
  }

  .el-form-item__content {
    width: 80%;
  }

  .el-radio {
    padding-top: 15px;
    width: 100%;

    .el-radio__label {
      font-size: 15px;
    }
  }
}
</style>
