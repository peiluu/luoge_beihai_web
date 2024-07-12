<template>
  <div class="">
    <vxe-grid v-bind="gridOptions1" @edit-disabled="editDisabledEvent">
      <template #fymx_edit="{ row }">
        <vxe-input v-model="row.name"></vxe-input>
      </template>
      <template #sl_edit="{ row }">
        <vxe-input v-model="row.sex"></vxe-input>
      </template>
      <template #dw_edit="{ row }">
        <vxe-input v-model="row.age"></vxe-input>
      </template>
      <template #je_edit="{ row }">
        <vxe-input v-model="row.address"></vxe-input>
      </template>
      <template #se_edit="{ row }">
        <vxe-input v-model="row.address"></vxe-input>
      </template>
      <template #slv_edit="{ row }">
        <vxe-input v-model="row.address"></vxe-input>
      </template>
      <template #ylfwgbm_edit="{ row }">
        <vxe-input v-model="row.address"></vxe-input>
      </template>
      <template #bz_edit="{ row }">
        <vxe-input v-model="row.address"></vxe-input>
      </template>
    </vxe-grid>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      gridOptions1: {
        border: true,
        showOverflow: true,
        editConfig: {
          trigger: "click",
          mode: "cell",
          beforeEditMethod: this.activeCellMethod,
        },
        columns: [
          { type: "seq", width: 50,},
          {field: "fymx",title: "费用明细",editRender: {},slots: { edit: "fymx_edit" },},
          {field: "sl",title: "数量",editRender: {},slots: { edit: "sl_edit" },},
          {field: "dw",title: "单位",editRender: {},slots: { edit: "dw_edit" },},
          {field: "je",title: "金额",editRender: {},slots: { edit: "je_edit" },},
          {field: "se",title: "税额",editRender: {},slots: { edit: "se_edit" },},
          {field: "slv",title: "增值税税率/征收率",editRender: {},slots: { edit: "slv_edit" },},
          {field: "ylfwgbm",title: "医疗服务贯标码",editRender: {},slots: { edit: "ylfwgbm_edit" },},
          {field: "bz",title: "备注",editRender: {},slots: { edit: "bz_edit" },},
        ],
        data: [
          {
            id: 10001,name: "Test1",nickname: "T1",role: "Develop",sex: "Man",age: 28,address: "Shenzhen",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    activeCellMethod ({ column, columnIndex }) {
        if (columnIndex === 1) {
        return false
        }
        return true
    },
    editDisabledEvent ({ row, column }) {
        console.log('禁止编辑')
    }
  },
  created() {},
  mounted() {},
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
};
</script>
<style scoped>
/*@import url(); 引入公共css类*/
</style>