<template>
  <div class="main-content">
    <form-list :singleSelect="true" :columns="columns" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" ref="list">
      <template #isDigital="{ data }">
        {{ data.isDigital == "Y" ? "是" : "否" }}
      </template>
      <template #isCode="{ data }">
        {{ data.isCode == "Y" ? "已登录" : "未登录" }}
      </template>
      <template #isFace="{ data }">
        {{ data.isFace == "Y" ? "已认证" : "未认证" }}
      </template>
      <template #dzswjsf="{ data }">
        {{ data.dzswjsf ? dzswjsfMap[data.dzswjsf] : '' }}
      </template>
      <template #myscope="{ data }">
        <el-button type="success" @click.stop="handleRpaLogin(data)">验证码登录</el-button>
        <el-button type="success" v-if="data.isCode === 'Y'" @click.stop="getFaceImg(data)">人脸识别</el-button>
      </template>
    </form-list>
    <el-dialog :title="step === 1 ? '短信验证码' : '身份验证'" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <el-form :inline="true" :model="editForm" :rules="rules" ref="ruleForm" class="dialog-form">
        <template v-if="step === 1">
          <div class="dialog-code-title">
            <i class="el-icon-mobile"></i>{{ rpaLoginMsg }}
          </div>
          <el-form-item label="请输入验证码" prop="sms">
            <el-input v-model="editForm.sms" placeholder="请输入" maxlength="100" />
          </el-form-item>
        </template>

        <template v-if="step === 2">
          <div class="dialog-face">
            <div class="dialog-face-title">
              温馨提示：请使用税务APP扫描二维码进行扫脸认证！
            </div>
            <div class="dialog-face-title">
              人脸识别成功后，请手动关闭此页面！
            </div>
            <VueQr :text="rpaLoginFaceImg" alt="" />
          </div>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="step === 1" type="success" @click="saveData">保 存</el-button>
        <!-- <el-button v-if="step === 2" type="success" @click="update">刷 新</el-button> -->
        <el-button @click="handleClose">{{
    step === 1 ? "取消" : "关闭"
          }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import FormList from "@/components/FormList.vue";
import { dzswjsfMap } from '@/config/constant.js';
import { rpaLogin, getFaceImg, refreshLoginState } from "./Api";

export default {
  name: "RpaEnterpriseList",
  components: { FormList, VueQr },
  data() {
    return {
      api: require("./Api"),
      loading: false,
      param: {},
      columns: [
        { title: "企业名称", dataIndex: "nsrmc", width: 220, align: "left" },
        {
          title: "纳税人识别号",
          width: 180,
          dataIndex: "nsrsbh",
          align: "left",
        },
        {
          title: "是否开通数电",
          width: 120,
          dataIndex: "isDigital",
          align: "center",
          slot: "isDigital",
        },
        {
          title: "电子税务局身份",
          width: 120,
          dataIndex: "dzswjsf",
          slot: "dzswjsf",
        },
        {
          title: "操作员姓名",
          width: 120,
          dataIndex: "czyxm",
        },
        {
          title: "电子税务局账号",
          width: 120,
          dataIndex: "dzswjzh",
        },
        {
          title: "验证码登录",
          width: 120,
          dataIndex: "isCode",
          align: "center",
          slot: "isCode",
        },
        {
          title: "是否人脸识别",
          width: 120,
          dataIndex: "isFace",
          align: "center",
          slot: "isFace",
        },
        // { title: "操作员", width: 100, dataIndex: "czyxm", align: "center", slot: 'czyxm' },
        {
          title: "登录日期",
          width: 100,
          dataIndex: "dlrq",
          align: "center",
          slot: "dlrq",
        },
        {
          title: "操作",
          key: "action",
          width: 220,
          scopedSlots: { customRender: "action" },
        },
      ],
      searchList: [
        {
          index: 0,
          key: "name",
          val: "",
          type: "input",
          label: "搜索",
          placeholder: "企业名称/纳税人识别号",
        },
      ],
      dialogVisible: false,
      rules: {
        sms: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      editForm: {},
      rpaLoginMsg: "",
      rpaLoginFaceImg: "",
      step: 1,
      dzswjsfMap,
    };
  },
  methods: {
    // 发送验证码
    async handleRpaLogin(row, type) {
      this.step = 1;
      this.editForm = row;
      const { code = "", data } = await rpaLogin({ nsrsbh: row.nsrsbh });
      if (code === "0") {
        // 有些主体不需要验证验证码，直接走人脸识别
        if (data.msg === "成功") {
          this.getFaceImg();
          return;
        }
        this.rpaLoginMsg = data.msg;
        this.dialogVisible = true;
      }
    },
    // 登录
    async saveData() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        const { code = "", data } = await rpaLogin({
          sms: this.editForm.sms,
          nsrsbh: this.editForm.nsrsbh,
        });
        if (code === "0") {
          this.getFaceImg();
        }
      });
    },
    // 人脸识别，获取二维码
    async getFaceImg(row = null) {
      row && (this.editForm = row); // 直接点击人脸识别，必须赋值给editForm，否则handleClose方法中获取不到nsrsbh
      const { code = "", data } = await getFaceImg({
        nsrsbh: this.editForm.nsrsbh || row.nsrsbh,
      });
      if (code === "0") {
        this.step = 2;
        this.rpaLoginFaceImg = data?.data?.ewm || "";
        this.dialogVisible = true;
      }
    },
    handleClose() {
      if (this.step === 1) {
        this.dialogVisible = false;
        this.editForm = {};
        return;
      }
      this.$confirm(`已确定在税局APP完成人脸认证操作？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            const { code = "" } = await refreshLoginState({
              nsrsbh: this.editForm.nsrsbh,
            });
            if (code === "0") {
              this.$refs.list.reload();
              this.editForm = {};
            }
            this.dialogVisible = false;
            instance.confirmButtonLoading = false;
            done();
          } else {
            if (instance.confirmButtonText !== '执行中...') {
              instance.confirmButtonLoading = false;
              done();
            }
          }
        }
      }).then(async () => {

      }).catch((res => {

      }))
      // this.$confirm(`已确定在税局APP完成人脸认证操作？`, "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // })
      //   .then(async () => {
      //     this.refreshLoginState()
      //   })
      //   .catch(() => {});
    },

    // async refreshLoginState() {
    //   const { code = "" } = await refreshLoginState({
    //     nsrsbh: this.editForm.nsrsbh,
    //   });
    //   if (code === "0") {
    //     this.$refs.list.reload();
    //     this.editForm = {};
    //   }
    //   this.dialogVisible = false;
    // },
  },
  mounted() {
    this.rpaLoginFaceImg =
      "qrcode_id=dHTypfLgR7NcYlzzo3+EcNwxde2izs2gSyh9R2oTm04FAdAvmDp7i7Yobk7zzkNM&areaPrefix=5100&interfaceCode=0004";
  },
  computed: {
    height() {
      return window.innerHeight - 320;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .dialog-form {
  padding: 0px 50px;

  .dialog-code-title {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    font-size: 16px;
    line-height: 28px;
  }

  .el-icon-mobile {
    margin-right: 4px;
    color: #00b390;
  }

  .dialog-face {
    display: flex;
    flex-direction: column;
    align-items: center;

    .dialog-face-title {
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: bold;
    }

    img {
      width: 160px;
      height: 160px;
    }
  }

  .el-form-item {
    width: 80%;

    .el-form-item__label {
      width: 110px;
    }

    .el-form-item__content {
      width: calc(100% - 130px);

      .el-input {
        width: 100%;
      }
    }
  }
}
</style>
