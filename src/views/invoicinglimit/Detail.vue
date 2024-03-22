<template>
  <div>
    <div>
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" :disabled="operateType === 'detail'">
        <div class="content-title"></div>
        <el-form-item label="请选择纳税主体" prop="nsrsbh">
          <el-select v-model="form.nsrsbh" placeholder="请选择" filterable clearable multiple :disabled="!!detailInfo.id">
            <el-option v-for="(item, index) in taxBodyList" :key="index" :label="item.nsrmc" :value="item.nsrsbh">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择限制的税率" prop="slv">
          <el-select v-model="form.slv" placeholder="请选择" multiple>
            <el-option v-for="item in slList" :label="item.mc" :value="item.slzf" :key="item.mc"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="限制约束" prop="ysxz">
          <el-select v-model="form.ysxz" placeholder="请选择" maxlength="80" disabled>
            <el-option label="不得开具" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择发票类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择" maxlength="80">
            <el-option label="蓝字专用发票" value="01"></el-option>
            <el-option label="蓝字普通发票" value="02"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择限制结果" prop="xzjg">
          <el-select v-model="form.xzjg" placeholder="请选择" maxlength="80">
            <el-option label="提醒" :value="1"></el-option>
            <el-option label="拒绝" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="form.xzjg === '1'">
          <span class="text">您开具的商品税率存在3%的税率，不符合开具标准，是否继续开具？</span>
        </div>
        <div v-else-if="form.xzjg === '2'">
          <span>不得开具税率为3%的发票，若需要开具请联系区域经理</span>
        </div>
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
import { updateInvoicekpxz, getListall, addInvoicekpxz, getDetailById, getDicZzsSl } from "./Api";
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
        qyzbs: "",
        ysxz: 1
      },
      // type: {
      //   '01': '蓝字专用发票',
      //   '02': '蓝字普通发票'
      // },
      // xzjg: {
      //   1: '提醒',
      //   2: '拒绝'
      // },
      // slv: {
      //   1: '免税',
      //   2: '不征税',
      //   3: '0%',
      //   4: '1%',
      //   5: '3%',
      //   6: '5%',
      //   7: '6%',
      //   8: '9%',
      //   9: '11%',
      //   10: '13%',

      // },
      operateType: "",
      rules: {
        nsrsbh: [{ required: true, message: "请选择", trigger: "blur" }],
        gmfNsrsbh: [
          { required: true, message: "请输入", trigger: "blur" },
          regCollection.nsrsbh,
        ],
        type: [{ required: true, message: "请输入", trigger: "blur" }],
        slv: [{ required: true, message: "请输入", trigger: "blur" }],
        // result: [{ required: true, message: "请输入", trigger: "blur" }, regCollection.phone],
        xzjg: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      saveLoading: false,
      slList: []
    };
  },
  mounted() {
    this.getListall();
    // 编辑初始化值
    this.initData();
    this.getSlList();
  },

  methods: {
    async getSlList() {
      try {
        const { data } = await getDicZzsSl()
        this.slList = data
      } catch (error) {

      }
    },
    async initData() {
      const { detailInfo } = this
      if (detailInfo.id) {
        try {
          const res = await getDetailById({ id: detailInfo.id })
          if (res.code === '0') {
            const { data } = res;
            this.form = {
              id: data.id,
              nsrsbh: [data.nsrsbh],
              ysxz: data.ysxz,
              slv: data.slv.split(','),
              type: data.type,
              xzjg: data.xzjg,

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
    async getListall() {
      const { code = "", data = [] } = await getListall({});
      if (code === "0") {
        this.taxBodyList = data;
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

        const api = this.form.id ? updateInvoicekpxz : addInvoicekpxz;
        const { nsrsbh, ...rest } = this.form
        const requestData = {
          ...rest,
          slv: this.form.slv.join(","),
          nsrsbhList: nsrsbh
        };
        // console.log('---this.form--',requestData)
        // return
        const { code = "", data = [], msg = "操作失败" } = await api(requestData);
        if (code === "0") {
          this.$message.success("操作成功");
          this.$emit("onOk");
        } else {
          this.$message.error(msg);
        }
      } catch (error) {
        console.log('--error--', error)
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
.text{
  padding-left: 80px;
  font-size: 12px;
}
</style>
