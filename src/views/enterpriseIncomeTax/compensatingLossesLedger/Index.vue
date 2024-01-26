<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <form-list :columns="columns" :searchKey="propskey" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" @getSearchParam="getSearchParam" :firstLoading="false"
      @getNextList="getNextList" :rebulidForm="true" ref="list" >
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <!-- <el-button @click="dataInitialization" type="primary" :disabled="querySbStatus">取数</el-button> -->
            <!-- <el-button @click="handleExport">导出</el-button> -->
          </div>
        </div>
      </template>
      <template #first="{ data }">{{ formatMoney(data.first) }}</template>
      <template #second="{ data }">{{ formatMoney(data.second) }}</template>
      <template #third="{ data }">{{ formatMoney(data.third) }}</template>
      <template #fourth="{ data }">{{ formatMoney(data.fourth) }}</template>
      <template #fifth="{ data }">{{ formatMoney(data.fifth) }}</template>
      <template #sixth="{ data }">{{ formatMoney(data.sixth) }}</template>
      <template #seventh="{ data }">{{ formatMoney(data.seventh) }}</template>
      <template #eighth="{ data }">{{ formatMoney(data.eighth) }}</template>
      <template #ninth="{ data }">{{ formatMoney(data.ninth) }}</template>
      <template #tenth="{ data }">{{ formatMoney(data.tenth) }}</template>
      <template #myscope="{ data }">
        <el-button @click="addLine(data, 'edit')" type="primary" v-if="data.sfhsqj == 'Y'">调整</el-button>
      </template>
    </form-list>
    <el-dialog title="调整" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <el-form :inline="true" :model="editForm" ref="editForm" :rules="rules">
        <template v-for="(item, index) in editList">
          <el-form-item :label="item.label" :prop="item.propskey" :key="index">
            <el-input v-model="item.dnmbkse" placeholder="请输入" />
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="success" @click="saveData">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import FormList from '@/components/FormList.vue';
import { numberMap } from '@/config/constant'
import { getPreYearList } from "@/utils/tool";
import { queryLedgerSdsMbks, saveLedgerSdsMbks, getListByUser } from './Api.js'
export default {
  name: 'CompensatingLossesLedger',
  components: {
    FormList,
  },
  data() {
    return {
      param: {},
      api: require('./Api'),
      loading: false,
      queryParam: {},
      propskey: '',
      querySbStatus: false,
      // 所得税填报周期（季、月） - 查询
      dialogVisible: false,
      editList: [],
      editForm: {},
      rules: {
        bqyjsf: [{ pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字' }],
      },

      searchList: [
        {
          label: "纳税主体名称",
          key: "nsrsbh",
          val: "",
          type: "select",
          isQueryNext: true,
          nextPropskey: '',
          placeholder: '请选择',
          options: [],
        },
        {
          label: "所属年度",
          key: "ssnd",
          val: '',
          type: "year",
          placeholder: '请选择',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }
        },
        // {
        //   label: "企业类型",
        //   key: "qylx",
        //   val: "",
        //   type: "select",
        //   placeholder: '请选择',
        //   options: qylxList,
        // },
      ],

    };
  },
  mounted() {
    this.getListByUser();
  },
  activated() {
    if (this.$route.query.nsrsbh) {
      this.initQueryParam()
    }
  },
  computed: {
    columns() {
      let list = [
        { title: '序号', type: "index", width: 50 },
        { title: "纳税主体名称", width: 180, dataIndex: "nsrmc", },
      ]
      const year = this.queryParam.ssnd || moment().format('YYYY')
      getPreYearList(year, 10).forEach((item) => {
        list.push({
          width: 150,
          align: 'right',
          title: item.label,
          slot: item.propsKey,
          dataIndex: item.propsKey
        })
      })

      list.push({
        title: "操作",
        key: "action",
        width: 80,
        //   fixed: 'right',
        scopedSlots: { customRender: "action" }
      })
      return list
    },
    height() {
      return window.innerHeight - 260
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
        this.taxBodyList = data;
        this.searchList[0].options = [{ value: 'all', label: '全部' }].concat(data.map((item) => {
          return {
            ...item,
            value: item.nsrsbh,
            label: `${item.nsrmc} ${item.nsrsbh}`
          }
        }))
        if (!this.$route.query.nsrsbh) {
          const { nsrsbh = '' } = data[0] || {}
          this.param.nsrsbh = nsrsbh
          this.initDate(nsrsbh)
          this.$refs.list.reload()
        }
      }
    },
    // 初始化属期时间
    initDate(val) {
      const year = moment().format('YYYY')
      const skssqIndex = this.searchList.findIndex((item) => item.key === 'ssnd');
      this.param.ssnd = year
      this.searchList[skssqIndex].val = year
      this.propskey = `${val}_${year}`
    },
    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh, ssq, tbzq } = this.$route.query
      this.param.nsrsbh = nsrsbh
      this.param.ssq = ssq
      this.querySdstbzq = tbzq
      this.searchList[0].val = nsrsbh
      this.searchList[1].val = ssq
      this.searchList[1].pickerType = tbzq
      this.propsKey = `${nsrsbh}_${ssq}_${tbzq}`
      this.$refs.list.handleGetData(this.param)
    },

    getNextList(val, type) {
      if (type !== 'reset' && val != 'all') {
        this.initDate(val)
      }
    },

    // // 导出
    // async handleExport() {
    //   const fileName = `特定业务应纳税所得额台帐.xlsx`
    //   await exportLedger({
    //     reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999 },
    //     fileName
    //   })
    // },
    // // 取数
    // async dataInitialization() {
    //   const { code = '' } = await dataInitialization(this.queryParam)
    //   if (code === '0') {
    //     this.$message.success('操作成功');
    //     this.getList()
    //   }
    // },
    getList() {
      this.$refs.list && this.$refs.list.handleGetData(this.queryParam)
    },
    getSearchParam(param) {
      this.queryParam = param;
      // this.queryStatus()
      setTimeout(() => {
        this.propskey = `${param.nsrsbh}_${param.ssnd}`
      }, 1000)

    },
    addLine(row) {//  新增\修改弹窗
      this.queryLedgerSdsMbks(row);
      this.editForm = { ...row || {} }
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false;
      this.editForm = {}
    },
    async queryLedgerSdsMbks(row) {
      const { code = '', data = [] } = await queryLedgerSdsMbks(row)
      if (code === '0' && data.length > 0) {
        this.editList = data.map((item, index) => {
          return {
            ...item,
            label: `前${numberMap[data.length - index].label}年度(${item.mbksnd}年)`
          }
        }).reverse()
      }
    },
    saveData() {
      this.$refs["editForm"].validate(async valid => {
        if (!valid) return;
        // if (this.editList.find((item) => item.dnmbkse === '' || item.dnmbkse == null)) {
        //   this.$message.warning('请补全弥补亏损额');
        //   return
        // }

        if (this.editList.find((item) => item.dnmbkse && !/^([-+])?\d+(\.[0-9]{1,2})?$/.test(item.dnmbkse))) {
          this.$message.warning('请输入最多2位小数的弥补亏损额');
          return
        }
        const { code = '', } = await saveLedgerSdsMbks({ data: this.editList })
        if (code === '0') {
          this.$message.success('操作成功')
          this.handleClose()
          this.getList()
        }
      })
    },
    // // 查询申报状态
    // async queryStatus() {
    //   // false是当前还没有申报
    //   const { code = '', data } = await queryStatus({ ...this.queryParam, sbsz: 'sds' })
    //   if (code === '0') {
    //     this.querySbStatus = data
    //   }
    // },
  }
};
</script>
<style scoped lang="scss">
/deep/ .el-dialog__body {
  .el-form-item {
    width: calc(50% - 10px);
    margin-bottom: 16px;

    .el-form-item__label {
      width: 180px;
    }

    .el-form-item__content {
      width: calc(100% - 180px);
      .el-input {
        width: 100%;
      }
    }

  }
}
</style>
