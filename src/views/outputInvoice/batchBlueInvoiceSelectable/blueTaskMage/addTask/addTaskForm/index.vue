<template>
    <div class="">
        <el-card shadow=""hover>
            <el-form ref="form" :model="taskForm" label-width="80px">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="购方名称">
                            <el-input v-model="taskForm.gmfmc"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="时间">
                            <el-date-picker
                            v-model="taskForm.lssj"
                            type="datetimerange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="6">
                        <el-form-item label="状态">
                            <el-input v-model="taskForm.name"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="6">
                        <el-form-item label="" label-width="0">
                            <article class="searchBth">
                                <article >
                                        <el-button type="primary" size="mini" @click="handleSearch">查 询</el-button>
                                        <el-button @click="handleRest">重 置</el-button>
                                </article>
                                <article style="text-align: center;">
                                       <slot name="btnBef"></slot>
                                </article>
                            </article>
                       
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
    </div>
</template>

<script>

export default {
    name:'addTaskFormPage',
    components: {},
    props: {},
    data() {
        return {
            taskForm:{}
        };
    },
    computed: {},
    watch: {},
    methods: {

        /* 搜索 */
        handleSearch(){
            this.$emit('handleDoneSearch',this.taskForm)
        },
        /* 重置 */
        handleRest(){
            this.taskForm = {};
            this.$emit('handleDoneSearch',this.taskForm)
        }
    },
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
.searchBth{
    display: flex;
    align-items: center;
    justify-content: center;
}
::v-deep  .el-card__body{
    padding: 15px !important;
    padding-bottom: 0 !important;
  }
</style>