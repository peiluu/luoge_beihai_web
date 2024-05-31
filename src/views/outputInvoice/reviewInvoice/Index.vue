<template>
  <div class="main-content">
    <div class="content-header">
      <el-tabs class="custom-card-tabs" v-model="activeName" type="card" @tab-click="tabClick">
        <el-tab-pane label="待审核蓝字发票数据" name="blue" />
        <el-tab-pane label="待审核红字发票数据" name="red" />
      </el-tabs>
    </div>

    <form-list :key="activeName" :reset="reset" :columns="activeName == 'blue' ? columnsBlue : columnsRed" :searchRow="activeName == 'blue' ? blueSearchList : redSearchList" :api="activeName == 'blue' ? apiBlue : apiRed"
      :param="param" :height="height" @handleSelection="handleSelection" v-loading="loading" :checkLockM="checkLockM" :tableCounterShow="true" ref="list">

      <template #myscope="row">
        <el-popover placement="left" trigger="hover" popper-class="customPopper">
          <template>
            <el-button @click="passOne(row.data)" type="success">通过</el-button>
            <el-button type="danger" @click="rejectOneDialog(row.data)">驳回</el-button>
          </template>
          <el-button slot="reference">操作</el-button>
        </el-popover>

      </template>

      <template #fppz="row">
        {{
          row.data.fppz == '01'
          ? '数电增值税专用发票'
          : row.data.fppz == '02'
            ? '数电增值税普通发票'
            : ''
        }}
      </template>
      <template #lzfppzDm="row">
        {{
          row.data.lzfppzDm == '01'
          ? '数电增值税专用发票'
          : row.data.lzfppzDm == '02'
            ? '数电增值税普通发票'
            : ''
        }}
      </template>

      <template #chyyDm="row">
        {{
          row.data.chyyDm == '01'
          ? '开票有误'
          : row.data.chyyDm == '02'
            ? '销货退回'
            : row.data.chyyDm == '03'
              ? '服务中止'
              : row.data.chyyDm == '04'
                ? '销售折让'
                : ''
        }}
      </template>

      <template #shzt="row">
        {{
          row.data.shzt == 0
          ? '无需审核'
          : row.data.shzt == 1
            ? '待审核'
            : row.data.shzt == 2
              ? '审核通过'
              : row.data.shzt == 3
                ? '审核不通过'
                : ''
        }}
      </template>
      <template #hjje="{ data }">{{ formatMoney(data.hjje) }}</template>
      <template #hjse="{ data }">{{ formatMoney(data.hjse) }}</template>
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button @click="passBatch">通过</el-button>
            <el-button type="danger" @click="rejectBatchDialog">驳回</el-button>
          </div>
        </div>
      </template>
    </form-list>
    <!-- dialog -->
    <el-dialog :title="'请输入驳回原因'" :visible.sync="dialogOne" width="30%" :before-close="handleClose">
      <el-input type="textarea" :rows="3" placeholder="请输入驳回原因" maxlength="100" v-model="shxxOne">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogOne = false">取 消</el-button>
        <el-button type="success" @click="rejectOne">提交</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="'请输入驳回原因'" :visible.sync="dialogBatch" width="30%" :before-close="handleClose">
      <el-input type="textarea" :rows="3" placeholder="请输入驳回原因" maxlength="100" v-model="shxxBatch">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogBatch = false">取 消</el-button>
        <el-button type="success" @click="rejectBatch">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { outputFplxList } from '@/config/constant'
import FormList from '@/components/FormList.vue';


export default {
  name: 'ReviewInvoice',
  components: {
    FormList
  },
  data() {
    return {
      activeName: 'blue',
      form: {},
      apiBlue: require('./ApiBlue'),
      apiRed: require('./ApiRed'),
      param: {
        shzt: "1",
      },
      checkLockM: false,
      loading: false,
      columnsBlue: [
        { type: "selection", width: 50, },
        { title: "发票种类", dataIndex: "fppz", slot: 'fppz' },
        { title: "开票组织名称", width: 180, dataIndex: "orgName" },
        { title: "销售方名称", width: 180, dataIndex: "xsfmc", },
        { title: "销售方识别号/身份证号", width: 180, dataIndex: "xsfnsrsbh", },
        { title: "购买方名称", width: 180, dataIndex: "gmfmc", },
        { title: "购买方识别号/身份证号", width: 180, dataIndex: "gmfnsrsbh", },
        { title: "发票请求流水号", width: 180, dataIndex: "fpqqlsh" },
        { title: "制单日期", align: "center", width: 130, dataIndex: "kprq", },
        { title: "金额", width: 100, dataIndex: "hjje", slot: 'hjje', align: 'right' },
        { title: "税额", width: 100, dataIndex: "hjse", slot: 'hjse', align: 'right' },
        { title: "备注", width: 100, dataIndex: "bz", },
        { title: "审核状态", width: 130, dataIndex: "shzt", slot: "shzt",align: 'center' },
        { title: "开票人", width: 130, dataIndex: "kpr", slot: "kpr" },
        {
          title: "操作",
          key: "action",
          fixed: 'right',
          width: 80,
          scopedSlots: { customRender: "action" },
        },
      ],
      blueSearchList: [
        {
          label: "审核状态",
          key: "shzt", val: "1", type: "select",
          options: [
            { value: "1", label: "待审核" },
          ],
        },
        {
          label: "发票种类",
          key: "fppz", val: "", type: "select",
          options: [{ value: "", label: "全部" }].concat(outputFplxList)
        },
        { label: "销售方名称", key: "xsfmc", val: "", type: "input", placeholder: "请输入" },
        { label: "购买方名称", key: "gmfmc", val: "", type: "input", placeholder: "请输入" },
        { label: "开票人", key: "kpr", val: "", type: "input", placeholder: "请输入" },
      ],

      columnsRed: [
        { type: "selection", width: 50, },
        //{ title: '序号', type: "index", },
        { title: "发票种类", width: 130, dataIndex: "lzfppzDm", slot: 'lzfppzDm' },
        { title: "开票组织名称", width: 180, dataIndex: "orgName" },
        { title: "销售方名称", width: 180, dataIndex: "xsfmc", },
        { title: "销售方识别号/身份证号", width: 180, dataIndex: "xsfnsrsbh", },
        { title: "购买方名称", width: 180, dataIndex: "gmfmc", },
        { title: "购买方识别号/身份证号", width: 160, dataIndex: "gmfnsrsbh", },
        { title: "红字确认单编号", width: 130, dataIndex: "hzfpxxqrdbh", },
        { title: "原蓝字发票代码", width: 130, dataIndex: "lzfpdm", },
        { title: "原蓝字发票号码", width: 180, dataIndex: "lzfphm", },
        { title: "蓝字发票金额", width: 130, align: "right", dataIndex: "lzhjje", },
        { title: "蓝字发票税额", width: 130, align: "right", dataIndex: "lzhjse", },
        { title: "冲销金额", width: 130, align: "right", dataIndex: "hzcxje", },
        { title: "冲销税额", width: 130, align: "right", dataIndex: "hzcxse", },
        { title: "冲红原因", width: 130, align: "center", dataIndex: "chyyDm", slot: "chyyDm" },
        { title: "审核状态", width: 130, align: "center", dataIndex: "shzt", slot: "shzt" },
        {
          title: "操作",
          key: "action",
          fixed: 'right',
          width: 80,
          scopedSlots: { customRender: "action" },
        },
      ],

      redSearchList: [
        {
          label: "审核状态",
          key: "shzt", val: "1", type: "select",
          options: [
            { value: "1", label: "待审核" },
          ],
        },
        {
          label: "发票种类",
          key: "lzfppzDm", val: "", type: "select",
          options: [{ value: "", label: "全部" }].concat(outputFplxList)
        },
        { label: "销售方名称", key: "wfnsrmc", val: "", type: "input", placeholder: "请输入" },
        { label: "购买方名称", key: "dfnsrmc", val: "", type: "input", placeholder: "请输入" },
        { label: "开票人", key: "kpr", val: "", type: "input", placeholder: "请输入" },
        { label: "原蓝票号码", key: "fphm", val: "", type: "input", placeholder: "请输入" },
        { label: "原蓝票代码", key: "fpdm", val: "", type: "input", placeholder: "请输入" },

      ],
      selectIds: [],
      tabName: 'blue',
      dialogOne: false,
      dialogBatch: false,
      shxxOne: '',
      shxxBatch: '',
      selectRowData: {},
    };

  },
  mounted() {
    this.form = this.$route.query;
  },
  watch: {
    activeName() {
      this.$nextTick(() => {
        this.$refs.list.reload()
      })
    },
  },
  computed: {
    height() {
      return window.innerHeight - 400;
    },
    reset() {
      return this.$route.query.reset
    },

  },

  methods: {
    handleOk() {
      this.$refs.list.reload()
    },
    handleClose() {
    },
    tabClick(tab, event) {
      if (this.tabName != tab.name) {
        this.selectIds = [];
        this.tabName = tab.name;
      }
    },

    // 处理多选
    handleSelection(rows) {
      this.selectIds = rows.map((item) => item.id)
    },
    formatType(row) {
      return "蓝票";
    },

    passBatch() {
      if (this.selectIds.length == 0) {
        this.$message.warning("请至少选择一条");
        return;
      }
      this.$confirm(`您确定审核通过吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.passBatchApi();
      });
    },
    async passBatchApi() {
      this.loading = true;
      let res;
      let param = { ids: this.selectIds, shzt: 2 };
      if (this.tabName == "blue") {
        res = await this.apiBlue.editBatch(param);
      } else {
        res = await this.apiRed.editBatch(param);
      }
      if (res && res.code == 0) {
        this.$message.success("审核通过操作成功");
        this.handleOk();
      }
      this.loading = false;
    },
    passOne(row) {
      this.$confirm(`您确定审核通过吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.passOneApi(row);
      });
    },
    async passOneApi(row) {
      this.loading = true;
      let res;
      let param = { ids: [row.id], shzt: 2 };
      if (this.tabName == "blue") {
        res = await this.apiBlue.editBatch(param);
      } else {
        res = await this.apiRed.editBatch(param);
      }
      if (res && res.code == 0) {
        this.$message.success("审核通过操作成功");
        this.handleOk();
      }
      this.loading = false;
    },
    rejectBatchDialog() {
      if (this.selectIds.length == 0) {
        this.$message.warning("请至少选择一条");
        return;
      }
      this.shxxBatch = "";
      this.dialogBatch = true;
    },
    rejectBatch() {
      if (!this.shxxBatch) {
        this.$message.warning("请输入驳回原因");
        return;
      }
      this.$confirm(`您确定驳回吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.rejectBatchApi();
      });
    },
    async rejectBatchApi() {
      this.loading = true;
      this.dialogBatch = false;
      let res;
      let param = { ids: this.selectIds, shzt: 3, shxx: this.shxxBatch };
      if (this.tabName == "blue") {
        res = await this.apiBlue.editBatch(param);
      } else {
        res = await this.apiRed.editBatch(param);
      }
      if (res && res.code == 0) {
        this.$message.success("审核驳回操作成功");
        this.handleOk();
      }
      this.loading = false;
    },
    rejectOneDialog(row) {
      this.shxxOne = "";
      this.dialogOne = true;
      this.selectRowData = row;
    },
    rejectOne(row) {
      if (!this.shxxOne) {
        this.$message.warning("请输入驳回原因");
        return;
      }
      this.$confirm(`您确定驳回吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.rejectOneApi(row);
      });
    },
    async rejectOneApi() {
      this.loading = true;
      this.dialogOne = false;
      let res;
      let param = { ids: [this.selectRowData.id], shzt: 3, shxx: this.shxxOne };
      if (this.tabName == "blue") {
        res = await this.apiBlue.editBatch(param);
      } else {
        res = await this.apiRed.editBatch(param);
      }
      if (res && res.code == 0) {
        this.$message.success("审核驳回操作成功");
        this.handleOk();
      }
      this.loading = false;
    },
  }
};
</script>
