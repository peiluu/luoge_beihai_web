import Vue from 'vue'
import Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: true,
  state: {
    // 导航条, 布局风格, default(白色) / colorful(鲜艳)
    navbarLayoutType: 'colorful',
    // 侧边栏, 布局皮肤, default(白色) / dark(黑色)
    sidebarLayoutSkin: 'dark',
    // 侧边栏, 折叠状态
    sidebarFold: false,
    // 侧边栏, 菜单
    sidebarMenuList: [],
    sidebarMenuActiveName: '',
    // 内容, 是否需要刷新
    contentIsNeedRefresh: false,
    // 内容, 标签页(默认取后端返回的第一个导航，即首页)
    contentTabs: [
      // {
      //   ...window.SITE_CONFIG['contentTabDefault'],
      //   'name': 'home',
      //   'title': 'home',
      //   'isShow': 'true',
      // }
    ],
    contentTabsActiveName: 'home'
  },
  modules: {
    app,
    user
  },
  getters,
  mutations: {
    // 重置vuex本地储存状态
    resetStore (state) {
      Object.keys(state).forEach((key) => {
        state[key] = cloneDeep(window.SITE_CONFIG['storeState'][key])
      })
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
    }
  }
})
