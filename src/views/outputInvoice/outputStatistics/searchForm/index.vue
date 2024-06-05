<template>
    <div class="">
        <el-card shadow="never">
            <el-form ref="form" :model="searchForm" label-width="80px">
                <el-row :gutter="10">
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
                        <el-form-item label="" label-width="0px">
                            <el-radio-group v-model="searchForm.radio1">
                            <el-radio-button label="自定义"></el-radio-button>
                            <el-radio-button label="本月"></el-radio-button>
                            <el-radio-button label="上月"></el-radio-button>
                            <el-radio-button label="本季度"></el-radio-button>
                            <el-radio-button label="上季度"></el-radio-button>
                            <el-radio-button label="本年"></el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="" label-width="0px">
                            <el-radio-group v-model="searchForm.radio1">
                            <el-radio-button label="自定义"></el-radio-button>
                            <el-radio-button label="本月"></el-radio-button>
                            <el-radio-button label="上月"></el-radio-button>
                            <el-radio-button label="本季度"></el-radio-button>
                            <el-radio-button label="上季度"></el-radio-button>
                            <el-radio-button label="本年"></el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="" label-width="0px">
                            <el-radio-group v-model="searchForm.radio1">
                            <el-radio-button label="自定义"></el-radio-button>
                            <el-radio-button label="本月"></el-radio-button>
                            <el-radio-button label="上月"></el-radio-button>
                            <el-radio-button label="本季度"></el-radio-button>
                            <el-radio-button label="上季度"></el-radio-button>
                            <el-radio-button label="本年"></el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                
            </el-form>
        </el-card>
    </div>
</template>

<script>

export default {
    name:'outputStatisticsSearchFormPage',
    components: {},
    props: {},
    data() {
        return {
            searchForm:{}
        };
    },
    computed: {},
    watch: {},
    methods: {},
    created() {},
    mounted() {},
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

</style>