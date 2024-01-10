import { config } from "@/config"

export default {
    namespaced: true,
    state: {
        collapsed: false,
        currentAppCode: null,
        useTab: config.useTab,
        tabs: [],
        activeTab: null,
        useAnimate: config.useAnimate,
        useWater: config.showWater,
        host: config.host,
        dictList: [] // 字典数据
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
        saveActiveTab(state, tab) {
            state.activeTab = tab
        },
        tabs_add(state, data) {
            state.tabs.push(data)
        },
        tabs_del(state, key) {
            for (let index = 0; index < state.tabs.length; index++) {
                const item = state.tabs[index]
                if (key === item.key) {
                    state.tabs.splice(index, 1)
                    break
                }
            }
        },
        tabs_clear(state) {
            state.tabs = []
        },
        tabs_del_left(state, target) {
            for (let index = 0; index < state.tabs.length; index++) {
                const item = state.tabs[index]
                if (item.key === target) {
                    if (index > 0) {
                        state.tabs.splice(0, index)
                    }
                    break
                }
            }
        },
        tabs_del_right(state, target) {
            for (let index = 0; index < state.tabs.length; index++) {
                const item = state.tabs[index]
                if (item.key === target) {
                    const dis = state.tabs.length - index
                    if (dis > 0) {
                        state.tabs.splice(index, dis)
                    }
                    break
                }
            }
        },
        saveDictList(state, data){
            state.dictList = data
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
        addTab(context, data) {
            context.commit('tabs_add', data)
        },
        clearTabs(context) {
            context.commit('tabs_clear')
        },
        removeTab(context, key) {
            context.commit('tabs_del', key)
        },
        removeLeftTabs(context, data) {
            context.commit('tabs_del_left', data)
        },
        removeRightTabs(context, data) {
            context.commit('tabs_del_right', data)
        }
    }
}