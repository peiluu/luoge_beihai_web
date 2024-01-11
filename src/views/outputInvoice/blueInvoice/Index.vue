<template>
  <div class="" style="height: calc(100vh - 132px)">
    <el-card shadow="hover">
      <article class="invoice_header">
        <div class="header_title_content">
          <span>蓝字发票开具</span>
        </div>
        <div class="header_right_main">
          <el-steps :active="active" align-center size="mini" simple>
            <el-step title="选择主体">
              <template #icon>
                <span>1</span>
              </template>
            </el-step>
            <el-step title="选择类型">
              <template #icon>
                <span>2</span>
              </template>
            </el-step>
            <el-step title="信息录入">
              <template #icon>
                <span>3</span>
              </template>
            </el-step>
            <el-step title="提交成功">
              <template #icon>
                <span>4</span>
              </template>
            </el-step>
          </el-steps>
        </div>
      </article>
    </el-card>
    <el-card shadow="hover">
      <!-- 选择主体 -->
      <article v-show="active === 0">
        <form-list
          :singleSelect="true"
          :columns="columns"
          :searchRow="searchList"
          :api="api"
          :param="param"
          :height="height"
          v-loading="loading"
          :default-radio-value="defaultRadioValue"
          ref="list"
        >
          <template #isDigital="row">
            <el-button type="primary" @click="handleNext(row,0)"
              >去开票</el-button
            >
          </template>
          <!-- ="row" -->
          <!-- <template #tableFooter>
            <StepFooter
              :pre="pre"
              :next="next"
              @handleNext="handleNext"
            ></StepFooter>
          </template> -->
        </form-list>
      </article>
      <!-- 选择类型 -->
      <article v-show="active === 1">
        <app-choose-invoice :next-obj="nextObj" ref="choose">
          <template v-slot:default="slotProps">
            <footer v-if="[1].includes(active)" style="text-align:center;margin-top: 42px;">
            <el-button @click="handBack">返回</el-button>
            <el-button type="primary" @click="handleNext(slotProps,1)">下一步</el-button>
          </footer>
          </template>
         
        </app-choose-invoice>
      </article>
      <!-- 信息录入 -->
      <article v-if="active === 2">
        <app-invoice-form :third-data="thirdData"></app-invoice-form>
      </article>
      <!-- 提交成功 -->
      <article v-if="active === 3"></article>
    </el-card>
    <!-- 旧版本 参照 -->
    <article v-if="false">
      <Step :stepData="{ current: 1, total: 4, title: '选择开票组织' }"></Step>
      <form-list
        :singleSelect="true"
        :columns="columns"
        :searchRow="searchList"
        :api="api"
        :param="param"
        :height="height"
        v-loading="loading"
        :default-radio-value="defaultRadioValue"
        ref="list"
      >
        <template #isDigital="row">
          <el-button type="primary" @click="handleNext(row,0)">去开票</el-button>
        </template>
        <!-- ="row" -->
        <template #tableFooter>
          <StepFooter
            :pre="pre"
            :next="next"
            @handleNext="handleNext"
          ></StepFooter>
        </template>
      </form-list>
    </article>
    <!-- 脚部 -->
    
  </div>
</template>

<script>
import FormList from "@/components/FormList.vue";
// import Step from "@/components/Step.vue";
// import StepFooter from "@/components/StepFooter.vue";
import AppChooseInvoice from './ChooseInvoiceType.vue';
import AppInvoiceForm from './BlueInvoiceForm.vue'
export default {
  name: "BuleInvoice",
  components: {
    FormList,
    AppChooseInvoice,
    AppInvoiceForm
    // Step,
    // StepFooter,
  },
  data() {
    return {
      api: require("./Api"),
      loading: false,
      param: {
        pageSize: 10,
        pageNo: 1,
      },
      columns: [
        // {type: "radio",width: 50,align:"center",},
        { title: "开票点名称", width: 180, dataIndex: "name", align: "center" },
        { title: "所属账套", width: 180, dataIndex: "ssztName", align: "center" },
        {
          title: "纳税人名称",
          width: 200,
          dataIndex: "nsrmc",
          align: "center",
        },
        {
          title: "纳税人识别号",
          width: 200,
          dataIndex: "nsrsbh",
          align: "center",
        },
        // {
        //   title: "剩余开票额度",
        //   width: 180,
        //   dataIndex: "nsrmc",
        //   align: "center",
        // },
        {
          title: "操作",
          width: 80,
          dataIndex: "isDigital",
          align: "center",
          slot: "isDigital",
        },
      ],
      searchList: [
        {
          index: 0,
          key: "name",
          val: "",
          type: "input",
          label: "请输入纳税人名称/账套名称/开票点名称",
          placeholder: "请输入纳税人名称/账套名称/开票点名称",
        },
      ],
      pre: false,
      next: true,
      defaultRadioValue: this.$route?.query?.orgid || "",
      active: 0, //当前步骤
      nextObj:{},//第二步数据
      thirdData:{},//第三步数据
    };
  },
  methods: {
    handleNext(row,type) {
      
      // 从最新的列表里取值，规避同步修改组织管理里的数电切换时已经选中的数据无法及时更新的问题
      //const tableData = this.$refs.list.data;
      //let selectedRow = tableData.find((item) => item.id == this.$refs.list.selectedRow.id) || {};
      // if(!selectedRow.id && !this.$route.query?.orgid){
      //   this.$message({
      //     message: '请选择开票组织',
      //     type: 'warning'
      //   });
      //   return;
      // }
      //  this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
      // this.$eventBus.$emit('chooseInvoiveTypeReset');
      // this.$router.push({
      //   path: '/buleInvoice/ChooseInvoiceType',
      //   query: {orgid: selectedRow.id || this.$route?.query?.orgid, isDigital: selectedRow.isDigital || this.$route?.query?.isDigital}
      // });
      //this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
      switch(type){
        case 0:{
          this.nextObj = {...row.data, orgid:row?.data.id, isDigital: row?.data.isDigital};
          this.active = this.active + 1;
          break;
        }
        case 1: {
          this.handleValidation(row);
          console.log(row.slotData,"-------")
          this.thirdData = {...row.slotData.slotData};
          
          break;
        }
        default: {
          break;
        }
      }
     
     
    },
    handleOk() {
      this.$refs.list.reload();
    },
    handBack(){
      this.active = this.active -1;
    },

    async handleValidation(row){
      
      try {
      const result = await this.$refs.choose.handleFormValidate();
      if (result) {
        this.thirdData = {...row};
        this.active = this.active + 1;
        // 在这里处理表单验证通过的情况
      }
    } catch (error) {
     // console.log('Form is invalid:', error.message);
      // 在这里处理表单验证失败的情况
    }
    }
  },
  computed: {
    height() {
      return window.innerHeight - 394;
    },
    // contentHeight(){
    //   return window.innerHeight - 282;
    // }
  },
  mounted() {
    console.log(this.$route, "00988");
  },
};
</script>
<style lang="scss" scoped>
.invoice_header{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.header_right_main{
  flex:1
}
.header_title_content span{
  display: inline-block;
  padding-right: 15px;
  font-size: 20px;
  font-weight: bold;
  color: #008FE0;
}
</style>
