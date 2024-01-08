<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__powerlist">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.pname" placeholder="权限名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('sys:powerlist:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('sys:powerlist:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="pname" label="权限名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="powertype" label="调用标志" header-align="center" align="center"></el-table-column>
        <el-table-column prop="plisturl" label="URL" header-align="center" align="center"></el-table-column>
        <el-table-column prop="viewtype" label="展现类型" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.viewtype==1 ? $t('datapower.list') : scope.row.viewtype==2? $t('datapower.tree'):"" }}
          </template>
        </el-table-column>
        <el-table-column prop="pstate" label="状态" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.pstate==1 ? $t('datapower.ok') : scope.row.pstate==0? $t('datapower.cancel'):"" }}
          </template>
        </el-table-column>


        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('sys:powerlist:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('sys:powerlist:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
      <!-- 弹窗, 新增 / 修改 -->
      <AddOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></AddOrUpdate>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './powerlist-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/powerlist/page',
        getDataListIsPage: true,
        exportURL: '/sys/powerlist/export',
        deleteURL: '/sys/powerlist',
        deleteIsBatch: true
      },
      dataForm: {
        pname: ''
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
