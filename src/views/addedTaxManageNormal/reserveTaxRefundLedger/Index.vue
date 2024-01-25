<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <form-list :columns="columns" :searchKey="propskey" :key="propskey" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" @getSearchParam="getSearchParam" :firstLoading="false"
       ref="list">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button @click="fetchDrawback" type="primary" :disabled="!queryParam.nsrsbh">取数</el-button>
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>
      <template #srssq="{ data }"> {{ dateFormat('YYYY-MM', data.srssq) }} </template>

      <template #qmldse="{ data }">{{ formatMoney(data.qmldse) }}</template>
      <template #clldse="{ data }">{{ formatMoney(data.clldse) }}</template>
      <template #zlldse="{ data }">{{ formatMoney(data.zlldse) }}</template>
      <template #jxsegcfzx="{ data }">{{ formatMoney(data.jxsegcfzx) }}</template>
      <template #jxsegcfmx="{ data }">{{ formatMoney(data.jxsegcfmx) }}</template>
      <template #ksqdclldts="{ data }">{{ formatMoney(data.ksqdclldts) }}</template>
      <template #ksqdzlldtse="{ data }">{{ formatMoney(data.ksqdzlldtse) }}</template>
      <template #ysqdclldtse="{ data }">{{ formatMoney(data.ysqdclldtse) }}</template>
      <template #ysqdzlldtse="{ data }">{{ formatMoney(data.ysqdzlldtse) }}</template>

      <template #myscope="{ data }">
        <el-button @click="addLine(data, 'edit')" type="primary" v-if="data.sbzt != 'Y'">维护已申请留抵退税</el-button>
      </template>

    </form-list>
    <el-dialog title="维护已申请留抵退税" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <el-form :inline="true" :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="税款所属期" prop="srssq">
          <el-date-picker value-format="yyyyMM" v-model="editForm.srssq" type="month" placeholder="请选择" />

          <!-- <QuarterDatePicker :key="`${sdstbzq}_${dialogVisible}`" :pickerType="sdstbzq" propsParam="srssq" disabled :defaultValue="editForm.srssq" @getQuarterPickerFrom="getQuarterPickerFrom"
            :preDateDisabled="preDateDisabled" :currentDateDisabled="true" :dateDisabled="true" ref="quarterDatePicker" /> -->
        </el-form-item>
        <el-form-item label="已申请的存量留抵退税" prop="ysqdclldtse">
          <el-input v-model="editForm.ysqdclldtse" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="已申请的增量留抵退税" prop="ysqdzlldtse">
          <el-input v-model="editForm.ysqdzlldtse" placeholder="请输入" />
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
import moment from "moment";
import QuarterDatePicker from '@/components/QuarterDatePicker.vue'
import { getListByUser, exportLedger, updateDrawback, queryStatus, fetchDrawback } from './Api.js'

export default {
  name: 'ReserveTaxRefundLedger',
  components: {
    FormList,
    QuarterDatePicker
  },
  data() {
    return {
      param: {},
      api: require('./Api'),
      loading: false,
      taxBodyList: [],
      queryParam: {},
      editForm: {},
      dialogVisible: false,
      propskey: '',
      // 所得税填报周期（季、月） - 编辑新增
      sdstbzq: '季',
      querySbStatus: false,
      preDateDisabled: false,
      currentDateDisabled: false,
      columns: [
        // { type: "selection", width: 50 },
        { title: '序号', type: "index", width: 50 },
        { title: "纳税主体名称", width: 150, dataIndex: "nsrmc", },
        { title: "税款所属期", width: 100, dataIndex: "srssq", slot: 'srssq', align: 'center' },
        // { title: "税款所属期止", width: 100, dataIndex: "srssqz", slot: 'srssqz', align: 'center' },
        { title: "期末留抵税额", width: 100, dataIndex: "qmldse", slot: 'qmldse', align: 'right' },
        { title: "存量留抵税额", width: 100, dataIndex: "clldse", slot: 'clldse', align: 'right' },
        { title: "增量留抵税额", width: 100, dataIndex: "zlldse", slot: 'zlldse', align: 'right' },
        { title: "进项构成比例分子项", width: 150, dataIndex: "jxsegcfzx", slot: 'jxsegcfzx', align: 'right' },
        { title: "进项构成比例分母项", width: 150, dataIndex: "jxsegcfmx", slot: 'jxsegcfmx', align: 'right' },
        { title: "进项构成比例", width: 100, dataIndex: "jxgcbl", slot: 'jxgcbl', },
        { title: "退还比例", width: 100, dataIndex: "thbl", slot: 'thbl', align: 'right' },
        { title: "可申请的存量留抵退税", width: 150, dataIndex: "ksqdclldts", slot: 'ksqdclldts', align: 'right' },
        { title: "可申请的增量留抵退税", width: 150, dataIndex: "ksqdzlldtse", slot: 'ksqdzlldtse', align: 'right' },
        { title: "已申请的存量留抵退税", width: 150, dataIndex: "ysqdclldtse", slot: 'ysqdclldtse', align: 'right' },
        { title: "已申请的增量留抵退税", width: 150, dataIndex: "ysqdzlldtse", slot: 'ysqdzlldtse', align: 'right' },
        { title: "备注", width: 100, dataIndex: "bz" },
        {
          title: "操作",
          key: "action",
          width: 170,
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
          key: "srssq",
          val: '',
          type: "monthrange",
          placeholder: '请选择',
        },
      ],
      rules: {
        bz: [{ required: true, message: "请输入", trigger: "blur" }],
        ysqdclldtse: [{ required: true, message: "请输入", trigger: "blur" }, { pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字' }],
        ysqdzlldtse: [{ required: true, message: "请输入", trigger: "blur" }, { pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字' }],
      },
    };
  },
  mounted() {
    this.getListByUser()
  },
  computed: {
    height() {
      return window.innerHeight - 290
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
        this.searchList[0].options = data.map((item) => {
          return {
            ...item,
            value: item.nsrsbh,
            label: `${item.nsrmc} ${item.nsrsbh}`
          }
        })
        const { nsrsbh = '' } = data[0] || {}
        this.param.nsrsbh = nsrsbh
        this.queryParam.nsrsbh = nsrsbh
        this.propskey = nsrsbh
        this.getList()

      }
    },
    async fetchDrawback() {
      const { code = '' } = await fetchDrawback({ nsrsbh: this.queryParam.nsrsbh })
      if (code === '0') {
        this.$message.success('操作成功')
        this.getList(this.queryParam)
      }
    },
    // 导出
    async handleExport() {
      const fileName = `留底退税台账.xlsx`
      await exportLedger({
        reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999 },
        fileName
      })
    },
    getList() {
      this.$refs.list && this.$refs.list.handleGetData(this.queryParam)
    },
    getSearchParam(param) {
      debugger;
      this.queryParam = param;
      // this.queryStatus()
    },
    dateFormat(fmt, val) {
      return moment(val).format(fmt)
    },

    addLine(row) {//  新增\修改弹窗
      this.editForm = { ...row || {} }
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false;
      this.editForm = {}
    },

    getQuarterPickerFrom(propsParam, data) {
      this.editForm[propsParam] = data
      // this.queryStatus()
    },

    // 查询申报状态
    async queryStatus(type) {
      let status = false
      // false是当前还没有申报
      const { monthValue, quarterValue } = getCurrentSsq();
      const ssq = this.sdstbzq == '月' ? monthValue : quarterValue
      const param = type == 'add' ? { nsrsbh: this.editForm.nsrsbh, ssq } : this.queryParam
      // false 是当前还没有申报
      const { code = '', data } = await queryStatus({ ...param, sbsz: 'sds' })
      if (code === '0') {
        status = data;
        if (type == 'add') {
          // false 是当前还没有申报，本期还是可以选的
          this.currentDateDisabled = data;
          this.preDateDisabled = !data;
          return;
        }
        this.querySbStatus = data
      }
      return status
    },


    async saveData() {
      this.$refs["editForm"].validate(async valid => {
        if (!valid) return;
        // if (!this.editForm.ssq) {
        //   this.$message.warning('请选择属期！');
        //   return;
        // }
        // if (await this.queryStatus()) {
        //   this.$message.warning('该属期已申报，无法变更数据')
        //   return;
        // }
        const { code = '', } = await updateDrawback([{ ...this.editForm }])
        if (code === '0') {
          this.$message.success('操作成功')
          this.handleClose()
          this.getList()
        }
      })
    },
  }
};
</script>

<style scoped lang="scss">
/deep/ .el-dialog__body {
  .el-form-item:nth-of-type(2) {
    .el-form-item__label::before {
      content: '*';
      color: red;
      margin-right: 4px;
    }
  }

  .el-form-item {
    width: 100%;
    margin-bottom: 16px;

    .el-form-item__label {
      width: 220px;
    }

    .el-form-item__content {
      width: calc(100% - 320px);

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
