<template>
  <vxe-pulldown ref="pulldownRef" transfer class="custom-vxe-pulldown">
    <template #default>
      <!-- 蓝字审核人 -->
      <vxe-select multiple clearable size="mini" filterable v-model="form[nameKey]" suffix-icon="vxe-icon-table" @click.native="focusEvent()" @keyup.enter.native="selectShr()" @suffix-click="suffixClick" @blur="blur"
        @change="focusEvent" placeholder="请选择">
      </vxe-select>
    </template>
    <template #dropdown>
      <div class="my-dropdown">
        <div class="dropdown-header">
          <!-- <vxe-input size="mini" v-model="username" class="grid-input" suffix-icon="vxe-icon-table" placeholder="请输入姓名查询" @keyup.enter.native="selectShr" @focus="focusEvent" @suffix-click="suffixClick" /> -->
          <vxe-input size="mini" v-model="username" class="grid-input" placeholder="请输入姓名查询" @keyup.enter.native="selectShr" @focus="focusEvent" @suffix-click="suffixClick" />
          <el-button type="success" @click="filterShr">查询</el-button>
        </div>
        <vxe-grid ref="xTable" size="mini" height="300" border :row-config="{ isHover: true }" :data="selectShrList" :columns="tableColumn" @cell-click="cellClickEvent" @page-change="pageChangeEvent">
        </vxe-grid>
      </div>
    </template>
  </vxe-pulldown>
</template>

<script>
/**
 * @description 税控设备添加
 */
import { getListByUser, auditSet, getDataHbbbCode } from './Api.js'
import { inputFplxList, fplxMap } from '@/config/constant'
export default {
  name: 'TaxControlEquipment',
  components: {},
  props: {
    businessType: {
      type: String,
      default: '',
    },
    // 编辑
    isEdit: {
      type: Boolean,
    },
    nameKey: {},
    codeKey: {},
    form: {},
  },
  data() {
    return {

      // 审核人列表
      selectShrList: [],
      tableColumn: [
        { type: 'checkbox', width: 100 },
        { field: 'hbztbm', title: '编码', width: 100 },
        { field: 'hbztmc', title: '名称', width: 120 },
        { field: 'departmentName', title: '部门', width: 300 }
      ],
      pagerConfig: {
        total: 0,
        currentPage: 1,
        pageSize: 100
      },
      searchName: '',
      username: '',
      originSelectShrList: [],
    };
  },
  mounted() {
    this.selectShr();
  },
  computed: {

  },
  methods: {
    filterShr() {

    },
    // 查询审核人
    async getDataHbbbCode() {
      const { code = '', data = [], totalCount, pageNo, pageSize } = await getDataHbbbCode({
        username: this.username,
        pageNo: this.pagerConfig.currentPage,
        pageSize: this.pagerConfig.pageSize
      })
      if (code === '0') {
        this.pagerConfig.total = totalCount
        // this.pagerConfig.currentPage = pageNo
        // this.pagerConfig.pageSize = pageSize
        this.selectShrList = data
        this.originSelectShrList = data;
      }

    },
    focusEvent() {
      const $pulldown = this.$refs.pulldownRef
      if ($pulldown) {
        $pulldown.showPanel()
      }
    },

    suffixClick() {
      const $pulldown = this.$refs.pulldownRef
      if ($pulldown) {
        $pulldown.togglePanel()
      }
    },
    cellClickEvent({ row }) {
      const $pulldown = this.$refs.pulldownRef
      if ($pulldown) {
        let selectRecords = this.$refs.xTable.getCheckboxRecords()
        this.form[this.nameKey] = selectRecords.map((item) => item.username)
        this.form[this.codeKey] = row.usercode
        $pulldown.hidePanel()

        console.log(selectRecords)
        console.log(this.form)
        this.$emit('submitShr', this.form)
      }
    },
    pageChangeEvent({ currentPage, pageSize }) {
      this.pagerConfig.currentPage = currentPage
      this.pagerConfig.pageSize = pageSize
      this.selectShr();
    },
    blur() {
      if (!this.form[this.nameKey]) {
        this.form[this.nameKey] = ''
        this.form[this.codeKey] = ''
        this.$emit('submitShr', this.form)
        console.log(this.form)



      }
    }

  }
};
</script>
<style lang="scss">
.vxe-button--dropdown.is--active,
.vxe-button--dropdown:hover {
  button {
    //color: $primaryGreenColor;
    // border-color: $primaryGreenColor;
  }
}

.custom-vxe-pulldown {
  width: 100%;
}

.vxe-pulldown--panel {
  z-index: 99999 !important;
}

.vxe-dropdown--panel {
  z-index: 2010 !important
}

//选择框
.vxe-select--panel {
  z-index: 9997 !important
}

.my-dropdown {
  padding: 12px;

  .dropdown-header {
    display: flex;
    margin-bottom: 12px;
  }

  .el-button {
    margin-left: 12px;
  }
}
</style>
