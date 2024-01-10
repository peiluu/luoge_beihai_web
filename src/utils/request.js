import axios from 'axios'
import Cookies from 'js-cookie'
import router from '@/router'
import qs from 'qs'
import { clearLoginInfo } from '@/utils'
import isPlainObject from 'lodash/isPlainObject'

const http = axios.create({
  baseURL: process.env.VUE_APP_APIURL,
  timeout: 60000,
  withCredentials: true
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  config.headers['Accept-Language'] = Cookies.get('language') || 'zh-CN'
  config.headers['token'] = Cookies.get('token') || ''
  // 默认参数
  var defaults = {}
  // 防止缓存，GET请求默认带_t参数
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      ...{ '_t': new Date().getTime() }
    }
  }
  if (isPlainObject(config.params)) {
    config.params = {
      ...defaults,
      ...config.params
    }
  }
  if (isPlainObject(config.data)) {
    config.data = {
      ...defaults,
      ...config.data
    }
    if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
      config.data = qs.stringify(config.data)
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (response.data.code === 401 || response.data.code === 10001) {
    clearLoginInfo()
    router.replace({ name: 'login' })
    return Promise.reject(response.data.msg)
  }
  return response
}, error => {
  console.error(error)
  return Promise.reject(error)
})

export default http

//默认请求加上的参数名称
let defaultExtendParamNames = [];
// 异步操作会令该变量数据有误
let dealExtendParamNames = (v) => {
  if (v && v.length >= 0) {
      defaultExtendParamNames = v
  } else {
      defaultExtendParamNames = ['applicationCode', 'tenantCode']
  }
}
export function postJSON(url, params, extendParamNames = null, showLoading = false) {
  let loading = {};
  if (showLoading){
    loading = Loading.service({
      lock: true, //同v-loading的修饰符
      // text: this.$t('加载中'), //加载文案
      background: 'rgba(255,255,255,.9)', //背景色
      // spinner: 'el-icon-loading', //加载图标
    });
  }
  const loadingClose = () => {
    if (showLoading) {
      setTimeout(() => {
        loading.close();
      }, 100)
    }
  }

dealExtendParamNames(extendParamNames);
  return new Promise((resolve, reject) => {
    http.post(url, params, {
          headers: {
              'Content-Type': 'application/json; charset=utf-8'
          },
      }).then(res => {

        resolve(res)
        loadingClose()
      }).catch(err => {
        loadingClose()

          reject(err)

      })
  })
}
export function deleteOne(url, id, params) {
  return new Promise((resolve, reject) => {
      http.post(`${url}`, {
          id,
          ...params
      }).then(res => {
          resolve(res)
      }).catch(err => {
          reject(err)
      })
  })
}