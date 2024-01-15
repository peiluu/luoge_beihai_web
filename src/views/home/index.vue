<template>
  <el-card shadow="never" class="sjy-home">
    <div class="head-search">
      <el-select v-model="from.region" placeholder="请选择" class="mr-space">
        <el-option v-for="item in regionOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
      <el-select v-model="from.taxpayer" placeholder="请选择" class="mr-space">
        <el-option v-for="item in taxpayerOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker v-model="from.date" type="date" placeholder="选择日期"> </el-date-picker>
    </div>
    <div class="content">
      <div class="invoice">
        <p class="c-title">发票数据</p>
        <p class="title"><span class="iconfont icon-lanzifapiao blue"></span>蓝字发票开具金额</p>
        <p class="money">123,123,12元<span>（共40张）</span></p>
        <div class="subtitle">
          <p class="blue">专用发票：12张（122元）</p>
          <p class="blue">普通发票：12张（122元）</p>
          <p class="last-moon">较上月：+3%</p>
        </div>
      </div>
      <div class="invoice">
        <p class="title"><span class="iconfont icon-hongzifapiao red"></span>红字发票开具金额</p>
        <p class="money">123,123,12元<span>（共40张）</span></p>
        <div class="subtitle">
          <p class="red">专用发票：12张（122元）</p>
          <p class="red">普通发票：12张（122元）</p>
          <p class="last-moon">较上月：+3%</p>
        </div>
      </div>
      <div class="invoice">
        <p class="c-title">涉税数据</p>
        <p class="title"><span class="iconfont icon-jinxiaoshuie darkBlue"></span>进销税额</p>
        <p class="money">123,123,12元<span>（共40张）</span></p>
        <div class="subtitle">
          <p class="darkBlue">进项税额：12张（122元）</p>
          <p class="darkBlue">销项税额：12张（122元）</p>
          <p class="last-moon">较上月：+3%</p>
        </div>
      </div>
      <div class="invoice">
        <p class="title"><span class="iconfont icon-qiyenashui green"></span>企业纳税数据</p>
        <p class="money">123,123,12元<span>（共40张）</span></p>
        <div class="subtitle">
          <p class="green">增值税应纳税额：12张（122元）</p>
          <p class="green">其他应纳税额：12张（122元）</p>
          <p class="green">企业所得税应纳税额：12张（122元）</p>
          <p class="last-moon">较上月：+3%</p>
        </div>
      </div>
    </div>
    <div class="tasks">
      <div class="tasks-l">
        <div class="tasks-head">待办任务<span>共10条</span></div>
        <div class="tasks-border">
          <el-table :data="tableData">
            <template v-for="(item, index) in columns">
              <el-table-column
                v-if="item.type === 'index'"
                type="index"
                :label="item.title"
                :min-width="item.width"
                :key="index"
                :align="item.align"
              >
              </el-table-column>
              <el-table-column
                v-else-if="item.type === 'action'"
                :prop="item.dataIndex"
                :label="item.title"
                :min-width="item.width"
                :key="item.id"
                :align="item.align"
              >
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text" size="small">立即处理</el-button>
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :align="item.align"
                :prop="item.dataIndex"
                :label="item.title"
                :min-width="item.width"
                :key="item.id"
              >
              </el-table-column>
            </template>
          </el-table>
          <el-pagination background layout="prev, pager, next" :total="10" :page-size="3"> </el-pagination>
        </div>
      </div>
      <div class="tasks-r">
        <div class="tasks-head shortcut-head">
          快捷入口 <el-button class="shortcut-manage" type="text" size="small">管理</el-button>
        </div>
        <div class="shortcut-list tasks-border">
          <div class="li">
            <p>
              <i class="li-icon el-icon-reading"></i>
            </p>
            <p>蓝字发票开具</p>
          </div>
          <div class="li">
            <p>
              <i class="li-icon el-icon-reading"></i>
            </p>
            <p>蓝字发票开具</p>
          </div>
          <div class="li">
            <p>
              <i class="li-icon el-icon-reading"></i>
            </p>
            <p>蓝字发票开具</p>
          </div>
          <div class="li">
            <p>
              <i class="li-icon el-icon-reading"></i>
            </p>
            <p>蓝字发票开具</p>
          </div>
          <div class="li">
            <p>
              <i class="li-icon el-icon-reading"></i>
            </p>
            <p>蓝字发票开具</p>
          </div>
        </div>
      </div>
    </div>
    <div class="echart">
      <div class="echart-l">
        <div class="echart-search">
          <el-radio-group v-model="echartFrom.type">
            <el-radio-button :label="1">发票数据分析</el-radio-button>
            <el-radio-button :label="2">计税数据分析</el-radio-button>
          </el-radio-group>

          <el-radio-group v-model="echartFrom.month">
            <el-radio-button :label="3">近3个月</el-radio-button>
            <el-radio-button :label="6">近6个月</el-radio-button>
            <el-radio-button :label="12">近12个月</el-radio-button>
          </el-radio-group>
        </div>
        <div id="echart-col"></div>
      </div>
      <div class="echart-r">
        <p class="echart-mo">2023-12</p>
        <p class="proportion">占图比</p>
        <div id="echart-ring"></div>
      </div>
    </div>
  </el-card>
</template>
<script>
import debounce from 'lodash/debounce';
import * as echarts from 'echarts';
export default {
  name: 'home',
  data() {
    return {
      regionOptions: [
        // 区域
        { value: '1', label: '华北区' },
        { value: '2', label: '华南区' },
        { value: '3', label: '华中区' },
      ],
      taxpayerOptions: [
        // 纳税主体
        { value: '1', label: '纳税企业1' },
        { value: '2', label: '纳税企业2' },
        { value: '3', label: '纳税企业3' },
      ],
      columns: [
        { title: '序号', type: 'index', width: 50, align: 'center' },
        { title: '待办编号', dataIndex: 'code', align: 'center' },
        { title: '待办模块', dataIndex: 'module', align: 'center' },
        { title: '提交人', dataIndex: 'presenter', align: 'center' },
        { title: '提交时间', dataIndex: 'time', align: 'center' },
        { title: '操作', type: 'action', align: 'center', width: 80, slot: 'action' },
      ],
      tableData: [
        { id: 1, code: '282828', module: '红字确认单0', presenter: '系统', time: '2023-10-22 11:11:11' },
        { id: 12, code: '282828', module: '红字确认单9', presenter: '系统', time: '2023-10-22 11:11:11' },
        { id: 13, code: '282828', module: '红字确认单8', presenter: '系统', time: '2023-10-22 11:11:11' },
      ],
      from: {
        region: '1', // 选中的区域值
        taxpayer: null, // 选中的纳税主体值
        date: null, // 选中的时间
      },
      echartFrom: {
        type: 1, // 1 发票数据分析 , 2 计税数据分析
        month: 12, // 近3月，近6月，近12月
      },
      xMonth: 11,
      seriesData: [
        [320, 332, 301, 334, 390, 330, 320, 311, 324, 490, 130, 620], // 蓝字发票金额
        [120, 132, 101, 134, 90, 230, 210, 141, 234, 190, 130, 230], // 蓝字发票税额
        [220, 182, 191, 234, 290, 330, 310, 181, 214, 240, 310, 340], // 红字发票金额
        [150, 232, 201, 154, 190, 330, 410, 231, 164, 200, 360, 440], // 红字发票税额
      ],
    };
  },
  mounted() {
    this.initEchart();
    this.initEchartRing();
  },
  methods: {
    handleClick(row) {
      console.log('--row--', row);
    },
    initEchart() {
      const _this = this;
      let chartDom = document.getElementById('echart-col');
      if (!chartDom) return;
      myChart && myChart.dispose();
      let myChart = echarts.init(chartDom);
      let option;

      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: [
              '2023-01',
              '2023-02',
              '2023-03',
              '2023-04',
              '2023-05',
              '2023-06',
              '2023-07',
              '2023-08',
              '2023-09',
              '2023-10',
              '2023-11',
              '2023-12',
            ],
            axisLabel: {
              interval: 0, // 强制显示所有标签
              rotate: 30, // 旋转角度，值为正则右旋，值为负则左旋
              margin: 15, // 与轴线距离
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '蓝字发票金额',
            type: 'bar',
            stack: 'Ad',
            barMaxWidth: '40',
            data: this.seriesData[0],
          },
          {
            name: '蓝字发票税额',
            type: 'bar',
            stack: 'Ad',
            barMaxWidth: '40',
            data: this.seriesData[1],
          },
          {
            name: '红字发票金额',
            type: 'bar',
            stack: 'Ad',
            barMaxWidth: '40',
            data: this.seriesData[2],
          },
          {
            name: '红字发票税额',
            type: 'bar',
            stack: 'Ad',
            barMaxWidth: '40',
            data: this.seriesData[3],
          },
        ],
      };

      option && myChart.setOption(option);
      myChart.on('click', function (params) {
        console.log('--params--', params.dataIndex);
        if (_this.xMonth !== params.dataIndex) {
          _this.xMonth = params.dataIndex;
          _this.initEchartRing();
        }

        // myChart.dispatchAction({
        //   type: 'dataZoom',
        //   startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
        //   endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)],
        // });
      });
    },
    initEchartRing() {
      const { type } = this.echartFrom;
      const { xMonth, seriesData } = this;
      let chartDom = document.getElementById('echart-ring');
      if (!chartDom) return;
      myChart && myChart.dispose();
      let myChart = echarts.init(chartDom);
      let option;
      let data = [];

      if (type === 1) {
        const stotal = seriesData[0][xMonth] + seriesData[2][xMonth];
        const v1 = (seriesData[0][xMonth] / stotal) * 100;
        const v2 = 100 - v1;
        data = [
          { name: '蓝字发票开具金额', value: v1.toFixed(2) },
          { name: '红字发票开具金额', value: v2.toFixed(2) },
        ];
      }
      console.log('--data--', data, type);

      option = {
        // title: {
        //   text: '',
        //   left: 'center',
        //   textStyle: {
        //     color: '#999',
        //     fontWeight: 'normal',
        //     fontSize: 14,
        //   },
        // },
        series: [
          // https://echarts.apache.org/zh/option.html#series-pie.radius
          {
            type: 'pie',
            center: ['50%', '50%'], //修改圆心位置
            radius: ['30%', '50%'], //修改大小
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1,
            },
            label: {
              alignTo: 'edge',
              formatter: '{name|{b}}\n{time|{c}%}',
              minMargin: 5,
              edgeDistance: 10,
              lineHeight: 15,
              rich: {
                time: {
                  fontSize: 10,
                  color: '#999',
                },
              },
            },
            labelLine: {
              length: 15,
              length2: 0,
              maxSurfaceAngle: 80,
            },
            labelLayout: function (params) {
              const isLeft = params.labelRect.x < myChart.getWidth() / 2;
              const points = params.labelLinePoints;
              // Update the end point.
              points[2][0] = isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width;
              return {
                labelLinePoints: points,
              };
            },
            data: data,
          },
        ],
      };

      option && myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
.head-search {
  display: flex;
  justify-content: flex-end;
  .mr-space {
    margin-right: 20px;
  }
}
p {
  margin: 0;
}
.content {
  display: flex;
  justify-content: space-between;
  padding-top: 25px;

  .invoice {
    flex: 1;
    margin-top: 40px;
    border: 1px solid #e9e9e9;
    border-radius: 8px;
    padding: 15px;
    position: relative;
    margin-right: 20px;
    &:last-child {
      margin-right: 0;
    }
    .c-title {
      font-size: 18px;
      color: #333;
      font-weight: bold;
      margin-top: 0;
      margin-bottom: 10px;
      position: absolute;
      top: -40px;
      left: 0;
    }
    .title {
      margin: top;
      font-size: 20px;
      color: #333;
      .iconfont {
        font-size: 22px;
        margin-right: 15px;
      }
    }
    .money {
      font-size: 20px;
      color: #333;
      text-align: center;
      line-height: 40px;
      span {
        font-size: 12px;
        font-weight: 400;
      }
    }
  }

  .subtitle {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    > p {
      margin-bottom: 5px;
    }
  }
  .last-moon {
    font-size: 14px;
    color: #666;
    text-align: right;
  }
  .blue {
    color: #7ea6ff !important;
  }
  .red {
    color: #fe5363 !important;
  }
  .darkBlue {
    color: #000080 !important;
  }
  .green {
    color: #008080 !important;
  }
}
.tasks {
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
  .tasks-l {
    flex: 1;
  }
  .tasks-r {
    margin-left: 20px;
    width: 388px;
    flex-shrink: 1;
  }
  .tasks-head {
    height: 50px;
    line-height: 50px;
    background-color: #f9f9f9;
    padding: 0 15px;
    border: 1px solid #e9e9e9;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    > span {
      color: #d9001b;
      font-weight: bold;
      font-size: 14px;
      margin-left: 10px;
    }
  }
  .shortcut-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .shortcut-list {
    width: 100%;
    height: 198px;
    display: flex;
    flex-wrap: wrap;
    .li {
      width: 33.3333%;
      text-align: center;
      height: 99px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      &:hover {
        cursor: pointer;
      }
      .li-icon {
        font-size: 28px;
        margin-bottom: 5px;
      }
    }
  }
}
.tasks-border {
  border: 1px solid #e9e9e9;
  border-top: none;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
/deep/ .el-table {
  th {
    background-color: #fff;
  }
}
/deep/ .el-pagination {
  margin: 10px auto;
}
.echart {
  display: flex;
  margin-bottom: 25px;
  .echart-l {
    flex: 1;
  }
  .echart-r {
    width: 480px;
    overflow: hidden;
  }
  #echart-col {
    height: 420px;
  }
  #echart-ring {
    height: 400px;
  }
  .echart-search {
    margin-top: 25px;
    padding-bottom: 15px;
    display: flex;
    justify-content: space-between;
  }
  .echart-mo {
    margin-top: 25px;
    padding-bottom: 15px;
    text-align: right;
    font-size: 16px;
    line-height: 28px;
  }
  .proportion {
    font-size: 16px;
    font-weight: bold;
    line-height: 20px;
  }
}
</style>
