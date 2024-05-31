<template>
  <div class="">
    <el-card shadow="" hover>
      <el-form ref="form" :model="taskForm" label-width="80px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="购方名称">
                <el-select style="width:100%" v-model="taskForm.gmfmc" placeholder="请选择">
                    <el-option
                    v-for="item in dataOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" 
                    multiple
                    filterable>
                    </el-option>
                </el-select>
             
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="时间">
              <el-date-picker
                style="width: 100%"
                v-model="taskForm.lssj"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="handleTimeChange"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select
                style="width: 100%"
                multiple
                v-model="taskForm.fpzt"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in fpztOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" label-width="0">
              <article class="searchBth">
                <article>
                  <el-button type="primary" size="mini" @click="handleSearch"
                    >查 询</el-button
                  >
                  <el-button @click="handleRest">重 置</el-button>
                </article>
                <article style="text-align: center">
                  <slot name="btnBef"></slot>
                </article>
              </article>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>

const RESTFORM = {
  gmfmc: "",
  lssj: [],
  fpzt: ["1", "5", "7"],
};
export default {
  name: "addTaskFormPage",
  components: {},
  props: {
    dataOption:{
        type:Array,
        default:[]
    }
  },
  data() {
    return {
        options: [],
      taskForm: {
        gmfmc: "",
        lssj: [],
        fpzt: ["1", "5", "7"],
      },
      fpztOptions: [
        {
          label: "未开票",
          value: "1",
        },
        {
          label: "已勾选",
          value: "2",
        },
        {
          label: "开票中",
          value: "3",
        },
        {
          label: "上传成功",
          value: "4",
        },
        {
          label: "上传失败",
          value: "5",
        },
        {
          label: "开票成功",
          value: "6",
        },
        {
          label: "开票失败",
          value: "7",
        },
      ],
    };
  },
  computed: {

  },
  watch: {},
  methods: {
    // handleSelect(){

    // },
    handleInput() {
      this.$emit("handleDoneSearch", this.taskForm);
    },
    handleTimeChange() {
      this.$emit("handleDoneSearch", this.taskForm);
    },
    /* 搜索 */
    handleSearch() {
      this.$emit("handleDoneSearch", this.taskForm);
    },
    /* 重置 */
    handleRest() {
      this.taskForm = {
        fpzt: ["1", "5", "7"],
      };
      this.$emit("handleDoneSearch", this.taskForm);
    },
    
    handleInput(value) {
      console.log("Selected value:", value);
    }
  },
  
  created() {},
  mounted() {
    this.handleSearch();
    
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
<style scoped>
/*@import url(); 引入公共css类*/
.searchBth {
  display: flex;
  align-items: center;
  justify-content: center;
}
::v-deep .el-card__body {
  padding: 15px !important;
  padding-bottom: 0 !important;
}
</style>
