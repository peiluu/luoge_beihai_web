<template>
  <div class="main-content">
    <!-- form表单 -->
    <el-form :inline="true" :model="form" class="edit-form">
      <el-form-item label="纳税主体" prop="nsrList">
        <el-select multiple v-model="form.nsrList" placeholder="请选择" filterable :filter-method="filterMethod">
          <el-option
            v-for="(item, index) in nsrOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item></el-form-item>
      <el-form-item>
        <div class="bths-box">
          <el-button type="success" @click="getDetailList">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form-item>
      <div class="toolbar">
        <div class="toolbar-left" />
        <vxe-toolbar size="mini">
          <template #buttons>
            <vxe-button content="批量设置">
              <template #dropdowns>
                <vxe-button type="text" content="单张发票限额设定" @click="batchOperate('amount')" />
                <vxe-button type="text" content="授信额度预警比例" @click="batchOperate('ratio')" />
                <vxe-button type="text" content="单次申请发票数量" @click="batchOperate('codeNum')" />
              </template>
            </vxe-button>
          </template>
        </vxe-toolbar>
      </div>
    </el-form>

    <div class="custom-vxe-table">
      <vxe-table
        border
        show-overflow
        keep-source
        ref="xTable"
        :data="tableData"
        :edit-config="{ trigger: 'click', mode: 'cell', icon: 'vxe-icon-edit' }"
        v-loading="loading"
        :edit-rules="validRules"
        :cell-style="setCellStyle"
      >
        <vxe-column type="checkbox"></vxe-column>
        <vxe-column type="seq" width="50" title="序号" />
        <vxe-column field="name" title="纳税主体名称" width="20%" />
        <vxe-column field="nsrsbh" title="纳税主体识别号码" width="16%" />

        <vxe-column field="codeNum" title="单次申请发票数量" :edit-render="{}" width="11%" align="right">
          <template #edit="{ row }">
            <vxe-input
              size="mini"
              v-model="row.codeNum"
              type="number"
              max="5000"
              min="0"
              placeholder="请输入（不得大于5000）"
            />
          </template>
        </vxe-column>
        <vxe-column field="auto" title="是否开通单张发票限额设定" align="center" :edit-render="{}" width="15%">
          <template #edit="{ row }">
            <vxe-select v-model="row.sfdzxe" placeholder="请选择" size="mini">
              <vxe-option key="1" label="是" value="Y" />
              <vxe-option key="2" label="否" value="N" />
            </vxe-select>
          </template>
          <template #default="{ row }">
            <span>{{ row.sfdzxe === 'Y' ? '是' : '否' }}</span>
          </template>
        </vxe-column>

        <vxe-column field="amount" title="单张发票限额值" :edit-render="{}" width="11%" align="right">
          <template #edit="{ row }">
            <vxe-input
              size="mini"
              v-model="row.amount"
              type="number"
              min="0"
              placeholder="请输入（仅支持正整数）"
              :disabled="row.sfdzxe == 'N'"
            />
          </template>
        </vxe-column>

        <vxe-column field="ratio" title="授信额度预警比例（占总额度）" :edit-render="{}" width="17%">
          <template #edit="{ row }">
            <vxe-select v-model="row.ratio" placeholder="请选择" size="mini">
              <vxe-option v-for="item in ratioList" :key="item.value" :label="item.label" :value="item.value" />
            </vxe-select>
          </template>
          <template #default="{ row }">
            <span>{{ ratioListMap[row.ratio] }}</span>
          </template>
        </vxe-column>

        <vxe-column field="email" title="邮件通知" :edit-render="{}" width="12%">
          <template #edit="{ row }">
            <vxe-input size="mini" v-model="row.email" type="text" placeholder="请输入" />
          </template>
        </vxe-column>
      </vxe-table>

      <div class="table-footer">
        <div class="footer-left">
          <div><i class="el-icon-warning-outline"></i></div>
          <div>
            <div>默认发票赋码数量到10%时，会自动下载发票赋码数量；</div>
            <div>授信额度比例低于设定数值时，会提示“授信额度预警”标志</div>
          </div>
        </div>
        <div class="pagination">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.pageNo"
            :page-sizes="[10, 20, 30, 40, 50, 100, 500, 1000]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.totalCount"
          >
          </el-pagination>
        </div>
      </div>

      <div class="flex-center">
        <el-button @click="submit" type="success" :disabled="tableData.length === 0">保存</el-button>
      </div>
    </div>

    <!-- 批量设置 -->
    <el-dialog
      :title="batchOperateTypeMap[batchOperateType]"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form :inline="true" :model="editForm" ref="editForm">
        <!-- 是否开通单张发限额设定 -->
        <template v-if="batchOperateType == 'amount'">
          <el-form-item label="是否开通单张发限额设定" prop="sfdzxe">
            <vxe-select v-model="editForm.sfdzxe" placeholder="请选择" size="mini">
              <vxe-option key="1" label="是" value="Y" />
              <vxe-option key="2" label="否" value="N" />
            </vxe-select>
          </el-form-item>
          <el-form-item label="单张发票限额值" prop="amount">
            <!-- <el-input type="number" min="0" v-model="editForm.amount" :disabled="editForm.sfdzxe == 'N'" placeholder="请输入" /> -->
            <vxe-input
              size="mini"
              v-model="editForm.amount"
              type="number"
              :min="0"
              placeholder="请输入"
              :disabled="editForm.sfdzxe == 'N'"
              :aria-required="editForm.sfdzxe == 'Y'"
            />
          </el-form-item>
        </template>

        <!-- 授信额度预警比例设定 -->
        <template v-if="batchOperateType == 'ratio'">
          <el-form-item label="授信额度预警比例" prop="ratio">
            <vxe-select v-model="editForm.ratio" placeholder="请选择" size="mini">
              <vxe-option v-for="item in ratioList" :key="item.value" :label="item.label" :value="item.value" />
            </vxe-select>
          </el-form-item>
        </template>

        <!-- 单次申请发票数量设定 -->
        <template v-if="batchOperateType == 'codeNum'">
          <el-form-item label="单次申请发票数量" prop="codeNum">
            <vxe-input
              v-model="editForm.codeNum"
              size="mini"
              type="number"
              :max="5000"
              :min="0"
              placeholder="请输入（不得大于5000）"
            />
            <!-- <el-input type="number" min="0" max="2000" v-model="editForm.codeNum" placeholder="请输入" /> -->
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="success" @click="saveData">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateDetail, getDetailList, getListByUser } from './Api';

export default {
  name: 'Creditlimit',
  data() {
    return {
      // monitoringFrequencyList,
      form: {},
      editForm: { sfdzxe: 'Y' },
      tableData: [],
      dialogVisible: false,
      loading: false,
      batchOperateType: 'amount',
      taxBodyList: [],
      nsrOptions: [],
      batchOperateTypeMap: {
        amount: '单张发票限额设定',
        ratio: '授信额度预警比例设定',
        codeNum: '单次申请发票数量设定',
      },
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        showQuickJumper: true,
        showTotal: (total) => `共${total}条`,
      },

      ratioList: [
        { label: '5%', value: 0.05 },
        { label: '10%', value: 0.1 },
        { label: '20%', value: 0.2 },
        { label: '30%', value: 0.3 },
        { label: '40%', value: 0.4 },
        { label: '50%', value: 0.5 },
      ],
      ratioListMap: {
        0.05: '5%',
        0.1: '10%',
        0.2: '20%',
        0.3: '30%',
        0.4: '40%',
        0.5: '50%',
      },
      rules: {
        ratio: [{ required: true, message: '请选择', trigger: 'blur' }],
        codeNum: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
      validRules: {
        lzfpmxxh: [{ required: true, message: '原发票序号不能为空' }],
        xmmc: [{ required: true, message: '项目名称不能为空' }],
        codeNum: [{ type: 'number', message: '请填写正确数字' }],
        email: [
          {
            pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
            message: '请输入正确的邮箱格式',
          },
        ],
      },
    };
  },
  activated() {
    this.getListByUser();
    this.getDetailList();
  },
  computed: {
    selections() {
      return this.$refs.xTable.getCheckboxRecords();
    },
  },

  methods: {
    handleChange(e){
      console.log('--eeeeee--', e)
    },
    filterMethod(value) {
      this.nsrOptions = this.taxBodyList.filter((item) => item.label.includes(value));
    },
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({});
      if (code === '0') {
        this.taxBodyList = data.map((item) => {
          return {
            value: item.nsrsbh,
            label: item.nsrmc + ' ' + item.nsrsbh,
          };
        });

        this.nsrOptions = [...this.taxBodyList];
      }
    },

    // 查询预警信息
    async getDetailList(pagination) {
      try {
        this.loading = true;
        const {
          code = '',
          data = [],
          pageNo,
          pageSize,
          totalCount,
          msg,
        } = await getDetailList({
          ...this.form,
          pageNo: pagination?.pageNo || 1,
          pageSize: pagination?.pageSize || 10,
        });
        if (code === '0') {
          this.pagination = {
            pageNo,
            pageSize,
            totalCount,
          };
          this.tableData = data;
        }
      } catch (error) {
        // console.log('---error---', error);
        this.$message.error(error.msg || '查询预警信息失败，请联系管理员')
      } finally {
        this.loading = false;
      }
    },

    // 更细预警信息
    async updateDetail() {
      const { code = '', data = {} } = await updateDetail({
        detailList: this.tableData,
      });
      if (code === '0') {
        this.getDetailList();
        this.$message.success('保存成功 ');
        this.handleClose();
      }
    },

    // 批量操作
    batchOperate(type) {
      if (this.selections.length == 0) {
        this.$message.warning('请至少选择一条数据');
        return;
      }
      this.batchOperateType = type;
      this.dialogVisible = true;
    },

    // 批量修改表格数据
    saveData() {
      if (
        this.batchOperateType == 'amount' &&
        this.editForm.sfdzxe == 'Y' &&
        (!this.editForm.amount || this.editForm.amount <= 0)
      ) {
        this.$message.warning('请填入单张发票限额数量');
        return;
      }
      if (this.batchOperateType == 'ratio' && !this.editForm.ratio) {
        this.$message.warning('请选择授信额度预警比例');
        return;
      }
      if (this.batchOperateType == 'codeNum' && !this.editForm.codeNum) {
        this.$message.warning('请输入单次申请发票数量');
        return;
      }
      // this.$refs["ruleForm"].validate(async valid => {
      //   if (!valid) return;
      // })
      // 数据映射到表格
      for (let key in this.editForm) {
        this.tableData = this.tableData.map((item) => {
          const selectionItem = this.selections.find((subitem) => item.id === subitem.id);
          return !selectionItem
            ? item
            : {
                ...item,
                [key]: this.editForm[key] ? this.editForm[key] : item[key],
              };
        });
      }
      this.updateDetail();
    },
    /**
     * @description 提交表单，验证数据格式
     */
    async submit() {
      // 验证表格数据
      const errMap = await this.$refs.xTable.fullValidate(true).catch((errMap) => errMap);
      console.log(errMap);
      if (errMap) return;
      this.updateDetail();
    },

    // 设置单元格样式
    setCellStyle({ row, column }) {
      if (row.sfdzxe === 'N' && column.field == 'amount') {
        return { background: '#f3f3f3' };
      }
    },

    reset() {
      this.form = {};
      this.$nextTick(() => {
        this.getDetailList();
      });
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.pagination.pageNo = 1;
      this.$nextTick(() => {
        this.getDetailList(this.pagination);
      });
    },
    handleCurrentChange(pageNo) {
      this.pagination.pageNo = pageNo;
      this.$nextTick(() => {
        this.getDetailList(this.pagination);
      });
    },
    handleClose() {
      this.dialogVisible = false;
      this.editForm = {};
    },
  },
};
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/deep/ .vxe-toolbar {
  display: flex;

  .vxe-buttons--wrapper {
    justify-content: flex-end;
    margin-left: 10px;
  }
}
/deep/ .el-form-item {
  width: calc(33.3%);
  margin: 0;

  .el-form-item__label {
    width: 130px;
    font-size: 12px;
  }

  .el-form-item__content {
    width: calc(100% - 180px);

    .el-select,
    .el-date-editor,
    .el-input {
      width: 100%;
    }
  }
}

.el-form-item:nth-of-type(3) {
  /deep/ .el-form-item__content {
    width: 100%;
  }

  .bths-box {
    float: right;
  }
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0 12px;
  line-height: 18px;
  color: #0080ff;

  .footer-left {
    display: flex;
    align-items: center;
  }

  .el-icon-warning-outline {
    margin-right: 8px;
    font-size: 24px;
    color: #0080ff;
  }
}

/deep/ .el-dialog__body {
  .el-form-item {
    width: 100%;

    &:first-of-type {
      margin-bottom: 16px;
    }

    .el-form-item__label {
      width: 190px;
      font-size: 14px;
    }

    .el-form-item__content {
      width: calc(100% - 300px);

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
/deep/ .vxe-table--body-wrapper {
  min-height: calc(100vh -  414px) !important;
}
</style>
