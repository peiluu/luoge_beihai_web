<template>
  <div class="">
    <article>
      <!-- 搜索 -->
      <article>
        <lg-search-form @handleFormSearch="handleFormSearch"></lg-search-form>
      </article>
      <!-- table -->
      <article>
        <el-card shadow="never" >
          <article v-loading="loading">
            <article>
              <div>
                <el-button @click="handleImportData">导 出</el-button>
                <el-button @click="printTable">打 印</el-button>
              </div>
              <div class="statistic_main">
                <div>
                  <el-statistic
                    group-separator=","
                    :precision="0"
                    :value="statisticTotal.blue"
                    :title="'蓝票总数'"
                  ></el-statistic>
                </div>
                <div>
                  <el-statistic
                    group-separator=","
                    :precision="0"
                    :value="statisticTotal.red"
                    :title="'红票总数'"
                  ></el-statistic>
                </div>
              </div>
            </article>
            <article style="margin-top:20px">
              <el-table :data="tableData" style="width: 100%" height="calc(100vh - 360px)" :border="true" ref="tableRef" class="printableArea">
                <el-table-column type="index" label="序号" width="50">
                </el-table-column>
                <el-table-column prop="name" label="项目名称" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'center'" width="160">
                </el-table-column>
                <el-table-column prop="total" label="合计" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'right'" minWidth="110">
                </el-table-column>
                <el-table-column prop="shisan" label="13%" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'right'" minWidth="110">
                </el-table-column>
                <el-table-column prop="jiu" label="9%" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'right'" minWidth="110">
                </el-table-column>
                <el-table-column prop="liu" label="6%" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'right'" minWidth="110">
                </el-table-column>
                <el-table-column prop="wu" label="5%" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'right'" minWidth="110">
                </el-table-column>
                <el-table-column prop="san" label="3%" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'right'" minWidth="110">
                </el-table-column>
                <el-table-column prop="ling" label="0%" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'right'" minWidth="110">
                </el-table-column>
                <el-table-column prop="bzs" label="不征税" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'right'" minWidth="110">
                </el-table-column>
                <el-table-column prop="ms" label="免税" :resizable="true" :show-overflow-tooltip="true" :header-align="'center'" :align="'right'" minWidth="110">
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
import { getListData, downListData } from './api/index.js'
export default {
  name: "outputStatisticsPage",
  components: { lgSearchForm },
  props: {},
  data() {
    return {
      where: {}, //搜索条件
      tableData: [], //表格数据
      loading:false,
      statisticTotal:{
        blue:0,
        red:0,
      }
    };
  },
  computed: {},
  watch: {},
  methods: {
    /* 搜索组件返回 */
    handleFormSearch(val) {
        const {time,fppz,nsrsbh} = val ||{}
        if(time || fppz || nsrsbh){
            this.where = {fppz,beginTime:time[0]??null,endTime:time[1]??null,nsrsbh}
        }else{
            this.where = {};
        }
      
      this.handleGetTableList();
    },
    /* 获取数据 */
    async handleGetTableList(){
        let params = {...this.where};
        this.loading = true;
        try {
            const res = await getListData(params);
            if([0,'0'].includes(res.code)){
                this.tableData = [...res.data.list];
                this.statisticTotal.blue = res.data.lpzs??0;
                this.statisticTotal.red = res.data.hpzs??0;
            }
        } catch (error) {
            throw(`get table data error: ${error}`)
        }finally{
            this.loading = false;
        }

    },
    /* 导出数据 */
    handleImportData(){
        const fileName = `销项统计.xlsx`;
        downListData({ fileName,reqData:{...this.where} }, null, true);
    },
    printTable() {
     
      //const printContent = this.$refs.tableRef.$el.outerHTML;
      // const printContent = this.$refs.tableRef.innerHTML;
      // const originalContent = document.body.innerHTML;
      // const printArea = document.createElement('div');
      // printArea.id = 'printArea';
      // printArea.innerHTML = printContent;
      // document.body.appendChild(printArea);

      // const originalStyle = document.body.style.display;
      // document.body.style.display = 'none';
      // printArea.style.display = 'block';

      window.print();

      // document.body.style.display = originalStyle;
      // document.body.removeChild(printArea);
      
    }
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
<style>
@media print {
  body * {
    visibility: hidden;
  }
  .printableArea, .printableArea * {
    visibility: visible;
  }
  .printableArea {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>