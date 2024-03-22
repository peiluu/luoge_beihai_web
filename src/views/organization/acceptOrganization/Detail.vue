<template>
  <div>
    <div>
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm">
        <div class="content-title">基本信息</div>
        <div class="content-section">
          <!-- <div> -->
            <el-form-item label="所属主体" prop="taxBodyId">
              <el-select v-model="form.taxBodyId" placeholder="请选择" filterable clearable :disabled="$route.query.nsrsbh">
                <el-option v-for="item in taxBodyList" :label="item.nsrmc" :value="item.id" :key="item.id" />
              </el-select>
            </el-form-item>
          <!-- </div> -->
          <el-form-item label="组织编码" prop="code">
            <el-input v-model="form.code" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="form.contact" placeholder="请输入" />
          </el-form-item>

          <el-form-item label="是否启用" prop="enable">
            <el-select v-model="form.enable" placeholder="请选择">
              <el-option label="是" value="Y" />
              <el-option label="否" value="N" />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="success" @click="submit" :loading="saveLoading">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getListAll, updateReceiveOrg, saveReceiveOrg, loadOrgDetail, bmb_bbh } from "./Api";

/**
 * @description  发票确认单 - 可编辑
 */
export default {
  name: "acceptOrganizationDetail",
  props: {
    detailInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      tableData: [],
      form: {
        billingStationAddDto: {
          taxMechs: []
        },
        kp: ''
      },
      // 开票点信息
      billingStationAddDto: {},
      rules: {
        taxBodyId: [{ required: true, message: "请选择", trigger: "blur" }],
        code: [{ required: true, message: "请输入", trigger: "blur" }],
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        // phone: [regCollection.phone],
        enable: [{ required: true, message: "请选择", trigger: "blur" }],


      },
      taxBodyList: [],
      selectKprList: [],
      saveLoading: false,
    }
  },
  computed: {
    contentHeight() {
      return window.innerHeight - 160;

    },
  },
  mounted() {
    if (sessionStorage.getItem('clearAcceptOrganization') == 1) {
      this.form = {};
      sessionStorage.setItem('clearAcceptOrganization', 0)
    }
    this.getListAll();
    const { operateType = '', id = '' } = this.detailInfo;
    this.operateType = operateType;
    if (id) {
      this.loadOrgDetail(id);
    }
  },

  methods: {
    // 获取纳税主体
    async getListAll() {
      const { code = '', data = [] } = await getListAll({})
      if (code === '0') {
        this.taxBodyList = data;
      }
    },

    // 【组织管理】获取详情
    async loadOrgDetail(id) {
      const { code = '', data = {} } = await loadOrgDetail({ id })
      if (code === '0') {
        this.form = {
          ...data,
          taxBodyId: data.taxBodyId.toString(),
        }
      }
    },

    /**
     * @description 【组织管理】新增受票组织基本信息
     */
    async submit() {
      this.$refs["ruleForm"].validate(async valid => {
        if (!valid) return;
        try {
          this.saveLoading = true;
          const api = this.form.id ? updateReceiveOrg : saveReceiveOrg
          const { code = '', data = [], msg = '操作失败' } = await api(this.form)
          if (code === '0') {
            this.$message.success('操作成功');
            this.$emit('onOk')
          } else {
            this.$message.error(msg)
          }
        } catch (error) {
          this.$message.error(error.msg || '操作失败')
        } finally {
          this.saveLoading = false;
        }
        
      })
    },

    cancel() {
      this.form = {}
      this.$emit('onClose')
      // this.$router.push({
      //   path: '/organization/index',
      //   query: { activeName: '3' }
      // })
      // this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
    },

  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/variables.scss';
.main-content {
  padding: 0 32px 12px;
}

::v-deep .el-form-item {
  width: calc(50% - 10px);
  margin-bottom: 16px;

  .el-form-item__label {
    width: 180px;
  }

  .el-form-item__content {
    width: calc(100% - 280px);

    .el-select,
    .el-date-editor,
    .el-input {
      width: 100%;
    }
  }

  .el-checkbox__input.is-checked .el-checkbox__inner {
    background: $primaryGreenColor;
    border-color: $primaryGreenColor;
  }

  .el-checkbox__input :hover {
    border-color: $primaryGreenColor;
  }

  .el-radio__input.is-checked .el-radio__inner {
    background: $primaryGreenColor;

  }

  .el-checkbox__input.is-checked+.el-checkbox__label,
  .el-radio__input.is-checked+.el-radio__label {
    color: #606266
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

.content-section {
  .left-title {
    width: 168px;
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: bold;
    color: #909399;
    text-align: right;
  }

  .border {
    padding-bottom: 12px;
    border-bottom: 2px dotted #e8ebed;

  }

  &:last-of-type {
    margin-top: 12px;
  }
}
.footer {
  text-align: center;
}
</style>

