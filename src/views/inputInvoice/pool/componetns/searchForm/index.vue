<template>
  <div class="">
    <el-form ref="form" :model="where" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="发票类型" label-width="85px">
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
          <el-form-item label="所属区域" label-width="85px">
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
          <el-form-item label="纳税主体" label-width="85px">
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
              <el-form-item label="受票组织">
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
              <el-form-item label="报账状态">
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
              <el-form-item label="认证推送状态">
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
              <el-form-item label="发票种类">
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
              <el-form-item label="销售方名称">
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
              <el-form-item label="销售方名称">
                <el-input
                  v-model="where.input"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开票日期">
                <el-date-picker
                  style="width: 100%"
                  v-model="where.value1"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发票代码">
                <el-input
                  v-model="where.input"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发票号码">
                <el-input
                  v-model="where.input"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="价税合计">
                <el-input
                  v-model="where.input"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="来源业务系统">
                <el-input
                  v-model="where.input"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发票状态">
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
              <el-form-item label="项目名称(房开)">
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
              <el-form-item label="项目分期">
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
              <el-form-item label="合同编号">
                <el-input
                  v-model="where.input"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同名称">
                <el-input
                  v-model="where.input"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发票来源">
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
              <el-form-item label="会计期间">
                <el-date-picker
                  style="width: 100%"
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
              <el-form-item label="待认证科目">
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
              <el-form-item label="凭号证">
                <el-input style="width: 100%;"
                  v-model="where.input"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="抵扣期间">
                <el-date-picker
                  v-model="where.value1"
                  style="width: 100%"
                  type="monthrange"
                  range-separator="至"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="认证状态">
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
              <el-form-item label="HAP单据号">
                <el-input
                  v-model="where.input"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="累计转出税额">
                <el-input
                  v-model="where.input"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否可抵扣">
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
              <el-form-item label="费用科目">
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