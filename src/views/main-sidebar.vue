<template>
  <aside :class="['aui-sidebar']">
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
