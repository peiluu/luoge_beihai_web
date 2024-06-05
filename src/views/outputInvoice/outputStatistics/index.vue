<template>
    <div class="">
       <article>
            <!-- 搜索 -->
            <article>
                <lg-search-form></lg-search-form>
            </article>
       </article>
    </div>
</template>

<script>
import lgSearchForm from './searchForm/index.vue'
export default {
    name:'outputStatisticsPage',
    components: {lgSearchForm},
    props: {},
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
<style scoped>
/*@import url(); 引入公共css类*/
::v-deep .el-form-item{
    margin-bottom: 2px;
}
</style>