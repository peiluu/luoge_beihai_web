<template>
  <div class="">
    <el-card>
    <el-form ref="form" :model="where" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="税号" label-width="85px">
            <el-select
              style="width: 100%"
              v-model="where.value"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="纳税人名称" label-width="85px">
            <el-select
              style="width: 100%"
              v-model="where.value"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="所属期" label-width="85px">
            <el-date-picker style="width:100%"
            v-model="where.value2"
            type="month"
            placeholder="选择月">
          </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="" label-width="0px">
            <el-button type="primary" size="mini">查询</el-button>
          </el-form-item>
        </el-col>
        </el-row>
        
     
    </el-form>
  </el-card>
  </div>
</template>

<script>
export default {
  name: "poolsearcFormPage",
  components: {},
  data() {
    return {
      where: {},
      options: [],
      isShow: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    /* 搜索条件显示隐藏 */
    handlerIsShow(){
      this.isShow = !this.isShow;
      
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
<style scoped lang="scss">
::v-deep .el-col-8{
  height: 47px;
}
.is_show{
  margin-left: 15px;
  font-size: 12px;
  cursor: pointer;
}
/*@import url(); 引入公共css类*/
</style>