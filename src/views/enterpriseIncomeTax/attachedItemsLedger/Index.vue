<template>
  <div class="main-content">
    <form-list :columns="columns" :searchKey="propskey" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" @getSearchParam="getSearchParam" :firstLoading="false"
      @getNextList="getNextList" ref="list">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button @click="addLine({}, 'add')" type="primary">新增</el-button>
            <el-button @click="handleExport" :loading="exLoading">导出</el-button>
          </div>
        </div>
      </template>

      <template #fbsxz="{ data }">{{ data.lx == 1 ? formatMoney(data.fbsxz) : data.fbsxz }}</template>
      <template #ssq="{ data }"> {{ formatAllDate(data.ssq, querySdstbzq) }} </template>

      <template #qylx="{ data }"> {{ qylxMap[data.id] }} </template>

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
    <el-dialog :title="`${this.editForm.id ? '编辑' : '新增'}附报事项`" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
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

        <el-form-item label="附报事项名称" prop="lx">
          <el-select v-model="editForm.lx" filterable placeholder="请选择" @change="onChangeLx">
            <el-option v-for="item in fbsxmcList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事项内容 金额" prop="fbsxz" v-if="editForm.lx == 1">
          <el-input v-model="editForm.fbsxz" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="事项内容" prop="fbsxz" v-if="editForm.lx == 2">
          <el-radio v-model="editForm.fbsxz" label="新政策">新政策</el-radio>
          <el-radio v-model="editForm.fbsxz" label="原政策">原政策</el-radio>
        </el-form-item>
        <el-form-item label="事项内容 填发时间" prop="fbsxz" v-if="editForm.lx == 3">
          <el-date-picker v-model="editForm.fbsxz" type="date" placeholder="请选择" value-format="yyyy-MM-dd" :picker-options="{
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }" />
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
import { getCurrentSsq } from "@/utils/tool"
import { fbsxmcList, fbsxmcMap, qylxMap } from '../constant';
import { getListByUser, exportLedger, update, add, queryStatus, del } from './Api.js'

export default {
  name: 'AttachedItemsLedger',
  components: {
    FormList,
    QuarterDatePicker
  },
  data() {
    return {
      param: {},
      api: require('./Api'),
      loading: false,
      taxBodyList: [{}],
      queryParam: {},
      editForm: {},
      dialogVisible: false,
      propskey: '',
      fbsxmcList,
      fbsxmcMap,
      qylxMap,
      preDateDisabled: false,
      currentDateDisabled: false,
      // 所得税填报周期（季、月） - 编辑新增，默认季度
      querySdstbzq: '季',
      sdstbzq: '季',
      querySbStatus: false,
      columns: [
        { type: "selection", width: 50 },
        { title: '序号', type: "index", width: 50 },
        { title: "纳税主体名称", dataIndex: "nsrmc", width: 160, },
        // { title: "总公司纳税名称", dataIndex: "zjgmc", width: 160, },
        { title: "税款所属期", width: 100, dataIndex: "ssq", slot: 'ssq', align: 'center' },
        { title: "附报事项名称", width: 200, dataIndex: "fbsxmc" },
        { title: "事项内容", width: 150, dataIndex: "fbsxz", slot: 'fbsxz' },
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
        },
        {
          label: "税款所属期",
          key: 'ssq',
          type: "quarterPicker",
          isInitDefault: true,
          // nextDateDisabled: true,
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
          label: "附报事项名称",
          key: "lx",
          val: "",
          type: "select",
          placeholder: '请选择',
          options: [{ label: '全部', value: '' }].concat(fbsxmcList)
        },

      ],
      rules: {
        nsrsbh: [{ required: true, message: "请选择", trigger: "blur" }],
        // ssq: [{ required: true, message: "请选择", trigger: "blur" }],
        lx: [{ required: true, message: "请选择", trigger: "blur" }],
        fbsxz: [{ required: true, message: "请输入", trigger: "blur" }],
        bz: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      exLoading: false,
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
      const ssq = this.querySdstbzq == '月' ? monthValue : quarterValue
      this.$set(this.param, 'ssq', ssq)
      this.param.tbzq = this.querySdstbzq
      this.searchList[0].val = nsrsbh
      this.searchList[1].val = ssq
      this.searchList[1].pickerType = this.querySdstbzq || '季'
      this.propskey = `${nsrsbh}_${ssq}${this.querySdstbzq}`
    },
    getNextList(val, type) {
      const sdstbzq = this.taxBodyList.find((item) => item.nsrsbh === val)?.sdstbzq;
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
    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh, ssq, tbzq } = this.$route.query
      this.$set(this.param, 'nsrsbh', nsrsbh)
      this.$set(this.param, 'ssq', ssq)
      this.querySdstbzq = tbzq
      this.searchList[0].val = nsrsbh
      this.searchList[1].val = ssq
      this.searchList[1].pickerType = tbzq
      this.propsKey = `${nsrsbh}_${ssq}_${tbzq}`
      this.$refs.list.handleGetData(this.param)
    },
    getQuarterPickerFrom(propsParam, data) {
      this.editForm[propsParam] = data
    },
    onChangeLx() {
      this.$set(this.editForm, 'fbsxz', '')
    },
    // 导出
    async handleExport() {
      try {
        this.exLoading = true;
        const fileName = `附报事项台账.xlsx`
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
    },
    handleClose() {
      this.dialogVisible = false;
      this.editForm = {}
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
        const api = this.editForm.id ? update : add;
        const { code = '', } = await api({
          ...this.editForm,
          fbsxmc: this.fbsxmcList.find((item) => item.value == this.editForm.lx).label,
          nsrmc: this.taxBodyList.find((item) => item.nsrsbh == this.editForm.nsrsbh).nsrmc,

        })
        if (code === '0') {
          this.$message.success('操作成功')
          this.handleClose()
          this.getList()
        }
      })
    },
    // 查询申报状态
    async queryStatus(type) {
      // let status = false;
      // false是当前还没有申报
      const param = type == 'update' ? { nsrsbh: this.editForm.nsrsbh, ssq: this.editForm.ssq } : this.queryParam
      const { code = '', data } = await queryStatus({ ...param, sbsz: 'sds' })
      if (code === '0') {
        // status = data
        // if (type == 'update') {
        //   // false 是当前还没有申报，本期还是可以选的
        //   this.currentDateDisabled = data;
        //   this.preDateDisabled = !data;
        //   return;
        // }
        // this.querySbStatus = data
        return data
      }
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
