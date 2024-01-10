<template>
  <el-dialog title="房间信息" :visible.sync="dialogVisible" min-height="600px;" width="80%" :before-close="handleClose">

    <vxe-toolbar ref="toolbar">
      <template #buttons>
        <el-form ref="queryForm" :inline="true" :model="customerQuery" style="width: 100%;">
          <el-col :span="5">
            <el-form-item label="分期名称">
              <el-select  class="form-inline-input" v-model="customerQuery.installmentId" size="small" clearable>
                <el-option v-for="(installment, index) in installmentOptions" :key="index" :label="installment.installmentName" :value="installment.installmentId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="楼栋名称">
              <el-select  class="form-inline-input" v-model="customerQuery.blockId" size="small" clearable>
                <el-option v-for="(block, index) in blockOptions" :key="index" :label="block.blockName" :value="block.blockId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="产品类型">
              <el-select  class="form-inline-input" v-model="customerQuery.houseType" size="small" clearable>
                <el-option v-for="(productType, index) in productTypeOptions" :key="index" :label="productType.houseTypeName" :value="productType.houseTypeId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="房间编码/房间号">
              <vxe-input size="small" v-model="customerQuery.searchTxt" placeholder="请输入房间编码/房间号" clearable>
                <template #prefix>
                  <i style="cursor: pointer;color: #409EFF;font-size: 16px;" class="vxe-icon-search"></i>
                </template>
              </vxe-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="text-align: right;">
            <!--<el-button @click="doReset">重置</el-button>-->
            <el-button type="success" @click="doSearch">查询</el-button>
          </el-col>
        </el-form>
      </template>
    </vxe-toolbar>

    <vxe-table border stripe
               ref="mutiVxeTable"
               max-height="500"
               id="mutiVxeTable"
               @cell-click="cellClick"
               :custom-config="{ storage: true }"
               :data="roomData"
               :row-config="{ isHover: true, isCurrent: true }">
      <vxe-column type="radio" min-width="60" title="序号" align="center"></vxe-column>
      <vxe-column field="projectName" title="项目名称" min-width="160" align="center"></vxe-column>
      <vxe-column field="projectCode" title="	项目编码" min-width="120" align="center"></vxe-column>
      <vxe-column field="orgName" title="会计主体" min-width="300" align="center"></vxe-column>
      <vxe-column field="installmentName" title="分期名称" min-width="120" align="center"></vxe-column>
      <vxe-column field="installmentCode" title="分期编码" min-width="120" align="center"></vxe-column>
      <vxe-column field="houseNum" title="房间名称" min-width="300" align="center"></vxe-column>
      <vxe-column field="houseCode" title="房间编码" min-width="160" align="center"></vxe-column>
      <vxe-column field="taxCalculationMethod" title="	计税方式" min-width="160" align="center">
        <template #default="{ row }">
          {{row.taxCalculationMethod =='1' ? ' 一般计税':'简易计税'}}
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager size="mini" :current-page="customerPage.currentPage" :page-size="customerPage.pageSize" :total="customerPage.totalResult" :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
               @page-change="handlePageChange">
    </vxe-pager>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="success" @click="handleSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: "HouseInfoDlg",
    props: {
      dialogVisible:{
        type: Boolean,
        default: false,
      },
      projectId: ''
    },
    data() {
      return {
        api: require('./Api'),
        roomData: [],
        customerPage: {
          currentPage: 1,
          pageSize: 10,
          totalResult: 0
        },
        customerQuery: {
          pageNo: 1,
          pageSize: 10,
        },
        installmentOptions: [],
        blockOptions: [],
        productTypeOptions:[]
      };
    },
    watch: {
      projectId(newVal, oldVal){
        this.customerQuery = {...this.customerQuery, projectId: newVal}
        this.getRoomInfos();
        this.initInstallmentOptions();
      },
      'customerQuery.installmentId'(newVal, oldVal){
        this.initBlockOptions();
      }
    },
    mounted(){
      this.initProductTypeOptions();
    },
    methods: {
      initInstallmentOptions(){
        if(this.projectId){
          this.api.getInstallmentOptions(this.projectId).then(res => {
            this.installmentOptions = res.data
          });
        }

      },
      initBlockOptions(){
        if(this.customerQuery.installmentId){
          this.api.getBlockOptions(this.customerQuery.installmentId).then(res => {
            this.blockOptions = res.data
          });
        }
      },
      initProductTypeOptions(){
        this.api.getProductTypeOptions().then(res => {
          this.productTypeOptions = res.data
        });
      },
      //根据项目查询房间
      getRoomInfos(){
        this.api.getRoomInfos(this.customerQuery).then( res => {
          this.roomData = res.data
          this.customerPage = {
            currentPage: this.customerQuery.pageNo,
            pageSize: this.customerQuery.pageSize,
            totalResult: res.totalCount
          }
        })
      },
      doSearch(){
        this.getRoomInfos()
      },
      handleClose(){
        this.$emit("handleClose")
      },
      cellClick({row}){
        this.$refs.mutiVxeTable.setRadioRow(row)
      },
      handleSubmit(){
        const selectRow = this.$refs.mutiVxeTable.getRadioRecord()
        this.$emit("handleSubmit", selectRow);
      },
      handlePageChange({ currentPage, pageSize }){
        this.customerQuery = {...this.customerQuery, pageNo: currentPage, pageSize: pageSize}
        this.getRoomInfos()
      }
    }
  };
</script>

<style scoped lang="scss">
@import '../../../styles/variables.scss';
  ::v-deep .el-dialog {
    .el-dialog__body {
      padding: 10px 20px;
    }
  }

  ::v-deep .vxe-body--row {
    cursor: pointer;
  }

  .vxe-toolbar {
    padding: 0;
  }

  ::v-deep .vxe-table {
    .vxe-body--row.row--hover.row--current,
    .row--current,
    .row--hover {
      background: #ccf0ec;
    }
  }

  .right-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  ::v-deep .vxe-table {
    width: 100%;
    margin-top: 10px;
    .vxe-radio--icon,
    .vxe-icon-radio-checked,
    .vxe-icon-radio-unchecked:hover {
      color: $primaryGreenColor !important;
    }
     .el-form-item {
      margin-bottom: 0 !important;
    }
  }
  ::v-deep .vxe-table .el-form-item {
      margin-bottom: 0 !important;
    }
</style>
