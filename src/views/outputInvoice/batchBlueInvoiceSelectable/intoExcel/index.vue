<template>
  <div class="">
    <el-dialog
      :title="title"
      :visible="visible"
      :width="width"
      :fullscreen="false"
      @update:visible="updateVisible"
      :before-close="handleClose"
    >
      <article>
        <article style="margin-bottom:10px;">
          <el-card shadow="never" :body-style="{paddingBottom:'0px'}" >
            <el-form :model="desForm">
              <el-form-item label="发票状态">
                <el-select v-model="desForm.status" placeholder="请选择" @change="handleSelectChange" style="margin-left: 5px">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></el-option>
                  </el-select>
              </el-form-item>
            </el-form>
          </el-card>
        </article>
        <el-card shadow="never" style="height:calc(100vh - 395px)">
        <article>
          <el-table :data="tableData" v-loading="loading" style="width: 100%;height:calc(100vh - 470px);overflow: hidden auto;" :border="true">
            <el-table-column type="index" label="序号" width="55">
            </el-table-column>
            <el-table-column
              prop="xsfmc"
              label="销售方名称"
              minWidth="130"
              show-overflow-tooltip
              :header-align="'center'"
            >
            </el-table-column>
            <el-table-column
              prop="xsfnsrsbh"
              label="销售方纳税识别号"
              show-overflow-tooltip
              :header-align="'center'"
              minWidth="180"
            >
            </el-table-column>
            <el-table-column
              prop="gmfmc"
              label="购买方名称"
              show-overflow-tooltip
              :header-align="'center'"
              minWidth="130"
            >
            </el-table-column>
            <el-table-column
              prop="gmfnsrsbh"
              label="购买方纳税识别号"
              show-overflow-tooltip
              :header-align="'center'"
              minWidth="180"
            >
            </el-table-column>
            <el-table-column
              prop="status"
              label="发票状态"
              show-overflow-tooltip
              :header-align="'center'"
              :align="'center'"
              minWidth="110"
            >
            <template slot-scope="scope">
              <el-tag :type="['success','warning','danger','warning','info'][handleStatus(scope).type]">{{handleStatus(scope).txt  }}</el-tag>
              
            </template>
            </el-table-column>
            <el-table-column
              prop="fphm"
              label="发票号码"
              show-overflow-tooltip
              :header-align="'center'"
              :align="'center'"
              minWidth="110"
            >
            </el-table-column>
            <el-table-column
              prop="hjje"
              minWidth="110"
              label="金额"
              show-overflow-tooltip
              :header-align="'center'"
              :align="'right'"
            >
            </el-table-column>
            <el-table-column
              prop="hjse"
              minWidth="110"
              label="税额"
              show-overflow-tooltip
              :header-align="'center'"
              :align="'right'"
            >
            </el-table-column>
            <el-table-column
              prop="jshj"
              minWidth="80"
              label="价税合计"
              show-overflow-tooltip
              :header-align="'center'"
              :align="'right'"
            >
            </el-table-column>
            <el-table-column label="操作" width="180" :header-align="'center'" :align="'center'">
              <template slot-scope="scope">
                <el-button v-if="scope.row.status === '00' || scope.row.status === '02'"
                  @click="handleDownDes(scope)"
                  type="text"
                  size="small"
                >
                  查看
                </el-button>
                <el-button v-else
                  @click="handleViewDes(scope)"
                  type="text"
                  size="small"
                >
                  预览
                </el-button>
               
              </template>
            </el-table-column>
          </el-table>
        </article>
        <article>
          <el-pagination
          background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-sizes="page.pageSizes"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
          >
          </el-pagination>
        </article>
        </el-card>
      </article>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateVisible(false)" type="primary">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getInvoiceQuota, getUploadedData } from "../api";
import { config } from "@/config";
import { customPost } from "@/utils/request.js";
import { dynamicUrlMap } from "@/config/constant.js";
import { previewPdf } from "@/utils/tool";
export default {
  name: "intoExcelPage",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: "title",
    },

    width: {
      type: String,
      default: "50%",
    },
    respData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {},
  data() {
    return {
      intoForm:{...this.respData},
      desForm:{status:this.respData.type || ''},
      tableData: [],
      loading: false,
      page:{
        currentPage:1,
        pageSizes:[10,20,30,50,70,100,150,200],
        pageSize:10,
        total:1
      },
      statusOptions:[
        {label:'全部',value:''},
        {label:'开票成功',value:'00'},
        {label:'开票中',value:'01'},
        {label:'开票失败',value:'02'},
        {label:'待开票',value:'04'},
      ]
    };
  },
  computed: {},
  watch: {
    respData: {
      handler(val) {
        this.intoForm = { ...val };
        this.desForm.status = val.type || '';
      },
    },
  },
  methods: {
    /* 初始化 */
    handleInit() {
      this.handleGetUploadData();
    },
    /* 获取数据 */
    handleGetUploadData() {
      this.loading = true;
      let data = {
        pch:this.intoForm.pch,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        status:this.desForm.status || ''
      };
      getUploadedData(data)
        .then((res) => {
          if ([0, '0'].includes(res.code)) {
            this.tableData = [...res.data];
            this.page.total = res.totalCount;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /* 查看详情 */
    handleViewDes(scope) {
      console.log(scope.row);
      const { id } = scope.row || {};
      window.open(
        `${
          dynamicUrlMap[process.env.NODE_ENV].frontUrl
        }#/invoice/preview?id=${id}`,
        "_blank"
      );
    },
    handleDownDes(scope){
      //const {id} = scope.row || {};
      previewPdf(scope.row)
    },
    /* 分页事件 */
    handleSizeChange(val) {
      this.page.pageSize = val;
       
        this.handleGetUploadData()
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.handleGetUploadData()
    },
    /* 状态 */
    handleStatus(scope){
      const {status} = scope.row || {};
      if (status == '00') {
        return { txt: '开票成功', type: 0 }
      } else if (status == '01') {
        return { txt: '开票中', type: 1 }
      } else if (status == '02') {
        return { txt: '开票失败', type: 2 }
      } else if (status == '03') {
        return { txt: '开票中', type: 3 }
      } else if (status == '04') {
        return { txt: '待开票', type: 4 }
      }
    },
    /* 改变搜索 */
    handleSelectChange(val){
      this.handleGetUploadData();
    },
    /* 关闭 */
    updateVisible(value) {
      this.$emit("update:visible", value);
    },

    /* 确认 */
    handleConfirm() {},

    /* 关闭前 */
    handleClose() {
      this.updateVisible(false);
    },
  },
  created() {},
  mounted() {
    this.handleInit();
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
};
</script>
<style scoped lang="scss">
/*@import url(); 引入公共css类*/
::v-deep .el-upload-dragger {
  width: 360px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
::v-deep .el-upload-dragger .el-icon-upload {
  font-size: 16px;
  margin: 7px 0 5px;
  line-height: 0.5;
}
::v-deep .el-dialog__body{
  padding-top: 10px;
  
}
::v-deep .el-card__body{
  // padding: 0px;
}
</style>