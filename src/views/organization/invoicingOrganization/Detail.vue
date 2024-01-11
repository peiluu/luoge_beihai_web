<template>
  <div>
    <div class="main-content" :style="'min-height: ' + contentHeight + 'px;'">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm">
        <div class="content-title">基本信息</div>
        <div class="content-section">
          <div>
            <el-form-item label="所属主体" prop="taxBodyId">
              <el-select v-model="form.taxBodyId" placeholder="请选择" filterable clearable @change="getTaxBodyId">
                <el-option v-for="item in taxBodyList" :label="item.nsrmc" :value="item.id" :key="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.isDigital == 'N'" prop="isVatcheck" label="是否进行抵扣业务">
              <el-switch class="switch" v-model="form.isVatcheck" active-text="是" inactive-text="否" active-value="Y" inactive-value="N" />
            </el-form-item>
          </div>

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

        <!-- 业务信息 -->
        <div class="content-title">业务信息</div>
        <div class="content-section">
          <el-form :inline="true" :model="billingStationAddDto" :rules="rules" ref="ruleForm">
            <div class="left-title">开票信息</div>
            <el-form-item label="地址" prop="address">
              <el-input v-model="billingStationAddDto.address" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="电话" prop="invoicePhone">
              <el-input v-model="billingStationAddDto.invoicePhone" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="开户行名称" prop="bank">
              <el-input v-model="billingStationAddDto.bank" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="开户行账号" prop="bankAccount">
              <el-input v-model="billingStationAddDto.bankAccount" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="所属账套名称" prop="ssztName">
              <el-input v-model="billingStationAddDto.ssztName" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="所属账套编码" prop="ssztCode">
              <el-input v-model="billingStationAddDto.ssztCode" placeholder="请输入" />
            </el-form-item>
            <div class="left-title">人员信息</div>

            <el-form-item label="开票人" prop="kpr">
              <!-- <el-select v-model="form.skr" placeholder="请选择">
                <el-option v-for="(item, index) in selectKprList" :key="index" :label="item.kpr" :value="item.kpr">
                </el-option>
              </el-select> -->
              <el-input v-model="billingStationAddDto.kpr" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="复核人" prop="fhr">
              <el-input v-model="billingStationAddDto.fhr" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="收款人" prop="skr">
              <el-input v-model="billingStationAddDto.skr" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="税盘编号" prop="taxTrayNum">
              <el-input v-model="billingStationAddDto.taxTrayNum" placeholder="请输入" />
            </el-form-item>

            <!-- 开票税控-->
            <template v-if="form.isDigital == 'N'">
              <TaxControlEquipment :taxMechs="this.billingStationAddDto.taxMechs" @handleCancel="handleCancel" @saveTaxMechs="saveTaxMechs" :nsrsbh="this.form.nsrsbh" :taxBodyId="this.form.taxBodyId" :isKp="true"
                :isAdd="isAddKp" />
              <div class="section-footer" v-if="!isAddKp">
                <el-button @click="addEquipment('isAddKp')">添加税控设备</el-button>
              </div>
            </template>
          </el-form>
        </div>
      </el-form>
    </div>
    <div class="fixed-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="success" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
import { regCollection } from '@/config/constant.js';
import TaxControlEquipment from './TaxControlEquipment.vue';
import { getListAll, updateOrg, selectKpr, saveOrg, loadOrgDetail } from "./Api";

/**
 * @description  发票确认单 - 可编辑
 */
export default {
  name: "InvoicingOrganizationDetail",
  components: { TaxControlEquipment },
  data() {
    return {
      tableData: [],
      form: {},
      // 开票点信息
      billingStationAddDto: {},
      taxBodyList: [],
      selectKprList: [],
      isAddKp: false,
      bmb_bbhList: [],
      rules: {
        taxBodyId: [{ required: true, message: "请选择", trigger: "blur" }],
        code: [{ required: true, message: "请输入", trigger: "blur" }],
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        // phone: [regCollection.phone],
        invoicePhone: [{ required: true, message: "请输入", trigger: "blur" }, regCollection.phone],
        enable: [{ required: true, message: "请选择", trigger: "blur" }],
        address: [{ required: true, message: "请输入", trigger: "blur" }],
        bank: [{ required: true, message: "请输入", trigger: "blur" }],
        bankAccount: [{ required: true, message: "请输入", trigger: "blur" }],
        ssztName: [{ required: true, message: "请输入", trigger: "blur" }],
        ssztCode: [{ required: true, message: "请输入", trigger: "blur" }],
      },

    }
  },
  computed: {
    contentHeight() {
      return window.innerHeight - 160;
    },
  },
  activated() {
    if (sessionStorage.getItem('clearInvoicingOrganization') == 1) {
      this.form = {}
      this.isAddKp = false;
      this.billingStationAddDto = {}
      sessionStorage.setItem('clearInvoicingOrganization', 0)
    }
    this.getListAll();
    const { operateType = '', id = '' } = this.$route.query;
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
    // 查询开票人
    async selectKpr() {
      const { code = '', data = [] } = await selectKpr({})
      if (code === '0') {
        this.selectKprList = data.kprList || []
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
        this.billingStationAddDto = {
          ...data.billingStationAddDto,
          invoicePhone: data.billingStationAddDto.phone
        }
      }
    },

    /**
     * @description 【组织管理】新增组织基本信息
     */
    async submit() {
      this.$refs["ruleForm"].validate(async valid => {
        if (!valid) return;
        const api = this.form.id ? updateOrg : saveOrg
        const { code = '', data = [] } = await api({
          ...this.form,
          billingStationAddDto: {
            ...this.billingStationAddDto,
            phone: this.billingStationAddDto.invoicePhone,
          },
          isInvoice: 'Y',
        })
        if (code === '0') {
          this.$message.success('操作成功');
          setTimeout(() => {
            this.cancel();
          }, 1000)
        }
      })
    },
    getTaxBodyId() {
      const obj = this.taxBodyList.find((item) => item.id == this.form.taxBodyId) || {}
      this.form.nsrsbh = obj.nsrsbh
      this.form.isDigital = obj.isDigital
    },

    cancel() {
      this.form = {}
      this.isAddKp = false;
      this.billingStationAddDto = {}
      this.$router.push({
        path: '/settingsManagement/organization',
        query: { activeName: '2' }
      })
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);

    },

    saveTaxMechs(data) {
      this.billingStationAddDto.taxMechs = data
    },
    addEquipment(propsKey) {
      // 最多只能添加四条数据
      if (this?.billingStationAddDto?.taxMechs?.length >= 4) {
        this.$message.warning('发票种类已添加完整');
        return;
      }
      this[propsKey] = true
    },
    handleCancel(propsKey) {
      this[propsKey] = false
    },
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/variables.scss';
.main-content {
  padding: 0 32px 16px;
  margin-bottom: 32px;
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

.section-rz {
  margin-top: 12px;
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

  .section-footer {
    padding: 12px 64px 0;
    display: flex;
    justify-content: flex-end;
  }

  .border {
    padding-bottom: 12px;
    border-bottom: 2px dotted #e8ebed;

  }

  &:last-of-type {
    margin-top: 12px;
  }
}
</style>

