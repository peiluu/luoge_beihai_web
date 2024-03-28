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
                v-for="item in optionList.invoiceType"
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
              v-model="where.nszt"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
              v-for="item in optionList.xsfnsrsbhOptions"
                :key="item.id"
                :label="`${item.nsrmc} ${item.nsrsbh}`"
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
                    v-for="item in optionList.orgOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
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
                <el-input
                  v-model="where.gmfmc"
                  placeholder="请输入内容"
                ></el-input>
               
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
                  <el-option value="" label="全部"></el-option>
                  <el-option
                    v-for="item in optionList.invoiceStatus"
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
                  v-model="where.fpHm"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发票代码：">
                <el-input
                  v-model="where.fpDm"
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
                  <el-option value="" label="全部"></el-option>
                  <el-option
                    v-for="item in optionList.authenticationStatus"
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
                  <el-option value="" label="全部"></el-option>
                  <el-option
                    v-for="item in optionList.accountantList"
                    :key="item.accSegmentCode"
                    :label="item.accSegmentName"
                    :value="item.accSegmentCode"
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
                  <el-option value="" label="全部"></el-option>
                  <el-option
                    v-for="item in optionList.enterAccountStatus"
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
                  format="yyyy-MM-dd"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="价税合计：">
                <article class="flex">
                  <article>
                    <el-input-number :controls="false" :min="0"
                  v-model="where.jshj[0]"
                  placeholder="请输入内容"
                ></el-input-number>
                  </article>&nbsp;~&nbsp;
                  <article>
                    <el-input-number :controls="false" :min="0"
                  v-model="where.jshj[1]"
                  placeholder="请输入内容"
                ></el-input-number>
                  </article>
                </article>
               
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
                  <el-option value="" label="全部"></el-option>
                  <el-option
                    v-for="item in optionList.rollOntStatus"
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
                  <el-option value="" label="全部"></el-option>
                  <el-option
                    v-for="item in optionList.collectTicketStatus"
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
      where: {
        jshj:[undefined,undefined]
      },
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
    
    /* 搜索 */
    handleSearch(){
      if((this?.where?.kprq??'') !==''){
        this.where.kprq[0] = this.formatCustomDate(this?.where?.kprq[0])
        this.where.kprq[1] = this.formatCustomDate(this?.where?.kprq[1])
      }
      this.$emit('search',this.where)
    },
    /* 重置 */
    handleRest(){
      this.where = {jshj:[undefined,undefined]};
      this.$emit('resst',this.where)
    },
    /* 格式pareson */
    formatCustomDate(dateInput, format = 'YYYY-MM-DD') {
      console.log(dateInput,"234234")
      const date = new Date(dateInput);
      const map = {
        YYYY: date.getFullYear(),
        MM: ('0' + (date.getMonth() + 1)).slice(-2),
        DD: ('0' + date.getDate()).slice(-2),
        HH: ('0' + date.getHours()).slice(-2),
        mm: ('0' + date.getMinutes()).slice(-2),
        ss: ('0' + date.getSeconds()).slice(-2),
      };
      
      return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => map[match]);
    }
  },
  inject: ['optionList'],
  created() {},
  mounted() {

    
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
.flex{
  display:flex;
}
/*@import url(); 引入公共css类*/
</style>