<template>
  <div class="main-content">
    <form-list :columns="columns" :searchKey="propskey" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" @getSearchParam="getSearchParam" :firstLoading="false"
      @getNextList="getNextList" ref="list">
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button @click="dataInitialization" type="primary" :disabled="querySbStatus" :loading="qsLoading">取数</el-button>
            <el-button @click="handleExport" :loading="exLoading">导出</el-button>
          </div>
        </div>
      </template>
      <template #ssq="{ data }"> {{ formatAllDate(data.ssq, querySdstbzq) }} </template>
      <template #bqys="{ data }">{{ formatMoney(data.bqys) }}</template>
      <template #bqjz="{ data }">{{ formatMoney(data.bqjz) }}</template>
      <template #bnljys="{ data }">{{ formatMoney(data.bnljys) }}</template>
      <template #bnljjz="{ data }">{{ formatMoney(data.bnljjz) }}</template>
      <template #bqyjsf="{ data }">{{ formatMoney(data.bqyjsf) }}</template>
      <template #bqjzsf="{ data }">{{ formatMoney(data.bqjzsf) }}</template>
      <template #bnljyjsf="{ data }">{{ formatMoney(data.bnljyjsf) }}</template>
      <template #bqljjzsf="{ data }">{{ formatMoney(data.bqljjzsf) }}</template>
      <template #bnlj="{ data }">{{ formatMoney(data.bnlj) }}</template>
      <template #myscope="{ data }">
        <el-button @click="addLine(data, 'edit')" type="primary" v-if="data.sbzt != 'Y'">调整</el-button>
      </template>
    </form-list>
    <el-dialog title="调整本期预缴税费" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <el-form :inline="true" :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="本期预缴税费" prop="bqyjsf">
          <el-input v-model="editForm.bqyjsf" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备注" prop="bz">
          <el-input v-model="editForm.bz" maxlength="100" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="success" @click="saveData">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FormList from '@/components/FormList.vue';
import { getCurrentSsq } from "@/utils/tool";
import { getListByUser, exportLedger, dataInitialization, queryStatus, update } from './Api.js'

export default {
  name: 'SpecificTaxableIncomeLedger',
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
      querySdstbzq: '季',
      dialogVisible: false,
      editForm: {},
      rules: {
        bqyjsf: [{ pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字' }],
        bz: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      columns: [
        { title: '序号', type: "index", width: 50 },
        { title: "纳税主体名称", width: 180, dataIndex: "nsrmc", },
        // { title: "企业类型", width: 170, dataIndex: "qylx", slot: 'qylx' },
        { title: "总公司名称", width: 180, dataIndex: "zjgmc", },
        { title: "项目代码", width: 150, dataIndex: "xmbh" },
        { title: "项目名称", width: 150, dataIndex: "xmmc" },
        { title: "税款所属期", width: 100, dataIndex: "ssq", slot: 'ssq', align: 'center' },
        // { title: "预收价款期初数", width: 120, dataIndex: "ysjkqcs", slot: 'ysjkqcs', align: 'right' },
        { title: "本期预收账款增加金额", width: 150, dataIndex: "bqys", slot: 'bqys', align: 'right' },
        { title: "本期预收账款结转金额", width: 150, dataIndex: "bqjz", slot: 'bqjz', align: 'right' },
        { title: "本年预收账款累计增加金额", width: 170, dataIndex: "bnljys", slot: 'bnljys', align: 'right' },
        { title: "本年预收账款累计结转金额", width: 170, dataIndex: "bnljjz", slot: 'bnljjz', align: 'right' },
        // { title: "预收价款期末数", width: 120, dataIndex: "ysjkqms", slot: 'ysjkqms', align: 'right' },
        { title: "预计毛利率", width: 100, dataIndex: "yjmlv", slot: 'yjmlv', align: 'right' },
        // { title: "预缴期初数", width: 100, dataIndex: "qcs", slot: 'qcs', align: 'right' },
        { title: "本期预缴税费", width: 100, dataIndex: "bqyjsf", slot: 'bqyjsf', align: 'right' },
        { title: "本期结转税费", width: 100, dataIndex: "bqjzsf", slot: 'bqjzsf', align: 'right' },
        { title: "本年累计预缴税费", width: 140, dataIndex: "bnljyjsf", slot: 'bnljyjsf', align: 'right' },
        { title: "本期累计结转税费", width: 140, dataIndex: "bqljjzsf", slot: 'bqljjzsf', align: 'right' },
        // { title: "预缴期末数", width: 100, dataIndex: "qms", slot: 'qms', align: 'right' },
        { title: "本年累计特定业务应纳税所得额", width: 200, dataIndex: "bnlj", slot: 'bnlj', align: 'right', },
        { title: "备注", width: 100, dataIndex: "bz", },
        {
          title: "操作",
          key: "action",
          width: 80,
          fixed: 'right',
          scopedSlots: { customRender: "action" }
        }

      ],
      searchList: [
        {
          label: "纳税主体名称",
          key: "nsrsbh",
          val: "",
          type: "select",
          placeholder: '请选择',
          options: [],
        },
        {
          label: "税款所属期",
          key: "ssq",
          val: '',
          type: "quarterPicker",
          isInitDefault: true,
          placeholder: '请选择',
          pickerType: '季',
          format: 'yyyyMM',
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
      qsLoading: false,
      exLoading: false
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
    height() {
      return window.innerHeight - 340
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
          const { nsrsbh = '', sdstbzq = '' } = data[0] || {}
          this.querySdstbzq = sdstbzq;
          this.$set(this.param, 'nsrsbh', nsrsbh)
          this.initDate(nsrsbh)
          this.$refs.list.reload()
        }
      }
    },
    // 初始化属期时间
    initDate(nsrsbh) {
      const { monthValue, quarterValue } = getCurrentSsq();
      const ssq = this.$route.query.ssq || (this.querySdstbzq == '月' ? monthValue : quarterValue)
      this.$set(this.param, 'ssq', ssq )
      this.param.tbzq = this.querySdstbzq
      this.searchList[0].val = nsrsbh
      this.searchList[1].val = ssq
      this.searchList[1].pickerType = this.querySdstbzq || '季'
      this.propskey = `${nsrsbh}_${this.querySdstbzq}_${ssq}}`
    },
    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh, ssq, tbzq } = this.$route.query
      this.$set(this.param, 'nsrsbh', nsrsbh)
      this.$set(this.param, 'ssq', ssq )
      this.querySdstbzq = tbzq
      this.searchList[0].val = nsrsbh
      this.searchList[1].val = ssq
      this.searchList[1].pickerType = tbzq
      this.propsKey = `${nsrsbh}_${ssq}_${tbzq}`
      this.$refs.list.handleGetData(this.param)
    },
    getNextList(val, type) {
      const sdstbzq = this.taxBodyList.find((item) => item.nsrsbh === val)?.sdstbzq
      this.querySdstbzq = sdstbzq
      if (type !== 'reset' && val != 'all') {
        this.initDate(val)
      }
    },

    // 导出
    async handleExport() {
      try {
        this.exLoading = true;
        const fileName = `特定业务应纳税所得额台帐.xlsx`
        await exportLedger({
          reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999 },
          fileName
        })
      } catch (error) {
        
      } finally {
        this.exLoading = false;
      }
    },
    // 取数
    async dataInitialization() {
      try {
        this.qsLoading = true;
        const { code = '' } = await dataInitialization(this.queryParam)
        if (code === '0') {
          this.$message.success('操作成功');
          this.getList()
        }
      } catch (error) {
        
      } finally {
        this.qsLoading = false
      }
    },
    getList() {
      this.$refs.list && this.$refs.list.handleGetData(this.queryParam)
    },
    getSearchParam(param) {
      this.queryParam = param;
      this.queryStatus()
    },
    addLine(row) {//  新增\修改弹窗
      this.editForm = { ...row || {} }
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false;
      this.editForm = {}
    },
    saveData() {
      this.$refs["editForm"].validate(async valid => {
        if (!valid) return;
        const { code = '', } = await update({
          ...this.editForm,
        })
        if (code === '0') {
          this.$message.success('操作成功')
          this.handleClose()
          this.getList()
        }
      })
    },
    // 查询申报状态
    async queryStatus() {
      // false是当前还没有申报
      const { code = '', data } = await queryStatus({ ...this.queryParam, sbsz: 'sds' })
      if (code === '0') {
        this.querySbStatus = data
      }
    },
  }
};
</script>
<style scoped lang="scss">
/deep/ .el-dialog__body {

  .el-form-item {
    width: 100%;
    margin-bottom: 16px;

    .el-form-item__label {
      width: 220px;
    }

    .el-form-item__content {
      width: calc(100% - 320px);

      .el-input {
        width: 100%;
      }
    }

  }
}
</style>
