<template>
  <main :class="['aui-content', { 'aui-content--tabs': $route.meta.isTab || $route.meta.tab}]">
    <!-- tab展示内容 -->
      <el-dropdown class="aui-content--tabs-tools">
        <i class="el-icon-arrow-down"></i>
        <el-dropdown-menu slot="dropdown" :show-timeout="0">
          <el-dropdown-item @click.native="tabRemoveHandle($store.state.app.contentTabsActiveName)">{{ $t('contentTabs.closeCurrent') }}</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseOtherHandle()">{{ $t('contentTabs.closeOther') }}</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseAllHandle()">{{ $t('contentTabs.closeAll') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tabs class="custom-tabs" v-model="$store.state.app.contentTabsActiveName" @tab-click="tabSelectedHandle" @tab-remove="tabRemoveHandle">
        <el-tab-pane
          v-for="item in $store.state.app.contentTabs"
          :key="item.name"
          :name="item.name"
          :label="item.title"
          :value="JSON.stringify(item)"
          :closable="item.name !== 'home'"
          :class="{ 'is-iframe': tabIsIframe(item.iframeURL) }">
          <template v-if="item.name === 'home'">
            <svg slot="label" class="icon-svg aui-content--tabs-icon-nav" aria-hidden="true"><use xlink:href="#icon-home"></use></svg>
          </template>
        </el-tab-pane>
      </el-tabs>
      <!-- <iframe v-if="tabIsIframe(item.iframeURL)" :src="item.iframeURL" width="100%" height="100%" frameborder="0" scrolling="yes"></iframe> -->
      <!-- <template v-else> -->
          <!-- <template v-if="(editRoutes.contains($route.name)&&$route.query.opt=='add') || importRoutes.contains($route.name)">
            <router-view v-if="item.name==$store.state.app.contentTabsActiveName"/>
          </template> -->
          <!-- <template v-else> -->
            <keep-alive ><router-view ref="routerView" :key="$route.path"/></keep-alive>
          <!-- </template> -->
      <!-- </template> -->
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
  mounted(){
    this.$nextTick(()=>{
      this.setRemoveCachePage()
    })
  },
  methods: {
    setRemoveCachePage(){
      this.$eventBus.$on('removeCachePage', key => {
        try {
          // console.log('----key----', key)
          /**
           * @param {Object} cache:类数组对象，存放缓冲的路由组件，键值对形，key为路由路径，value为路由组件Vnode
           * @param {Array} keys:数组，存放缓冲的路由组件的key,即路由路径
           * @param {String} key:字符串，路由组件的key，指定要删除的路由组件key值
           */
          if(this.$refs.routerView){
            const { cache, keys } = this.$refs.routerView.$vnode.parent.componentInstance
            // console.log('--setRemoveCachePage--', cache, keys)
            if(keys.length){
              Object.prototype.hasOwnProperty.call(cache, key) &&
              (() => {
                // 点击tab关闭页面，移除对应页面缓冲
                delete cache[key]
                keys.splice(keys.indexOf(key), 1)
                console.log('%c 删除缓冲页面成功！', 'color:red')
              })()
            }
          }
          
        } catch (error) {
          console.log('--error--', error);
        }
      }) 
    },
    // tabs, 是否通过iframe展示
    tabIsIframe (url) {
      return isURL(url)
    },
    // tabs, 选中tab
    tabSelectedHandle (tab) {
      // console.log('---tab111---', tab.$attrs.value)
      let value = {
        params: {},
        query: {}
      }
      if(tab.$attrs.value){
        try {
          value = {...value, ...JSON.parse(tab.$attrs.value)};
        } catch (error) {
          console.log(error)
        }
      }
      this.$router.push({
        'name': tab.name,
        'params': { ...value.params },
        'query': { ...value.query }
      })
    },
    // tabs, 删除tab
    tabRemoveHandle (tabName) {
      if (tabName === 'home') {
        return false
      }
      this.$store.state.app.contentTabs = this.$store.state.app.contentTabs.filter(item => item.name !== tabName)
      if (this.$store.state.app.contentTabs.length <= 0) {
        this.$store.commit('app/saveSidebarMenuActiveName', 'home');
        this.$store.commit('app/saveContentTabsActiveName', 'home');
        return false
      }
      // 当前选中tab被删除
      if (tabName === this.$store.state.app.contentTabsActiveName) {
        let tab = this.$store.state.app.contentTabs[this.$store.state.app.contentTabs.length - 1]
        this.$router.push({
          name: tab.name,
          params: { ...tab.params },
          query: { ...tab.query }
        })
      }
    },
    // tabs, 关闭其它
    tabsCloseOtherHandle () {
      this.$store.state.app.contentTabs = this.$store.state.app.contentTabs.filter(item => {
        return item.name === 'home' || item.name === this.$store.state.app.contentTabsActiveName
      })
    },
    // tabs, 关闭全部
    tabsCloseAllHandle () {
      this.$store.state.app.contentTabs = this.$store.state.app.contentTabs.filter(item => item.name === 'home')
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .main {
    background-color: #F0F2F5;
  }
 
  .custom-tabs {
    /deep/ &.el-tabs{
      height: 100%;
    }
    
  }
</style>
