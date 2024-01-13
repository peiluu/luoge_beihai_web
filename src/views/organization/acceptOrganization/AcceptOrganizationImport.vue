<template>
  <div class="main-content">
    <div class="back-button">
      <!-- <el-button icon="el-icon-back" @click="handleBack">返回</el-button> -->
    </div>
    <div class="mid-margin-40">
      <el-steps :active="step">
        <el-step title="上传"></el-step>
        <el-step title="导入"></el-step>
      </el-steps>
    </div>
    <el-divider></el-divider>
    <div v-if="step === 1" class="mid-margin-35 upload-template mb10">
      <span>上传受票点组织信息</span>
      <span class="right"><el-button type="text" @click="downloadTemplate">下载模板</el-button></span>
      <el-upload action="" drag accept=".xlsx,.xls" :limit="1" :http-request="ajaxUpload">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>
    <template v-else>
      <div class="mid-margin-35 upload-info mb10">
        <span>有效数据 {{ successCount }}条 ,无效数据 {{ failCount }}条</span>
        <!-- <el-button type="text" @click="downloadFailed">下载</el-button>
        <span style="margin-left: 0;">清单修改</span> -->
      </div>
      <el-table class="import-table" stripe border :data="tableData" v-loading="importing" :header-cell-class-name="'main-table-header-cell'" style="margin: 10px 2% ;width: 96%;">
        <el-table-column prop="yzjg" label="验证" align="left" min-width="80">
          <template slot-scope="scope">
            <slot name="myscope" :data="scope.row">
              <i v-if="scope.row.failInfo" style="color: #FF0000;" class="el-icon-error"></i><i v-else style="color:#3ABE19;" class="el-icon-success"></i>{{ scope.row.failInfo ? "失败" : "成功" }}
            </slot>
          </template>
        </el-table-column>
        <el-table-column prop="yzxx" align="left" label="验证信息" min-width="200">
          <template slot-scope="scope">
            <slot name="myscope" :data="scope.row"><span style="color: #FF0000;" v-if="scope.row.failInfo">{{ scope.row.failInfo }}</span></slot>
          </template>
        </el-table-column>
        <el-table-column prop="nsrmc" label="所属纳税主体名称" align="nsrmc" min-width="180"></el-table-column>
        <el-table-column prop="nsrsbh" label="所属纳税主体识别号" align="nsrshb" min-width="180"></el-table-column>
        <el-table-column prop="code" label="组织编码" align="left" min-width="180"></el-table-column>
        <el-table-column prop="name" label="组织名称" align="left" min-width="180"></el-table-column>
      </el-table>
      <div class="footer-button">
        <el-button type="default" @click="initData">上一步</el-button>
        <el-button type="primary" @click="handleConfirm" :disabled="failCount > 0 || successCount == 0 || importing">导入</el-button>
      </div>
    </template>
  </div>
</template>
<script>
import { config } from '@/config'
import { downExcel } from './Api.js'

export default {
  name: "AcceptOrganizationImport",
  components: {
  },
  data() {
    return {
      business: require('@/utils/request'),
      loading: false,
      step: 1,
      tableData: [],
      successCount: 0,
      failCount: 0,
      importing: false,
    }
  },
  computed: {
    request_host() {
      return config.host
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    //ajax上传
    ajaxUpload(content) {
      let that = this;
      let formData = new FormData();
      formData.append("file", content.file);
      that.importing = true;
      that.business.customPost(
        that.request_host + "/orgnization/importOrganizationExcelInfo",
        { 'Content-Type': 'multipart/form-data' },
        formData,
        // res => {
        //   console.log(res)
        //   if (res.code == 0) {
        //     that.$message({
        //       message: '文件上传成功',
        //       type: 'success'
        //     });
        //     that.importing = false;
        //     that.tableData = res.data.list
        //     that.successCount = res.data.successCount;
        //     that.failCount = res.data.failCount;
        //   } else {
        //     that.importing = false;
        //   }
        // }
        ).then(res=>{
          if (res.code == 0) {
            that.$message({
              message: '文件上传成功',
              type: 'success'
            });
            that.tableData = res.data.list
            that.successCount = res.data.successCount;
            that.failCount = res.data.failCount;
            that.step = 2;
          }
          that.importing = false;
          that.$message.error(res.msg || '文件上传失败')
        }).catch(err=>{
          this.$message.error(err.msg || '文件上传失败')
        })
    },
    //下载模板
    async downloadTemplate() {
      const fileName = `受票点组织_导入模板.xlsx`
      await downExcel({
        reqData: { type: 3 },
        fileName
      })

    },
    //下载导入失败数据
    // downloadFailed() {
    //   window.open(this.request_host + "/Taxpayer/downLoadExcel", "_target");
    // },
    handleConfirm() {
      let that = this;
      that.importing = true;
      that.business.customPost(
        that.request_host + "/orgnization/importOrganizationInfo",
        { 'Content-Type': 'application/json; charset=utf-8' },
        {},
      ).then(res=>{
        if (res.code == 0) {
          that.$message({
            message: '导入成功',
            type: 'success'
          });
          that.$emit('onOk')
        }
        that.importing = false;
      }).catch(err=>{
        that.importing = false;
        this.$message.error(err.msg || '导入失败')
      })
    },
    // handleBack() {
    //   this.initData()
    //   this.$router.push({
    //     path: '/organization/index',
    //     query: { activeName: '3' }
    //   })
    //   this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
    // },
    initData() {
      this.tableData = [];
      this.successCount = 0;
      this.failCount = 0;
      this.step = 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.mid-margin-40 {
  margin: 20px 40% 0 40%;
}

.mid-margin-35 {
  margin: 20px 35% 10px 35%;
}

.upload-template {
  // height: 30px;
  // line-height: 30px;
  font-size: 14px;

  .right {
    float: right;
  }
}

.upload-info {
  font-size: 14px;
  text-align: center;
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
  padding-top: 20px;
  text-align: center;
}
::v-deep .el-upload-list__item {
  display: none;
 }
.main {
  overflow: scroll;
}
.import-table {
  ::v-deep .el-table__body-wrapper {
    height: calc(100vh - 440px);
    overflow: hidden;
    overflow-y: auto;
    min-height: initial;
  }
}
</style>
