<template>
  <aside class="aui-sidebar">
    <div class="nav-logo"><img src="~@/assets/logo.jpg" class="nav-img"/></div>
    <div class="aui-sidebar__inner">
      <el-menu
        :default-active="$store.state.app.sidebarMenuActiveName"
        :collapse="$store.state.sidebarFold"
        :unique-opened="true"
        :collapseTransition="false"
      >
        <sub-menu v-for="menu in $store.state.app.sidebarMenuList" :key="menu.id" :menu="menu" />
      </el-menu>
    </div>
  </aside>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
export default {
  data () {
    return {
    }
  },
  components: {
    SubMenu
  },
}
</script>
<style lang="scss" scoped>
.nav-logo {
  height: 50px;
  margin-bottom: 5px;
  padding: 3px 0 7px;
  text-align: center;
  box-shadow:1px 0 10px 0 rgba(0, 0, 0, 0.2);
  .nav-img {
    height: 40px;
  }
}
</style>
