<template>
  <div class="edit-down-table">
    <vxe-pulldown class="edit-down-pulldown" ref="xDown" transfer v-if="row.fphxz == '00'">
      <template>
        <vxe-input
          size="mini"
          class="edit-down-input"
          v-model="row[column.property]"
          suffix-icon="fa fa-caret-down"
          @focus="focusEvent"
          @change="keyupEvent"
          @blur="blurEvent"
          :disabled="!canEdit"
        >
          <template #suffix>
            <i style="cursor: pointer; color: #409eff; font-size: 16px" class="vxe-icon-menu" @click="showGoods" v-show="canEdit"></i>
          </template>
        </vxe-input>
      </template>
      <template v-slot:dropdown>
        <div class="edit-down-wrapper" v-loading="loading">
          <vxe-table
            size="mini"
            border
            stripe
            ref="mutiVxeTable"
            height="300"
            id="mutiVxeTable"
            @cell-click="cellClick"
            :custom-config="{ storage: true }"
            :data="customerData"
            :row-config="{ isHover: true, isCurrent: true }"
          >
            <!-- <vxe-column type="radio" min-width="40"></vxe-column> -->
            <template v-for="(item, index) in tableColumns">
              <!-- 对税率特殊处理 -->
              <vxe-column v-if="item.field === 'sl'" :width="item.width" :title="item.columnZh" :key="index">
                <template slot-scope="{ row }">
                  {{ getTaxDesc(row) }}
                </template>
              </vxe-column>
              <vxe-column v-else-if="item.field === 'dj'" :field="item.field" :width="item.width" :formatter="timeFormat" :title="item.columnZh" :key="index" />
              <vxe-column v-else :field="item.field" :width="item.width" :title="item.columnZh" :key="index" show-overflow />
            </template>
          </vxe-table>
          <vxe-pager
            background
            :current-page.sync="tablePage.currentPage"
            :page-size.sync="tablePage.pageSize"
            :total="tablePage.totalResult"
            :layouts="['PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump']"
            @page-change="pageChangeEvent"
          >
          </vxe-pager>
        </div>
      </template>
    </vxe-pulldown>
    <span v-else-if="row.fphxz == '02'">{{ row.hwhyslwfwmc }}</span>
    <span v-else><el-tag type="danger">折扣</el-tag>{{ row.hwhyslwfwmc }}</span>
  </div>
</template>

<script>
import { queryProductProfile } from '@/components/ProductProfileModal/Api';
import { throttle } from '@/utils/tool.js';
export default {
  name: 'EditDownTable',
  props: {
    params: Object,
    canEdit: Boolean,
    showGoodsDlg: Function,
    handleSubmitProduct: Function,
    orgid: {
      type: String,
      default: '',
    },
    tdys: {
      type: String,
      default: '',
    },
    // 发票种类
    fplx: {
      type: String,
      default: '',
    },
  },
  data() {
    this.currentCell = {}; // 当前点击cell选中的值
    this.isClickCell = false; // 是否点击cell，100毫秒自动清空
    return {
      row: null,
      column: null,
      loading: false,
      tableData: [],
      // tableColumn: [{ type: 'seq' }, { field: 'name', title: 'Name' }, { field: 'role', title: 'Role' }, { field: 'sex', title: 'Sex' }],
      tablePage: {
        totalResult: 0,
        currentPage: 1,
        pageSize: 20,
      },
      tableColumns: [
        {
          id: 'set-spmc',
          field: 'name',
          columnZh: '商品名称',
          width: '260px',
        },
        {
          id: 'set-ssflbm',
          field: 'taxclasscode',
          columnZh: '税收分类编码',
          width: '180px',
        },
        {
          id: 'set-hwhlwmc',
          field: 'taxclassname',
          columnZh: '货物和劳务名称',
          width: '140px',
        },
        {
          id: 'set-sphfwfljc',
          field: 'taxclassjc',
          columnZh: '商品和服务分类简称',
          width: '150px',
        },
        {
          id: 'set-dj',
          field: 'dj',
          columnZh: '单价',
          width: '120px',
        },
        {
          id: 'set-sl',
          field: 'sl',
          columnZh: '税率',
          width: '60px',
        },
        {
          id: 'set-ggxh',
          field: 'ggxh',
          columnZh: '规格型号',
          width: '100px',
        },
      ],
      customerData: [],
    };
  },
  computed: {
    // 是否是成品油
    // isOil() {
    //   return ['8', '10', '11'].includes(this.fplx) ? 'Y' : 'N'
    // },
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      const { row, column } = this.params;
      this.row = row;
      this.column = column;
      if(row.fphxz == '00')this.queryProductProfile();
    },
    timeFormat(row) {
      if ((row.cellValue ?? '') !== '') {
        return Number(row.cellValue).toFixed(2);
      } else {
        return row.cellValue;
      }
    },
    /**
     * @description 查询商品列表
     */
    async queryProductProfile() {
      const { row, column, tablePage, tdys, orgid } = this;
      const keyword = row[column.property];
      if (!keyword || !keyword.trim()) {
        this.loading = false;
        return;
      }
      const param = {
        keyword,
        tdys: tdys,
        orgids: [0, orgid],
        // isOil: this.isOil, // 商品类型是否是成品油
        pageNo: tablePage.currentPage,
        pageSize: tablePage.pageSize,
      };
      this.loading = true;
      try {
        const { pageNo = 1, pageSize = 10, totalCount = [], data = [] } = await queryProductProfile(param);
        this.customerData = data;
        this.tablePage = { currentPage: pageNo, pageSize: pageSize, totalResult: totalCount };
      } finally {
        this.loading = false;
      }
    },
    blurEvent() {
      this.setRowName();
    },
    getTaxDesc(row) {
      return row.sl == null ? '' : row.lslbs == 2 || (row.taxclasscode || '').substring(0, 1) == '6' ? '不征税' : row.lslbs == 1 ? '免税' : row.sl * 100 + '%';
    },
    // 选中商品
    cellClick({ row }) {
      console.log(row, this.row);
      // return
      try {
        this.handleSubmitProduct(row);
        this.$refs.xDown.hidePanel();
      } catch (error) {
        console.log('---error---', error);
      }
    },
    // 输入框获取焦点事件
    focusEvent() {
      this.setRowName();
      this.$refs.xDown.showPanel();
    },
    setRowName() {
      try {
        if (this.row.hwhyslwfwmc) {
          // 赋值项目名称，防止搜索的不到数据，以及非第一次编辑项目名称时没有点击cell，只是删除名称
          const rnArr = this.row.hwhyslwfwmc.split('*');
          this.$set(this.row, this.column.property, rnArr[rnArr.length - 1]);
        }
      } catch (error) {
        
      }
    },
    // 输入动态搜索
    keyupEvent: throttle(function () {
      const { row, column } = this;
      const cellValue = row[column.property];
      this.loading = true;
      this.queryProductProfile();
    }, 500),
    // 展示商品搜索弹窗
    showGoods() {
      try {
        this.showGoodsDlg(this.params.row, this.params.rowIndex);
      } catch (error) {
        console.log('---error---', error);
      }
    },
    // 切换page
    pageChangeEvent({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
      this.loading = true;
      this.queryProductProfile();
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-down-pulldown {
  width: 100%;
}
.edit-down-wrapper {
  width: 600px;
  // height: 300px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.1);
}
</style>
