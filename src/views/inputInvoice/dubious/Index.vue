<template>
  <div class="ele_body">
    <article class="space_bottom">
      <app-search-form ></app-search-form>
    </article>
    <article>
      <el-card shadow="never">
        <article>
          <el-row>
            <el-col :span="8">
                <el-form ref="form" :model="searchForm" label-width="0px">
                    <el-form-item label="">
                        <el-input v-model="searchForm.name" placeholder="请输入纳税人名称/纳税人识别号"></el-input>
                    </el-form-item>
              </el-form>
            </el-col>
          <el-col :span="16" style="text-align: right;">
            <el-button-group>
              <el-button type=""  @click="handleEditeStatus">放行</el-button>
              <el-popconfirm title="你确定删除吗？">
                <el-button slot="reference">删除</el-button>
            </el-popconfirm>
            </el-button-group>
           
          </el-col>
        </el-row>
        </article>
        <article>
          <el-table :data="tableData" :border="true" style="width: 100%">
            <el-table-column type="selection" width="55" fixed="left">
            </el-table-column>
            <el-table-column prop="date" label="发票代码" width="180">
            </el-table-column>
            <el-table-column prop="name" label="发票代码" width="180">
            </el-table-column>
            <el-table-column prop="address" label="购买方名称" width="180" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="date" label="销售方名称" width="180">
            </el-table-column>
            <el-table-column prop="date" label="提交人" min-width="180">
            </el-table-column>
            <el-table-column prop="date" label="提交日期" min-width="180">
            </el-table-column>
            <el-table-column prop="date" label="疑票状态" width="180">
            </el-table-column>
            <el-table-column prop="date" label="疑票规则" width="180">
            </el-table-column>
            <el-table-column prop="date" label="处理人" width="180">
            </el-table-column>
            <el-table-column prop="date" label="处理日期" width="180">
            </el-table-column>
            <el-table-column prop="date" label="备注" width="180">
            </el-table-column>
        </el-table>
        </article>
        <article>
          <span>
            已勾选 0 条
          </span>
        </article>
      </el-card>
    </article>

  </div>
</template>

<script>
import AppSearchForm from './componetns/searchForm';
export default {
  name:'transferStatisticsPage',
  components: {AppSearchForm},
  data() {
      return {
        tableData:[],
        searchForm: {}
      };
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {},
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
  }
</script>
<style scoped>
/*@import url(); 引入公共css类*/

</style>