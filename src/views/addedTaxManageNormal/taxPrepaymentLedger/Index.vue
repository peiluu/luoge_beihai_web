<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <LedgerForm @search="handleSearch" :showMore="true" ref="ledgerForm" :queryAll="true">
      <template #topTool>
        <el-button @click="addLine({}, 'add')" type="primary">新增</el-button>
        <el-button @click="handleExport" :loading="exLoading">导出</el-button>
      </template>
      <template #customeTable>
        <vxe-table :height="height" border show-overflow keep-source ref="xTable" @checkbox-all="selectAllEvent" @checkbox-change="selectChangeEvent" :data="tableData"
          :edit-config="{ trigger: 'click', mode: 'cell', showIcon: false }" v-loading="loading" :edit-rules="validRules">
          <vxe-column type="checkbox" min-width="60" />
          <vxe-column type="seq" min-width="60" title="序号" />
          <vxe-column min-width="100" title="项目编号" field="xmbh" />
          <vxe-column min-width="190" title="项目名称" field="xmmc" />
          <vxe-column min-width="190" title="项目地址" field="xmdz" />
          <vxe-column min-width="190" title="纳税主体名称" field="nsrmc" />

          <vxe-column min-width="220" title="会计主体名称" field="kjztmc" />
          <vxe-column min-width="100" title="计税方式" align="center">
            <template #default="{ row }">{{ row.jsff == '0' ? '一般计税' : '简易计税' }}</template>
          </vxe-column>
          <vxe-column min-width="110" title="预征项目">
            <template #default="{ row }">{{ row.yzxm == '0' ? '建筑服务' : row.yzxm == '1' ? '销售不动产' : '出租不动产' }}</template>
          </vxe-column>
          <vxe-column width="100" title="税款所属期" field="ssq" align="center">
            <template #default="{ row }">{{ formatAllDate(row.ssq, ssqReturnType) }}</template>
          </vxe-column>
          <vxe-column min-width="120" title="销售额（含税）" field="hsxse" align="right">
            <template #default="{ row }"> {{ formatMoney(row.hsxse) }} </template>
          </vxe-column>
          <vxe-column min-width="120" title="扣除金额（含税）" field="hskcje" align="right">
            <template #default="{ row }"> {{ formatMoney(row.hskcje) }} </template>
          </vxe-column>

          <vxe-column min-width="100" title="预征率" field="yzl" align="center">
            <template #default="{ row }"> {{ row.yzl }} </template>
          </vxe-column>
          <vxe-column min-width="100" title="预征税额" field="yzse" align="right">
            <template #default="{ row }"> {{ formatMoney(row.yzse) }} </template>
          </vxe-column>
          <vxe-column min-width="190" title="城市维护建设税实际预缴税额" field="cjsyjse" align="right">
            <template #default="{ row }"> {{ formatMoney(row.cjsyjse) }} </template>
          </vxe-column>
          <vxe-column min-width="160" title="教育费附加实际预缴税额" field="jyffjyjse" align="right">
            <template #default="{ row }"> {{ formatMoney(row.jyffjyjse) }} </template>
          </vxe-column>
          <vxe-column min-width="190" title="地方教育费附加实际预缴税额" field="dfjyffjyjse" align="right">
            <template #default="{ row }"> {{ formatMoney(row.dfjyffjyjse) }} </template>
          </vxe-column>
          <vxe-column min-width="100" title="备注" field="bz">
            <template #default="{ row }"> {{ row.bz }} </template>
          </vxe-column>
          <vxe-column min-width="160" title="操作" fixed="right">
            <template #default="{ row }">
              <el-button @click="addLine(row, 'edit')" type="primary" v-if="row.sbzt != 'Y'">编辑</el-button>
              <el-button @click="handleDelete(row)" type="danger" v-if="row.sbzt != 'Y'">删除</el-button>
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
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageNo" :page-sizes="[10, 20, 30, 40, 50, 100, 500, 1000]"
            :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
          </el-pagination>
        </div>

      </template>
    </LedgerForm>

    <el-dialog :title="`${operatorType == 'add' ? '新增' : '编辑'}增值税及附加税预缴数据`" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
      <el-form :inline="true" :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="纳税主体名称" prop="nsrsbh">
          <el-select v-model="editForm.nsrsbh" filterable placeholder="请选择" @change="(e) => getOrgList(e, 'add')" :disabled="operatorType === 'edit'">
            <el-option v-for="item in taxBodyList" :key="item.id" :label="`${item.nsrmc} ${item.nsrsbh}`" :value="item.nsrsbh">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会计主体名称" prop="orgid">
          <el-select v-model="editForm.orgid" :disabled="!editForm.nsrsbh" filterable placeholder="请选择">
            <el-option v-for="item in orgIdList" :key="item.id" :label="`${item.name} ${item.code}`" :value="parseFloat(item.id)">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目编号" prop="xmbh">
          <el-input v-model="editForm.xmbh" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="税款所属期" prop="ssq" v-if="operatorType === 'add'">
          <QuarterDatePicker :key="`${zzstbzq}_${dialogVisible}`" :pickerType="zzstbzq" propsParam="ssq" :disabled="!editForm.nsrsbh" :defaultValue="editForm.ssq || ''" @getQuarterPickerFrom="getQuarterPickerFrom"
            :preDateDisabled="preDateDisabled" :currentDateDisabled="currentDateDisabled" ref="quarterDatePicker" />
        </el-form-item>

        <el-form-item label="项目地址" prop="xmdz">
          <el-input v-model="editForm.xmdz" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="项目名称" prop="xmmc">
          <el-input v-model="editForm.xmmc" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="预征项目" prop="yzxm">
          <el-select v-model="editForm.yzxm" filterable placeholder="请选择">
            <el-option label="建筑服务" value="0" />
            <el-option label="销售不动产" value="1" />
            <el-option label="出租不动产" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="计税方式" prop="jsff">
          <el-select v-model="editForm.jsff" filterable placeholder="请选择">
            <el-option label="一般计税" value="0" />
            <el-option label="简易计税" value="1" />
          </el-select>
        </el-form-item>

        <el-form-item label="销售额（含税）" prop="hsxse">
          <el-input v-model="editForm.hsxse" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="扣除金额（含税）" prop="hskcje">
          <el-input v-model="editForm.hskcje" placeholder=" 请输入" />
        </el-form-item>
        <el-form-item label="预征率" prop="yzl">
          <el-select v-model="editForm.yzl" filterable placeholder="请选择">
            <el-option v-for="item in yzlList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="预征税额" prop="yzse">
          <el-input v-model="editForm.yzse" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="城市维护建设税实际预缴税额" prop="cjsyjse">
          <el-input v-model="editForm.cjsyjse" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="教育费附加实际预缴税额" prop="jyffjyjse">
          <el-input v-model="editForm.jyffjyjse" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="地方教育费附加实际预缴税额" prop="dfjyffjyjse">
          <el-input v-model="editForm.dfjyffjyjse" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备注" prop="bz">
          <el-input v-model="editForm.bz" maxlength="100" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="success" @click="saveData" :loading="saveLoading">保 存</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import LedgerForm from '@/components/LedgerForm/Index';
import QuarterDatePicker from '@/components/QuarterDatePicker';
import { limitMoneyMsg } from '@/config/constant';
import { getCurrentSsq } from "@/utils/tool";

import { getListByUser, getOrgList, queryTaxAdvancePayment, add, update, deleteObj, queryStatus, exportLedger } from './Api';

export default {
  name: "TaxPrepaymentLedger",
  components: {
    LedgerForm,
    QuarterDatePicker
  },
  data() {
    return {
      api: require('./Api'),
      loading: false,
      selections: [],
      dialogVisible: false,
      param: {},
      tableData: [],
      operatorType: 'add',
      editForm: { orgid: '' },
      rules: {
        nsrsbh: [{ required: true, message: '请选择' }],
        orgid: [{ required: true, message: '请选择' }],
        xmbh: [{ required: true, message: '请输入' }],
        xmmc: [{ required: true, message: '请输入' }],
        xmdz: [{ required: true, message: '请输入' }],
        // ssq: [{ required: true, message: '请选择' }],
        yzxm: [{ required: true, message: '请选择' }],
        jsff: [{ required: true, message: '请选择' }],
        yzl: [{ required: true, message: '请选择' }],
        yzse: limitMoneyMsg,
        hskcje: limitMoneyMsg,
        hsxse: limitMoneyMsg,
        cjsyjse: limitMoneyMsg,
        jyffjyjse: limitMoneyMsg,
        dfjyffjyjse: limitMoneyMsg,
        bz: [{ required: true, message: '请输入' }],
      },
      validRules: {},
      taxBodyList: [],
      orgIdList: [],
      querySbStatus: false,
      yzlList: [{ value: '1%', label: '1%' }, { value: '2%', label: '2%' }, { value: '3%', label: '3%' }, { value: '5%', label: '5%' }],
      // 增值税申报周期
      zzstbzq: '月',
      queryParam: {},
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        showQuickJumper: true,
        showTotal: (total) => `共${total}条`,
      },
      preDateDisabled: false,
      currentDateDisabled: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      saveLoading: false,
      exLoading: false,
    };
  },
  methods: {
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({ sffk: 'N' })
      if (code === '0') {
        this.taxBodyList = data
        // this.getOrgList(data[0]?.nsrsbh)
      }
    },
    // 获取会计主体（受票点）
    async getOrgList(nsrsbh, type) {
      const { zzstbzq = '' } = this.taxBodyList.find((item) => item.nsrsbh == nsrsbh) || {}
      this.zzstbzq = zzstbzq || '月'
      // 新增的时候去查申报状态
      if (type == 'add') {
        this.editForm = { ...this.editForm, orgid: '' }
        this.queryStatus(type)
      }
      const { code = '', data = [] } = await getOrgList({ nsrsbh, isInvoice: 'N' })
      if (code === '0') {
        this.orgIdList = data;
      }
    },
    async handleSearch(queryParam) {
      try {
        this.loading = true;
        this.queryParam = queryParam
        const res = await queryTaxAdvancePayment({
          ...queryParam,
          pageNo: this.pagination.pageNo || 1,
          pageSize: this.pagination.pageSize || 10
        })

        this.pagination = { ... { ...res, total: res.totalCount } }
        this.tableData = res.data || [];
      } catch (error) {
        
      } finally {
        this.loading = false;
      }
      
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
    // 查询申报状态
    async queryStatus(type) {
      let status = false;
      const { monthValue, quarterValue } = getCurrentSsq()
      const ssq = this.zzstbzq == '月' ? monthValue : quarterValue
      const param = type == 'add' ? { nsrsbh: this.editForm.nsrsbh, ssq } : { ...this.queryParam, ssq: this.queryParam.srssq }
      // false 是当前还没有申报
      const { code = '', data } = await queryStatus({ ...param, sbsz: 'zzs' })
      if (code === '0') {
        status = data;
        if (type == 'add') {
          // false 是当前还没有申报，本期还是可以选的
          this.currentDateDisabled = data;
          this.preDateDisabled = !data;
          return;
        }
        this.querySbStatus = data
      }
      return status
    },

    selectAllEvent({ checked }) {
      this.selections = this.$refs.xTable.getCheckboxRecords()
    },
    selectChangeEvent({ checked }) {
      this.selections = this.$refs.xTable.getCheckboxRecords()
    },
    handleClose() {
      this.dialogVisible = false
    },
    addLine(row, type) {
      this.editForm = { ...row || {} }
      this.operatorType = type
      this.dialogVisible = true
      if (type === 'edit') {
        this.getOrgList(row.nsrsbh)
      }
    },

    handleDelete(row) {
      this.$confirm(`您确定要删除吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code = '', data = [] } = await deleteObj({ id: row.id })
        if (code === '0') {
          this.$message.success('刪除成功')
          this.handleSearch(this.queryParam)
        }
      }).catch(() => {
      });
    },
    getQuarterPickerFrom(propsParam, data) {
      this.editForm[propsParam] = data
    },
    async saveData() {
      this.$refs["editForm"].validate(async valid => {
        if (!valid) return
        console.log(this.editForm)
        if (!this.editForm.ssq) {
          this.$message.warning('请选择属期！');
          return;
        }
        if (await this.queryStatus()) {
          this.$message.warning('该属期已申报，无法变更数据')
          return;
        }
        const api = this.operatorType === 'add' ? add : update
        try {
          this.saveLoading = true
          const { code = '' } = await api({
            ...this.editForm,
          })
          if (code === '0') {
            this.$message.success('操作成功')
            this.handleClose()
            this.handleSearch(this.queryParam)
          }
        } catch (error) {
          
        } finally {
          this.saveLoading = false
        }
        
      })
    },
    // 导出
    async handleExport() {
      try {
        this.exLoading = true
        const fileName = `增值税及附加税费预缴台账.xlsx`
        await exportLedger({
          reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999 },
          fileName
        })
      } catch (error) {
        
      } finally {
        this.exLoading = false
      }
      
    },
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
    }
  },
  mounted() {
    this.getListByUser()
  }
};
</script>
<style scoped lang="scss">
/deep/ .el-dialog__body {
  .el-form-item:nth-of-type(4) {
    .el-form-item__label::before {
      content: '*';
      color: red;
      margin-right: 4px;
    }
  }

  .el-form-item {
    width: calc(50% - 10px);
    margin-bottom: 16px;


    .el-form-item__label {
      width: 210px;
    }

    .el-form-item__content {
      width: calc(100% - 210px);

      .el-select,
      .el-date-editor,
      .vxe-select,
      .vxe-input,
      .el-input {
        width: 100%;
      }
    }

  }
}
</style>

