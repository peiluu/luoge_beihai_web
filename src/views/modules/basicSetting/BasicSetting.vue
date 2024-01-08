<template>
  <div class="com-basic-setting" v-loading="loading">
    <div class="container-title">基本设置</div>

    <div class="container-form">
      <el-form :inline="true" ref="form" :model="formData">
        <el-form-item label="自动申报" prop="zdsb">
          <el-switch v-model="formData.zdsb" :disabled="!isEdit"></el-switch>
        </el-form-item>
        <el-form-item label="申报日期" prop="sbrq" :rules="[
        	{
        		required: formData.zdsb,
        		message: '请选择申报日期',
        		trigger: 'blur',
        	},
        ]">
          <el-select v-model="formData.sbrq" placeholder="请选择" :disabled="!isEdit">
            <el-option v-for="(item, index) in dateSelectList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="自动缴税" prop="zdjk">
          <el-switch v-model="formData.zdjk" :disabled="!isEdit"></el-switch>
        </el-form-item>
        <el-form-item label="缴税日期" prop="jkrq" :rules="[
        	{
        		required: formData.zdjk,
        		message: '请选择缴纳日期',
        		trigger: 'blur',
        	},
        ]">
          <el-select v-model="formData.jkrq" placeholder="请选择" :disabled="!isEdit">
            <el-option v-for="(item, index) in dateSelectList" :key="index" :label="item.label" :value="item.value" :disabled="parseInt(item.value) < parseInt(formData.sbrq)"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div class="container-info">
        <div class="tit">
          三方账号
          <img src="@/assets/edit.png" v-if="isEdit" @click="dialogVisible = true" alt />
        </div>
        <div class="info-main">
          <div>三方协议号：{{ basicBankInfo.sfxyh }}</div>
          <div>开户行：{{ basicBankInfo.yhhbmc }}</div>
          <div>开户行账号：{{ basicBankInfo.jkzh }}</div>
        </div>
      </div>

      <div class="btn-box" v-if="isEdit">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
      <el-button type="primary" @click="isEdit = true" v-else>编辑信息</el-button>
    </div>

    <el-dialog title="维护第三方信息" :visible.sync="dialogVisible" width="30%">
      <div class="dialog-head">
        <div>请选择缴款账号</div>
        <div>
          <el-button @click="queryAgreement" :disabled="!canSynchronization">{{
          canSynchronization ? '同步三方账户' : synchronizationTime + 's'
          }}</el-button>
          <el-button @click="getByTaxpayer('refresh')" :disabled="!canRefresh">{{
          canRefresh ? '刷新' : refreshTime + 's'
          }}</el-button>
        </div>
      </div>

      <div class="dialog-main">
        <el-radio v-model="cardInfo.sfxyh" :label="item.sfxyh" :key="item.sfxyh" v-for="item in bankCardList" @change="onChange">
          <div>
            <div>{{ item.yhhbmc }}</div>
            <div class="txt">开户行账号{{ item.jkzh }}</div>
            <div class="txt">三方协议号：{{ item.sfxyh }}</div>
          </div>
        </el-radio>
      </div>

      <div slot="footer">
        <el-button @click="hideModal">取 消</el-button>
        <el-button type="primary" @click="updateDefaultAgreement">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import {
  editBasicSetting,
  getBankInfo,
  getByTaxpayer,
  queryAgreement,
  updateDefaultAgreement,
} from './basicSettingApi';

import { getTaxpayer } from '../systemHome/systemHomeApi';
export default {
  name: 'basicSetting',
  props: {
    detail: {
      type: Object,
      defalut: () => { },
    },
  },
  data() {
    return {
      loading: false,
      api: require('./basicSettingApi'),
      formData: {},
      isEdit: false,
      dialogVisible: false,
      // 三方卡列表
      bankCardList: [],
      // 纳税人识别号
      nsrsbm: '',
      // 三方卡信息
      cardInfo: {},
      basicBankInfo: {},
      canSynchronization: true,
      canRefresh: true,
      synchronizationTime: 60,
      refreshTime: 60,
    };
  },
  mounted() {
    this.getTaxpayer();
  },
  computed: {
    dateSelectList() {
      const arr = [];
      for (let i = 1; i <= 31; i++) {
        arr.push({
          label: `每月${i}号`,
          value: i < 10 ? '0' + i : i,
        });
      }
      return arr;
    },
  },

  watch: {
    detail(val) {
      this.formData = { ...val };
    },
    nsrsbm() {
      this.getBankInfo();
      this.getByTaxpayer();
    },
    cardInfo(val) { },
  },

  methods: {
    // 取消编辑
    cancel() {
      this.isEdit = false;
      this.formData = { ...this.detail };
    },

    hideModal() {
      this.dialogVisible = false;
      thi.cardInfo = { ...this.basicBankInfo };
    },

    onChange(no) {
      const obj = this.bankCardList.find(item => item.sfxyh === no) || {};
      this.cardInfo = { ...this.cardInfo, ...obj };
    },

    /**
     * @desption - 新增、修改基础设置。
     */
    async submitForm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const param = {
            ...this.detail,
            ...this.formData,
            zdsb: this.formData.zdsb ? '1' : '0',
            zdjk: this.formData.zdjk ? '1' : '0',
          };

          if (parseInt(this.formData.sbrq) > parseInt(this.formData.jkrq)) {
            this.$message.error('缴款日期不能早于申报日期');
            return false;
          }

          const {
            data: { code, data = {} },
          } = await editBasicSetting(param);

          this.loading = false;
          if (code == 0) {
            this.$message.success('修改成功');
            this.isEdit = false;
            return;
          }
          this.$message.error(res.data.msg);
        }
      });
    },

    /**
     * @desption - 基本设置 - 获取三方账户信息
     */

    async getBankInfo() {
      const {
        data: { code, data = {} },
      } = await getBankInfo({ nsrsbm: this.nsrsbm });
      if (code == 0) {
        this.basicBankInfo = { ...(data[0] || {}) };
        this.cardInfo = { ...(data[0] || {}) };
      }
    },

    /**
     * @desption - 基本设置 - 获取三方信息列表
     */
    async getByTaxpayer(flag = '') {
      this.loading = true;
      const {
        data: { code, data = {} },
      } = await getByTaxpayer({ nsrsbm: this.nsrsbm });
      if (code == 0) {
        this.loading = false;
        this.bankCardList = data;
        if (flag === 'refresh') {
          this.$message.success('刷新成功');
          this.canRefresh = false;
          this.countDown('refreshTime', 'canRefresh');
        }
      }
    },
    /**
     * @desption - 基本设置 - 同步第三方账户
     */
    async queryAgreement() {
      this.loading = true;
      const {
        data: { code, data = {} },
      } = await queryAgreement({ nsrsbm: this.nsrsbm });
      if (code == 0) {
        this.loading = false;
        this.$message.success('同步成功');
        this.canSynchronization = false;
        this.countDown('synchronizationTime', 'canSynchronization');
      }
    },

    /**
     * @desption - 基本设置 - 修改默认三方
     */
    async updateDefaultAgreement() {
      const {
        data: { code, data = {} },
      } = await updateDefaultAgreement({
        nsrsbm: this.nsrsbm,
        id: this.cardInfo.sfxyh,
      });
      if (code == 0) {
        this.$message.success('修改成功');
        this.dialogVisible = false;
        this.basicBankInfo = { ...this.cardInfo };
      }
    },

    /**
     * @desption - 系统首页 - 获取首页企业信息 - 纳税人识别号
     */
    async getTaxpayer() {
      const {
        data: { code, data = {} },
      } = await getTaxpayer();
      if (code != 0) return;
      this.nsrsbm = data.nsrsbm;
    },
    // 倒计时函数
    countDown(timeFlag, flag) {
      const timer = setInterval(() => {
        this[timeFlag]--;
        if (this[timeFlag] == 0) {

          this[flag] = true;
          this[timeFlag] = 60;
          clearInterval(timer);
        }
      }, 1000);
    },
  },
};
</script>

<style scoped lang="scss">
.com-basic-setting {
  padding: 12px 24px;

  .container-title {
    font-size: 18px;
    font-weight: bold;
  }

  .el-form-item {
    width: calc(50% - 8px);
    margin: 24px 0 0;
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
