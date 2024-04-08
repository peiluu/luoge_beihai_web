<template>
  <div class="com-number-range" :class="{ 'is-disabled': disabled }">
    <div class="range-content">
      <el-input ref="inputFromRef" type="number" v-model="startValue" :disabled="disabled" :placeholder="startPlaceholder" @blur="handleBlur" @change="handleInputChangeFrom" />

      <div class="content-center">
        <span>-</span>
      </div>
      <el-input ref="inputToRef" type="number" v-model="endValue" :disabled="disabled" :placeholder="endPlaceholder" @blur="handleBlur" @change="handleInputChangeTo" />
    </div>
  </div>
</template>
<script>
export default {
  name: "InputNumberRange",
  props: {
    // inputs: {
    //   type: Array,
    //   required: true,
    //   default: () => [null, null],
    // },
    // startValue: {
    //   type: Number || String,
    //   default: 0,
    // },
    // endValue: {
    //   typeof: Number || String,
    //   default: 0,
    // },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    startPlaceholder: {
      type: String,
      default: "最小值",
    },
    endPlaceholder: {
      type: String,
      default: "最大值",
    },
    // 精度参数
    precision: {
      type: Number,
      default: 0,
      validator(val) {
        return val >= 0 && val === parseInt(val, 10);
      },
    },
    propsParam: {},
  },
  data() {
    return {
      startValue: '',
      endValue: '',
    };
  },
  computed: {
    startSlots() {
      const slots = {};
      Object.keys(this.$slots).forEach((name) => {
        if (name.startsWith("start-")) {
          const newKey = name.replace(/^start-/, "");
          slots[newKey] = this.$slots[name];
        }
      });
      return slots;
    },
    endSlots() {
      const slots = {};
      Object.keys(this.$slots).forEach((name) => {
        if (name.startsWith("end-")) {
          const newKey = name.replace(/^end-/, "");
          slots[newKey] = this.$slots[name];
        }
      });
      return slots;
    },
  },
  watch: {},
  methods: {
    reset() {
      this.startValue = ''
      this.endValue = ''
    },
    // from输入框change事件
    handleInputChangeFrom(value) {
      // 如果是非数字空返回null
      if (value == "" || isNaN(value)) {
        return;
      }
      // 初始化数字精度
      const newStartValue = parseFloat(value).toFixed(2)
      // 如果from > to 将from值替换成to
      if (this.endValue && newStartValue > this.endValue) {
        this.startValue = this.endValue;
      } else {
        this.startValue = newStartValue;
      }
    },
    // to输入框change事件
    handleInputChangeTo(value) {
      // 如果是非数字空返回null
      if (value == "" || isNaN(value)) {
        return;
      }
      const newEndValue = parseFloat(value).toFixed(2)
      // 如果from > to 将from值替换成to
      if (this.startValue && newEndValue < this.startValue) {
        this.endValue = this.startValue;
      } else {
        this.endValue = newEndValue;
      }
    },
    handleBlur() {
      // this.fillData();
      this.$nextTick(() => {
        this.$emit("getNumberRangeForm", this.propsParam, [this.startValue, this.endValue]);
      })
    },
    fillData() {
      // 如果一方有数据，另一方没有，填平
      if (!this.endValue && this.startValue) {
        this.endValue = this.startValue
      }
      if (!this.startValue && this.endValue) {
        this.startValue = this.endValue
      }
    },
  },
};
</script>
<style lang="scss" scoped>
// 取消element原有的input框样式
/deep/ .el-input__inner {
  border: 0px;
  margin: 0;
  padding: 0 15px;
  background-color: transparent;
}

.com-number-range {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.range-content {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  justify-content: center;
  align-items: center;

  .content-center {
    margin-top: 1px;
  }
}

.is-disabled {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}

//去除input的type为number时的上下箭头

/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

/deep/input[type="number"] {
  -moz-appearance: textfield;
}
</style>
