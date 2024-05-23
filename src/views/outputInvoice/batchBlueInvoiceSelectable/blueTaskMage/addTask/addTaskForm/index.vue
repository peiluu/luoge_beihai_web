<template>
    <div class="">
        <el-card shadow=""hover>
            <el-form ref="form" :model="taskForm" label-width="80px">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-form-item label="购方名称">
                            <el-input v-model="taskForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="时间">
                            <el-input v-model="taskForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态">
                            <el-input v-model="taskForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="" label-width="0">
                        <article style="text-align: center;">
                                <el-button type="primary" size="mini">查 询</el-button>
                                <el-button>重 置</el-button>
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