<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <div class="custom-query-form">
      <el-form ref="searchForm" :model="form" :inline="true">
        <el-form-item label="所属总机构名称" prop="zjgsbh">
          <el-select v-model="form.zjgsbh" clearable filterable placeholder="请选择" @change="(val) => queryBranchOrg(val)">
            <el-option v-for="item in allOrgList" :key="item.id" :label="`${item.nsrmc} ${item.nsrsbh}`" :value="item.nsrsbh">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分支机构名称" prop="nsrsbh">
          <el-select v-model="form.nsrsbh" clearable filterable placeholder="请选择">
            <el-option v-for="item in queryBranchOrgList" :key="item.id" :label="item.label" :value="item.nsrsbh">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="税款所属期" prop="ssq">
          <QuarterDatePicker :key="`${form.ssq}_${pickerType}`" :pickerType="pickerType" :defaultValue="form.ssq" propsParam="ssq" @getQuarterPickerFrom="getQuarterPickerFrom" ref="quarterDatePicker" />
        </el-form-item>
      </el-form>
      <div class="search-btns">
        <el-button type="success" @click="search">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button v-show="showMore" :class="moreStatus == 'down' ? 'more' : 'more-down'" icon="el-icon-d-arrow-right" circle @click="handleMore"></el-button>
      </div>
    </div>
    <div class="top-tool">
      <div class="toolbar-left" />
      <div class="toolbar-right">
        <el-button @click="fetchPrepaidShare" type="primary" :disabled="querySbStatus" :loading="qsLoading">取数</el-button>
        <el-button @click="handleExport" :loading="exLoading">导出</el-button>
      </div>
    </div>

    <div class="custom-table">
      <el-table border :data="tableData" v-loading="loading" :height="height" :header-cell-style="{ fontWeight: 400, borderTop: '1px solid #adb4bc', background: '#f7f9fd', color: '#333333', padding: '7px 0' }">
        <el-table-column label="序号" type="index" min-width="50" />
        <el-table-column label="分支机构名称" prop="nsrmc" min-width="200" />
        <el-table-column label="分支机构纳税识别号" prop="nsrsbh" min-width="180" />
        <el-table-column label="所属总机构名称" prop="zjgmc" min-width="180" />
        <el-table-column label="税款所属期" prop="ssq" align="center" min-width="100">
          <template slot-scope="{row}">{{ formatAllDate(row.ssq, querySdstbzq) }} </template>
        </el-table-column>
        <el-table-column label="本期分摊比例" prop="ftbl" align='center' min-width="130" />
        <el-table-column label="本期分摊应补（退）所得税额" prop="ftybtse" align="right" min-width="170">
          <template slot-scope="{row}">{{ formatMoney(row.ftybtse) }}</template>
        </el-table-column>
        <el-table-column label="最后修改时间" prop="updatetime" align="center" min-width="100">
          <template slot-scope="{row}">{{ dateFormat('YYYY-mm-dd', row.updatetime) }} </template>
        </el-table-column>
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
import QuarterDatePicker from '@/components/QuarterDatePicker';
import { getCurrentSsq, dateFormat } from "@/utils/tool";
import { getList, queryAllOrg, queryBranchOrg, exportLedger, fetchPrepaidShare, queryStatus } from './Api.js'
export default {
  name: "BranchPrepaymentAllocationLedger",
  components: {
    QuarterDatePicker
  },
  data() {
    return {
      form: { nsrsbh: '' },
      showMore: false, //是否显示更多
      moreStatus: "down", //up /down
      param: {},
      tableData: [],
      querySbStatus: false, // 是否已经申报完成
      pickerType: '季',
      allOrgList: [],     // 所属总机构
      queryBranchOrgList: [],    // 分支机构
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        showQuickJumper: true,
        showTotal: (total) => `共${total}条`,
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      loading: false,
      exLoading: false,
      qsLoading: false,
    };
  },
  mounted() {
    this.queryAllOrg();
  },
  activated() {
    if (this.$route.query.nsrsbh) {
      this.initQueryParam()
    }
  },
  methods: {
    // 查询总机构
    async queryAllOrg() {
      const { code = '', data = [] } = await queryAllOrg({})
      if (code === '0') {
        this.allOrgList = data;
        if (!this.$route.query.nsrsbh) {
          const { nsrsbh = '', sdstbzq = '', id = '' } = data[0] || {}
          this.querySdstbzq = sdstbzq
          this.form.zjgsbh = nsrsbh
          this.queryBranchOrg(nsrsbh, 'init');
        }
      }
    },
    // 查询分支机构
    async queryBranchOrg(zjgsbh, type) {
      const { sdstbzq = '', id = '' } = this.allOrgList.find((item) => item.nsrsbh === zjgsbh) || {}
      const { code = '', data = [] } = await queryBranchOrg({ id })
      if (code === '0') {
        this.queryBranchOrgList = [{ value: '', label: '全部' }].concat(data.map((item) => {
          return {
            ...item,
            value: item.nsrsbh,
            label: `${item.nsrmc} ${item.nsrsbh}`
          }
        }));
        //  切换总机构
        if (type !== 'initQueryParam') {
          this.initDate();
          this.querySdstbzq = sdstbzq || '季'
        }
        // 初始化查询
        if (type == 'init' || type == 'initQueryParam') {
          this.handleSearch()
        }
        this.$set(this.form, 'nsrsbh', '')
      }
    },
    // 初始化属期时间
    initDate() {
      const { monthValue, quarterValue } = getCurrentSsq();
      const value = this.querySdstbzq == '月' ? monthValue : quarterValue
      this.form.ssq = value
      this.form.tbzq = this.querySdstbzq
      this.pickerType = this.querySdstbzq
    },
    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh, ssq, tbzq } = this.$route.query
      this.$set(this.form, 'zjgsbh', 'nsrsbh')
      this.form.tbzq = tbzq
      this.pickerType = tbzq
      this.form.ssq = ssq
      this.queryBranchOrg(nsrsbh, 'initQueryParam')
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
        this.queryStatus();
      } catch (error) {
        
      } finally {
        this.loading = false
      }
    },
    search() {
      this.pagination.pageNo = 1
      this.handleSearch();
    },
    resetForm() {
      this.form = {}
      this.$refs.searchForm.resetFields();
      // 重置子组件
      if (this.$refs.quarterDatePicker) {
        this.$refs.quarterDatePicker.reset();
      }
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
    // 查询申报状态
    async queryStatus() {
      // false 是当前还没有申报
      const { code = '', data } = await queryStatus({ ...this.form, sbsz: 'sds' })
      if (code === '0') {
        this.querySbStatus = data
      }
    },
    handleMore() {
      this.moreStatus = this.moreStatus === 'up' ? 'down' : 'up';
    },
    getQuarterPickerFrom(propsParam, data) {
      this.form[propsParam] = data
    },
    // 取数
    async fetchPrepaidShare() {
      try {
        this.qsLoading = true;
        const { code = '' } = await fetchPrepaidShare(this.form)
        if (code === '0') {
          this.$message.success('操作成功');
          this.handleSearch()
        }
      } catch (error) {
        
      } finally {
        this.qsLoading = false;
      }
      
    },
    // 导出
    async handleExport() {
      try {
        this.exLoading = true
        const fileName = `企业所得税分支机构预缴分摊台账.xlsx`
        await exportLedger({
          reqData: { ...this.form, pageNo: 1, pageSize: 99999 },
          fileName
        })
      } catch (error) {
        
      } finally {
        this.exLoading = false
      }
    },
    dateFormat,
  },
  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
    height() {
      return window.innerHeight - 280;
    },
    ssqReturnType() {
      return this.$refs.ledgerForm.zzstbzq
    }
  },

};
</script>
<style scoped lang="scss">
</style>

