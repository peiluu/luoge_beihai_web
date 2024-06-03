<template>
  <div>
    <div>
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" :disabled="operateType === 'detail'">
        <div class="content-title">客户信息</div>
        <el-form-item label="所属开票点" prop="orgids" class="form-orgids">
          <el-select v-model="form.orgids" placeholder="请选择" filterable :disabled="isDisabled"  clearable multiple @change="handleChange">
            <el-option :class="`li-all ${selectedAll ? 'selected' : ''}`" :value="0"><span class="s-all"
                @click.stop="handleClick">全选</span></el-option>
            <el-option v-for="(item, index) in taxBodyList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺名称" prop="gmfcode">
          <el-input v-model="form.gmfcode" placeholder="请输入" maxlength="300" />
        </el-form-item>
        <el-form-item label="客户名称" prop="gmfMc">
          <el-input v-model="form.gmfMc" placeholder="请输入" maxlength="300" />
        </el-form-item>
        <el-form-item label="客户纳税人识别号" prop="gmfNsrsbh">
          <el-input v-model="form.gmfNsrsbh" placeholder="请输入" maxlength="20" />
        </el-form-item>
        <el-form-item label="地址" prop="dzdh">
          <el-input v-model="form.dzdh" placeholder="请输入" maxlength="300" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入" maxlength="13" />
        </el-form-item>
        <el-form-item label="开户行" prop="yhzh">
          <el-input v-model="form.yhzh" placeholder="请输入" maxlength="120" />
        </el-form-item>
        <el-form-item label="账号" prop="bankaccount">
          <el-input v-model="form.bankaccount" placeholder="请输入" maxlength="50" />
        </el-form-item>
        <el-form-item label="联系人" prop="username">
          <el-input v-model="form.username" placeholder="请输入" maxlength="90" />
        </el-form-item>
        <el-form-item label="联系人手机" prop="revphone">
          <el-input v-model="form.revphone" placeholder="请输入" maxlength="90" />
        </el-form-item>
        <el-form-item label="邮箱" prop="revemail">
          <el-input v-model="form.revemail" placeholder="请输入" maxlength="90" />
        </el-form-item>
        <!-- <el-form-item  prop="hmd">
        <el-switch v-model="form.hmd" active-text="标记黑名单" inactive-text="移除黑名单">
        </el-switch> -->
        <!-- </el-form-item> -->
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
import { isDistinction } from '@/config/setting.js'
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
      form: {
        orgids:null
      },
      operateType: "",
      rules: {
        orgids: [{ required: true, message: "请选择", trigger: "blur" }],
        gmfNsrsbh: [
          { required: true, message: "请输入", trigger: "blur" },
          regCollection.nsrsbh,
        ],
        gmfMc: [{ required: true, message: "请输入", trigger: "blur" }],
        //gmfcode: [{ required: true, message: "请输入", trigger: "blur" }],
        revemail: [{ validator: this.verify_email, message: "邮箱格式不正确", trigger: "blur" }],
        // address: [{ required: true, message: "请输入", trigger: "blur" }],
        // phone: [{ required: true, message: "请输入", trigger: "blur" }, regCollection.phone],
        // bankAccount: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      saveLoading: false,
      // 是否全选
      selectedAll: false,
      isDisabled:false,
    };
  },
  mounted() {
    this.getOrgLists();

  },

  methods: {
    handleClick() {
      this.selectedAll = !this.selectedAll;
      if (this.selectedAll) {
        const ids = this.taxBodyList.map(item => item.id)
        this.$set(this.form, 'orgids', ids)
      } else {
        this.$set(this.form, 'orgids', [])
      }
    },
    handleChange() {
      this.selectedAll = this.form.orgids.length === this.taxBodyList.length
    },
    //     editTaxBody() {
    //   const selectedIds = this.form.orgids;
    //   this.form.orgids = selectedIds;
    //   this.selectedAll = selectedIds === this.taxBodyList;
    // },

    async initData() {
      const { detailInfo } = this
      if (detailInfo.id) {
        try {
          const res = await getDetailById({ id: detailInfo.id })
          if (res.code === '0') {
            const { data } = res;
            let ids = [];
            if (data.orgids.length === 1 && data.orgids[0] === 0) {
              ids = this.taxBodyList.map((x) => x.id);
              this.selectedAll = true;
            } else {
              ids = data.orgids.map(item => String(item));
              this.selectedAll = false;
            }

            this.form = {
              id: data.id,
              orgids: ids,
              gmfcode: data.gmfcode,
              gmfMc: data.gmfMc,
              gmfNsrsbh: data.gmfNsrsbh,
              dzdh: data.dzdh,
              phone: data.phone,
              yhzh: data.yhzh,
              bankaccount: data.bankaccount,
              username: data.username,
              revphone: data.revphone,
              revemail: data.revemail,
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
        if(isDistinction === 1){
          this.handleClick();
          this.isDisabled = true;
        }
        // 编辑初始化值
        this.initData();
      }
    },
    /**
     * @description 提交表单，验证数据格式
     */
    async submit() {
      this.$refs["ruleForm"].validate(async (valid) => {
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
        let params = {
          ...this.form,
          orgids: this.selectedAll ? [0] : this.form.orgids
        }
        const { code = "", data = [], msg = "操作失败" } = await api(params);
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

.li-all {
  padding: 0 !important;

  &::after {
    top: 0;
  }
}

.s-all {
  display: block;
  padding: 0 20px;
  height: 100%;
}

.form-orgids {
  /deep/ .el-select__tags {
    max-height: 100px;
    overflow: hidden;
    overflow-y: auto;
  }

  /deep/ .el-input {
    max-height: 100px;
  }
}
</style>
