<template>
  <div class="commodity_main">
    <article class="">
      <el-row :gutter="12">
        <el-col :span="6">
          <app-left-list></app-left-list>
        </el-col>
        <el-col :span="18">
          <article class="top_margin_common">
            <el-card shadow="never">
              <el-form ref="where" :model="where" label-width="100px">
                <el-row :gutter="12">
                    <el-col :span="8">
                        <el-form-item label="商品/服务名称">
                            <el-input v-model="where.name" placeholder="请输入商品和服务名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="增值税税率">
                            <el-input v-model="where.name" placeholder="请选择增值税税率"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" style="text-align: right;">
                        <el-button type="primary">查询</el-button>
                        <el-button type="primary">重置</el-button>
                    </el-col>
                </el-row>
               
              </el-form>
            </el-card>
          </article>
          <article class="top_margin_common">
            <el-card shadow="never">
                <article class="btn_list">
                    <el-button type="primary">新增</el-button>
                    <el-button type="primary">导入</el-button>
                    <el-button type="primary">导出</el-button>
                </article>
            </el-card>
          </article>
          <article class="table_main">
            <el-card shadow="never">
                <app-right-table></app-right-table>
            </el-card>
          </article>
        </el-col>
      </el-row>
    </article>
  </div>
</template>

<script>
import AppLeftList from "./leftList";
import AppRightTable from './tableTheme'
export default {
  name: "productItemMessagePage",
  components: {
    AppLeftList,
    AppRightTable
  },
  data() {
    return {
        where:{

        }
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
};
</script>
<style scoped lang="scss">
/*@import url(); 引入公共css类*/
.commodity_main {
  padding: 15px;
}
::v-deep{
    .el-form-item--mini.el-form-item{
        margin-bottom:0px
    }
}
.top_margin_common{
    margin-bottom: 15px;
}
.btn_list{
    text-align: right;
}
.table_main{
   
}
</style>
<style scoped>
</style>