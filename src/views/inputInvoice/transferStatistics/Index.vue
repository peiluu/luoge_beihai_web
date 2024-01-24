<template>
    <div class="ele_body">
      <article>
        <app-search-form ></app-search-form>
      </article>
      <article>
        <el-card shodwn="never">
          <article>
            <el-row>
            
            <el-col :span="24" style="text-align: right;">
              <el-button-group>
                <el-button type=""  @click="handleEditeStatus">导出查询结果</el-button>
                
              </el-button-group>
             
            </el-col>
          </el-row>
          </article>
          <article>
            <el-table :data="tableData" :border="true" style="width: 100%">
              <el-table-column prop="date" label="进项转出科目代码" width="180">
              </el-table-column>
              <el-table-column prop="name" label="进项转出科目名称" width="180">
              </el-table-column>
              <el-table-column prop="address" label="进项税额" width="180" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="date" label="已转出税额" width="180">
              </el-table-column>
              <el-table-column prop="date" label="本年累计进项税额" width="180">
              </el-table-column>
              <el-table-column prop="date" label="本年累计已转出税额" width="180">
              </el-table-column>
              <el-table-column prop="date" label="发票数量" width="180">
              </el-table-column>
          </el-table>
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