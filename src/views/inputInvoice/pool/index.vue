<template>
  <div class="ele_body">
    <el-card shadow="never"></el-card>
    <el-card shadow="never">
      <article>
        <article>

        </article>
        <article>
          <el-table :data="tableData" :border="true" style="width: 100%"  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" fixed="left">
    </el-table-column>
            <el-table-column prop="date" label="会计主体" width="180">
            </el-table-column>
            <el-table-column prop="name" label="发票代码" width="180">
            </el-table-column>
            <el-table-column prop="address" label="发票号码" width="180" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="date" label="开票日期" width="180">
            </el-table-column>
            <el-table-column prop="date" label="购买方名称" width="180">
            </el-table-column>
            <el-table-column prop="date" label="购买方地址电话" width="180">
            </el-table-column>
            <el-table-column prop="date" label="购买方税号" width="180">
            </el-table-column>
            <el-table-column prop="date" label="销售方名称" width="180">
            </el-table-column>
            <el-table-column prop="date" label="销售方地址电话" width="180">
            </el-table-column>
            <el-table-column prop="date" label="销售方税号" width="180">
            </el-table-column>
            <el-table-column prop="date" label="不含税金额" width="180">
            </el-table-column>
            <el-table-column prop="date" label="税额" width="180">
            </el-table-column>
            <el-table-column prop="date" label="价税合计" width="180">
            </el-table-column>
            <el-table-column prop="date" label="报账状态" width="180">
            </el-table-column>
            <el-table-column prop="date" label="问题发票" width="180">
            </el-table-column>
            <el-table-column prop="date" label="凭证号" width="180">
            </el-table-column>
            <el-table-column prop="date" label="来源业务系统" width="180">
            </el-table-column>
            <el-table-column prop="date" label="业务系统单据号" width="180">
            </el-table-column>
            <el-table-column prop="date" label="发票种类" width="180">
            </el-table-column>
            <el-table-column prop="date" label="发票影像链接" width="180">
            </el-table-column>
            <el-table-column prop="date" label="进项税对应费用会计科目编码" width="180">
            </el-table-column>
            <el-table-column prop="date" label="进项税对应费用会计科目名称" width="180">
            </el-table-column>
            <el-table-column prop="date" label="进项税待认证会计科目编码" width="180">
            </el-table-column>
            <el-table-column prop="date" label="进项税待认证会计科目名称" width="180">
            </el-table-column>
            <el-table-column prop="date" label="应交增值税待认证进项税借方发生额" width="180">
            </el-table-column>
            <el-table-column prop="date" label="是否可抵扣" width="180">
            </el-table-column>
            <el-table-column prop="date" label="业务系统转出税金" width="180">
            </el-table-column>
            <el-table-column prop="date" label="税务系统转出税金" width="180">
            </el-table-column>
            <el-table-column prop="date" label="累计转出税额" width="180">
            </el-table-column>
            <el-table-column prop="date" label="已抵扣税额" width="180">
            </el-table-column>
            <el-table-column prop="date" label="认证状态" width="180">
            </el-table-column>
            <el-table-column prop="date" label="抵扣期间" width="180">
            </el-table-column>
            <el-table-column prop="date" label="发票状态" width="180">
            </el-table-column>
            <el-table-column prop="date" label="会计期间" width="180">
            </el-table-column>
            <el-table-column prop="date" label="记账备注" width="180">
            </el-table-column>
            <el-table-column prop="date" label="项目名称" width="180">
            </el-table-column>
            <el-table-column prop="date" label="所属区域" width="180">
            </el-table-column>
            <el-table-column prop="date" label="法人名称" width="180">
            </el-table-column>
            <el-table-column prop="date" label="项目名称(房开)" width="180">
            </el-table-column>
            <el-table-column prop="date" label="项目分期" width="180">
            </el-table-column>
            <el-table-column prop="date" label="合同编号" width="180">
            </el-table-column>
            <el-table-column prop="date" label="合同名称" width="180">
            </el-table-column>
            <el-table-column prop="date" label="HAP系统单据号" width="180">
            </el-table-column>
            <el-table-column prop="date" label="认证推送状态" width="180">
            </el-table-column>
            <el-table-column prop="date" label="日期" width="180">
            </el-table-column>
            
          </el-table>
        </article>
      </article>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
    };
  },
  computed: {},
  watch: {},
  methods: {
    /* 勾选 */
    handleSelectionChange(){

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
.ele_body {
  padding: 15px;
}
</style>