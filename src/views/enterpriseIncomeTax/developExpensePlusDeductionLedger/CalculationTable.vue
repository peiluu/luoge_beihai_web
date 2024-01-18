<template>
  <div>
    <form-list :columns="columns" :searchKey="propskey" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" @getSearchParam="getSearchParam" :firstLoading="false" :rebulidForm="true"
      @getNextList="getNextList" :resetAll="true" ref="list">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button @click="addLine({}, 'add')" type="primary">新增</el-button>
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>
      <template #ssq="{ data }"> {{ formatAllDate(data.ssq, querySdstbzq) }} </template>
      <template #zjyfbnlje="{ data }"> {{ formatMoney(data.zjyfbnlje) }} </template>
      <template #wtyfbnljje="{ data }"> {{ formatMoney(data.wtyfbnljje) }} </template>
      <template #ndyffy="{ data }"> {{ formatMoney(data.ndyffy) }} </template>
      <template #fyhje="{ data }"> {{ formatMoney(data.fyhje) }} </template>
      <template #zbhje="{ data }"> {{ formatMoney(data.zbhje) }} </template>
      <template #bnxcwxzctx="{ data }"> {{ formatMoney(data.bnxcwxzctx) }} </template>
      <template #yqndxcwxzctx="{ data }"> {{ formatMoney(data.yqndxcwxzctx) }} </template>
      <template #yxkcyffyhj="{ data }"> {{ formatMoney(data.yxkcyffyhj) }} </template>
      <template #tssrbf="{ data }"> {{ formatMoney(data.tssrbf) }} </template>
      <template #yxkcdjtssrhje="{ data }"> {{ formatMoney(data.yxkcdjtssrhje) }} </template>
      <template #clbfjz="{ data }"> {{ formatMoney(data.clbfjz) }} </template>
      <template #clbf="{ data }"> {{ formatMoney(data.clbf) }} </template>
      <template #bnyffyjjkcze="{ data }"> {{ formatMoney(data.bnyffyjjkcze) }} </template>
      <template #xsjzkjje="{ data }"> {{ formatMoney(data.xsjzkjje) }} </template>
      <template #lxmc="{ data }"> {{ xmlxMap[data.lxmc] }} </template>
      <template #jjkcbl="{ data }"> {{ data.jjkcbl * 100 + '%' }} </template>
      <template #myscope="{ data }">
        <el-popover placement="left" trigger="hover" popper-class="customPopper">
          <template>
            <el-button @click="addLine(data, 'edit')" type="primary" v-if="data.sbzt != 'Y'">维护</el-button>
            <el-button @click="addLine(data, 'detail')" type="primary">查看</el-button>
            <el-button v-if="data.kclx === 'N' && data.sbzt != 'Y'" @click="handleDelete(data)" type="danger">删除</el-button>
          </template>
          <el-button slot="reference">操作</el-button>
        </el-popover>
      </template>
    </form-list>

    <el-dialog :title="`${operateTypeText}`" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
      <el-form :inline="true" :model="editForm" ref="editForm" :rules="rules" :disabled="operateType === 'detail'">
        <el-form-item label="纳税主体名称" prop="nsrsbh">
          <el-select v-model="editForm.nsrsbh" filterable placeholder="请选择" @change="(val) => getNextList(val, 'add')" :disabled="operateType != 'add'">
            <el-option v-for="item in taxBodyList" :key="item.id" :label="`${item.nsrmc} ${item.nsrsbh}`" :value="item.nsrsbh">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="税款所属期" prop="ssq" v-if="operateType == 'add'">
          <QuarterDatePicker :key="`${sdstbzq}_${dialogVisible}`" :pickerType="sdstbzq" propsParam="ssq" :defaultValue="editForm.ssq" @getQuarterPickerFrom="getQuarterPickerFrom" ref="quarterDatePicker"
            :disabled="operateType != 'add' || !editForm.nsrsbh" :preDateDisabled="preDateDisabled" :currentDateDisabled="currentDateDisabled" />
        </el-form-item>
        <el-form-item label="研发费用加计扣除类型" prop="lxmc">
          <el-select v-model="editForm.lxmc" filterable placeholder="请选择">
            <el-option v-for="item in finalXmlxList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <template v-if="operateType === 'add' || this.editForm.kclx == 'N'">
          <el-form-item label="本年研发费用加计扣除总额" prop="bnyffyjjkcze">
            <el-input v-model="editForm.bnyffyjjkcze" placeholder="请输入" />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="加计扣除比例(%)" prop="jjkcbl">
            <el-input v-model="editForm.jjkcbl" placeholder="请输入0-100 百分比" @change="handleChange" />
          </el-form-item>

          <el-form-item label="自主研发本年累计金额" prop="zjyfbnlje">
            <el-input v-model="editForm.zjyfbnlje" placeholder="请输入" disabled />
          </el-form-item>

          <el-form-item label="委托研发本年累计金额" prop="wtyfbnljje">
            <el-input v-model="editForm.wtyfbnljje" placeholder="请输入" disabled />
          </el-form-item>
          <div>
            <el-form-item label="年度研发费用" prop="ndyffy">
              <el-input v-model="editForm.ndyffy" placeholder="请输入" disabled />
            </el-form-item>
          </div>

          <el-form-item label="年度研发费用-费用化合计金额" prop="fyhje">
            <el-input v-model="editForm.fyhje" placeholder="请输入" disabled />
          </el-form-item>
          <el-form-item label="年度研发费用-资本化合计金额" prop="zbhje">
            <el-input v-model="editForm.zbhje" placeholder="请输入" disabled />
          </el-form-item>
          <el-form-item label="本年形成无形资产摊销" prop="bnxcwxzctx">
            <el-input v-model="editForm.bnxcwxzctx" placeholder="请输入" @change="handleChange" />
          </el-form-item>
          <el-form-item label="以前年度形成无形资产摊销" prop="yqndxcwxzctx">
            <el-input v-model="editForm.yqndxcwxzctx" placeholder="请输入" @change="handleChange" />
          </el-form-item>
          <el-form-item label="允许扣除的研发费用合计" prop="yxkcyffyhj">
            <el-input v-model="editForm.yxkcyffyhj" placeholder="请输入" disabled />
          </el-form-item>
          <el-form-item label="特殊收入部分" prop="tssrbf">
            <el-input v-model="editForm.tssrbf" placeholder="请输入" @change="handleChange" />
          </el-form-item>
          <div>
            <el-form-item label="允许扣除的研发费用抵减特殊收入后的金额" prop="yxkcdjtssrhje">
              <el-input v-model="editForm.yxkcdjtssrhje" placeholder="请输入" disabled />
            </el-form-item>
          </div>
          <el-form-item label="当年销售研发活动直接形成产品对应的材料部分" prop="clbf">
            <el-input v-model="editForm.clbf" placeholder="请输入" @change="handleChange" />
          </el-form-item>
          <el-form-item label="以前年度销售研发产品对应的材料部分结转金额" prop="clbfjz">
            <el-input v-model="editForm.clbfjz" placeholder="请输入" @change="handleChange" />
          </el-form-item>
          <el-form-item label="本年研发费用加计扣除总额" prop="bnyffyjjkcze">
            <el-input v-model="editForm.bnyffyjjkcze" placeholder="请输入" disabled />
          </el-form-item>
          <el-form-item label="销售研发产品（包括组成部分）对应材料部分结转以后年度扣减金额" prop="xsjzkjje">
            <el-input v-model="editForm.xsjzkjje" placeholder="请输入" disabled />
          </el-form-item>
          <el-form-item label="备注" prop="bz">
            <el-input v-model="editForm.bz" placeholder="请输入" />
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="success" @click="saveData" v-if="operateType != 'detail'">保 存</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import FormList from '@/components/FormList.vue';
import QuarterDatePicker from '@/components/QuarterDatePicker.vue'
import { getCurrentSsq } from "@/utils/tool";
import { fbsxmcList, xmlxMap, xmlxList } from '../constant'
import { limitMoneyMsg } from '@/config/constant'
import { getListByUser, exportLedger, update, queryStatus, del } from './CalculationTableApi.js'

export default {
  name: 'DevelopExpensePlusDeductionLedgerCalculationTable',
  components: {
    FormList,
    QuarterDatePicker
  },
  data() {
    return {
      param: {},
      activeName: '1',
      api: require('./CalculationTableApi'),
      loading: false,
      taxBodyList: [],
      queryParam: {},
      editForm: {},
      operateType: '',
      // 所得税填报周期（季、月） - 查询
      querySdstbzq: '季',
      // 所得税填报周期（季、月） - 编辑新增
      sdstbzq: '季',
      dialogVisible: false,
      propskey: '',
      fbsxmcList,
      xmlxMap,
      querySbStatus: false,
      preDateDisabled: false,
      currentDateDisabled: false,
      columns: [
        { type: "selection", width: 50 },
        { title: '序号', type: "index", width: 50 },
        { title: "纳税主体名称", width: 100, dataIndex: "nsrmc", },
        { title: "税款所属期", width: 100, dataIndex: "ssq", slot: 'ssq', align: "center" },
        { title: "研发费用加计扣除类型", width: 180, dataIndex: "lxmc", slot: 'lxmc', align: 'center' },
        { title: "自主研发本年累计金额", width: 150, dataIndex: "zjyfbnlje", slot: 'zjyfbnlje', align: 'right' },
        { title: "委托研发本年累计金额", width: 150, dataIndex: "wtyfbnljje", slot: 'wtyfbnljje', align: 'right' },
        { title: "年度研发费用", width: 120, dataIndex: "ndyffy", slot: 'ndyffy', align: 'right' },
        { title: "年度研发费用-费用化金额", width: 180, dataIndex: "fyhje", slot: 'fyhje', align: 'right' },
        { title: "年度研发费用-资本化金额", width: 180, dataIndex: "zbhje", slot: 'zbhje', align: 'right' },
        { title: "本年形成无形资产摊销", width: 180, dataIndex: "bnxcwxzctx", slot: 'bnxcwxzctx', align: 'right' },
        { title: "以前年度形成无形资产摊销", width: 180, dataIndex: "yqndxcwxzctx", slot: 'yqndxcwxzctx', align: 'right' },
        { title: "允许扣除的研发费用合计", width: 180, dataIndex: "yxkcyffyhj", slot: 'yxkcyffyhj', align: 'right' },
        { title: "特殊收入部分", width: 100, dataIndex: "tssrbf", slot: 'tssrbf', align: 'right' },
        { title: "允许扣除的研发费用抵减特殊收入后的金额", width: 200, dataIndex: "yxkcdjtssrhje", slot: 'yxkcdjtssrhje', align: 'right' },
        { title: "当年销售研发活动直接形成产品对应的材料部分", width: 180, dataIndex: "clbf", slot: 'clbf', align: 'right' },
        { title: "以前年度销售研发产品对应的材料部分结转金额", width: 180, dataIndex: "clbfjz", slot: 'clbfjz', align: 'right' },
        { title: "加计扣除比例", width: 100, dataIndex: "jjkcbl", slot: 'jjkcbl', align: 'center' },
        { title: "本年研发费用加计扣除总额", width: 120, dataIndex: "bnyffyjjkcze", slot: 'bnyffyjjkcze', align: 'right' },
        { title: "销售研发产品（包括组成部分）对应材料部分结转以后年度扣减金额", width: 220, dataIndex: "xsjzkjje", slot: 'xsjzkjje', align: 'right' },
        { title: "备注", width: 220, dataIndex: "bz" },
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

      ],
      rules: {
        nsrsbh: [{ required: true, message: "请选择", trigger: "blur" }],
        // ssq: [{ required: true, message: "请选择", trigger: "blur" }],
        // zclx: [{ required: true, message: "请选择", trigger: "blur" }],
        lxmc: [{ required: true, message: "请选择", trigger: "blur" }],
        jjkcbl: [{ required: true, message: "请输入", trigger: "blur" }, { pattern: /^([0-9][0-9]{0,1}|100)$/, message: '请输入0-100的百分比数字' }],
        bnxcwxzctx: limitMoneyMsg,
        yqndxcwxzctx: limitMoneyMsg,
        tssrbf: limitMoneyMsg,
        clbf: limitMoneyMsg,
        clbfjz: limitMoneyMsg,
        bnyffyjjkcze: limitMoneyMsg,
        bz: [{ required: true, message: "请输入", trigger: "blur" }],
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

    operateTypeText() {
      return this.operateType == 'add' ? '新增' : this.operateType == 'edit' ? '编辑' : '查看'
    },
    finalXmlxList() {
      return xmlxList.filter((item) => item.kclx == (this.editForm.kclx || 'N'))
    },
  },

  methods: {
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({})
      if (code === '0') {
        this.taxBodyList = data
        this.searchList[0].options = [{ value: 'all', label: '全部' }].concat(data.map((item) => {
          return {
            ...item,
            value: item.nsrsbh,
            label: `${item.nsrmc} ${item.nsrsbh}`
          }
        }))
        if (!this.$route.query.nsrsbh) {

          const { nsrsbh = '', sdstbzq = '' } = data[0] || {}
          this.querySdstbzq = sdstbzq
          // this.param.orginNsrsbh = nsrsbh
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
      const fileName = `研发费用计算表.xlsx`
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
    addLine(row, type) {//  新增\修改弹窗
      this.editForm = row.id ? {
        ...row,
        jjkcbl: row.jjkcbl * 100
      } : {}
      this.operateType = type
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
        status = data
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
        // 标记 Y 代表前三项  N代表不是前三项
        // const { monthValue, quarterValue } = getCurrentSsq();
        // const kclx = [1, 2, 3].includes(this.editForm.lxmc) ? 'Y' : 'N';
        const { code = '', } = await update({
          ...this.editForm,
          // kclx,
          jjkcbl: this.editForm.jjkcbl / 100,
          nsrmc: this.taxBodyList.find((item) => item.nsrsbh === this.editForm.nsrsbh).nsrmc,
        })
        if (code === '0') {
          this.$message.success('操作成功')
          this.handleClose()
          this.getList()
        }
      })
    },
    handleChange() {
      const { fyhje, bnxcwxzctx, yqndxcwxzctx, clbfjz, jjkcbl, clbf, tssrbf } = this.editForm;
      //  允许扣除的研发费用合计(9) = 5+7+8 （费用化金额 +  本年形成无形资产摊销 +  以前年度形成无形资产摊销）
      const yxkcyffyhj = parseFloat(fyhje) + parseFloat(bnxcwxzctx) + parseFloat(yqndxcwxzctx)
      // 允许扣除的研发费用抵减特殊收入后的金额 = 9-10 (允许扣除的研发费用合计 - 特殊收入部分 )
      const yxkcdjtssrhje = yxkcyffyhj - parseFloat(tssrbf);
      // 本年研发费用加计扣除总额  当（11-12-13）×14≥0，取（11-12-13）×14；当（11-12-13）×14＜0，填报0
      const bnyffyjjkcze = ((yxkcdjtssrhje - parseFloat(clbf) - parseFloat(clbfjz)) * parseFloat(jjkcbl) / 100).toFixed(2)
      // 销售研发产品（包括组成部分）对应材料部分结转以后年度扣减金额  当11-12-13>0，本行=0当11-12-13<0, 本行＝11-12-13的绝对值
      const xsjzkjje = yxkcdjtssrhje - parseFloat(clbf) - parseFloat(clbfjz)

      this.editForm = {
        ...this.editForm,
        yxkcyffyhj,
        yxkcdjtssrhje,
        bnyffyjjkcze: bnyffyjjkcze < 0 ? 0 : bnyffyjjkcze,
        xsjzkjje: xsjzkjje > 0 ? 0 : Math.abs(xsjzkjje)
      }
      this.$forceUpdate()
    },
  }

}
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
      width: 230px;
    }

    .el-form-item__content {
      width: calc(100% - 230px);

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
