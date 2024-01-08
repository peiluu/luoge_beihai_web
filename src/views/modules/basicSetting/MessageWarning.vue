<template>
  <div class="com-message-warning">
    <div class="container-title">短信预警</div>

    <div class="container-form">
      <el-form ref="form" :model="formData" v-loading="loading">
        <el-form-item label="预警手机号" prop="sjhm" :rules="[
        	{ required: true, message: '请输入手机号码' },
        	{
        		pattern:
        			/^(0|86|17951)?(13[0-9]|14[01456789]|15[012356789]|16[567]|17[01345678]|18[0-9]|19[189])[0-9]{8}$/i,
        		message: '请输入正确的手机号码',
        	},
        ]">
          <el-input v-model="formData.sjhm" :disabled="!isEdit" placeholder="请输入" maxlength="11" oninput="value=value.replace(/[^\d]/g, '')" />
        </el-form-item>
      </el-form>

      <div class="btn-box" v-if="isEdit">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
      <el-button type="primary" @click="isEdit = true" v-else>编辑信息</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { editBasicSetting } from "./basicSettingApi";

export default {
  name: "MessageWarning",
  props: {
    // { regexp: /^(0|86|17951)?(13[0-9]|14[01456789]|15[012356789]|16[567]|17[01345678]|18[0-9]|19[189])[0-9]{8}$/i,
    detail: {
      type: Object,
      defalut: () => { }
    }
  },
  data() {
    return {
      api: require("./basicSettingApi"),
      formData: {},
      isEdit: false,
      loading: false
    };
  },
  watch: {
    detail(val) {
      this.formData = { ...val };
    }
  },

  methods: {
    cancel() {
      this.isEdit = false;
      this.formData = { ...this.detail };
    },
    /**
     * @desption - 新增、修改基础设置。
     */
    async submitForm(formName) {
      const that = this;
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const param = {
            ...this.detail,
            ...this.formData,
            zdsb: this.detail.zdsb ? "1" : "0",
            zdjk: this.detail.zdjk ? "1" : "0"
          };
          const {
            data: { code = "" }
          } = await editBasicSetting(param);
          if (code == 0) {
            that.$message.success("修改成功");
            this.isEdit = false;
            return;
          }
        }
      });
    }
  },
  computed: {}
};
</script>

<style scoped lang="scss">
.com-message-warning {
  padding: 12px 24px;

  .container-title {
    font-size: 18px;
    font-weight: bold;
  }

  .el-form-item {
    margin-top: 12px;
  }

  .container-info {
    padding: 32px 0;

    .tit {
      display: flex;
      align-items: center;
      font-size: 14px;

      img {
        width: 16px;
        margin-left: 8px;
      }
    }

    .info-main {
      margin-top: 16px;
      padding: 12px;
      border: 1px solid #ccc;
      background: #f2f2f2;
      border-radius: 8px;

      div:not(:first-child) {
        margin-top: 12px;
      }
    }
  }

  .dialog-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: 1px solid #ccc;
  }

  .dialog-main {
    .el-radio {
      width: calc(100% - 30px);
      margin-top: 24px;
      display: flex;
      align-items: center;
    }

    .txt {
      padding-top: 8px;
      color: #ccc;
    }
  }
}
</style>
