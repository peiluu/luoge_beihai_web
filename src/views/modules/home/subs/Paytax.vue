<template>
    <div class="main-content">
        <div class="cacl-card">
            <template v-for="card in cardItems">
                <CardItem
                        @setPeriod="setPeriod"
                        :route="card.route"
                        :key="card.title"
                        :title="card.title"
                        :total="card.total"
                        :icon="card.icon"
                ></CardItem>
            </template>
        </div>

        <div class="custom-content" style="height: 100%;margin:0;padding: 15px 0;overflow: hidden;">
            <div class="mid-margin-15" style="display: flex;font-size:14px;">
                <div style="width: 50%; text-align: left;margin-top: 5px;">员工缴税情况</div>
                <div style="width: 50%; text-align: right;margin-right: 10px;">税款属期：
                    <el-date-picker
                            size="small"
                            @change="initChart"
                            :clearable="false"
                            v-model="reportPeriod"
                            type="month"
                            value-format="yyyyMM"
                            placeholder="选择税款属期">
                    </el-date-picker>
                </div>
            </div>
            <el-divider></el-divider>
            <div id="main_4" :style="chartStyle"></div>
        </div>
    </div>
</template>

<script>
    import {Calc} from '@/utils/calc'
    import * as echarts from 'echarts'
    import CardItem from '../CardItem.vue';
    export default {
        name: "Paytax",
        components: {
            CardItem
        },
        data() {
            return {
                business: require('@/utils/business'),
                cardItems: [],
                reportPeriod: ""
            };
        },
        methods: {
            setPeriod(){
                this.$store.state.user.payPeriod = this.reportPeriod
            },
            initChart(){
                let that = this;
                that.business.customPost(
                    that.request_host + "/Index/statPaytax/"+that.reportPeriod,
                    {'Content-Type': 'application/json; charset=utf-8'},
                    {},
                    res => {
                        that.cardItems = [
                            {title:"企业总数" ,total: res.data.totalCount || 0, icon: require('@/assets/ptc/bsss1.png'),route:{path: '/paytaxManage/index',query: {reset:1}}},
                            {title:"已缴税成功企业数" ,total: res.data.successCount || 0, icon: require('@/assets/ptc/bsss2.png'),route:{path: '/paytaxManage/index',query: {reset:1}}},
                            {title:"未缴税成功企业数" ,total: (res.data.totalCount || 0) - (res.data.successCount || 0), icon: require('@/assets/ptc/bsss3.png'),route:{path: '/paytaxManage/index',query: {reset:1}}}
                        ]
                        that.setChartOptions(res.data);
                    });
            },
            setChartOptions(data){
                var myChart = echarts.init(document.getElementById('main_4'));
                myChart.setOption({
                    title: {
                        left: 'center',
                    },
                    legend: {
                        top: 'bottom'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    label: {
                        formatter: params =>{
                            return params.name + ":" + params.value
                        }
                    },
                    color: ['#FFD800','#409EFF'],
                    series: [
                        {
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '50%'],
                            data: [
                                { value: data.successCount || 0, name: '已缴税成功企业数'},
                                { value: (data.totalCount || 0) - (data.successCount || 0), name: '未缴税成功企业数'}
                            ],
                            animationType: 'scale',
                            animationEasing: 'elasticOut',
                            animationDelay: function (idx) {
                                return Math.random() * 200;
                            }
                        }
                    ]
                })
            },
        },
        computed: {
            chartStyle(){
                let height = window.innerHeight - 390;
                return "width:100%; height: " + height + "px;"
            },
            request_host() {
                return this.$store.state.app.host
            },
        },
        mounted() {
            this.business.lastMonth(data => {
                this.reportPeriod = data.data.sy;
                this.initChart();
            })
        },
    };
</script>
