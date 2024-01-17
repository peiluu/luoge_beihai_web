<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <LedgerForm @search="handleSearch" :queryAll="true" ref="ledgerForm">
      <template #topTool>
        <el-button @click="dataInitialization" type="primary" :disabled="!queryParam.nsrsbh || !queryParam.srssq || !canUpdate">取数</el-button>
        <el-button @click="handleExport">导出</el-button>
      </template>
      <template #customeTable>
        <vxe-table :height="height" border show-overflow keep-source ref="xTable" :data="tableData" v-loading="loading">
          <vxe-column type="seq" width="60" title="序号" />
          <vxe-column width="190" title="纳税主体名称" field="nsrmc" />
          <vxe-column width="190" title="纳税主体识别号" field="nsrsbh" />
          <vxe-column width="190" title="会计主体名称" field="kjztmc" />

          <vxe-column width="100" title="税款所属期" field="ssq" align="center">
            <template #default="{ row }">{{ formatAllDate(row.ssq, ssqReturnType) }}</template>
          </vxe-column>
          <vxe-column width="160" title="征税项目" field="zsxmmc" />
          <vxe-column field="ptfpxse" title="普通发票销售额" width="120" align="right">
            <template #default="{ row }"> {{ formatMoney(row.ptfpxse) }} </template>
          </vxe-column>
          <vxe-column field="mssrxse" title="免税收入销售额" width="120" align="right">
            <template #default="{ row }"> {{ formatMoney(row.mssrxse) }} </template>
          </vxe-column>
          <vxe-column field="wkpxse" title="未开票销售额" width="120" align="right">
            <template #default="{ row }"> {{ formatMoney(row.wkpxse) }} </template>
          </vxe-column>
          <vxe-column width="190" title="减免性质名称" field="jmxmmc" />
          <vxe-column width="170" title="减免性质代码" field="jmxzdm" />

          <vxe-column field="jmxzdmmc" title="出口免税是否为跨境服务" min-width="160" align="center">

            <template #default="{ row }">{{ row.ckmssfwkjfw == 'Y' ? '是' : '否' }}</template>
          </vxe-column>
          <vxe-column field="bz" title="备注" width="150" />
          <!-- <vxe-column min-width="130" title="操作" v-if="!judgeIsCurrentSq(queryParam.srssq, queryParam.tbzq || '月') && !querySbStatus"> -->
          <vxe-column min-width="130" title="操作" fixed="right">
            <template #default="{ row }">
              <el-button @click="queryDetail(row, 'edit')" type="primary" v-if="row.sbzt != 'Y'">修改减免项目</el-button>
            </template>
          </vxe-column>
          <template #empty>
            <span>
              <img src="@/assets/no-data.png" style="width: 80px;height: 80px;">
              <p>未搜索到数据</p>
            </span>
          </template>
        </vxe-table>
      </template>
      <template #customeTablePagination>
        <div class="pagination">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageNo" :page-sizes="[2, 20, 30, 40, 50, 100, 500, 1000]" :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
          </el-pagination>
        </div>
      </template>
    </LedgerForm>


    <el-dialog title="修改减免项目" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
      <div class="add-btns">
        <el-button type="success" @click="addFreeIncomeDtoList">新增</el-button>
      </div>
      <el-form :inline="true" :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="征税项目" prop="zsxm">
          <el-select v-model="editForm.zsxm" filterable placeholder="请选择" disabled>
            <el-option label="货物" value="1" />
            <el-option label="加工修理修配劳务" value="2" />
            <el-option label="服务、不动产和无形资产" value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="免税收入销售额" prop="mssrxse">
          <el-input v-model="editForm.mssrxse" placeholder="请输入" disabled />
        </el-form-item>
        <el-form-item label="普通发票销售额" prop="ptfpxse">
          <el-input v-model="editForm.ptfpxse" placeholder="请输入" disabled />
        </el-form-item>

        <div v-for="(item, index) in editForm.taxFreeIncomeVOList" :key="index" class="item-box">
          <el-form-item label="减免性质名称代码" :rules="rules.jmxzdmmc">
            <el-select :transfer="true" v-model="item.jmxzdmmc" placeholder="请选择">
              <el-option v-for="(item, index) in jmdmTaxList" :key="index" :value="`${item.mc}_${item.dm}`" :label="`${item.mc}_${item.dm}`" />
            </el-select>
          </el-form-item>
          <el-form-item label="免税收入销售额" prop="mssrxse" :rules="rules.mssrxse">
            <el-input v-model="item.mssrxse" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="普通发票销售额" prop="ptfpxse">
            <el-input v-model="item.ptfpxse" placeholder=" 请输入" />
          </el-form-item>

          <el-form-item label="备注" prop="bz">
            <el-input v-model="item.bz" placeholder="请输入" maxlength="100" />
          </el-form-item>
          <el-form-item v-if="editForm.zsxm == 3 && item.jmxzdmmc == '出口免税_00'" label="出口免税是否为跨境服务" prop="ckmssfwkjfw">
            <el-select v-model="item.ckmssfwkjfw" filterable placeholder="请选择">
              <el-option label="是" value="Y" />
              <el-option label="否" value="N" />
            </el-select>
          </el-form-item>
          <div class="add-btns">
            <el-button type="danger" @click="deleteFreeIncomeDtoList(index)">刪除</el-button>
          </div>
        </div>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="success" @click="modifiedDeductionItem">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import LedgerForm from '@/components/LedgerForm/Index';
import { queryDetail, queryLedgerTaxFreeIncome, modifiedDeductionItem, queryDicJmdm, dataInitialization, deleteObj, exportLedger, queryStatus } from './Api';
export default {
  name: "TaxExemptIncomeLedger",
  components: {
    LedgerForm,
  },
  data() {
    return {
      dicJmdmList: [],
      tableData: [],
      loading: false,
      dialogVisible: false,
      editForm: {},
      queryParam: {},
      querySbStatus: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      pagination: {
        pageNo: 1,
        pageSize: 2,
        total: 0,
        showQuickJumper: true,
        showTotal: (total) => `共${total}条`,
      },
      rules: {
        ptfpxse: [{ required: true, message: '请输入' }, { pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字' }],
        mssrxse: [{ required: true, message: '请输入' }, { pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字' }],
        jmxzdmmc: [{ required: true, message: '请选择' }],
        ckmssfwkjfw: [{ required: true, message: '请选择' }],
      },
    }
  },
  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
    height() {
      return window.innerHeight - 300;
    },
    ssqReturnType() {
      return this.$refs.ledgerForm.zzstbzq
    },
    canUpdate() {
      return !this.querySbStatus
      // return this.judgeIsCurrentSq(this.queryParam.srssq, this.queryParam.tbzq || '月') && !this.querySbStatus
    }
  },
  mounted() {
    this.queryDicJmdm()
  },
  methods: {
    // 获取减免性质代码
    async queryDicJmdm() {
      const { code = '', data = [] } = await queryDicJmdm({ type: 1 })
      if (code === '0') {
        this.jmdmTaxList = data
      }
    },
    async handleSearch(queryParam) {
      this.queryParam = queryParam
      const res = await queryLedgerTaxFreeIncome({
        ...queryParam,
        pageNo: this.pagination.pageNo || 1,
        pageSize: this.pagination.pageSize || 10
      })

      this.pagination = { ... { ...res, total: res.totalCount } }
      this.tableData = res.data || [];
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.pagination.pageNo = 1;

      this.$nextTick(() => {
        this.handleSearch(this.queryParam);
      });
    },
    handleCurrentChange(pageNo) {
      this.pagination.pageNo = pageNo;
      this.$nextTick(() => {
        this.handleSearch(this.queryParam, {}, true);
      });
    },

    // 免税收入台账数据初始化
    async dataInitialization() {
      const { code = '', data = [] } = await dataInitialization(this.queryParam)
      if (code === '0') {
        this.$message.success('操作成功')
        this.handleSearch(this.queryParam)
      }
    },
    // 修改减免项目查询
    async queryDetail(row) {
      const { code = '', data = {} } = await queryDetail({ id: row.id })
      if (code === '0') {
        this.dialogVisible = true
        this.editForm = { ...row, ...data }
      }
    },
    // 修改减免项目
    modifiedDeductionItem() {
      this.$refs["editForm"].validate(async valid => {
        const reg = /^([-+])?\d+(\.[0-9]{1,2})?$/;
        // if (!valid) return;
        // 免税收入销售额
        let totalMssrxse = 0;
        // 普通发票销售额
        let totalptfpxse = 0;
        this.editForm.taxFreeIncomeVOList.forEach((item) => {
          totalMssrxse += parseFloat(item.mssrxse)
          totalptfpxse += parseFloat(item.ptfpxse)
          item.wkpxse = parseFloat(item.mssrxse) - parseFloat(item.ptfpxse)
          item.jmxmmc = item.jmxzdmmc?.split('_')[0]
          item.jmxzdm = item.jmxzdmmc?.split('_')[1]
        })
        if (this.editForm.taxFreeIncomeVOList.find((item) => !item.jmxzdmmc)) {
          this.$message.warning('请选择减免性质名称代码！')
          return;
        }
        if (this.editForm.taxFreeIncomeVOList.find((item) => item.zsxm == 3 && item.jmxzdmmc == '出口免税_00' && !item.ckmssfwkjfw)) {
          this.$message.warning('请选择出口免税是否为跨境服务！')
          return;
        }
        // if (this.editForm.taxFreeIncomeVOList.find((item) => !item.mssrxse)) {
        //   this.$message.warning('请输入免税收入销售额')
        //   return;
        // }

        if (this.editForm.taxFreeIncomeVOList.find((item) => !reg.test(item.mssrxse))) {
          this.$message.warning('请输入最多2位小数的免税收入销售额')
          return;
        }
        // if (this.editForm.taxFreeIncomeVOList.find((item) => !item.ptfpxse)) {
        //   this.$message.warning('请输入普通发票销售额')
        //   return;
        // }

        if (this.editForm.taxFreeIncomeVOList.find((item) => !reg.test(item.ptfpxse))) {
          this.$message.warning('请输入最多2位小数的普通发票销售额')
          return;
        }

        if (totalMssrxse != this.editForm.mssrxse) {
          this.$message.warning('免税收入销售额多项总和不等于总的免税收入销售额')
          return;
        }
        if (totalptfpxse != this.editForm.ptfpxse) {
          this.$message.warning('普通发票销售额多项总和不等于总的普通发票销售额')
          return;
        }
        const { code = '', } = await modifiedDeductionItem({
          ...this.editForm,
          srssq: this.editForm.ssq,
        })

        if (code === '0') {
          this.$message.success('操作成功')
          this.handleClose()
          this.handleSearch(this.queryParam)
        }
      })
    },

    handleClose() {
      this.dialogVisible = false
      this.editForm = {}
    },

    handleDelete(row) {
      this.$confirm(`您确定要删除吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code = '' } = await deleteObj({ id: row.id })
        if (code === '0') {
          this.$message.success('刪除成功')
          this.handleSearch(this.queryParam)
        }
      }).catch(() => {
      });
    },
    // 新增减免条目
    addFreeIncomeDtoList() {
      this.editForm.taxFreeIncomeVOList.push({ bs: 0, mssrxse: 0, ptfpxse: 0 })
    },

    deleteFreeIncomeDtoList(index) {
      this.editForm.taxFreeIncomeVOList.splice(index, 1)
    },
    // 导出
    async handleExport() {
      const fileName = `免税收入台账.xlsx`
      await exportLedger({
        reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999 },
        fileName
      })
    },
    // 查询申报状态
    async queryStatus() {
      // false是当前还没有申报
      const { code = '', data } = await queryStatus({ ...this.queryParam, ssq: this.queryParam.srssq, sbsz: 'zzs' })
      if (code === '0') {
        this.querySbStatus = data
      }
    },

  }
};
</script>
<style scoped lang="scss">
.add-btns {
  display: flex;
  justify-content: flex-end;
  margin: -8px 10px 20px 10px;
}

/deep/ .el-dialog__body {
  padding-bottom: 0;
  height: calc(100vh - 400px);
  overflow: scroll;

  .el-form-item {
    width: calc(33.3% - 10px);

    .el-form-item__label {
      width: 130px;
    }

    .el-form-item__content {
      width: calc(100% - 130px);
    }
  }

  .item-box {
    .el-form-item {
      width: calc(50% - 10px);
    }

    .el-form-item__label {
      width: 180px;
    }

    .el-form-item__content {
      width: calc(100% - 180px);
    }
  }


  .el-form-item__content {

    .el-select,
    .el-date-editor,
    .vxe-select,
    .vxe-input,
    .el-input {
      width: 100%;
    }
  }
}

/deep/ .hidden {
  display: none
}
</style>

