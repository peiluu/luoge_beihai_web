<template>
  <main :class="['aui-content', { 'aui-content--tabs': $route.meta.isTab }]">
    <!-- tab展示内容 -->
    <template>
      <el-dropdown class="aui-content--tabs-tools">
        <i class="el-icon-arrow-down"></i>
        <el-dropdown-menu slot="dropdown" :show-timeout="0">
          <el-dropdown-item @click.native="tabRemoveHandle($store.state.contentTabsActiveName)">{{ $t('contentTabs.closeCurrent') }}</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseOtherHandle()">{{ $t('contentTabs.closeOther') }}</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseAllHandle()">{{ $t('contentTabs.closeAll') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tabs v-model="$store.state.contentTabsActiveName" @tab-click="tabSelectedHandle" @tab-remove="tabRemoveHandle">
        <el-tab-pane
                v-for="item in $store.state.contentTabs"
                :key="item.name"
                :name="item.name"
                :label="item.title"
                :closable="item.name !== 'home'"
                :class="{ 'is-iframe': tabIsIframe(item.iframeURL) }">
          <template v-if="item.name === 'home'">
            <svg slot="label" class="icon-svg aui-content--tabs-icon-nav" aria-hidden="true"><use xlink:href="#icon-home"></use></svg>
          </template>
          <iframe v-if="tabIsIframe(item.iframeURL)" :src="item.iframeURL" width="100%" height="100%" frameborder="0" scrolling="yes"></iframe>
          <template v-else>
              <template v-if="(editRoutes.contains($route.name)&&$route.query.opt=='add') || importRoutes.contains($route.name)">
                <router-view v-if="item.name==$store.state.contentTabsActiveName"/>
              </template>
              <template v-else>
                <keep-alive v-if="item.name==$store.state.contentTabsActiveName"><router-view/></keep-alive>
              </template>
          </template>
        </el-tab-pane>
      </el-tabs>
    </template>
    <!-- 其他方式, 展示内容 -->
    <!--<template v-else>
      <router-view v-if="(editRoutes.contains($route.name)&&$route.query.opt=='add') || importRoutes.contains($route.name)"/>
      <keep-alive v-else>
        <router-view />
      </keep-alive>
    </template>-->
  </main>
</template>

<script>
  Array.prototype.contains = function (fn) {
    var arr = this, //数组本身
            len = arr.length, //数组长度
            arg = arguments[0] || window,
            item;
    for (var i = 0; i < len; i++) {
      item = JSON.parse(JSON.stringify(arr[i]))
      if(item==arg){
        return true;
      }
    }
    return false;
  }

import { isURL } from '@/utils/validate'
export default {
  data () {
    return {
      editRoutes: ['employeeEdit','obligoreAdd','salaryItemDetail'],
      importRoutes: ['obligorImport','employeeImport','incomeImport']
    }
  },
  methods: {
    // tabs, 是否通过iframe展示
    tabIsIframe (url) {
      return isURL(url)
    },
    // tabs, 选中tab
    tabSelectedHandle (tab) {
      this.$store.state.contentTabs.forEach(e=>{
        if(e.name === tab.name){
          e.isShow = true;
          tab = e;
        }else {
          e.isShow = false
        }
      });
      this.$router.push({
        'name': tab.name,
        'params': { ...tab.params },
        'query': { ...tab.query }
      })
    },
    // tabs, 删除tab
    tabRemoveHandle (tabName) {
      if (tabName === 'home') {
        return false
      }
      this.$store.state.contentTabs = this.$store.state.contentTabs.filter(item => item.name !== tabName)
      this.$store.state.contentTabs.forEach(e=>{
        e.isShow = false
      });
      if (this.$store.state.contentTabs.length <= 0) {
        this.$store.state.sidebarMenuActiveName = this.$store.state.contentTabsActiveName = 'home'
        return false
      }
      // 当前选中tab被删除
      if (tabName === this.$store.state.contentTabsActiveName) {
        let tab = this.$store.state.contentTabs[this.$store.state.contentTabs.length - 1]
        this.$router.push({
          name: tab.name,
          params: { ...tab.params },
          query: { ...tab.query }
        })
      }
    },
    // tabs, 关闭其它
    tabsCloseOtherHandle () {
      this.$store.state.contentTabs = this.$store.state.contentTabs.filter(item => {
        return item.name === 'home' || item.name === this.$store.state.contentTabsActiveName
      })
    },
    // tabs, 关闭全部
    tabsCloseAllHandle () {
      this.$store.state.contentTabs = this.$store.state.contentTabs.filter(item => item.name === 'home')
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .main {
    background-color: #F0F2F5;
  }
</style>
