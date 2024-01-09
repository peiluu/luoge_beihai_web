<template>
    <div class="main-content">
        <div class="cacl-card">
            <template v-for="card in cardItems">
                <CardItem
                        :route="card.route"
                        :key="card.title"
                        :title="card.title"
                        :total="card.total"
                        :icon="card.icon"
                ></CardItem>
            </template>
        </div>

        <div class="custom-content" style="height: 100%;margin:0;padding-bottom: 80px;overflow: hidden;">
            <div class="mid-margin-15">
                <div class="custom-content-title-text">企业报送情况</div>
            </div>
            <el-divider></el-divider>
            <div >
                <div id="main_0" :style="chartStyle"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as echarts from 'echarts'
    import CardItem from '../CardItem.vue';
    export default {
        name: "Obligor",
        components: {
            CardItem
        },
        data() {
            return {
                business: require('@/utils/business'),
                cardItems: [],
            };
        },
        methods: {
            initChart(){
                let that = this;
                that.business.customPost(
                    that.request_host + "/Index/statTaxpayer",
                    {'Content-Type': 'application/json; charset=utf-8'},
                    {},
                    res => {
                        that.cardItems = [
                            {title:"企业总数" ,total: res.data.totalCount || 0, icon: require('@/assets/ptc/kjywr1.png'),route:{path: '/obligorManage/index', query: {reset:1}}},
                            {title:"报送成功企业数" ,total: res.data.successCount || 0, icon: require('@/assets/ptc/kjywr2.png'),route:{path: '/obligorManage/index', query: {reset:1,tbzt:1}}},
                            {title:"报送失败企业数" ,total: res.data.failCount || 0, icon: require('@/assets/ptc/kjywr3.png'),route:{path: '/obligorManage/index', query: {reset:1,tbzt:2}}},
                            {title:"自动零申报企业数" ,total: res.data.lsbCount || 0, icon: require('@/assets/ptc/kjywr4.png'),route:{path: '/obligorManage/index', query: {reset:1,zdlsb:1}}},
                        ]
                        that.setChartOptions(res.data);
                    });
            },
            setChartOptions(data){
                var myChart = echarts.init(document.getElementById('main_0'));
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
                            return params.name + ":" + params.data.value
                        }
                    },
                    color: ['#FFD800','#409EFF','#65DFE0'],
                    series: [
                        {
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '50%'],
                            data: [
                                { value: data.successCount || 0, name: '报送成功企业数'},
                                { value: data.failCount || 0, name: '报送失败企业数'},
                                { value: data.waitCount || 0, name: '待报送企业数'}
                            ],
                         //   roseType: 'radius',
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
                let height = window.innerHeight - 440;
                return "width:100%; height: " + height + "px;"
            },
            request_host() {
                return this.$store.state.app.host
            },
        },
        mounted() {
            this.initChart();
        },
    };
</script>
<style lang="scss" scoped>
    ::v-deep .card-item{
        width: 25% !important;
    }
</style>
