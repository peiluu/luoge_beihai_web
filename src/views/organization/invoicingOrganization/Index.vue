<template>
  <div class="com-invoicing-organization">
    <form-list :columns="columns" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" @getSearchParam="getSearchParam" ref="list">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left">
            <!-- <el-input @keyup.enter.native="getList" @clear="getList" v-model="param.keyword" style="width: 300px; marginRight: 12px" placeholder="请输入纳税人名称/纳税人识别号码" clearable>
              <i slot="prefix" class="el-input__icon el-icon-search" @click="getList" />
            </el-input> -->
          </div>
          <div class="toolbar-right">
            <el-button type="success" @click="hanldeEnter('add')">新增开票组织</el-button>
            <el-button @click="batchOperate('batchEnable')">切换启停</el-button>
            <el-button @click="batchOperate('batchMoveOrg')">转移</el-button>
            <el-button @click="handleDelete('batchDel')">删除</el-button>
            <el-button @click="handleImport">导入</el-button>
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <template #enable="row"> {{ row.data.enable == 'Y' ? '是' : '否' }}</template>

      <template #myscope="{ data }">
        <el-popover placement="left" trigger="hover" popper-class="customPopper">
          <template>
            <el-button @click.stop="hanldeEnter('edit', data)" type="success">编辑</el-button>
            <el-button @click.stop="handleDelete('delete', data)" type="danger">删除</el-button>
            <el-button @click="batchOperate('moveOrg', data)" type="success">转移</el-button>
          </template>
          <el-button slot="reference">操作</el-button>
        </el-popover>
      </template>
    </form-list>

    <!-- dialog 转移 / 启停 -->
    <el-dialog :title="batchOperateTypeMap[batchOperateType]" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" class="dialog-form">
        <template v-if="['moveOrg', 'batchMoveOrg'].includes(batchOperateType)">
          <el-form-item label="转移至" prop="taxBodyId">
            <el-select v-model="form.taxBodyId" placeholder="请选择" filterable :disabled="$route.query.nsrsbh">
              <el-option v-for="item in taxBodyList" :label="item.nsrmc" :value="item.id" :key="item.id" />
            </el-select>
          </el-form-item>
          <div class="tips"><span>组织转移成功后会清空税控设备，请重新维护</span></div>
        </template>
        <template v-else>
          <el-form-item label="是否启用" prop="enable">
            <el-select v-model="form.enable" placeholder="请选择">
              <el-option label="是" value="Y" />
              <el-option label="否" value="N" />
            </el-select>
          </el-form-item>
        </template>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="success" @click="submit">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="detailVisible"
      :visible.sync="detailVisible"
      width="80%"
      :before-close="onClose"
      class="detail-dialog"
      destroy-on-close
    >
      <Detail :detailInfo="detailInfo" @onOk="onOk" @onClose="onClose"/>
    </el-dialog>
  </div>
</template>

<script>
import FormList from '@/components/FormList.vue';
import { getListAll, delOrg, moveOrg, setEnable, exportOrganizationInfo } from './Api.js'
import Detail from './Detail.vue'
export default {
  name: 'InvoicingOrganization',
  components: {
    FormList,
    Detail
  },
  props: {
    taxBodyId: {},
  },
  data() {
    return {
      form: {},
      param: {},
      api: require('./Api'),
      queryForm: {},
      loading: false,
      columns: [
        { type: "selection", width: 50 },
        { title: '序号', type: "index", width: 50 },
        { title: "组织编码", width: 100, dataIndex: "code", },
        { title: "组织名称", width: 150, dataIndex: "name", },
        { title: "所属主体", width: 150, dataIndex: "nsrmc", },
        { title: "启用状态", width: 100, dataIndex: "enable", slot: 'enable', align: 'center' },
        { title: "所属账套编码", width: 100, dataIndex: "ssztCode" },
        // { title: "开票人", width: 100, dataIndex: "phone" },

        { title: "建立时间", width: 100, dataIndex: "createtime", align: 'center' },
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
          label: "所属纳税主体",
          key: "taxBodyId",
          val: '',
          type: "select",
          placeholder: '请选择',
          options: [],
        },
        {
          label: "组织编码",
          key: "orgCode",
          val: "",
          type: "input",
          placeholder: '请输入'
        },
        {
          label: "组织名称",
          key: "name",
          val: "",
          type: "input",
          placeholder: '请输入'
        },
        {
          label: "所属账套编码",
          key: "ssztCode",
          val: '',
          type: "input",
          placeholder: '请输入'
        },

      ],
      rules: {
        taxBodyId: [{ required: true, message: "请选择", trigger: "blur" }],
        enable: [{ required: true, message: "请选择", trigger: "blur" }],
      },
      dialogVisible: false,
      batchOperateType: '',
      batchOperateTypeMap: {
        'moveOrg': '转移页面',
        'batchMoveOrg': '转移页面',
        'enable': '启停设置',
        'batchEnable': '启停设置',
      },
      taxBodyList: [],
      queryParam: {},
      detailVisible: false,
      detailInfo: {
        operateType: '',
        id: null
      }
    };

  },
  mounted() {
    this.param.taxBodyId = this.taxBodyId.toString()
    this.getListAll()
    this.getList();
  },
  computed: {
    height() {
      return window.innerHeight - 310
    },
    selections() {
      return this.$refs.list.getSelections()
    }
  },

  methods: {
    onOk(){
      this.getList()
      this.onClose()
    },
    onClose(){
      this.detailVisible = false;
      this.detailInfo = {
        operateType: '',
        id: null,
      }
    },
    // 获取纳税主体
    async getListAll() {
      const { code = '', data = [] } = await getListAll({})
      const index = this.searchList.findIndex((item) => item.key === 'taxBodyId');
      if (code === '0') {
        this.taxBodyList = data;
        this.searchList[index].options = [{ value: "", label: "全部" }].concat(data.map((item) => {
          return {
            value: item.id,
            label: `${item.nsrmc} ${item.nsrsbh}`
          }
        }))
      }
    },

    // 批量操作
    batchOperate(type, data = {}) {
      this.batchOperateType = type
      if (this.selections.length == 0 && ['batchMoveOrg', 'batchEnable'].includes(type)) {
        this.$message.warning("未选择组织，请选择组织");
        return;
      }
      this.form = {
        ...data,
        taxBodyId: data && data.taxBodyId && data.taxBodyId.toString()
      }
      this.dialogVisible = true
    },

    // 删除
    handleDelete(type, data) {
      if (this.selections.length == 0 && type == 'batchDel') {
        this.$message.warning("未选择组织，请选择组织");
        return;
      }
      this.$confirm(`是否确定删除当前组织`, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const orgIds = type === 'delete' ? [data.id] : this.selections.map((item) => item.id)
        const { code = '' } = await delOrg({ orgIds });
        if (code === '0') {
          this.$message.success('删除成功');
          this.getList();
        }
      }).catch((res => { }))
    },

    //
    async submit() {
      this.$refs["ruleForm"].validate(async valid => {
        if (!valid) return;
        const param = {
          orgIds: this.batchOperateType === 'moveOrg' ? [this.form.id] : this.selections.map((item) => item.id),
          ...this.form,
        }
        if (this.batchOperateType === 'batchEnable') {
          this.setEnable(param)
        } else {
          this.moveOrg(param);
        }
      })
    },

    // 转移
    async moveOrg(param) {
      const { code = '' } = await moveOrg(param);
      if (code === '0') {
        this.$message.success('转移成功');
        this.handleClose();
        this.getList();
      }
    },
    // 启停
    async setEnable(param) {
      const { code = '' } = await setEnable(param);
      if (code === '0') {
        this.$message.success('操作成功');
        this.handleClose();
        this.getList();
      }
    },
    hanldeEnter(operateType, data = {}) {
      this.detailVisible = true;
      this.detailInfo = {
        operateType,
        id: data.id
      }
      // if (operateType === 'add') {
      //   sessionStorage.setItem('clearInvoicingOrganization', 1)
      // }
      // this.$router.push({
      //   path: '/organization/invoicingOrganizationDeatil',
      //   query: {
      //     operateType,
      //     id: data.id
      //   }
      // })
      // this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
    },
    getList() {
      this.$refs.list && this.$refs.list.reload()
    },
    // 导入
    handleImport() {
      sessionStorage.setItem('clearInvoiceOrganizationImport', 1)
      this.$router.push({ path: "/organization/invoiceOrganizationImport" })
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
    },
    getSearchParam(param) {
      this.queryParam = param;
    },
    async handleExport() {
      const fileName = `开票点组织信息列表.xlsx`
      await exportOrganizationInfo({
        reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999, isInvoice: 'Y' },
        fileName
      })
    },


    handleClose() {
      this.dialogVisible = false;
      this.form = {}
    },
  }
};
</script>
