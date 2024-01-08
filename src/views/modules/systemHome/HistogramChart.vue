<template>
  <div class="com-histogram-chart">
    <div :id="chartId" :style="{ width: chartConfig.width, height: chartConfig.height }" />
  </div>
</template>

<script>
/* eslint-disable */
import * as echarts from "echarts";
// import { getArrayByKey } from '../../utils/utils';

/**
 * @description - 折线柱状混合图组件
 */
export default {
  name: "HistogramChart",
  props: {
    chartData: {
      type: Array,
      default: () => []
    },
    chartId: {
      type: String,
      default: "main"
    },
    yAxis: {
      type: Object,
      default: () => { }
    },
    chartConfig: {
      type: Object,
      default: () => {
        return {
          width: "1200px",
          height: "400px",
          name: ""
        };
      }
    },
  },
  data() {
    return {};
  },

  watch: {
    chartData() {
      this.init();
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      var chartDom = document.getElementById(this.chartId);
      var myChart = echarts.init(chartDom);
      var option;
      chartDom?.removeAttribute('_echarts_instance_');

      const { min, max, interval } = this.yAxis;

      option = {
        // 浮空提示
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        legend: {
          // bottom: 0,
          // // icon: 'rect',
        },
        // x轴
        xAxis: [
          {
            type: "category",
            data: this.monthList,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        // y轴
        yAxis: [
          // 左边Y轴
          {
            type: "value",
            name: "",
            min,
            max,
            interval,
            axisLabel: {
              formatter: "{value}"
            }
          },
        ],
        // 数据到图形的映射
        series: [
          {
            // 柱状映射
            type: "bar",
            tooltip: {
              valueFormatter: function (value) {
                return value;
              }
            },
            label: {
              show: true,
              position: "inside",
              color: "#fff"
            },
            data: this.chartData,
            itemStyle: {
              // 选中范围中的视觉配置
              opacity: 0.85,
              color: "#5B8FF9"
            }
          }
        ],
      };
      option && myChart.setOption(option);
    }
  },
  computed: {
    monthList() {
      const monthArr = [];
      for (let i = 1; i <= 12; i++) {
        monthArr.push(i + "月");
      }
      return monthArr;
    }
  }
};
</script>

<style scoped lang="scss">
.com-histogram-chart {

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
</style>
