<template>
    <div class="ele-body">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="按住体转出" name="1">
          <el-card shadow="never">
            <article>
              <app-body-roll></app-body-roll>
            </article>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="按发票转出" name="2">
          <el-card shadow="never">
          <article>
            <app-invoice-roll></app-invoice-roll>
          </article>
        </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
import AppBodyRoll from './bodyRollOut';
import AppInvoiceRoll from './invoiceRollOut'
export default {
    name:'transferIndexPage',
    components: { AppBodyRoll,AppInvoiceRoll },
    data() {
        return {
          activeName: '1'
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
.ele-body{
  padding: 15px;
}
.space_bottom{
  margin-bottom: 15px;
}
</style>