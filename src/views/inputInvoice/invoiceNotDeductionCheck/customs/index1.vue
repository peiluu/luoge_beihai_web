<template>
  <div>
    <el-dialog
      :title="`${editForm.id ? '修改' : '新增'}失信人员黑名单`"
      :visible.sync="addVisible"
      width="60%"
      :before-close="handleAddClose"
      class="black-dialog"
    >
      <el-form :inline="true" :model="editForm" ref="editForm" :rules="rules" >
        <el-form-item label="购方类型" prop="nsrmc">
          <el-input v-model="editForm.nsrmc" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="购方编码" prop="nsrsbh">
          <el-input v-model="editForm.nsrsbh" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="购方名称" prop="nsrmc">
          <el-input v-model="editForm.nsrmc" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="税收分类编码" prop="nsrsbh">
          <el-input v-model="editForm.nsrsbh" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="项目名称" prop="nsrsbh">
          <el-input v-model="editForm.nsrsbh" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="商品规格" prop="nsrsbh">
          <el-input v-model="editForm.nsrsbh" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="计量单位" prop="nsrsbh">
          <el-input v-model="editForm.nsrsbh" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="数量" prop="nsrsbh">
          <el-input v-model="editForm.nsrsbh" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="金额（不含税价）" prop="nsrsbh">
          <el-input v-model="editForm.nsrsbh" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="税率" prop="szdq">
          <el-input v-model="editForm.szdq" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="税额" prop="swjgmc">
          <el-input v-model="editForm.swjgmc" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="流水时间" prop="jydz">
          <el-input v-model="editForm.jydz" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="状态" prop="zrr">
          <el-input v-model="editForm.zrr" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="发票号码" prop="zrr">
          <el-input v-model="editForm.zrr" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="开票点" prop="zrr">
          <el-input v-model="editForm.zrr" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="账套" prop="zrr">
          <el-input v-model="editForm.zrr" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="销方纳税人识别号" prop="zrr">
          <el-input v-model="editForm.zrr" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="销方纳税人名称" prop="zrr">
          <el-input v-model="editForm.zrr" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="上传时间" prop="zrr">
          <el-input v-model="editForm.zrr" placeholder="请输入" />
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
export default {
  methods: {
    // 新增/修改
    addOrEdit(row = {}) {
      this.editForm = { ...row };
      this.addVisible = true;
    },
    // 关闭弹窗
    handleAddClose() {
      this.addVisible = false;
      setTimeout(() => {
        this.$refs.editForm.resetFields();
      }, 100);
    },
    handleSelection(rows) {
      this.selections = rows;
    },
    // 保存
    saveData() {
      this.$refs["editForm"].validate(async (valid) => {
        if (!valid) return;
        this.saveLoading = true;
        const params = { ...this.editForm };
        let apiFn = addMghw;
        if (this.editForm.id) {
          // 编辑
          apiFn = updateMghw;
          params.id = this.editForm.id;
        }
        try {
          const { code = "" } = await apiFn(params);
          if (code === "0") {
            this.$message.success("操作成功");
            this.handleAddClose();
            this.reloadList();
          }
        } catch (error) {
        } finally {
          this.saveLoading = false;
        }
      });
    },
  },
};
</script>
<style>

</style>
