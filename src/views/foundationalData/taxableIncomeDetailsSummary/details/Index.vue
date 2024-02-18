<template>
  <div class="main-content" >
    <div>
      <vxe-button icon="el-icon-back" size="mini" @click="handleBack">返回</vxe-button>
    </div>
    <div class="custom-query-form">
      <el-form ref="searchForm" :model="form" :inline="true">
        <el-form-item label="纳税主体名称" prop="nsrsbh">
          <el-select v-model="form.nsrsbh" clearable filterable placeholder="请选择" @change="(val) => getOrgList(val)">
            <el-option v-for="item in taxBodyList" :key="item.id" :label="item.label" :value="item.nsrsbh">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会计主体名称" prop="orgid">
          <el-select v-model="form.orgid" clearable filterable placeholder="请选择">
            <el-option v-for="item in orgList" :key="item.id" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="税款所属期" prop="srssq">
          <el-date-picker v-model="form.srssq" clearable type="monthrange" value-format="yyyy-MM" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <template v-if="moreStatus == 'up'">
          <el-form-item label="征税项目" prop="zsxm">
            <el-select v-model="form.zsxm" clearable filterable placeholder="请选择">
              <el-option v-for="item in zsxmList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </template>

      </el-form>
      <div class="search-btns">
        <el-button type="success" @click="search" :loading="loading" >查询</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button v-show="showMore" :class="moreStatus == 'down' ? 'more' : 'more-down'" icon="el-icon-d-arrow-right" circle @click="handleMore"></el-button>
      </div>
    </div>
    <div class="top-tool">
      <div class="toolbar-left" />
      <div class="toolbar-right">
        <el-button @click="fetchDetail" type="primary" :disabled="!form.nsrsbh">取数</el-button>
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <div class="custom-table" v-loading="loading" >
      <el-table border :data="tableData" :header-cell-style="{ fontWeight: 400, borderTop: '1px solid #adb4bc', background: '#f7f9fd', color: '#333333', padding: '7px 0' }">
        <el-table-column label="序号" type="index" min-width="50" />
        <!-- <el-table-column label="纳税主体名称" prop="name" min-width="250" /> -->
        <el-table-column show-overflow-tooltip label="会计主体名称" prop="orgName" min-width="210" />
        <el-table-column label="税款所属期" prop="srssq" align="center" min-width="100">
          <template slot-scope="{row}">{{ dateFormat('YYYY-MM', row.srssq) }} </template>
        </el-table-column>
        <el-table-column label="科目编码" prop="kmbm" min-width="120" />
        <el-table-column show-overflow-tooltip label="科目名称" prop="kmmc" min-width="150" />
        <el-table-column label="科目类型" prop="kmlxMc" min-width="120" />
        <el-table-column label="本期贷方发生额" prop="bqdffse" align="right" min-width="110">
          <template slot-scope="{row}">{{ formatMoney(row.bqdffse) }}</template>
        </el-table-column>
        <el-table-column label="本期借方发生额" prop="bqjffse" align="right" min-width="110">
          <template slot-scope="{row}">{{ formatMoney(row.bqjffse) }}</template>
        </el-table-column>
        <!-- 小规模没有即征即退 -->
        <el-table-column v-if="this.nsrlx != 2" label="其中：即征即退项目收入金额" prop="jzjtje" align="right" min-width="190">
          <template slot-scope="{row}">{{ formatMoney(row.jzjtje) }}</template>
        </el-table-column>
        <el-table-column label="征税项目" prop="zsxmMc" min-width="100" />
        <el-table-column label="税率" prop="slv" min-width="100" align="center" />
        <el-table-column label="计税方式" prop="jsfsMc" min-width="100" align="center" />
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageNo" :page-sizes="[10, 20, 30, 40, 50, 100, 500, 1000]" :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { dateFormat } from "@/utils/tool";
import { zsxmList } from '../../constant';
import { getList, getListByUser, getOrgList, exportIncomeDetailList, fetchDetail } from './Api.js'
export default {
  name: "TaxableIncomeDetails",
  data() {
    return {
      form: { nsrsbh: '' },
      showMore: true, //是否显示更多
      moreStatus: "down", //up /down
      tableData: [],
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        showQuickJumper: true,
        showTotal: (total) => `共${total}条`,
      },
      zsxmList: [{ value: '', label: '全部' }].concat(zsxmList),
      nsrlx: 1,
      taxBodyList: [],
      orgList: [],
      loading: false,
    };
  },
  mounted() {
    this.getListByUser();
  },
  activated() {
    if (this.$route.query.nsrsbh) {
      this.initQueryParam()
    } else {
      this.form = {}
      this.handleSearch()
    }
  },
  methods: {
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({})
      if (code === '0') {
        this.taxBodyList = [{ value: '', label: '全部' }].concat(data.map((item) => {
          return {
            ...item,
            value: item.nsrsbh,
            label: `${item.nsrmc} ${item.nsrsbh}`
          }
        }));
        // 携带参数进入
        if (!this.$route.query.nsrsbh) {
          // 直接访问
          this.getOrgList('')
          this.handleSearch()
        }
      }
    },
    // 获取会计主体
    async getOrgList(nsrsbh) {
      const { zzstbzq = '', nsrlx = '' } = this.taxBodyList.find((item) => item.nsrsbh === nsrsbh) || {}
      this.nsrlx = nsrlx;
      this.form.tbzq = zzstbzq
      this.$set(this.form, 'orgid', '')
      const { code = '', data = [] } = await getOrgList({ nsrsbh, isInvoice: 'N' })
      if (code === '0') {
        this.orgList = [{ value: "", label: "全部" }].concat(data.map((item) => {
          return {
            ...item,
            value: item.id,
            label: item.name + ' ' + item.code
          }
        }))
      }
    },
    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh, id } = this.$route.query
      this.form.nsrsbh = nsrsbh;
      this.form.hzId = id
      this.getOrgList(nsrsbh)
      this.handleSearch()
    },
    async handleSearch() {
      try {
        this.loading = true;
        const res = await getList({
          ...this.form,
          pageNo: this.pagination.pageNo || 1,
          pageSize: this.pagination.pageSize || 10
        })
        this.pagination = {
          ...res,
          total: res.totalCount || 0,
          pageNo: res.pageNo || 1,
          pageSize: res.pageSize || 10
        }
        this.tableData = res.data || [];
      } catch (error) {
        
      } finally {
        this.loading = false
      }
      
    },
    // 取数
    async fetchDetail() {
      const { code = '' } = await fetchDetail(this.form)
      if (code === '0') {
        this.$message.success('操作成功');
        this.handleSearch()
      }
    },
    // 导出
    async handleExport() {
      const fileName = `应税收入明细.xlsx`;
      await exportIncomeDetailList({
        reqData: { ...this.form, pageNo: 1, pageSize: 99999 },
        fileName
      })
    },
    search() {
      this.pagination.pageNo = 1
      this.handleSearch();
    },
    resetForm() {
      this.form = {}
      this.$refs.searchForm.resetFields();
      this.handleSearch()
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.pagination.pageNo = 1;
      this.$nextTick(() => {
        this.handleSearch();
      });
    },
    handleCurrentChange(pageNo) {
      this.pagination.pageNo = pageNo;
      this.$nextTick(() => {
        this.handleSearch();
      });
    },

    handleMore() {
      this.moreStatus = this.moreStatus === 'up' ? 'down' : 'up';
    },

    dateFormat(fmt, val) {
      return moment(val).format(fmt)
    },
    handleBack() {
      this.$router.push({
        path: "/foundationalData/taxableIncomeDetailsSummary/Index"
      })
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
    },
  },
  computed: {
    // contentHeight() {
    //   return window.innerHeight - 132;
    // },
    // height() {
    //   return window.innerHeight - 320;
    // },
    ssqReturnType() {
      return this.$refs.ledgerForm.zzstbzq
    }
  },

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

