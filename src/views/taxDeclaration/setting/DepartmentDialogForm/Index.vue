<template>
  <el-dialog title="编辑独立生产经营部门" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
    <div class="table-tools"><el-button @click="handleAddFun">新增</el-button></div>

    <div class="custom-table">
      <el-table stripe ref="table" :data="tableData" border :height="280" tooltip-effect="dark" :cell-style="{ textAlign: 'center' }" :header-cell-style="{
        fontWeight: 400,
        borderTop: '1px solid #adb4bc',
        background: '#f7f9fd',
        color: '#333333',
        textAlign: 'center'
      }">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="经营部门名称" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.dlscjymc" placeholder="请输入" maxlength="100" />
          </template>
        </el-table-column>
        <el-table-column label="关联账套" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.id" placeholder="请选择" filterable clearable @change="(e) => handleSelect(e, scope.$index)">
              <el-option v-for="item in allZtList" :key="item.id" :label="`${item.name} ${item.code}`" :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="合并报表系统编码" align="center">
          <template slot-scope="scope">
            <MutSelect :key="scope.$index" :selectList="dataHbbbCodeList" :size="'small'" :defaultValue="scope.row.hbbbbmList || []" propsParam="hbbbbmList"
              @getMutSelectForm="(val) => getMutSelectForm(val, scope.$index)" />
            <!--
            <el-select multiple collapse-tags v-model="scope.row.hbbbbmList" placeholder="请选择" filterable clearable>
              <el-option v-for="(item) in dataHbbbCodeList" :key="item.hbztbm" :label="`${item.hbztmc} ${item.hbztbm}`" :value="item.hbztbm"></el-option>
            </el-select> -->
          </template>
        </el-table-column>
        <!-- <el-form-item label="合并报表系统编码" prop="hbbbbmList">
          <el-select multiple collapse-tags v-model="form2.hbbbbmList" placeholder="请选择" filterable>
            <el-option v-for="(item) in dataHbbbCodeList" :key="item.hbztbm" :label="`${item.hbztmc} ${item.hbztbm}`" :value="item.hbztbm"></el-option>
          </el-select>
        </el-form-item> -->
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button @click="handleDelete(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="success" @click="saveData">保 存</el-button>
    </span>

  </el-dialog>
</template>

<script>
import MutSelect from '@/components/MutSelect';
import { getAllZt } from './Api';
export default {
  name: "DepartmentDialogForm",
  components: { MutSelect },
  props: {
    dlscjybmList: {
      type: Array,
      default: () => []
    },
    taxBodyId: {
    },
    dataHbbbCodeList: {},
  },
  data() {
    return {
      dialogVisible: false,
      allZtList: [],
      tableData: []
    };
  },
  watch: {
    dlscjybmList: {
      handler(arr) {
        this.tableData = [...arr]
      },
      deep: true // 开启深度观察
    },
    taxBodyId(val) {
      if (val) {
        this.getAllZt(val)
      }
    },
    dialogVisible(val) {
      this.tableData = [...this.dlscjybmList]
    },
  },
  mounted() {
    this.getAllZt()
  },
  methods: {
    /**
    * @desption 【组织管理】获取所有账套
    */
    async getAllZt(id) {
      const { code = '', data = [] } = await getAllZt({ id })
      if (code === '0') {
        this.allZtList = data
      }
    },
    handleSelect(value, index) {
      this.tableData[index].dlscjymc = this.allZtList.find((item) => item.id === value).name
    },

    handleClose() {
      this.dialogVisible = false;
      // this.tableData = []
    },
    saveData() {
      if (this.tableData.find((item) => !item.dlscjymc || !item.id || !item?.hbbbbmList?.length)) {
        this.$message.warning('请补全信息')
        return;
      }
      this.tableData.forEach((item) => {
        item.code = this.allZtList.find((subitem) => subitem.id == item.id)?.code
      })

      this.$emit('changeDlscjybmList', this.tableData)
      this.dialogVisible = false
    },
    getMutSelectForm(val, index) {
      this.tableData[index].hbbbbmList = val
    },
    handleAddFun() {
      this.tableData.push({ id: '', dlscjymc: '' })
    },
    handleDelete(index) {
      this.tableData.splice(index, 1)
    }
  }
};

</script>
<style scoped lang="scss">
/deep/ .el-dialog__body {
  padding-top: 8px;

  .el-input,
  .el-select,
  .vxe-select {
    width: 100%
  }

  .table-tools {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 4px;
  }
}
</style>

