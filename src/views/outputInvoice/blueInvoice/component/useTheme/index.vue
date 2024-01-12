<template>
  <div class="">
    <el-dialog
      title="引用模板"
      :visible="visible"
      width="40%"
      @update:visible="updateVisible"
      :before-close="handleClose"
    >
      <main class="main">
        <article>
          <el-form
            :model="query"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="模板名称" prop="name">
              <el-input
                size="small"
                v-model="query.name"
                placeholder="请输入模板名称"
              ></el-input>
            </el-form-item>
          </el-form>
        </article>

        <article>
          <el-table :data="source" style="width: 100%">
            <el-table-column prop="date" label="日期" width="180">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="address" label="地址"> </el-table-column>
          </el-table>
        </article>
      </main>
      <footer slot="footer" class="dialog-footer">
        <el-button @click="updateVisible(false)">取 消</el-button>
        <el-button type="primary" @click="handeOk">确 定</el-button>
      </footer>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "useThemePage",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  data() {
    return {
      query: {
        name: "",
      },
      source: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
    };
  },
  computed: {},
  watch: {},
  methods: {
    /* 更新visible */
    updateVisible(value) {
      this.$emit("update:visible", value);
    },

    /*确定 */
    handeOk() {
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
.main{
    max-height: 450px;
    overflow: auto;
}
/*@import url(); 引入公共css类*/
</style>