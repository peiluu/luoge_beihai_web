import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/request'
import { getToken, fnAddDynamicMenuRoutes, clearLoginInfo } from '@/utils'
// import { isURL } from '@/utils/validate'
import store from '../store/index'
import { routerWhitelist } from '@/config/constant'
import { moduleRoutes, pageRoutes } from './router.config'

Vue.use(Router)

const originalPush = Router.prototype.push
const originalReplace = Router.prototype.replace;
//push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject){
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch(err => err);
};
//replace
Router.prototype.replace = function replace(location, onResolve, onReject) {
    if (onResolve || onReject){
      return originalReplace.call(this, location, onResolve, onReject);
    }
    return originalReplace.call(this, location).catch(err => err);
};



export function addDynamicRoute (routeParams, router) {
  // 组装路由名称, 并判断是否已添加, 如是: 则直接跳转
  var routeName = routeParams.routeName
  var dynamicRoute = window.SITE_CONFIG['dynamicRoutes'].filter(item => item.name === routeName)[0]
  if (dynamicRoute) {
    return router.push({ name: routeName, params: routeParams.params })
  }
  // 否则: 添加并全局变量保存, 再跳转
  dynamicRoute = {
    path: routeName,
    component: () => import(`@/views/${routeParams.path}`),
    name: routeName,
    meta: {
      ...window.SITE_CONFIG['contentTabDefault'],
      menuId: routeParams.menuId,
      title: `${routeParams.title}`
    }
  }
  router.addRoute(
    {
      ...moduleRoutes,
      name: `main-dynamic__${dynamicRoute.name}`,
      children: [dynamicRoute]
    }
  )
  window.SITE_CONFIG['dynamicRoutes'].push(dynamicRoute)
  router.push({ name: dynamicRoute.name, params: routeParams.params })
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: pageRoutes.concat(moduleRoutes)
})

router.beforeEach((to, from, next) => {
  // 路由白名单：特殊访问地址不需要登录，可直接访问
    // console.log('white---list', routerWhitelist.test(to.path), to.path, routerWhitelist)
  if(routerWhitelist.test(to.path)){
    return next()
  }
  const token = getToken();
  // console.log('----token----', token, router)
  // console.log('----beforeEach to----', to)
  // console.log('----beforeEach from----', to)
  if (!token ) { // 未登录
    if(to.path !== '/login'){ // 不是在登录页，重定向到登录页
      return next('/login');
    } else if( to.path === '/login'){ // 是在登录页，直接next
      return next();
    }
  }
  // console.log('--store.state.app.--', store.state.app.sidebarMenuList)
  if (store.state.app.sidebarMenuList.length) {
    if(to.path === '/'){
      return next({name: 'home'})
    }
    return next()
  }
  // 获取字典列表, 添加并全局变量保存
  http.get('/sys/dict/type/all').then(res => {
    if (res.code !== 0) {
      return
    }
    store.commit('app/saveDictList', res.data || [])
  }).catch(() => {})
  // 获取菜单列表, 添加并全局变量保存
  http.get('/sys/menu/nav').then(res => {
    if (res.code !== 0) {
      // Vue.prototype.$message.error(res.msg)
      return next({ name: 'login' })
    }
    store.commit('app/saveSidebarMenuList', res.data || []);
    fnAddDynamicMenuRoutes(res.data,[], router)
    if(from.path === '/login'){
      next()
    }else{
      next({ ...to, replace: true })
    }
  }).catch((e) => {
    console.log('---e---', e)
    clearLoginInfo()
    next({ name: 'login' })
  })
})

/**
 * 判断当前路由是否为页面路由
 * @param {*} route 当前路由
 * @param {*} pageRoutes 页面路由
 */
function fnCurrentRouteIsPageRoute (route, pageRoutes = []) {
  var temp = []
  for (var i = 0; i < pageRoutes.length; i++) {
    if (route.path === pageRoutes[i].path) {
      return true
    }
    if (pageRoutes[i].children && pageRoutes[i].children.length >= 1) {
      temp = temp.concat(pageRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteIsPageRoute(route, temp) : false
}

export default router
