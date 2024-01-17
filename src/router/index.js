import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/request'
import { getToken } from '@/utils'
import { isURL } from '@/utils/validate'
import store from '../store/index'
import { routerWhitelist } from '@/config/constant'

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

// 页面路由(独立页面)
export const pageRoutes = [
  {
    path: '/404',
    component: () => import('@/views/404'),
    name: '404',
    meta: { title: '404未找到' },
    beforeEnter (to, from, next) {
      // 拦截处理特殊业务场景
      // 如果, 重定向路由包含__双下划线, 为临时添加路由
      if (/__.*/.test(to.redirectedFrom)) {
        return next(to.redirectedFrom.replace(/__.*/, ''))
      }
      next()
    }
  },
  { path: '/login', component: () => import('@/views/login/index'), name: 'login', meta: { title: '登录' } },
  { path: '/invoice/preview', component: () => import('@/views/invoice/Preview'), name: 'preview', meta: { title: '预览' } }
]

// 模块路由(基于主入口布局页面)
export const moduleRoutes = {
  path: '/',
  component: () => import('@/views/main'),
  name: 'main',
  // redirect: { name: 'index' },
  meta: { title: '主入口布局' },
  children: [
    // { path: '/index', component: () => import('@/views/index'), name: 'index', meta: { title: '首页', isTab: true } }
  ]
}

export const mainChildrenRoutes = [
  {
    path: '/custom/Detail',
    name: 'customDetail',
    meta: { title: '客户信息', tab: true},
    component: () =>
      import('@/views/custom/Detail'),
  },
  {
    path: '/redInvoice/redInfoConfirm',
    name: 'redInfoConfirm',
    meta: { title: '预填发票申请单', tab: true},
    component: () =>
      import('@/views/outputInvoice/redInvoice/redInfoConfirm/Index.vue'),
  },
  {
    path: '/redInvoice/addApplyForm',
    name: 'addApplyForm',
    meta: { title: '新增红色信息表', tab: true},
    component: () =>
      import('@/views/outputInvoice/redInvoice/addApplyForm/Index.vue'),
  },
  {
    path: '/outputInvoice/redInvoice/infoTable/Index',
    name: 'infoTable',
    meta: { title: '红票信息申请列表', tab: true},
    component: () =>
      import('@/views/outputInvoice/redInvoice/infoTable/Index.vue'),
  },
  {
    path: '/redApplySuccess',
    name: 'infoTable',
    meta: { title: '红票开票成功', tab: true},
    component: () =>
      import('@/views/outputInvoice/redInvoice/redApplySuccess/Index.vue'),
  },
]

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
  // console.log('----token----', token)
  // console.log('----beforeEach to----', to)
  // console.log('----beforeEach from----', to)
  if (!token && to.name !== 'login') { // 未登录且不是在登录页，重定向到登录页
    return next({ name: 'login' });
  }
  if (store.state.sidebarMenuList.length || fnCurrentRouteIsPageRoute(to, pageRoutes)) {
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
      Vue.prototype.$message.error(res.msg)
      return next({ name: 'login' })
    }
    store.commit('saveSidebarMenuList', res.data || []);
    fnAddDynamicMenuRoutes(res.data)
    if(from.path === '/login'){
      next()
    }else{
      next({ ...to, replace: true })
    }
  }).catch((e) => {
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

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children)
      continue
    }
    // 组装路由
    var route = {
      path: '',
      component: null,
      name: '',
      meta: {
        ...window.SITE_CONFIG['contentTabDefault'],
        menuId: menuList[i].id,
        title: menuList[i].name
      }
    }
    // eslint-disable-next-line
    let URL = (menuList[i].url || '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)) // URL支持{{ window.xxx }}占位符变量
    if (isURL(URL)) {
      route['path'] = route['name'] = `i-${menuList[i].id}`
      route['meta']['iframeURL'] = URL
    } else {
      URL = URL.replace(/^\//, '').replace(/_/g, '-')
      // route['path'] = route['name'] = URL.replace(/\//g, '-')
      route['path'] = URL ? `/${URL}` : URL
      route['name'] = URL.replace(/\//g, '-')
      route['component'] = () => import(`@/views/${URL}`)
    }
    routes.push(route)
  }
  if (temp.length >= 1) {
    return fnAddDynamicMenuRoutes(temp, routes)
  }
  routes = [...routes, ...mainChildrenRoutes]
  // 添加路由
  router.addRoute({
    ...moduleRoutes,
    name: 'main-dynamic-menu',
    children: routes
  })
  router.addRoute({ path: '*', redirect: { name: '404' } });
  // console.log('----routes----', routes)
  window.SITE_CONFIG['dynamicMenuRoutes'] = routes
}

export default router
