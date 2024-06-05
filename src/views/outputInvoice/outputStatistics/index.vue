<template>
  <div class="">
    <article>
      <!-- 搜索 -->
      <article>
        <lg-search-form @handleFormSearch="handleFormSearch"></lg-search-form>
      </article>
      <!-- table -->
      <article>
        <el-card shadow="never">
          <article>
            <article>
              <div>
                <el-button>导 出</el-button>
                <el-button>打 印</el-button>
              </div>
              <div class="statistic_main">
                <div>
                  <el-statistic
                    group-separator=","
                    :precision="2"
                    :value="554"
                    :title="'蓝票总数'"
                  ></el-statistic>
                </div>
                <div>
                  <el-statistic
                    group-separator=","
                    :precision="2"
                    :value="19"
                    :title="'红票总数'"
                  ></el-statistic>
                </div>
              </div>
            </article>
            <article>
              <el-table :data="tableData" style="width: 100%" :border="true">
                <el-table-column type="index" label="序号" width="50">
                </el-table-column>
                <el-table-column prop="name" label="项目名称" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'center'" width="180">
                </el-table-column>
                <el-table-column prop="total" label="合计" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'center'" minWidth="180">
                </el-table-column>
                <el-table-column prop="shisan" label="13%" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'center'" minWidth="140">
                </el-table-column>
                <el-table-column prop="jiu" label="9%" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'center'" minWidth="140">
                </el-table-column>
                <el-table-column prop="liu" label="6%" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'center'" width="140">
                </el-table-column>
                <el-table-column prop="wu" label="5%" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'center'" width="140">
                </el-table-column>
                <el-table-column prop="san" label="3%" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'center'" width="140">
                </el-table-column>
                <el-table-column prop="ling" label="0%" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'center'" width="140">
                </el-table-column>
                <el-table-column prop="bzs" label="不征税" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'center'" width="140">
                </el-table-column>
                <el-table-column prop="ms" label="免税" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'center'" width="140">
                </el-table-column>
              </el-table>
            </article>
          </article>
        </el-card>
      </article>
    </article>
  </div>
</template>

<script>
import lgSearchForm from "./searchForm/index.vue";
export default {
  name: "outputStatisticsPage",
  components: { lgSearchForm },
  props: {},
  data() {
    return {
      where: {}, //搜索条件
      tableData: [], //表格数据
    };
  },
  computed: {},
  watch: {},
  methods: {
    /* 搜索组件返回 */
    handleFormSearch(val) {
      this.where = { ...val };
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
<style scoped>
/*@import url(); 引入公共css类*/
.statistic_main {
  display: flex;
  justify-content: space-around;
}
</style>