<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <form-list :columns="columns" :searchKey="propskey" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" @getSearchParam="getSearchParam" :firstLoading="false"
      @getNextList="getNextList" ref="list">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button @click="addLine({}, 'add')" type="primary"> 新增</el-button>
            <el-button @click="handleExport" :loading="exLoading">导出</el-button>
          </div>
        </div>
      </template>

      <template #ssq="{ data }"> {{ formatAllDate(data.ssq, querySdstbzq) }} </template>
      <template #bnljje="{ data }">{{ formatMoney(data.bnljje) }}</template>
      <template #jbxmjmje="{ data }">{{ formatMoney(data.jbxmjmje) }}</template>

      <template #myscope="{ data }">
        <el-popover placement="left" trigger="hover" popper-class="customPopper">
          <template>
            <el-button @click="addLine(data, 'edit')" type="primary">编辑</el-button>
            <el-button @click="handleDelete(data)" type="danger">删除</el-button>
          </template>
          <el-button slot="reference" v-if="data.sbzt != 'Y'">操作</el-button>
        </el-popover>
      </template>
    </form-list>
    <el-dialog :title="`${this.editForm.id ? '编辑' : '新增'}`" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <el-form :inline="true" :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="纳税主体名称" prop="nsrsbh">
          <el-select v-model="editForm.nsrsbh" filterable placeholder="请选择" :disabled="!!editForm.id" @change="(val) => getNextList(val, 'update')">
            <el-option v-for="item in taxBodyList" :key="item.id" :label="`${item.nsrmc} ${item.nsrsbh}`" :value="item.nsrsbh">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="税款所属期" prop="ssq" v-if="!this.editForm.id">
          <QuarterDatePicker :key="`${sdstbzq}_${dialogVisible}`" :pickerType="sdstbzq" propsParam="ssq" :disabled="!editForm.nsrsbh" :defaultValue="editForm.ssq" @getQuarterPickerFrom="getQuarterPickerFrom"
            :preDateDisabled="preDateDisabled" :currentDateDisabled="currentDateDisabled" ref="quarterDatePicker" />
        </el-form-item>
        <el-form-item label="事项类型" prop="tzlx">
          <el-select v-model="editForm.tzlx" filterable placeholder="请选择" @change="handleTzlxChange">
            <el-option v-for="item in sxlxList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="优惠事项名称" prop="lx">
          <el-select v-model="editForm.lx" filterable placeholder="请选择" :disabled="!editForm.tzlx">
            <el-option v-for="item in finalYhsxmcList" :key="item.dm" :label="item.mc" :value="item.dm" />
          </el-select>
        </el-form-item>
        <el-form-item label="本年累计发生额" prop="bnljje">
          <el-input v-model="editForm.bnljje" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="其中减半项目减免金额" prop="jbxmjmje" v-if="editForm.tzlx == 4">
          <el-input v-model="editForm.jbxmjmje" placeholder="请输入" />
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
import QuarterDatePicker from '@/components/QuarterDatePicker.vue'
import { sxlxList, qylxMap } from '../constant'
import { getListByUser, exportLedger, add, update, getDicSdsQttzdm, queryStatus, del } from './Api.js'

export default {
  name: 'OtherLedger',
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
      sxlxList,
      qylxMap,
      // 所得税填报周期（季、月） - 查询
      querySdstbzq: '季',
      // 所得税填报周期（季、月） - 编辑新增
      sdstbzq: '季',
      yhsxmcList: [],
      finalYhsxmcList: [],
      querySbStatus: false,
      preDateDisabled: false,
      currentDateDisabled: false,
      columns: [
        { type: "selection", width: 50 },
        { title: '序号', type: "index", width: 50 },
        { title: "纳税主体名称", width: 150, dataIndex: "nsrmc", },
        { title: "总公司纳税名称", width: 150, dataIndex: "zjgmc", },
        { title: "税款所属期", width: 100, dataIndex: "ssq", slot: 'ssq', align: 'center' },
        { title: "事项类型", width: 100, dataIndex: "tzmc", slot: 'tzlx' },
        { title: "优惠事项名称", width: 200, dataIndex: "mc", slot: 'tzlx' },
        { title: "本年累计发生额", width: 100, dataIndex: "bnljje", slot: 'bnljje', align: 'right' },
        { title: "其中减半项目减免金额", width: 140, dataIndex: "jbxmjmje", slot: 'jbxmjmje', align: 'right' },
        { title: "备注", width: 130, dataIndex: "bz" },
        {
          title: "操作",
          key: "action",
          width: 80,
          // fixed: 'right',
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
        {
          label: "事项类型",
          key: "tzlx",
          val: "",
          type: "select",
          placeholder: '请选择',
          options: [{ value: '', label: '全部' }].concat(sxlxList)
        },
      ],
      rules: {
        nsrsbh: [{ required: true, message: "请选择", trigger: "blur" }],
        tzlx: [{ required: true, message: "请选择", trigger: "blur" }],
        lx: [{ required: true, message: "请选择", trigger: "blur" }],
        bnljje: [{ required: true, message: "请输入", trigger: "blur" }, { pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字' }],
        jbxmjmje: [{ required: true, message: "请输入", trigger: "blur" }, { pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字' }],
        bz: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      exLoading: false
    };
  },
  mounted() {
    this.getListByUser()
    this.getDicSdsQttzdm()
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

  },

  methods: {
    // 获取优惠事项
    async getDicSdsQttzdm() {
      const { code = '', data = [] } = await getDicSdsQttzdm({})
      if (code === '0') {
        this.yhsxmcList = data;
      }
    },

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
        const { nsrsbh = '', sdstbzq = '' } = data[0] || {}
        // 携带参数进入
        if (!this.$route.query.nsrsbh) {
          this.querySdstbzq = sdstbzq
          this.$set(this.param, 'nsrsbh', nsrsbh)
          // 进入页面初始化数据
          this.initDate(nsrsbh)
        }
      }
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
    // 初始化属期时间
    initDate(nsrsbh) {
      const { monthValue, quarterValue } = getCurrentSsq();
      const ssq = this.querySdstbzq == '月' ? monthValue : quarterValue
      this.$set(this.param, 'ssq', ssq )
      this.param.tbzq = this.querySdstbzq
      this.searchList[0].val = nsrsbh
      this.searchList[1].val = ssq
      this.searchList[1].pickerType = this.querySdstbzq || '季'
      this.propskey = `${nsrsbh}_${this.querySdstbzq}`
    },

    // 导出
    async handleExport() {
      try {
        this.exLoading = true;
        const fileName = `不征税、免税、减计收入及所得减免台账.xlsx`
        await exportLedger({
          reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999 },
          fileName
        })
      } catch (error) {
        
      } finally {
        this.exLoading = false;
      }
    },
    getList() {
      this.$refs.list && this.$refs.list.handleGetData(this.queryParam)
    },
    getSearchParam(param) {
      this.queryParam = param;
      // this.queryStatus()
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
      if (row.id) {
        this.finalYhsxmcList = this.yhsxmcList.filter((item) => item.dmlx == row.tzlx)
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.editForm = {}
    },
    getNextList(val, type) {
      const sdstbzq = this.taxBodyList.find((item) => item.nsrsbh === val)?.sdstbzq
      if (type === 'update') {
        this.sdstbzq = sdstbzq || '季'
        // this.queryStatus(type)
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
    handleTzlxChange(val) {
      this.finalYhsxmcList = this.yhsxmcList.filter((item) => item.dmlx == val)
      this.$set(this.editForm, 'lx', '')
    },
    // 查询申报状态
    async queryStatus(type) {
      // let status = false;
      const { monthValue, quarterValue } = getCurrentSsq();
      const ssq = this.sdstbzq == '月' ? monthValue : quarterValue
      const param = type == 'add' ? { nsrsbh: this.editForm.nsrsbh, ssq } : this.queryParam
      // false 是当前还没有申报
      const { code = '', data } = await queryStatus({ ...param, sbsz: 'sds' })
      if (code === '0') {
        // status = data
        // if (type == 'add') {
        //   // false 是当前还没有申报，本期还是可以选的
        //   this.currentDateDisabled = data;
        //   this.preDateDisabled = !data;
        //   return;
        // }
        // this.querySbStatus = data
        return data;
      }
      // return status
    },
    async saveData() {
      this.$refs["editForm"].validate(async valid => {
        if (!valid) return;
        if (!this.editForm.ssq) {
          this.$message.warning('请选择属期！');
          return;
        }
        if (await this.queryStatus('update')) {
          this.$message.warning('该属期已申报，无法变更数据')
          return;
        }
        // const { monthValue, quarterValue } = getCurrentSsq()

        const api = this.editForm.id ? update : add;
        const { code = '', } = await api({
          ...this.editForm,
          mc: this.finalYhsxmcList.find((item) => item.dm == this.editForm.lx)?.mc,
          tzmc: this.sxlxList.find((item) => item.value == this.editForm.tzlx)?.label,
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
      width: 180px;
    }

    .el-form-item__content {
      width: calc(100% - 180px);

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
