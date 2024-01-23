<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <form-list :columns="columns" :searchKey="propsKey" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" @getSearchParam="getSearchParam" @getNextList="getNextList"
      :firstLoading="false" ref="list">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button @click="addLine({})" type="primary">新增</el-button>
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>
      <template #je="{ data }">{{ formatMoney(data.je) }}</template>
      <template #se="{ data }">{{ formatMoney(data.se) }}</template>
      <template #jshj="{ data }">{{ formatMoney(data.jshj) }}</template>
      <template #slv="{ data }">{{ data.sl == 0 ? '免税' : data.slv }}</template>

      <template #srssq="{ data }"> {{ dateFormat('YYYY-MM', data.srssq) }} </template>
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

    <el-dialog :title="`${editForm.id ? '编辑' : '新增'}视同销售事项`" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
      <el-form :inline="true" :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="纳税主体名称" prop="nsrsbh">
          <el-select v-model="editForm.nsrsbh" filterable placeholder="请选择" @change="(val) => getUpdteOrgList(val)">
            <el-option v-for="item in taxBodyList" :key="item.id" :label="`${item.nsrmc} ${item.nsrsbh}`" :value="item.nsrsbh">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会计主体名称" prop="orgid">
          <el-select v-model="editForm.orgid" filterable :disabled="!editForm.nsrsbh" placeholder="请选择">
            <el-option v-for="item in orgIdList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="税款所属期" prop="srssq" v-if="!this.editForm.id">
          <QuarterDatePicker :key="`${zzstbzq}_${dialogVisible}`" :pickerType="zzstbzq" propsParam="srssq" :disabled="!editForm.nsrsbh" :defaultValue="editForm.srssq" @getQuarterPickerFrom="getQuarterPickerFrom"
            ref="quarterDatePicker" />
        </el-form-item>

        <el-form-item label="计税项目分类" prop="jsxm" v-if="this.editForm.nsrlx != 2">
          <!-- <el-select v-model="editForm.jsfs" filterable placeholder="请选择">
            <el-option label="一般项目" value="1" />
            <el-option label="即征即退项目" value="2" />
          </el-select> -->
          <el-select v-model="editForm.jsxm" filterable placeholder="请选择">
            <el-option v-for="item in jsxm_stxs" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易日期" prop="jyrq">
          <el-date-picker v-model="editForm.jyrq" type="date" placeholder="请选择" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交易类型" prop="jylx">
          <el-select v-model="editForm.jylx" filterable placeholder="请选择" @change="setZsxm">
            <el-option v-for="item in jylxList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="征税项目" prop="zsxm">
          <el-select v-model="editForm.zsxm" filterable placeholder="请选择" disabled>
            <el-option v-for="item in zsxm_stxs" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摘要" prop="stxssm">
          <el-input v-model="editForm.stxssm" placeholder="请输入" maxlength="50" />
        </el-form-item>

        <el-form-item label="不含税销售额 " prop="je">
          <el-input v-model="editForm.je" placeholder=" 请输入" class="money je" @input="setTaxAmountByAmount" />
        </el-form-item>
        <el-form-item label="税率" prop="sl">
          <el-select v-model="editForm.sl" filterable placeholder="请选择" @change="setTaxAmountByRate">
            <el-option v-for="item in fianlSlvList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="税额" prop="se">
          <el-input v-model="editForm.se" placeholder="请输入" disabled />
        </el-form-item>
        <el-form-item label="价税合计" prop="jshj">
          <el-input v-model="editForm.jshj" placeholder="请输入" disabled />
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
import moment from "moment";
import { getssqArr } from "@/utils/tool";

import QuarterDatePicker from '@/components/QuarterDatePicker.vue'
import { zsxm_stxs, slvList, slvListSmall, jylxList, jsxm_stxs } from '../constant';
import { getListByUser, exportDeemedSalesInfo, getOrgList, saveOrUpdateSalesInfo, deleteSalesInfo, queryStatus } from './Api.js'

export default {
  name: 'DeemedSalesRevenueDetails',
  components: {
    FormList,
    QuarterDatePicker
  },
  data() {
    return {
      param: {},
      api: require('./Api'),
      loading: false,
      propsKey: '',
      columns: [
        { type: "selection", width: 50 },
        { title: '序号', type: "index", width: 50 },
        { title: "纳税主体名称", width: 170, dataIndex: "nsrmc", },
        { title: "会计主体名称", width: 170, dataIndex: "orgName", },
        { title: "交易类型", width: 150, dataIndex: "jylxMc", },
        { title: "交易日期", width: 100, dataIndex: "jyrq", slot: 'jyrq', align: 'center' },
        { title: "不含税销售额", width: 100, dataIndex: "je", slot: 'je', align: 'right' },
        { title: "税率", width: 80, dataIndex: "slv", align: 'center', slot: 'slv' },
        { title: "税额", width: 100, dataIndex: "se", slot: 'se', align: 'right' },
        { title: "税款所属期", width: 100, dataIndex: "srssq", slot: 'srssq', align: 'center' },
        { title: "价税合计", width: 100, dataIndex: "jshj", slot: 'jshj', align: 'right' },
        { title: "征税项目", width: 100, dataIndex: "zsxmMc" },
        { title: "计税项目", width: 100, dataIndex: "jsxmMc", align: 'center' },
        { title: "摘要", width: 150, dataIndex: "stxssm", showTooltip: true },
        {
          title: "操作",
          key: "action",
          width: 80,
          fixed: 'right',
          scopedSlots: { customRender: "action" }
        }
      ],
      searchList: [
        { label: "纳税主体名称", key: "nsrsbh", val: '', type: "select", placeholder: '请选择', options: [], isQueryNext: true, nextPropskey: 'orgid' },
        { label: "会计主体名称", key: "orgid", val: "", type: "select", placeholder: '请选择' },
        { label: "税款所属期", key: "srssq", val: "", type: "monthrange", placeholder: '请选择' },
        { label: "计税项目", key: "jsxm", val: "", type: "select", placeholder: '请选择', options: [{ value: '', label: '全部' }].concat(jsxm_stxs) },
        {
          label: "交易日期", key: "jyrq", val: "", type: "daterange", placeholder: '请选择', pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }
        },
        {
          label: "不含税销售额",
          key: "xssr",
          val: [],
          type: "numberRange",
          options: [],
          placeholder: ['最小金额', '最大金额']
        },
      ],

      rules: {
        nsrsbh: [{ required: true, message: "请选择纳税主体", trigger: "blur" }],
        orgid: [{ required: true, message: "请选择会计主体", trigger: "blur" }],
        jsxm: [{ required: true, message: "请选择计税项目", trigger: "blur" }],
        jyrq: [{ required: true, message: "请选择交易日期", trigger: "blur" }],
        jylx: [{ required: true, message: "请选择交易类型", trigger: "blur" }],
        je: [{ required: true, message: "请输入不含税销售额", trigger: "blur" }],
        sl: [{ required: true, message: "请选择税率", trigger: "blur" }],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      editForm: {},
      dialogVisible: false,
      taxBodyList: [],
      orgIdList: [],
      zsxm_stxs,
      slvList,
      slvListSmall,
      jylxList,
      jsxm_stxs,
      queryParam: {},
      zzstbzq: '月',
    };
  },
  activated() {
    if (this.$route.query.nsrsbh) {
      this.initQueryParam()
    }
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
    // 小规模纳税人和一般纳税人需要区分税率
    fianlSlvList() {
      return this.editForm.nsrlx == 2 ? this.slvListSmall : this.slvList
    },
  },
  methods: {
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({})
      if (code === '0') {
        this.taxBodyList = data;
        this.searchList[0].options = [{ value: "", label: "全部" }].concat(data.map((item) => {
          return {
            ...item,
            value: item.nsrsbh,
            label: `${item.nsrmc} ${item.nsrsbh}`
          }
        }))
        if (!this.$route.query.nsrsbh) {
          // 直接访问
          this.getOrgList('')
          this.getList()
        }
      }
    },
    // 获取会计主体
    async getOrgList(nsrsbh) {
      const { code = '', data = [] } = await getOrgList({ nsrsbh, isInvoice: 'N' })
      if (code === '0') {
        // 查询
        this.searchList[1].options = [{ value: "", label: "全部" }].concat(data.map((item) => {
          return {
            ...item,
            value: item.id,
            label: item.name + ' ' + item.code
          }
        }))
        this.searchList[1].val = '';
        this.param.orgid = ''
        this.$set(this.param, 'nsrsbh', nsrsbh)
        const { ssq, tbzq } = this.$route.query
        this.propsKey = `${nsrsbh}_${ssq}_${tbzq}`
      }
    },

    async getUpdteOrgList(nsrsbh, type) {
      const { zzstbzq } = this.taxBodyList.find((item) => item.nsrsbh === nsrsbh) || {}
      const { code = '', data = [] } = await getOrgList({ nsrsbh, isInvoice: 'N' })
      if (code === '0') {
        this.orgIdList = data;
        this.zzstbzq = zzstbzq || '月'
        if (type !== 'init') {
          this.editForm = { ...this.editForm, orgid: '' }
        }
      }
    },
    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh, ssq, tbzq } = this.$route.query
      this.$set(this.param, 'nsrsbh', nsrsbh)
      this.$set(this.param, 'srssq', getssqArr(ssq, tbzq))
      this.searchList[0].val = nsrsbh
      this.searchList[2].val = getssqArr(ssq, tbzq)
      this.$refs.list.handleGetData(this.param)
      this.getOrgList(nsrsbh, 'Y')
    },
    addLine(row) {//  新增\修改弹窗
      if (row.id) {
        this.getUpdteOrgList(row.nsrsbh, 'init' )
      }
      this.editForm = row || {}
      this.dialogVisible = true
    },

    // 导出
    async handleExport() {
      const fileName = `视同销售收入明细列表.xlsx`
      await exportDeemedSalesInfo({
        reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999, isInvoice: 'N' },
        fileName
      })
    },
    getList() {
      this.$refs.list && this.$refs.list.reload()
    },
    handleClose() {
      this.dialogVisible = false;
      this.form = {}
    },
    setZsxm() {//  选择交易类型，修改对应申报表征税项目
      const jylx = this.editForm.jylx;
      if (1 <= jylx <= 8) this.editForm.zsxm = '1'; // 货物
      if (jylx > 8) this.editForm.zsxm = '3'; // 服务不动产和无形资产

    },
    setTaxAmountByRate() {// 选择税率计算税额
      if (this.editForm.je) {
        this.editForm.se = (this.editForm.je * this.editForm.sl).toFixed(2);
        this.editForm.jshj = parseFloat(parseFloat(this.editForm.se) + parseFloat(this.editForm.je)).toFixed(2);
      } else {
        this.editForm.se = 0;
        this.editForm.jshj = 0;
      }
    },
    setTaxAmountByAmount() {// 输入金额计算税额
      if (this.editForm.sl) {
        this.editForm.se = (this.editForm.je * this.editForm.sl).toFixed(2);
        if (this.editForm.je) {
          this.editForm.jshj = parseFloat(parseFloat(this.editForm.se) + parseFloat(this.editForm.je)).toFixed(2);
        } else {
          this.editForm.se = 0;
          this.editForm.jshj = 0;
        }
      }
    },
    getSearchParam(param) {
      this.queryParam = param;
    },

    async saveData() {
      this.$refs["editForm"].validate(async valid => {
        if (!valid) return;
        if (!this.editForm.srssq) {
          this.$message.warning('请选择属期！');
          return;
        }

        if (await this.queryStatus('update')) {
          this.$message.warning('该属期已申报，无法变更数据')
          return;
        }
        const { code = '', } = await saveOrUpdateSalesInfo({
          ...this.editForm
        })
        if (code === '0') {
          this.$message.success('操作成功')
          this.handleClose()
          this.getList()
        }
      })
    },
    getNextList(val) {
      this.getOrgList(val);
      const { zzstbzq, nsrlx = '' } = this.taxBodyList.find((item) => item.nsrsbh === val) || {}
      this.editForm.nsrlx = nsrlx
    },

    getQuarterPickerFrom(propsParam, data) {
      this.editForm[propsParam] = data
    },
    // // 查询申报状态
    async queryStatus() {
      // let status = false;
      // false是当前还没有申报
      const { code = '', data } = await queryStatus({ ...this.editForm, ssq: this.editForm.srssq, sbsz: 'zzs' })
      if (code === '0') {
        return data
      }

    },
    handleDelete(data) {
      this.$refs.list.deleteData(data);
    },
    dateFormat(fmt, val) {
      return moment(val).format(fmt)
    },
  }
};
</script>
<style scoped lang="scss">
/deep/ .el-dialog__body {
  .el-form-item:nth-of-type(3) {
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

