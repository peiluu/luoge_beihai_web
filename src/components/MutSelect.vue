<template>
  <div class="com-mut-select">
    <vxe-select @change="mulSelectChange($event)" filterable size="small" v-model="form[propsParam]" placeholder="请选择" :options="[...options]" multiple clearable transfer :filter-method="mutFilterValue">
      <template #checkAll="{ option }">
        <el-checkbox @change="toggleSelectAll($event)">全选</el-checkbox>
      </template>
      <template #checkbox="{ option }">
        <span style="color: green">
          <el-checkbox @change="toggleSelect($event, option)" v-model="option.checked">{{ option.label }}</el-checkbox>
        </span>
      </template>
    </vxe-select>
  </div>
</template>
<script>

export default {
  name: 'MutSelect',
  props: {
    selectList: {
      default: () => [],
      type: Array,
    },
    propsParam: {
      type: String,
      default: "",
    },
    defaultValue: {
      default: () => [],
      type: Array,
    },

    sise: {
      type: String,
      // default: "mini",
    },
  },
  data() {
    return {
      options: [],
      selectFilterValue: '',
      form: {
        hbbbbmList: []
      },
      list: []
    };
  },
  created() {
    this.options = JSON.parse(JSON.stringify(this.selectList))
    this.form[this.propsParam] = [...this.defaultValue]
    this.intiForm();
  },

  watch: {
    defaultValue(val) {
      this.form[this.propsParam] = [...val]
      this.intiForm();
    },
  },
  methods: {
    mutFilterValue({ searchValue, option, group }) {
      this.selectFilterValue = searchValue
      if (option.label.toUpperCase().indexOf(searchValue.toUpperCase()) > -1 || option.slots.default == 'checkAll') {
        return true
      } else {
        return false
      }
    },
    mulSelectChange(arr, each) {
      // for (var j = 0; j < this.options.length; j++) {
      //   if (this.contains(arr, this.options[j].value)) {
      //     this.options[j].checked = true;
      //   } else {
      //     this.options[j].checked = false;
      //   }
      // }
      this.$emit("getMutSelectForm", this.form[this.propsParam]);

    },
    toggleSelectAll(value, each) {
      if (!value) {
        this.form[this.propsParam] = [];
        for (var i = 0; i < this.options.length; i++) {
          this.options[i].checked = false;
        }
      } else {
        this.form[this.propsParam] = this.options.filter((item => item?.slots?.default != 'checkAll' && item.label.toUpperCase().indexOf(this.selectFilterValue.toUpperCase()) > -1)).map((item) => item.value)
        for (var j = 0; j < this.options.length; j++) {
          // 输入检索条件时，全选只选筛选后的
          if (this.selectFilterValue != '') {
            if (this.options[j].label.toUpperCase().indexOf(this.selectFilterValue.toUpperCase()) > -1) {
              this.options[j].checked = true;
            }
          } else {
            this.options[j].checked = true;
          }
        }
        this.form[this.propsParam] = this.options.filter((item => item?.slots?.default != 'checkAll' && item.label.toUpperCase().indexOf(this.selectFilterValue.toUpperCase()) > - 1)).map((item) => item.value)
      }
      this.$emit("getMutSelectForm", this.form[this.propsParam]);

    },
    toggleSelect(value, item) {

      item.checked = !item.checked
      if (item.checked) {
        this.form[this.propsParam].push(item.value);
      } else {
        var index = this.form[this.propsParam].indexOf(item.value);
        if (index >= 0) {
          this.form[this.propsParam].splice(index, 1)
        }
      }
      this.$emit("getMutSelectForm", this.form[this.propsParam]);
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
    intiForm() {
      for (var i = 0; i < this.options.length; i++) {
        this.options[i].checked = this.defaultValue.includes(this.options[i].value)
      }
    },
  },
};
</script>
<style lang="scss">
.vxe-select--panel {
  z-index: 99999 !important;

}
</style>
