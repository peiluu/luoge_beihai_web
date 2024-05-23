<template>
  <div class="">
    <el-dialog
      :title="title"
      :visible="visible"
      :width="width"
      @update:visible="updateVisible"
      :before-close="handleClose"
      v-loading="loading"
      :fullscreen="true"
    >
    <template slot="title">
      <article>
        <p>{{ title }}</p>
      </article>
      <article style="width: 30%; margin: 0 auto">
        <el-steps :active="actived" finish-status="success" align-center>
          <el-step title="选择流水"> </el-step>
          <el-step title="设置规则"> </el-step>
        </el-steps>
      </article>
    </template>
      
      <article class="step_main">
        <!-- 第一步 -->
        <article style="margin-top: 15px;" v-show="actived === 0">
          <article>
            <add-task-form @handleDoneSearch="handleDoneSearch">
              <template slot="btnBef">
                <span class="checkBox" style="margin-left:10px">
                  <el-checkbox size="mini" v-model="conditions" border @change=handleCheckBoxChange>按条件选择</el-checkbox>&nbsp; 
                  <el-tooltip class="item"  content="勾选！按条件搜索，数据将会被选中为流水！" placement="top">
                    <i class="el-icon-question" style="color: #E6A23C;"></i>
                  </el-tooltip>
                </span>
            
              </template>
            </add-task-form>
          </article>
          <el-card shadow="hover">
            <article class="table_header">
              <el-button size="mini" type="primary" @click="handleImport">导入流水</el-button>
              <el-button @click="addOrEdit">新增（流水）</el-button>
            </article>
          <article style="height:calc(100vh - 350px)">
            <el-table
              :data="tableData"
              :border="true"
              style="width: 100%"
              height="100%"
              row-key="sid"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" :selectable="checkSelectable" :reserve-selection="true"> </el-table-column>
              <el-table-column type="index" width="55" label="序号"> </el-table-column>
              <el-table-column prop="gflx" label="购方类型" width="100">
                <template slot-scope="row">
                  <span>{{row.row.gflx === '1'?'个人':row.row.gflx === '2'?'企业':''}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="gmfbh" label="购方编码" width="180" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="gmfmc" label="购方名称" width="180" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="sphfwssflhbbm" label="税收分类编码" width="140" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="xmmc" label="项目名称" width="140" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="ggxh" label="商品规格" width="160" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="dw" label="计量单位" width="100" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="sl" label="数量" width="80" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="je" label="金额（不含税价）" width="140" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="slv" label="税率" width="100" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="se" label="税额" width="100" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="lssj" label="流水时间" width="180" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="fpzt" label="状态" width="80" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="fphm" label="发票号码" width="180" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="kpd_id" label="开票点" width="180" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="org_id" label="账套" width="180" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="nsrsbh" label="销方纳税人识别号" width="180" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="nsrmc" label="销方纳税人名称" width="180" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="create time" label="上传时间" width="180" :show-overflow-tooltip="true"> </el-table-column>
            </el-table>
          </article>
          <article>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.currentPage"
              :page-sizes="page.pageSizes"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </article>
        </el-card>
        </article>
        <!-- 第二步 -->
        <article v-show="actived === 1">
          <el-form
            :model="intoForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item label="发票类型" prop="fppz">
                  <el-select v-model="intoForm.fppz" placeholder="请选择">
                    <el-option
                      v-for="item in fppzOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="开票限额" prop="fpxe">
                  <el-input-number
                    style="width: 100%"
                    v-model="intoForm.fpxe"
                    :max="100000000000"
                    :precision="2"
                    :controls="false"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="发票明细行数限制" prop="mxxz">
                  <el-input-number
                    style="width: 100%"
                    v-model="intoForm.mxxz"
                    :max="2000"
                    :precision="0"
                    :controls="false"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="纳税人名称">
                  <el-input v-model="intoForm.nsrmc" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="纳税人识别号">
                  <el-input v-model="intoForm.nsrsbh" disabled />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="24">
                <el-form-item label="文件上传" prop="fileList">
                  <article style="margin-bottom: 2px">
                    <el-button type="primary" plain @click="handleDownTel">
                      下载模板</el-button
                    >
                  </article>
                  <article>
                    <el-upload
                      ref="uploadRef"
                      class="upload-demo"
                      drag
                      :action="api"
                      multiple
                      :auto-upload="false"
                      :show-file-list="false"
                      :data="extraData"
                      name="file"
                      accept=".xlsx,.xls"
                      :limit="1"
                      :http-request="handleUploadFile"
                      :on-change="handleOnchange"
                    >
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">
                        将文件拖到此处，或<em>点击获取文件</em><br />
                        <span>
                          已添加文件 &nbsp;<em
                            >{{ `${fileList[0]?.name || ""}` }}
                          </em></span
                        >
                      </div> -->
                      <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    <!-- </el-upload>
                  </article>
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="6">
              <el-form-item label="" label-width="30px">
                <el-button type="primary" @click="handleUpload">上传</el-button>
              </el-form-item>
            </el-col> -->
            </el-row>
          </el-form>
        </article>
      </article>
      <add-task-import :visible.sync="importVisible" v-if="importVisible" title="流水导入" width="40%" @handleOk="handleImportDone"></add-task-import>
      <span slot="footer" class="dialog-footer">
        <el-button @click="actived = 0" v-if="actived === 1">上一步</el-button>
        <el-button @click="updateVisible(false)">取 消</el-button>
        <el-button
          type="primary"
          @click=" handleNext"
          v-if="actived === 0"
          >下一步</el-button
        >
        <el-button type="primary" @click="handleOpen" v-if="actived === 1"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <template>
  <div>
    <!-- :edit-form-data="formData" -->

    <new-addition
      :visible.sync="addVisible" 
      :on-save="handleSave"
      :on-close="handleClose"
    ></new-addition>
  </div>
</template>
  </div>
</template>

<script>
import { getInvoiceQuota, downBatchTelleData,taskJournalList } from "../../api";
import { config } from "@/config";
import { customPost } from "@/utils/request.js";
import newAddition from './newAddition/index.vue'
import addTaskForm from './addTaskForm/index.vue'
import addTaskImport from './addTaskImport/index.vue'
export default {
  name: "addTaskPage",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: "title",
    },

    width: {
      type: String,
      default: "45%",
    },
    respData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {addTaskForm,addTaskImport,newAddition},
  data() {
    const checkFpxe = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error("开票限额不能小于等于0"));
      } else {
        callback();
      }
    };
    return {
      intoForm: {
        ...this.respData,
        fpxe: undefined,
        mxxz: undefined,
        fppz: "",
      },
      rules: {
        fppz: [
          {
            required: true,
            message: "请选择发票类型",
            tigger: "blur",
          },
        ],
        fpxe: [
          {
            required: true,
            type: "number",
            message: "开票限额不能为空或不能小于等于0",
            tigger: "blur",
          },
          { validator: checkFpxe, tigger: "blur" },
        ],
        mxxz: [
          {
            required: true,
            type: "number",
            message: "明细限制不能为空",
            tigger: ["blur", "change"],
          },
        ],
      },

      fileList: [],
      extraData: {},
      api: `${config.host}/excelInvoice/upload`,
      loading: false,
      fppzOptions: [
        { label: "增值税专用发票", value: "01" },
        { label: "增值税普通发票", value: "02" },
      ],
      queryData: this.$route.query || {},
      actived: 0,
      tableData:[],
      //条件选择
      conditions:false,
      /* 导入字段 */
      importVisible:false,
      page:{
        currentPage:1,
        pageSizes:[10,15,20,30,50,75,100],
        pageSize:10,
      },
      total:0,
      where:{},
      addVisible:false,
      sumbitData:{},
    };
  },
  computed: {},
  watch: {
    respData: {
      handler(val) {
        this.intoForm = { ...val, mxxz: 1000, fppz: "" };
      },
    },
  },
  methods: {
    /* 初始化 */
    handleInit() {
      this.handleGetOrg();
    },
    /* 获取开票额度 */
    async handleGetOrg() {
      this.loading = true;
      const { orgId } = this.intoForm || {};
      try {
        let params = { orgId };
        const res = await getInvoiceQuota(params);
        if (res.code === "0") {
          this.intoForm.fpxe = res.data.amount || 0;
          this.intoForm.mxxz = 1000;
        }
      } catch (e) {
        console.error(e);
      } finally {
        const { nsrsbh, nsrmc } = this.$route.query || {};
        this.intoForm.nsrsbh = nsrsbh || "";
        this.intoForm.nsrmc = nsrmc || "";
        this.loading = false;
      }
    },
    /* 上传验证 */
    handleUpload() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.fileList.length <= 0)
            return this.$message.error("请至少选择一份文件！");
          this.loading = true;
          this.$refs.uploadRef.submit();
          // this.fileList.forEach(file => {
          //     this.$refs.uploadRef.submit(file.raw);
          // });
        }
      });
    },
    /* 上传文件 */
    handleUploadFile(option) {
      const { orgId, fppz, fpxe, nsrmc, nsrsbh, mxxz } = this.intoForm || {};
      const formData = new FormData();
      formData.append("file", option.file);
      formData.append("orgId", orgId);
      formData.append("fppz", fppz);
      formData.append("fpxe", fpxe);
      formData.append("nsrmc", nsrmc);
      formData.append("nsrsbh", nsrsbh);
      formData.append("mxxz", mxxz);
      customPost(
        this.api,
        { "Content-Type": "multipart/form-data" },
        formData,
        (res) => {
          if (res.code === 0 || res.code === "0") {
            this.$message.success("上传成功!");
            this.handlerUploadDone(true);
            this.updateVisible(false);
          }
        }
      ).finally(() => {
        this.loading = false;
      });
    },
    /* 添加文件或者上传文件触发事件 */
    handleOnchange(file, fileList) {
      this.fileList = fileList.filter((k) => k.status === "ready");
    },
    /* 上传回调 */
    handlerUploadDone(value) {
      this.$emit("done", value);
    },
    /* 关闭 */
    updateVisible(value) {
      this.$emit("update:visible", value);
    },

    /* 确认 */
    handleConfirm() {},

    /* 关闭前 */
    handleClose() {
      this.updateVisible(false);
    },
    /*提示确认框 */
    handleOpen() {
      //销售方为 ${this.queryData.nsrmc},纳税人识别号为 ${this.queryData.nsrsbh}
      this.$confirm(
        `<div>请确认开票主体！</div>
          <div>销售方名称：${this.queryData.nsrmc}</div>
          <div>纳税人识别号：${this.queryData.nsrsbh}</div>
          <div>发票类型：${
            this.queryData.fppz === "01" ? "增值税专用发票" : "增值税普通发票"
          }</div>`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          type: "warning",
        }
      )
        .then(() => {
          this.handleUpload();
        })
        .catch(() => {});
    },
    /* 模板下载 */
    handleDownTel() {
      const fileName = `蓝字发票批量开具任务模板.xlsx`;
      downBatchTelleData({ fileName }, null, true);
    },
    /* 导入 */
    handleImport(){
      this.importVisible = true;
    },
    /* 搜索按钮事件回调 */
    handleDoneSearch(val){
      this.where = {...val};
      this.handleDataList();
    },
    /* 获取流水列表 */
   async handleDataList(){
      let params = {
        pageNo:this.page.currentPage,
        pageSize:this.page.pageSize,
        ...this.where,
      }
      const res = await taskJournalList(params);
      console.log(res,"-09")
      if([0,'0'].includes(res.code)){
        this.tableData = [...res.data]
        this.total = res.totalCount || 0
      }
    },
    /* 选择改变 */
    handleSelectionChange(val){
      console.log(val,"-")
    },
    /* 分页变化 */
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.handleDataList()
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.handleDataList()
    },
    handleSave(formData) {
      this.isDialogVisible = false;
    },
    handleClose() {
      this.isDialogVisible = false;
    },
        // 新增
        addOrEdit() {
      // console.log('----row----', row);
      this.editForm = {...row};
      this.addVisible = true;
    },
    /* 条件选择变化 */
    handleCheckBoxChange(val){
      console.log(val,"098")
    },
    /* 上传完成返回 */
    handleImportDone(){
      this.handleDataList();
    },
    /* 表格勾选禁用 */
    checkSelectable(row){
      return !this.conditions
    },
    /* 下一步 */
    handeNext(){
      let queryContions = {};
      if(conditions){
        queryContions = {...this.where};
        this.sumbitData = {
          sfATjxzKp: 1,
          queryContions,
        }
      }else{
        this.sumbitData = {
          ids:[],
          sfATjxzKp: 0
        }
      }
      
      this.actived = 1;
    }
  },
  created() {},
  mounted() {
    this.handleInit();
    this.handleDataList();
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
};
</script>
<style scoped lang="scss">
/*@import url(); 引入公共css类*/
::v-deep .el-input-number.is-without-controls .el-input__inner {
  text-align: left;
}
::v-deep .el-dialog__body{
  padding-top: 0;
  padding-block: 0;
  height: calc(100vh - 150px);
}
::v-deep .el-dialog__header{
  display: flex;
}
.step_main {
  min-height: calc(100vh - 165px);
  max-height: calc(100vh - 165px);
  overflow: hidden auto;
 
}
::v-deep .step_main .el-card__body{
    padding: 0px;
  }
.table_header{
  display: flex;
    flex-wrap: nowrap;
    align-items: center;
  height: 60px;
  line-height: 40px;
  padding: 10px;
  background: #F5F7FA;
  border: 1px solid #EBEEF5;
  border-bottom: none;
  .checkBox{
    display: inline-block;
    margin-left: 10px;
  }
}
</style>