<template>
  <div>
    <form-list :columns="columns" :height="height" :searchKey="propsKey" :searchRow="searchList" :api="api" :param="param" :firstLoading="false" v-loading="loading" @getSearchParam="getSearchParam" ref="list">
      <!-- 中间部分 -->
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left">
            <!-- <el-input @keyup.enter.native="getList" @clear="getList" v-model="param.keyword" style="width: 300px; marginRight: 12px" placeholder="请输入纳税人名称/纳税人识别号码" clearable>
              <i slot="prefix" class="el-input__icon el-icon-search" @click="getList" />
            </el-input> -->
          </div>
          <div class="toolbar-right">
            <!-- <el-button @click="openDigitalBatch('Y')">开通数电</el-button> -->
            <el-button type="success" @click="hanldeEnter('add')">新增纳税主体</el-button>
            <el-button @click="batchOperate('batchDel')">删除</el-button>
            <el-button @click="handleImport">导入</el-button>
            <el-button @click="handleExport" :loading="exportLoading">导出</el-button>
          </div>
        </div>
      </template>
      <template #isDigital="{ data }"> {{ data.isDigital == 'Y' ? '是' : '否' }}</template>
      <template #sffgs="{ data }"> {{ data.sffgs == 'Y' ? '是' : '否' }}</template>
      <template #city="{ data }"> {{ data.city || '' + data.area || '' }}</template>
      <template #zgsmc="{ data }"> {{ data.sffgs == 'Y' ? data.zgsmc : '' }}</template>
      <template #sfqkrzgx="{ data }"> {{ data.sfqkrzgx == 'Y' ? '是' : '否' }}</template>

      <template #myscope="{ data }">
        <el-popover placement="left" trigger="hover" popper-class="customPopper">
          <template>
            <el-button @click.stop="hanldeEnter('detail', data)" type="success">查看</el-button>
            <el-button @click.stop="hanldeEnter('edit', data)" type="success">编辑</el-button>
            <el-button @click.stop="batchOperate('delete', data)" type="danger">删除</el-button>
            <el-button @click.stop="batchOperate('digital', data)" type="success">切换数电开通</el-button>
            <el-button @click.stop="hanldeMaintenance(data, '3')" type="success">维护帐套</el-button>
            <el-button @click.stop="hanldeMaintenance(data, '2')" type="success">维护开票点</el-button>
          </template>
          <el-button slot="reference">操作</el-button>
        </el-popover>
      </template>
    </form-list>
    <el-dialog title="是否开通数电" :visible.sync="dialogVisible" width="40%" :before-close="handleClose" v-loading="digitalLoading">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" class="dialog-form">
        <el-form-item label="是否开通数电业务" prop="isDigital">
          <el-select v-model="form.isDigital" placeholder="请选择">
            <el-option label="是" value="Y" />
            <el-option label="否" value="N" />
          </el-select>
        </el-form-item>
        <template v-if="form.isDigital === 'Y'">
          <el-form-item label="开票方式" prop="djkpfs">
            <el-select v-model="form.djkpfs" placeholder="请选择">
              <el-option label="乐企直连" value="0" />
              <el-option label="RPA开票" value="1" />
            </el-select>
          </el-form-item>
           <!-- RPA开票 -->
          <template v-if="form.djkpfs === '1'">
            <el-form-item label="电子税务局身份" prop="dzswjsf">
              <el-select v-model="form.dzswjsf" placeholder="请选择">
                <el-option v-for="(item, index) in dzswjsfList" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="操作员姓名" prop="czyxm">
              <el-input v-model="form.czyxm" placeholder="请输入" maxlength="100" />
            </el-form-item>
            <el-form-item label="电子税务局账号" prop="dzswjzh">
              <el-input v-model="form.dzswjzh" placeholder="请输入" maxlength="100" auto-complete="off"/>
            </el-form-item>
            <el-form-item label="电子税务局密码" prop="dzswjmm">
              <el-input show-password v-model="form.dzswjmm" placeholder="请输入" maxlength="100" auto-complete="new-password"/>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmDzswjmm">
              <el-input show-password v-model="form.confirmDzswjmm" placeholder="请输入" maxlength="100" />
            </el-form-item>
          </template>

          <!-- 乐企直连 -->
          <template v-else>
            <el-form-item label="乐企ID" prop="lqid">
              <el-input v-model="form.lqid" placeholder="请输入" maxlength="30" />
            </el-form-item>
            <el-form-item label="乐企秘钥" prop="secretkey">
              <el-input v-model="form.secretkey" placeholder="请输入" maxlength="100" />
            </el-form-item>
          </template>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="success" @click="setIsDigital">保 存</el-button>
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
   <custom-import 
      dialogTitle="纳税主体信息"
      :dialogVisible="dialogImportVisible"
      @handleClose="onClose"
      @handleOk="onOk"
      downloadTemplateApi="/taxBody/downExcel/1"
      downloadTemplateName="纳税主体信息_导入模板"
      upApi="/taxBody/importTaxBodyExcelInfo"
      importApi="/taxBody/importTaxBodyInfo"
      upTitle="上传纳税主体信息"
      :importColumns="importColumns"
    ></custom-import>
  </div>
</template>

<script>
import FormList from '@/components/FormList.vue';
import { rgionEnum, cityEnum, provincesEnmu } from '@/config/regionEnums.js';
import { listCascaderDict, selectYtList, delTaxBodyBatch, setIsDigital, getListAll, selectQyList, downLoadApplyList, exportTaxBodyInfo, } from './Api.js'
import Detail from './Detail.vue'
import CustomImport from '@/components/CustomImport'
import { dzswjsfList } from '@/config/constant.js';
export default {
  name: 'organizationTaxBody',
  components: {
    FormList,
    Detail,
    CustomImport
  },
  data() {
    return {
      form: {},
      param: {},
      api: require('./Api'),
      loading: false,
      propKey: '',
      dzswjsfList,
      columns: [
        { type: "selection", width: 50, fixed: 'left', },
        { title: '序号', type: "index", width: 50, fixed: 'left', },
        { title: "纳税主体名称", width: 160, dataIndex: "nsrmc", },
        { title: "纳税主体识别号", width: 160, dataIndex: "nsrsbh", },
        { title: "地址", width: 160, dataIndex: "address", },
        { title: "电话号码", width: 160, dataIndex: "phone" },
        { title: "开户行名称", width: 160, dataIndex: "bank", },
        { title: "开户行账号", width: 160, dataIndex: "bankAccount", },
        // { title: "是否开通数电", width: 100, dataIndex: "isDigital", slot: 'isDigital', align: 'center' },
        { title: "所属业态", width: 100, dataIndex: "businessFormat", align: 'center' },
        { title: "所属区域", width: 140, dataIndex: "region" },
        { title: "是否强控入账勾选", width: 120, dataIndex: "sfqkrzgx", slot: 'sfqkrzgx'},
        { title: "包含开票组织数量", width: 120, dataIndex: "orgCount", align: 'right' },
        { title: "所属省份", width: 100, dataIndex: "province" },
        { title: "所属城市", width: 100, dataIndex: "city", },
        // { title: "所属区县", width: 100, dataIndex: "area", },
        // { title: "是否分公司", width: 100, dataIndex: "sffgs", slot: 'sffgs', align: 'center' },
        // { title: "总公司名称", width: 130, dataIndex: "zgsmc", slot: 'zgsmc' },
        { title: "开立时间", width: 100, dataIndex: "openDate", align: 'center' },
        { title: "乐企ID", width: 100, dataIndex: "lqid", },
        { title: "乐企密钥", width: 120, dataIndex: "secretkey", },
        {
          title: "操作",
          key: "action",
          width: 80,
          fixed: 'right',
          scopedSlots: { customRender: "action" }
        }
      ],
      importColumns:[
        { title: "纳税主体名称", width: 160, dataIndex: "nsrmc", },
        { title: "纳税主体识别号", width: 160, dataIndex: "nsrsbh", },
      ],
      searchList: [
        {
          label: "纳税主体",
          key: "taxBodyId",
          val: "",
          type: "select",
          placeholder: '请输入'
        },
        {
          label: "是否开通数电",
          key: "isDigital",
          val: '',
          type: "select",
          options: [
            { value: "", label: "全部" },
            { value: "Y", label: "是" },
            { value: "N", label: "否" }]
        },
        {
          label: "所属业态",
          key: "businessFormat",
          val: '',
          type: "select",
          options: []
        },
        {
          label: "所属区域",
          key: "region",
          val: '',
          type: "select",
          options: []
        },
        /*{
          label: "所属省份",
          key: "province",
          val: '',
          type: "select",
          options: [{ label: '全部', value: '' }, ...provincesEnmu]
        },
        {
          label: "所属城市",
          key: "city",
          val: '',
          type: "select",
          options: [{ label: '全部', value: '' }, ...cityEnum]
        },*/
        // {
        //   label: "所属省市区",
        //   key: "areaList",
        //   val: '',
        //   type: "areaCascader",
        //   options: [],
        //   separator: "",
        //   // showAllLevels: false,
        //   props: { value: 'txt', label: 'txt', checkStrictly: true }
        // },

      ],
      dialogVisibleEdit: false,
      dialogVisible: false,
      districts: [],
      qyList: [],
      batchOperateType: '',
      propsKey: '',
      taxBodyList: [],
      queryParam: {},
      rules: {
        isDigital: [{ required: true, message: "请选择", trigger: "blur" }],
        lqid: [{ required: true, message: "请输入", trigger: "blur" }],
        secretkey: [{ required: true, message: "请输入", trigger: "blur" }],
        djkpfs: [{ required: true, message: "请选择", trigger: "blur" }],
        dzswjsf: [{ required: true, message: "请选择", trigger: "blur" }],
        dzswjzh: [{ required: true, message: "请输入", trigger: "blur" }],
        dzswjmm: [{ required: true, message: "请输入", trigger: "blur" }],
        confirmDzswjmm: [{ required: true, message: "请输入", trigger: "blur" }],
        czyxm: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      editData: {
        operateType: '',
        id: null,
      },
      exportLoading: false,
      detailVisible: false,
      detailInfo: {
        operateType: '',
        id: null
      },
      dialogImportVisible: false,
      digitalLoading: false,
    };

  },
  mounted() {
    this.getListAll()
    this.listCascaderDict();
    this.selectYtList()
    this.selectQyList()
    this.getList()
  },
  computed: {
    height() {
      return window.innerHeight - 380
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
      this.dialogImportVisible  = false;
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
        this.propsKey = data && data[0].id
        this.searchList[index].options = [{ value: "", label: "全部" }].concat(data.map((item) => {
          return {
            value: item.id,
            label: `${item.nsrmc} ${item.nsrsbh}`
          }
        }))
      }
    },
    // 获取区域
    async listCascaderDict() {
      const { code = '', data = [] } = await listCascaderDict()
      // if (code === '0') {
      //   const index = this.searchList.findIndex((item) => item.key === 'areaList');
      //   this.searchList[index].options = data
      // }
    },
    /**
    * @desption 【组织管理】获取区域选择下拉
    */
    async selectQyList() {
      const { code = '', data = [] } = await selectQyList({})
      if (code === '0') {
        const index = this.searchList.findIndex((item) => item.key === 'region');
        this.searchList[index].options = [{ value: "", label: "全部" }].concat(data.map((item) => {
          return {
            value: item,
            label: item
          }
        }))
      }
    },
    /**
     * @desption 【组织管理】获取业态选择下拉
     */
    async selectYtList() {
      const { code = '', data = [] } = await selectYtList()
      if (code === '0') {
        const index = this.searchList.findIndex((item) => item.key === 'businessFormat');
        this.searchList[index].options = [{ value: "", label: "全部" }].concat(data.map((item) => {
          return {
            value: item,
            label: item
          }
        }))
      }
    },

    //  按钮操作
    batchOperate(type, data = {}) {
      this.batchOperateType = type
      if (this.selections.length == 0 && type === 'batchDel') {
        this.$message.warning("未选择企业，请选择企业");
        return;
      }
      this.form = {...data, confirmDzswjmm: data.dzswjmm}
      if (type === 'digital') {
        this.dialogVisible = true
        return;
      }
      this.delTaxBodyBatch();
    },

    openDigitalBatch(isDigital) {
      if (this.selections.length == 0) {
        this.$message.warning("未选择企业，请选择企业");
        return;
      }
      if (!this.selections.every((item) => item.lqid && item.secretkey)) {
        this.$message.warning("乐企ID和乐企密钥不能为空");
        return;
      }
      this.$confirm(`确定要开通数电吗`, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const ids = this.selections.map((item) => item.id);
        const { code = '' } = await this.api.openDigitalBatchApi({ ids, "isDigital": isDigital });
        if (code === '0') {
          this.$message.success('操作成功');
          this.getList();
        }
      }).catch(err=>{
        this.$message.error(err.msg || '操作失败')
      })
    },

    // 删除企业
    delTaxBodyBatch() {
      this.$confirm(`是否确定删除当前企业`, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {

        const ids = this.batchOperateType === 'delete' ? [this.form.id] : this.selections.map((item) => item.id)
        const { code = '' } = await delTaxBodyBatch({ ids });
        if (code === '0') {
          this.$message.success('删除成功');
          this.getList();
        }
      }).catch(err=>{
        this.$message.error(err.msg || '删除失败')
      })

    },
    // 切换数电开通
    async setIsDigital() {
      this.$refs["ruleForm"].validate(async valid => {
        if (!valid) return;
        if (this.form.isDigital === 'Y' && this.form.djkpfs == '1' && this.form.confirmDzswjmm !== this.form.dzswjmm) {
          this.$message.warning('两次输入的密码不一致！请重新输入');
          return
        }
        try {
          this.digitalLoading = true;
          const { code = '', msg } = await setIsDigital(this.form);
          if (code === '0') {
            this.$message.success('操作成功');
            this.dialogVisible = false
            this.getList();
          } else {
            this.$message.error(msg || '操作失败')
          }
        } catch (error) {
          console.log(error)
        } finally {
          this.digitalLoading = false;
        }
      })
    },
    hanldeEnter(operateType, data = {}) {
      this.detailVisible = true;
      this.detailInfo = {
        operateType,
        id: data.id
      }

    },
    // 维护开票点 / 受票点
    hanldeMaintenance(data, activeName) {
      const key =
      this.$emit('hanldeMaintenance', data.id, activeName)
    },
    getList() {
      this.$refs.list && this.$refs.list.reload()
    },
    //导入
    handleImport() {
      this.dialogImportVisible = true;
    },
    getSearchParam(param) {
      this.queryParam = param;
    },
    // 导出
    async handleExport() {
      const fileName = `纳税主体信息列表.xlsx`;
      this.exportLoading = true;
      await exportTaxBodyInfo({
        reqData: { ...this.queryParam, pageNo: -1, pageSize: -1 },
        fileName
      })
      // setTimeout()
      this.exportLoading = false;
    },

    handleClose() {
      this.dialogVisible = false;
      this.form = {}
    },

  }
};
</script>
<style lang="scss" scoped>
.detail-dialog {
  /deep/ .el-dialog__body {
    padding-top: 12px;
  }
}
.import-dialog {
  display: flex;
  align-items: center;
  /deep/ .el-dialog {
    margin-top: auto !important;
    margin-bottom: auto !important;
  }
}
</style>