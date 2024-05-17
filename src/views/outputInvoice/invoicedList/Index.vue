<template>
  <div class="main-content">
    <div class="content-header">
      <div class="label">数据范围</div>
      <el-tabs v-model="scope" type="card">
        <el-tab-pane label="近两月" name="2" />
        <el-tab-pane label="全部数据" name="1" />
      </el-tabs>
    </div>
    <form-list :columns="columns" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" :tableCounterShow="true" ref="list" @getSearchParam="getSearchParam">
      <!-- 操作按钮 -->
      <template #myscope="row">
        <el-popover placement="left" trigger="hover" popper-class="customPopper">
          <template>
            <el-button @click.stop="previewPdf(row.data)" type="primary">查看</el-button>
            <el-button @click.stop="handleShare(row.data)" type="warning">分享</el-button>
            <el-button @click.stop="downLoadPdf(row.data)" type="info">下载</el-button>
            <!-- 无开票组织 -->
            <el-button v-if="row.data.lzfpbz == 0" @click.stop="invoiceUsedStatus(row.data)" type="danger">红冲</el-button>
            <el-button v-if="row.data.lzfpbz == 0" @click.stop="copyInvoice(row.data)" type="warning">复制</el-button>
            <el-button v-if="row.data.tszt == 2" :loading="repushLoading" @click.stop="repush(row.data)" type="warning" dec="推送状态：0无需推送，1推送成功，2推送失败">重新推送</el-button>
          </template>
          <el-button slot="reference">操作</el-button>
        </el-popover>
      </template>

      <template #fppz="row">
        {{ row.data.fppz == '01'
          ? '数电增值税专用发票'
          : row.data.fppz == '02'
            ? '数电增值税普通发票'
            : ''
        }}
      </template>
      <template #kpfs="row">
        {{ row.data.kpfs == '01'
          ? 'RPA开票'
          : row.data.kpfs == '02'
            ? '乐企直连'
            : ''
        }}
      </template>
      <template #hjje="{ data }">{{ formatMoney(data.hjje) }}</template>
      <template #hjse="{ data }">{{ formatMoney(data.hjse) }}</template>

      <template #lzfpbz="row">
        <span :class="formatFplx(row.data.lzfpbz).clazz">
          {{ formatFplx(row.data.lzfpbz).txt }}
        </span>
      </template>

      <template #tdys="row">
        {{ row.data.tdys == '06' ? '不动产经营租赁' : row.data.tdys == '05' ? '不动产销售' : row.data.tdys == '03' ? '建筑服务' : row.data.tdys == '00' ? '通用' : '' }}
      </template>
      <template #kprq="row">{{ dateFormat('YYYY-mm-dd', row.data.kprq) }}</template>
      <!-- <template #rzzt="row">
        {{ row.data.rzzt == '02' ? '已入账' : row.data.rzzt == '03' ? '已入账撤销' : '未入账' }}
      </template> -->
      <template #orgName="row"> {{ row.data.orgName || '无开票组织' }}</template>

      <template #status="row">
       
        <span :class="formatStatus(row.data.status).clazz">
          <el-tooltip v-if="row.data.status == '02'" class="item" effect="dark" :content="row.data.kpsbyy" placement="top-start">
            <span :class="formatStatus(row.data.status).clazz"   @click="showErrorMsg(row.data)">
              {{ formatStatus(row.data.status).txt }}
            </span> 
          </el-tooltip>
          <template v-else>
            {{ formatStatus(row.data.status).txt }}
          </template>
        </span>
      </template>
      <template #tsztstatus="row">
        <span :class="formatTsztStatus(row.data.tszt).clazz">
          {{ formatTsztStatus(row.data.tszt).txt }}
        </span>
      </template>
      <!-- 中间按钮部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <!-- 维护开票点 -->
            <el-button @click="getCurrentOrgList">维护开票组织</el-button>
            <el-button @click="downLoadPdfZip">下载pdf</el-button>
            <el-button @click.stop="handleShare()">分享</el-button>
            <el-button @click="downLoadList">导出</el-button>
          </div>
        </div>
      </template>
    </form-list>

    <el-dialog :title="isUpdateInvoiceOrgId ? '维护开票组织' : '分享'" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <div class="dialog-content">
        <el-form :inline="true" :model="form" ref="ruleForm" :rules="rules">
          <template v-if="isUpdateInvoiceOrgId">
            <el-form-item label="开票组织" prop="orgid">
              <el-select v-model="form.orgid" placeholder="请选择" filterable>
                <el-option v-for="item in currentOrgList" :label="item.name" :value="item.id" :key="item.id" />
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="请输入邮箱地址" prop="email">
              <el-input v-model="form.email" placeholder="请输入" />
            </el-form-item>
          </template>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关 闭</el-button>

        <el-button v-if="isUpdateInvoiceOrgId" type="success" :loading="saveLoading" @click="updateInvoiceOrgId">确 认</el-button>
        <el-button v-else type="success"  :loading="saveLoading" @click="sendPdf">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { dateFormat, previewPdf } from "@/utils/tool";
import FormList from '@/components/FormList.vue';
import { outputFplxList } from '@/config/constant'
import { invoiceUsedStatus, downLoadPdf, downLoadPdfZip, detailByOrgId, sendPdf, getOrgList, selectKpr, updateInvoiceOrgId, downLoadInvoiceList, selectQyList, repushBackJQ } from './Api'

export default {
  name: 'InvoicedList',
  components: { FormList },
  data() {
    return {
      form: {},
      saveLoading: false,
      param: {},
      scope: '2',
      loading: false,
      rules: {
        orgid: [{ required: true, message: "请选择", trigger: "blur" }],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" },
        { pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: "请输入正确的邮箱格式" }],
      },
      columns: [
        { type: "selection", width: 50 },
        { title: '序号', type: "index", width: 50 },
        { title: "开票类型", dataIndex: "lzfpbz",align:"center", slot: 'lzfpbz' },
        { title: "发票种类", dataIndex: "fppz", slot: 'fppz', width: 150 },
        { title: "开票状态", width: 100, dataIndex: "status",align:"center", slot: 'status' },
        { title: "推送状态", width: 100, dataIndex: "tszt",align:"center", slot: 'tsztstatus' },
        // { title: "发票代码", width: 100, dataIndex: "fpdm" },
        { title: "发票号码", width: 180, dataIndex: "fphm", slot: 'fphm', showTooltip: true},
        { title: "开票组织名称", width: 180, dataIndex: "orgName", slot: "orgName", showTooltip: true},
        { title: "购买方名称", width: 100, dataIndex: "gmfmc", showTooltip: true },
        { title: "购买方识别号/身份证号", width: 180, dataIndex: "gmfnsrsbh", },
        { title: "发票请求流水号", width: 180, dataIndex: "fpqqlsh" },
        { title: "开票日期", width: 100, dataIndex: "kprq",align:"center", slot: 'kprq' },
        { title: "开票人", width: 100, dataIndex: "kpr" },
        { title: "金额", width: 100, dataIndex: "hjje", slot: 'hjje', align: 'right' },
        { title: "税额", width: 100, dataIndex: "hjse", slot: 'hjse', align: 'right' },
        { title: "备注", width: 100, dataIndex: "bz", showTooltip: true},
        { title: "特定业务", width: 100, dataIndex: "tdys", slot: 'tdys' },
        { title: "开票方式", width: 100, dataIndex: "kpfs", slot: 'kpfs' },
        {
          title: "操作",
          key: "action",
          fixed: 'right',
          align: 'center',
          width: 80,
          scopedSlots: { customRender: "action" },
        },
      ],
      searchList: [
        // {
        //   label: "数据范围",
        //   key: "scope",
        //   val: "2",
        //   type: "select",
        //   options: [
        //     { value: "2", label: "近两月" },
        //     { value: "1", label: "全部数据" },
        //   ],
        // },

        { label: "发票号码", key: "fphm", val: "", type: "input", placeholder: "请输入" },

        // { label: "发票代码", key: "fpdm", val: "", type: "input", placeholder: "请输入" },
        // {
        //   label: "开票组织",
        //   key: "orgid",
        //   val: "",
        //   type: "select",
        //   options: [],
        // },
        {
          label: "开票组织",
          key: "orgid",
          val: "",
          type: "select",
          options: [],
        },
        {
          label: "开票类型",
          key: "lzfpbz", val: "", type: "select",
          options: [
            { value: "", label: "全部" },
            { value: "0", label: "蓝票" },
            { value: "1", label: "红票" },
          ],
        },
        { label: "购买方名称", key: "gmfmc", val: "", type: "input", placeholder: "请输入" },

        { label: "销售方识别号", key: "xsfsh", val: "", type: "input", placeholder: "请输入" },
        {
          label: "开票日期",
          key: "kprq",
          val: [],
          type: "daterange",
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }
        },
        {
          label: "所属区域",
          key: "ssqy",
          val: "",
          type: "select",
          options: [],
        },
        // {
        //   label: "项目名称(住工)",
        //   key: "xmmc",
        //   val: "",
        //   type: "input",
        //   options: [],
        //   placeholder: '请输入'

        // },
        // {
        //   label: "项目名称(房开)",
        //   key: "xxmm",
        //   val: "",
        //   type: "select",
        //   options: [],
        // },
        {
          label: "发票种类",
          key: "fppz", val: "",
          type: "select",
          options: [{
            value: "",
            label: "全部"
          }].concat(outputFplxList)
        },
        {
          label: "开票人",
          key: "kpr",
          val: "",
          type: "select",
          options: [],
        },
        // {
        //   label: "价税合计",
        //   key: "jshj",
        //   val: '',
        //   type: "input",
        //   options: [],
        //   placeholder: '请输入'
        // },
        {
          label: "价税合计",
          key: "jshj",
          val: [],
          type: "numberRange",
          options: [],
          placeholder: ['最小金额', '最大金额']
        },
        {
          label: "红冲标识",
          key: "hcbs",
          val: "",
          type: "select",
          options: [
            { value: "", label: "全部" },
            { value: "0", label: "正常" },
            // { value: "2", label: "作废" },
            // { value: "3", label: "已红冲" },
            { value: "7", label: "已红冲 - 部分红冲" },
            { value: "8", label: "已红冲 - 全额红冲" },
          ],
        },

        // {
        //   label: "清单标志",
        //   key: "qdbs",
        //   val: "",
        //   type: "select",
        //   options: [
        //     { value: "", label: "全部" },
        //     { value: "01", label: "是" },
        //     { value: "02", label: "否" },
        //   ],
        // },
        // {
        //   label: "楼栋号",
        //   key: "ldh",
        //   val: "",
        //   type: "input",
        //   placeholder: '请输入'
        // },
        {
          label: "来源系统",
          key: "lyxt",
          val: "",
          type: "select",
          options: [
            { value: "", label: "全部" },
            { value: "0", label: "下载" },
            { value: "1", label: "手工开具" },
            { value: "2", label: "接口传入" },
            // { value: "3", label: "文件导入" },
          ],
        },
      ],
      selecedInfo: {
        number: 0,
        je: 0,
        se: 0,
        jshj: 0,
      },
      selectIds: [],
      dialogVisible: false,
      singleCurrentData: {},
      currentOrgList: [],
      isUpdateInvoiceOrgId: false,
      queryParam: {},
      repushLoading: false,
    };

  },
  mounted() {
    this.getOrgList();
    this.selectKpr();
    // this.detailByOrgId();
    this.selectQyList();
    this.param.scope = '2'
  },
  watch: {
    scope(val) {
      this.param.scope = val
      this.$nextTick(() => {
        this.$refs.list.reload()
      })
    }
  },
  computed: {
    height() {
      return window.innerHeight - 400;
    },
    selections() {
      return this.$refs.list.getSelections()
    },
    api() {
      return this.scope == 2 ? require('./Api') : require('./ApiScope')
    }
  },

  methods: {
    // 预览pdf
    previewPdf,
    async getOrgList() {
      const { code = '', data = [] } = await getOrgList({})
      if (code === '0') {
        const index = this.searchList.findIndex((item) => item.key === 'orgid');
        this.searchList[index].options = [{ value: '', label: '全部' }, { value: 'noorg', label: '无开票组织' }].concat(data.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        }))
      }
    },

    // 查询开票人
    async selectKpr() {
      const { code = '', data = [] } = await selectKpr({})
      if (code === '0') {
        const index = this.searchList.findIndex((item) => item.key == 'kpr');
        this.searchList[index].options = [{ value: '', label: '全部' }].concat(data.kprList.map((item) => {
          return {
            ...item,
            value: item.kpr,
            label: item.kpr
          }
        }))
      }
    },
    // /**
    // * @desption 【组织管理】获取区域选择下拉
    // */
    async selectQyList() {
      const { code = '', data = [] } = await selectQyList()
      if (code === '0') {
        const index = this.searchList.findIndex((item) => item.key == 'ssqy');
        this.searchList[index].options = [{ value: '', label: '全部' }].concat(data.map((item) => {
          return {
            value: item,
            label: item
          }
        }))
      }
    },
    /**
   * @desption 项目名称（房开）
   */
    async detailByOrgId() {
      const { code = '', data = [] } = await detailByOrgId()
      if (code === '0') {
        const index = this.searchList.findIndex((item) => item.key == 'xxmm');
        this.searchList[index].options = [{ value: '', label: '全部' }].concat(data.kprList.map((item) => {
          return {
            value: item,
            label: item
          }
        }))
      }
    },
    // 根据当前行的taxBodyId获取对应的开票组织
    async getCurrentOrgList() {
      if (this.selections == 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      const taxBodyId = this.selections[0].taxBodyId
      if (this.selections.some(item => item.taxBodyId != taxBodyId)) {
        this.$message.warning('您选择的数据包含多纳税主体信息，不支持修改开票组织')
        return;
      }
      if (this.selections.some(item => item.orgid)) {
        this.$message.warning('您选择数据不支持修改开票组织')
        return;
      }
      this.isUpdateInvoiceOrgId = true;
      const { code = '', data = [] } = await getOrgList({ taxBodyId })
      if (code === '0') {
        this.currentOrgList = data;
        this.dialogVisible = true
      }
    },
    // 更新发票orgid
    updateInvoiceOrgId() {
      this.$refs["ruleForm"].validate(async valid => {
        if (!valid) return;
        const ids = this.selections.map((item) => item.id)
        this.saveLoading = true
        const { code = '' } = await updateInvoiceOrgId({ ids, ...this.form })
        if (code === '0') {
          this.$refs.list.reload();
          this.handleClose()
          this.$message.success('操作成功');
        }
        this.saveLoading = false
      })
      
    },

    // 检查蓝票是否可以红冲
    async invoiceUsedStatus(row) {
      if (row.lzfpbz != '0') {
        this.$message.warning('该红字发票种类不支持红冲')
        return
      }
      if (!row.orgid) {
        this.$message.warning('请先设定开票组织!');
        return;
      }
      try {
        const { code = '' } = await invoiceUsedStatus({
          fplx: row.fppz,
          fphm: row.fphm,
          kprq: row.kprq,
          nsrsbh: row.xsfnsrsbh // 销方纳税人识别号
        })

        // 可以红冲
        if (code === '0') {
          // sessionStorage.setItem('clearRedInvoice', 1);
          this.$router.push({
            // 选择默认填充
            path: '/redInvoice/redInfoConfirm',
            query: {
              nsrmc: row.xsfmc,
              nsrsbh: row.xsfnsrsbh,
              taxBodyId: row.taxBodyId,
              blueInvoiceId: row.id,
              operateType: 'queryBlue',
              isFormInvoiced: 'Y',
            }
          })
          this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
        }
      } catch (error) {
        this.$message.error(error.msg || '操作失败')
      }
      
    },

    // 邮箱分享
    handleShare(row) {
      this.singleCurrentData = row;
      if (this.selections == 0 && !row) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      this.dialogVisible = true
    },

    // 发送pdf
    async sendPdf() {
      this.$refs["ruleForm"].validate(async valid => {
        if (!valid) return;
        const ids = this.singleCurrentData ? [this.singleCurrentData.id] : this.selections.map((item) => item.id);
        this.saveLoading = true
        const { code = '' } = await sendPdf({ email: this.form.email, ids })
        if (code === '0') {
          this.handleClose()
          this.$message.success('发送成功');
        }
        this.saveLoading = false
      })
    },

    handleClose() {
      this.dialogVisible = false;
      this.form = {}
    },

    // 下载单个pdf
    async downLoadPdf(row) {
      const fileName = `${row.fphm}_${row.gmfmc}.pdf`
      await downLoadPdf({
        reqData: { id: row.id },
        fileName
      })
    },

    // 下载pdf Zip
    async downLoadPdfZip() {

      if (this.selections == 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      const ids = this.selections.map((item) => item.id)
      const fileName = `发票下载.zip`
      await downLoadPdfZip({
        reqData: ids,
        fileName
      })
    },
    // 复制开票
    copyInvoice(row) {
      // if (row.lzfpbz != '0') {
      //   this.$message.warning('该红字发票种类不支持复制')
      //   return
      // }
      if (!row.orgid) {
        this.$message.warning('请先设定开票组织!');
        return;
      }
      this.$router.push({
        path: '/outputInvoice/blueInvoice/BlueInvoiceForm',
        query: {
          invoiceId: row.id,
          isFormInvoiced: 'Y'
        }
      })
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);

    },
    // 重新推送
    async repush(row){
      try {
        this.repushLoading = true;
        const {code, data = []} = await repushBackJQ({id: row.id})
        if(code === '0'){
          this.$message.success('操作成功')
          this.$refs.list.reload()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.repushLoading = false;
      }
    },
    dateFormat(fmt, date) {
      return dateFormat(fmt, date)
    },

    formatStatus(cellValue) {
      if (cellValue == '00') {
        return { txt: '开票成功', clazz: 'blue-cell' }
      } else if (cellValue == '01') {
        return { txt: '开票中', clazz: 'orange-cell' }
      } else if (cellValue == '02') {
        return { txt: '开票失败', clazz: 'red-cell' }
      } else if (cellValue == '03') {
        return { txt: '开票中', clazz: 'orange-cell' }
      } else if (cellValue == '04') {
        return { txt: '待开票', clazz: 'grey-cell' }
      }
    },
     formatTsztStatus(cellValue) {
      if (cellValue == 0) {
        return { txt: '无需推送', clazz: '' }
      } else if (cellValue == 1) {
        return { txt: '推送成功', clazz: 'blue-cell' }
      } else if (cellValue == 2) {
        return { txt: '推送失败', clazz: 'red-cell' }
      }
    },
    formatShzt(cellValue) {
      if (cellValue == 0) {
        return { txt: '无需审核', clazz: 'blue-cell' }
      } else if (cellValue == 1) {
        return { txt: '待审核', clazz: 'grey-cell' }
      } else if (cellValue == 2) {
        return { txt: '审核通过', clazz: 'blue-cell' }
      } else if (cellValue == 3) {
        return { txt: '审核驳回', clazz: 'red-cell' }
      } else {
        return { txt: '---', clazz: 'grey-cell' }
      }
    },
    formatFplx(cellValue) {
      let obj = {};
      if (cellValue == '0') {
        obj = { txt: '蓝票', clazz: 'blue-cell' }
      } else if (cellValue == '1') {
        obj = { txt: '红票', clazz: 'red-cell' }
      }

      return obj
    },
    //错误信息
    showErrorMsg(data) {
      let that = this;
      that.errorMsg = data.kpsbyy;
      that.errorDialog = true;
    },
    async downLoadList() {
      const fileName = `已开票记录导出.xlsx`
      const ids = this.selections.map((item) => item.id)
      await downLoadInvoiceList({
        reqData: { ...this.queryParam, scope: this.scope ,idKeys:ids },
        fileName
      })
    },

    getSearchParam(param) {
      this.queryParam = param;
    },
    handleCellMouseEnter(row) {
      console.log(row)
    },
    handleCellMouseLeave(row) {
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/variables.scss";
.content-header {
  display: flex;
  align-items: center;

  .label {
    width: 108px;
    text-align: right;
    margin-right: 12px;
    font-size: 12px;
    color: #606266;
  }
}

::v-deep .el-tabs--card>.el-tabs__header .el-tabs__nav {
  border-bottom: 1px solid #E4E7ED;
}

::v-deep .el-tabs__item {
  height: 28px;
  line-height: 28px;

  &:hover,
  &.is-active {
    color: $primaryGreenColor;
  }
}


::v-deep .el-dialog__body {
  .dialog-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .el-form,
    .el-form-item {
      width: 100%
    }

    .el-form-item__label {
      font-size: 14px;
      width: 200px
    }

    .el-form-item__content {
      width: calc(100% - 240px)
    }

    .el-select,
    .el-input {
      width: 100%;
    }
  }
}
.blue-cell{
  color: #008fff;
  &::before{
    content: '';
      display: inline-block;
      width: 10px;
      height: 10px;
      opacity: 0.8;
      border-radius: 50%;
      background: #008fff;
  }
}
.red-cell{
  color: #ff0000;
    &::before {
      content: '';
      display: inline-block;
      width: 10px;
      height: 10px;
      opacity: 0.8;
      border-radius: 50%;
      background: #ff0000;
  }
}
</style>
