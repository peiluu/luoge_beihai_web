import { Message, Loading } from 'element-ui'
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
function goLogin() {
  clearLoginInfo()
  Message.warning('登录失效，请重新登录')
  router.replace({ name: 'login' })
}
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
  if (response.data.code === 401 || response.data.code === 10001 || response.data.code === '5') {
    goLogin()
    return Promise.reject(response.data.msg)
  }
  return response
}, error => {
  // 处理全局错误
  if (error) {
    let code = parseInt(error.response && error.response.status);
    let message = '未知错误';
    if (code) {
      switch (code) {
        case 400:
          message = '错误的请求';
          break;
        case 401:
          message = '未授权，请重新登录';
          // 跳转登录页
          goLogin()
          break;
        case 403:
          message = '拒绝访问';
          break;
        case 404:
          message = '请求错误,未找到该资源';
          break;
        case 405:
          message = '请求方法未允许';
          break;
        case 408:
          message = '请求超时';
          break;
        case 500:
          message = '服务器端出错';
          break;
        case 501:
          message = '网络未实现';
          break;
        case 502:
          message = '网络错误';
          break;
        case 503:
          message = '服务不可用';
          break;
        case 504:
          message = '网络超时';
          break;
        case 505:
          message = 'http版本不支持该请求';
          break;
        default:
          message = `其他连接错误 --${code}`
      }
    } else {
      if(error.code){
        code = error.code;
        message = error.message;
      }else{
        message = `无法连接到服务器！`
      }
     
    }
    let err = {
      code,
      message
    }
    Message.warning(err.message)
    return Promise.reject(err);
  }
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

/**
 * @description 下载文件
 */
export function download(url, params, extendParamNames = null, showLoading = false) {
  let loading = {};
  if (showLoading){
    loading = Loading.service({
      lock: true,
      text: '',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
  }
  const { reqData, fileName = '' } = params

  dealExtendParamNames(extendParamNames);
  return new Promise((resolve, reject) => {
    request.post(url, reqData, {
      headers: {"Content-Type":"application/json","Data-Type":"json"},
      responseType: 'blob'
    }).then(res => {
      const blob = new Blob([res])
      if ('download' in document.createElement('a')) {
        // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }

      resolve(res)

      showLoading && loading.close();
    }).catch(err => {
      showLoading && loading.close();

      reject(err)

    })
  })
}
