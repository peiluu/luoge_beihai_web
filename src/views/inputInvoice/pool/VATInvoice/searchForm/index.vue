<template>
  <div class="">
    <el-form ref="form" :model="where" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="发票类型：" label-width="85px">
            <el-select
              style="width: 100%"
              v-model="where.fplx"
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
          <el-form-item label="纳税主体：" label-width="85px">
            <el-select
              style="width: 100%"
              v-model="where.xsfNsrsbh"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
              v-for="item in xsfnsrsbhOptions"
                :key="item.id"
                :label="item.nsrmc"
                :value="item.nsrsbh"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
              <el-form-item label="受票组织：">
                <el-select
                  style="width: 100%"
                  v-model="where.orgid"
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
           
          <!-- <el-form-item label="所属区域" label-width="85px">
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
          </el-form-item> -->
        </el-col>
        
        <el-col :span="6">
          <el-form-item label="" label-width="0px">
            <el-button size="mini" @click="handleRest">重 置</el-button>
            <el-button type="primary" size="mini" @click="handleSearch">搜 索</el-button>
            <span  class="is_show"   @click="handlerIsShow">
              <i :class="!isShow ?'el-icon-arrow-down':'el-icon-arrow-up'">{{!isShow?'展开' : '收起'}}</i>
            </span>
            
          </el-form-item>
        </el-col>
        </el-row>
        <el-collapse-transition>
          <el-row :gutter="20" v-show="isShow">
           
            <el-col :span="8">
              <el-form-item label="购方名称：">
                <el-select
                  style="width: 100%"
                  v-model="where.gmfmc"
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
              <el-form-item label="购方税号：">
                <el-input
                  v-model="where.gmfnsrsbh"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发票状态：">
                <el-select
                  style="width: 100%"
                  v-model="where.fpzt"
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
              <el-form-item label="发票号码：">
                <el-input
                  v-model="where.fphm"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发票代码：">
                <el-input
                  v-model="where.fpdm"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="认证状态：">
                <el-select
                  style="width: 100%"
                  v-model="where.verifyStatus"
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
              <el-form-item label="凭号证：">
                <el-input style="width: 100%;"
                  v-model="where.wspzh"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="会计科目：">
                <el-select
                  style="width: 100%"
                  v-model="where.accSegment"
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
              <el-form-item label="入账状态：">
                <el-select
                  style="width: 100%"
                  v-model="where.rzzt"
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
              <el-form-item label="开票日期：">
                <el-date-picker
                  style="width: 100%"
                  v-model="where.kprq"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="价税合计：">
                <el-input
                  v-model="where.input"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="转出状态：">
                <el-select
                  style="width: 100%"
                  v-model="where.zczt"
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
              <el-form-item label="收票状态：">
                <el-select
                  style="width: 100%"
                  v-model="where.spzt"
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
import {getRatepayingMain} from '@/api/pool/index.js'
export default {
  name: "poolsearcFormPage",
  components: {},
  data() {
    return {
      where: {},
      options: [],
      isShow: false,
      xsfnsrsbhOptions:[],
    };
  },
  computed: {},
  watch: {},
  methods: {
    /* 搜索条件显示隐藏 */
    handlerIsShow(){
      this.isShow = !this.isShow;
      
    },
    async hanldeGetOrgId(){
      
      try {
        const res = await getRatepayingMain();
        console.log(res,"223")
        this.xsfnsrsbhOptions = [... res.data]
      }catch{
        
      }
    },
    /* 搜索 */
    handleSearch(){
      this.$emit('search',this.where)
    },
    /* 重置 */
    handleRest(){
      this.where = {};
      this.$emit('resst',this.where)
    }
  },
  created() {},
  mounted() {
    this.hanldeGetOrgId();
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