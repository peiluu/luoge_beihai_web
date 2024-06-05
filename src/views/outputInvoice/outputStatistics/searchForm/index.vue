<template>
    <div class="">
        <el-form ref="form"  :model="searchForm" label-width="80px">
        <el-card shadow="never">
         
                <el-row :gutter="10" :align="'middle'">
                    <el-col :span="8">
                        <el-form-item label="活动名称" >
                            <el-date-picker
                                style="width:100%"
                                v-model="searchForm.time"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                                </el-date-picker>
                        </el-form-item>
                        
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="" label-width="2px">
                            <el-radio-group v-model="radio1" style="width: 100%;">
                            <el-radio-button label="自定义"></el-radio-button>
                            <el-radio-button label="本月"></el-radio-button>
                            <el-radio-button label="上月"></el-radio-button>
                            <el-radio-button label="本季度"></el-radio-button>
                            <el-radio-button label="上季度"></el-radio-button>
                            <el-radio-button label="本年"></el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8">
                        <el-form-item label="报表类型" >
                            <el-select v-model="searchForm.type" placeholder="请选择" style="width: 100%;">
                                <el-option
                                v-for="item in typeOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="8">
                        <el-form-item label="发票种类" >
                            <el-select v-model="searchForm.fpzl" placeholder="请选择" style="width: 100%;">
                                <el-option
                                v-for="item in fpzlOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="" label-width="0" style="text-align: right;margin-bottom: 10px;">
                            <el-button type="primary" @click="handleSearch">搜 索</el-button>
                            <el-button @click="handleRest">重 置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                
           
        </el-card>
    </el-form>
    </div>
</template>

<script>

export default {
    name:'outputStatisticsSearchFormPage',
    components: {},
    props: {},
    data() {
        return {
            searchForm:{},
            typeOption:[],
            fpzlOptions:[],
            radio1:null,
        };
    },
    computed: {},
    watch: {},
    methods: {
        /* search */
        handleSearch(){
            this.$emit("handleFormSearch",this.searchForm)
        },

        /* 重置 */
        handleRest(){
            this.searchForm = {};
            this.handleSearch();
        }
    },
    created() {},
    mounted() {
        this.handleSearch();
    },
    beforeCreate() {},
    beforeMount() {},
    beforeUpdate() {},
    updated() {},
    beforeDestroy() {},
    destroyed() {},
    activated() {},
    }
</script>
<style scoped>
/*@import url(); 引入公共css类*/
/* ::v-deep .el-form-item{
    margin-bottom: 12px;
} */
</style>