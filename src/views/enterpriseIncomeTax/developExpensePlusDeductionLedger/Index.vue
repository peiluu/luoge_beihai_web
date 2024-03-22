<template>
  <div class="main-content">
    <el-tabs class="custom-card-tabs" v-model="activeName" type="card">
      <el-tab-pane name="1" label="研发费用明细表" />
      <el-tab-pane name="2" label="研发费用计算表" />
    </el-tabs>
    <Detail v-show="activeName == 1" />
    <CalculationTable v-show="activeName == 2" />
  </div>
</template>

<script>
import Detail from './Detail.vue';
import CalculationTable from './CalculationTable.vue';
export default {
  name: 'DevelopExpensePlusDeductionLedger',
  components: {
    Detail,CalculationTable
  },
  data() {
    return {
      activeName: '1',
    };
  },
};
</script>
