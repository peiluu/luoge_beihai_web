<template>
  <form-option>
    <div v-if="backpath" class="back-button" style="right: 30px;padding-top: 5px;">
      <el-button type="success" icon="el-icon-back" @click="handleBack">返回</el-button>
    </div>
    <div class="search-box" v-if="showSearch">
      <el-form :key="searchKey" @submit.native.prevent v-if="form && searchList" class="search_area" ref="searchForm" :model="form" :inline="true">
        <template v-for="each in searchList">
          <el-form-item :key="each.key" v-show="each.show && !each.hidden" :label="each.label" :prop="each.key">
            <!-- input 输入 -->
            <template v-if="each.type == 'input'">
              <el-input @keyup.enter.native="handleSubmit" v-model="form[each.key]" :placeholder="each.placeholder" clearable style="width:170px;"></el-input>
            </template>
            <!-- inputNumber 输入 -->
            <template v-if="each.type == 'inputNumber'">
              <el-input-number v-model="form[each.key]" :placeholder="each.placeholder" style="width:170px;"></el-input-number>
            </template>
            <!-- select 下拉 -->
            <template v-if="each.type == 'select'">
              <el-select @change="selectChange($event, each)" :multiple="each.multiple" v-model="form[each.key]" :clearable="each.noClearable != 'Y'" filterable :disabled="each.disabled" :placeholder="each.placeholder"
                style="width:140px;">
                <el-option v-for="item in each.options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
            <!-- mul-select 下拉多选 -->
            <template v-if="each.type == 'mul-select-el'">
              <el-select @change="mulSelectChange($event, each)" multiple filterable clearable v-model="form[each.key]" :placeholder="each.placeholder" style="width:300px;">
                <div style="padding: 5px 20px;"><el-checkbox @change="toggleSelectAll($event, each)">全选</el-checkbox></div>
                <el-option v-for="item in each.options" :key="item.value" :label="item.label" :value="item.value">
                  <span style="float: left"><el-checkbox @change="toggleSelect($event, each, item)" v-model="item.checked">{{ item.label }}</el-checkbox></span>
                </el-option>
              </el-select>
            </template>
            <template v-if="each.type == 'mul-select'">
              <vxe-select filterable size="mini" v-model="form[each.key]" placeholder="请选择" :options="each.options" multiple clearable transfer :filter-method="mutFilterValue">
                <template #checkAll="{ option }">
                  <el-checkbox @change="toggleSelectAll($event, each)">全选</el-checkbox>
                </template>
                <template #checkbox="{ option }">
                  <span style="color: green">
                    <el-checkbox @change="toggleSelect($event, each, option)" v-model="option.checked">{{ option.label }}</el-checkbox>
                  </span>
                </template>
              </vxe-select>
            </template>
            <!-- autocomplete 带输入建议 -->
            <template v-if="each.type == 'autocomplete'">
              <el-autocomplete style="width:170px;" class="inline-input" v-model="form[each.key]" :fetch-suggestions="each.fetchSuggestions" :placeholder="each.placeholder" @change="handleSubmit" @select="handleSubmit">
              </el-autocomplete>
            </template>
            <!-- monthrange 日期范围选择器 -->
            <template v-if="each.type == 'monthrange' || each.type == 'daterange'">
              <el-date-picker v-model="form[each.key]" :type="each.type" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                :value-format="each.valueFormat ? each.valueFormat : (each.type == 'monthrange' ? 'yyyy-MM' : 'yyyy-MM-dd')" :picker-options="each.pickerOptions">
              </el-date-picker>
            </template>
            <!-- month 日期选择器 -->
            <template v-if="each.type == 'month' || each.type == 'date' || each.type == 'year'">
              <el-date-picker v-model="form[each.key]" :type="each.type" :value-format="each.format || each.type == 'year' ? 'yyyy' : each.type == 'month' ? 'yyyy-MM' : 'yyyy-MM-dd'" :placeholder="each.placeholder"
                :picker-options="each.pickerOptions">
              </el-date-picker>
            </template>
            <!-- text 纯文本展示 -->
            <template v-if="each.type == 'text'"><span>{{ each.val }}</span></template>

            <!-- 数字范围 -->
            <template v-if="each.type == 'numberRange'">
              <NumberRange :propsParam="each.key" @getNumberRangeForm="getNumberRangeForm" :startPlaceholder="each.placeholder[0] || ''" :endPlaceholder="each.placeholder[1] || ''" ref="numberRange" />
            </template>
            <!-- 地区选择器 -->
            <template v-if="each.type == 'areaCascader'">
              <el-cascader v-model="form[each.key]" :options="each.options" :props="each.props" :show-all-levels="each.showAllLevels" :separator="each.separator" filterable />
            </template>
            <!-- 季度/月度选择器 -->
            <template v-if="each.type == 'quarterPicker'">
              <QuarterDatePicker :pickerType="each.pickerType" :defaultValue="each.val" :propsParam="each.key" :isInitDefault="each.isInitDefault" :preDateDisabled="each.preDateDisabled"
                :nextDateDisabled="each.nextDateDisabled" @getQuarterPickerFrom="getQuarterPickerFrom" ref="quarterDatePicker" />
            </template>
          </el-form-item>
        </template>
      </el-form>

      <div class="search-btns" v-if="showSearchBtn">
        <el-button type="success" @click="handleSubmit">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button v-if="exportLabel" type="primary" @click="handleExport">{{ exportLabel }}</el-button>
        <span style="margin: 0 10px;" v-if="switchLabel">{{ switchLabel }}:</span><el-switch v-if="switchLabel" class="switch" v-model="checkLockM" @change="handleSwitch" active-text="是" inactive-text="否"></el-switch>
        <el-button v-show="showMore && !notSearchContract && searchList.length > 3" :class="moreStatus == 'down' ? 'more' : 'more-down'" icon="el-icon-d-arrow-right" circle @click="handleMore"></el-button>
      </div>
    </div>
  </form-option>
</template>

<script>
import FormOption from './FormOption.vue';
import NumberRange from './NumberRange.vue'
import QuarterDatePicker from './QuarterDatePicker'

export default {
  components: { FormOption, NumberRange, QuarterDatePicker },
  name: "FormSearch",
  props: {
    checkLockM: {
      Boolean,
      default: false
    },
    switchLabel: {
      String,
      default: ""
    },
    exportLabel: {
      String,
      default: ""
    },
    resetSearch: {
      Number,
      default: null,
    },
    searchList: {
      type: Array,
      default: () => [],
    },
    autocompleteList: {
      type: Array,
      default: () => [],
    },
    formSearchParam: {
      type: Object,
      default: () => ({}),
    },
    param: {
      type: Object,
      default: () => ({}),
    },
    backpath: {
      type: String,
      default: "",
    },
    // 显示收缩按钮
    notSearchContract: {
      type: Boolean,
      default: false,
    },
    // 显示搜索栏
    showSearch: {
      type: Boolean,
      default: true,
    },
    // 显示搜索栏按钮
    showSearchBtn: {
      type: Boolean,
      default: true,
    },
    searchKey: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      labelCol: 8,
      wrapperCol: 16,
      form: {},
      showMore: true, //是否显示更多
      moreStatus: "down", //up /down
      opts3: [
        { label: '1111', value: '1' },
        { label: '2222', value: '2' },
        { label: '3333', value: '3', slots: { default: 'opt3' } },
        { label: '4444', value: '4', slots: { default: 'opt4' } },
        { label: '5555', value: '5' },
        { label: '6666', value: '6' }
      ],
      selectFilterValue: ''
    };
  },
  mounted() {
    this.handleBuildForm();
    if (this.searchList.length > 3 && !this.notSearchContract) {
      this.showMore = true;
      this.searchList.map((item, index) => {
        if (index > 2) {
          item.show = false;
        }
      });
    }
    this.$nextTick(() => {
      this.handleReBuildSearchParam();
    });
  },
  watch: {
    resetSearch(val) {
      if (val == 1) {
        this.resetForm();
      }
    },
    searchList: {
      handler() {
        this.searchList.forEach((each, index) => {
          each.show = index > 2 ? false : true
          this.$set(this.form, each.key, each.val)
        });
        this.$nextTick(() => {
          this.handleReBuildSearchParam();
        });
      },
      deep: true
    },
  },
  methods: {
    handleSwitch(e) {
      this.$emit("handleSwitch", e);
    },
    handleExport() {
      this.$emit("handleExport");
    },
    handleSubmit() {
      this.$emit("search", JSON.parse(JSON.stringify(this.form)));
    },
    resetForm() {
      this.$refs.searchForm.resetFields();
      this.form = {}
      // 清空对象的所有属性值
      Object.keys(this.form).forEach(key => { this.form[key] = '' })
      // 清空
      if (this.$refs.numberRange) {
        for (let item of Object.values(this.$refs.numberRange)) {
          item.reset();
        }
        // } Array.from(this.$refs.numberRang).forEach((item) => {
        //   item.reset();
        // })
      }
      // 清空季度选择器
      if (this.$refs.quarterDatePicker) {
        this.$refs.quarterDatePicker[0].reset();
      }
      // 重置级联列表初始值
      this.$emit('getNextList', '', 'reset')
      this.$emit("reset");

    },
    handleBuildForm() {
      let form = {};
      this.searchList.forEach((each, index) => {
        each.show = true;
        form[each.key] = each.val;
        this.$set(this.form, each.key, each.val)
      });
      this.form = form;
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
    handleBack() {
      this.$router.push({ path: this.backpath });
    },
    contains(arr, arg) {
      if (!arr) return false;
      var len = arr.length;
      for (var i = 0; i < len; i++) {
        var item = JSON.parse(JSON.stringify(arr[i]))
        if (item == arg) {
          return true;
        }
      }
      return false;
    },
    // 是否需要联级查询
    selectChange(value, each) {

      // 查询下级前，先清空下级
      if (each.isQueryNext) {
        const row = each.options.find((item) => item[each.key] === value)
        this.$emit('getNextList', value)
        this.$emit('getNextListRow', row)
        if (each.nextPropskey) {
          this.form[each.nextPropskey] = ''
        }
      }
    },
    mutFilterValue({ searchValue, option, group }) {
      this.selectFilterValue = searchValue
      if (option.label.toUpperCase().indexOf(searchValue.toUpperCase()) > -1 || option.slots.default == 'checkAll') {
        return true
      } else {
        return false
      }
    },
    mulSelectChange(arr, each) {
      for (var j = 0; j < each.options.length; j++) {
        if (this.contains(arr, each.options[j].value)) {
          each.options[j].checked = true;
        } else {
          each.options[j].checked = false;
        }
      }
    },
    toggleSelectAll(value, each) {
      if (!value) {
        this.form[each.key] = [];
        for (var i = 0; i < each.options.length; i++) {
          each.options[i].checked = false;
        }
      } else {
        this.form[each.key] = each.options.filter((item => item?.slots?.default != 'checkAll' && item.label.toUpperCase().indexOf(this.selectFilterValue.toUpperCase()) > -1)).map((item) => item.value)
        for (var j = 0; j < each.options.length; j++) {
          // 输入检索条件时，全选只选筛选后的
          if (this.selectFilterValue != '') {
            if (each.options[j].label.toUpperCase().indexOf(this.selectFilterValue.toUpperCase()) > -1) {
              each.options[j].checked = true;
            }
          } else {
            each.options[j].checked = true;
          }
        }
        this.form[each.key] = each.options.filter((item => item?.slots?.default != 'checkAll' && item.label.toUpperCase().indexOf(this.selectFilterValue.toUpperCase()) > - 1)).map((item) => item.value)
      }
    },
    handleReBuildSearchParam() {
      // const param = { ...this.param, ...this.formSearchParam }
      const param = { ...this.param }
      Object.keys(param || {}).map(key => {
        if (param[key] != null) {
          if (param[key].length > 0) {
            this.form[key] = param[key];
          }
        }
      });
    },
    toggleSelect(value, each, item) {
      item.checked = value
      if (item.checked) {
        this.form[each.key].push(item.value);
      } else {
        var index = this.form[each.key].indexOf(item.value);
        if (index >= 0) {
          this.form[each.key].splice(index, 1)
        }
      }
    },

    // 接收数字范围组件的参数
    getNumberRangeForm(propsParam, data) {
      this.form[propsParam] = data
    },
    getQuarterPickerFrom(propsParam, data) {
      this.form[propsParam] = data
      this.$set(this.form, propsParam, data)
    },
  },
};

Array.prototype.indexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};
</script>
<style scoped lang="scss">
@import '@/styles/switch.scss';

.search-box {
  display: flex;
  justify-content: space-between
}

.el-form {
  flex-basis: calc(100% - 170px);
}

.search-btns {
  margin-bottom: 4px;
  // width: 170px;
}

/deep/ .el-form-item {
  width: calc(33.3% - 10px);
  margin-bottom: 4px !important;

  .el-form-item__label {
    width: 120px;
    font-size: 12px;
  }

  .el-form-item__content {
    width: calc(100% - 120px);
    font-size: 12px;

    .el-select,
    .el-date-editor,
    .el-cascader,
    .vxe-select,
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
</style>

