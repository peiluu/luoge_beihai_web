<template>
  <el-submenu v-if="menu.children && menu.children.length >= 1" :index="menu.id" :popper-append-to-body="false">
    <template slot="title">
      <svg v-if="menu.icon" class="icon-svg aui-sidebar__menu-icon" aria-hidden="true"><use :xlink:href="`#${menu.icon}`"></use></svg>
      <span>{{ menu.name }}</span>
    </template>
    <sub-menu v-for="item in menu.children" :key="item.id" :menu="item"></sub-menu>
  </el-submenu>
  <el-menu-item v-else :index="menu.id" @click="gotoRouteHandle(menu.id)" :class="getExceedName(menu)">
    <svg v-if="menu.icon" class="icon-svg aui-sidebar__menu-icon" aria-hidden="true"><use :xlink:href="`#${menu.icon}`"></use></svg>
    <span>{{ menu.name }}</span>
  </el-menu-item>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
import { getStringLen } from '@/utils'
export default {
  name: 'sub-menu',
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  components: {
    SubMenu
  },
  methods: {
    // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
    gotoRouteHandle (menuId) {
      var route = window.SITE_CONFIG['dynamicMenuRoutes'].filter(item => item.meta.menuId === menuId)[0]
      if (route) {
        this.$router.push({ name: route.name })
        this.$eventBus.$emit('removeCachePage', route.path)
      }
    },
    getExceedName (menu) {
      const len = getStringLen(menu.name);
      return len >= 14 ? 'exceedName' : ''
    }
  }
}
</script>
<style lang="scss" scoped>
.exceedName {
  font-size: 12px;
}
</style>
