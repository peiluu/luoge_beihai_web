import { config } from "@/config"

export default {
    namespaced: true,
    state: {
        collapsed: false,
        currentAppCode: null,
        useTab: config.useTab,
        useAnimate: config.useAnimate,
        useWater: config.showWater,
        host: config.host,
        dictList: [], // 字典数据
         // 侧边栏, 菜单
        sidebarMenuList: [],
        sidebarMenuActiveName: '',
        // 内容, 标签页
        contentTabs: [],
        contentTabsActiveName: 'home',
        dynamicsCacheExcludePage: [], // 动态配置不需要缓存的页面
    },
    mutations: {
        saveCollapsed(state, collapsed) {
            state.collapsed = collapsed
        },
        saveCurrentApp(state, appCode) {
            state.currentAppCode = appCode
        },
        saveUseTab(state, useTab) {
            state.useTab = useTab
        },
        saveUseAnimate(state, useAnimate) {
            state.useAnimate = useAnimate
        },
        saveUseWater(state, useWater) {
            state.useWater = useWater
        },
        tabs_del(state, tabName) {
            state.contentTabs = state.contentTabs.filter(item => item.name !== tabName)
            if (state.contentTabs.length <= 0) {
                state.sidebarMenuActiveName = 'home'
                state.contentTabsActiveName = 'home'
            }
        },
        saveDictList(state, data){
            state.dictList = data
        },
        saveSidebarMenuList(state, data) {
          state.sidebarMenuList = data
        },
        saveSidebarMenuActiveName(state, data) {
          state.sidebarMenuActiveName = data
        },
        saveContentTabsActiveName(state, data) {
          state.contentTabsActiveName = data
        },
        saveContentTabs(state, data){
          state.contentTabs = data
        },
        saveExcludePage(state, val) {
            state.dynamicsCacheExcludePage = val
        }
    },
    actions: {
        updateCollapsed(context, collapsed) {
            context.commit('saveCollapsed', collapsed)
        },
        saveCurrentApp(context, appCode) {
            context.commit('saveCurrentApp', appCode);
        },
        saveUseTab(context, useTab) {
            context.commit('saveUseTab', useTab)
        },
        saveUseAnimate(context, useAnimate) {
            context.commit('saveUseAnimate', useAnimate)
        },
        saveUseWater(context, useWater) {
            context.commit('saveUseWater', useWater)
        },
        saveActiveTab(context, path) {
            context.commit('saveActiveTab', path)
        },
        removeTab(context, key) {
            context.commit('tabs_del', key)
        },
    }
}