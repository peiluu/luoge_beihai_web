<template>
  <div class="com-ledger-form">
    <form-option>
      <div class="search-box">
        <el-form @submit.native.prevent v-if="searchList" class="search_area" ref="searchForm" :model="form" :inline="true">
          <template v-for="each in searchList">
            <el-form-item v-show="each.show && !each.hidden" :key="each.key" :label="each.label" :prop="each.key">
              <!-- input 输入 -->
              <template v-if="each.type == 'input'">
                <el-input @keyup.enter.native="handleSubmit" v-model="form[each.key]" :placeholder="each.placeholder" clearable style="width:170px;" />
              </template>
              <!-- inputNumber 输入 -->
              <template v-if="each.type == 'inputNumber'">
                <el-input-number v-model="form[each.key]" :placeholder="each.placeholder" style="width:170px;"></el-input-number>
              </template>
              <!-- select 下拉 -->
              <template v-if="each.type == 'select'">
                <el-select :multiple="each.multiple" filterable clearable v-model="form[each.key]" :disabled="each.disabled" :placeholder="each.placeholder" @change="(val) => onSelectChange(each.key, val)"
                  style="width:140px;">
                  <el-option v-for="item in each.options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </template>

              <!-- monthrange 日期范围选择器 -->
              <template v-if="each.type == 'monthrange' || each.type == 'daterange'">
                <el-date-picker v-model="form[each.key]" :type="each.type" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                  :value-format="each.type == 'monthrange' ? 'yyyy-MM' : 'yyyy-MM-dd'" :picker-options="each.pickerOptions">
                </el-date-picker>
              </template>
              <!-- month 日期选择器 -->
              <template v-if="['year', 'month', 'date'].includes(each.type)">
                <el-date-picker v-model="form[each.key]" :type="each.type" :value-format="each.type == 'month' ? 'yyyyMM' : 'yyyy-MM-dd'" :placeholder="each.placeholder" :picker-options="each.pickerOptions">
                </el-date-picker>
              </template>
              <!-- 季度/月度选择器 -->
              <template v-if="each.type == 'quarterPicker'">
                <QuarterDatePicker  :key="searchKey" :pickerType="each.pickerType" :defaultValue="each.val" :preDateDisabled="each.preDateDisabled" :nextDateDisabled="each.nextDateDisabled" :propsParam="each.key"
                  :isInitDefault="each.isInitDefault" @getQuarterPickerFrom="getQuarterPickerFrom" ref="quarterDatePicker" />
              </template>
            </el-form-item>
          </template>
        </el-form>
        <div class="search-btns">
          <el-button type="success" @click="handleSubmit">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button v-show="showMore && searchList.length > 3" :class="moreStatus == 'down' ? 'more' : 'more-down'" icon="el-icon-d-arrow-right" circle @click="handleMore"></el-button>
        </div>
      </div>
    </form-option>
    <div class="tool-box">
      <div class="top-tool">
        <slot name="topToolLeft"></slot>
      </div>
      <div class="top-tool">
        <slot name="topTool"></slot>
      </div>
    </div>
    <div class="custom-vxe-table">
      <slot name="customeTable">
      </slot>
    </div>
    <div class="custom-vxe-pagination">
      <slot name="customeTablePagination"></slot>
    </div>
    <div class="custom-vxe-table-empty">
      <slot name="customeTableEmpty">
      </slot>
    </div>
  </div>
</template>

<script>
import { getCurrentSsq } from "@/utils/tool";
import { getListByUser, getOrgList } from './Api';
import FormOption from '../FormOption';
import QuarterDatePicker from '../QuarterDatePicker'


export default {
  name: "LedgerForm",
  components: { FormOption, QuarterDatePicker },
  props: {
    // 显示更多
    showMore: {
      Boolean,
      default: false
    },
    // 显示收缩按钮
    notSearchContract: {
      type: Boolean,
      default: false,
    },
    // 不显示会计主体
    hideOrgid: {
      type: Boolean,
      default: false,
    },
    // 是否支持查询全部
    queryAll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchList: [
        {
          label: "纳税主体名称",
          key: "nsrsbh",
          val: '',
          type: "select",
          placeholder: '请选择',
          options: [],
        },
        {
          label: "会计主体名称",
          key: "orgid",
          val: '',
          type: "select",
          placeholder: '请选择',
          options: [],
        },
        {
          label: "税款所属期",
          type: "quarterPicker",
          isInitDefault: true,
          nextDateDisabled: false,
          key: 'srssq',
          placeholder: '请选择',
          pickerType: '月',
          format: 'yyyyMM',

          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }
        },
        {
          label: "项目名称",
          key: "xmmc",
          val: '',
          type: "input",
          placeholder: '请输入',

        },
        {
          label: "计税方式",
          key: "jsff",
          val: '',
          type: "select",
          placeholder: '请选择',
          options: [{ value: '', label: '全部' }, { value: '0', label: '一般计税' }, { value: '1', label: '简易计税' }],
        },
      ],
      form: {},
      moreStatus: "down", //up /down
      firstLoading: true,
      taxBodyList: [],
      searchKey: '',
    };
  },
  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
  },
  watch: {

  },
  activated() {
    // 携带参数进入
    if (this.$route.query.nsrsbh) {
      this.initQueryParam()
    }
  },
  mounted() {
    this.getListByUser()
    this.handleBuildForm();

    if (this.searchList.length > 3 && !this.notSearchContract) {
      this.searchList.map((item, index) => {
        if (index > 2) {
          item.show = false;
        }
      });
    }
  },
  methods: {
    // 获取纳税主体
    async getListByUser() {
      const { code = '', data = [] } = await getListByUser({ sffk: 'N' })
      if (code === '0') {
        this.taxBodyList = data
        const list = data.map((item) => {
          return {
            ...item,
            value: item.nsrsbh,
            label: item.nsrmc + ' ' + item.nsrsbh
          }
        })
        const { nsrsbh = '' } = data[0] || {}
        this.searchList[0].options = this.queryAll ? [{ value: 'all', label: '全部' }].concat(list) : list
        // 进入页面初始化数据
        if (!this.$route.query.nsrsbh) {
          this.initDate(nsrsbh)
        }
      }
    },
    // 获取会计主体（受票点）
    async getOrgList(val) {
      // 清空表单数据
      this.form.orgid = ''
      const nsrsbh = val === 'all' ? '' : val
      const { code = '', data = [] } = await getOrgList({ nsrsbh, isInvoice: 'N' })
      const index = this.searchList.findIndex((item) => item.key === 'orgid');
      if (code === '0') {
        this.searchList[index].options = [{ value: '', label: '全部' }].concat(data.map((item) => {
          return {
            ...item,
            value: item.id,
            label: item.name + ' ' + item.code
          }
        }))
        // 第一次进入页面加载数据
        if (this.firstLoading) {
          this.firstLoading = false
          this.handleSubmit()
        }
      }
    },

    // 初始化属期时间
    initDate(nsrsbh) {
      const skssqIndex = this.searchList.findIndex((item) => item.key === 'srssq');
      const { zzstbzq = '', nsrlx = '' } = this.taxBodyList.find((item) => item.nsrsbh == nsrsbh) || {}
      // 增值税默认按月
      const { monthValue, quarterValue } = getCurrentSsq();
      this.form.nsrsbh = nsrsbh
      const value = zzstbzq == '月' ? monthValue : quarterValue
      this.form.srssq = nsrsbh ? value : '';
      this.form.tbzq = nsrsbh ? zzstbzq : '';
      this.form.nsrlx = nsrlx
      this.zzstbzq = zzstbzq;
      this.searchList[skssqIndex].pickerType = zzstbzq || '月'
      this.searchList[skssqIndex].val = nsrsbh ? value : '';
      this.searchKey = `${nsrsbh}_${zzstbzq}_${value}`

      this.getOrgList(nsrsbh)
    },
    // 初始化纳税申报查询进入所携带的参数
    initQueryParam() {
      const { nsrsbh, nsrlx, ssq, tbzq } = this.$route.query
      const skssqIndex = this.searchList.findIndex((item) => item.key === 'srssq');
      this.form = { ... this.$route.query, srssq: ssq }
      this.searchList[skssqIndex].pickerType = tbzq
      this.searchList[skssqIndex].val = ssq
      this.zzstbzq = tbzq;
      this.getOrgList(nsrsbh);
    },
    // 切换纳税主体
    onSelectChange(key, val) {
      if (key !== 'nsrsbh') return;
      this.getOrgList(val)
      // 查询全部时不需要初始化属期
      if (val !== 'all') {
        this.initDate(val)
      }
    },
    handleSubmit() {
      this.$emit("search", JSON.parse(JSON.stringify(this.form)));
    },
    resetForm() {
      this.$refs.searchForm.resetFields();
      // 重置子组件
      if (this.$refs.quarterDatePicker) {
        this.$refs.quarterDatePicker[0].reset();
      }
      this.form = { nsrsbh: '', orgid: '' }
      this.$emit("search", { pageNo: 1, pageSize: 10 });
    },
    handleBuildForm() {
      let form = {};
      this.searchList.forEach((each, index) => {
        each.show = true;
        form[each.key] = each.val;
        if (this.hideOrgid && each.key === 'orgid') {
          each.show = false
        }
      });
      this.form = form;
    },
    getQuarterPickerFrom(propsParam, data) {
      this.form[propsParam] = data
    },

    handleMore() {
      let moreStatus = this.moreStatus;
      if (moreStatus == "up") {
        moreStatus = "down";
        this.searchList.map((item, index) => {
          if (index > 2) {
            item.show = false;
          }
        });
      } else {
        moreStatus = "up";
        this.searchList.map(item => {
          item.show = true;
        });
      }
      this.moreStatus = moreStatus;
    },
  },
};

</script>
<style scoped lang="scss">
@import '../../styles/switch.scss';
@import '../../styles/variables.scss';

.search-box {
  padding-top: 12px;
  display: flex;
  justify-content: space-between
}

.el-form {
  flex-basis: calc(100% - 170px);
}

.search-btns {
  margin-bottom: 4px;
}

/deep/ .el-form-item {
  width: calc(33.3% - 10px);
  margin-bottom: 4px !important;

  .el-form-item__label {
    width: 120px;
    font-size: 12px;
    color: $mainTextColor;
  }

  .el-form-item__content {
    width: calc(100% - 120px);

    .el-select,
    .el-date-editor,
    .el-cascader,
    .el-input {
      width: 100% !important;
    }
  }
}

.more {
  transform: rotate(90deg);
}

.more-down {
  transform: rotate(-90deg);
  transition-duration: 300ms;
}

::v-deep .el-select__tags {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-wrap: nowrap;
}

.tool-box {
  display: flex;
  justify-content: space-between;
}

.top-tool {
  display: flex;
  justify-content: flex-end;
  margin: 8px 0;
}

.custom-vxe-table-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  // padding-top: 120px;
}
</style>

