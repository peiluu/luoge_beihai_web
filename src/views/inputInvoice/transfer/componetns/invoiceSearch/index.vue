<template>
    <div class="">
      <el-form ref="form" :model="where" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="纳税人" label-width="85px">
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
            <el-form-item label="所属组织" label-width="85px">
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
            <el-form-item label="转出日期" label-width="85px">
              <el-date-picker
                v-model="where.value1"
                type="monthrange"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align: right;">
            <el-form-item label="" label-width="0px">
              <el-button size="mini">重置</el-button>
              <el-button type="primary" size="mini">确认</el-button>
              <span  class="is_show"   @click="handlerIsShow">
                <i :class="!isShow ?'el-icon-arrow-down':'el-icon-arrow-up'">{{!isShow?'展开' : '收起'}}</i>
              </span>
              
            </el-form-item>
          </el-col>
        </el-row>
        <el-collapse-transition>
          <el-row :gutter="20" v-show="isShow">
            <el-col :span="8">
              <el-form-item label="凭证号" label-width="85px">
                <el-input
                  v-model="where.input"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="转出原因" label-width="85px">
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
            <el-col :span="8">
              <el-form-item label="转出人" label-width="85px">
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
            <el-col :span="8">
              <el-form-item label="应税期" label-width="85px">
                <el-date-picker
                  v-model="where.value1"
                  type="monthrange"
                  range-separator="至"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="转出人" label-width="85px">
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
    </div>
  </template>
  
  <script>
  export default {
    name: "searchFormPage",
    components: {},
    data() {
      return {
        where: {},
        options: [],
        isShow:false,
      };
    },
    computed: {},
    watch: {},
    methods: {
      handlerIsShow(){    
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
  <style scoped>
  /*@import url(); 引入公共css类*/
  </style>