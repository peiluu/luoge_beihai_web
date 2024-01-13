<template>
  <div>
    <div class="main-content" :style="'min-height: ' + contentHeight + 'px;'">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" :disabled="operateType === 'detail'">
        <div class="content-title">客户信息</div>
        <el-form-item label="所属企业" prop="enterprise">
          <el-select v-model="form.enterprise" placeholder="请选择" filterable clearable>
            <el-option v-for="(item, index) in provincesEnmu" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="nsrsbh">
          <el-input v-model="form.nsrsbh" placeholder="请输入" maxlength="20" />
        </el-form-item>
        <el-form-item label="客户名称" prop="nsrmc">
          <el-input v-model="form.nsrmc" placeholder="请输入" maxlength="100" />
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入" maxlength="80" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入" maxlength="13" />
        </el-form-item>
        <el-form-item label="账号" prop="bankAccount">
          <el-input v-model="form.bankAccount" placeholder="请输入" maxlength="90" />
        </el-form-item>
        <el-form-item label="联系人手机" prop="bankAccount">
          <el-input v-model="form.bankAccount" placeholder="请输入" maxlength="90" />
        </el-form-item>
        <el-form-item label="联系人" prop="bankAccount">
          <el-input v-model="form.bankAccount" placeholder="请输入" maxlength="90" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="bankAccount">
          <el-input v-model="form.bankAccount" placeholder="请输入" maxlength="90" />
        </el-form-item>
      </el-form>
      <!-- 扩展信息 -->
      <!-- <ExtendInfo :nsrsbh="form.nsrsbh" v-if="form.isDigital === 'Y' && operateType == 'detail'" /> -->
    </div>

    <div class="fixed-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="success" @click="submit" v-if="operateType !== 'detail'">保存</el-button>
    </div>

    <el-dialog title="编辑独立生产经营部门" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <div class="table-tools"><el-button @click="handleAddFun">新增</el-button></div>

      <div class="custom-table">
        <el-table stripe ref="table" :data="dlscjybmList" border :height="height" tooltip-effect="dark"
          :cell-style="{ textAlign: 'center' }" :header-cell-style="{
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
              <el-select v-model="scope.row.id" placeholder="请选择" filterable clearable
                @change="(e) => handleSelect(e, scope.$index)">
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
// import ExtendInfo from './ExtendInfo'
import {  getDetailById, getAllZt, selectYtList, selectQyList, addTaxBody, getZgsList, getTaxArea, updateTaxBody } from "./Api";
export default {
  name: "organizationTaxBodyDetail",
  components: {},
  data() {
    return {
      form: { isDigital: 'N' },
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
        enterprise: [{ required: true, message: "请输入", trigger: "blur" }, regCollection.enterprise],
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

  activated() {
    if (sessionStorage.getItem('clearTaxBody') == 1) {
      this.form = { isDigital: 'N' }
      sessionStorage.setItem('clearTaxBody', 0)
    }
    this.getTaxArea();
    this.selectYtList();
    this.selectQyList();
    this.getZgsList();

    const { operateType = '', id = '' } = this.$route.query;
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
      const api = param.id ? updateTaxBody : addTaxBody
      const { code = '', data = [] } = await api(param)
      if (code === '0') {
        this.$message.success('操作成功');
        setTimeout(() => {
          this.cancel();
        }, 1000)
      }
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    cancel() {
      this.form = { isDigital: 'N' }
      this.$router.push({
        path: '/custom/index',
        query: { activeName: '1' }
      })
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
@import '../../styles/variables.scss';

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
</style>

