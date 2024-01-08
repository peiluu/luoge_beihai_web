<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="tab in tabs" :label="tab.label" :name="tab.name" :key="tab.name" :lazy="true">
            <TabContent :tabName="tab.name"></TabContent>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
    import TabContent from './TabContent.vue'
    export default {
        components: {TabContent},
        props:{
          tabs: Array,
        },
        data() {
            return{
                activeName: "Obligor",
            }
        },
        methods: {
            handleClick(tab, event) {
                this.activeName = tab._props.name;
            }
        }
    };
</script>

<style lang="scss" scoped>
    ::v-deep .el-tabs__nav-wrap{
        padding-left: 20px;
        border-radius: 10px;
        height: 50px;
        line-height: 50px;
    }
</style>