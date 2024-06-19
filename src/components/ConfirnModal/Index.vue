<template>
  <!-- 驳回原因 -->
  <el-dialog title="提示" :visible.sync="dialogVisible" width="40%" :before-close="handleClose" class="com-confirm-dialog">
    <div class="dialog-content">
      <div>是否确认{{ qrlx == 'Y' ? '通过' : qrlx == 'N' ? '驳回' : '撤销' }}？</div>
      <el-form v-if="qrlx == 'N'" :inline="true" :model="form" ref="ruleForm" :rules="rules">
        <el-form-item label="请输入驳回原因" prop="bhyy">
          <el-input type="textarea" :rows="2" placeholder="请输入驳回原因" maxlength="100" v-model="bhyy" />
          <!-- <el-input v-model="bhyy" placeholder="请输入" /> -->
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关 闭</el-button>
      <el-button type="success" @click="submit">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { confirmation } from './Api';
export default {
  name: 'ProductProfileModal',
  props: {
    lrfsf: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      form: {},
      qrlx: '', // 确认类型
      bhyy: '', // 驳回原因
      singleCancelData: {}, // 单个撤销的数据
      // 审核信息
      rules: {
        bhyy: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      selections: [],
      dialogVisible: false
    }
  },

  computed: {},

  methods: {
    // 修改确认单状态
    confirm(qrlx, singleCancelData, selections) {
      this.qrlx = qrlx;
      this.singleCancelData = singleCancelData;
      this.selections = selections
      if (selections == 0 && !singleCancelData) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      const noOrgId = this.selections.some((item) => !item.orgid) || this.singleCancelData && !this.singleCancelData.orgid
      // 撤销 不需要提示开票点不存在的情况
      if (qrlx === 'C') {
        this.showMessage();
        return;
      }
      if (!noOrgId) {
        this.showDialog();
        return
      }
      // 勾选的数据中存在开票点不存在的情况
      this.$confirm('您确定处理所选红字发票确认单', '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showDialog();
      }).catch(() => { })

    },
    showMessage() {
      this.$confirm(`是否确定${this.qrlx === 'Y' ? '通过' : '撤销'} `, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submit();
      }).catch(() => { })
    },

    // 显示弹窗
    showDialog() {
      // 同意
      if (this.qrlx === "Y") {
        this.showMessage();
        return
      }
      // 拒绝
      this.dialogVisible = true
    },

    async submit() {
      if (!this.bhyy && this.qrlx === 'N') {
        this.$message.warning('请输入驳回原因')
        return;
      }

      // 判断是单个撤销还是批量撤销
      const { id = '', shzt = '', uuid = '', hzfpxxqrdbh = '', hzqrxxztDm = '', xsfnsrsbh = '',gmfnsrsbh='' } = this.singleCancelData || {}
      const confirmList = this.singleCancelData ? [{
        bhyy: this.bhyy,
        shzt,
        redid: id,
        hzfpxxqrdbh,
        uuid,
        hzqrxxztDm,
        xsfnsrsbh,
        gmfnsrsbh,
      }] : this.selections.map((item) => {

        return {
          bhyy: this.bhyy,
          redid: item.id,
          shzt: item.shzt,
          hzfpxxqrdbh: item.hzfpxxqrdbh,
          uuid: item.uuid,
          hzqrxxztDm: item.hzqrxxztDm,
          xsfnsrsbh: item.xsfnsrsbh,
          gmfnsrsbh: item.gmfnsrsbh,
        }
      });
      this.dialogVisible = false;
      const { code = '' } = await confirmation({
        qrlx: this.qrlx,
        // 当前购销方身份
        lrfsf: this.lrfsf,
        confirmList
      })

      if (code === '0') {
        this.$message.success('操作成功');
        this.$emit('handleOk')
      }
    },

    handleClose() {
      this.bhyy = ''
      this.qrlx = ''
      this.dialogVisible = false;
    }
  }

};
</script>

<style lang="scss">
.com-confirm-dialog {
  .el-dialog__body {
    padding: 0;
  }

  .dialog-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 17px;

    .el-form {
      width: 70%;
      margin-top: 12px;
    }

    .el-form-item {
      width: 100%;
    }

    .el-form-item__label {
      font-size: 14px;
      width: calc(130px)
    }

    .el-form-item__content {
      width: calc(100% - 140px)
    }
  }
}
</style>
