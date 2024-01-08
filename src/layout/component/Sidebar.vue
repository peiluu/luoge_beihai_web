<template>
    <div class="sidebar">
        <div class="logo">
            <img :src="logo" alt="" srcset="">
        </div>
        <el-menu background-color="#001529" :default-active="selectedKeys" :default-openeds="openKeys" text-color="#fff" @select="handleClick" :collapse="collapsed">
            <template v-for="i in menus">
                <el-submenu v-if="i.subResources && i.subResources.length!=0" :index="i.resourceCode" :key="i.resourceCode">
                    <template slot="title">
                        <sidebar-icon :url="i.iconUrl"></sidebar-icon>
                        <span slot="title">{{i.resourceName}}</span>
                    </template>
                    <el-menu-item v-for="k in i.subResources" :key="k.resourceCode" :index="k.resourceCode">{{k.resourceName}}</el-menu-item>
                </el-submenu>
                <el-menu-item v-else :key="i.resourceCode" :index="i.resourceCode">
                    <sidebar-icon :url="i.iconUrl"></sidebar-icon>
                    <span slot="title">{{i.resourceName}}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script>
import LOGO from '@/assets/logo.png';
import SidebarIcon from './SidebarIcon.vue';

export default {
    components: {
        SidebarIcon
    },
    data() {
        return {
            openKeys: [],
            logo: LOGO,
            lastkey: null,
            selectedKeys: ''
        }
    },
    computed: {
        collapsed() {
            return this.$store.state.app.collapsed
        },
        rootSubmenuKeys() {
            if (this.menus && this.menus.length > 0) {
                const res = []
                this.menus.map(item => {
                    res.push(item.resourceCode)
                })
                return res
            }
            return []
        },
        menus() {
            return this.$store.state.app.menus
        }
    },
    watch: {
        '$route'(to,from){
            const target = this.getRouteInfo(to.path)
            if (target) {
                this.selectedKeys = target.resourceCode
                if (this.lastkey !== target.resourceCode) {
                    this.lastkey = target.resourceCode
                }
            }
        },
        menus(n) {
            if (n && n.length > 0) {
                this.configDefaultData()
            }
        }
    },
    mounted () {
        this.configDefaultData()
    },
    methods: {
        configDefaultData() {
            const data = this.getRouteInfo(this.$route.fullPath)
            if (data) {
                if (data.parentId) {
                    this.openKeys = [data.parentId]
                }
                this.selectedKeys = data.resourceCode
            }
        },
        getRouteInfo(path, list) {
            if (!list) {
                list = this.menus || []
            }
            for (let index = 0; index < list.length; index++) {
                const item = list[index]
                if (item.resourceUrl === path) {
                    return item
                }
                if (item.subResources && item.subResources.length > 0) {
                    const res = this.getRouteInfo(path, item.subResources)
                    if (res) {
                        return res
                    }
                }
            }
            return null
        },
        onOpenChange(openKeys) {
            const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
            if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                this.openKeys = openKeys;
            } else {
                this.openKeys = latestOpenKey ? [latestOpenKey] : [];
            }
        },
        handleClick(key) {
            if (this.lastkey === key) {
                return
            }
            this.lastkey = key

            let have = false
            for (let i = 0; i < this.menus.length; i++) {
                const item = this.menus[i]
                if (item.subResources && item.subResources.length > 0) {
                    for (let j = 0; j < item.subResources.length; j++) {
                        const child = item.subResources[j]
                        if (key === child.resourceCode) {
                            have = true
                            if(child.resourceUrl.startsWith("https://") || child.resourceUrl.startsWith("http://")){
                                window.open(child.resourceUrl, "_blank");
                            }else {
                                this.$router.push(child.resourceUrl)
                            }
                            break
                        }
                    }
                }
                else if (key === item.resourceCode) {
                    have = true
                    if(item.resourceUrl.startsWith("https://") || item.resourceUrl.startsWith("http://")){
                        window.open(item.resourceUrl, "_blank");
                    }else {
                        this.$router.push(item.resourceUrl)
                    }
                    this.openKeys = []
                }
                if (have) {
                    break
                }
            }
        },
    }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.el-menu {
    border-right: none !important;
}

.sidebar {
    // width: $sideBarWidth;
    background: #001529;
    height: 100%;
    .logo {
        width: 100%;
        height: $headerHeight;
        line-height: $headerHeight;
        display: flex;
        align-items: center;
        justify-content: center;
        &>img {
            width: 80%;
        }
    }
    .menus {
        height: $sideMenuHeight;
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    .menus::-webkit-scrollbar {
        display: none;
    }
}
</style>