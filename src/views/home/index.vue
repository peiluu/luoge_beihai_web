<template>
  <el-card shadow="never" class="sjy-home">
    <div class="head-search">
      <!-- <el-select v-model="form.region" placeholder="请选择" class="mr-space">
        <el-option v-for="item in regionOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select> -->
      <el-select
        v-model="form.nsrsbh"
        filterable
        placeholder="请选择"
        class="mr-space"
        @change="refreshData"
        style="width: 280px"
      >
        <el-option v-for="item in taxpayerOptions" :key="item.nsrsbh" :label="item.nsrmc" :value="item.nsrsbh">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="form.ssq"
        type="month"
        placeholder="选择月份"
        value-format="yyyy-MM"
        @change="refreshData"
      >
      </el-date-picker>
    </div>
    <div class="content" v-loading="loading">
      <div class="invoice invoice-bg1">
        <p class="c-title">发票数据</p>
        <p class="title"><span class="iconfont icon-lanzifapiao"></span>蓝字发票开具金额</p>
        <p class="money">
          {{ fpsj.lzfpkjje }}元<span>（共{{ fpsj.lzfpkjzs }}张）</span>
        </p>
        <div class="subtitle">
          <p>
            专用发票：<span class="blue">{{ fpsj.lzpp }}张（{{ fpsj.lzppje }}元）</span>
          </p>
          <p>
            普通发票：<span class="blue">{{ fpsj.lzzp }}张（{{ fpsj.lzzpje }}元）</span>
          </p>
          <p class="last-moon">较上月：{{ fpsj.lzppbl }}</p>
        </div>
      </div>
      <div class="invoice invoice-bg2">
        <p class="title"><span class="iconfont icon-hongzifapiao"></span>红字发票开具金额</p>
        <p class="money">
          {{ fpsj.hzfpkjje }}元<span>（共{{ fpsj.hzfpkjzs }}张）</span>
        </p>
        <div class="subtitle">
          <p>
            专用发票：<span class="blue">{{ fpsj.hzpp }}张（{{ fpsj.hzppje }}元）</span>
          </p>
          <p>
            普通发票：<span class="blue">{{ fpsj.hzzp }}张（{{ fpsj.hzzpje }}元）</span>
          </p>
          <p class="last-moon">较上月：{{ fpsj.hzppbl }}</p>
        </div>
      </div>
      <div class="invoice invoice-bg3">
        <p class="c-title">涉税数据</p>
        <p class="title"><span class="iconfont icon-jinxiaoshuie"></span>进销税额</p>
        <!-- <p class="money">123,123,12元<span>（共40张）</span></p>
        <div class="subtitle">
          <p>进项税额：<span class="darkBlue">12张（122元）</span></p>
          <p>销项税额：<span class="darkBlue">12张（122元）</span></p>
          <p class="last-moon">较上月：+3%</p>
        </div> -->
        <div class="deving">敬请期待</div>
      </div>
      <div class="invoice invoice-bg4">
        <p class="title"><span class="iconfont icon-qiyenashui"></span>企业纳税数据</p>
        <!-- <p class="money">123,123,12元<span>（共40张）</span></p>
        <div class="subtitle">
          <p>增值税应纳税额：<span class="green">12张（122元）</span></p>
          <p>其他应纳税额：<span class="green">12张（122元）</span></p>
          <p>企业所得税应纳税额：<span class="green">12张（122元）</span></p>
          <p class="last-moon">较上月：+3%</p>
        </div> -->
        <div class="deving">敬请期待</div>
      </div>
    </div>
    <div class="tasks">
      <div class="tasks-l">
        <div class="tasks-head">待办任务<span>共10条</span></div>
        <FormList
          :columns="columns"
          :api="api"
          :firstLoading="false"
          ref="list"
          :showSearch="false"
          pageLayout="total, prev, pager, next"
          class="home-form-list"
          :border="false"
          :pageSize="3"
        >
          <template #hzqrxxztDm="{ data }">
            {{ mod[data.hzqrxxztDm] || '-' }}
          </template>
          <template #lrrqq="{ data }"> {{ formatDate('yyyy-MM-DD hh:mm:ss', data.lrrqq) }} </template>
          <template #myscope="{ data }">
            <el-button @click="handleClick(data)" type="text" size="small">立即处理</el-button>
          </template>
        </FormList>
      </div>
      <div class="tasks-r" v-loading="shortcutLoading">
        <div class="tasks-head shortcut-head">
          快捷入口
          <el-button class="shortcut-manage" type="text" size="small" @click="handleManage">管理</el-button>
        </div>
        <div class="shortcut-list tasks-border">
          <template v-if="shortcutMenus === null">
            <div class="no-set-shortcut">
              <p>暂无数据</p>
            </div>
          </template>
          <template v-else>
            <template v-if="shortcutMenus && shortcutMenus.length > 0">
              <div class="li" v-for="item in shortcutMenus" :key="item.menuId" @click="gotoRouteHandle(item.menuId)">
                <!-- <p>
                  <svg class="li-icon icon-svg aui-sidebar__menu-icon" aria-hidden="true">
                    <use :xlink:href="`#${item.icon}`"></use>
                  </svg>
                </p> -->
                <p>{{ item.name }}</p>
                <i class="el-icon-arrow-right el-icon--right"></i>
              </div>
            </template>
            <div class="no-set-shortcut" v-else>
              <p>您当前暂未设置快捷入口</p>
              <el-button class="shortcut-manage" type="text" size="big" @click="handleManage">去设置</el-button>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="echart">
      <div class="echart-l">
        <div class="echart-search">
          <el-radio-group v-model="echartForm.type" @change="handleRadio">
            <el-radio-button :label="1">发票数据分析</el-radio-button>
            <el-radio-button :label="2">计税数据分析</el-radio-button>
          </el-radio-group>

          <el-radio-group v-model="echartForm.month">
            <el-radio-button :label="3">近3个月</el-radio-button>
            <el-radio-button :label="6">近6个月</el-radio-button>
            <el-radio-button :label="12">近12个月</el-radio-button>
          </el-radio-group>
        </div>
        <div id="echart-col"></div>
      </div>
      <div class="echart-r">
        <p class="echart-mo">{{ ringMonth }}</p>
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
            <p v-for="o in selectMenus" :key="o.menuId" class="item">
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
import { getInvoiceData, getListByUser, getQueryMenu, saveMenu, getEchartData } from './Api';
import moment from 'moment';
import FormList from '@/components/FormList.vue';
export default {
  name: 'home',
  components: {
    FormList,
  },
  data() {
    const defalutM = 12; // 默认查询进12个月的数据
    const initX = [
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
    ];
    return {
      api: require('./Api'),
      mod: {
        '03': '销项待确认红字申请单',
        '02': '进项待确认红字申请单',
      },
      // 区域
      regionOptions: [
        { value: '1', label: '华北区' },
        { value: '2', label: '华南区' },
        { value: '3', label: '华中区' },
      ],
      // 纳税主体
      taxpayerOptions: [],
      columns: [
        { title: '序号', type: 'index', width: 70, align: 'center' },
        { title: '待办编号', dataIndex: 'id', align: 'center' },
        { title: '待办模块', dataIndex: 'hzqrxxztDm', slot: 'hzqrxxztDm', align: 'center' },
        { title: '开票人', dataIndex: 'kpr', align: 'center' },
        { title: '提交时间', dataIndex: 'lrrqq', align: 'center', slot: 'lrrqq', width: 140, showTooltip: true },
        {
          title: '操作',
          key: 'action',
          width: 80,
          scopedSlots: { customRender: 'action' },
        },
      ],
      tableData: [],
      form: {
        // region: '1', // 选中的区域值
        nsrsbh: null, // 选中的纳税主体值
        ssq: moment(new Date()).format('yyyy-MM'), // 选中的时间
      },
      echartForm: {
        type: 1, // 1 发票数据分析 , 2 计税数据分析
        month: defalutM, // 近3月，近6月，近12月
      },
      xMonth: defalutM - 1, // 点击柱状的索引值。默认展示最后一个月的数据
      ringMonth: initX[defalutM - 1], // 环状图查询的日期
      filterText: '', // 快捷入口过滤关键词
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      xAxisData: initX, // 柱状图x轴底部日期数据
      seriesData: [
        // 柱状图
        [320, 332, 301, 334, 390, 330, 320, 311, 324, 490, 130, 620], // 蓝字发票金额
        [120, 132, 101, 134, 90, 230, 210, 141, 234, 190, 130, 230], // 蓝字发票税额
        [220, 182, 191, 234, 290, 330, 310, 181, 214, 240, 310, 340], // 红字发票金额
        [150, 232, 201, 154, 190, 330, 410, 231, 164, 200, 360, 440], // 红字发票税额
      ],
      dialogVisible: false,
      treeKeys: [],
      selectMenus: [],
      shortcutMenus: null, // 初始化null，接口返回数据后是数组，如下。
      // shortcutMenus: [
      // {
      //   menuId: '1744884803519438849',
      //   name: '蓝字发票开具',
      //   url: 'outputInvoice/blueInvoice/Index',
      // },
      // ],
      menuList: [],
      // 发票数据
      fpsj: {
        hzfpkjje: '-', // 红字发票金额
        hzpp: '-', // 红字普通票
        hzppje: '-', // 红字普通票金额
        hzzp: '-', // 红字专票
        hzzpje: '-', // 红字专票金额
        hzfpkjzs: '-', // 红字发票开具张数
        hzppbl: '-', // 红字交上月比例
        lzfpkjje: '-', // 蓝字发票金额
        lzpp: '-', // 蓝字普通票
        lzppje: '-', // 蓝字普通票金额
        lzzp: '-', // 蓝字专票
        lzzpje: '-', // 蓝字专票金额
        lzfpkjzs: '-', // 蓝字发票开具张数
        lzppbl: '-', // 蓝字交上月比例
      },
      saveLoading: false,
      shortcutLoading: false,
      loading: false,
      // 待办分页参数
      pageInfo: {
        pageSize: 3,
        pageNo: 1,
        totalPages: 1,
      },
    };
  },
  mounted() {
    this.getList(); // 获取纳税主体 ， 开票数据，涉税数据
    this.geApplyList(); // 获取待办事项
    this.getShortcutList();
    this.initEchart();
    this.initEchartRing();
    this.initTree();
  },
  methods: {
    // 数据初始化
    initData() {
      this.getInvoice();
    },
    // 获取快捷入口
    async getShortcutList() {
      try {
        this.shortcutLoading = true;
        const { data } = await getQueryMenu();
        this.shortcutMenus = data;
      } catch (error) {
        // console.log('-error-', error);
        this.$message.error(error.msg || '获取快捷入口失败');
      } finally {
        this.shortcutLoading = false;
      }
    },
    // 获取纳税人主体
    async getList() {
      try {
        const { data } = await getListByUser({});
        if (data.length) {
          this.taxpayerOptions = data;
          this.$set(this.form, 'nsrsbh', data[0].nsrsbh);
          this.getInvoice();
        }
      } catch (error) {
        console.log('-error-', error);
        this.$message.error(error.msg || '获取纳税人主体失败');
      }
    },
    // 获取发票数据
    async getInvoice() {
      try {
        const { nsrsbh, ssq } = this.form;
        this.loading = true;
        const { data } = await getInvoiceData({ nsrsbh, ssq });
        // console.log('--data--', data);
        this.fpsj = data;
      } catch (error) {
        // console.log('-error-', error);
        this.$message.error(error.msg || '获取发票数据失败');
      } finally {
        this.loading = false;
      }
    },
    // 获取待办列表
    async geApplyList() {
      this.$refs.list && this.$refs.list.reload();
    },
    // 获取柱状图数据
    // async getEchartData(){
    //   try {
        
    //     const {data} = await getEchartData(echartForm);

    //   } catch (error) {
        
    //   }
    // },
    // 初始化柱状图
    initEchart() {
      const _this = this;
      let chartDom = document.getElementById('echart-col');
      if (!chartDom) return;
      this.barChart && this.barChart.dispose();
      this.barChart = echarts.init(chartDom);
      let option;

      option = {
        // https://echarts.apache.org/zh/option.html#color 默认色
        color: ['#5470c6', '#91cc75', '#ee6666', '#fac858'],
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
            data: this.xAxisData,
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

      option && this.barChart.setOption(option);
      this.barChart.on('click', function (params) {
        console.log('--params--', params);
        if (_this.xMonth !== params.dataIndex) {
          _this.xMonth = params.dataIndex;
          _this.ringMonth = params.name;
          _this.initEchartRing();
        }
      });
    },
    // 初始化环状图
    initEchartRing() {
      const { type } = this.echartForm;
      const { xMonth, seriesData } = this;
      let chartDom = document.getElementById('echart-ring');
      if (!chartDom) return;
      this.ringChart && this.ringChart.dispose();
      this.ringChart = echarts.init(chartDom);
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
        color: ['#5470c6', '#ee6666'],
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
            labelLayout: (params) => {
              const isLeft = params.labelRect.x < this.ringChart.getWidth() / 2;
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

      option && this.ringChart.setOption(option);
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
      if (this.shortcutMenus && this.shortcutMenus.length) {
        let keys = [];
        let ms = [];
        this.shortcutMenus.forEach((item) => {
          keys.push(item.menuId);
          ms.push({ ...item });
        });
        this.treeKeys = keys;
        this.selectMenus = ms;
      }
    },
    // 快捷入口弹窗选中取消事件
    treeChange(data) {
      // console.log(data);
      const { selectMenus } = this;
      let newMenus = selectMenus.find((item) => data.id === item.menuId);
      if (newMenus) {
        this.selectMenus = selectMenus.filter((item) => item.menuId !== data.id);
      } else {
        if (selectMenus.length >= 6) {
          this.$message.error('最多可设置6个快捷入口');
          this.$refs.tree.setCheckedKeys(selectMenus.map((item) => item.menuId));
          return;
        }
        this.selectMenus = [...selectMenus, { menuId: data.id, name: data.name, icon: data.icon, url: data.url }];
      }
    },
    // 快捷入口跳转
    gotoRouteHandle(menuId) {
      // console.log('---menuId---', menuId);
      console.log(this.shortcutMenus)
      var route = this.shortcutMenus.filter((item) => item.menuId === menuId)[0];
      // var route = window.SITE_CONFIG['dynamicMenuRoutes'].filter((item) => item.meta.menuId === menuId)[0];
      if (route) {
        this.$router.push(route.url);
      }
    },
    // 选择月份、选择主体 刷新数据
    refreshData() {
      this.$nextTick(() => {
        this.initData();
      });
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
      try {
        this.saveLoading = true;
        const res = await saveMenu({userMenuList: this.selectMenus});
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
      this.$router.push({
        path: "/redInvoice/redInfoConfirm",
        query: {
          ...this.$route.query,
          id: row.id,
          level: 'input',
          isFormTodoList: 'Y',
          operateType: 'waitConfirm'
        }
      });
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
    // border: 1px solid #e9e9e9;
    border-radius: 8px;
    padding: 15px;
    position: relative;
    margin-right: 20px;
    color: #fff;
    transition: all 0.3s cubic-bezier(0.39, 0.575, 0.565, 1);
    &:last-child {
      margin-right: 0;
    }
    &:hover {
      background-color: #e9e9e9;
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
      font-weight: bold;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      .iconfont {
        font-size: 18px;
        margin-right: 10px;
      }
    }
    .money {
      font-size: 20px;
      // color: #333;
      text-align: center;
      line-height: 50px;
      font-weight: bold;
      span {
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
  .invoice-bg1 {
    // .title {
      background-image: linear-gradient(to right, #4898d8, #3bc4ec);
    // }
  }
  .invoice-bg2 {
    // .title {
      background-image: linear-gradient(to right, #ff6184, #ff9a96);
    // }
  }
  .invoice-bg3 {
    // .title {
      background-image: linear-gradient(to right, #545e92, #83acce);
    // }
  }
  .invoice-bg4 {
    // .title {
      background-image: linear-gradient(to right, #00baf2, #08c49b);
    // }
  }
  .subtitle {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    > p {
      margin-bottom: 5px;
      // color: #666;
    }
  }
  .last-moon {
    font-weight: 700;
    font-size: 14px;
    // color: #666;
    text-align: right;
  }
  .blue {
    // color: #7ea6ff !important;
    font-weight: bold;
  }
  .red {
    // color: #fe5363 !important;
    font-weight: bold;
  }
  .darkBlue {
    // color: #000080 !important;
    font-weight: bold;
  }
  .green {
    // color: #008080 !important;
    font-weight: bold;
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
    width: 288px;
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
    overflow: hidden;
    .li {
      width: 100%;
      padding: 0 15px;
      line-height: 33px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s cubic-bezier(0.39, 0.575, 0.565, 1);
      &:hover {
        cursor: pointer;
        background-color: #ecf5ff;
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
.home-form-list {
  border: 1px solid #e9e9e9;
  padding-top: 0;
  border-top: none;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  /deep/ .el-table__body-wrapper {
    height: 110px;
    min-height: initial !important;
  }
  /deep/ .el-table__empty-text {
    line-height: 14px;
  }
  /deep/ .pagination {
    margin-top: 0;
  }
  /deep/ .el-pagination {
    margin: 8px auto;
  }
}
.no-set-shortcut {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > p {
    color: #999;
  }
}
.deving {
  text-align: center;
  line-height: 100px;
}
</style>
