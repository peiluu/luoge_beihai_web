<template>
  <div>
    <div class="main-content">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" :disabled="operateType === 'detail'">
        <div class="content-title">客户信息</div>
        <el-form-item label="请选择纳税主体" prop="orgid">
          <el-select v-model="form.orgid" placeholder="请选择" filterable clearable multiple>
            <el-option v-for="item in taxBodyList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择限制的税率">
          <el-select v-model="form.qyzbs" placeholder="请选择">
            <el-option label="免税" value="1"></el-option>
            <el-option label="不征税" value="2"></el-option>
            <el-option label="0%" value="3"></el-option>
            <el-option label="1%" value="4"></el-option>
            <el-option label="3%" value="5"></el-option>
            <el-option label="5%" value="6"></el-option>
            <el-option label="6%" value="7"></el-option>
            <el-option label="9%" value="8"></el-option>
            <el-option label="11%" value="9"></el-option>
            <el-option label="13%" value="10"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="限制约束" prop="gmfMc">
          <el-input v-model="form.nsrmc" placeholder="不得开具" maxlength="100" :disabled="true" />
        </el-form-item>
        <el-form-item label="请选择限制结果">
          <el-select v-model="form.result" placeholder="请选择">
            <el-option label="提醒" value="11"></el-option>
          <el-option label="拒绝" value="12"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择发票类型" prop="dzdh">
          <el-select v-model="form.dzdh" placeholder="请选择" maxlength="80" />
        </el-form-item>
      </el-form>
    </div>

    <div class="footer">
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
import { getDetailById, getAllZt, selectYtList, selectQyList, addTaxBody, getZgsList, getTaxArea, updateTaxBody } from "./Api";
export default {
  name: "organizationTaxBodyDetail",
  components: {},
  props: {
    detailInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // value:'',
      // value1:'',
      // result:{
      //   11:'提醒',
      //   12:'拒绝'
      // },
      form:{
        qyzbs:""
      },
      taxRate: {
        1: '免税',
        2: '不征税',
        3: '0%',
        4: '1%',
        5: '3%',
        6: '5%',
        7: '6%',
        8: '9%',
        9: '11%',
        10: '13%',
        11:'提醒',
        12:'拒绝'
      },
      size: '',
      taxBodyList: [],
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
        taxBodyId: [{ required: true, message: "请输入", trigger: "blur" }],
        nsrsbh: [{ required: true, message: "请输入", trigger: "blur" }, regCollection.nsrsbh],
        nsrmc: [{ required: true, message: "请输入", trigger: "blur" }],
        address: [{ required: true, message: "请输入", trigger: "blur" }],
        phone: [{ required: true, message: "请输入", trigger: "blur" }, regCollection.phone],
        bankAccount: [{ required: true, message: "请输入", trigger: "blur" }],
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
  mounted() {
    if (sessionStorage.getItem('clearTaxBody') == 1) {
      this.form = { isDigital: 'N' }
      sessionStorage.setItem('clearTaxBody', 0)
    }
    // this.listCascaderDict();
    this.getTaxArea();
    this.selectYtList();
    this.selectQyList();
    this.getZgsList();
    const { operateType = '', id = '' } = this.detailInfo;
    console.log(this.detailInfo, 111)
    this.operateType = operateType;
    if (id) {
      this.getDetailById(id);
      this.getAllZt(id)
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
        debugger;
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
    },
    save() {
      if (this.form.qyzbs === "3") {
        this.$confirm("您选择的商品税率为3%，不符合开具标准，是否继续开具？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // 用户点击了确定按钮，执行保存操作
            this.saveData();
          })
          .catch(() => {
            // 用户点击了取消按钮
          });
      } else {
        // 其他税率的情况，直接执行保存操作
        this.saveData();
      }
    },
    saveData() {
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

.footer {
  text-align: center;
}
</style>

