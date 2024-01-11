<template>
  <div>
    <el-card>
      <el-form :inline="true" size="mini">
        <el-form-item label="客户名称">
          <el-input v-model="form.khmc" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="黑名单">
          <el-input v-model="form.hmd" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="" size="mini">查询</el-button>
          <el-button @click="" size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-row class="button">
        <el-button @click="" size="mini">新增</el-button>
        <el-button @click="" size="mini">删除</el-button>
        <el-button @click="" size="mini">标记黑名单</el-button>
        <el-button @click="" size="mini">移除黑名单</el-button>
      </el-row>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column  prop="date" label="客户名称" width="150">
        </el-table-column>
        <el-table-column prop="name" label="纳税人识别号" width="120">
        </el-table-column>
        <el-table-column prop="province" label="开户行" width="120">
        </el-table-column>
        <el-table-column prop="city" label="账号" width="120">
        </el-table-column>
        <el-table-column prop="address" label="地址" width="300">
        </el-table-column>
        <el-table-column prop="zip" label="电话" width="120">
        </el-table-column>
        <el-table-column prop="zip" label="联系人" width="120">
        </el-table-column>
        <el-table-column prop="zip" label="联系人手机" width="120">
        </el-table-column>
        <el-table-column prop="zip" label="黑名单" width="120">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="text" size="mini">编辑</el-button>
            <el-button @click="deleteRow(scope.row)" type="text" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="float:right" background layout="prev, pager, next" :total="1000">
        </el-pagination>
    </el-card>
  </div>
</template>

<script>

export default {
  methods: {
    deleteRow(row) {
      console.log(row);
    }
  },
  data() {
    return {
      form: {
        khmc: '',
        hmd: ''
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }]
    }

  },
  // mounted() {
  //   this.handleSearch();

  // },

  // methods: {
  //   // async handleSearch() {
  //   //   const { data = {} } = await getMcnList({
  //   //     ...this.form,
  //   //     pageNo: this.pagination.pageNo || 1,
  //   //     pageSize: this.pagination.pageSize || 10
  //   //   });
  //   //   this.pagination.total = data.total
  //   //   this.tableData = data.rows || [];
  //   // },
  //   resetForm() {
  //     this.form = {}
  //     this.pagination.pageNo = 1;
  //     this.pagination.pageSize = 10
  //     this.handleSearch();
  //   },
  // },
}
</script>
<style>
.button {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 10px;
}
</style>


