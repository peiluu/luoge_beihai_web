<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <BackBtn path="/invoiceDownload/list" />
    <div class="main-content-box">
      <div class="content-left">
        <div class="left-header">
          <div class="header-line">
            <el-input @keyup.enter.native="getListByUser" @clear="getListByUser" v-model="form.nsrmc" style="width: 280px; marginRight: 12px" placeholder="请输入税号或公司名称进行搜索" clearable>
              <i slot="prefix" class="el-input__icon el-icon-search" @click="getListByUser"></i>
            </el-input>
            <el-button type="success" @click="batchInvoiceDownload">发票下载</el-button>
          </div>
          <div class="header-line">
            <div class="label">时间范围</div>
            <el-date-picker v-model="dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 290px" :picker-options="{
              disabledDate(time) { return time.getTime() > Date.now(); }
            }" />
          </div>
        </div>
        <div class="custom-table">
          <el-table row-key="id" ref="table" :data="tableData" :height="height" border stripe @row-click="rowClcik" :header-cell-style="{
            fontWeight: 400,
            borderTop: '1px solid #adb4bc',
            background: '#f7f9fd',
            color: '#333333',
            padding: '7px 0'
          }" tooltip-effect="dark" v-loading="loading">
            <el-table-column label="选择" width="40" type="selection" />
            <el-table-column label="纳税主体信息">
              <template slot-scope="scope">
                <div>主体名称：{{ scope.row.nsrmc }}</div>
                <div>识别号：{{ scope.row.nsrsbh }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="content-right">
        <form-list :key="activeName" :columns="columns" :searchRow="searchList" :api="api" :param="param" :height="height - 36" v-loading="loading" :notSearchContract="true" ref="list">
          <!-- 操作按钮 -->
          <template #myscope="{ data }">
            <el-button v-if="data.status == '2'" @click.stop="queryDetail(data)">查看</el-button>
          </template>
          <template #status="{ data }"> {{ data.status == '2' ? '处理成功' : data.status == '3' ? '处理失败' : data.status == '1' ? '处理中' : '' }} </template>
          <template #fplx="{ data }"> {{ inputFplxMap[data.fplx] }} </template>
          <template #timeRange="{ data }"> {{ data.kprqq }} - {{ data.kprqz }} </template>
        </form-list>
      </div>

    </div>

  </div>
</template>

<script>
import { inputFplxMap } from '@/config/constant'
import FormList from '@/components/FormList.vue';
import BackBtn from "@/components/BackBtn";
import { getListByUser, batchInvoiceDownload } from './Api'

export default {
  name: 'InvoiceDownload',
  components: {
    FormList, BackBtn
  },
  data() {
    return {
      tableData: [],
      activeName: '1',
      form: {},
      api: require('./Api'),
      param: {},
      loading: false,
      inputFplxMap,
      dateRange: '',
      columns: [
        { title: '序号', type: "index", width: 50 },
        { title: "纳税主体名称", dataIndex: "nsrmc", width: 180, },
        { title: "纳税主体识别号", dataIndex: "nsrsbh", width: 180, },
        { title: "发票种类", dataIndex: "fplx", width: 150, slot: 'fplx' },
        { title: "下载开始时间", dataIndex: "createrTime", width: 150, align: 'center' },
        { title: "下载结束时间", dataIndex: "updateTime", width: 150, align: 'center' },
        { title: "进项发票张数", width: 100, dataIndex: "incomeNumber", align: 'right' },
        { title: "销项发票张数", width: 100, dataIndex: "outputNumber", align: 'right' },
        { title: "总张数", dataIndex: "total", width: 100, align: 'right' },
        { title: "同步台账状态", width: 100, dataIndex: "ledgerStatus", slot: 'ledgerStatus' },
        { title: "任务状态", width: 100, dataIndex: "status", slot: "status", align: 'center' },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          width: 90,
          scopedSlots: { customRender: "action" }
        }
      ],
      searchList: [
        {
          label: "纳税主体",
          key: "nsrsbh",
          type: "select",
          val: '',
          options: [],
        },
        // {
        //   label: "纳税主体识别号",
        //   key: "nsrsbh",
        //   type: "input",
        //   placeholder: "请输入"
        // },
        {
          label: "同步台账状态",
          key: "ledgerStatus",
          val: '',
          type: "select",
          options: [
            { value: "", label: "全部" },
            { value: "1", label: "处理中" },
            { value: "2", label: "处理成功" },
            { value: "3", label: "处理失败" }
          ]
        },
        {
          label: "任务状态",
          key: "status",
          val: '',
          type: "select",
          options: [
            { value: "", label: "全部" },
            { value: "1", label: "处理中" },
            { value: "2", label: "处理成功" },
            { value: "3", label: "处理失败" }
          ]
        },
      ],
    };
  },

  computed: {
    height() {
      return window.innerHeight - 250;
    },
    contentHeight() {
      return window.innerHeight - 132;
    },
  },
  activated() {
    this.getListByUser()
  },

  methods: {

    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({ ...this.form, isDigital: 'Y' })
      if (code === '0') {
        this.tableData = data
        this.searchList[0].options = [{ value: "", label: "全部" }].concat(data.map((item) => {
          return {
            ...item,
            value: item.nsrsbh,
            label: item.nsrmc + ' ' + item.nsrsbh
          }
        }))
      }
    },
    /**
     * @deprecated 批量发票下载申请
     */
    async batchInvoiceDownload() {
      const selections = this.$refs.table.selection;
      if (selections == 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      if (!this.dateRange[0]) {
        this.$message.warning('请选择下载时间范围！')
        return
      }
      const { code = '' } = await batchInvoiceDownload({
        list: selections.map((item) => {
          return {
            nsrsbh: item.nsrsbh,
            nsrmc: item.nsrmc,
            kprqq: this.dateRange[0],
            kprqz: this.dateRange[1],
          }
        })
      })
      if (code === '0') {
        this.$message.success('下载成功');
        this.$refs.list.reload();
      }
    },

    rowClcik(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 查询详情
    queryDetail(data) {
      this.$router.push({
        path: '/invoiceDownload/historyDetail',
        query: {
          recordId: data.id,
          fppzDm: data.fplx,
          sjlx: data.sjlx,
          nsrsbh: data.nsrsbh,
          operateType: 'detail'
        },
      })
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
    },
    export() { },
  }
};
</script>

<style lang="scss" scoped>
.main-content-box {
  display: flex;
  justify-content: space-between;

  .content-left {
    margin-right: 8px;
    width: 350px;
    flex-basis: 30%;

    .header-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #606266;
      margin-bottom: 8px;
    }

    .label {
      flex: 1;
    }
  }

  .content-right {
    width: calc(100% - 362px);

    /deep/ .form-list {
      padding: 0;

      .el-form-item {
        width: calc(50% - 10px)
      }
    }
  }
}
</style>
