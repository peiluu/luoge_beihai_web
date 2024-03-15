<template>
    <div class="">
        <el-card shadow="never">
      <app-search-form></app-search-form>
    </el-card>
    <el-card shadow="never">
      <article>
        <article style="padding: 2px">
          <el-row>
            <el-col :span="8">
              <div style="visibility: hidden">1</div>
              <!-- <el-form ref="form" :model="searchForm" label-width="0px">
                <el-form-item label="">
                  <el-input v-model="searchForm.name" placeholder="请输入发票代码/发票号码/销售方名称/支持扫码快速定位发票"></el-input>
                </el-form-item>
              </el-form> -->
            </el-col>
            <el-col :span="16" style="text-align: right">
              <el-button-group>
                <el-button
                  type=""
                  :disabled="isSelected.length <= 0"
                  @click="handleEditeStatus"
                  >发票查验</el-button
                >
                <el-button
                  type=""
                  :disabled="isSelected.length <= 0"
                  @click="handleEditeStatus"
                  >修改待认证科目</el-button
                >
                <el-button
                  type=""
                  :disabled="isSelected.length <= 0"
                  @click="handleUpload"
                  >发票入账</el-button
                >
                <el-button
                  type=""
                  :disabled="isSelected.length <= 0"
                  @click="handleUpload"
                  >撤销入账</el-button
                >
                <el-button
                  type=""
                  :disabled="isSelected.length <= 0"
                  @click="handlePush"
                  >确认收票</el-button
                >
                <el-button
                  type=""
                  :disabled="isSelected.length <= 0"
                  @click="handlePush"
                  >撤销收票</el-button
                >
                <el-button type="">导出查询结果</el-button>
                <el-button
                  type=""
                  :disabled="isSelected.length <= 0"
                  @click="handlePush"
                  >导出选中发票</el-button
                >
              </el-button-group>
              <!-- <el-dropdown style="margin-left: 15px;">
                <el-button type="" >
                  导出查询结果
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :disabled="isSelected.length <= 0">按查询显示结果模板导出（含明细）</el-dropdown-item>
                  <el-dropdown-item :disabled="isSelected.length <= 0">按查询显示结果模板导出（不含明细）</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
            </el-col>
          </el-row>
        </article>
        <article>
          <el-table
            :data="tableData"
            :border="true"
            style="width: 100%"
            @row-click="handleRowClick"
            highlight-current-row
            :row-class-name="rowClassName"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" fixed="left" align="center">
            </el-table-column>
            <el-table-column type="index" width="55" label="序号" align="center">
            </el-table-column>
            <el-table-column prop="date" label="代扣代缴完税凭证号" minWidth="160" align="center">
            </el-table-column>
            <el-table-column prop="name" label="票种类型" minWidth="140" align="center">
            </el-table-column>
            <el-table-column prop="date" label="扣缴义务人识别号（购方）" minWidth="160" align="center">
            </el-table-column>
            <el-table-column prop="date" label="扣缴义务人名称" minWidth="100" align="center">
            </el-table-column>
            <el-table-column prop="date" label="填发日期" minWidth="100" align="center">
            </el-table-column>
            <el-table-column prop="date" label="开具日期" minWidth="120" align="center">
            </el-table-column>
            <el-table-column prop="date" label="计税金额" minWidth="120" align="center">
            </el-table-column>
            <el-table-column prop="date" label="实缴金额" minWidth="180" align="center">
            </el-table-column>
            <el-table-column prop="date" label="被扣缴纳税人识别号" minWidth="180" align="center">
            </el-table-column>
            <el-table-column prop="date" label="被扣缴纳税人名称" minWidth="120" :header-align="'center'" :align="'right'">
            </el-table-column>
            <el-table-column prop="date" label="入账状态" minWidth="120" :header-align="'center'" :align="'right'">
            </el-table-column>
            <el-table-column prop="date" label="收票状态" minWidth="120" :header-align="'center'" :align="'right'">
            </el-table-column>
            <el-table-column prop="date" label="收票日期" minWidth="180" align="center">
            </el-table-column>
            <el-table-column prop="date" label="转出状态" minWidth="180" align="center">
            </el-table-column>
            <el-table-column prop="date" label="财务备注" minWidth="180" align="center">
            </el-table-column>
            <el-table-column prop="date" label="归集日期" minWidth="180" align="center">
            </el-table-column>
            <el-table-column prop="date" label="创建时间" minWidth="180" align="center">
            </el-table-column>
            <el-table-column prop="date" label="修改时间" minWidth="180" align="center">
            </el-table-column>
          </el-table>
        </article>
        <article class="table_bottom_page">
            <article class="footer_text_main">
            金额总额<span class="footer_sum"> 224,181.03</span> 元 / 税额总额
            <span class="footer_sum"> 10,928.27 </span> 元 / 价税合计总额
            <span class="footer_sum"> 235,109.30 </span>元
            </article>
            <article>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-sizes="page.sizes"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
            </article>
        </article>
      </article>
    </el-card>
    <el-card shadow="never" class="bottom_crad">
      <article>
        <el-table
          ref="bottomTableRef"
          :data="tableData"
          :border="true"
          style="width: 100%; height: 350px; overflow: auto"
          @row-click="handleRowClick"
        >
          <el-table-column type="index" width="55" label="序号" align="center">
          </el-table-column>
          <el-table-column
            prop="date"
            label="项目名称"
            minWidth="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="规格型号"
            minWidth="140"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="单位"
            minWidth="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="数量"
            minWidth="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="单价"
            minWidth="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="金额"
            minWidth="140"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="增值税税率/征收率"
            minWidth="160"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="税额"
            minWidth="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="含税金额"
            minWidth="110"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="扣除额"
            minWidth="110"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="商品和服务税收分类合并编码"
            minWidth="180"
            align="center"
          >
          </el-table-column>
        </el-table>
      </article>
      <article>
        <el-pagination
          @size-change="handleBottomSizeChange"
          @current-change="handleBottomCurrentChange"
          :current-page="page_bottom.currentPage"
          :page-sizes="page_bottom.sizes"
          :page-size="page_bottom.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="bottom_total"
        >
        </el-pagination>
      </article>
    </el-card>
    <app-modify-status
      v-if="statusVisible"
      :visible.sync="statusVisible"
      width="50%"
      title="修改入账状态"
    ></app-modify-status>
    <app-common-upload
      v-if="uploadVisible"
      :visible.sync="uploadVisible"
      width="40%"
      title="上传文件"
    ></app-common-upload>
    <app-authentication-push
      v-if="pushVisible"
      :visible.sync="pushVisible"
      width="50%"
      title="认证凭证推送核算系统"
    ></app-authentication-push>
    </div>
</template>

<script>
import AppSearchForm from "../componetns/searchForm";
import AppModifyStatus from "../componetns/modifyStatus";
import AppCommonUpload from "../componetns/commonUpload";
import AppAuthenticationPush from "../componetns/authenticationPush";
export default {
  name: "poolPage",
  components: {
    AppSearchForm,
    AppModifyStatus,
    AppCommonUpload,
    AppAuthenticationPush,
  },
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      searchForm: {},
      isSelected: [],
      selectedRow: null,
      statusVisible: false,
      uploadVisible: false,
      pushVisible: false,
      total: 1000,
      page: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [15, 25, 50, 75, 100],
      },
      page_bottom: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [15, 25, 50, 75, 100],
      },
      bottom_total: 1000,
      activeName:'first',
    };
  },
  computed: {},
  watch: {},
  methods: {
    /* size change */
    handleSizeChange() {},
    /* Current change */
    handleCurrentChange() {},
    /* size change */
    handleBottomSizeChange(val) {
      this.page_bottom.pageSize = val;
    },
    /* Current change */
    handleBottomCurrentChange(val) {
      this.page_bottom.currentPage = val;
    },
    /* 推送 */
    handlePush() {
      this.pushVisible = true;
    },
    /* 上传事件 1 发票新增 2 入账信息导入 */
    handleUpload() {
      this.uploadVisible = true;
    },
    /* 修改入账状态 */
    handleEditeStatus() {
      this.statusVisible = true;
    },
    /* 表格样式 行 */
    rowClassName({ row, rowIndex }) {
      if (this.selectedRow === row) {
        return "highlight-row";
      }
      return "";
    },
    /*点击行事件 */
    handleRowClick(row) {
      this.selectedRow = row;
    },
    /* 勾选 */
    handleSelectionChange(e) {
      console.log(e, "2");
      this.isSelected = [...e];
    },
  },
  created() {},
  mounted() {},
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {
    this.$refs.bottomTableRef.doLayout();
  },
  beforeDestroy() {},
  destroyed() {},
  activated() {},
};
</script>
<style scoped lang="scss">
.footer_text_main{
  padding: 8px;
  font-size: 14px;
}
.footer_sum{
  color:#17B3A3;
  font-weight: bold;
}
.table_bottom_page{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.aui-wrapper .el-pagination{
    margin-top: 0;
}
</style>