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
          <p>专用发票：<span class="blue">12张（122元）</span></p>
          <p>普通发票：<span class="blue">12张（122元）</span></p>
          <!-- <p class="blue">普通发票：12张（122元）</p> -->
          <p class="last-moon">较上月：+3%</p>
        </div>
      </div>
      <div class="invoice">
        <p class="title"><span class="iconfont icon-hongzifapiao red"></span>红字发票开具金额</p>
        <p class="money">123,123,12元<span>（共40张）</span></p>
        <div class="subtitle">
          <p>专用发票：<span class="red">12张（122元）</span></p>
          <p>普通发票：<span class="red">12张（122元）</span></p>
          <p class="last-moon">较上月：+3%</p>
        </div>
      </div>
      <div class="invoice">
        <p class="c-title">涉税数据</p>
        <p class="title"><span class="iconfont icon-jinxiaoshuie darkBlue"></span>进销税额</p>
        <p class="money">123,123,12元<span>（共40张）</span></p>
        <div class="subtitle">
          <p>进项税额：<span class="darkBlue">12张（122元）</span></p>
          <p>销项税额：<span class="darkBlue">12张（122元）</span></p>
          <p class="last-moon">较上月：+3%</p>
        </div>
      </div>
      <div class="invoice">
        <p class="title"><span class="iconfont icon-qiyenashui green"></span>企业纳税数据</p>
        <p class="money">123,123,12元<span>（共40张）</span></p>
        <div class="subtitle">
          <p>增值税应纳税额：<span class="green">12张（122元）</span></p>
          <p>其他应纳税额：<span class="green">12张（122元）</span></p>
          <p>企业所得税应纳税额：<span class="green">12张（122元）</span></p>
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
                :show-overflow-tooltip="item.showTooltip"
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
          快捷入口
          <el-button class="shortcut-manage" type="text" size="small" @click="handleManage">管理</el-button>
        </div>
        <div class="shortcut-list tasks-border">
          <div class="li" v-for="item in shortcutMenus" :key="item.id" @click="gotoRouteHandle(item.id)">
            <p>
              <svg class="li-icon icon-svg aui-sidebar__menu-icon" aria-hidden="true">
                <use :xlink:href="`#${item.icon}`"></use>
              </svg>
            </p>
            <p>{{ item.name }}</p>
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
    <el-dialog
      v-if="dialogVisible"
      title="快捷入口选择"
      :visible.sync="dialogVisible"
      width="70"
      :before-close="handleClose"
      class="dialog-shortcut"
    >
      <div class="dialog-warpper">
        <div class="dialog-left">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
          <el-tree
            class="filter-tree"
            :data="menuList"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            show-checkbox
            check-on-click-node
            highlight-current
            check-strictly
            :expand-on-click-node="false"
            ref="tree"
            @check-change="treeChange"
            node-key="id"
            :default-checked-keys="treeKeys"
          >
          </el-tree>
        </div>
        <div class="dialog-right">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>已选&nbsp;3/6</span>
              <el-button type="text">清空</el-button>
            </div>
            <p v-for="o in selectMenus" :key="o.id" class="item">
              {{ o.name }}
            </p>
          </el-card>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveShortcut" :loading="saveLoading">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import * as echarts from 'echarts';
import cloneDeep from 'lodash/cloneDeep';

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
        { title: '提交时间', dataIndex: 'time', align: 'center', width: 140, showTooltip: true },
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
      xMonth: 11, // 点击柱状的索引值
      filterText: '', // 快捷入口过滤关键词
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      seriesData: [
        [320, 332, 301, 334, 390, 330, 320, 311, 324, 490, 130, 620], // 蓝字发票金额
        [120, 132, 101, 134, 90, 230, 210, 141, 234, 190, 130, 230], // 蓝字发票税额
        [220, 182, 191, 234, 290, 330, 310, 181, 214, 240, 310, 340], // 红字发票金额
        [150, 232, 201, 154, 190, 330, 410, 231, 164, 200, 360, 440], // 红字发票税额
      ],
      dialogVisible: false,
      treeKeys: ['1744884803519438849', '1744930298874880002'],
      selectMenus: [
        {
          id: '1744884803519438849',
          name: '蓝字发票开具',
          icon: 'icon-file-text',
          url: 'outputInvoice/blueInvoice/Index',
        },
        {
          id: '1744930298874880002',
          name: '红字发票开具',
          icon: 'icon-file-zip',
          url: 'outputInvoice/redInvoice/enterpriseList/index',
        },
      ],
      shortcutMenus: [
        {
          id: '1744884803519438849',
          name: '蓝字发票开具',
          icon: 'icon-file-text',
          url: 'outputInvoice/blueInvoice/Index',
        },
        {
          id: '1744930298874880002',
          name: '红字发票开具',
          icon: 'icon-file-zip',
          url: 'outputInvoice/redInvoice/enterpriseList/index',
        },
        {
          icon: 'icon-addteam',
          id: '1744932031495725057',
          name: '企业信息维护',
          url: '/organization/index',
        },
        {
          id: '1744958909396869122',
          name: '开票额度预警',
          url: '/creditlimit/index',
          icon: 'icon-alert',
        },
        {
          id: '1745971490001551362',
          name: '商品项目信息',
          url: '/commodity/index',
          icon: 'icon-flag',
        },
        {
          id: '1744930764186771458',
          name: '已开票查询',
          url: 'outputInvoice/invoicedList/Index',
          icon: 'icon-filesearch',
        },
      ],
      menuList: [],
      saveLoading: false,
    };
  },
  mounted() {
    this.initEchart();
    this.initEchartRing();
    this.initTree();
  },
  methods: {
    // 初始化柱状图
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
        // console.log('--params--', params.dataIndex);
        if (_this.xMonth !== params.dataIndex) {
          _this.xMonth = params.dataIndex;
          _this.initEchartRing();
        }
      });
    },
    // 初始化环状图
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
      // console.log('--data--', data, type);

      option = {
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
    // 初始化快捷入口弹窗菜单树
    initTree() {
      let ml = cloneDeep(this.$store.state.sidebarMenuList);
      (function mapTree(tree) {
        tree.map((item) => {
          if (item.children && item.children.length > 0) {
            item.disabled = true;
            mapTree(item.children);
          }
        });
      })(ml);
      this.menuList = ml;
      this.initSelectMenus();
    },
    // 初始化快捷入口弹窗默认选中值
    initSelectMenus() {
      let keys = [];
      let ms = [];
      this.shortcutMenus.forEach((item) => {
        keys.push(item.id);
        ms.push({ ...item });
      });
      this.treeKeys = keys;
      this.selectMenus = ms;
    },
    // 快捷入口弹窗选中取消事件
    treeChange(data) {
      // console.log(data);
      const { selectMenus } = this;
      if (selectMenus.length >= 6) {
        this.$message.error('最多可设置6个快捷入口');
        return;
      }
      let newMenus = this.selectMenus.find((item) => data.id === item.id);
      if (newMenus) {
        this.selectMenus = this.selectMenus.filter((item) => item.id !== data.id);
      } else {
        this.selectMenus = [...this.selectMenus, { id: data.id, name: data.name, icon: data.icon, url: data.url }];
      }
    },
    // 快捷入口跳转
    gotoRouteHandle(menuId) {
      var route = window.SITE_CONFIG['dynamicMenuRoutes'].filter((item) => item.meta.menuId === menuId)[0];
      if (route) {
        this.$router.push({ name: route.name });
      }
    },
    // 关闭快捷入口弹窗
    handleClose() {
      this.selectMenus = [];
      this.dialogVisible = false;
      // console.log('--this.selectMenus--', this.selectMenus);
    },
    // 保存快捷入口
    async saveShortcut() {
      // console.log('--保存--', this.selectMenus);
      const fn = () => {
        return new Promise((res, rej) => {
          setTimeout(() => {
            res({ code: '0', msg: '设置成功' });
          }, 1000);
        });
      };
      try {
        this.saveLoading = true;
        const res = await fn();
        if (res.code === '0') {
          this.$message.success(res.msg);
          this.shortcutMenus = cloneDeep(this.selectMenus);
        }
      } catch (error) {
        this.$message.error(error.msg || '设置失败');
      } finally {
        this.saveLoading = false;
        this.dialogVisible = false;
      }
    },
    // 过滤菜单选择
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 展示快捷入口弹窗
    handleManage() {
      this.dialogVisible = true;
      this.initSelectMenus();
    },
    // 处理待办任务
    handleClick(row) {
      console.log('--row--', row);
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../styles/variables.scss';
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
    transition: all 0.3s cubic-bezier(0.39, 0.575, 0.565, 1);
    &:last-child {
      margin-right: 0;
    }
    &:hover {
      box-shadow: 0 0 5px 0 $primaryGreenColor;
      color: $primaryGreenColor;
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
      margin: -15px -15px 0 -15px;
      padding: 0 10px;
      line-height: 40px;
      font-size: 18px;
      background: #f9f9f9;
      color: #333;
      .iconfont {
        font-size: 18px;
        margin-right: 10px;
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
      color: #666;
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
    height: 40px;
    line-height: 40px;
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
        color: $primaryGreenColor;
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
.dialog-shortcut {
  .dialog-warpper {
    display: flex;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .dialog-left {
    flex: 1;
    /deep/ .el-input__inner {
      line-height: 38px;
      height: 40px;
    }
    /deep/ .el-tree {
      height: 300px;
      overflow: hidden;
      overflow-y: auto;
    }
  }
  .dialog-left,
  .dialog-right {
    height: 340px;
  }
  .dialog-right {
    width: 260px;
    .el-card {
      height: 100%;
      /deep/ .el-card__header {
        padding: 0 20px;
        height: 40px;
        line-height: 38px;
      }
      /deep/ .el-button {
        line-height: 38px;
        padding: 0 10px;
        float: right;
      }
    }
    .item {
      line-height: 30px;
      color: $primaryGreenColor;
    }
  }
}
</style>
