<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <form-list :columns="columns" :searchKey="propskey" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" @getSearchParam="getSearchParam" :firstLoading="false" :rebulidForm="true"
      @getNextList="getNextList" :resetAll="true" ref="list">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button @click="addLine({}, 'add')" type="primary">新增</el-button>
            <!-- <el-button @click="handleExport">导出</el-button> -->
          </div>
        </div>
      </template>
      <template #ssq="{ data }"> {{ formatAllDate(data.ssq, querySdstbzq) }} </template>
      <template #bnzcyz="{ data }">{{ formatMoney(data.bnzcyz) }}</template>
      <template #zzzjtxje="{ data }">{{ formatMoney(data.zzzjtxje) }}</template>
      <template #ybgdzjtxje="{ data }">{{ formatMoney(data.ybgdzjtxje) }}</template>
      <template #jszjtxje="{ data }">{{ formatMoney(data.jszjtxje) }}</template>
      <template #nstjje="{ data }">{{ formatMoney(data.nstjje) }}</template>
      <template #jsyhje="{ data }">{{ formatMoney(data.jsyhje) }}</template>

      <template #myscope="{ data }">
        <el-popover placement="left" trigger="hover" popper-class="customPopper">
          <template>
            <!-- <el-button @click="addLine(data, 'detail')" type="primary">查看</el-button> -->
            <el-button @click="addLine(data, 'edit')" type="primary">编辑</el-button>
            <!-- <el-button @click="addLine(data, 'continued')" type="primary" v-if="judgeIsCurrent(data.ssq, data.tbzq || '季', 2)">续填</el-button> -->
            <el-button @click="handleDelete(data)" type="danger">删除</el-button>
          </template>
          <el-button slot="reference" v-if="data.sbzt != 'Y'">操作</el-button>
        </el-popover>
      </template>
    </form-list>
    <el-dialog :title="`${operateTypeText[operateType]}资产加速折旧、摊销台账`" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <el-form :inline="true" :model="editForm" ref="editForm" :rules="rules" :disabled="operateType == 'detail'">
        <el-form-item label="纳税主体名称" prop="nsrsbh">
          <el-select v-model="editForm.nsrsbh" filterable placeholder="请选择" :disabled="operateType !== 'add'" @change="(val) => getNextList(val, 'add')">
            <el-option v-for="item in taxBodyList" :key="item.id" :label="`${item.nsrmc} ${item.nsrsbh}`" :value="item.nsrsbh">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="税款所属期" prop="ssq" v-if="operateType == 'add'">
          <QuarterDatePicker :key="`${sdstbzq}_${dialogVisible}`" :pickerType="sdstbzq" propsParam="ssq" :disabled="!editForm.nsrsbh" :defaultValue="editForm.ssq" @getQuarterPickerFrom="getQuarterPickerFrom"
            ref="quarterDatePicker" :preDateDisabled="preDateDisabled" :currentDateDisabled="currentDateDisabled" />
        </el-form-item>
        <el-form-item label="项目名称" prop="kcfs">
          <el-select v-model="editForm.kcfs" filterable placeholder="请选择" :disabled="operateType == 'continued'">
            <el-option v-for="item in kcmxList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="优惠事项名称" prop="yhsx">
          <el-select v-model="editForm.yhsx" filterable placeholder="请选择" :disabled="operateType == 'continued' || !editForm.kcfs">
            <el-option v-for="item in finalYhsxmcList" :key="item.dm" :label="item.mc" :value="item.dm" />
          </el-select>
        </el-form-item>

        <el-form-item label="本年享受优惠的资产原值" prop="bnzcyz">
          <el-input v-model="editForm.bnzcyz" placeholder="请输入" :disabled="operateType == 'continued'" />
        </el-form-item>
        <el-form-item label="本年账载折旧\摊销金额" prop="zzzjtxje">
          <el-input v-model="editForm.zzzjtxje" placeholder="请输入" @change="handleChange" />
        </el-form-item>

        <el-form-item label="本年按照税收一般规定计算折旧\摊销金额" prop="ybgdzjtxje">
          <el-input v-model="editForm.ybgdzjtxje" placeholder="请输入" @change="handleChange" />
        </el-form-item>
        <el-form-item label="本年享受加速政策计算的折旧\摊销金额" prop="jszjtxje">
          <el-input v-model="editForm.jszjtxje" placeholder="请输入" @change="handleChange" />
        </el-form-item>

        <el-form-item label="本年纳税调减金额" prop="nstjje">
          <el-input v-model="editForm.nstjje" placeholder="请输入" disabled />
        </el-form-item>

        <el-form-item label="本年享受加速政策优惠金额" prop="jsyhje">
          <el-input v-model="editForm.jsyhje" placeholder="请输入" disabled />
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
import QuarterDatePicker from '@/components/QuarterDatePicker.vue'
import { getCurrentSsq } from "@/utils/tool";
import { limitMoneyMsg } from '@/config/constant'
import { kcmxList } from '../constant'

import { getListByUser, add, update, del, exportInvoiceDetailList, getDicSdsZcjszjtx, queryStatus } from './Api.js'
export default {
  name: 'AssetAcceleratedDepreciationLedger',
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
      operateType: '',
      // 所得税填报周期（季、月） - 编辑新增
      querySdstbzq: '季',
      sdstbzq: '季',
      operateTypeText: {
        'detail': '查看',
        'add': '新增',
        'edit': '编辑',
        'continued': '续填',
      },
      kcmxList,
      dialogVisible: false,
      propskey: '',
      yhsxmcList: [],
      querySbStatus: false,
      preDateDisabled: false,
      currentDateDisabled: false,
      columns: [
        { type: "selection", width: 50 },
        { title: '序号', type: "index", width: 50 },
        { title: "纳税主体名称", width: 150, dataIndex: "nsrmc", },
        { title: "总公司纳税名称", width: 150, dataIndex: "zjgmc", },
        { title: "税款所属期", width: 100, dataIndex: "ssq", slot: 'ssq', align: "center" },
        { title: "项目名称", width: 150, dataIndex: "kcxmmc" },
        { title: "优惠事项名称", width: 150, dataIndex: "yhsxmc", },
        { title: "本年享受优惠的资产原值", width: 160, dataIndex: "bnzcyz", slot: 'bnzcyz', align: 'right' },
        { title: "本年账载折旧\摊销金额", width: 160, dataIndex: "zzzjtxje", slot: 'zzzjtxje', align: 'right' },
        { title: "本年按照税收一般规定计算折旧\摊销金额", width: 250, dataIndex: "ybgdzjtxje", slot: 'ybgdzjtxje', align: 'right' },
        { title: "本年享受加速政策计算的折旧\摊销金额", width: 250, dataIndex: "jszjtxje", slot: 'jszjtxje', align: 'right' },
        { title: "本年纳税调减金额", width: 160, dataIndex: "nstjje", slot: 'nstjje', align: 'right' },
        { title: "本年享受加速政策优惠金额", width: 180, dataIndex: "jsyhje", slot: 'jsyhje', align: 'right' },
        { title: "备注", width: 100, dataIndex: "bz" },
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
          isQueryNext: true,
          nextPropskey: '',
          type: "select",
          placeholder: '请选择',
          options: [],
        },
        {
          label: "税款所属期",
          key: 'ssq',
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
        {
          label: "项目名称",
          key: "kcfs",
          val: "",
          type: "select",
          placeholder: '请选择',
          options: [{ label: '全部', value: '' }].concat(kcmxList)
        },
        {
          label: "优惠事项名称",
          key: "yhsx",
          val: "",
          type: "select",
          placeholder: '请选择',
          options: [],
        },
      ],
      rules: {
        nsrsbh: [{ required: true, message: "请选择", trigger: "blur" }],
        // ssq: [{ required: true, message: "请选择", trigger: "blur" }],
        kcfs: [{ required: true, message: "请选择", trigger: "blur" }],
        yhsx: [{ required: true, message: "请选择", trigger: "blur" }],
        bnzcyz: limitMoneyMsg,
        zzzjtxje: limitMoneyMsg,
        ybgdzjtxje: limitMoneyMsg,
        jszjtxje: limitMoneyMsg,
        bz: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getListByUser()
    this.getDicSdsZcjszjtx()
  },

  watch: {
    'editForm.yhsx'() {
      this.getRules()
    }
  },
  activated() {
    if (this.$route.query.nsrsbh) {
      this.initQueryParam()
    }
  },
  computed: {
    height() {
      return window.innerHeight - 290
    },
    contentHeight() {
      return window.innerHeight - 132;
    },
    finalYhsxmcList() {
      return this.yhsxmcList.filter((item) => item.xmdm === this.editForm.kcfs)
    },
  },

  methods: {
    // 获取优惠事项
    async getDicSdsZcjszjtx() {
      const { code = '', data = [] } = await getDicSdsZcjszjtx({})
      if (code === '0') {
        const index = this.searchList.findIndex((item) => item.key === 'yhsx');
        this.yhsxmcList = data;
        this.searchList[index].options = [{ label: '全部', value: '' }].concat(data.map((item) => {
          return {
            value: item.dm,
            label: item.mc
          }
        }))
      }
    },
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({})
      if (code === '0') {
        this.taxBodyList = data
        this.searchList[0].options = [{ label: '全部', value: 'all' }].concat(data.map((item) => {
          return {
            ...item,
            value: item.nsrsbh,
            label: `${item.nsrmc} ${item.nsrsbh}`
          }
        }))
        if (!this.$route.query.nsrsbh) {
          const { nsrsbh = '', sdstbzq = '' } = data[0] || {}
          this.querySdstbzq = sdstbzq
          this.param.nsrsbh = nsrsbh
          this.initDate(nsrsbh)
          this.$refs.list.reload()
        }
      }
    },
    // 初始化属期时间
    initDate(nsrsbh) {
      const { monthValue, quarterValue } = getCurrentSsq();
      const value = this.querySdstbzq == '月' ? monthValue : quarterValue
      this.param.ssq = value
      this.param.tbzq = this.querySdstbzq;
      this.searchList[0].val = nsrsbh
      this.searchList[1].val = value
      // 所得税默认按季
      this.searchList[1].pickerType = this.querySdstbzq || '季'
      this.propskey = `${nsrsbh}_${this.querySdstbzq}`
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


    // 导出
    async handleExport() {
      const fileName = `销项发票明细.xlsx`
      await exportInvoiceDetailList({
        reqData: { ...this.queryParam },
        fileName
      })
    },
    getList() {
      this.$refs.list && this.$refs.list.handleGetData(this.queryParam)
    },
    getSearchParam(param) {
      this.queryParam = param;
      this.queryStatus()
    },
    handleDelete(row) {
      this.$confirm(`您确定要删除吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code = '', data = [] } = await del(row.id)
        if (code === '0') {
          this.$message.success('刪除成功')
          this.getList()
        }
      }).catch(() => {
      });
    },
    addLine(row, type) {//  新增\修改弹窗
      this.editForm = { ...row || {} }
      this.dialogVisible = true
      this.operateType = type;
      this.getRules();
    },
    handleClose() {
      this.dialogVisible = false;
      this.editForm = {}
    },

    handleChange() {
      //  纳税调减金额 : 当（6列(jszjtxje)-4列(zzzjtxje)列）大于或等于0，填6列-4列；否则，为0
      const nstjje = parseFloat(this.editForm.jszjtxje) - parseFloat(this.editForm.zzzjtxje)
      this.editForm.nstjje = nstjje < 0 ? 0 : (nstjje || 0)
      //  享受加速政策优惠金额 : 当（6列(jszjtxje)-5（ybgdzjtxje）列）大于或等于0，填6列-5列；否则，为0
      const jsyhje = parseFloat(this.editForm.jszjtxje) - parseFloat(this.editForm.ybgdzjtxje);
      // 处理Nan
      this.editForm.jsyhje = jsyhje < 0 ? 0 : (jsyhje || 0)
      this.$forceUpdate()
    },

    getNextList(val, type) {
      const sdstbzq = this.taxBodyList.find((item) => item.nsrsbh === val)?.sdstbzq
      if (type === 'add') {
        this.queryStatus(type)
        this.sdstbzq = sdstbzq || '季'
        return
      }
      this.querySdstbzq = sdstbzq
      if (type !== 'reset' && val != 'all') {

        this.initDate(val)
      }

    },
    getQuarterPickerFrom(propsParam, data) {
      this.editForm[propsParam] = data
    },
    async saveData() {
      this.$refs["editForm"].validate(async valid => {
        if (!valid) return;
        if (!this.editForm.ssq) {
          this.$message.warning('请选择属期！');
          return;
        }
        if (await this.queryStatus()) {
          this.$message.warning('该属期已申报，无法变更数据')
          return;
        }

        if (parseFloat(this.editForm.jszjtxje) > parseFloat(this.editForm.bnzcyz)) {
          this.$message.warning('享受加速政策计算的折旧\摊销金额不能超过本年享受优惠的资产原值');
          return;
        }
        if (parseFloat(this.editForm.jszjtxje) > parseFloat(this.editForm.bnzcyz)) {
          this.$message.warning('享受加速政策计算的折旧\摊销金额不能超过本年享受优惠的资产原值');
          return;
        }
        const { monthValue, quarterValue } = getCurrentSsq();
        const ssq = this.querySdstbzq == '月' ? monthValue : quarterValue;
        const api = this.operateType == 'edit' ? update : add;
        const { code = '', } = await api({
          ...this.editForm,
          ssq: this.operateType == 'continued' ? ssq : this.editForm.ssq,
          kcxmmc: this.kcmxList.find((item) => item.value === this.editForm.kcfs).label,
          yhsxmc: this.yhsxmcList.find((item) => item.dm === this.editForm.yhsx).mc,
        })
        if (code === '0') {
          this.$message.success('操作成功')
          this.handleClose()
          this.getList()
        }
      })
    },
    verifyData(rule, value, callback) {
      console.log(value)
      let pattern = /^([-+])?\d+(\.[0-9]{1,2})?$/
      if (value < 0 || value > 5000000 || !pattern.test(value)) {
        callback('请输入不超过5,000,000的最多保留2位小数的数字');
      } else {
        callback()
      }
    },
    getRules() {
      // 限制金额输入5百万以下
      const isLimit = this.editForm.yhsx == 7
      const validMsg = [{ required: true, message: "请输入", trigger: "blur" }, { validator: this.verifyData, trigger: 'blur', }]
      this.rules.bnzcyz = isLimit ? validMsg : limitMoneyMsg
      this.rules.zzzjtxje = isLimit ? validMsg : limitMoneyMsg
      this.rules.ybgdzjtxje = isLimit ? validMsg : limitMoneyMsg
      this.rules.jszjtxje = isLimit ? validMsg : limitMoneyMsg
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
    judgeIsCurrent(date, type, preSsq) {
      const { quarterValue, monthValue } = getCurrentSsq('', preSsq || 1, preSsq || 1)
      return type == '月' ? monthValue == date : quarterValue == date
      // return true
    }

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
