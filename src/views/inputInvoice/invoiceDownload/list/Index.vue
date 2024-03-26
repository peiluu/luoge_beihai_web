<template>
  <div class="main-content">
    <div class="content-tab-header">
      <BackBtn path="/invoiceDownload/download" v-if="$route.query.recordId" align="left" />
      <el-tabs :key="sjlx" class="custom-card-tabs" v-model="sjlx" type="card">
        <el-tab-pane label="进项发票" name="1" />
        <el-tab-pane label="销项发票" name="2" />
      </el-tabs>
    </div>

    <form-list :key="formKey" :searchKey="formKey" :columns="columns" :searchRow="searchList" :api="sjlx == '1' ? this.InputApi : this.OutputApi" :param="param" :height="height" v-loading="loading" :firstLoading="false"
      ref="list">
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left">
            <!-- <el-input @keyup.enter.native="getList" @clear="getList" style="width: 400px;" v-model="param.keyword" placeholder="请输入发票代码/发票号码/销售方名称" clearable>
              <i slot="prefix" class="el-input__icon el-icon-search" @click="getList"></i>
            </el-input> -->
          </div>
          <div class="toolbar-right">
            <el-button v-if="!isDetail" type="success" @click="handleDownLoad">发票下载</el-button>
            <!-- <el-button>导出</el-button> -->
          </div>
        </div>
      </template>

      <template #myscope="row">
        <el-button @click="passOne(row.data)">通过</el-button>
        <el-button type="danger" @click="rejectOneDialog(row.data)">驳回</el-button>
      </template>

      <template #fppzDm="{ data }"> {{ fplxMap[data.fppzDm] }} </template>
      <template #kprq="{ data }">{{ dateFormat('YYYY-mm-dd', data.kprq) }} </template>

      <template #fpztbz="row">
        {{
          row.data.fpztbz == '0'
          ? '正数票'
          : row.data.fpztbz == '1'
            ? '负数票'
            : row.data.fpztbz == '2'
              ? '空白作废发票'
              : row.data.fpztbz == '3'
                ? '正数作废发票'
                : row.data.fpztbz == '4'
                  ? '负数作废发票' : ''
        }}
      </template>
      <template #hjje="{ data }">{{ formatMoney(data.hjje) }}</template>
      <template #hjse="{ data }">{{ formatMoney(data.hjse) }}</template>
      <template #jshj="{ data }">{{ formatMoney(data.jshj) }}</template>

    </form-list>
  </div>
</template>

<script>
import { inputFplxList, inputFplxMap } from '@/config/constant'
import FormList from '@/components/FormList.vue';
import BackBtn from "@/components/BackBtn";
import { dateFormat } from '@/utils/tool'


export default {
  name: 'InvoiceDownloadList',
  components: { FormList, BackBtn },
  data() {
    return {
      sjlx: '1',
      form: {},
      InputApi: require('./InputApi.js'),
      OutputApi: require('./OutputApi.js'),
      param: {},
      api: require('./InputApi'),
      formKey: '',
      loading: false,
      columns: [
        // { type: "selection", width: 50, fixed: 'left', },
        { title: '序号', type: "index", width: 50, fixed: 'left', },
        { title: "发票号码", dataIndex: "fphm", width: 150 },
        { title: "发票代码", dataIndex: "zzfpDm", width: 150 },
        { title: "发票种类", dataIndex: "fppzDm", slot: 'fppzDm', width: 150, },
        { title: "开票日期", dataIndex: "kprq", width: 120, slot: 'kprq', align: 'center' },
        { title: "购买方名称", dataIndex: "gmfmc", width: 180, },
        { title: "购买方识别号", dataIndex: "gmfnsrsbh", width: 180, },
        { title: "销售方名称", dataIndex: "xsfmc", width: 180, },
        { title: "销售方识别号", dataIndex: "xsfnsrsbh", width: 180, },
        { title: "金额", width: 100, dataIndex: "hjje", slot: 'hjje', align: 'right' },
        { title: "税额", width: 100, dataIndex: "hjse", slot: 'hjje', align: 'right' },
        { title: "价税合计", width: 100, dataIndex: "jshj", slot: 'jshj', align: 'right' },
        { title: "发票状态", width: 120, dataIndex: "fpztbz", slot: 'fpztbz',align: 'center'},
        { title: "发票备注", width: 200, dataIndex: "bz", },
        { title: "下载日期", width: 100, dataIndex: "downloadTime",align: 'center' },

      ],
      outputFplxList: [{ value: '81', label: '数电增值税专用发票' }, { value: '82', label: '数电增值税普通发票' }],
      outputFplxMap: { '81': '数电增值税专用发票', '82': '数电增值税普通发票' },
      searchList: [
        {
          label: "发票种类",
          key: "fppzDm",
          val: "",
          type: "select",
          placeholder: "请选择",
          options: []
        },
        {
          label: "发票代码",
          key: "fpdm",
          val: "",
          type: "input",
          placeholder: "请输入"
        },
        {
          label: "发票号码",
          key: "fphm",
          val: "",
          type: "input",
          placeholder: "请输入"
        },

        {
          label: "发票日期",
          key: "kprqList",
          val: [],
          type: "daterange",
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }
        },
        {
          label: "购买方名称",
          key: "gmfmc",
          val: "",
          type: "input",
          placeholder: "请输入"
        },
        {
          label: "购买方识别号",
          key: "gmfnsrsbh",
          val: "",
          type: "input",
          placeholder: "请输入"
        },
        {
          label: "销售方名称",
          key: "xsfmc",
          val: "",
          type: "input",
          placeholder: "请输入"
        },
        {
          label: "销售方识别号",
          key: "xsfnsrsbh",
          val: "",
          type: "input",
          placeholder: "请输入"
        },
      ],
    };
  },

  computed: {
    height() {
      return window.innerHeight - 370;
    },
    isDetail() {
      return this.$route.query.operateType === 'detail'
    },
    fplxMap() {
      return this.sjlx === '1' ? inputFplxMap : this.outputFplxMap
    }
  },

  activated() {
    const { sjlx = '1' } = this.$route.query;
    this.sjlx = sjlx;
    this.getList()
  },

  watch: {
    sjlx() {
      this.getList()
    },
  },

  methods: {
    dateFormat,
    getList() {
      const index = this.searchList.findIndex((item) => item.key === 'fppzDm');
      this.searchList[index].options = [{ value: '', label: '全部' }].concat(this.sjlx === '1' ? inputFplxList : this.outputFplxList)
      // 如果切换进项和销项，需要置空发票种类
      const fppzDm = this.sjlx == this.$route.query.sjlx ? this.$route.query.fppzDm : '';
      this.param = { ...this.$route.query, fppzDm }
      this.formKey = this.sjlx + '-' + fppzDm
      this.$nextTick(() => {
        this.$refs.list.reload()
      })
    },
    // 去下载发票
    handleDownLoad() {
      this.$router.push({
        path: '/invoiceDownload/download'
      })
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);

    },
    export() { },
  }
};
</script>

