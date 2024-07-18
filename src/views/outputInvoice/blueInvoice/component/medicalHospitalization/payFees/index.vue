<template>
  <div class="">
    <article class="form-goods-toolbar">
        <el-button type="success" @click="handleAddRow">添加行</el-button>
        <el-button @click="handleDelRow">删除</el-button>
    </article>
    <article>
        <vxe-grid ref="payFeesTableRef" v-bind="gridOptions" @edit-disabled="editDisabledEvent">
        <template #fymx_edit="{ row }">
            <vxe-input v-model="row.name" size="small"></vxe-input>
        </template>
        <template #sl_edit="{ row }">
            <vxe-input v-model="row.sex" size="small"></vxe-input>
        </template>
        <template #dw_edit="{ row }">
            <vxe-input v-model="row.age" size="small"></vxe-input>
        </template>
        <template #je_edit="{ row }">
            <vxe-input v-model="row.address" size="small"></vxe-input>
        </template>
        <template #se_edit="{ row }">
            <vxe-input v-model="row.address" size="small"></vxe-input>
        </template>
        <template #slv_edit="{ row }">
            <vxe-input v-model="row.address" size="small"></vxe-input>
        </template>
        <template #ylfwgbm_edit="{ row }">
            <vxe-input v-model="row.address" size="small"></vxe-input>
        </template>
        <template #bz_edit="{ row }">
            <vxe-input v-model="row.address" size="small"></vxe-input>
        </template>
        </vxe-grid>
    </article>
    
  </div>
</template>

<script>
export default {
  name: "payFeesPage",
  components: {},
  props: {},
  data() {
    return {
      gridOptions: {
        border: true,
        showOverflow: true,
        editConfig: {
          trigger: "click",
          mode: "cell",
          beforeEditMethod: this.activeCellMethod,
        },
        columns: [
          { type: 'checkbox',  width: 45 },
          { type: "seq", width: 50,title:"序号"},
          {field: "fymx",title: "费用明细",editRender: {},slots: { edit: "fymx_edit" },},
          {field: "sl",title: "数量",editRender: {},slots: { edit: "sl_edit" },},
          {field: "dw",title: "单位",editRender: {},slots: { edit: "dw_edit" },},
          {field: "je",title: "金额",editRender: {},slots: { edit: "je_edit" },},
          {field: "se",title: "税额",editRender: {},slots: { edit: "se_edit" },},
          {field: "slv",title: "增值税税率/征收率", minWidth:100,editRender: {},slots: { edit: "slv_edit" },},
          {field: "ylfwgbm",title: "医疗服务贯标码",minWidth:100,editRender: {},slots: { edit: "ylfwgbm_edit" },},
          {field: "bz",title: "备注",editRender: {},slots: { edit: "bz_edit" },},
        ],
        data: [
          { },
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
    },
    /* 添加行 */
    handleAddRow(){
        let obj = {
            "zysfmxxh": null,
            "mxxh": null,
            "fymx": "",
            "sl": "",
            "dw": "",
            "je": null,
            "se": null,
            "slv": null,
            "ylfwgbm": "",
            "bz": ""
        };
        this.gridOptions.data.push(obj)
    },
    /* 删除行 */
    handleDelRow(){
        const tableRef = this.$refs.payFeesTableRef;
        let checkData = tableRef.getCheckboxRecords(true);
        if(checkData.length <=0){
            this.$message.warning("请选择要删除的数据！");
            return
        }
        for (let i = checkData.length - 1; i >= 0; i--) {
            let row = checkData[i];
            let index = tableRef.getVTRowIndex(row);
            this.gridOptions.data.splice(index, 1);
        }
       
       
    },
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
.form-goods-toolbar{
    padding: 10px;
    border-top: 2px solid #a15f3b;
    border-bottom: 2px solid #a15f3b;
}
</style>