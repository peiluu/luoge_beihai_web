<template>
  <div class="">
    <el-card shadow="never">
      <el-form ref="form" :model="where" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="疑票状态" label-width="85px">
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
          <el-col :span="6">
            <el-form-item label="发票代码" label-width="85px">
              <el-input v-model="where.input" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发票代码" label-width="85px">
              <el-input v-model="where.input" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          
          
          <el-col :span="6" style="text-align: right">
            <el-form-item label="" label-width="0px">
              <el-button size="mini">重置</el-button>
              <el-button type="primary" size="mini">确认</el-button>
              <span class="is_show" @click="handlerIsShow">
                <i
                  :class="!isShow ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
                  >{{ !isShow ? "展开" : "收起" }}</i
                >
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-collapse-transition>
          <el-row :gutter="20" v-show="isShow">
            <el-col :span="8">
              <el-form-item label="提交人" label-width="85px">
                <el-input v-model="where.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="购买方名称" label-width="85px">
                <el-input v-model="where.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="销售方名称" label-width="85px">
                <el-input v-model="where.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="提交日期" label-width="85px">
              <el-date-picker
                style="width: 100%"
                v-model="where.value2"
                type="month"
                placeholder="选择月"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
              <el-form-item label="处理人" label-width="85px">
                <el-input v-model="where.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="处理日期" label-width="85px">
              <el-date-picker
                style="width: 100%"
                v-model="where.value2"
                type="month"
                placeholder="选择月"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="受票组织" label-width="85px">
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
          </el-row>
        </el-collapse-transition>
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
    handlerIsShow() {
      this.isShow = !this.isShow;
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
<style scoped lang="scss">
::v-deep .el-col-8 {
  height: 47px;
}
.is_show {
  margin-left: 15px;
  font-size: 12px;
  cursor: pointer;
}
/*@import url(); 引入公共css类*/
</style>