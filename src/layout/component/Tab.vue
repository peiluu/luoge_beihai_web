<template>
    <el-tabs v-model="activeKey" type="card" @tab-click="onTabClick" closable @tab-remove="onTabEdit">
        <el-tab-pane v-for="pane in panes" :key="pane.key" :name="pane.key" :label="pane.title"></el-tab-pane>
    </el-tabs>
</template>

<script>
import { getUUID } from '@/utils/tool'

export default {
    name: 'Tab',
    data () {
        return {
            activeKey: '',
        }
    },
    computed: {
        panes() {
            return this.$store.state.app.tabs || []
        },
        menus() {
            return this.$store.state.app.menus || []
        },
        notIndex() {
            return this.$route.path !== '/index'
        }
    },
    watch:{
        '$route'(to, from){
            this.addTabItem(to)
        },
        menus(n) {
            if (n && n.length > 0 && this.panes.length === 0) {
                this.addTabItem({
                    path: this.$route.fullPath
                })
            }
        }
    },
    activated () {
        if (this.panes.length === 0) {
            this.addTabItem({
                path: this.$route.fullPath
            })
        }
    },
    methods: {
        addTabItem(to) {
            let flag = false;
            for (let index = 0; index < this.panes.length; index++) {
                const item = this.panes[index];
                if(item.path === to.path){
                    flag = true
                    this.activeKey = item.key
                    break
                }
            }
            if(!flag){
                const res = this.getRouteInfo(to.path)
                if (res) {
                    const obj = {
                        path: res.resourceUrl,
                        title: res.resourceName,
                        params: to.params,
                        query: to.query,
                        name: to.name,
                        key: getUUID(32),
                    }
                    this.$store.dispatch('app/addTab', obj)
                    this.activeKey = obj.key
                }
            }
            this.$store.dispatch('app/saveActiveTab', this.activeKey)
        },
        onTabEdit(key) {
            if (key === this.activeKey) {
                let target = 0
                for (let index = 0; index < this.panes.length; index++) {
                    const item = this.panes[index]
                    if (key === item.key) {
                        target = index > 0 ? index - 1 : 0
                        break
                    }
                }
                const data = this.panes[target]
                this.pushPage(data)
                this.activeKey = data.key
            }
            this.$store.dispatch('app/removeTab', key)
        },
        onTabClick() {
            const key = this.activeKey
            for (let index = 0; index < this.panes.length; index++) {
                const item = this.panes[index];
                if (key === item.key) {
                    this.pushPage(item)
                    break
                }
            }
        },
        pushPage(item) {
            if (item) {
                if (item.params && Object.keys(item.params).length > 0) {
                    this.$router.push({
                        name: item.name,
                        params: item.params
                    })
                }
                else {
                    if (item.query && Object.keys(item.query).length > 0) {
                        this.$router.push({
                            path: item.path,
                            query: item.query
                        })
                    }
                    else {
                        this.$router.push(item.path)
                    }
                }
            }
        },
        getRouteInfo(path, routes) {
            if (!routes) {
                routes = this.menus
            }
            if (path && routes) {
                for (let index = 0; index < routes.length; index++) {
                    const item = routes[index]
                    if (path === item.resourceUrl) {
                        return item
                    }
                    if (item.subResources && item.subResources.length > 0) {
                        const res = this.getRouteInfo(path, item.subResources)
                        if (res) {
                            return res
                        }
                    }
                }
            }
            return null        
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

::v-deep.ant-tabs-bar {
    margin-bottom: 0 !important;
}
.tabs {
    // background-color: #FFFFFF;
    border-top: 1px solid #F5F5F5;
}
.container {
    height: $containerHeight;
    overflow: auto;
    padding: $containerPadding;
    background-color: #F5F5F5;
}
.containerBg {
    background-color: #FFFFFF;
    height: $containerHeight;
    overflow: auto;
    margin: $containerPadding;
    border-radius: 10px;
    padding: $containerPadding;
}

</style>