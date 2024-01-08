<template>
  <div class="p-systemHome">
    <!-- 总体信息 -->
    <el-card>
      <div class="info-title">
        <img src="@/assets/ptc/kjywr3.png" alt />
        <div>属期：{{taxpayerInfo.skssq}}</div>
      </div>
      <div class="info-main">
        <div class="main-left">
          <div>企业名称： {{taxpayerInfo.qymc}}</div>
          <div>纳税人识别号： {{taxpayerInfo.nsrsbm}}</div>
          <div>登记日期：{{taxpayerInfo.djrq}}</div>
          <div>地址： {{taxpayerInfo.scjydz}}</div>
        </div>
        <div class="main-right">
          <div class="item">
            <div class="item-tit">状态</div>
            <div class="item-txt">{{statusMap[taxpayerInfo.sszt]}}</div>
          </div>
          <div class="item">
            <div class="item-tit">税款总额</div>
            <div class="item-txt">￥{{taxpayerInfo.jdybtse}}</div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card>
      <div slot="header" class="clearfix">流程进度</div>
      <el-steps :active=taxpayerInfo.lcjd align-center>
        <el-step v-for="(item, index) in processList" :title="item.statusName" :key="index"></el-step>
      </el-steps>
    </el-card>

    <div class="m-chart">
      <el-card class="chart-box">
        <div class="head">
          <div class="head-left">人员数量分析</div>
          <div class="head-right">
            <el-date-picker v-model="selectPersonYear" type="year" placeholder="选择日期"></el-date-picker>
          </div>
        </div>
        <HistogramChart :chartData="getArrayByKey(personnelData, 'nsrc')" chartId="chart1" :yAxis="{
        	min: 0,
        	max: 60,
        	interval: 10,
        }" :chartConfig="{
        	width: chartWidth,
        	height: '300px',
        }" />
      </el-card>

      <el-card class="chart-box">
        <div class="head">
          <div class="head-left">纳税金额分析</div>
          <div class="head-right">
            <el-date-picker v-model="selectPayTaxesYear" type="year" placeholder="选择日期"></el-date-picker>
          </div>
        </div>
        <HistogramChart :chartData="getArrayByKey(payTaxesData, 'sjje')" chartId="chart2" :yAxis="{
        	min: 0,
        	max: 20000,
        	interval: 5000,
        }" :chartConfig="{
        	width: chartWidth,
        	height: '300px',
        }" />
      </el-card>
    </div>
  </div>
</template>

<script>
import HistogramChart from "./HistogramChart.vue";
import { getTaxpayer, getPayTaxesData, getPersonnelData } from "./systemHomeApi";


export default {
  components: { HistogramChart },
  data() {
    return {
      taxpayerInfo: {},
      processList: [
        { status: "0", statusName: "企业报送" },
        { status: "1", statusName: "人员报送", },
        { status: "2", statusName: "薪资导入", },
        { status: "3", statusName: "申报", },
        { status: "4", statusName: "缴税", },
        { status: "5", statusName: "缴税完成", }
      ],
      statusMap: {
        0: '待申报',
        4: '已确认',
        5: '申报中',
        6: '申报成功',
        7: '申报失败',
        8: '申报作废中',
        9: '缴款中',
        10: '缴款成功',
        11: '缴款失败',
        12: '申报成功, 无需缴款',
      },
      selectPersonYear: "2022",
      selectPayTaxesYear: "2022",
      personnelData: [],
      payTaxesData: [],
    };
  },

  mounted() {
    this.getTaxpayer();
  },
  computed: {
    chartWidth() {
      return (screen.width - 394) / 2 + "px";
    },
  },
  watch: {
    selectPersonYear() {
      this.getPersonnelData()
    },
    selectPayTaxesYear() {
      this.getPayTaxesData()
    }
  },
  methods: {
    /**
     * @desption - 系统首页 - 获取首页企业信息
     */
    async getTaxpayer() {
      const { data: { code, data = {} } } = await getTaxpayer();
      if (code != 0) return;

      this.$store.dispatch('user/updateUser', { taxpayerInfo: data })
      const { createTime = '', skssq = '', ryslfx = [], jsjefx = [] } = data
      this.taxpayerInfo = {
        ...data,
        createTime: this.dateFormat(createTime),
        skssq: this.composeNewStr(skssq),
      }
      this.personnelData = ryslfx;
      this.payTaxesData = jsjefx;
    },

    /**
    * @desption - 系统首页 - 获取人员数量分析
    */
    async getPersonnelData() {
      const { data: { code, data = {} } } = await getPersonnelData({
        nsrsbh: this.taxpayerInfo.nsrsbm,
        cxnd: this.selectPersonYear.getFullYear(),
      });
      if (code != 0) return;
      this.personnelData = data;
    },

    /**
    * @desption - 系统首页 - 获取缴税金额分析
    */
    async getPayTaxesData() {
      const { data: { code, data = {} } } = await getPayTaxesData({
        nsrsbh: this.taxpayerInfo.nsrsbm,
        cxnd: this.selectPayTaxesYear.getFullYear(),
      });
      if (code != 0) return;
      this.payTaxesData = data;
    },
    /**
    * @desption - 根据传入的key，返回数组中对象的key的值组成的数组
    */
    getArrayByKey(arr, key) {
      return arr ? arr.map(item => item[key]) : []
    },

    // 转化时间格式
    composeNewStr(str) {
      if (!str) return '暂无时间'
      const things = [
        { thing: "年", space: 4 },
        { thing: "月", space: 6 },
        { thing: "日", space: 8 }
      ];
      const strArr = str.split("");
      things.forEach(item => {
        const { space, thing = "" } = item;
        if (strArr[space - 1]) {
          strArr[space] = thing + (strArr[space] || "");
        }
      });
      return strArr.join("");
    },


    dateFormat(time) {
      if (!time) return '暂无时间';
      const date = new Date(time);
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${year ? year + "年" : ''} ${month ? month + "月" : ''}  ${day ? day + "日" : ''} `
    },
  }
};
</script>

<style lang="scss" scoped>
.p-systemHome {
  .info-title {
    display: flex;
    align-items: center;

    img {
      width: 20px;
      margin-right: 16px;
    }
  }

  .info-main {
    display: flex;
    justify-content: space-between;
  }

  .main-left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin-left: 36px;

    div {
      flex-basis: 50%;
      margin-top: 16px;
    }
  }

  .main-right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;

    .item {
      margin-left: 32px;
      text-align: center;
    }

    .item-txt {
      margin-top: 12px;
      font-size: 15px;
    }
  }

  .m-chart {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .chart-box {
      flex-basis: 50%;

      &:first-child {
        margin-right: 12px;
        margin-top: 15px;
      }
    }

    .head {
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
