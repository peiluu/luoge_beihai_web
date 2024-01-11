<template>
  <div class="com-quarter-dateDicker">
    <!-- <div class="quarter-left">
      <el-radio v-model="radioType" label="quarter">季度</el-radio>
      <el-radio v-model="radioType" label="month">月度</el-radio>
    </div> -->
    <template v-if="pickerType === '季'">
      <mark style="position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0);z-index:999;" v-show="showQuarter" @click.stop="showQuarter = false"></mark>
      <div class="quarter-input-box">
        <el-input :disabled="dateDisabled" placeholder="请选择" v-model="form.formatQuarterValue" style="width:100%;" class="elWidth" @focus="showQuarter = true">
          <i slot="prefix" class="el-input__icon el-icon-date"></i>
        </el-input>
        <i class="el-input__icon el-icon-circle-close" v-if="!dateDisabled" @click="clearDate"></i>
      </div>

      <el-card class="box-card" v-show="showQuarter" style="width:100%">
        <div slot="header" class="clearfix" style="text-align:center;padding:0">
          <button type="button" aria-label="前一年" :class="{ notallow: preDateDisabled || currentDateDisabled }" class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left" @click="prev"></button>
          <span role="button" class="el-date-picker__header-label">{{ year }}年</span>
          <button type="button" aria-label="后一年" @click="next" :class="{ notallow: nextDateDisabled }" class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"></button>
        </div>
        <div class="text item" style="text-align:center;">
          <el-button type="text" size="medium" :class="{ notallow: getDateDisabled(1) }" style="width:40%;color: #606266;float:left;" @click="selectQuarter(0)">第一季度</el-button>
          <el-button type="text" size="medium" :class="{ notallow: getDateDisabled(2) }" style="float:right;width:40%;color: #606266;" @click="selectQuarter(1)">第二季度</el-button>
        </div>
        <div class="text item" style="text-align:center;">
          <el-button type="text" size="medium" :class="{ notallow: getDateDisabled(3) }" style="width:40%;color: #606266;float:left;" @click="selectQuarter(2)">第三季度</el-button>
          <el-button type="text" size="medium" :class="{ notallow: getDateDisabled(4) }" style="float:right;width:40%;color: #606266;" @click="selectQuarter(3)">第四季度</el-button>
        </div>
      </el-card>
    </template>
    <template v-else>
      <el-date-picker :disabled="dateDisabled" :clearable="clearable" value-format="yyyyMM" v-model="form.monthValue" type="month" placeholder="请选择" @change="selectMonth" :picker-options="getPickerOptions()" />
    </template>
  </div>
</template>
<script>
import { getCurrentDate, getCurrentSsq, InitialTime } from "@/utils/tool";

export default {
  name: 'QuarterDatePicker',
  props: {
    valueArr: {
      default: () => {
        return ['01-03', '04-06', '07-09', '10-12'];
      },
      type: Array,
    },
    // 限制的时间
    limitTime: {
      type: String,
      default: "2023",
      require: true,
    },
    propsParam: {
      type: String,
      default: "",
    },
    pickerType: {
      type: String,
      default: "季",
    },
    // 是否需要初始化赋值
    isInitDefault: {
      type: Boolean,
      default: false,
    },
    // 默认值
    defaultValue: {
      type: String,
      default: "",
    },
    // 当期及后期数据不可选择
    currentDateDisabled: {
      type: Boolean,
      default: false,
    },
    // 下期数据不可选择
    nextDateDisabled: {
      type: Boolean,
      default: false,
    },
    // 上期数据不可选择
    preDateDisabled: {
      type: Boolean,
      default: false,
    },
    // 不可编辑
    dateDisabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      showQuarter: false,
      quarter: "",
      year: new Date().getFullYear(),
      form: {
        quarterValue: '',
        monthValue: '',
        formatQuarterValue: '',
      },

      // radioType: 'quarter',

      pickerOptions: {
        disabledDate(time) {
          let year = new Date().getFullYear()
          let month = new Date().getMonth() // 上月
          let days = new Date(year, month, 0).getDate() // 上月总天数
          return time.getTime() > Date.now() - 24 * 60 * 60 * 1000 * `${days}`
        }
      }
    };
  },
  computed: {
  },
  mounted() {
  },
  activated() {
    // this.intiForm();
  },
  watch: {
    defaultValue: {
      // 初始化查询表单
      handler(val) {
        if (val) {
          // 初始化年份
          const date = new Date(this.defaultValue.substring(0, 4)).getFullYear();
          this.$set(this, 'year', date)
          this.form = { ...this.form, ...getCurrentDate(this.defaultValue) }
          const formData = this.pickerType == '季' ? this.form.quarterValue : this.form.monthValue
          this.$emit("getQuarterPickerFrom", this.propsParam, formData);
        } else {
          this.form = {}
          this.$emit("getQuarterPickerFrom", this.propsParam, '');
        }
      },
      immediate: true,
    },
  },
  methods: {
    getPickerOptions() {
      return {}
      const that = this;
      // 当前属期以前无法选择
      if (that.preDateDisabled) {
        return {
          disabledDate(time) {
            let year = new Date().getFullYear()
            let month = new Date().getMonth() // 上月
            let days = new Date(year, month, 0).getDate() // 上月总天数
            return time.getTime() < Date.now() - 24 * 60 * 60 * 1000 * `${days}`
          }
        }
      }
      // 当前属期及以前都无法选择
      else if (that.currentDateDisabled) {
        return {
          disabledDate(time) {
            let year = new Date().getFullYear()
            let month = new Date().getMonth() // 上月
            let days = new Date(year, month, 0).getDate() // 上月总天数
            return time.getTime() < Date.now()
          }
        }

        // disabledDate(time) {
        //   let year = new Date().getFullYear()
        //   let month = new Date().getMonth() // 上月
        //   let days = new Date(year, month, 0).getDate()
        //   console.log(11, days)

        //   return (that.nextDateDisabled && time.getTime() > Date.now() - 24 * 60 * 60 * 1000 * `${days}`) || (that.preDateDisabled && time.getTime() < Date.now() - (24 * 60 * 60 * 1000 * `${days}` - 60))
        // }
      }
      // return {
      //   disabledDate(time) {
      //     let year = time.getFullYear()
      //     let month = time.getMonth() // 上月
      //     const ssq = parseFloat(getCurrentSsq().monthValue)
      //     const selectMonth = parseFloat(time.getFullYear() + '' + (time.getMonth()))
      //     console.log(ssq)
      //     // console.log("selectMonth", selectMonth)
      //     console.log("selectMonth", (time.getMonth()))
      //     console.log("selectMonth", (time.getMonth()))
      //     return (that.preDateDisabled && ssq < selectMonth) || (that.preDateDisabled && ssq > selectMonth)
      //   }
      // }

      // if (this.nextDateDisabled) {
      //   return {
      //     disabledDate(time) {
      //       let year = new Date().getFullYear()
      //       let month = new Date().getMonth() // 上月
      //       let days = new Date(year, month, 0).getDate() // 上月总天数
      //       return time.getTime() > Date.now() - 24 * 60 * 60 * 1000 * `${days}`
      //     }
      //   }
      // }

    },
    one() {
      this.showQuarter = false;
    },
    prev() {
      // if (this.preDateDisabled || this.currentDateDisabled) return;
      this.year = this.year * 1 - 1;
    },
    next() {
      // 如果有时间限制的话会进行判断
      // if (this.nextDateDisabled) return;
      this.year = this.year * 1 + 1;
    },
    // 季度不可选择
    getDateDisabled(i) {
      // const ssq = parseFloat(getCurrentSsq().formatQuarterValue)
      // const selectQuarter = parseFloat(`${this.year}${InitialTime(i)}`)
      // if (this.preDateDisabled) return selectQuarter < ssq
      // if (this.nextDateDisabled) return selectQuarter > ssq
      // if (this.currentDateDisabled) return selectQuarter <= ssq
    },
    selectQuarter(i) {
      if (this.getDateDisabled(i + 1)) return;
      let that = this;
      that.quarter = i + 1;
      let arr = that.valueArr[i].split("-");
      that.showQuarter = false;
      this.form.formatQuarterValue = `${this.year}年${this.quarter}季度`;
      this.form.quarterValue = `${this.year}${InitialTime(this.quarter)}`;
      this.$emit("getQuarterPickerFrom", this.propsParam, this.form.quarterValue);
    },
    selectMonth(value) {
      this.$emit("getQuarterPickerFrom", this.propsParam, value);
    },
    intiForm() {
      // this.$set(this.form, { ...this.form, ...getCurrentSsq() });
      this.form = { ...this.form, ...getCurrentSsq() }
      const formData = this.pickerType == '季' ? this.form.quarterValue : this.form.monthValue
      this.$emit("getQuarterPickerFrom", this.propsParam, formData);
    },
    clearDate() {
      this.form = {}
      this.$emit("getQuarterPickerFrom", this.propsParam, '');
    },
    reset() {
      // if (this.isInitDefault) {
      //   this.intiForm();
      //   return;
      // }
      // this.$refs.searchForm.resetFields();
      this.form = {}
      this.$emit("getQuarterPickerFrom", this.propsParam, '');
    },
  },
};
</script>
<style lang="scss" scoped>
.notallow {
  // cursor: not-allowed;
}

.time_box {
  position: relative;
}

.box-card {
  position: absolute;
  top: 40px;
  /* left: 22px; */
  padding: 0 3px 20px;
  z-index: 9999;
}

.com-quarter-dateDicker {
  display: flex;
  align-items: center;
  /*  width: 100%; */
}

.quarter-left {
  display: flex;
  align-items: center;
  flex-basis: 20%;
  margin-right: 8px;

  .el-radio {
    margin-right: 8px;

  }
}

.quarter-input-box {
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;

  .el-icon-circle-close {
    position: absolute;
    cursor: pointer;
    right: 4px;
    top: -5px;
    color: #C0C4CC;
  }
}

.time_quarter .el-input--small .el-input__inner {
  width: 82%;
}
</style>
