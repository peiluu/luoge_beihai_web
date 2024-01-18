<template>
  <div>
    <form-list :columns="columns" :searchKey="propskey" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" @getSearchParam="getSearchParam" :firstLoading="false" :rebulidForm="true"
      @getNextList="getNextList" :resetAll="true" ref="list">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button @click="addLine" type="primary" v-if="!querySbStatus">新增</el-button>
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <template #ssq="{ data }"> {{ formatAllDate(data.ssq, querySdstbzq) }} </template>
      <template #zclx="{ data }"> {{ data.zclx == '1' ? '费用化' : '资本化' }} </template>
      <template #ryrgf="{ data }"> {{ formatMoney(data.ryrgf) }} </template>
      <template #zjtrfy="{ data }"> {{ formatMoney(data.zjtrfy) }} </template>
      <template #zjfy="{ data }"> {{ formatMoney(data.zjfy) }} </template>
      <template #wxzctxfy="{ data }"> {{ formatMoney(data.wxzctxfy) }} </template>
      <template #xcpsjf="{ data }"> {{ formatMoney(data.xcpsjf) }} </template>
      <template #qtfy="{ data }"> {{ formatMoney(data.qtfy) }} </template>
      <template #wtjnfy="{ data }"> {{ formatMoney(data.wtjnfy) }} </template>
      <template #wtjnfytz="{ data }"> {{ formatMoney(data.wtjnfytz) }} </template>
      <template #wtjwfy="{ data }"> {{ formatMoney(data.wtjwfy) }} </template>

      <template #myscope="{ data }">
        <el-popover placement="left" trigger="hover" popper-class="customPopper">
          <template>
            <el-button @click="addLine(data)" type="primary">编辑</el-button>
            <el-button @click="handleDelete(data)" type="danger">删除</el-button>
          </template>
          <el-button slot="reference" v-if="data.sbzt != 'Y'">操作</el-button>
        </el-popover>
      </template>
    </form-list>

    <el-dialog :title="`${this.editForm.id ? '编辑' : '新增'}研发费用加计扣除`" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
      <el-form :inline="true" :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="纳税主体名称" prop="nsrsbh">
          <el-select v-model="editForm.nsrsbh" filterable placeholder="请选择" @change="(val) => getNextList(val, 'add')">
            <el-option v-for="item in taxBodyList" :key="item.id" :label="`${item.nsrmc} ${item.nsrsbh}`" :value="item.nsrsbh">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="税款所属期" prop="ssq" v-if="!this.editForm.id">
          <QuarterDatePicker :key="`${sdstbzq}_${dialogVisible}`" :pickerType="sdstbzq" propsParam="ssq" :disabled="!editForm.nsrsbh" :defaultValue="editForm.ssq" @getQuarterPickerFrom="getQuarterPickerFrom"
            :preDateDisabled="preDateDisabled" :currentDateDisabled="currentDateDisabled" ref="quarterDatePicker" />
        </el-form-item>
        <!-- <el-form-item label="研发费用加计扣除类型" prop="lxmc">
          <el-select v-model="editForm.lxmc" filterable placeholder="请选择">
            <el-option v-for="item in xmlxList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="项目名称" prop="xmmc">
          <el-input v-model="editForm.xmmc" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="支出类型" prop="zclx">
          <el-select v-model="editForm.zclx" filterable placeholder="请选择">
            <el-option value="1" label="费用化" />
            <el-option value="2" label="资本化" />
          </el-select>
        </el-form-item>

        <div class="section-title">自主研发信息</div>
        <el-form-item label="本年人员人工费" prop="ryrgf">
          <el-input v-model="editForm.ryrgf" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="本年直接投入费用" prop="zjtrfy">
          <el-input v-model="editForm.zjtrfy" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="本年折旧费用" prop="zjfy">
          <el-input v-model="editForm.zjfy" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="本年无形资产摊销费用" prop="wxzctxfy">
          <el-input v-model="editForm.wxzctxfy" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="本年新产品设计费" prop="xcpsjf">
          <el-input v-model="editForm.xcpsjf" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="本年其他相关费用" prop="qtfy">
          <el-input v-model="editForm.qtfy" placeholder="请输入" />
        </el-form-item>
        <!-- <el-form-item label="经限额调整后的其他相关费用" prop="nstjje">
          <el-input v-model="editForm.nstjje" placeholder="请输入" disabled />
        </el-form-item>
        <el-form-item label="合计" prop="nstjje">
          <el-input v-model="editForm.nstjje" placeholder="请输入" disabled />
        </el-form-item> -->

        <div class="section-title">委托研发信息</div>

        <el-form-item label="本年委托境内机构或个人进行研发活动所发生的费用" prop="wtjnfy">
          <el-input v-model="editForm.wtjnfy" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="本年委托境外机构进行研发活动发生的费用" prop="wtjwfy">
          <el-input v-model="editForm.wtjwfy" placeholder="请输入" />
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
import { xmlxList } from '../constant'
import { getListByUser, exportLedger, add, update, queryStatus, del } from './DetailApi.js'

export default {
  name: 'DevelopExpensePlusDeductionLedgerDetail',
  components: {
    FormList,
    QuarterDatePicker
  },
  data() {
    return {
      param: {},
      activeName: '1',
      api: require('./DetailApi'),
      loading: false,
      taxBodyList: [],
      queryParam: {},
      editForm: {},
      // 所得税填报周期（季、月） - 编辑新增
      querySdstbzq: '季',
      sdstbzq: '季',
      dialogVisible: false,
      propskey: '',
      querySbStatus: false,
      preDateDisabled: false,
      currentDateDisabled: false,
      xmlxList: xmlxList.filter((item) => item.kclx == 'Y'),
      columns: [
        { type: "selection", width: 50 },
        { title: '序号', type: "index", width: 50 },
        { title: "纳税主体名称", width: 180, dataIndex: "nsrmc", },
        { title: "总公司纳税名称", width: 180, dataIndex: "zjgmc", },
        { title: "项目名称", width: 130, dataIndex: "xmmc" },
        { title: "支出类型", width: 100, dataIndex: "zclx", slot: 'zclx', align: 'center' },
        { title: "税款所属期", width: 100, dataIndex: "ssq", slot: 'ssq', align: "center" },
        { title: "自主研发-人员人工费(本年累计金额)", width: 180, dataIndex: "ryrgf", slot: 'ryrgf', align: 'right' },
        { title: "自主研发-直接投入费用(本年累计金额)", width: 180, dataIndex: "zjtrfy", slot: 'zjtrfy', align: 'right' },
        { title: "自主研发-折旧费用(本年累计金额)", width: 180, dataIndex: "zjfy", slot: 'zjfy', align: 'right' },
        { title: "自主研发-无形资产摊销费用(本年累计金额)", width: 180, dataIndex: "wxzctxfy", slot: 'wxzctxfy', align: 'right' },
        { title: "自主研发-新产品设计费(本年累计金额)", width: 180, dataIndex: "xcpsjf", slot: 'xcpsjf', align: 'right' },
        { title: "自主研发-其他相关费用(本年累计金额)", width: 180, dataIndex: "qtfy", slot: 'qtfy', align: 'right' },
        { title: "本年委托境内机构或个人进行研发活动所发生的费用", width: 180, dataIndex: "wtjnfy", slot: 'wtjnfy', align: 'right' },
        { title: "本年委托境内机构或个人进行研发活动所发生的费用允许加计扣除的金额", width: 240, dataIndex: "wtjnfytz", slot: 'wtjnfytz', align: 'right' },
        { title: "本年委托境外机构进行研发活动发生的费用", width: 200, dataIndex: "wtjwfy", slot: 'wtjwfy', align: 'right' },
        { title: "备注", width: 150, dataIndex: "bz" },
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
          isQueryNext: true,
          nextPropskey: ''
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

        {
          label: "支出类型",
          key: "zclx",
          val: "",
          type: "select",
          placeholder: '请选择',
          options: [{ value: '', label: '全部' }, { value: 1, label: '费用化' }, { value: 2, label: '资本化' }],
        },
        {
          label: "项目名称",
          key: "xmmc",
          val: "",
          type: "input",
          placeholder: '请输入',
        },
      ],
      rules: {
        nsrsbh: [{ required: true, message: "请选择", trigger: "blur" }],
        // ssq: [{ required: true, message: "请选择", trigger: "blur" }],
        zclx: [{ required: true, message: "请选择", trigger: "blur" }],
        lxmc: [{ required: true, message: "请选择", trigger: "blur" }],
        xmmc: [{ required: true, message: "请输入", trigger: "blur" }],
        bz: [{ required: true, message: "请输入", trigger: "blur" }],
        ryrgf: limitMoneyMsg,
        zjtrfy: limitMoneyMsg,
        zjfy: limitMoneyMsg,
        wxzctxfy: limitMoneyMsg,
        xcpsjf: limitMoneyMsg,
        qtfy: limitMoneyMsg,
        wtjnfy: limitMoneyMsg,
        // wtjnfytz: limitMoneyMsg,
        wtjwfy: limitMoneyMsg,
      },
    };
  },
  mounted() {
    this.getListByUser()
  },
  activated() {
    if (this.$route.query.nsrsbh) {
      this.initQueryParam()
    }
  },
  computed: {
    height() {
      return window.innerHeight - 310
    },
  },

  methods: {
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({});
      if (code === '0') {
        this.searchList[0].options = [{ label: '全部', value: 'all' }].concat(data.map((item) => {
          return {
            ...item,
            value: item.nsrsbh,
            label: `${item.nsrmc} ${item.nsrsbh}`
          }
        }))
        this.taxBodyList = data;
        if (!this.$route.query.nsrsbh) {
          const { nsrsbh = '', sdstbzq = '' } = data[0] || {};
          this.querySdstbzq = sdstbzq;
          this.param.nsrsbh = nsrsbh;
          this.initDate(nsrsbh);
          this.$refs.list.reload();
        }

      }
    },
    // 初始化属期时间
    initDate(nsrsbh) {
      const { monthValue, quarterValue } = getCurrentSsq();
      const value = this.querySdstbzq == '月' ? monthValue : quarterValue
      this.param.ssq = value
      this.param.tbzq = this.querySdstbzq
      this.searchList[0].val = nsrsbh
      this.searchList[1].val = value
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
      const fileName = `研发费用明细.xlsx`
      await exportLedger({
        reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999 },
        fileName
      })
    },
    getList() {
      this.$refs.list && this.$refs.list.handleGetData(this.queryParam)
    },
    getSearchParam(param) {
      this.queryParam = param;
      this.queryStatus();
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
    addLine(row) {//  新增\修改弹窗
      this.editForm = { ...row || {} }
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false;
      this.editForm = {}
      // this.$refs.quarterDatePicker.reset()
    },
    getNextList(val, type) {
      const sdstbzq = this.taxBodyList.find((item) => item.nsrsbh === val)?.sdstbzq
      if (type === 'add') {
        this.sdstbzq = sdstbzq || '季'
        this.queryStatus(type)
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
    // 查询申报状态
    async queryStatus(type) {
      let status = false;
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
        if (!this.editForm.ssq) {
          this.$message.warning('请选择属期！');
          return;
        }
        if (await this.queryStatus()) {
          this.$message.warning('该属期已申报，无法变更数据')
          return;
        }
        // const { monthValue, quarterValue } = getCurrentSsq();

        const api = this.editForm.id ? update : add;
        const { code = '', } = await api({
          ...this.editForm,
          wtjnfytz: parseFloat(this.editForm.wtjnfy) * 0.8,
          kclx: 'Y',
          nsrmc: this.taxBodyList.find((item) => item.nsrsbh === this.editForm.nsrsbh).nsrmc,
        })
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
  padding: 20px 20px 0;

  .section-title {
    padding: 4px 4px 4px 8px;
    margin: 0 10px 8px 0;
    font-weight: bold;
    opacity: 0.8;
    background: rgba(242, 242, 242, 0.662745098039216);
  }

  .el-form-item {
    width: calc(50% - 10px);
    margin-bottom: 16px;

    .el-form-item__label {
      width: 240px;

      &::before {
        content: '*';
        color: red;
        margin-right: 4px;
      }
    }

    .el-form-item__content {
      width: calc(100% - 240px);

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
