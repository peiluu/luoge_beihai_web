<template>
  <div>
    <div class="main-content">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" :disabled="operateType === 'detail'">
        <div class="content-title">基本信息</div>
        <!-- <el-form-item class="form-header-left"> -->
          <!-- <el-checkbox v-model="form.isInstitution" style="margin-left: 180px;">机关、事业单位</el-checkbox> -->
          <!-- <div class="right-item">
            是否开通数电业务 <el-switch class="switch" v-model="form.isDigital" active-text="启用" inactive-text="停用" active-value="Y" inactive-value="N" />
          </div> -->
        <!-- </el-form-item> -->

        <!-- <el-form-item label="供应链协同" prop="isSupplychain">
          <el-switch class="switch" v-model="form.isSupplychain" active-text="启用" inactive-text="停用" active-value="Y" inactive-value="N" />
        </el-form-item> -->
        <el-form-item label="纳税人识别号" prop="nsrsbh">
          <el-input v-model="form.nsrsbh" placeholder="请输入" maxlength="20" />
        </el-form-item>
        <el-form-item label="纳税人名称" prop="nsrmc">
          <el-input v-model="form.nsrmc" placeholder="请输入" maxlength="100" />
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入" maxlength="80" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入" maxlength="13" />
        </el-form-item>
        <!-- <template v-if="form.isDigital === 'Y'"> -->
        <template>
          <el-form-item label="乐企ID" prop="lqid">
            <el-input v-model="form.lqid" placeholder="请输入" maxlength="30" />
          </el-form-item>
          <el-form-item label="乐企秘钥" prop="secretkey">
            <el-input v-model="form.secretkey" placeholder="请输入" maxlength="100" />
          </el-form-item>
        </template>

        <el-form-item label="开户行名称" prop="bank">
          <el-input v-model="form.bank" placeholder="请输入" maxlength="60" />
        </el-form-item>
        <el-form-item label="开户行账号" prop="bankAccount">
          <el-input v-model="form.bankAccount" placeholder="请输入" maxlength="90" />
        </el-form-item>

        <el-form-item label="所属业态" prop="businessFormat">
          <el-select v-model="form.businessFormat" placeholder="请选择" filterable>
            <el-option v-for="(item, index) in ytList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域" prop="region">
          <el-select v-model="form.region" placeholder="请选择" filterable>
            <el-option v-for="(item, index) in qyList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="所属省市区" prop="areaList">
          <el-cascader clearable v-model="form.areaList" :options="districts" :props="{ value: 'txt', label: 'txt' }" separator="" filterable />
        </el-form-item> -->
        <el-form-item label="所属省份" prop="province">
          <el-select v-model="form.province" placeholder="请选择" filterable clearable>
            <el-option v-for="(item, index) in provincesEnmu" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属城市" prop="city">
          <el-select v-model="form.city" placeholder="请选择" filterable clearable>
            <el-option v-for="(item, index) in cityEnum" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="所属市区" prop="area">
          <el-select v-model="form.area" placeholder="请选择" filterable clearable>
            <el-option v-for="(item, index) in areaEnum" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="曾用税号" prop="oldNsrsbh">
          <el-input v-model="form.oldNsrsbh" placeholder="请输入" maxlength="20" />
        </el-form-item>
        <el-form-item label="曾用地址" prop="oldAddress">
          <el-input v-model="form.oldAddress" placeholder="请输入" maxlength="2800" />
        </el-form-item>
        <el-form-item label="曾用电话号码" prop="oldPhone">
          <el-input v-model="form.oldPhone" placeholder="请输入" maxlength="13" />
        </el-form-item>
        <el-form-item label="曾用名称" prop="oldNsrmc">
          <el-input v-model="form.oldNsrmc" placeholder="请输入" maxlength="100" />
        </el-form-item>

        <el-form-item label="曾用开户行账号" prop="oldBankAccount">
          <el-input v-model="form.oldBankAccount" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="曾用开户行名称" prop="oldBank">
          <el-input v-model="form.oldBank" placeholder="请输入" maxlength="90" />
        </el-form-item>

        <el-form-item label="主管税务局" prop="taxArea">
          <el-select v-model="form.taxArea" placeholder="请选择" filterable clearable>
            <el-option v-for="(item, index) in taxAreaList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <div>
          <el-form-item label="是否为总/分公司" prop="sfzfjg">
            <el-radio v-model="form.sfzfjg" label="N">一般企业</el-radio>
            <el-radio v-model="form.sfzfjg" label="Y">总分机构关系</el-radio>
          </el-form-item>
        </div>
        <div v-if="form.sfzfjg === 'Y'">
          <el-form-item label=" " prop="sffgs">
            <el-radio v-model="form.sffgs" label="N">总公司</el-radio>
            <el-radio v-model="form.sffgs" label="Y">分公司</el-radio>
          </el-form-item>
          <el-form-item v-if="form.sffgs === 'Y'" label="总公司" prop="zgsId">
            <el-select v-model="form.zgsId" placeholder="请选择总公司" filterable clearable>
              <el-option v-for="item in zgsList" :key="item.id" :label="item.nsrmc" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item class="flex-item" v-if="form.sfzfjg === 'Y' && form.sffgs === 'N'" label="总机构的独立生产经营部门" prop="sfdlscjy">
          <el-radio v-model="form.sfdlscjy" label="N">无独立生产经营部门</el-radio>
          <el-radio v-model="form.sfdlscjy" label="Y">有独立生产经营部门</el-radio>
          <template v-if="form.sfdlscjy == 'Y'">
            <el-button @click="addFunction">+</el-button>
            <span class="info-tip">存在{{ dlscjybmList.length || 0 }}个部门</span>
          </template>
        </el-form-item> -->

        <!-- <div class="company-info"> -->
          <!-- <el-form-item label="公司名称" prop="companyName" class="input-name"> -->
            <!-- <el-input v-model="form.companyName" placeholder="请输入" maxlength="100" /> -->
            <!-- <el-upload class="upload" action="https://jsonplaceholder.typicode.com/posts/">
              <i class="el-icon-plus" v-if="!form.name" />
              <img src="" v-else />
            </el-upload> -->
            <!-- <div v-if="form.name" class="el-upload__tip" @click="handleRemove">清空</div> -->
          <!-- </el-form-item> -->

          <el-form-item label="开立时间" prop="openDate">
            <el-date-picker v-model="form.openDate" value-format="yyyy-MM-dd" :picker-options="{
              disabledDate(time) { return time.getTime() > Date.now(); }
            }" placeholder="请选择" />
          </el-form-item>

        <!-- </div> -->
        <!-- <el-form-item label="合并报表系统编码" prop="hbbbxtbm">
          <el-input v-model="form.hbbbxtbm" placeholder="请输入" maxlength="90" />
        </el-form-item> -->
        <el-form-item label="是否注销" prop="isWithdrawal">
          <el-select v-model="form.isWithdrawal" placeholder="请选择">
            <el-option label="是" value="Y" />
            <el-option label="否" value="N" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="涉税业务终止月份" prop="withdrawalDate" v-if="form.isWithdrawal == 'Y'">
          <el-date-picker type="month" v-model="form.withdrawalDate" value-format="yyyy-MM" placeholder="请选择" />
        </el-form-item>
        <el-form-item label="是否全功能上线" prop="fullFunctionOnline">
          <el-select v-model="form.fullFunctionOnline" placeholder="请选择">
            <el-option label="是" value="Y" />
            <el-option label="否" value="N" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否纳入税金统计范围" prop="nrsjtjfw">
          <el-select v-model="form.nrsjtjfw" placeholder="请选择">
            <el-option label="是" value="Y" />
            <el-option label="否" value="N" />
          </el-select>
        </el-form-item> -->

      </el-form>
      <!-- 扩展信息 -->
      <ExtendInfo :nsrsbh="form.nsrsbh" v-if="form.isDigital === 'Y' && operateType == 'detail'" />
    </div>

    <div class="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="success" @click="submit" v-if="operateType !== 'detail'" :loading="saveLoading">保存</el-button>
    </div>

    <el-dialog title="编辑独立生产经营部门" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <div class="table-tools"><el-button @click="handleAddFun">新增</el-button></div>

      <div class="custom-table">
        <el-table stripe ref="table" :data="dlscjybmList" border :height="height" tooltip-effect="dark" :cell-style="{ textAlign: 'center' }" :header-cell-style="{
          fontWeight: 400,
          borderTop: '1px solid #adb4bc',
          background: '#f7f9fd',
          color: '#333333',
          textAlign: 'center'
        }">
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column label="经营部门名称" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.dlscjymc" placeholder="请输入" maxlength="100" />
            </template>
          </el-table-column>
          <el-table-column label="关联账套" align="center">
            <template slot-scope="scope">
              <el-select v-model="scope.row.id" placeholder="请选择" filterable clearable @change="(e) => handleSelect(e, scope.$index)">
                <el-option v-for="item in allZtList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="handleDeletedLscjybmList(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="success" @click="saveDlscjybmList">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { regCollection } from '@/config/constant.js';
import { rgionEnum, cityEnum, provincesEnmu, areaEnum } from '@/config/regionEnums.js';
import ExtendInfo from './ExtendInfo'
import { listCascaderDict, getDetailById, getAllZt, selectYtList, selectQyList, addTaxBody, getZgsList, getTaxArea, updateTaxBody } from "./Api";
export default {
  name: "organizationTaxBodyDetail",
  components: { ExtendInfo },
  props: {
    detailInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: { isDigital: 'Y' },
      districts: [],
      operateType: '',
      ytList: [],
      qyList: [],
      zgsList: [],
      taxAreaList: [],
      dialogVisible: false,
      allZtList: [],
      dlscjybmList: [],
      rgionEnum, // 所属区域
      cityEnum, // 所属城市
      provincesEnmu, // 所属省份
      areaEnum, // 所属市区
      rules: {
        nsrsbh: [{ required: true, message: "请输入", trigger: "blur" }, regCollection.nsrsbh],
        oldNsrsbh: [regCollection.nsrsbh],
        nsrmc: [{ required: true, message: "请输入", trigger: "blur" }],
        address: [{ required: true, message: "请输入", trigger: "blur" }],
        phone: [{ required: true, message: "请输入", trigger: "blur" }, regCollection.phone],
        oldPhone: [regCollection.phone],
        lqid: [{ required: true, message: "请输入", trigger: "blur" }],
        secretkey: [{ required: true, message: "请输入", trigger: "blur" }],
        bank: [{ required: true, message: "请输入", trigger: "blur" }],
        bankAccount: [{ required: true, message: "请输入", trigger: "blur" }],
        sffgs: [{ required: true, message: "请选择", trigger: "blur" }],
        sfdlscjy: [{ required: true, message: "请选择", trigger: "blur" }],
        sfzfjg: [{ required: true, message: "请选择", trigger: "blur" }],
        zgsId: [{ required: true, message: "请选择", trigger: "blur" }],
        areaList: [{ required: true, message: "请选择", trigger: "blur" }],
        withdrawalDate: [{ required: true, message: "请选择", trigger: "blur" }],
      },
      saveLoading: false
    };
  },

  computed: {
    contentHeight() {
      return window.innerHeight - 120
    },
    height() {
      return window.innerHeight - 600
    }
  },
  watch: {
    'form.businessFormat'(newVal) {
      if (newVal) {
        this.selectQyList();
      }
    },
  },

  mounted() {
    if (sessionStorage.getItem('clearTaxBody') == 1) {
      this.form = { isDigital: 'N' }
      sessionStorage.setItem('clearTaxBody', 0)
    }
    this.listCascaderDict();
    this.getTaxArea();
    this.selectYtList();
    this.selectQyList();
    this.getZgsList();
    const { operateType = '', id = '' } = this.detailInfo;
    console.log('----id----', id)
    this.operateType = operateType;
    if (id) {
      this.getDetailById(id);
      this.getAllZt(id)
    }
    
  },

  methods: {
    // 获取省级税务局
    async getTaxArea() {
      const { code = '', data = [] } = await getTaxArea()
      if (code === '0') {
        this.taxAreaList = data
      }
    },
    // 获取省市区
    async listCascaderDict() {
      const { code = '', data = [] } = await listCascaderDict()
      if (code === '0') {
        this.districts = data
      }
    },
    /**
     * @desption 【组织管理】获取业态选择下拉
     */
    async selectYtList() {
      const { code = '', data = [] } = await selectYtList()
      if (code === '0') {
        this.ytList = data
      }
    },
    /**
     * @desption 【组织管理】获取区域选择下拉
     */
    async selectQyList() {
      const { code = '', data = [] } = await selectQyList({ yt: this.form.businessFormat || '' })
      if (code === '0') {
        this.qyList = data
        console.log(data)
      }
    },
    /**
     * @desption 【组织管理】根据id获取纳税主体详情
     */
    async getDetailById(id) {
      const { code = '', data = {} } = await getDetailById({ id })
      if (code === '0') {
        this.form = {
          ...data,
          isInstitution: data.isInstitution == 'Y' ? true : false,
        }
        this.dlscjybmList = data.dlscjybmList || []

      }
    },
    /**
     * @desption 【组织管理】获取所有总公司
     */
    async getZgsList() {
      const { code = '', data = [] } = await getZgsList({})
      if (code === '0') {
        this.zgsList = data
      }
    },
    /**
     * @desption 【组织管理】获取所有账套
   */
    async getAllZt(id) {
      const { code = '', data = [] } = await getAllZt({ id })
      if (code === '0') {
        this.allZtList = data
      }
    },
    /**
     * @description 提交表单，验证数据格式
     */
    async submit() {
      this.$refs["ruleForm"].validate(async valid => {
        if (!valid) return;
        const param = {
          ...this.form,
          dlscjybmList: this.dlscjybmList,
          isInstitution: this.form.isInstitution == true ? 'Y' : 'N',
        }
   
        this.saveTaxBody(param);
      })
    },

    /**
     * @desption 【组织管理】保存纳税主体
    */
    async saveTaxBody(param) {
      try {
        this.saveLoading = true
        const api = param.id ? updateTaxBody : addTaxBody
        const { code = '', data = [], msg = '操作失败' } = await api(param)
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
      
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    cancel() {
      this.$emit('onClose')
      // this.$router.push({
      //   path: '/organization/index',
      //   query: { activeName: '1' }
      // })
      // this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
    },
    // 增加独立生产经营部门
    addFunction() {
      this.dialogVisible = true
      this.dlscjybmList = [...this.form.dlscjybmList]
    },
    handleSelect(value, index) {
      this.dlscjybmList[index].dlscjymc = this.allZtList.find((item) => item.id === value).name
    },

    handleClose() {
      this.dialogVisible = false;
      this.dlscjybmList = [...this.form.dlscjybmList]
    },
    saveDlscjybmList() {
      if (this.dlscjybmList.find((item) => !item.dlscjymc || !item.id)) {
        this.$message.warning('请补全信息')
        return;
      }
      this.form.dlscjybmList = [...this.dlscjybmList]
      this.dialogVisible = false
    },
    handleAddFun() {
      this.dlscjybmList.push({ id: '', dlscjymc: '' })
    },
    handleDeletedLscjybmList(index) {
      this.dlscjybmList.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../styles/variables.scss';
.main-content {
  padding: 0 32px 16px;
  margin-bottom: 12px;
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
      width: 100%
    }
  }

  .el-checkbox__input.is-checked+.el-checkbox__label,
  .el-radio__input.is-checked+.el-radio__label {
    color: #606266
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
      width: 60% !important
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
    width: 100%
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

