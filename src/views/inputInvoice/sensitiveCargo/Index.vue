<template>
  <div class="main-content SensitiveCargo">
    <div class="left-nav">
      <div class="nav-search"><el-input placeholder="输入纳税人名称/纳税人识别号" v-model="filterText"> </el-input></div>
      <el-tree
        class="filter-tree"
        :data="data"
        :props="{
          // children: 'children',
          label: 'nsrmc',
        }"
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree"
        node-key="nsrsbh"
        :expand-on-click-node="false"
        check-on-click-node
        @node-click="nodeClick"
        @check="nodeClick"
        :current-node-key="nsrsbh"
        :default-checked-keys="[nsrsbh]"
        v-loading="leftLoading"
        show-checkbox
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <el-tooltip effect="light" :content="`${node.label} ${data.nsrsbh}`" placement="right">
            <span>{{ node.label }}</span>
          </el-tooltip>
        </span>
      </el-tree>
    </div>
    <div class="right-content">
      <!-- <h3 class="company-name">杉杉股份</h3> -->
      <form-list
        :columns="columns"
        :searchRow="searchList"
        :api="api"
        :param="param"
        v-loading="loading"
        @getSearchParam="getSearchParam"
        @handleSelection="handleSelection"
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
              <el-button @click="del">删除</el-button>
              <el-button @click="importExcel">导入</el-button>
              <el-button @click="handleExport">导出</el-button>
            </div>
          </div>
        </template>
        <!-- 操作按钮 -->
        <template #myscope="{ data }">
          <template>
            <!-- 待我确认的 -->
            <el-button @click.stop="handleAdd(data)" type="text">修改</el-button>
          </template>
        </template>
        <template #xmje="{ data }">{{ formatMoney(data.xmje) }}</template>
        <template #xmse="{ data }">{{ formatMoney(data.xmse) }}</template>
        <template #kplx="{ data }">{{ data.kplx == 1 ? '红票' : '蓝票' }}</template>
        <template #kprq="{ data }"> {{ dateFormat('YYYY-mm-dd', data.kprq) }} </template>
      </form-list>
    </div>
    <custom-import
      dialogTitle="导入敏感货物信息表"
      :dialogVisible="dialogImportVisible"
      @handleClose="handleImportClose"
      @handleOk="handleImportOk"
      downloadTemplateApi="/dishonest/downExcel"
      :downloadTemplateApiParams="{type:'MGHWXX'}"
      downloadTemplateName="敏感货物信息_导入模板"
      upApi=""
      importApi="/dishonest/importIncomeSensitiveGoods"
      :importParams="{nsrsbh}"
      upTitle="上传敏感货物信息"
      :importColumns="importColumns"
    ></custom-import>
    <el-dialog :title="editForm.id ? '修改' : '新增'" :visible.sync="addVisible" width="690px" :before-close="handleAddClose" class="form-dialog">
      <el-form :inline="true" :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="敏感货物名称" prop="mghwmc">
          <el-input v-model="editForm.mghwmc" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="风险等级" prop="fxdj">
          <el-select v-model="editForm.fxdj" placeholder="请选择">
            <el-option v-for="item in fxdjOpts" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生效日期" prop="sxrqq">
          <el-date-picker value-format="yyyy-MM-dd" v-model="editForm.sxrqq" type="date" placeholder="请选择" @change="handleSxrqq"/>
        </el-form-item>
        <el-form-item label="失效日期" prop="sxrqz">
          <el-date-picker value-format="yyyy-MM-dd" v-model="editForm.sxrqz" type="date" placeholder="请选择" :picker-options="{disabledDate}" @change="handleSxrqz"/>
        </el-form-item>
        <el-form-item label="备注" prop="bz">
          <el-input v-model="editForm.bz" maxlength="100" placeholder="请输入" type="textarea" :rows="4" show-word-limit />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddClose">取 消</el-button>
        <el-button type="success" @click="saveData" :loading="saveLoading">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import CustomImport from '@/components/CustomImport';
import FormList from '@/components/FormList.vue';
import { dateFormat } from '@/utils/tool';
import { getListByUser, exportMghw, delById, addMghw, updateMghw } from './Api.js';
export default {
  name: 'SensitiveCargo',
  components: {
    FormList,
    CustomImport,
  },
  data() {
    const fxdjOpts = [
      { value: '1', label: '强' },
      { value: '2', label: '弱' },
    ];
    return {
      dialogImportVisible: false, // 导入
      filterText: '',
      nsrsbh: '',
      data: [],
      param: {},
      api: require('./Api'),
      loading: false,
      fxdjOpts,
      columns: [
        { type: 'selection', width: 50 },
        { title: '序号', type: 'index', width: 50 },
        { title: '敏感货物名称', width: 200, dataIndex: 'mghwmc' },
        { title: '风险等级', width: 200, dataIndex: 'fxdjStr' },
        { title: '备注', width: 150, dataIndex: 'bz' },
        { title: '生效日期', width: 150, dataIndex: 'sxrqq' },
        { title: '失效日期', width: 100, dataIndex: 'sxrqz' },
        { title: '维护人', width: 100, dataIndex: 'updaterName', align: 'center' },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 80,
          scopedSlots: { customRender: 'action' },
        },
      ],
      importColumns: [
        { title: '敏感货物名称', width: 200, dataIndex: 'mghwmc' },
        { title: '风险等级', width: 200, dataIndex: 'fxdjStr' },
      ],
      searchList: [
        { label: '敏感货物名称', key: 'mghwmc', val: '', type: 'input', placeholder: '请输入' },
        // {
        //   label: '有效日期',
        //   key: 'yxrq',
        //   val: [],
        //   type: 'daterange',
        //   placeholder: '请选择',
        // pickerOptions: {
        //   disabledDate(time) {
        //     return time.getTime() > Date.now();
        //   },
        // },
        // },
        { label: '风险等级', key: 'fxdj', val: '', type: 'select', placeholder: '请选择', options: [{ value: '', label: '全部' }, ...fxdjOpts] },
      ],
      taxBodyList: [],
      selections: [], // 选中的行数据
      queryParam: {},
      addVisible: false,
      editForm: {
        mghwmc: '',
        fxdj: null,
        sxrqq: null,
        sxrqz: null,
        bz: '',
      },
      rules: {
        mghwmc: [{ required: true, message: '请输入', trigger: 'change' }],
        fxdj: [{ required: true, message: '请选择', trigger: 'change' }],
        sxrqq: [{ required: false, message: '请选择', trigger: 'change' }],
      },
      leftLoading: false,
      saveLoading: false,
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    handleSxrqq(v){
      if(this.editForm.sxrqz && new Date(this.editForm.sxrqz).getTime() < new Date(v).getTime()){
        // 生效日期不可以大于失效日期
        this.$set(this.editForm, 'sxrqz', null)
      }
    },
    handleSxrqz(v){
      if(v){
        this.$set(this.rules, 'sxrqq', [{ required: true, message: '请选择', trigger: 'change' }])
      } else {
        this.$set(this.rules, 'sxrqq', [{ required: false, message: '请选择', trigger: 'change' }])
        this.$refs.editForm && this.$refs.editForm.clearValidate('sxrqq');
      }
    },
    disabledDate(time) {
      // 限制失效日期不可以小于生效日期
      return this.editForm.sxrqq ? time.getTime() < new Date(this.editForm.sxrqq + ' 00:00:00').getTime(): false;
    },
    handleAdd(item) {
      if (item.id) {
        this.editForm = {...item};
      }
      this.handleSxrqz(item.sxrqz)
      this.addVisible = true;
    },
    del() {
      if (this.selections.length === 0) {
        return this.$message.error('请先勾选要删除的数据');
      }
      this.$confirm('此操作将永久删除勾选的数据, 您确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.goDel();
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
    },
    async goDel() {
      try {
        const ids = this.selections.map(item => item.id);
        const { code = '0', data } = await delById(ids);
        if (code === '0') {
          this.$message.success('删除成功');
          this.getList();
        }
      } catch (error) {}
    },
    handleAddClose() {
      this.addVisible = false;
      this.editForm = {
        mghwmc: '',
        fxdj: null,
        sxrqq: null,
        sxrqz: null,
        bz: '',
      };
      this.$refs.editForm.resetFields();
    },
    handleSelection(e) {
      this.selections = e;
    },
    saveData() {
      this.$refs['editForm'].validate(async valid => {
        if (!valid) return;
        // console.log(this.editForm);
        this.saveLoading = true;
        const params = {
          mghwmc: this.editForm.mghwmc,
          fxdj: this.editForm.fxdj,
          sxrqq: this.editForm.sxrqq,
          sxrqz: this.editForm.sxrqz,
          bz: this.editForm.bz,
          nsrsbh: this.nsrsbh,
        };
        let apiFn = addMghw;
        if (this.editForm.id) {
          // 修改
          apiFn = updateMghw;
          params.id = this.editForm.id;
        }
        try {
          const { code = '' } = await apiFn(params);
          if (code === '0') {
            this.$message.success('操作成功');
            this.handleAddClose();
            this.getList();
          }
        } catch (error) {
          console.log(error)
        } finally {
          this.saveLoading = false;
        }
        
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.nsrmc.indexOf(value) !== -1 || data.nsrsbh.indexOf(value) !== -1;
    },
    dateFormat,
    // 获取左侧公司树
    async getLeftTree() {
      this.leftLoading = true;
      const { code = '', data = [] } = await getListByUser({});
      this.leftLoading = false;
      if (code === '0' && data.length) {
        this.data = data.map(item => {
          return { ...item, children: [] };
        });
        const nsrsbh = data[0].nsrsbh;
        this.nsrsbh = nsrsbh;
        this.param = {
          nsrsbh,
        };
        // this.$refs.tree.setCurrentKey(nsrsbh);
        this.$refs.list.handleGetData({ nsrsbh }); // 查询右侧list
      }
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
      const fileName = `敏感货物明细.xlsx`;
      await exportMghw({
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
      this.$refs.tree.setCheckedKeys([v.nsrsbh]);
      this.nsrsbh = v.nsrsbh;
      this.param = { nsrsbh: v.nsrsbh };
      this.$refs.list.handleGetData({ nsrsbh: v.nsrsbh });
    },
  },
  mounted() {
    this.getLeftTree();
  },
  activated(){
    const { nsrsbh } = this;
    nsrsbh && this.$refs.list.handleGetData({ nsrsbh }); // 查询右侧list
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
    border-right: 8px solid #f1f4f5;
    height: 100%;
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
  .nav-search {
    padding: 12px;
  }
  .filter-tree {
    height: calc(100% - 55px);
    overflow: hidden;
    overflow-y: scroll;
    // overflow-x: auto ;
  }
}
.toolbar-right {
  /deep/ .el-button {
    margin-left: 10px;
  }
}
</style>
