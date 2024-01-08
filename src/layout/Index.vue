<template>
    <el-container class="layout">
        <el-aside :width="sideWidth">
            <Sidebar />
        </el-aside>
        <el-container class="main">
            <el-header class="header">
                <Header />
            </el-header>
            <el-main class="contentTab">
                <Tab />
                <Main />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import Header from './component/Header.vue'
import Sidebar from './component/Sidebar.vue'
import Main from './component/Main.vue'
import Tab from './component/Tab.vue'

import variables from '@/styles/variables.scss'
import water from '@/utils/water'
import { dateFormat } from '@/utils/tool'

export default {
    components: {
        Header,
        Sidebar,
        Main,
        Tab
    },
    data() {
        return {
            menus: null,
        }
    },
    computed: {
        useWater() {
            return this.$store.state.app.useWater
        },
        collapsed() {
            return this.$store.state.app.collapsed
        },
        sideWidth() {
            return this.collapsed ? '64px' : variables.sideBarWidth
        },
        username() {
            return this.$store.state.user.user && this.$store.state.user.user.userName
        },
    },
    watch: {
        username() {
            this.showWater();
        },
        useWater(n) {
            if (n) {
                this.showWater();
            }
            else {
                this.hideWater();
            }
        }
    },
    mounted () {
        this.showWater();
    },
    methods: {
        showWater() {
            if (this.useWater && this.username) {
                const wtObj = document.getElementById("waterMark");
                if (wtObj == undefined || wtObj == null) {
                    const date = dateFormat('YYYY-mm-dd HH:MM:SS');
                    water.watermark({
                        watermark_contents: [`美的置业 ${this.username} ${date}`]
                    })
                }
            }
        },
        hideWater() {
            document.getElementById("waterMark").remove();
        }
    },
};
</script>

<style lang='scss' scoped>
@import '@/styles/variables.scss';

.layout {
    width: 100%;
    height: 100%;
}
.main {
    overflow: hidden;
}
.header {
    background-color: #FFFFFF;
    padding: 0 14px;
    height: $headerHeight !important;
    max-height: $headerHeight !important;
    line-height: $headerHeight !important;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.content {
    background-color: #F5F5F5;
    height: 100%;
}
.contentTab {
    background-color: #F5F5F5;
    height: 100%;
    overflow: hidden;
}
.ant-tabs-tabpane {
    padding: 4px 8px;
}
</style>