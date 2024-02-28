<template>
  <div class="main-content" :style="'min-height: ' + contentHeight + 'px;'">
    <el-form :inline="true">
      <el-form-item label="纳税主体" prop="nsrsbh">
        <el-select v-model="form.nsrsbh" placeholder="请选择" @change="getInfo" filterable style="width: 280px; marginRight: 12px">
          <el-option v-for="item in taxBodyList" :label="item.label" :value="item.value" :key="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="本期" prop="skssq">
        <el-date-picker v-model="form.skssq" type="month" value-format="yyyy-MM" @input="getInfo" placeholder="请选择" :picker-options="pickerOptions" />
      </el-form-item>
    </el-form>

    <!-- 数据信息 -->
    <div class="content-info" v-loading="loading">
      <div class="info-header">
        <!-- <div class="left">本期：{{ form.skssq }}</div> -->
        <div class="left" />
        <div class="right"><span :class="{ 'abnormal': creditInfo.edyjzt === 'Y' }" />额度状态{{ creditInfo.edyjzt === 'Y' ? '异常' : '正常' }}</div>
      </div>

      <div class="info-main">
        <div v-for="(item, index) in quotaDataList" :key="index" class="item">
          <div class="tit">{{ item.label }}</div>
          <div class="txt">{{ item.value }}</div>
        </div>
      </div>
    </div>

    <!-- 按钮行 -->
    <div class="content-tools">
      <div class="tools-left">
        <div><i class="el-icon-warning" /> 发票额度以月度更新，不可延用;发票数量以年度更新，可延用，发票数量低于设置比例(默认10%)时，自动下载发票</div>
        <div><i class="el-icon-warning" /> 当存在临时额度时，需更新</div>
      </div>
      <el-button @click="updateCredit" type="success">授信额度更新</el-button>
    </div>

    <!-- 数据表格头部 -->
    <div class="content-table-header">
      <div class="left">
        <span :class="{ active: activeName == 'credit' }" @click="changeActiveName('credit')">历史授信额度信息</span>
        <span :class="{ active: activeName == 'encode' }" @click="changeActiveName('encode')">历史票量赋码信息</span>
      </div>
      <div class="right" @click="toDetail()">更多数据</div>
    </div>
 
    <div class="custom-table" v-loading="tableLoading">
      <el-table stripe ref="table" border tooltip-effect="dark" highlight-current-row :data="tableData" :header-cell-style="{
        fontWeight: 400,
        borderTop: '1px solid #adb4bc',
        background: '#f7f9fd',
        color: '#333333',

      }">
        <el-table-column type="index" label="序号" />
        <el-table-column label="主体名称" prop="nsrmc" :min-width="200" />
        <el-table-column label="纳税人识别号码" prop="nsrsbh" :min-width="150" />


        <!-- 历史授信额度信息 -->
        <template v-if="activeName === 'credit'">
          <el-table-column label="所属期限" prop="skssq" :min-width="120" align="center">
            <template slot-scope="scope">{{ dateFormat('YYYY-MM', scope.row.skssq) }}</template>
          </el-table-column>
          <el-table-column label="调整额度" prop="bysxed" :min-width="120" />
          <el-table-column label="授信时间" prop="updatetime" :min-width="150" align="center"/>
          <el-table-column label="授信有效时间起" prop="syqjq" :min-width="150" align="center"/>
          <el-table-column label="授信有效时间止" prop="syqjz" :min-width="150" align="center"/>
          <!-- <el-table-column label="调整额度类型" prop="sqlx" :min-width="120">
            <template slot-scope="scope"> {{ scope.row.sqlx == '0' ? '下载' : scope.row.sqlx == '1' ? '退回' : '' }} </template>
          </el-table-column> -->
        </template>
        <!-- 历史授信额度信息 -->
        <template v-else>
          <el-table-column label="可用年度" prop="synd" :min-width="120" align="center"/>
          <el-table-column label="申请发票数量" prop="fpzs" :min-width="120" align="right"/>
          <el-table-column label="已使用发票数量" prop="fpyysl" :min-width="120" align="right"/>
          <el-table-column label="剩余发票数量" prop="fpsysl" :min-width="120" align="right"/>
          <el-table-column label="发票起始号码" prop="fpqshm" :min-width="170" />
          <el-table-column label="发票终止号码" prop="fpzzhm" :min-width="170" />
          <el-table-column label="申请时间" prop="updateTime" :min-width="100" align="center"/>
        </template>
      </el-table>
    </div>
    <el-dialog
      v-if="detailVisible"
      :visible.sync="detailVisible"
      width="80%"
      :close="onClose"
      class="detail-dialog"
      destroy-on-close
    >
      <HistoricalDetails :detailInfo="detailInfo"/>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import { getCurrentMonth } from "@/utils/tool";
import { getCreditInfo, getListByUser, creditCredit, creditCode, updateCredit } from './Api'
import HistoricalDetails from './historicalDetails/Index.vue'
export default {
  name: 'CreditLimitHandle',
  components: {
    HistoricalDetails
  },
  data() {
    return {
      activeName: 'credit',
      form: {},
      // 额度数据列表
      quotaDataList: [
        {
          label: '本期授信总额度',
          propKey: 'bqzsxed',
          unit: '元',
        },
        {
          label: '本期已用授信额度',
          propKey: 'bqkysxed',
          unit: '元',
        },
        {
          label: '本期剩余授信额度',
          propKey: 'bqsysxed',
          unit: '元',
        },
        {
          label: '本年度可用发票数量',
          propKey: 'fpzs',
          unit: '张',
          isNum: true,
        },
        {
          label: '本年度已用发票数量',
          propKey: 'sysl',
          unit: '张',
          isNum: true,
        },
        {
          label: '本年度剩余发票数量',
          propKey: 'fpsysl',
          unit: '张',
          isNum: true,
        }
      ],
      tableData: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      taxBodyList: [],
      creditInfo: {},
      detailVisible: false,
      detailInfo: {},
      loading: true,
      tableLoading: true,
    };
  },
  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
    height() {
      return window.innerHeight - 406;
    },
  },
  watch: {
    activeName() {
      this.getList();
    }
  },
  mounted() {
    this.form.skssq = getCurrentMonth().dateValueLine
    this.getListByUser();
  },

  methods: {
    onClose(){
      this.detailVisible = false;
    },
    dateFormat(fmt, val) {
      return moment(val).format(fmt)
    },
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({})
      if (code === '0') {
        this.taxBodyList = data.map((item) => {
          return {
            ...item,
            value: item.nsrsbh,
            label: item.nsrmc + " " + item.nsrsbh
          }
        })
        this.form.nsrsbh = data[0]?.nsrsbh || '';
        this.getInfo();
      }
    },
    // 查询额度赋码票量信息
    async getCreditInfo() {
      this.loading = true;
      const { code = '', data = {} } = await getCreditInfo(this.form)
      if (code === '0') {
        this.creditInfo = data;
        this.quotaDataList.forEach(item => {
          const value = data[item?.propKey] || (data.invoiceCreditCodeVo || {})[item?.propKey];
          console.log(value,"3456")
          item.value = value != undefined ? item.isNum || value === 0 ? value + item.unit : this.formatMoney(value) + item.unit : ''
        });

      }
      this.loading = false;
    },
    // 历史授信额度信息 || 历史票量额度信息
    async getList() {
      this.tableLoading = true;
      const api = this.activeName == 'credit' ? creditCredit : creditCode;
      const { code = '', data = [] } = await api({
        pageNo: 1,
        pageSize: 10,
        ...this.form
      })
      if (code === '0') {
        this.tableData = data
      }
      this.tableLoading = false;
    },
    /**
     * @description 授信额度更新
     */
    updateCredit() {
      updateCredit({ nsrsbh: this.form.nsrsbh }).then(res=>{
        debugger
        console.log(res)
        if (res.code === '0') {
          this.$message.success('额度更新成功');
        }else {
          this.$message.console.error(res.msg);
        }
      })
      
    },
    // 获取数据
    getInfo() {
      this.getCreditInfo();
      this.getList()
    },
    changeActiveName(name) {
      this.activeName = name
    },
    toDetail() {
      this.detailVisible = true
      this.detailInfo = {
        activeName: this.activeName,
        ...this.form,
      }
      // this.$router.push({
      //   path: '/creditLimitManagement/historicalDetails',
      //   query: {
      //     activeName: this.activeName,
      //     ...this.form,
      //   }
      // })
      // this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);

    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
.main-content {
  font-size: 14px;
}

::v-deep .el-form-item {
  margin-bottom: 8px;
}

.right {
  color: #e6a23c;
}

.content-info {
  padding: 8px 0 16px;
  border-top: 1px solid $borderColor;
  color: #333333;

  .info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $blueColor;
  }

  .right {
    display: flex;
    align-items: center;
    line-height: 16px;

    span {
      width: 15px;
      height: 15px;
      display: inline-block;
      background: radial-gradient($blueColor 30%, #fafafa);
      margin-left: 12px;
      border-radius: 50%;
      margin: 0 8px 0 24px;
    }

    .abnormal {
      background: radial-gradient(red 30%, #fafafa);
    }
  }

  .info-main {
    display: flex;
    padding-bottom: 16px;
    padding: 0 24px;

    .item {
      flex: 1;
      padding: 8px 0 4px;
      font-size: 15px;
      vertical-align: middle;
      text-align: center;
    }

    .tit {
      padding: 12px 0 16px;
    }

    .txt {
      font-size: 15px;
    }
  }
}

.content-tools {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid $borderColor;
  border-top: 1px solid $borderColor;

  .tools-left {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 24px;
    color: red;
    opacity: 0.8;
    font-size: 13px;

    div {
      display: flex;
      align-items: center;
    }
  }

  .el-icon-warning {
    margin-right: 4px;
    color: #1B90FF;
    font-size: 20px;
  }
}

.content-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 4px;
  margin-bottom: 12px;
  border-bottom: 1px solid $borderColor;

  span {
    padding-left: 12px;
    cursor: pointer;

    &:first-child {
      padding-right: 12px;
      border-right: 2px solid $blueColor;
    }

    &.active {
      color: $blueColor;
      font-weight: bold;
    }
  }

  .right {
    cursor: pointer;
    font-size: 12px;
    color: $blueColor;
  }
}
.detail-dialog {
  display: flex;
  align-items: center;
  /deep/ .el-dialog {
    margin-top: auto !important;
    margin-bottom: auto !important;
  }
  /deep/ .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>
