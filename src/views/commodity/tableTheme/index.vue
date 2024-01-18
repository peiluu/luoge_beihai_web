<template>
  <div class="">
    <article>
      <el-table
        height="calc(100vh - 399px)"
        :data="tableData"
        :border="true"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" width="50" label="序号">
        </el-table-column>
        <el-table-column prop="date" label="项目商品名称" width="180">
        </el-table-column>
        <el-table-column prop="name" label="项目商品分类名称" width="180">
        </el-table-column>
        <el-table-column prop="address" label="商品和服务税收分类合并编码" width="200">
        </el-table-column>
        <el-table-column prop="address" label="商品和服务税收分类名称" width="200">
        </el-table-column>
        <el-table-column prop="address" label="商品和服务税收分类简称" min-width="200">
        </el-table-column>
        <el-table-column prop="address" label="税率/征收率" min-width="200">
        </el-table-column>
        <el-table-column prop="address" label="优惠政策以及简易计税" min-width="200">
        </el-table-column>
        <el-table-column prop="address" label="操作" width="140" fixed="right">
            <template :slot-scope="{scope}">
                <el-button  type="text" size="small" @click="handlerEdite">编辑</el-button>
                <el-button type="text" size="small"><span style="color:red">删除</span></el-button>
            </template>
        </el-table-column>
      </el-table>
    </article>
    <article>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page.currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="page.pageSize"
        layout="sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </article>
  </div>
</template>

<script>
export default {
  name: "tableThemePage",
  components: {},
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },

        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      page: {
        currentPage: 1,
        pageSize: 10,
      },
      total: 1000,
      multipleSelection: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //编辑
    handlerEdite(row){
        console.log(row)
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
</style>