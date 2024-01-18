import Cookies from 'js-cookie'
import store from '@/store'
import { isURL } from './validate'
import { mainChildrenRoutes, moduleRoutes } from '../router/router.config.js'
/**
 * 权限
 * @param {*} key
 */
export function hasPermission (key) {
  return window.SITE_CONFIG['permissions'].indexOf(key) !== -1 || false
}

/**
 * 获取字典数据列表
 * @param dictType  字典类型
 */
export function getDictDataList (dictType) {
  const type = store.state.app.dictList.find((element) => (element.dictType === dictType))
  if (type) {
    return type.dataList
  } else {
    return []
  }
}

/**
 * 获取字典名称
 * @param dictType  字典类型
 * @param dictValue  字典值
 */
export function getDictLabel (dictType, dictValue) {
  const type = store.state.app.dictList.find((element) => (element.dictType === dictType))
  if (type) {
    const val = type.dataList.find((element) => (element.dictValue === dictValue + ''))
    if (val) {
      return val.dictLabel
    } else {
      return dictValue
    }
  } else {
    return dictValue
  }
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  store.commit('resetStore')
  Cookies.remove('token')
  Cookies.remove('roleList')
  sessionStorage.clear()
  localStorage.clear()
}

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 获取svg图标(id)列表
 */
export function getIconList () {
  var res = []
  var list = document.querySelectorAll('svg symbol')
  for (var i = 0; i < list.length; i++) {
    res.push(list[i].id)
  }

  return res
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'pid') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (!temp[data[k][pid]] || data[k][id] === data[k][pid]) {
      res.push(data[k])
      continue
    }
    if (!temp[data[k][pid]]['children']) {
      temp[data[k][pid]]['children'] = []
    }
    temp[data[k][pid]]['children'].push(data[k])
    data[k]['_level'] = (temp[data[k][pid]]._level || 0) + 1
  }
  return res
}

export function isBlank(str){
  return !str || str=='';
}

export function getToken(){
  return Cookies.get('token');
}

export function getArrayName (array, value){
  for(var i=0; i<array.length; i++){
    var obj = array[i];
    if(obj.value == value){
      return obj.name
    }
  }
  return '';
}
/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
export function fnAddDynamicMenuRoutes (menuList = [], routes = [], router) {
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
    // let URL = (menuList[i].url || '')//.replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)) // URL支持{{ window.xxx }}占位符变量
    let URL = (menuList[i].url || '').replace(/VUE_APP_APIURL/, s1=> process.env[s1])
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
    return fnAddDynamicMenuRoutes(temp, routes, router)
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

/**
   * 获取字符串长度
   * string.length的坑：console.log('𠮷'.length) // 2
   * @param {目标字符串} s 
   * @returns 目标字符串的长度，number类型
   */
export const getStringLen = ( s ) => {
  if(typeof s !== "string")return new TypeError('参数不合法');
  const spRegexp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  return s.replace(spRegexp,'_').length
}