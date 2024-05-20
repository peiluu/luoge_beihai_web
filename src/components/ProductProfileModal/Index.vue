<template>
  <div>
  <el-dialog  :visible.sync="dialogVisible" min-height="600px;" width="80%" :show-close="!loading" :before-close="handleClose">
    <template slot="title">
      <span>{{title}}</span>
      <span style="display:inline-block;margin-left:15px;">
        <el-button type="primary" @click="handleAddCustom" size="mini" :disabled="!activeId">添 加</el-button>
      </span>
    </template>
    
    <div  class="dialog_content" v-loading="loading">
    <div class="content-left">
      <vxe-table max-height="500" show-overflow :show-header="false" row-key 
      :row-config="{ isHover: true, isCurrent: true }" border ref="xTree" 
      row-id="id" :data="treeData" 
      :tree-config="{
        transform: true,
        accordion: true,
        rowField: 'id',
        parentField: 'pid',
        lazy: true,
        hasChild: 'hasChild',
        loadMethod: loadChildrenMethod,
        iconOpen: 'vxe-icon-square-minus-fill',
        iconClose: 'vxe-icon-square-plus-fill',
        expandRowKeys: ['0', 0]
      }" row-config.keyField="id" @cell-click="({ row }) => queryProductProfile(row)">
        <vxe-column field="name" title="商品分类" :title-prefix="{ icon: 'vxe-icon-square-minus-fill' }" tree-node>
        </vxe-column>
      </vxe-table>
    </div>
    <div class="content-right">
      <vxe-toolbar ref="buyerToolbar">
        <template #buttons>
          <vxe-input @keyup.enter.native="queryProductProfile({}, 'search')" @clear="queryProductProfile({}, 'search')" 
          style="width: 400px;" v-model="customerQuery.keyword" placeholder="请输入商品名称/简码/商品编码/税收分类编码" clearable>
            <template #prefix>
              <i style="cursor: pointer;color: #00b390;font-size: 16px;" class="vxe-icon-search" @click="queryProductProfile({}, 'search')"></i>
            </template>
          </vxe-input>
        </template>
      </vxe-toolbar>

      <vxe-table size="mini" border stripe ref="mutiVxeTable" max-height="500" id="mutiVxeTable" @cell-click="cellClick" :custom-config="{ storage: true }" :data="customerData"
        :row-config="{ isHover: true, isCurrent: true }">
        <vxe-column type="radio" min-width="40"></vxe-column>
        <template v-for="(item, index) in tableColumns">
          <!-- 对税率特殊处理 -->
          <vxe-column v-if="item.field === 'sl'"  :width="item.width" :min-width="item.columnZh.length * 30" :title="item.columnZh" :key="index">
            <template slot-scope="{ row }">
              {{ getTaxDesc(row) }}
            </template>
          </vxe-column>
          <vxe-column v-else-if="item.field === 'dj'"  
          :field="item.field" :min-width="item.width" 
          :formatter="timeFormat" :title="item.columnZh" 
          :key="index" />
          <!-- 特定要素 :formatter="(val)=> val.toFixed(2)"-->
          <!-- <vxe-column v-else-if="item.field === 'tdys'" :min-width="item.columnZh.length * 30" :title="item.columnZh" :key="index">
            <template slot-scope="{ row }">
              {{ row.tdys == '06' ? '不动产经营租赁' : row.tdys == '05' ? '不动产销售' : row.tdys == '03' ? '建筑服务' : row.tdys == '00' ? '通用' : '' }}
            </template>
          </vxe-column> -->
          <vxe-column v-else :field="item.field" :min-width="item.columnZh.length * 25" :title="item.columnZh" :key="index" />
        </template>
      </vxe-table>
      <vxe-pager size="mini" :current-page="customerPage.currentPage" :page-size="customerPage.pageSize" :total="customerPage.totalResult" :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="handleCustomerPageChange">
      </vxe-pager>
    </div>
  </div>
  
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose" :disabled="loading">关 闭</el-button>
      <el-button type="success" @click="handleSubmit" :disabled="loading">添加至发票</el-button>
    </span>
  </el-dialog>
  <add-commindity-com v-if="addVisible" :commodity-active-id="activeId"  
     :visible.sync="addVisible" 
    :title="title" 
    @saveDone="handleSaveDone"
    width="75%"></add-commindity-com>
</div>
</template>

<script>
import { getNextLayer, queryProductProfile, queryColumn } from './Api';

import { defaultHeader, defaultHeaderMotor } from './constant';
import addCommindityCom from '@/views/commodity/componetns/dataAddDrawerOnly/index.vue'
export default {
  name: 'ProductProfileModal',
  props: {
    tdys: '',
    dialogVisible: {
      type: Boolean,
    },
    title: {
      type: String,
      default: '商品档案'
    },
    orgid: {
      // type: String,
    },   
    // 发票种类
    fplx: {
      type: String,
    }
  },
  components: {
    addCommindityCom
  },
  data() {
    return {
      treeData: [{
        id: 0,
        hasChild: true,
        name: '商品分类',
      }],
      // tableColumns: [],
      tableData: [],
      customerData: [],
      customerPage: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      },
      customerQuery: {
        pageNo: 1,
        pageSize: 10,
      },
      materialType: '1',
      ismotor: '',
      marclasscode: '',
      loading:false,
      addVisible:false,
      activeId:  null,
      title:'添加商品'
    }
  },

  watch: {
    dialogVisible(newVal, oldVal){
      if(newVal){
        this.queryProductProfile({}, 'search');
      }
    }
  },
  computed: {
    height() {
      return window.innerHeight - 280;
    },
    // 是否是成品油
    isOil() {
      return ['8', '10', '11'].includes(this.fplx) ? 'Y' : 'N'
    },
    tableColumns() {
      return this.materialType === '1' ? defaultHeader.theadArr : defaultHeaderMotor.theadArr
    }
  },
  methods: {
    cellClick({ row }) {
      this.$refs.mutiVxeTable.setRadioRow(row)
    },
    /**
     * @description 查询商品列表
     */
    async queryProductProfile(row = {}, type) {
      console.log(row,type,"----")
      this.activeId = row.id ?? null;
      // 两种查询方法，通过点击查询和搜索查询，如果是通过搜索查询，row无值，需要从data取原有的值，保证查询条件不被覆盖
      const ismotor = type == 'search' ? this.ismotor : row.ismotor
      const marclasscode = type == 'search' ? this.marclasscode : row.code
      if (type !== 'search') {
        this.ismotor = ismotor;
        this.marclasscode = marclasscode
      }
      const param = {
        ...this.customerQuery,
        tdys: this.tdys,
        orgids: [0, this.orgid],
        isOil: this.isOil, // 商品类型是否是成品油
        pageNo: row.pageNo || 1,
        pageSize: row.pageSize || 10,
      }
      this.loading = true;
      try{const { pageNo = 1, pageSize = 10, totalCount = [], data = [], } = await queryProductProfile({
          ...param,
          marclasscode,
          ismotor
        });

        this.customerData = data;
        this.customerQuery = param;
        this.customerPage = { currentPage: pageNo, pageSize: pageSize, totalResult: totalCount }
      }finally{
        this.loading = false;
      }
      
    },

    handleCustomerPageChange({ currentPage, pageSize }) {
      this.customerQuery.pageNo = currentPage
      this.customerQuery.pageSize = pageSize
      this.queryProductProfile(this.customerQuery);
    },
    // 懒加载子集
    async loadChildrenMethod({ row }) {
      return new Promise(resolve => {
        setTimeout(async () => {
          const childs = await this.getNextLayer({ id: row.id })
          resolve(childs)
        }, 500)
      })
    },
    /**
     * @desption 查询商品档案
     */
    async getNextLayer(row) {
      const { code = '', data = [] } = await getNextLayer(row)
      if (code === '0') {
        data.map((item) => {
          item.hasChild = item.bleaf == 'N'
        })
        // 第一次加载时查询表头和默认展示的表格数据
        if (row.id === 0) {
          this.queryColumn()
        //  this.queryProductProfile(row)
        }
        return data
      }
    },

    /**
  * @desption 查询商品表头
  */
    async queryColumn() {
      /*const { code = '', data = [] } = await queryColumn({
        type: 32
      })
      if (code === '0') {
        this.tableColumns = data;
      }*/
    },

    handleClose() {
      if(this.loading) return;
      this.$refs.mutiVxeTable.removeRadioRow();
      this.$emit('closeDialog')
    },
    // 提交勾选的数据
    handleSubmit() {
      const row = this.$refs.mutiVxeTable.getRadioRecord();
      if (!row) {
        this.$message.warning('请选择数据！');
        return
      }
      this.$emit('handleSubmitProduct', row)
    },
    getTaxDesc(row) {
      return row.sl == null ? '' :
        (row.lslbs == 2 || (row.taxclasscode || '').substring(0, 1) == '6' ? '不征税' :
          (row.lslbs == 1 ?
            '免税' :
            row.sl * 100 + '%'))
    },

    timeFormat(row){
    
      if((row.cellValue??'') !==''){
        return Number(row.cellValue).toFixed(2)
      }else{
        return row.cellValue
      }
    },
    handleAddCustom(){
      // this.$emit("handleJumpClose",false)
      // this.$router.push({
      //   path: '/commodity/index',
      //   query:{is_open:true}
      // })
      this.addVisible = true;
    },
    /* 返回 */
    handleSaveDone(val){
      console.log(val)
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/variables';
::v-deep .el-dialog {
  position: relative;
  z-index: 99999;

  .dialog_content {
    display: flex;
    padding: 10px 0;
    min-height: 550px;
  }
}

::v-deep .vxe-body--row {
  cursor: pointer;
}

.vxe-toolbar {
  padding: 0;
}

::v-deep .vxe-table {
  .vxe-body--row.row--hover.row--current,
  .row--current,
  .row--hover {
    background: #ccf0ec;
  }
}

.content-left {
  width: 20%;
}

.content-right {
  margin: 0 12px;
  width: calc(80% - 24px);

  .right-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  ::v-deep .vxe-table {
    width: 100%;
    margin-top: 10px;

    .vxe-radio--icon,
    .vxe-icon-radio-checked,
    .vxe-icon-radio-unchecked:hover {
      color: $primaryGreenColor !important;
    }
  }
}

::v-deep.el-input {
  width: 50%;

  .el-input__suffix {
    display: flex;
    align-items: center;
    left: 8px;
  }

  .el-input__inner {
    padding-left: 24px;
  }
}
</style>
