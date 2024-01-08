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
                <div class="custom-content-title-text">企业人员维护情况</div>
            </div>
            <el-divider></el-divider>
            <div id="main_1_1" :style="chartStyle"></div>
           <!-- <div class="custom-content" style="width:50%;height: 100%;margin:0;margin-left: 0.5%;padding-bottom: 80px;">
                <div class="mid-margin-15">
                    <div class="custom-content-title-text">报送人员情况</div>
                </div>
                <el-divider></el-divider>
                <div id="main_1_2" :style="chartStyle"></div>
            </div>-->
        </div>
    </div>
</template>

<script>
    import * as echarts from 'echarts'
    import CardItem from '../CardItem.vue';
    export default {
        name: "Employee",
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
                    that.request_host + "/Index/statEmployees",
                    {'Content-Type': 'application/json; charset=utf-8'},
                    {},
                    res => {
                    that.cardItems = [
                        {title:"人员总数" ,total: res.data.totalCount || 0, icon: require('@/assets/ptc/yggl1.png'),route:{path: '/employeeManage/index',query: {reset:1}}},
                        {title:"已同步局端人数" ,total: res.data.successCount || 0, icon: require('@/assets/ptc/yggl2.png'),route:{path: '/employeeManage/index',query: {reset:1}}},
                        {title:"未同步局端人数" ,total: res.data.failCount || 0, icon: require('@/assets/ptc/yggl3.png'),route:{path: '/employeeManage/index',query: {reset:1}}}
                    ]
                    that.setChartOptions(res.data);
                });
            },
            setChartOptions(data){
                var myChart = echarts.init(document.getElementById('main_1_1'));
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
                                { value: data.successCount || 0, name: '已同步局端人数'},
                                { value: data.failCount || 0, name: '未同步局端人数'}
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
        width: 33.3% !important;
    }
</style>
