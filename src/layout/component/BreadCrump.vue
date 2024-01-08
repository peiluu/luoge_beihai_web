<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in list" :key="index">
            <span class="no-redirect">{{ item.name }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
import { config } from '@/config'

export default {
    name: 'Breadcrumb',
    data() {
        return {
            list: [],
            menuDic: {},
        }
    },
    computed: {
        menus() {
            return this.$store.state.app.menus;
        },
    },
	watch: {
		$route() {
			this.getBreadcrumbList()
		}
	},
    activated() {
        setTimeout(() => {
            this.getBreadcrumbList()
        }, 500);
    },
    methods: {
        updateTitle() {
            let title = config.title
            if (this.list.length > 0) {
                title += '-' + this.list[this.list.length - 1].name
            }
            document.title = title
        },
        updateMenuList(menus) {
            if (!this.menuDic) {
                this.menuDic = {};
            }
            if (menus && menus.length > 0) {
                menus.map(item => {
                    this.menuDic[item.resourceCode] = item;
                    if (item.subResources && item.subResources.length > 0) {
                        this.updateMenuList(item.subResources);
                    }
                });
            }
        },
        getBreadcrumbList() {
            const matched = this.$route.matched.filter(item => item.meta && item.meta.name);
            const res = [];
            if (matched.length > 0) {
                matched.map(item => {
                    res.push({
                        name: item.meta.name,
                        path: item.path
                    })
                })
            }
            else {
                const menu = this.getMenuItem(null, this.$route.fullPath);
                if (menu) {
                    if (menu.parentCode && menu.parentCode.length > 0) {
                        const parent = this.getMenuItem(menu.parentCode);
                        if (parent) {
                            res.push({
                                name: parent.resourceName,
                                path: parent.resourceUrl
                            })
                        }
                    }
                    res.push({
                        name: menu.resourceName,
                        path: menu.resourceUrl
                    })
                }
            }
            this.list = res
            this.updateTitle()
        },
        getMenuItem(code, path) {
            if (!this.menuDic || Object.keys(this.menuDic).length < 1) {
                this.updateMenuList(this.menus);
            }
            if (code) {
                return this.menuDic[code];
            }
            if (path) {
                const keys = Object.keys(this.menuDic);
                for (let index = 0; index < keys.length; index++) {
                    const item = this.menuDic[keys[index]];
                    if (item.resourceUrl == path) {
                        return item;
                    }
                }
            }
        },
    }
}
</script>