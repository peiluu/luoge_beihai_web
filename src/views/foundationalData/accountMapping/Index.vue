<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <form-list :columns="columns" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" @getSearchParam="getSearchParam" ref="list">
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

      <template #jzjtbz="row"> {{ row.data.jzjtbz == '1' ? '是' : '否' }} </template>
      <template #myscope="{ data }">
        <el-popover placement="left" trigger="hover" popper-class="customPopper">
          <template>
            <el-button @click="addLine(data, 'edit')" type="primary">编辑</el-button>
            <el-button @click="deleteInfo(data)" type="danger">删除</el-button>
          </template>
          <el-button slot="reference">操作</el-button>

        </el-popover>
      </template>
    </form-list>

    <el-dialog :title="`${operatorType == 'add' ? '新增' : '编辑'}科目税率事项`" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
      <el-form :inline="true" :model="editForm" ref="editForm" :rules="rules">
        <!-- <el-form-item label="科目编号" prop="kmbh">
          <el-input v-model="editForm.kmbh" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="科目名称" prop="kmmc">
          <el-input v-model="editForm.kmmc" placeholder="请输入" />
        </el-form-item> -->
        <el-form-item label="科目编号" prop="kmbh">
          <el-select v-model="editForm.kmbh" filterable placeholder="请选择" @change="getAccountCodeAndName($event)">
            <el-option v-for="item in accountTypeList" :key="item.accSegmentCode" :label="`${item.accSegmentName} ${item.accSegmentCode}`" :value="`${item.accSegmentName}*${item.accSegmentCode}`">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科目名称" prop="kmmc">
          <el-input v-model="editForm.kmmc" placeholder="请输入" :disabled="true" />
        </el-form-item>
        <el-form-item label="业态" prop="ytmc">
          <el-select v-model="editForm.ytmc" filterable placeholder="请选择">
            <el-option v-for="item in this.businessList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="税率" prop="sl">
          <el-select v-model="editForm.sl" filterable placeholder="请选择">
            <el-option v-for="item in slvList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="纳税主体" prop="nszt">
          <el-input v-model="editForm.nszt" placeholder="请输入" />
        </el-form-item> -->
        <el-form-item label="纳税主体名称" prop="nszt">
          <el-select v-model="editForm.nszt" filterable placeholder="请选择">
            <el-option v-for="item in taxBodyList" :key="item.id" :label="`${item.nsrmc} ${item.nsrsbh}`" :value="item.nsrsbh">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="征税项目" prop="zsxm">
          <el-select v-model="editForm.zsxm" filterable placeholder="请选择">
            <el-option v-for="item in zsxmList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="即征即退标志" prop="jzjtbz">
          <el-select v-model="editForm.jzjtbz" filterable placeholder="请选择">
            <el-option label="非即征即退科目" value="0" />
            <el-option label="即征即退科目" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="科目类型" prop="kmlx">
          <el-select v-model="editForm.kmlx" filterable placeholder="请选择">
            <el-option v-for="item in kmlxList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计税方式" prop="jsfs">
          <el-select v-model="editForm.jsfs" filterable placeholder="请选择">
            <el-option v-for="item in jsfs_List" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
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
import { zsxmList, slvList, jylxList, kmlxList, jsxm_stxs, jsfs_List } from '../constant';
import { addAccountMapping, updateAccountMapping, deleteAccountMapping, exportAccountMappingInfo, getAccountingSubject, getListByUser } from './Api.js'

export default {
  name: 'accountMapping',
  components: {
    FormList,
  },
  props: {
    taxBodyId: {},
  },
  data() {
    return {
      editForm: {},
      param: {},
      api: require('./Api'),
      loading: false,
      columns: [
        { type: "selection", width: 50 },
        { title: '序号', type: "index", width: 50 },
        { title: "科目编号", width: 100, dataIndex: "kmbh" },
        { title: "科目名称", width: 230, dataIndex: "kmmc", },
        { title: "业态", width: 80, dataIndex: "ytmc", align: 'center' },
        { title: "税率", width: 60, dataIndex: "slv", align: 'center' },
        { title: "征税项目", width: 80, dataIndex: "zsxmmc", align: 'center' },
        { title: "即征即退标志", width: 100, dataIndex: "jzjtbz", slot: 'jzjtbz', align: 'center' },
        { title: "科目类型", width: 100, dataIndex: "kmlxmc", align: 'center' },
        { title: "计税方式", width: 140, dataIndex: "jsfsmc", align: 'center' },
        {
          title: "操作",
          key: "action",
          width: 80,
          scopedSlots: { customRender: "action" }
        }
      ],
      searchList: [
        { label: "科目编号", key: "kmbh", val: '', type: "input", placeholder: '请输入' },
        { label: "科目名称", key: "kmmc", val: '', type: "input", placeholder: '请输入' },
        {
          label: "所属业态",
          key: "ytmc",
          val: '',
          type: "select",
          options: []
        },
        { label: "科目类型", key: "kmlx", val: "", type: "select", placeholder: '请选择', options: [{ value: '', label: '全部' }].concat(kmlxList) },
        { label: "税率", key: "sl", val: "", type: "select", placeholder: '请选择', options: [{ value: '', label: '全部' }].concat(slvList) },
        { label: "征税项目", key: "zsxm", val: "", type: "select", placeholder: '请选择', options: [{ value: '', label: '全部' }].concat(zsxmList) },
      ],

      rules: {
        kmbh: [{ required: true, message: "请输入科目编号", trigger: "blur" }],
        kmmc: [{ required: true, message: "请输入科目名称", trigger: "blur" }],
        ytmc: [{ required: true, message: "请选择业态", trigger: "blur" }],
        sl: [{ required: true, message: "请选择税率", trigger: "blur" }],
        zsxm: [{ required: true, message: "请选择征税项目", trigger: "blur" }],
        jzjtbz: [{ required: true, message: "请选择即征即退标识", trigger: "blur" }],
        kmlx: [{ required: true, message: "请输入科目类型", trigger: "blur" }],
        jsfs: [{ required: true, message: "请选择计税方式", trigger: "blur" }],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      dialogVisible: false,
      zsxmList,
      slvList,
      jylxList,
      kmlxList,
      businessList: [],
      jsxm_stxs,
      jsfs_List,
      queryParam: {},
      operatorType: 'add',
      taxBodyList: [],
      accountTypeList: [],
    };
  },
  mounted() {
    this.getAccountingSubject();
    this.getListByUser();
    this.selectBusinessList();
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
    addLine(row, type) {//  新增\修改弹窗
      this.editForm = row || {}
      this.operatorType = type
      this.dialogVisible = true
    },

    // 导出
    async handleExport() {
      const fileName = `科目与税率映射关系.xlsx`
      await exportAccountMappingInfo({
        reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999, isInvoice: 'N' },
        fileName
      })
    },
    getList() {
      this.$refs.list && this.$refs.list.reload()

    },
    handleClose() {
      this.dialogVisible = false;
      this.form = {};
    },
    getSearchParam(param) {
      this.queryParam = param;
    },
    saveData() {
      this.$refs["editForm"].validate(async valid => {
        if (!valid) return;
        const api = this.operatorType === 'add' ? addAccountMapping : updateAccountMapping;
        const { code = '', } = await api({
          ...this.editForm
        })
        if (code === '0') {
          this.$message.success('操作成功')
          this.handleClose()
          this.handleSearch(this.queryParam)
        }
      })
    },
    handleSearch(queryParam) {
      this.queryParam = queryParam;
      this.getList();
    },
    deleteInfo(row) {
      this.$confirm(`您确定要删除吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code = '', data = [] } = await deleteAccountMapping({ id: row.id })
        if (code === '0') {
          this.$message.success('刪除成功')
          this.handleSearch(this.queryParam)
        }
      }).catch(() => { });
    },
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({})
      if (code === '0') {
        this.taxBodyList = data;
      }
    },
    /** 查询科目编码与名称 **/
    async getAccountingSubject() {
      const { code = '', data = [] } = await getAccountingSubject({})
      if (code === '0') {
        this.accountTypeList = data;
      }
    },
    getAccountCodeAndName(val) {
      console.log(val);
      this.editForm.kmbh = val.split("*")[1];
      this.editForm.kmmc = val.split("*")[0];
    },
    async selectBusinessList() {
      const { code = '', data = [] } = await this.api.selectBusinessList()
      if (code === '0') {
        const index = this.searchList.findIndex((item) => item.key === 'ytmc');
        this.businessList = data.map((item) => {
          return {
            value: item,
            label: item
          }
        });
        this.searchList[index].options = [{ value: "", label: "全部" }].concat(data.map((item) => {
          return {
            value: item,
            label: item
          }
        }))
      }
    },
  }
};
</script>
<style scoped lang="scss">
/deep/ .el-dialog__body {

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

