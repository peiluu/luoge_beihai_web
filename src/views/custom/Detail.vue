<template>
  <div>
    <div class="main-content">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" :disabled="operateType === 'detail'">
        <div class="content-title">客户信息</div>
        <el-form-item label="所属开票点" prop="orgids">
          <el-select v-model="form.orgids" placeholder="请选择" filterable clearable multiple>
            <el-option v-for="(item, index) in taxBodyList" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称" prop="gmfMc">
          <el-input v-model="form.gmfMc" placeholder="请输入" maxlength="100" />
        </el-form-item>
        <el-form-item label="客户纳税人识别号" prop="gmfNsrsbh">
          <el-input v-model="form.gmfNsrsbh" placeholder="请输入" maxlength="20" />
        </el-form-item>
        <el-form-item label="地址" prop="dzdh">
          <el-input v-model="form.dzdh" placeholder="请输入" maxlength="80" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入" maxlength="13" />
        </el-form-item>
        <el-form-item label="开户行" prop="yhzh">
          <el-input v-model="form.yhzh" placeholder="请输入" maxlength="13" />
        </el-form-item>
        <el-form-item label="账号" prop="bankaccount">
          <el-input v-model="form.bankaccount" placeholder="请输入" maxlength="90" />
        </el-form-item>
        <el-form-item label="联系人" prop="username">
          <el-input v-model="form.username" placeholder="请输入" maxlength="90" />
        </el-form-item>
        <el-form-item label="联系人手机" prop="revphone">
          <el-input v-model="form.revphone" placeholder="请输入" maxlength="90" />
        </el-form-item>
      </el-form>
    </div>

    <div class="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="success" @click="submit" v-if="operateType !== 'detail'">保存</el-button>
    </div>
  </div>
</template>

<script>
import { regCollection } from "@/config/constant.js";
import { updateCustomer, getOrgList, addCustomer, getDetailById } from "./Api";
export default {
  name: "organizationTaxBodyDetail",
  components: {},
  props: {
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      taxBodyList: [],
      form: {},
      operateType: "",
      rules: {
        orgids: [{ required: true, message: "请选择", trigger: "blur" }],
        gmfNsrsbh: [
          { required: true, message: "请输入", trigger: "blur" },
          regCollection.nsrsbh,
        ],
        gmfMc: [{ required: true, message: "请输入", trigger: "blur" }],
        // address: [{ required: true, message: "请输入", trigger: "blur" }],
        // phone: [{ required: true, message: "请输入", trigger: "blur" }, regCollection.phone],
        // bankAccount: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      saveLoading: false,
    };
  },
  mounted() {
    this.getOrgLists();
    // 编辑初始化值
    this.initData();
  },

  methods: {
    async initData() {
      const { detailInfo } = this
      if (detailInfo.id) {
        try {
          const res = await getDetailById({ id: detailInfo.id })
          if (res.code === '0') {
            const { data } = res;
            this.form = {
              id: data.id,
              orgids: data.orgids.map(item => String(item)),
              gmfMc: data.gmfMc,
              gmfNsrsbh: data.gmfNsrsbh,
              dzdh: data.dzdh,
              phone: data.phone,
              yhzh: data.yhzh,
              bankaccount: data.bankaccount,
              username: data.username,
              revphone: data.revphone,
            };
          }

        } catch (error) {
          console.log(error)
        }
      }
    },
    /**
     * @desption 开票点
     */
    async getOrgLists() {
      const { code = "", data = [] } = await getOrgList({});
      if (code === "0") {
        this.taxBodyList = data;
      }
    },
    /**
     * @description 提交表单，验证数据格式
     */
    async submit() {
      this.$refs["ruleForm"].validate(async (valid) => {
        debugger;
        if (!valid) return;
        this.saveTaxBody();
      });
    },

    /**
     * @desption 【组织管理】保存纳税主体
     */
    async saveTaxBody() {
      try {
        this.saveLoading = true;
        const api = this.form.id ? updateCustomer : addCustomer;
        const { code = "", data = [], msg = "操作失败" } = await api(this.form);
        if (code === "0") {
          this.$message.success("操作成功");
          this.$emit("onOk");
        } else {
          this.$message.error(msg);
        }
      } catch (error) {
        this.$message.error(error.msg || "操作失败");
      } finally {
        this.saveLoading = false;
      }
    },
    cancel() {
      this.$emit("onClose");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/variables.scss";

.main-content {
  padding: 0 32px 16px;
  margin-bottom: 32px;
}

::v-deep .el-form-item {
  width: calc(50% - 10px);
  margin-bottom: 16px;

  .el-form-item__label {
    width: 200px;
  }

  .el-form-item__content {
    width: calc(100% - 200px);

    .el-select,
    .el-date-editor,
    .el-input,
    .el-cascader {
      width: 100%;
    }
  }

  .el-checkbox__input.is-checked+.el-checkbox__label,
  .el-radio__input.is-checked+.el-radio__label {
    color: #606266;
  }

  &.flex-item {
    width: 100%;

    .info-tip {
      padding-left: 4px;
      color: red;
    }
  }
}

.content-title {
  font-weight: bold;
  padding: 12px 0;
  font-size: 14px;
  width: 120px;
  text-align: right;
  color: $primaryGreenColor;
}

// 处理第一行数据
::v-deep .form-header-left.el-form-item {
  margin-bottom: 0;
  color: #606266;
  font-size: 14px;

  .el-form-item__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 50px);
  }

  .right-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .el-switch {
      margin-left: 12px;
    }
  }
}

.select-company {
  margin-left: -50%;
}

.company-info {
  display: flex;

  ::v-deep .input-name {
    display: flex;
    align-items: center;
  }

  .el-form-item__content {
    display: flex;
    align-items: center;

    .el-input {
      width: 60% !important;
    }

    .el-icon-plus {
      margin: 0 12px;
      font-size: 40px;
      color: #ccc;
      border: 1px solid #ccc;
    }

    .upload {
      display: flex;
      align-items: center;
    }

    .el-upload__tip {
      margin: 0;
      cursor: pointer;
      color: $primaryGreenColor;
    }
  }
}

::v-deep .el-dialog__body {
  padding-top: 16px;

  .el-input,
  .el-select {
    width: 100%;
  }

  .table-tools {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 4px;
  }
}

.footer {
  text-align: center;
}
</style>
