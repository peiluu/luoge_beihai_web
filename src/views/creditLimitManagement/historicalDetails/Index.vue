<template>
  <div>
    <div class="content-header">
      <el-tabs :key="activeName" class="custom-card-tabs" v-model="activeName" type="card">
        <el-tab-pane label="历史授信额度信息" name="credit" />
        <el-tab-pane label="历史票量赋码信息" name="encode" />
      </el-tabs>
    </div>

    <form-list :key="formKey" :searchKey="formKey" :columns="activeName == 'credit' ? creditColumns : encodeColumns" :searchRow="searchList" :api="activeName == 'credit' ? this.creditApi : this.encodeApi" :param="param"
      :height="height" v-loading="loading" ref="list">
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <!-- <div class="toolbar-right" @click="queryCredit">
            <i class="el-icon-refresh-right" :size="20" />同步最新数据
          </div> -->
        </div>
      </template>
      <template #sqlx="{ data }"> {{ data.sqlx == '0' ? '下载' : data.sqlx == '1' ? '退回' : '' }} </template>
      <template #skssq="{ data }"> {{ dateFormat('YYYY-MM', data.skssq) }} </template>
    </form-list>
  </div>
</template>

<script>
import moment from "moment";
import FormList from '@/components/FormList.vue';
import BackBtn from "@/components/BackBtn";
import { queryCredit, getListByUser } from './CreditApi.js'

export default {
  name: 'HistoricalDetails',
  components: { FormList, BackBtn },
  props: {
    detailInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      activeName: 'credit',
      creditApi: require('./CreditApi.js'),
      encodeApi: require('./EncodeApi.js'),
      param: {},
      formKey: '',
      loading: false,
      creditColumns: [
        { title: '序号', type: "index", width: 50, fixed: 'left', },
        { title: "主体名称", dataIndex: "nsrmc", width: 180 },
        { title: "纳税人识别号码", dataIndex: "nsrsbh", width: 180 },
        { title: "所属期限", dataIndex: "skssq", slot: 'skssq', width: 120, },
        { title: "调整额度", dataIndex: "bysxed", width: 120, },
        { title: "授信时间", dataIndex: "updatetime", width: 150, },
        { title: "授信有效时间起", dataIndex: "syqjq", width: 150, },
        { title: "授信有效时间止", dataIndex: "syqjz", width: 150, },
        // { title: "调整额度类型", dataIndex: "sqlx", width: 120, slot: 'sqlx' },
      ],
      encodeColumns: [
        { title: '序号', type: "index", width: 50, fixed: 'left', },
        { title: "主体名称", dataIndex: "nsrmc", width: 180 },
        { title: "纳税人识别号码", dataIndex: "nsrsbh", width: 180 },
        { title: "可用年度", dataIndex: "synd", slot: 'fppzDm', width: 120, },
        { title: "申请发票数量", dataIndex: "fpzs", width: 120, },
        { title: "已使用发票数量", dataIndex: "fpyysl", width: 120, },
        { title: "剩余发票数量", dataIndex: "fpsysl", width: 120, },
        { title: "发票起始号码", dataIndex: "fpqshm", width: 170, },
        { title: "发票终止号码", dataIndex: "fpzzhm", width: 170, },
        { title: "申请时间", dataIndex: "updateTime", width: 100, },
      ],
      searchList: [
        {
          label: "纳税主体",
          key: "nsrsbh",
          val: '',
          type: "select",
          placeholder: '请选择',
          options: [],
        },
        // {
        //   label: "纳税人识别号码",
        //   key: "nsrsbh",
        //   placeholder: '请输入',
        //   val: '',
        //   type: "input",
        //   options: [],
        // },
        {
          label: "所属期限",
          key: "skssq",
          val: '',
          type: "month",
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }
        },
      ],

    };
  },

  computed: {
    height() {
      return window.innerHeight - 420;
    },
  },


  mounted() {
    const { activeName = '', skssq = '', nsrsbh = '' } = this.detailInfo;
    this.activeName = activeName || this.activeName
    this.param.nsrsbh = nsrsbh;
    this.param.skssq = skssq;
    this.getListByUser()
  },

  watch: {
    activeName(val) {
      this.searchList.find((item) => item.key === 'skssq').hidden = val === 'encode'
      this.formKey = val;
      this.$nextTick(() => {
        this.$refs.list.reload()
      })
    },

  },

  methods: {

    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({})
      if (code === '0') {
        this.searchList[0].options = [{ value: '', label: '全部' }].concat(data.map((item) => {
          return {
            ...item,
            value: item.nsrsbh,
            label: item.nsrmc + " " + item.nsrsbh
          }
        }))
      }
    },

    /**
   * @description 同步最新数据
   */
    async queryCredit() {
      const nsrsbh = this.$refs.list.searchParam.nsrsbh || ''
      const { code = '', data = [] } = await queryCredit({ nsrsbh })
      if (code === '0') {
        this.$message.success('同步成功');
      }
    },
    dateFormat(fmt, val) {
      return moment(val).format(fmt)
    },
  }
};
</script>

<style lang="scss" scoped>
.toolbar-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;

  .el-icon-refresh-right {
    font-size: 18px;
    margin-right: 2px;
  }
}
</style>
