<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <form-list
      :columns="columns"
      :searchRow="SearchList"
      :api="api"
      :param="param"
      :height="height"
      v-loading="loading"
      :key="searchKey"
      :searchKey="searchKey"
      ref="list"
    >
      <template #myscope="row">
        <el-popover placement="left" trigger="hover" popper-class="customPopper">
          <template>
            <el-button v-if="row.data.status == 0" @click.stop="editDeclaration(row.data)" type="primary"
              >编辑</el-button
            >
            <el-button
              v-if="row.data.status == 0 || row.data.status == 1"
              @click.stop="delDeclaration(row.data)"
              type="danger"
              >删除</el-button
            >
            <el-button
              v-if="row.data.status == 0 || row.data.status == 1"
              @click.stop="fillDeclaration(row.data)"
              type="primary"
              >填报</el-button
            >
            <el-button v-if="row.data.status == 1" @click.stop="submitDeclaration(row.data)" type="primary"
              >提交</el-button
            >
            <el-button
              v-if="row.data.status == 2 || row.data.status == 3"
              @click.stop="toDeclareForm(row.data)"
              type="primary"
              >查看</el-button
            >
            <el-button v-if="row.data.status == 2" @click.stop="undoDeclaration(row.data)" type="primary"
              >撤销</el-button
            >
            <el-button v-if="row.data.status == 2" @click.stop="uploadDeclaration(row.data)" type="primary"
              >上传完税凭证</el-button
            >
          </template>
          <el-button slot="reference">操作</el-button>
        </el-popover>
      </template>
      <template #topTool>
        <div class="toolbar">
          <div class="toolbar-left" />
          <div class="toolbar-right">
            <el-button type="primary" @click="addDeclaration">新增</el-button>
            <el-button type="primary" @click="batchSubmitDeclaration">提交</el-button>
            <el-button type="danger" @click="batchDelDeclaration">删除</el-button>
            <el-button type="primary" @click="exportDeclaration">导出</el-button>
          </div>
        </div>
      </template>

      <template #declareDate="row">
        {{ fmtDeclareDate(row) }}
      </template>

      <template #status="row">
        {{ fmtStatus(row) }}
      </template>
    </form-list>

    <el-dialog :title="title" :visible.sync="dlgVisible" width="60%" :before-close="handleClose">
      <el-form ref="dlgForm" :model="dlgForm" :rules="dlgRules" size="mini" inline>
        <el-form-item label="纳税主体" prop="nsrmc">
          <el-select size="small" filterable v-model="dlgForm.nsrmc" @change="taxBodyChange">
            <el-option
              v-for="option in taxBodyOptions"
              :key="option.id"
              :label="option.nsrmc + ' ' + option.nsrsbh"
              v-model="option.nsrmc"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="nsrsbh">
          <el-input disabled size="small" v-model="dlgForm.nsrsbh"></el-input>
        </el-form-item>
        <el-form-item label="所属业态" prop="business">
          <el-input disabled size="small" v-model="dlgForm.business"></el-input>
        </el-form-item>
        <el-form-item label="所属省份" prop="taxArea">
          <el-input disabled size="small" v-model="dlgForm.taxArea"></el-input>
        </el-form-item>
        <el-form-item label="所属区域" prop="region">
          <el-input disabled size="small" v-model="dlgForm.region"></el-input>
        </el-form-item>
        <el-form-item label="申报税种" prop="sbsz">
          <el-select size="small" class="form-inline-input" v-model="dlgForm.sbsz">
            <el-option key="zzs" label="增值税" value="zzs"></el-option>
            <el-option key="sds" label="企业所得税" value="sds"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申报周期" prop="period">
          <el-input disabled size="small" v-model="dlgForm.period"></el-input>
        </el-form-item>
        <el-form-item size="small" label="税款所属期" prop="declareDate">
          <QuarterDatePicker
            :key="dlgForm.period"
            :pickerType="dlgForm.period"
            :defaultValue="dlgForm.declareDate"
            propsParam="declareDate"
            @getQuarterPickerFrom="getQuarterPickerFrom"
            ref="quarterDatePicker"
          />
        </el-form-item>
        <el-form-item label="申报内容" prop="templateId">
          <el-select disabled size="small" class="form-inline-input" v-model="dlgForm.templateId">
            <el-option
              v-for="option in templateOptions"
              :key="option.id"
              :label="option.templateName"
              v-model="option.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-footer style="text-align: right; margin-top: 50px">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="success" @click="handleSubmit">确 定</el-button>
      </el-footer>
    </el-dialog>

    <el-dialog title="上传完税凭证" :visible.sync="uploadVisible" width="800px" :before-close="handleUploadClose">
      <el-form ref="uploadForm" :model="uploadForm" :rules="uploadRules" :inline="true" size="small">
        <el-form-item label="选择完税凭证" style="width: 100%">
          <el-upload
            ref="upload"
            action=""
            :multiple="true"
            :limit="2"
            :auto-upload="false"
            :on-change="changeReceipt"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-footer style="text-align: right">
        <el-button @click="handleUploadClose">取 消</el-button>
        <el-button type="success" @click="handleUploadSubmit">确 定</el-button>
      </el-footer>
    </el-dialog>

    <!--申报明细数据确认-->
    <DetailConfirmModal
      v-if="detailConfirmVisible"
      :detailConfirmVisible="detailConfirmVisible"
      :curRow="curRow"
      @closeDetailConfirm="closeDetailConfirm"
      @submitDetailConfirm="submitDetailConfirm"
    >
    </DetailConfirmModal>
  </div>
</template>

<script>
import FormList from '@/components/FormList.vue';
import QuarterDatePicker from '@/components/QuarterDatePicker.vue';
import DetailConfirmModal from './DetailConfirmModal/Index.vue';
export default {
  name: 'TaxDeclaration',
  components: {
    FormList,
    QuarterDatePicker,
    DetailConfirmModal,
  },
  data() {
    return {
      form: {},
      api: require('./Api'),
      templateApi: require('../reportTools/templateMng/Api'),
      param: {},
      searchKey: '',
      loading: false,

      pickerType: '月',

      dlgVisible: false,
      title: '新增申报表',
      templateOptions: [],
      taxBodyOptions: [],
      dlgForm: {},
      dlgRules: {
        nsrmc: [{ required: true, message: '内容必填', trigger: 'blur' }],
        nsrsbh: [{ required: true, message: '内容必填', trigger: 'blur' }],
        sbsz: [{ required: true, message: '内容必填', trigger: 'blur' }],
        templateId: [{ required: true, message: '内容必填', trigger: 'blur' }],
        period: [{ required: true, message: '内容必填', trigger: 'blur' }],
        //  declareDate: [{ required: true, message: '内容必填', trigger: 'blur' }],
      },

      uploadVisible: false,
      uploadForm: {},
      uploadRules: {},
      fileList: [],

      columns: [
        { type: 'selection', width: 50 },
        { title: '序号', type: 'index', width: 50 },
        { title: '纳税主体', dataIndex: 'nsrmc', width: 100 },
        { title: '纳税人识别号', width: 100, dataIndex: 'nsrsbh' },
        { title: '所属业态', width: 60, dataIndex: 'business' },
        { title: '所属省份', width: 60, dataIndex: 'taxArea' },
        { title: '申报内容', width: 150, dataIndex: 'templateName' },
        { title: '申报周期', width: 60, dataIndex: 'period' },
        { title: '税款所属期', width: 60, dataIndex: 'declareDate', slot: 'declareDate' },
        { title: '填报状态', width: 60, dataIndex: 'status', slot: 'status' },
        { title: '所属区域', width: 60, dataIndex: 'region' },
        { title: '操作', key: 'action', width: 80, scopedSlots: { customRender: 'action' } },
      ],
      SearchList: [
        {
          label: '纳税主体',
          key: 'nsrsbh',
          val: '',
          type: 'select',
          options: [{ label: '全部', value: '' }],
        },
        {
          label: '申报时间',
          key: 'declareDate',
          val: [],
          type: 'monthrange',
          valueFormat: 'yyyyMM',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          },
        },
        {
          key: 'templateId',
          val: '',
          type: 'select',
          options: [{ label: '全部', value: '' }],
          label: '申报内容',
          placeholder: '',
        },
        {
          key: 'status',
          val: '',
          type: 'select',
          options: [
            { label: '全部', value: '' },
            { label: '未填报', value: '0' },
            { label: '已填报', value: '1' },
            { label: '已提交', value: '2' },
            { label: '已冻结', value: '3' },
          ],
          label: '状态',
          placeholder: '',
        },
      ],

      detailConfirmVisible: false,
      curRow: {},
    };
  },
  created() {
    this.getTemplateTypeList();
    this.getTaxBody({});
    this.$set(this.param, 'nsrsbh', this.queryParam.nsrsbh || '');
    if (this.queryParam.ssq) {
      this.$set(this.param, 'declareDate', [this.queryParam.ssq, this.queryParam.ssq]);
    }
    this.$set(this.param, 'templateId', this.queryParam.templateId || '');
  },
  watch: {
    // 'dlgForm.period'(newVal,oldVal){
    //   if(newVal=='月'){
    //     this.pickerType = 'month'
    //   }else if(newVal=='季'){
    //     this.pickerType = 'quarter'
    //   }
    // },
    'dlgForm.sbsz'(newVal, oldVal) {
      this.reportTemplate(this.dlgForm.nsrsbh, newVal);
    },
    queryParam(newVal, oldVal) {
      if (newVal && newVal.nsrsbh) {
        this.$set(this.param, 'nsrsbh', newVal.nsrsbh || '');
        if (this.queryParam.ssq) {
          this.$set(this.param, 'declareDate', [newVal.ssq, newVal.ssq]);
        }
        this.$set(this.param, 'templateId', newVal.templateId || '');
        this.$set(this, 'searchKey', newVal.nsrsbh + newVal.ssq + newVal.templateId);
      } else {
        this.$set(this.param, 'nsrsbh', '');
        this.$set(this.param, 'declareDate', []);
        this.$set(this.param, 'templateId', '');
        this.$set(this, 'searchKey', '');
      }
    },
  },
  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
    height() {
      return window.innerHeight - 310;
    },
    queryParam() {
      return this.$route.query;
    },
  },

  methods: {
    fmtStatus(row) {
      if (row.data.status == 0) {
        return '未填报';
      } else if (row.data.status == 1) {
        return '已填报';
      } else if (row.data.status == 2) {
        return '已提交';
      } else if (row.data.status == 3) {
        return '已冻结';
      }
    },
    fmtDeclareDate(row) {
      return this.formatAllDate(row.data.declareDate, row.data.period);
    },
    changeReceipt(param) {
      let suffixArr = param.name.split('.'),
        name = suffixArr[0];
      this.uploadForm.file = param.raw;
      this.fileList = [this.uploadForm.file];
    },
    getQuarterPickerFrom(propsParam, data) {
      this.dlgForm[propsParam] = data;
    },
    getTemplateTypeList() {
      this.SearchList[2].options = [];
      this.templateApi.selectExpTemplateList({}).then((res) => {
        if (res.code === '0') {
          this.templateOptions = res.data;
          this.templateOptions.forEach((e) => {
            this.SearchList[2].options.push({ value: e.id + '', label: e.templateName });
          });
        }
      });
    },
    getTaxBody(param) {
      this.SearchList[0].options = [];
      this.api.getTaxBody(param).then((res) => {
        if (res.code === '0') {
          this.taxBodyOptions = res.data;
          this.taxBodyOptions.forEach((e) => {
            this.SearchList[0].options.push({ value: e.nsrsbh, label: `${e.nsrmc} ${e.nsrsbh}` });
          });
        }
      });
    },
    taxBodyChange(value, $event) {
      const option = this.taxBodyOptions.filter((item) => item.nsrmc == value);
      this.dlgForm.business = option[0].businessFormat;
      this.dlgForm.nsrsbh = option[0].nsrsbh;
      this.dlgForm.taxArea = option[0].taxArea;
      this.dlgForm.region = option[0].region;
      this.reportTemplate(this.dlgForm.nsrsbh, this.dlgForm.sbsz);
    },
    reportTemplate(nsrsbh, type) {
      if (type && nsrsbh) {
        this.api.reportTemplate({ nsrsbh: nsrsbh, type: type }).then((res) => {
          if (res.code === '0') {
            if (res.data) {
              this.$set(this.dlgForm, 'templateId', res.data.templateId);
              this.$set(this.dlgForm, 'period', res.data.tbzq);
            } else {
              this.$message({
                type: 'info',
                message: '请先对该主体进行申报设置',
              });
              this.$set(this.dlgForm, 'templateId', '');
              this.$set(this.dlgForm, 'period', '');
            }
          }
        });
      }
    },
    handleOk() {
      this.$refs.list.reload();
    },
    handleClose() {
      this.dlgForm = {};
      if (this.$refs.quarterDatePicker) {
        this.$refs.quarterDatePicker.reset();
      }
      this.dlgVisible = false;
    },
    handleSubmit() {
      let that = this;
      that.$refs.dlgForm.validate((valid) => {
        if (valid) {
          if (!that.dlgForm.declareDate) {
            that.$message({
              type: 'warning',
              message: '请选择税款所属期!',
            });
            return;
          }
          that.api.saveTaxDeclaration(that.dlgForm).then((res) => {
            if (res.code === '0') {
              that.handleOk();
              that.dlgVisible = false;
            }
          });
        }
      });
    },
    submitDeclaration(data) {
      this.api.batchUpdateStatus({ ids: [data.id], status: 2 }).then((res) => {
        if (res.code === '0') {
          this.$message({
            message: '操作成功',
            type: 'success',
          });
          this.handleOk();
        }
      });
    },
    batchSubmitDeclaration() {
      const selections = this.$refs.list.getSelections();
      const ids = [];
      for (var i = 0; i < selections.length; i++) {
        var e = selections[i];
        ids.push(e.id);
        if (e.status != 1) {
          this.$message({
            message: '选中的第' + (i + 1) + '条记录不为已填报状态，无法提交',
            type: 'warning',
          });
          return;
        }
      }
      if(ids.length === 0){
        this.$message({
          message: '请先选择要提交的纳税主体',
          type: 'warning',
        });
        return;
      }
      this.api.batchUpdateStatus({ ids: ids, status: 2 }).then((res) => {
        if (res.code === '0') {
          this.$message.success('操作成功');
          this.handleOk();
        }
      });
    },
    undoDeclaration(data) {
      this.api.batchUpdateStatus({ ids: [data.id], status: 1 }).then((res) => {
        if (res.code === '0') {
          this.$message.success('操作成功');
          this.handleOk();
        }
      });
    },
    uploadDeclaration(row) {
      this.uploadForm.id = row.id;
      this.uploadVisible = true;
    },
    handleUploadClose() {
      this.uploadVisible = false;
    },
    handleUploadSubmit() {
      let that = this;
      that.$refs.uploadForm.validate((valid) => {
        if (valid) {
          if (!that.uploadForm.file) {
            that.$message.error('请选择完税凭证');
            return;
          }
          // 新建form表单
          const fd = new FormData();

          // 将data转换为form-data
          Object.keys(this.uploadForm).forEach((key) => {
            fd.append(key, this.uploadForm[key]);
          });
          // 调用api提交
          this.api.saveTaxReceipt(fd).then((res) => {
            if (res.code == '0') {
              that.$message({
                type: 'success',
                message: '保存成功!',
              });
              that.handleOk();
              that.uploadVisible = false;
            }
          });
        }
      });
    },
    batchDelDeclaration() {
      const selections = this.$refs.list.getSelections();
      const ids = [];
      for (var i = 0; i < selections.length; i++) {
        var e = selections[i];
        ids.push(e.id);
        if (e.status != 0 && e.status != 1) {
          this.$message({
            message: '选中的第' + (i + 1) + '条记录不能无法删除',
            type: 'warning',
          });
          return;
        }
      }
      this.api.batchUpdateStatus({ ids: ids, status: 5 }).then((res) => {
        if (res.code === '0') {
          this.$message({
            message: '操作成功',
            type: 'success',
          });
          this.handleOk();
        }
      });
    },
    addDeclaration() {
      this.title = '新增申报表';
      this.dlgVisible = true;
    },
    editDeclaration(row) {
      this.dlgForm = row;
      this.title = '编辑申报表';
      this.dlgVisible = true;
    },
    delDeclaration(row) {
      let that = this;
      this.$confirm('确认删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          that.api.delDeclaration(row.id).then((res) => {
            if (res.code === '0') {
              that.handleOk();
              that.$message({
                type: 'success',
                message: '删除成功!',
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    toDeclareForm(row) {
      if (row) this.curRow = row;
      const path = '/taxDeclaration/fillDeclaration'
      this.$eventBus.$emit('removeCachePage', path)
      this.$router.push({
        path,
        query: { taxDeclarationId: this.curRow.id, templateId: this.curRow.templateId, status: this.curRow.status },
      });
    },
    fillDeclaration(row) {
      this.curRow = row;
      this.detailConfirmVisible = true;
      // this.toDeclareForm(row);
    },
    submitDetailConfirm() {
      this.closeDetailConfirm();
      this.toDeclareForm();
    },
    closeDetailConfirm() {
      this.detailConfirmVisible = false;
    },
    exportDeclaration() {
      const fileName = `纳税申报记录.xlsx`;
      this.api.exportDeclaration({
        reqData: { ...this.param },
        fileName,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  .el-form-item:nth-of-type(6) {
    .el-form-item__label::before {
      content: '*';
      color: #f56c6c;
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
      width: calc(100% - 220px);

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
