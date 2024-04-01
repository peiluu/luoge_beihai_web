<template>
  <div class="">
    <el-dialog
      :title="title"
      :visible="visible"
      :width="width"
      @update:visible="updateVisible"
      :before-close="handleClose"
      v-loading="loading"
    >
      <article >
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
                    :value="item.value">
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
              <el-form-item label="明细限制" prop="mxxz">
                <el-input-number
                  style="width: 100%"
                  v-model="intoForm.mxxz"
                  :max="100000000000"
                  :precision="0"
                  :controls="false"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="纳税人名称" >
                <el-input v-model="intoForm.nsrmc" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="纳税人识别号" >
                <el-input v-model="intoForm.nsrsbh" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="文件上传" prop="fileList">
                <article style="margin-bottom: 2px;">
                  <el-button type="primary" plain @click="handleDownTel"> 下载模板</el-button>
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
                    将文件拖到此处，或<em>点击获取文件</em>
                    <span> 已添加文件<em>{{ `(${fileList.length})` }} </em></span>
                  </div>
                  <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
                </el-upload>
                </article>
                
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="" label-width="30px">
                <el-button type="primary" @click="handleUpload">上传</el-button>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
      </article>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateVisible(false)">取 消</el-button>
        <el-button type="primary"  @click="handleOpen">确 定</el-button>
        
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getInvoiceQuota, downBatchTelleData} from "../../api";
import { config } from "@/config";
import { customPost,} from "@/utils/request.js";

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
  components: {},
  data() {
    const checkFpxe = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error("限额不能小于等于0"));
      } else {
        callback();
      }
    };
    return {
      intoForm: { ...this.respData, fpxe: undefined,mxxz:10000 },
      rules: {
        fpxe: [
          {
            required: true,
            type: "number",
            message: "开票限额不能为空或不能小于等于0",
            tigger: "blur",
          },
          { validator: checkFpxe, tigger: "blur" },
        ],
      },
      mxxz:[
      {
            required: true,
            type: "number",
            message: "明细限制不能为空",
            tigger: "blur",
          },
         
      ],
      fileList: [],
      extraData: {},
      api: `${config.host}/excelInvoice/upload`,
      loading: false,
      fppzOptions:[
        {label:'增值税专用发票',value:'01'},
        {label:'增值税普通发票',value:'02'},
      ],
      queryData:this.$route.query || {}
    };
  },
  computed: {},
  watch: {
    respData: {
      handler(val) {
        this.intoForm = { ...val,mxxz:10000 };
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
          
        }
        
      } catch (e) {
        console.error(e);
      }finally{
        const {nsrsbh,nsrmc} = this.$route.query || {}
        this.intoForm.nsrsbh = nsrsbh || '';
        this.intoForm.nsrmc = nsrmc || '';
        this.loading = false;
      }
    },
    /* 上传验证 */
    handleUpload() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.fileList.length <= 0) return this.$message.error("请至少选择一份文件！");
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
      const { orgId, fppz, fpxe,nsrmc,nsrsbh } = this.intoForm || {};
      const formData = new FormData();
      formData.append("file", option.file);
      formData.append("orgId", orgId);
      formData.append("fppz", fppz);
      formData.append("fpxe", fpxe);
      formData.append("nsrmc", nsrmc);
      formData.append("nsrsbh", nsrsbh);
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
    handlerUploadDone(value){
        this.$emit('done',value)
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
        this.$confirm(`<div>请确认开票主体！</div>
          <div>销售方名称：${this.queryData.nsrmc}</div>
          <div>纳税人识别号：${this.queryData.nsrsbh}</div>`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {
          this.handleUpload()
        }).catch(() => {
                 
        });
      },
      /* 模板下载 */
      handleDownTel(){
        const fileName = `蓝字发票批量开具任务模板.xlsx`;
        downBatchTelleData('/mtclq-mtclqback/invoiceExcelTask/downLoadTemplate',{fileName},null,true)
      }
  },
  created() {},
  mounted() {
    this.handleInit();
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
</style>