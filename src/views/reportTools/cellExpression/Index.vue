<template>
  <div class="CellExpression">
    <div class="cell-select">
      选择报表
      <el-select
        filterable
        class="form-inline-input"
        size="small"
        v-model="searchParam.templateId"
        style="margin: 0 20px 0 5px"
      >
        <el-option
          v-for="option in templateOptions"
          :key="option.id"
          :label="option.templateName"
          v-model="option.id"
        ></el-option>
      </el-select>

      所属业态
      <el-select
        clearable
        filterable
        class="form-inline-input"
        size="small"
        v-model="searchParam.business"
        style="margin: 0 20px 0 5px"
      >
        <el-option v-for="option in businessOptions" :key="option" :label="option" :value="option"></el-option>
      </el-select>

      纳税主体
      <el-select
        clearable
        filterable
        class="form-inline-input"
        size="small"
        v-model="searchParam.nsrsbh"
        style="margin: 0 20px 0 5px"
      >
        <el-option
          v-for="(option, index) in taxBodyOptions"
          :key="index"
          :label="option.nsrmc"
          v-model="option.nsrsbh"
        ></el-option>
      </el-select>
    </div>
    <div id="luckysheet4"></div>
    <!--配置公式-->
    <ExpModal
      :expCellExpression="expCellExpression"
      :expVisible="expVisible"
      @closeExp="closeExp"
      @submitExp="submitExp"
    ></ExpModal>
    <!--配置动态行-->
    <DynamicRowModal
      :dynamicSettingId="dynamicSettingId"
      :currentCell="currentCell"
      :modalVisible="modalVisible"
      @closeModal="closeModal"
      @submitModal="submitModal"
    ></DynamicRowModal>
    <!--配置下拉框-->
    <DropdownModal
      :expCellExpression="expCellExpression"
      :dropdownVisible="dropdownVisible"
      @closeDropdown="closeDropdown"
      @submitDropdown="submitExp"
    ></DropdownModal>
    <!--基础配置-->
    <BasicModal
      :expCellExpression="expCellExpression"
      :basicVisible="basicVisible"
      @closeBasicModal="closeBasicModal"
      @submitBasicModal="submitExp"
    ></BasicModal>
  </div>
</template>

<script>
import ExpModal from './ExpModal/Index';
import DynamicRowModal from './DynamicRowModal/Index';
import DropdownModal from './DropdownModal/Index';
import BasicModal from './BasicModal/Index';
import LuckyExcel from 'luckyexcel';
import { luckySetting } from '../settings.js';

export default {
  name: 'CellExpression',
  components: {
    ExpModal,
    DynamicRowModal,
    DropdownModal,
    BasicModal,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      api: require('./Api'),
      cellSettingApi: require('../cellSetting/Api'),
      templateApi: require('../templateMng/Api'),
      searchParam: {
        templateId: '',
        business: '',
        nsrsbh: '',
      },
      templateOptions: [],
      businessOptions: [],
      taxBodyOptions: [],

      sheetOrder: 0,
      currentCell: {},
      expVisible: false,
      expCellExpression: {},
      cellSettingId: '',
      dynamicSettingId: -1,
      modalVisible: false,
      dropdownVisible: false,
      basicVisible: false,
    };
  },
  created() {
    if (this.searchParam.templateId) {
      this.loadTemplate(this.searchParam.templateId);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.selectExpTemplateList();
      this.selectBusinessList();
    });
  },
  watch: {
    'searchParam.templateId'(newVal, oldVal) {
      this.loadTemplate(newVal);
    },
    'searchParam.business'(newVal, oldVal) {
      this.selectTaxBodyList(newVal);
    },
  },
  methods: {
    selectExpTemplateList() {
      this.templateApi.selectExpTemplateList({}).then((res) => {
        this.templateOptions = res.data;
        this.searchParam.templateId = res.data[0].id;
      });
    },
    selectBusinessList() {
      this.api.selectBusinessList().then((res) => {
        this.businessOptions = res.data;
      });
    },
    selectTaxBodyList(business) {
      if (business) {
        this.api.selectTaxBodyList({ business: business }).then((res) => {
          this.taxBodyOptions = res.data;
        });
      } else {
        this.taxBodyOptions = [];
      }
      this.searchParam.nsrsbh = '';
    },
    loadTemplate(templateId) {
      let that = this;
      that.templateApi.getTemplateDetailJson(templateId).then((res) => {
        if (res.data) {
          that.loadExcelJson('luckysheet4', res.data.template);
        } else {
          if (templateId) {
            that.templateApi.loadTemplate(templateId).then((blob) => {
              let excelFile = new File([blob], '申报表模板.xlsx');
              that.uploadExcel(excelFile);
            });
          }
        }
      });
    },
    uploadExcel(file) {
      let that = this;
      let name = file.name;
      let suffixArr = name.split('.'),
        suffix = suffixArr[suffixArr.length - 1];
      if (suffix != 'xlsx') {
        this.$message.error('只能支持xlsx格式的文件');
        return;
      }
      LuckyExcel.transformExcelToLucky(file, function (exportJson, luckysheetfile) {
        if (exportJson.sheets == null || exportJson.sheets.length == 0) {
          this.$message.error('加载文件失败');
          return;
        }
        that.loadExcelJson('luckysheet4', exportJson.sheets);
      });
    },
    loadExcelJson(id, excelJson) {
      let that = this;
      window.luckysheet.destroy();
      window.luckysheet.create({
        ...luckySetting,
        container: 'luckysheet4',
        data: excelJson,
        hook: {
          workbookCreateAfter: function () {
            //对于已经填报的公司，带出公式信息
            that.api.listCellExpressions(that.searchParam).then((res) => {
              res.data.map((e) => {
                if (e.rowStart && e.colStart) {
                  luckysheet.setCellFormat(e.rowStart, e.colStart, 'bg', '#ffb628', { order: e.sheetOrder });
                }
              });
              // 动态设置每一个sheet表的最大列数
              excelJson.forEach((item, index) => {
                let maxLen = 0;
                item.data.forEach((dItem) => {
                  const dLen = dItem.filter((v) => v !== null).length;
                  maxLen = maxLen > dLen ? maxLen : dLen;
                });
                luckysheet.hideColumn(maxLen + 2, item.data[0].length, { order: index });
              });
              luckysheet.setSheetActive(0);
            });
          },
          cellEditBefore: function (e) {
            that.sheetOrder = luckysheet.getSheet().order;
            that.currentCell = e[0];
            let param = {
              ...that.searchParam,
              sheetOrder: that.sheetOrder,
              rowStart: that.currentCell.row[0],
              rowEnd: that.currentCell.row[1],
            };
            //获取单元编辑方式配置
            let param_all = {
              ...param,
              colStart: that.currentCell.column[0],
              colEnd: that.currentCell.column[1],
            };
            that.cellSettingApi.detailCellSetting(param_all).then((res) => {
              if (res.data) {
                let editorType = res.data.editorType;
                //0表间公式 1手工输入 2公式弹窗 3动态行 4下拉框 5基础配置
                if (editorType == 2) {
                  that.expVisible = true;
                  that.cellSettingId = res.data.id;
                  that.expCellExpression = res.data.expCellExpression;
                } else if (editorType == 3) {
                  that.modalVisible = true;
                  that.cellSettingId = res.data.id;
                  //查询该行对应的配置id
                  that.api.detailExpDynamicSetting(param).then((res) => {
                    if (res.data && res.data.dynamicRowId) {
                      that.dynamicSettingId = res.data.dynamicRowId;
                    }
                  });
                } else if (editorType == 4) {
                  that.expCellExpression = res.data.expCellExpression;
                  that.cellSettingId = res.data.id;
                  that.dropdownVisible = true;
                } else if (editorType == 5) {
                  that.expCellExpression = res.data.expCellExpression;
                  that.cellSettingId = res.data.id;
                  that.basicVisible = true;
                }
              }
            });
            return false;
          },
        },
      });
    },
    downloadExcel() {
      //  exportExcel(luckysheet.getAllSheets(),"下载")
    },
    closeExp() {
      this.expVisible = false;
    },
    submitExp(param) {
      let data = {
        ...param,
        id: this.expCellExpression ? this.expCellExpression.id || '' : '',
        settingId: this.cellSettingId,
        business: this.searchParam.business,
        nsrsbh: this.searchParam.nsrsbh,
      };
      //保存单元格公式
      this.api.saveCellExpression(data).then((res) => {
        this.expVisible = false;
        this.$message({
          message: '保存成功',
          type: 'success',
        });
      });
    },
    closeModal() {
      this.modalVisible = false;
    },
    submitModal(param) {
      let data = {
        ...param,
        templateId: this.searchParam.templateId,
        sheetOrder: this.sheetOrder,
        rowStart: this.currentCell.row[0],
        rowEnd: this.currentCell.row[1],
        //  id: this.expressionId,
        settingId: this.cellSettingId,
        business: this.searchParam.business,
        nsrsbh: this.searchParam.nsrsbh,
      };
      //保存单元格公式
      this.api.saveExpDynamicSetting(data).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: '保存成功',
            type: 'success',
          });
        }
      });
    },
    closeDropdown() {
      this.dropdownVisible = false;
    },
    closeBasicModal() {
      this.basicVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/variables.scss';
.CellExpression {
  position: relative;
  height: $content--fill-height-tabs;
  .cell-select {
    padding: 12px 15px;
    background-color: #fff;
  }
  #luckysheet4 {
    position: relative;
    height: calc(100% - 56px);
  }
}
</style>
