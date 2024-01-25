<template>
  <div v-loading.fullscreen.lock="loading" :element-loading-text="$t('loading')" :class="['aui-wrapper', { 'aui-sidebar--fold': $store.state.sidebarFold }]">
    <!-- <template v-if="!loading"> -->
      <main-navbar />
      <main-sidebar />
      <div class="aui-content__wrapper">
        <main-content v-if="!$store.state.contentIsNeedRefresh" />
      </div>
    <!-- </template> -->
  </div>
</template>

<script>
import MainNavbar from './main-navbar'
import MainSidebar from './main-sidebar'
import MainContent from './main-content'
import debounce from 'lodash/debounce'
export default {
  provide () {
    return {
      // 刷新
      refresh () {
        this.$store.commit('updateContentIsNeedRefresh', true)
        this.$nextTick(() => {
          this.$store.commit('updateContentIsNeedRefresh', false)
        })
      }
    }
  },
  data () {
    return {
      loading: true
    }
  },
  components: {
    MainNavbar,
    MainSidebar,
    MainContent
  },
  watch: {
    $route: 'routeHandle'
  },
  created () {
    this.windowResizeHandle()
    this.routeHandle(this.$route)
    Promise.all([
      this.getUserInfo(),
      this.getPermissions()
    ]).then(() => {
      this.loading = false
    })
  },
  methods: {
    // 窗口改变大小
    windowResizeHandle () {
      this.$store.state.sidebarFold = document.documentElement['clientWidth'] <= 992 || false
      window.addEventListener('resize', debounce(() => {
        this.$store.state.sidebarFold = document.documentElement['clientWidth'] <= 992 || false
      }, 150))
    },
    // 路由, 监听
    routeHandle (route) {
      if (!route.meta.isTab) {
        return false
      }
      // console.log('---this.$store.state.app---',this.$store.state)
      // this.$store.state.app.contentTabs.forEach(e=>{
      //   e.isShow = false
      // });
      var tab = this.$store.state.app.contentTabs.filter(item => item.name === route.name)[0]
      if (!tab) {
        tab = {
          ...window.SITE_CONFIG['contentTabDefault'],
          ...route.meta,
          name: route.name,
          params: { ...route.params },
          query: { ...route.query },
          isShow: true,
          path: route.path
        }
        let tabs = []
        if(tab.name === 'home'){ // 首页在第一位，且不可删除
          tabs = [tab, ...this.$store.state.app.contentTabs]
        } else {
          tabs = [...this.$store.state.app.contentTabs, tab]
        }
        this.$store.commit('app/saveContentTabs', tabs)
      }
      this.$store.commit('app/saveSidebarMenuActiveName', tab.menuId);
      this.$store.commit('app/saveContentTabsActiveName', tab.name);
    },
    // 获取当前管理员信息
    getUserInfo () {
      return this.$http.get('/sys/user/info').then(res => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        // 存储用户信息
        this.$store.commit('user/saveUser', {
          id: res.data.id, 
          username: res.data.username, 
          superAdmin: res.data.superAdmin
        })
      }).catch(() => {})
    },
    // 获取权限
    getPermissions () {
      return this.$http.get('/sys/menu/permissions').then(res => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        //这里把权限获取到了本地，这种方式安全性有待商榷
        window.SITE_CONFIG['permissions'] = res.data
      }).catch(() => {})
    }
  }
}
</script>
