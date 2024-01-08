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
            <el-table stripe border :header-cell-class-name="'main-table-header-cell'" :data="tableData" v-loading="loading" :span-method="spanMethod"
                      :summary-method="getSummaries" show-summary>
                <el-table-column align="left" prop="name" label="所得项目" min-width="150"></el-table-column>
                <!--<el-table-column label="内部员工" align="center" style="width: 0px;">
                    <el-table-column min-width="100" align="right" prop="nbygzs" label="已报送人数"></el-table-column>
                    <el-table-column min-width="100" align="right" prop="nbssrs" label="已算税人次"></el-table-column>
                    <el-table-column min-width="100" align="right" prop="nbqrrs" label="已确认人次"></el-table-column>
                    <el-table-column min-width="100" align="right" prop="nbsr" label="收入总额" :formatter="numberFmt"></el-table-column>
                    <el-table-column min-width="120" align="right" prop="yjsknb" label="应缴税款总额" :formatter="numberFmt"></el-table-column>
                </el-table-column>-->
                <el-table-column label="外部员工" align="center">
                    <el-table-column min-width="100" align="right" prop="wbygzs" label="已报送人数"></el-table-column>
                    <el-table-column min-width="100" align="right" prop="wbssrs" label="已算税人次"></el-table-column>
                    <el-table-column min-width="100" align="right" prop="wbqrrs" label="已确认人次"></el-table-column>
                    <el-table-column min-width="100" align="right" prop="wbsr" label="收入总额" :formatter="numberFmt"></el-table-column>
                    <el-table-column min-width="120" align="right" prop="yjskwb" label="应缴税款总额" :formatter="numberFmt"></el-table-column>
                </el-table-column>
                <el-table-column align="right" prop="opt" label="操作" fixed="right" min-width="160">
                <template #default="myscope">
                    <el-button plain type="primary" @click="handleWrite(myscope.row)">填写</el-button>
                    <!--<el-button plain type="primary" @click="handleCaltax(myscope.row)">提交算税</el-button>-->
                    <!--<el-button plain type="primary" @click="handleConfirm(myscope.row)">算税确认</el-button>-->
                    <el-button plain type="danger" @click="handleClearData(myscope.row)">清除数据</el-button>
                    <!--<el-button plain type="danger" @click="handleCancel(myscope.row)">取消确认</el-button>-->
                </template>
            </el-table-column>
            </el-table>
        </div>
  </div>
</template>
<script>

export default {
    name: "SalaryInput",
    data() {
      return {
        business:require('@/utils/business'),
        taxPeriod: "",
        obligorDetail: {},
        param: {
          pageSize: 100,
          pageNo: 1,
        },
        title: "综合所得录入",
        collapsed: false,
        tableData: [],
        loading: false,
      };
    },
    methods: {
        handleBack(){
            this.$router.push({path: "/caltaxManage-CaltaxList"})
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
            that.loading = true;
            if(!this.$store.state.user.taxPeriod){
                this.business.lastMonth(data => {
                    this.$store.state.user.payPeriod = this.payPeriod
                    that.business.customPost(that.request_host+"/ComprehensiveIncome/getIncomeTypeList/"+this.$store.state.user.taxPeriod,
                        {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                        JSON.stringify({"kjywrid": id}),
                        res => {
                            that.tableData = res.data;
                            that.loading = false;
                        }
                    );
                })
            }else {
                that.business.customPost(that.request_host+"/ComprehensiveIncome/getIncomeTypeList/"+this.$store.state.user.taxPeriod,
                    {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                    JSON.stringify({"kjywrid": id}),
                    res => {
                        that.tableData = res.data;
                        that.loading = false;
                    }
                );
            }
        },
        getSummaries(param){
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                if(column.property=='opt'){
                    sums[index] = '';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            if(index==4 || index==5 ||index==9||index==10){
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
        //填写
        handleWrite(row){
            this.$router.push({path: "/caltaxManage/salaryItemInput", query:{rowid: this.kjywrid, type: row.type}})
        },
        //提交算税
        handleCaltax(row){
            let that = this;
            that.loading = true;
            that.business.customPost(that.request_host+"/ComprehensiveIncome/calculationTaxOneType",
                {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                JSON.stringify({"kjywrid": that.kjywrid, gztype: row.type}),
                res => {
                    if(res.code==0){
                        if(res.data.code==1){
                            that.$message.error(res.data.msg);
                        }else {
                            that.$message({message:res.data.msg,type: 'success' });
                        }
                        that.fetchTableData(that.kjywrid)
                    }else {
                        that.$message.error(res.data.msg);
                    }
                    that.loading = false;
                }
            );
        },
        handleConfirm(row){
            let that = this;
            that.loading = true;
            that.business.customPost(that.request_host+"/ComprehensiveIncome/calculationTaxOneTypeConfirm",
                {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                JSON.stringify({"kjywrid": that.kjywrid, gztype: row.type}),
                res => {
                    if(res.code==0){
                        if(res.data.code==1){
                            that.$message.error(res.data.msg);
                        }else {
                            that.$message({
                                message: res.data.msg,
                                type: 'success',
                            });
                        }
                        that.fetchTableData(that.kjywrid)
                    }else {
                        that.$message.error(res.data.msg);
                    }
                    that.loading = false;
                }
            );
        },
        handleCancel(row){
            let that = this;
            that.loading = true;
            that.business.customPost(that.request_host+"/ComprehensiveIncome/calculationTaxOneTypeCancel",
                {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                JSON.stringify({"kjywrid": that.kjywrid, gztype: row.type}),
                res => {
                    if(res.code==0){
                        if(res.data.code==1){
                            that.$message.error(res.data.msg);
                        }else {
                            that.$message({
                                message: res.data.msg,
                                type: 'success',
                            });
                        }
                        that.fetchTableData(that.kjywrid)
                    }else {
                        that.$message.error(res.data.msg);
                    }
                    that.loading = false;
                }
            );
        },
        //清除数据
        handleClearData(row){
            let that = this;
            this.$confirm(`您确定要清除数据吗？`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.business.customPost(that.request_host+"/ComprehensiveIncome/cleanCalculationTax/"+that.$store.state.user.taxPeriod,
                    {'Content-Type': 'application/json; charset=utf-8',"Data-Type":"json"},
                    JSON.stringify({"kjywrid": that.kjywrid, gztype: row.type}),
                    res => {
                        if(res.code==0){
                            if(res.data.code==1){
                                that.$message.error(res.data.msg);
                            }else {
                                that.$message({
                                    message: res.data.msg,
                                    type: 'success',
                                });
                            }
                            that.fetchTableData(that.kjywrid)
                        }else {
                            that.$message.error(res.data.msg);
                        }
                    }
                );
            });
        },
        spanMethod({ row, column, rowIndex, columnIndex }) {
            /*if (columnIndex === 1 || columnIndex === 6) {*/
            if (columnIndex === 1) {
                if (rowIndex % 6 === 0) {
                    return {
                        rowspan: 6,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        }
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
