<template>
  <el-card shadow="never" class="aui-card--fill" >
    <div class="mod-sys__user">
      <article>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.username" :placeholder="$t('user.searchName')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <ren-select v-model="dataForm.gender" dict-type="gender" :placeholder="$t('user.gender')"></ren-select>
        </el-form-item>
        <el-form-item>
          <ren-dept-tree ref="userTableSelect" v-model="dataForm.deptId" :placeholder="$t('dept.title')" :query="true"></ren-dept-tree>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="" @click="handleRest">重 置</el-button>
        </el-form-item>
        
        <!-- <el-form-item>
          <el-button v-if="$hasPermission('sys:user:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('sys:user:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('sys:user:export')" type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item> -->

      </el-form>
    </article>
      <article style="height: 100%">
        <article class="table_header">
          <el-button v-if="$hasPermission('sys:user:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
          <el-button v-if="$hasPermission('sys:user:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
          <el-button v-if="$hasPermission('sys:user:export')" type="" @click="exportHandle()">{{ $t('export') }}</el-button>
        </article>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle"
        @sort-change="dataListSortChangeHandle"
        height="calc(100vh - 285px)"
        style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column type="index" label="序号" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="username" :label="$t('user.username')" sortable="custom" header-align="center" align="center"></el-table-column>
        <!--<el-table-column prop="deptName" :label="$t('user.deptName')" header-align="center" align="center"></el-table-column>-->
        <el-table-column prop="realName" :label="$t('user.realName')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="mobile" :label="$t('user.mobile')" sortable="custom" header-align="center" align="center"></el-table-column>
        <el-table-column prop="gender" :label="$t('user.gender')" sortable="custom" header-align="center" align="center">
          <template slot-scope="scope">
            {{ $getDictLabel("gender", scope.row.gender) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('user.status')" sortable="custom" header-align="center" align="center" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" size="small" type="danger">{{ $t('user.status0') }}</el-tag>
            <el-tag v-else size="small" type="success">{{ $t('user.status1') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" :label="$t('user.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column :label="$t('handle')"  header-align="center" align="center" width="240">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('sys:user:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
            <el-button v-if="$hasPermission('sys:user:setdatapermission')" type="text" size="small" @click="setDataPermission(scope.row.id)">{{ $t('user.setdatapermission') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </article>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      <SetDataPermission :visible.sync="setDataPermissionVisible" v-if="setDataPermissionVisible" ref="setDataPermission" @refreshDataList="getDataList"></SetDataPermission>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './user-add-or-update'
import SetDataPermission from './data-permission-set'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/user/page',
        getDataListIsPage: true,
        deleteURL: '/sys/user',
        deleteIsBatch: true,
        exportURL: '/sys/user/export'
      },
      dataForm: {
        username: '',
        deptId: '',
        gender: ''
      }
    }
  },
  components: {
    AddOrUpdate,
    SetDataPermission
  },
  methods:{
    handleRest(){
      this.dataForm.username= '';
      this.dataForm.gender= '';
      this.$refs.userTableSelect.clearHandle()
      this.getDataList();
    },
  }
}
</script>
<style scoped>
.table_header{
  border: 1px solid #EBEEF5;
  border-bottom: none;
  background-color: #F5F7FA;
  padding: 10px;
}
</style>
