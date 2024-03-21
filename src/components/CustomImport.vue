<template>
  <div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="80%" custom-class="import-dialog" :before-close="handleClose">
      <div class="import-content">
        <el-steps :active="step">
          <el-step title="上传"></el-step>
          <el-step title="导入"></el-step>
        </el-steps>

        <el-divider></el-divider>
        <div v-if="step === 1" class="upload-template">
          <span>{{ upTitle }}</span>
          <span class="right">
            <el-button type="text" @click="downloadTemplate" v-if="downloadTemplateApi">下载模板</el-button>
          </span>
          <el-upload ref="fileUpload" :action="action" :drag="drag" :accept="accept" :limit="limit" :on-success="handleSuccess" :http-request="ajaxUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </div>
        <template v-else>
          <div class="upload-info">
            <span>有效数据 {{ successCount }}条 ,无效数据 {{ failCount }}条</span>
          </div>
          <el-table stripe border :data="tableData" :height="height" v-loading="importing" :header-cell-class-name="'main-table-header-cell'">
            <el-table-column prop="yzjg" label="验证" align="left" min-width="80" fixed>
              <template slot-scope="scope">
                <slot name="myscope" :data="scope.row">
                  <i v-if="scope.row.failInfo" style="color: #ff0000" class="el-icon-error"></i>
                  <i v-else style="color: #3abe19" class="el-icon-success"></i>
                  {{ scope.row.failInfo ? '失败' : '成功' }}
                </slot>
              </template>
            </el-table-column>
            <el-table-column prop="yzxx" align="left" label="验证信息" min-width="200">
              <template slot-scope="scope">
                <slot name="myscope" :data="scope.row">
                  <span style="color: #ff0000" v-if="scope.row.failInfo">{{ scope.row.failInfo }}</span>
                </slot>
              </template>
            </el-table-column>
            <el-table-column
              v-for="item in importColumns"
              :key="item.dataIndex"
              :prop="item.dataIndex"
              :label="item.title"
              :align="item.align || 'left'"
              :min-width="item.width"
              :show-overflow-tooltip="item.showTooltip"
            ></el-table-column>
          </el-table>
          <div class="footer-button">
            <el-button type="default" @click="initData">上一步</el-button>
            <el-button type="primary" @click="handleConfirm" :disabled="failCount > 0 || importing">导入</el-button>
          </div>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { config } from '@/config';
import { customPost, download } from '@/utils/request';
export default {
  name: 'CustomImport',
  props: {
    upTitle: {
      // 上传标题
      type: String,
      default: '上传文件',
    },
    accept: {
      // 上传格式
      type: String,
      default: '.xlsx, .xls',
    },
    action: {
      // 上传地址
      type: String,
      default: '',
    },
    drag: {
      // 是否拖拽文件上传
      type: Boolean,
      default: true,
    },
    limit: {
      // 最大上传数
      type: Number,
      default: 1,
    },
    downloadTemplateApi: {
      // 模版下载地址
      type: String,
      default: '',
    },
    downloadTemplateName: {
      // 下载模版名称
      type: String,
      default: '模版',
    },
    upApi: {
      // 文件上传地址
      type: String,
      default: '',
    },
    importApi: {
      // 确认导入地址
      type: String,
      default: '',
    },
    dialogTitle: {
      // 确认导入地址
      type: String,
      default: '',
    },
    dialogVisible: {
      // 是否展示
      type: Boolean,
      default: false,
    },
    importColumns: {
      // table 验证信息
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      step: 1,
      tableData: [],
      successCount: 0,
      failCount: 0,
      importing: false,
    };
  },
  computed: {
    height() {
      return window.innerHeight - 500;
    },
  },
  methods: {
    //ajax上传
    ajaxUpload(content) {
      let that = this;
      let formData = new FormData();
      formData.append('file', content.file);
      that.importing = true;
      customPost(config.host + this.upApi, { 'Content-Type': 'multipart/form-data' }, formData, res => {
        if (res.code !== '0') {
          this.handleSuccess();
          that.importing = false;
          return;
        }
        that.step = 2;
        that.$message({
          message: '文件上传成功',
          type: 'success',
        });
        that.importing = false;
        that.tableData = res.data.list;
        that.successCount = res.data.successCount;
        that.failCount = res.data.failCount;
      });
    },
    //下载模板
    async downloadTemplate() {
      const fileName = `${this.downloadTemplateName}.xlsx`;
      await download(config.host + this.downloadTemplateApi, {
        reqData: { type: 1 },
        fileName,
      });
    },
    // 确认导入
    handleConfirm() {
      let that = this;
      that.importing = true;
      customPost(config.host + this.importApi, { 'Content-Type': 'application/json; charset=utf-8' }, {}, res => {
        if (res.code !== '0') {
          that.importing = false;
          return;
        }
        that.$message({
          message: '导入成功',
          type: 'success',
        });
        this.initData();
        that.$emit('handleOk');
      });
    },
    handleSuccess() {
      //上传成功之后清除历史记录
      this.$refs.fileUpload.clearFiles();
    },
    initData() {
      this.tableData = [];
      this.successCount = 0;
      this.failCount = 0;
      this.step = 1;
    },
    handleClose() {
      this.$emit('handleClose');
      this.initData();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  .import-dialog {
    margin: 0 auto !important;
  }
}
.import-content {
  height: calc(100vh - 300px);
  overflow: hidden;
}
// ::v-deep .el-table {
//   height: calc(100% - 200px);
//   .el-table__body-wrapper {
//     height: calc(100% - 36px) !important;
//     // overflow: hidden;
//     // overflow: auto;
//   }
// }
.el-steps {
  margin: 20px 35% 10px 35%;
}

.upload-template {
  height: 30px;
  margin: 20px 35% 10px 35%;
  line-height: 30px;
  font-size: 14px;

  .right {
    float: right;
  }
}

.upload-info {
  font-size: 14px;
  text-align: center;
}

.el-table {
  margin: 10px 2%;
  width: 96%;
}

::v-deep .el-step__icon.is-icon {
  width: 24px;
}

::v-deep .el-upload {
  width: 100%;
}

::v-deep .el-upload .el-upload-dragger {
  width: 100%;
}

.footer-button {
  padding: 20px 2% 0 0;
  float: right;
}

::v-deep .el-upload-list__item {
  display: none;
}
</style>
