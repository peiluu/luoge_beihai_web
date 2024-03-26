<template>
  <div class="">
    <el-form ref="form" :model="where" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="(缴款单位人纳税人识别号)纳税主体："
            label-width="265px"
          >
            <el-select
              style="width: 100%"
              v-model="where.jkdwrnsrsbh"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="(item,index) in optionList.xsfnsrsbhOptions"
                :key="index"
                :label="`${item.nsrmc} ${item.nsrsbh}`"
                :value="item.nsrsbh"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="受票组织：" label-width="85px">
            <el-select
              style="width: 100%"
              v-model="where.orgid"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="(item,index) in optionList.orgOption"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="" label-width="0px">
            <el-button size="mini" @click="handleRest">重 置</el-button>
            <el-button type="primary" size="mini" @click="handleSearch">搜 索</el-button>
            <span class="is_show" @click="handlerIsShow">
              <i :class="!isShow ? 'el-icon-arrow-down' : 'el-icon-arrow-up'">{{
                !isShow ? "展开" : "收起"
              }}</i>
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-collapse-transition>
        <el-row :gutter="20" v-show="isShow">
          <el-col :span="8">
            <el-form-item label="是否重号锁定:">
              <el-select
                style="width: 100%"
                v-model="where.sfchsd"
                placeholder="请选择"
                clearable
                filterable
              >
                <el-option
                  v-for="item in optionList.lockOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
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
                  v-for="(item,index) in optionList.accountantList"
                  :key="index"
                  :label="item.accSegmentName"
                  :value="item.accSegmentCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="凭证号：">
              <el-input
                v-model="where.wspzh"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="海关缴款书号码：" label-width="140px">
              <el-input
                v-model="where.hgjkshm"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税款金额：">
              <article style="display:flex">
                  <article>
                    <el-input-number :controls="false" :min="0"
                  v-model="where.skje[0]"
                  placeholder="请输入内容"
                ></el-input-number>
                  </article>&nbsp;~&nbsp;
                  <article>
                    <el-input-number :controls="false" :min="0"
                  v-model="where.skje[1]"
                  placeholder="请输入内容"
                ></el-input-number>
                  </article>
                </article>
            
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="填发日期：">
              <el-date-picker
                style="width: 100%"
                v-model="where.tfrq"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
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
        skje:[undefined,undefined]
      },
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
    /* 搜索 */
    handleSearch(){
      this.$emit('search',this.where)
    },
    /* 重置 */
    handleRest(){
      this.where = {skje:[undefined,undefined]};
      this.$emit('resst',this.where)
    }
  },
  inject: ['optionList'],
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