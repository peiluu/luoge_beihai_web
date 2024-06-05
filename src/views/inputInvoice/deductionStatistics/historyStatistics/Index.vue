<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <!-- <BackBtn v-if="$route.query.nsrsbh" path="/deductionStatistics/list" :query="$route.query" :keepTab="true" /> -->

    <form-list :columns="columns" :searchKey="propsKey" :key="propsKey" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" :firstLoading="false" ref="list">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <!-- <div class="toolbar-right"><el-button @click="exportInvoiceCheckStatistics">导出查询结果</el-button></div> -->
        </div>
      </template>
      <template #hjyxdkse="{ data }"> {{ formatMoney(data.hjyxdkse) }} </template>

      <!-- 操作按钮 -->
      <template #myscope="row">
        <el-button @click="handleEntry(row.data, '/deductionStatistics/statisticsTable')">查看统计表</el-button>
        <el-button @click="handleEntry(row.data, '/deductionStatistics/statisticsDetails')">查看明细</el-button>
      </template>
      <template #jgzt>已确认</template>
    </form-list>
  </div>
</template>

<script>
import { fplxMap } from '@/config/constant'
import FormList from '@/components/FormList.vue';
// import BackBtn from "@/components/BackBtn";
import { jqztMap } from '../../constant'
import { getListByUser } from './Api'

export default {
  name: 'HistoryStatistics',
  components: {
    FormList,
    // BackBtn
  },
  data() {
    return {
      form: {},
      api: require('./Api'),
      param: {},
      jqztMap,
      fplxMap,
      loading: false,
      propsKey: '',
      columns: [
        // { type: "selection", width: 50, fixed: 'left', },
        { title: '序号', type: "index", width: 50 },
        { title: "纳税主体", width: 150, dataIndex: "gfmc", },
        { title: "税款所属期", width: 100, dataIndex: "skssq", },
        { title: "抵扣金额", width: 100, dataIndex: "hjyxdkse", align: 'right', slot: 'hjyxdkse' },
        { title: "抵扣张数", dataIndex: "hjfs", width: 100, align: 'right' },
        { title: "确认状态", dataIndex: "jgzt", slot: 'jgzt', width: 100, },
        {
          title: "操作",
          key: "action",
          width: 210,
          // fixed: 'right',
          scopedSlots: { customRender: "action" },
        },
      ],
      searchList: [
        {
          label: "纳税主体",
          key: "nsrsbh",
          val: '',
          type: "select",
          options: [],
          // disabled: true
        },
        {
          label: "税款所属期",
          key: "skssq",
          val: [],
          type: "monthrange",
          pickerOptions: {
            disabledDate(time) {
              let year = new Date().getFullYear()
              let month = new Date().getMonth()
              let days = new Date(year, month, 0).getDate()
              return time.getTime() > Date.now() - 24 * 60 * 60 * 1000 * `${days}`
            },
          }
        },
      ],
    };
  },
  activated() {
   
    //this.param.nsrsbh = this.$route.query.nsrsbh;
   this.$set(this.param,'nsrsbh',this.$route.query.nsrsbh)
   
    // this.param.isCurrent = 'false'
    this.getListByUser();
  },
  computed: {
    height() {
      return window.innerHeight - 290;
    },
    contentHeight() {
      return window.innerHeight - 132;
    },
  },

  methods: {
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({})
      if (code === '0') {
        this.searchList[0].options = data.map((item) => {
          return {
            ...item,
            value: item.nsrsbh,
            label: item.nsrmc + ' ' + item.nsrsbh
          }
        })
        this.param.nsrsbh = this.$route.query.nsrsbh || data[0]?.nsrsbh;
        this.propsKey = this.param.nsrsbh

        this.$nextTick(() => {
          this.$refs.list.reload()
          // this.propsKey = ''
        })
      }
    },
    // 查看详情
    handleEntry(row, path) {
      this.$router.push({
        path,
        query: {
          ...this.$route.query,
          // 直接从历史抵扣统计与明细进去 formHistoryStatistics, 返回的时候不需要带参数
          operateType: 'formHistoryStatistics',
          nsrsbh: row.gfsbh,
          nsrmc: row.gfmc,
          skssq: row.skssq,
          pclsh: row.pclsh,
        }
      })
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);

    },
  }
};
</script>

