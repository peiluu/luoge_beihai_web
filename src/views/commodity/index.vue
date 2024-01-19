<template>
  <div class="commodity_main">
    <article class="">
      <el-row :gutter="12">
        <el-col :span="6">
          <app-left-list @handleNodeClick="handleNodeClick"></app-left-list>
        </el-col>
        <el-col :span="18">
         
          <article class="table_main">
            <app-right-table ref="rightTable" :current-id="currentId" :current-name="currentName"></app-right-table>
           
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
      currentId: null,
      currentName:''
    };
  },
  computed: {},
  watch: {},
  methods: {
    handleNodeClick(val){
     
      if(val.childList && val.childList.length <= 0){
        this.currentId = val.id;
        this.currentName = val.name;
      }
     
      
      //this.$refs.rightTable.handleGetList(val?.id);
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
<style scoped lang="scss">
/*@import url(); 引入公共css类*/

.table_main{
   
}
</style>
<style scoped>
</style>