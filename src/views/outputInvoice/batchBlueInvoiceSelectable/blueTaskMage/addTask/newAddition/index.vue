<template>
  <div>
    <el-dialog :title="title" :visible="visible" width="1000px" :before-close="handleAddClose" class="black-dialog">
      <el-form :inline="true" :model="editForm" ref="editForm">
        <el-form-item label="购方类型" prop="gflx">
          <el-select v-model="editForm.gflx">
            <el-option v-for="item in gflx" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购方编码" prop="gmfbh">
          <el-input v-model="editForm.gmfbh" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="购方名称" prop="gmfmc">
          <el-input v-model="editForm.gmfmc" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="税收分类编码" prop="sphfwssflhbbm">
          <el-input v-model="editForm.sphfwssflhbbm" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="项目名称" prop="xmmc">
          <el-input v-model="editForm.xmmc" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="商品规格" prop="ggxh">
          <el-input v-model="editForm.ggxh" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="计量单位" prop="dw">
          <el-input v-model="editForm.dw" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="数量" prop="sl">
          <el-input v-model="editForm.sl" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="金额（不含税价）" prop="je">
          <el-input v-model="editForm.je" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="税率" prop="slv">
          <el-input v-model="editForm.slv" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="税额" prop="se">
          <el-input v-model="editForm.se" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="流水时间" prop="lssj">
          <el-date-picker v-model="editForm.lssj" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="状态" prop="fpzt">
          <el-select v-model="editForm.fpzt">
            <el-option v-for="item in fpzt" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票号码" prop="fphm">
          <el-input v-model="editForm.fphm" placeholder="请输入" />
        </el-form-item> -->
        <el-form-item label="开票点" prop="kpd_id">
          <el-input v-model="editForm.kpdId" disabled placeholder="请输入" />
        </el-form-item>

        <el-form-item label="账套" prop="org_id">
          <el-input v-model="editForm.orgId" placeholder="请输入" disabled />
        </el-form-item>
        <el-form-item label="销方纳税人识别号" prop="nsrsbh">
          <el-input v-model="editForm.nsrsbh" placeholder="请输入" disabled />
        </el-form-item>
        <el-form-item label="销方纳税人名称" prop="nsrmc">
          <el-input v-model="editForm.nsrmc" placeholder="请输入" disabled />
        </el-form-item>

        <!-- <el-form-item label="上传时间" prop="createtime">
          <el-input v-model="editForm.createtime" placeholder="请输入" />
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddClose">取 消</el-button>
        <el-button type="success" @click="saveData">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { addMghw } from "../../../api";

export default {
  name: "newAddition",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "新增",
    },
    editeTask: {
      type: [String, Number],
      default: "",
    },
  },
  components: {},
  data() {
    const gflx = [
      { value: "1", label: "个人" },
      { value: "2", label: "企业" },
    ];
    const fpzt = [
      { value: "1", label: "未开票" },
      { value: "2", label: "已勾选" },
      { value: "3", label: "开票中" },
      { value: "4", label: "上传成功" },
      { value: "5", label: "上传失败" },
      { value: "6", label: "开票成功" },
      { value: "7", label: "开票失败" },
    ];
    return {
      fpzt,
      gflx,
      editForm: {},
      addVisible: false,
      saveLoading: false,
    };
  },
  methods: {
    init() {
      const { orgId, kpdId, nsrsbh, nsrmc } = this.$route.query || {};

      this.editForm.orgId = orgId;
      this.editForm.kpdId = kpdId;
      this.editForm.nsrsbh = nsrsbh;
      this.editForm.nsrmc = nsrmc;
    },
    // extractParamsFromUrl() {
    //   const urlParams = new URLSearchParams(window.location.search);
    //   this.kpdId = urlParams.get('kpdId');
    //   this.orgId = urlParams.get('orgId');
    //   this.nsrsbh = urlParams.get('nsrsbh');
    //   this.nsrmc = urlParams.get('nsrmc');
    // },
    // 新增/修改
    addOrEdit(row = {}) {
      this.editForm = { ...row };
      this.addVisible = true;
    },
    // 关闭弹窗
    handleAddClose() {
      this.$emit("update:visible", false);
    },
    handleSelection(rows) {
      this.selections = rows;
    },
    // 保存
    saveData() {
      this.$refs["editForm"].validate(async (valid) => {
        if (!valid) return;
        this.saveLoading = true;
        const { kpdId, orgId } = this.$route.query || {};
        const params = {
          taskId: this.useTask || "",

          kpdId: kpdId,
          orgId: orgId,
          tradeNumInfoAddDto: { ...this.editForm },
        };
        try {
          const res = await addMghw(params);
          if ([0,'0'].includes(res.code)) {
            this.$message.success("操作成功");
            this.$emit('handleDoneAdd',{taskId:res.data})
            this.handleAddClose();
          }
        } catch (error) {
        } finally {
          this.saveLoading = false;
        }
      });
    },
  },
  created() {
    this.init();
  },
  computed: {
    useTask() {
      return this.editeTask || "";
    },
  },
};
</script>
<style scoped lang="scss">
.black-dialog {
  /deep/ .el-form-item {
    width: calc(50% - 10px);

    &.full-item {
      width: 100%;
    }

    .el-form-item__label {
      width: 180px;
    }

    .el-form-item__content {
      width: calc(100% - 180px);

      .el-select,
      .el-date-editor,
      .el-input {
        width: 100%;
      }
    }
  }
}

/deep/ .el-dialog__body {
  height: calc(100vh - 320px) !important;
  overflow: auto;
}
</style>
