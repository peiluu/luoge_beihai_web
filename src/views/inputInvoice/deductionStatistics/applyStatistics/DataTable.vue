<template>
  <div class="com-data-table">
    <div class="table-title">{{ title }}</div>
    <el-table :data="tableData" style="width: 100%" :header-cell-style="{
      fontWeight: 400,
      background: '#FAFBFC',
      color: '#B7B6B3',
    }">
      <template v-for="(column, columnIndex) in columns">
        <el-table-column :key="columnIndex" :prop="column.dataIndex" :align="column.align || 'left'" :label="column.title" :sortable="column.sortable" :min-width="column.width">
          <template slot-scope="scope">
            <slot :name="column.slot" :data="scope.row">
              <span :style="{ color: column.color || '#717373' }">{{ scope.row[column.dataIndex] || '--' }}</span>
            </slot>
          </template>
        </el-table-column>
        <!-- <el-table-column v-else-if="column.dataIndex" :key="columnIndex" :prop="column.dataIndex" :align="column.align ||'left'" :label="column.title" :sortable="column.sortable" :formatter="column.format" :min-width="column.width"> -->

      </template>
    </el-table>

  </div>
</template>

<script>
/**
 * @description 页面表格组件 - 适用简单的表格
 * @param tableData 表格数据
 * @param tableColumns 表格项
 */
export default {
  name: 'DataTable',
  props: {
    // 查看
    handleViewClick: {
      type: Function,
      default: () => { }
    },
    // 编辑
    handleEditClick: {
      type: Function,
      default: () => { }
    },
    // 删除
    handleDeleteClick: {
      type: Function,
      default: () => { }
    },
    tableData: {
      type: Array
    },
    columns: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,

    },

    showBtns: {
      type: Boolean,
      default: true
    },
    showSort: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number,
    },
  },
  data() {
    return {
      // 操作按钮列表
      btnList: [{ name: 1 }]
    };
  },
  methods: {
    // 打开下级页面
    openDetail() { }
  }
};
</script>
<style lang="scss" scoped>
.com-data-table {
  padding: 0 16px;
}

.table-title {
  margin: 16px 0 8px;
  color: #606266;
  font-size: 14px;
  font-weight: bold;
}

/deep/ .column-left {
  font-weight: bold;
}
</style>
