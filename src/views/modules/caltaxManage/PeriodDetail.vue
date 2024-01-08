<template>
    <div class="custom-content">
        <div style="display: flex;">
            <div class="mid-margin-40 custom-content-title" style="width: 100%;">
                <div class="custom-content-title-text">{{obligorDetail.qymc}}</div>
                <div class="custom-content-title-date">{{taxPeriod.substring(0,4)+'年'+taxPeriod.substring(4,6)+'月'}}</div>
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
                <el-table-column label="内部员工" align="center">
                    <el-table-column min-width="80" align="right" prop="bsrsnb" label="报送人次"></el-table-column>
                    <el-table-column min-width="80" align="right" prop="ssrsnb" label="算税人次"></el-table-column>
                    <el-table-column min-width="80" align="right" prop="srzenb" label="收入总额" :formatter="numberFmt"></el-table-column>
                    <el-table-column min-width="160" align="right" prop="yjsknb" label="应缴税款总额" :formatter="numberFmt"></el-table-column>
                </el-table-column>
                <el-table-column label="统计" align="center">
                    <el-table-column min-width="80" align="right" prop="bsrswb" label="报送人次"></el-table-column>
                    <el-table-column min-width="80" align="right" prop="ssrswb" label="算税人次"></el-table-column>
                    <el-table-column min-width="80" align="right" prop="srzewb" label="收入总额" :formatter="numberFmt"></el-table-column>
                    <el-table-column min-width="160" align="right" prop="yjskwb" label="应缴税款总额" :formatter="numberFmt"></el-table-column>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    export default {
        name: "PeriodDetail",
        data() {
            return {
                business:require('@/utils/business'),
                param: {
                    pageSize: 100,
                    pageNo: 1,
                },
                taxPeriod: "",
                obligorDetail: {},
                tableData: []
            };
        },
        methods: {
            handleBack(){
                this.$router.push({path: "/caltaxManage/index"})
            },
            fetchObligorDetail(id){
                let that = this;
                that.business.customPost(that.request_host+"/Taxpayer/detail",
                    {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                    JSON.stringify({"id": id}),
                    res => {
                        that.obligorDetail = res.data
                    }
                );
            },
            fetchTableData(id){
                let that = this;
                that.business.customPost(that.request_host+"/ComprehensiveIncome/getIncomeDetail/"+this.$store.state.user.taxPeriod,
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
                                if(index==4 || index==8 || index==3 || index==7){
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
        activated() {
            if(!this.$store.state.user.taxPeriod){
                this.business.lastMonth(data => {
                    this.taxPeriod = data.data.sy;
                    this.$store.state.user.taxPeriod = this.taxPeriod
                })
            }else {
                this.taxPeriod = this.$store.state.user.taxPeriod;
            }
            if(this.kjywrid){
                this.fetchObligorDetail(this.kjywrid);
                this.fetchTableData(this.kjywrid);
            }
        },
        computed: {
            request_host() {
                return this.$store.state.app.host
            },
            kjywrid(){
                return this.$route.query.rowid;
            }
        }
    };
</script>
