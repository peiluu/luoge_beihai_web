<template>
    <div class="custom-content">
        <div style="display: flex;">
            <div class="mid-margin-40 custom-content-title" style="width: 100%;">
                <div class="custom-content-title-text">{{obligorDetail.qymc}}</div>
                <div class="custom-content-title-date">{{reportPeriod.substring(0,4)+'年'+reportPeriod.substring(4,6)+'月'}}</div>
            </div>
            <div style="float: right;padding-right: 20px;"><el-button type="primary" icon="el-icon-back" size="small" @click="handleBack">返回</el-button></div>
        </div>
        <div class="caltax-table">
            <el-table
                    stripe
                    border
                    :data="tableData"
                    :header-cell-class-name="'main-table-header-cell'"
                    :summary-method="getSummaries" show-summary>
                <el-table-column min-width="120" align="left" prop="name" label="所得项目"></el-table-column>
               <!-- <el-table-column label="内部员工" align="center">
                    <el-table-column min-width="80" align="right" prop="ssrsnb" label="申报人次"></el-table-column>
                    <el-table-column min-width="160" align="right" prop="srzenb" label="收入总额" :formatter="numberFmt"></el-table-column>
                    <el-table-column min-width="160" align="right" prop="yjsknb" label="应缴税款总额" :formatter="numberFmt"></el-table-column>
                </el-table-column>-->
                <el-table-column label="统计" align="center">
                    <el-table-column min-width="80" align="right" prop="ssrswb" label="申报人次"></el-table-column>
                    <el-table-column min-width="160" align="right" prop="srzewb" label="收入总额" :formatter="numberFmt"></el-table-column>
                    <el-table-column min-width="160" align="right" prop="yjskwb" label="应缴税款总额" :formatter="numberFmt"></el-table-column>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>

    export default {
        name: "ReportDetail",
        data() {
            return {
                business: require('@/utils/business'),
                title: "申报详情",
                reportPeriod: "",
                obligorDetail: {},
                tableData: []
            };
        },
        methods: {
            handleBack(){
                this.$router.push({path: "/reportManage-ReportList"})
            },
            fetchObligorDetail(id){
                let that = this;
                that.business.customPost(that.request_host+"/Taxpayer/detail",
                    {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                    JSON.stringify({"id": id}),
                    res => {
                        if(res.code==0){
                            that.obligorDetail = res.data
                        }
                    }
                );
            },
            fetchDeclareDetail(id){
                let that = this;
                that.business.customPost(that.request_host+"/ComprehensiveIncome/getDeclareDetail/"+this.$store.state.user.reportPeriod,
                    {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                    JSON.stringify({"kjywrid": id}),
                    res => {
                        that.tableData = res.data;
                    }
                );
            },
            getSummaries(param){
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                if(index!=1 && index!=4){
                                    let s = parseFloat(prev) + parseFloat(curr);
                                    return s.toFixed(2);
                                }else {
                                    return '-';
                                }
                            } else {
                                return prev;
                            }
                        }, 0);
                    } else {
                        sums[index] = '-';
                    }
                });
                return sums;
            },
        },
        computed: {
            kjywrid() {
                return this.$route.query.rowid;
            },
            request_host() {
                return this.$store.state.app.host
            },
        },
        activated() {
            if(!this.$store.state.user.reportPeriod){
                this.business.lastMonth(data => {
                    this.reportPeriod = data.data.sy;
                    this.$store.state.user.reportPeriod = this.reportPeriod
                })
            }else {
                this.reportPeriod = this.$store.state.user.reportPeriod;
            }
            if(this.kjywrid){
                this.fetchObligorDetail(this.kjywrid);
                this.fetchDeclareDetail(this.kjywrid);
            }
        },
    };
</script>
