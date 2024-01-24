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
    // 内容, 是否需要刷新
    contentIsNeedRefresh: false,
   
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
    updateContentIsNeedRefresh (state, status) {
      state.contentIsNeedRefresh = status
    },
  }
})
