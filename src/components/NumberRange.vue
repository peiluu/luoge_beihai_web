<template>
  <div class="input-number-range" :class="{ 'is-disabled': disabled }">
    <div class="flex">
      <el-input ref="inputFromRef" clearable v-model="startValue" :disabled="disabled" :placeholder="startPlaceholder" @blur="handleBlurFrom" @focus="handleFocusFrom" @input="handleInputFrom"
        @change="handleInputChangeFrom" v-bind="$attrs" v-on="$listeners">
        <template v-for="(value, name) in startSlots" #[name]="slotData">
          <slot :name="name" v-bind="slotData || {}"></slot>
        </template>
      </el-input>
      <div class="center">
        <span>-</span>
      </div>
      <el-input ref="inputToRef" clearable v-model="endValue" :disabled="disabled" :placeholder="endPlaceholder" @blur="handleBlurTo" @focus="handleFocusTo" @input="handleInputTo" @change="handleInputChangeTo"
        v-bind="$attrs" v-on="$listeners">
        <template v-for="(value, name) in endSlots" #[name]="slotData">
          <slot :name="name" v-bind="slotData || {}"></slot>
        </template>
      </el-input>
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
    handleInputFrom(value) {
      this.$emit("update:startValue", value);
    },
    handleInputTo(value) {
      this.$emit("update:endValue", value);
    },
    // from输入框change事件
    handleInputChangeFrom(value) {
      // 如果是非数字空返回null
      if (value == "" || isNaN(value)) {
        this.$emit("update:startValue", null);
        return;
      }
      // 初始化数字精度
      const newStartValue = this.setPrecisionValue(value);
      // 如果from > to 将from值替换成to
      if (
        typeof newStartValue === "number" &&
        parseFloat(newStartValue) > parseFloat(this.endValue)
      ) {
        this.startValue = this.endValue;
      } else {
        this.startValue = newStartValue;
      }
      if (this.startValue !== value) {
        this.$emit("update:startValue", this.startValue);
      }
    },
    // to输入框change事件
    handleInputChangeTo(value) {
      // 如果是非数字空返回null
      if (value == "" || isNaN(value)) {
        this.$emit("update:endValue", null);
        return;
      }
      // 初始化数字精度
      const newEndValue = this.setPrecisionValue(value);
      // 如果from > to 将from值替换成to
      if (
        typeof newEndValue === "number" &&
        parseFloat(newEndValue) < parseFloat(this.startValue)
      ) {
        this.endValue = this.startValue;
      } else {
        this.endValue = newEndValue;
      }
      if (this.endValue !== value) {
        this.$emit("update:endValue", this.endValue);
      }
    },
    handleBlurFrom(event) {
      this.$emit("blurNumberFrom", this.propsParam, 0, this.startValue);
    },

    handleFocusFrom(event) {
      this.$emit("focus-from", event);
    },
    handleBlurTo(event) {
      this.$emit("blurNumberFrom", this.propsParam, 1, this.endValue);
    },
    handleFocusTo(event) {
      this.$emit("focus-to", event);
    },
    // 根据精度保留数字
    toPrecision(num, precision) {
      if (precision === undefined) precision = 0;
      return parseFloat(
        Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)
      );
    },
    // 设置精度
    setPrecisionValue(value) {
      if (this.precision === undefined) return value;
      return this.toPrecision(parseFloat(value), this.precision);
    },
  },
};
</script>
<style lang="scss" scoped>
// 取消element原有的input框样式
::v-deep .el-input__inner {
  border: 0px;
  margin: 0;
  padding: 0 15px;
  background-color: transparent;
}

.input-number-range {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.flex {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  justify-content: center;
  align-items: center;

  .center {
    margin-top: 1px;
  }
}

.is-disabled {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
