<template>
  <div class="main-content">
    <form-list :columns="columns" :searchRow="SearchList" :api="api" :param="param" :height="height" @handleSelection="handleSelection" v-loading="loading" :tableCounterShow="true" ref="list"
      @getSearchParam="getSearchParam">
      <!-- 操作按钮 -->

      <template #myscope="row">
        <el-popover placement="left" trigger="hover" popper-class="customPopper">
          <template>
            <el-button v-if="row.data.status === '04' || row.data.status === '02'" @click.stop="openInvoice(row.data)" type="warning">开票</el-button>
            <!--<el-button v-if="(row.data.status === '04' || row.data.status === '02') && row.data.lzfpbz === '0'" @click.stop="editInvoice(row.data)" type="success">编辑</el-button>-->
            <el-button v-if="row.data.lzfpbz === '0'" @click.stop="editInvoice(row.data)" type="primary">查看</el-button>
            <!-- <el-button @click.stop="previewPdf(row.data)">查看</el-button> -->
            <el-button v-if="(row.data.status === '04' || row.data.status === '02') && row.data.lzfpbz === '0'" @click.stop="delInvoice(row.data)" type="danger">删除</el-button>
          </template>
          <el-button slot="reference" v-if="row.data.lzfpbz == '0' || row.data.status === '04' || row.data.status === '02'">操作</el-button>
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

      <template #lzfpbz="row">
        <span :class="formatFplx(row.data.lzfpbz).clazz">
          {{ formatFplx(row.data.lzfpbz).txt }}
        </span>
      </template>

      <template #status="row">
        <span >
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
      <template #kprq="row">
        <span >
          {{ formatDate(row.data.kprq,'YYYY-MM-DD HH:mm:ss', ) }}
        </span>
      </template>
      <template #shzt="row">
        <span :class="formatShzt(row.data.shzt).clazz">
          <a v-if="row.data.shzt == 3" href="javascript:void(0);" @click="showShxxMsg(row.data)">
            {{ formatShzt(row.data.shzt).txt }}
          </a>
          <template v-else>
            {{ formatShzt(row.data.shzt).txt }}
          </template>
        </span>
      </template>
      <template #hjje="{ data }">{{ formatMoney(data.hjje) }}</template>
      <template #hjse="{ data }">{{ formatMoney(data.hjse) }}</template>

      <!-- 中间按钮部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button @click="openInvoiceList">开票</el-button>
            <el-button @click="downloadNoList">导出</el-button>
            <el-button @click="delInvoiceList" type="danger">删除</el-button>
          </div>
        </div>
      </template>
    </form-list>
    <el-dialog title="开票失败原因" :visible.sync="errorDialog" width="30%">
      <span style="width: 90%;color: #FF0000;font-size: 18px;">
        {{ this.errorMsg }}
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="errorDialog = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="审核驳回原因" :visible.sync="backDialog" width="30%">
      <span style="width: 90%;color: #FF0000;font-size: 18px;">
        {{ this.backMsg }}
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="backDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FormList from '@/components/FormList.vue';
import { outputFplxList } from '@/config/constant'
import { previewPdf } from "@/utils/tool";
import BlueInvoiceForm from '../blueInvoice/BlueInvoiceForm.vue';

export default {
  name: 'noInvoice',
  components: {
    FormList,
    BlueInvoiceForm
  },
  data() {
    return {
      form: {},
      api: require('./Api'),
      param: {},
      loading: false,
      columns: [
        { type: "selection", width: 50 },
        { title: '序号', type: "index", width: 50 },
        { title: "开票类型", dataIndex: "lzfpbz",align:"center", slot: 'lzfpbz' },
        { title: "发票种类", dataIndex: "fppz", width: 140, slot: 'fppz', showTooltip: true },
        { title: "开票状态", width: 90,align:"center", dataIndex: "status", slot: 'status' },
        // { title: "审核状态", width: 100, dataIndex: "shzt", slot: "shzt" },
        { title: "开票组织名称", width: 180, dataIndex: "orgName", showTooltip: true },
        { title: "购买方名称", width: 180, dataIndex: "gmfmc", showTooltip: true },
        { title: "购买方识别号/身份证号", width: 180, dataIndex: "gmfnsrsbh", showTooltip: true },
        { title: "发票请求流水号", width: 180, dataIndex: "fpqqlsh" },
        { title: "发票号码", width: 180, dataIndex: "fphm" },
        //{ title: "开票失败原因", width: 180, dataIndex: "kpsbyy" },
        { title: "金额", width: 100, dataIndex: "hjje", slot: 'hjje', align: 'right' },
        { title: "税额", width: 100, dataIndex: "hjse", slot: 'hjse', align: 'right' },
        { title: "开票日期", width: 180,align:"center", dataIndex: "kprq", slot:'kprq' },
        { title: "备注", width: 120, dataIndex: "bz", showTooltip: true},
        //{ title: "审核人", width: 100, dataIndex: "shrxm", align: 'center' },
        {
          title: "操作",
          key: "action",
          fixed: 'right',
          width: 80,
          scopedSlots: { customRender: "action" },
        },
      ],
      SearchList: [
        { label: "发票请求流水号", key: "fpqqlsh", val: "", type: "input", placeholder: "请输入" },
        {
          label: "开票状态",
          key: "status", val: "", type: "select",
          options: [
            { value: "", label: "全部" },
            { value: "04", label: "待开票" },
            { value: "01", label: "开票中" },
            { value: "02", label: "开票失败" },
          ],
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
        { label: "购买方识别号", key: "gmfnsrsbh", val: "", type: "input", placeholder: "请输入" },
        {
          label: "发票申请来源",
          key: "lylx", val: "", type: "select",
          options: [
            { value: "", label: "全部" },
            { value: "0", label: "下载" },
            { value: "1", label: "手工开具" },
            { value: "2", label: "接口导入" },
            { value: "3", label: "本地文件导入" },
          ],
        },
        { label: "制单日期", key: "kprqArray", val: "", type: "daterange", placeholder: "请选择日期" },
        {
          label: "价税合计",
          key: "jshjArray",
          val: ['', ''],
          type: "numberRange",
          options: [],
          placeholder: ['最小金额', '最大金额']
        },
        {
          label: "开票组织",
          key: "orgId",
          val: "",
          type: "select",
          options: [],
        },
        {
          label: "发票种类",
          key: "fppz", val: "", type: "select",
          options: [{ value: "", label: "全部" }].concat(outputFplxList)
        },
        { label: "自定义备注", key: "bz", val: "", type: "input", placeholder: "请输入" },
        { label: "来源单据号", key: "lyid", val: "", type: "input", placeholder: "请输入" },
        { label: "开票人", key: "kpr", val: "", type: "input", placeholder: "请输入" },
        { label: "原蓝票号码", key: "dylzfphm", val: "", type: "input", placeholder: "请输入" },
        // {
        //   label: "审核状态",
        //   key: "shzt", val: "", type: "select",
        //   options: [
        //     { value: "", label: "全部" },
        //     { value: "0", label: "无需审核" },
        //     { value: "1", label: "待审核" },
        //     { value: "2", label: "审核通过" },
        //     { value: "3", label: "审核驳回" },
        //   ],
        // },
      ],
      selectIds: [],
      errorDialog: false,
      errorMsg: '',
      backDialog: false,
      backMsg: '',
      queryParam: {},
    };

  },
  mounted() {
    this.getOrgList();
    this.form = this.$route.query;
  },
  watch: {},
  computed: {
    height() {
      return window.innerHeight - 380;
    },
  },

  methods: {
    previewPdf,
    handleOk() {
      this.$refs.list.reload()
    },
    async getOrgList() {
      const { code = '', data = [] } = await this.api.getOrgList({})
      if (code === '0') {
        const index = this.SearchList.findIndex((item) => item.key === 'orgId');
        this.SearchList[index].options = [{ value: '', label: '全部' }, { value: 'noorg', label: '无开票组织' }].concat(data.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        }))
      }
    },
    formatDate(val, format) {
      let date = new Date(val);
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');

    let formattedDate = format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);

    return formattedDate;
},
    // 处理多选
    handleSelection(rows) {
      this.selectIds = [];
      rows.forEach((item) => {
        this.selectIds.push(item.id);
      })
    },
    //单张开票
    async openInvoice(row) {
      //
      if (row.shzt == 3 || row.shzt == 1) {
        this.$message.warning('未审核通过的票据，不能开具');
        return;
      }
      let openParam = { ids: [row.id] };
      let res = await this.checkOpenInvoiceApi(openParam);
      if (res && res.code == 0) {
        if (res.data == 'false') {
          this.$confirm(`存在超出单张限额的发票，您确定要开票吗？`, '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.openInvoiceApi(openParam);
          }).catch(() => {
          });
        } else {
          this.$confirm(`您确定要开票吗？`, '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.openInvoiceApi(openParam);
          }).catch(() => {
          });
        }
      }
    },
    //批量开票
    async openInvoiceList() {
      let selections = this.$refs.list.getSelections();
      let idArray = [];
      if (selections.length > 0) {
        let btgFlag = false;
        let kpzFlag = false;
        selections.forEach(item => {
          idArray.push(item.id);
          //判断审核状态
          if (item.shzt == 3 || item.shzt == 1) {
            btgFlag = true;
          }
          //判断是否开票中
          if (item.status == '01' || item.status == '03') {
            kpzFlag = true;
          }
        });
        if (btgFlag) {
          this.$message.error('未审核通过的票据，不能开具');
          return;
        }
        if (kpzFlag) {
          this.$message.error('开票中的票据，不能重复开票');
          return;
        }
        let openParam = { ids: idArray };
        let res = await this.checkOpenInvoiceApi(openParam);
        if (res && res.code == 0) {
          if (res.data == 'false') {
            this.$confirm(`存在超出单张限额的发票，您确定要开票吗？`, '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.openInvoiceApi(openParam);
            }).catch(() => {
            });
          } else {
            this.$confirm(`您确定要开票吗？`, '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.openInvoiceApi(openParam);
            }).catch(() => {
            });
          }
        }
      } else {
        this.$message.warning('请选择数据');
      }
    },
    async openInvoiceApi(openParam) {
      this.loading = true;
      let res = await this.api.openInvoice(openParam);
      if (res && res.code == 0) {
        this.$message.success("已提交开票，请稍后查询");
        this.$refs.list.reload();
      }
      this.loading = false;
    },

    //单张开票
    delInvoice(row) {
      this.$confirm(`您确定要删除吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let delParam = { ids: [row.id] };
        this.delInvoiceApi(delParam);
      }).catch(() => {
      });
    },
    //批量删除
    delInvoiceList() {
      let selections = this.$refs.list.getSelections();
      let idArray = [];
      if (selections.length === 0) {
        this.$message.warning('请选择数据');
        return;
      }
      // 开票失败的蓝票可以删除，红票不能删除
      if (selections.some((item) => item.status == '02' && item.lzfpbz == 1)) {
        this.$message.warning('您选择的数据存在开票失败的数据，不允许删除操作');
        return;
      }

      let btgFlag = false;
      let kpzFlag = false;
      selections.forEach(item => {
        idArray.push(item.id);
        if (item.status == '01' || item.status == '03') {
          kpzFlag = true;
        }
      });
      if (kpzFlag) {
        this.$message.error('开票中的票据，不能刪除');
        return;
      }
      this.$confirm(`您确定要删除吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let delParam = { ids: idArray };
        this.delInvoiceApi(delParam);
      }).catch(() => {
      });

    },
    async delInvoiceApi(delParam) {
      this.loading = true;
      let res = await this.api.deleteInvoice(delParam);
      if (res && res.code == 0) {
        this.$message.success("删除成功");
        this.$refs.list.reload();
      }
      this.loading = false;
    },

    async checkOpenInvoiceApi(openParam) {
      let res = await this.api.checkOpenInvoice(openParam);
      return res;
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
      if (cellValue == '0') {
        return { txt: '蓝票', clazz: 'blue-cell' }
      } else if (cellValue == '1') {
        return { txt: '红票', clazz: 'red-cell' }
      }
    },
    //错误信息
    showErrorMsg(data) {
      let that = this;
      that.errorMsg = data.kpsbyy;
      that.errorDialog = true;
    },

    //审核信息
    showShxxMsg(data) {
      let that = this;
      that.backMsg = data.shxx;
      that.backDialog = true;
    },
    /**
     * 编辑
     * @param row
     */
    editInvoice(row) {
      this.$router.push({
        path: '/outputInvoice/blueInvoice/BlueInvoiceForm',
        query: {
          invoiceId: row.id,
          isFormInvoiced: 'N'
        }
      })
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
    },
    getSearchParam(param) {
      this.queryParam = param;
    },
    async downloadNoList() {
      const fileName = `未开票信息列表.xlsx`
      const ids = this.$refs.list.getSelections().map((item) => item.id)
      await this.api.downLoadNoOpenList({
        reqData: { ...this.queryParam ,idKeys:ids},
        fileName
      })
    }
  }
};
</script>
<style scoped lang="scss">
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