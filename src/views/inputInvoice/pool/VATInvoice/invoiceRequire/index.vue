<template>
  <div class="">
    <el-dialog
      :title="title"
      :visible="visible"
      :width="width"
      @update:visible="updateVisible"
      :before-close="handleClose"
    >
      <article >
        <article class="require_tag">
            <div class="require_img_main"><img src="@/assets/img/pass.png" alt=""></div>
            <div>发票合规性校验通过！</div>
        </article>
        <el-descriptions :column="2">
          <el-descriptions-item label="销方纳税人识别号"
            >kooriookami</el-descriptions-item
          >
          <el-descriptions-item label="销方纳税人识别号"
            >18100000000</el-descriptions-item
          >
          <el-descriptions-item label="购方纳税人识别号"
            >苏州市</el-descriptions-item
          >
          <el-descriptions-item label="购方纳税人识别号"
            >学校</el-descriptions-item
          >
          <el-descriptions-item label="发票号码"
            >江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item
          >
          <el-descriptions-item label="发票代码"
            >kooriookami</el-descriptions-item
          >
          <el-descriptions-item label="开票日期"
            >18100000000</el-descriptions-item
          >
          <el-descriptions-item label="发票金额">苏州市</el-descriptions-item>
          <el-descriptions-item label="发票税额">学校</el-descriptions-item>
          <el-descriptions-item label="查验次数"
            >江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item
          >
        </el-descriptions>
        <article style="margin-top:15px;">
          <el-table :data="requireTableData" style="width: 90%" :border="true">
            <el-table-column prop="label" label="风险检查项" width="220" :header-align="'center'" :align="'center'">
            </el-table-column>
            <el-table-column prop="value" label="检查结果" minWidth="220" :header-align="'center'" :align="'left'">
            </el-table-column
          ></el-table>
        </article>
      </article>
      <span slot="footer" class="dialog_footer">
        <el-button type="primary" @click="updateVisible(false)"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "invoiceRequirePage",
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
      default: "50%",
    },
  },
  components: {},
  data() {
    return {
        requireTableData:[
            {label:'失信人黑名单检查',value:'销方税号是XXXX，为失信人黑名风险！',require:false}
        ]
    };
  },
  computed: {},
  watch: {},
  methods: {
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
  },
  created() {},
  mounted() {},
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
::v-deep .el-dialog__header {
  background: #339966;
  padding: 6px;
  .el-dialog__title {
    color: #fff;
    font-size: 1.25rem;
  }
  .el-dialog__headerbtn {
    top: 10px;
    right: 10px;
    color: #fff;
  }
  .el-dialog__close {
    color: #fff;
  }
}
::v-deep .el-dialog__footer {
  text-align: center;
}
.require_tag{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 15px;
}
.require_img_main{
    width: 30px;
    height: 30px;
    margin-right: 12px;
    img{
        width: 100%;
        height: 100%;
    }
}
</style>