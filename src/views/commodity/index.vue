<template>
    <div class="">
       <article class="commodity_main">
            <el-row :gutter="12">
                <el-col :span="6">
                    <el-card shadow="never">
                    从不显示
                    </el-card>
                </el-col>
                <el-col :span="18">
                    <el-card shadow="never">
                    从不显示
                    </el-card>
                </el-col>
            </el-row>   
       </article>
    </div>
</template>

<script>

export default {
    name:'productItemMessagePage',
    components: {},
    data() {
        return {

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
<style scoped lang="scss">
/*@import url(); 引入公共css类*/
.commodity_main{
    padding: 15px;
}
</style>