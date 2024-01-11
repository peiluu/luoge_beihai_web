<template>
  <transition name="el-fade-in-linear">
    <router-view />
  </transition>
</template>

<style>
  .el-table th.gutter{
    display: table-cell!important;
  }
</style>
<script>
import Cookies from 'js-cookie'
import { messages } from '@/i18n'
export default {
  watch: {
    '$i18n.locale': 'i18nHandle'
  },
  created () {
    this.i18nHandle(this.$i18n.locale)
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('store')) {
        this.$store.replaceState(
            Object.assign(
                {},
                this.$store.state,
                JSON.parse(sessionStorage.getItem('store'))
            )
        )
    }

    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    // beforeunload事件在页面刷新时先触发
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  },
  methods: {
    i18nHandle (val, oldVal) {
      Cookies.set('language', val)
      document.querySelector('html').setAttribute('lang', val)
      document.title = messages[val].brand.lg
      // 非登录页面，切换语言刷新页面
      if (this.$route.name !== 'login' && oldVal) {
        window.location.reload()
      }
    }
  }
}
</script>
<style lang="scss">
#app,
body,
html {
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
  list-style: none;
  font-size: 12px;
  font-family: PingFangSC-Regular, Microsoft YaHei, Helvetica Neue, Helvetica;
  border: none;
  overflow: hidden;
}
</style>
