<template>
  <div class="main-content SensitiveCargo">
    <div class="left-nav">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>

      <el-tree
        class="filter-tree"
        :data="data"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree"
        node-key="id"
        :expand-on-click-node="false"
        highlight-current
        check-on-click-node
        @node-click="nodeClick"
        :current-node-key="currentNodeKey"
      >
      </el-tree>
    </div>
    <div class="right-content">
      <!-- <h3 class="company-name">杉杉股份</h3> -->
      <form-list
        :columns="columns"
        :searchKey="propsKey"
        :searchRow="searchList"
        :api="api"
        :param="param"
        v-loading="loading"
        @getSearchParam="getSearchParam"
        @getNextList="getOrgList"
        :firstLoading="false"
        ref="list"
        :height="height"
      >
        <!-- 中间部分 -->
        <template #topTool>
          <div class="toolbar">
            <div class="toolbar-left" />
            <div class="toolbar-right">
              <el-button type="primary" @click="handleAdd">新增</el-button>
              <el-button @click="importExcel">导入</el-button>
              <el-button @click="handleExport">导出</el-button>
            </div>
          </div>
        </template>
        <!-- 操作按钮 -->
        <template #myscope="{ data }">
          <template>
            <!-- 待我确认的 -->
            <el-button @click.stop="handleInvoice(data)" type="success">编辑</el-button>
            <el-button @click.stop="handleInvoice(data)" type="success">删除</el-button>
          </template>
        </template>
        <template #xmje="{ data }">{{ formatMoney(data.xmje) }}</template>
        <template #xmse="{ data }">{{ formatMoney(data.xmse) }}</template>
        <template #kplx="{ data }">{{ data.kplx == 1 ? '红票' : '蓝票' }}</template>
        <template #kprq="{ data }"> {{ dateFormat('YYYY-mm-dd', data.kprq) }} </template>
      </form-list>
    </div>
    <custom-import
      dialogTitle="导入敏感税收分类编码表"
      :dialogVisible="dialogImportVisible"
      @handleClose="handleImportClose"
      @handleOk="handleImportOk"
      downloadTemplateApi="/taxConfig/downExcel"
      downloadTemplateName="敏感税收分类编码_导入模板"
      upApi="/taxBody/importTaxBodyExcelInfo"
      importApi="/taxConfig/importPreferentialInfo"
      upTitle="上传敏感税收分类编码"
      :importColumns="importColumns"
    ></custom-import>
    <el-dialog title="新增" :visible.sync="addVisible" width="50%" :before-close="handleAddClose" class="form-dialog">
      <el-form :inline="true" :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="敏感税收分类编码" prop="mghwmc">
          <el-input v-model="editForm.mghwmc" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="风险等级" prop="fxdj">
          <el-select v-model="editForm.fxdj" placeholder="请选择">
            <el-option label="强" :value="1"></el-option>
            <el-option label="弱" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生效日期" prop="sxrq">
          <el-date-picker value-format="yyyyMMdd" v-model="editForm.sxrq" type="date" placeholder="请选择" />
        </el-form-item>
        <el-form-item label="失效日期" prop="invalidrq">
          <el-date-picker value-format="yyyyMMdd" v-model="editForm.sxrq" type="date" placeholder="请选择" />
        </el-form-item>
        <el-form-item label="备注" prop="bz">
          <el-input v-model="editForm.bz" maxlength="100" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddClose">取 消</el-button>
        <el-button type="success" @click="saveData">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import CustomImport from '@/components/CustomImport';
import FormList from '@/components/FormList.vue';
import { dateFormat } from '@/utils/tool';
import { getListByUser, getOrgList, exportInvoiceDetailList } from './Api.js';
export default {
  name: 'SensitiveCargo',
  components: {
    FormList,
    CustomImport,
  },
  data() {
    return {
      dialogImportVisible: false, // 导入
      filterText: '',
      currentNodeKey: 1,
      data: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1',
                },
                {
                  id: 10,
                  label: '三级 1-1-2',
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1',
            },
            {
              id: 6,
              label: '二级 2-2',
            },
          ],
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1',
            },
            {
              id: 8,
              label: '二级 3-2',
            },
          ],
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      param: {},
      api: require('./Api'),
      loading: false,
      columns: [
        { type: 'selection', width: 50 },
        { title: '序号', type: 'index', width: 50 },
        { title: '敏感税收分类编码', width: 200, dataIndex: 'nsrmc' },
        { title: '风险等级', width: 200, dataIndex: 'orgName' },
        { title: '备注', width: 150, dataIndex: 'fplxMc' },
        { title: '生效日期', width: 150, dataIndex: 'fphm' },
        { title: '失效日期', width: 100, dataIndex: 'kplx', slot: 'kplx' },
        { title: '维护人', width: 100, dataIndex: 'kprq', slot: 'kprq', align: 'center' },
        {
          title: '操作',
          key: 'action',
          width: 100,
          scopedSlots: { customRender: 'action' },
        },
      ],
      importColumns: [
        { title: '敏感税收分类编码', width: 200, dataIndex: 'nsrmc' },
        { title: '风险等级', width: 200, dataIndex: 'orgName' },
      ],
      searchList: [
        {
          label: '敏感税收分类编码',
          key: 'nsrsbh',
          val: '',
          type: 'select',
          placeholder: '请选择',
          options: [],
          isQueryNext: true,
          nextPropskey: 'orgid',
        },
        {
          label: '有效日期',
          key: 'kprq',
          val: [],
          type: 'daterange',
          placeholder: '请选择',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          },
        },
        { label: '风险等级', key: 'orgid', val: '', type: 'select', placeholder: '请选择' },
      ],
      taxBodyList: [],
      queryParam: {},
      propsKey: '',
      addVisible: false,
      editForm: {},
      rules: {
        mghwmc: [{ required: true, message: '请输入', trigger: 'change' }],
        fxdj: [{ required: true, message: '请选择', trigger: 'change' }],
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    handleAdd() {
      this.addVisible = true;
    },
    handleAddClose() {
      this.addVisible = false;
    },
    saveData() {
      this.$refs['editForm'].validate(async valid => {
        if (!valid) return;
        // const { code = '' } = await updateDrawback([{ ...this.editForm }]);
        // if (code === '0') {
        //   this.$message.success('操作成功');
        //   this.handleClose();
        //   this.getList();
        // }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    dateFormat,
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({});
      if (code === '0') {
        this.searchList[0].options = [{ value: '', label: '全部' }].concat(
          data.map(item => {
            return {
              ...item,
              value: item.nsrsbh,
              label: `${item.nsrmc} ${item.nsrsbh}`,
            };
          }),
        );
        if (!this.$route.query.nsrsbh) {
          // 直接访问
          this.getOrgList('');
          // this.getList();
        }
      }
    },
    // 获取会计主体
    async getOrgList(nsrsbh) {
      const { code = '', data = [] } = await getOrgList({
        nsrsbh,
        isInvoice: 'N', // 关联受票组织
      });
      if (code === '0') {
        this.searchList[1].options = [{ value: '', label: '全部' }].concat(
          data.map(item => {
            return {
              ...item,
              value: item.id,
              label: item.name + ' ' + item.code,
            };
          }),
        );
        this.searchList[1].val = '';
        this.param.orgid = '';
        this.$set(this.param, 'nsrsbh', nsrsbh);
        const { ssq, tbzq } = this.$route.query;
        this.propsKey = `${nsrsbh}_${ssq}_${tbzq}`;
      }
    },
    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh } = this.$route.query;
      this.$set(this.param, 'nsrsbh', nsrsbh);
      this.searchList[0].val = nsrsbh;
      this.$refs.list.handleGetData(this.param);
      this.getOrgList(nsrsbh);
    },
    // 导入
    importExcel() {
      this.dialogImportVisible = true;
    },
    handleImportClose() {
      this.dialogImportVisible = false;
    },
    handleImportOk() {
      this.handleImportClose();
      this.getList();
    },
    // 导出
    async handleExport() {
      const fileName = `销项发票明细.xlsx`;
      await exportInvoiceDetailList({
        reqData: {
          ...this.queryParam,
        },
        fileName,
      });
    },
    getList() {
      this.$refs.list && this.$refs.list.reload();
    },
    getSearchParam(param) {
      this.queryParam = param;
    },
    nodeClick(v, p, n) {
      console.log(v);
      this.currentNodeKey = v.id;
    },
  },
  mounted() {
    this.getListByUser();
  },

  computed: {
    height() {
      return window.innerHeight - 380;
    },
  },
};
</script>
<style lang="scss" scoped>
.SensitiveCargo {
  padding: 0;
  height: calc(100vh - 88px - 16px);
  display: flex;
  justify-content: space-between;
  .left-nav {
    width: 240px;
    flex-shrink: 0;
    padding: 12px;
    border-right: 8px solid #f1f4f5;
    overflow: hidden;
  }
  .right-content {
    flex: 1;
    padding: 12px;
    overflow: hidden;
    // .company-name {
    //   margin: 8px auto;
    //   color: #666;
    // }
  }
}
</style>
