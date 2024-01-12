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
    return Promise.reject(response.data)
  }
  // console.log('--response--', response)
  if(response.data.code === 0 || response.data.code === '0'){
    return response.data
  } else {
    // console.log("异常", response.data);
    return Promise.reject(response.data);
  }
}, error => {
  // 处理全局错误
  if (error) {
    let code = parseInt(error.response && error.response.status);
    let msg = '未知错误';
    if (code) {
      switch (code) {
        case 400:
          msg = '错误的请求';
          break;
        case 401:
          msg = '未授权，请重新登录';
          // 跳转登录页
          goLogin()
          break;
        case 403:
          msg = '拒绝访问';
          break;
        case 404:
          msg = '请求错误,未找到该资源';
          break;
        case 405:
          msg = '请求方法未允许';
          break;
        case 408:
          msg = '请求超时';
          break;
        case 500:
          msg = '服务器端出错';
          break;
        case 501:
          msg = '网络未实现';
          break;
        case 502:
          msg = '网络错误';
          break;
        case 503:
          msg = '服务不可用';
          break;
        case 504:
          msg = '网络超时';
          break;
        case 505:
          msg = 'http版本不支持该请求';
          break;
        default:
          msg = `其他连接错误 --${code}`
      }
    } else {
      if(error.code){
        code = error.code;
        msg = error.msg;
      }else{
        msg = `无法连接到服务器！`;
      }
     
    }
    let err = {
      code,
      msg
    }
    // Message.warning(err.msg)
    return Promise.reject(err);
  }
})

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
// 上传文件
export const customPost = function(url, hearders, params, cb){
  return new Promise((resolve, reject) => {
    postJSON(url, params, {
          headers: hearders,
      }).then(res => {
          if(cb && typeof cb === 'function')cb(res);
          resolve(res)
      }).catch(err => {
          reject(err)
      })
  })
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
export const getingBlob = (url = '', data = {}) => {
  // console.log('--data--',data)
  let config = {
    method: 'post',
    url,
    data: data,
    headers: {'Content-Type':'application/json','Data-Type':'json','token': Cookies.get('token') || ''},
    responseType: 'blob'
  }
  return axios(config).then((res)=>{
    return res
  }).catch((error) => {
    const { data = {}, status,msg } = error.response || {}
    if (status === 401) {

    } else {
      if (data?.type === 'application/json') {
        // 说明是普通对象数据，读取信息
        const fileReader = new FileReader()
        fileReader.onloadend = () => {
          const jsonData = JSON.parse(fileReader.result)
          console.log(jsonData)
          // 后台信息
          // alert(jsonData.msg || jsonData.message || jsonData.error || '服务异常')
        }
        fileReader.readAsText(data)  //或者读取response.data
      }
    }
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

  // dealExtendParamNames(extendParamNames);
  getingBlob(url, reqData).then(res=>{
    const blob = new Blob([res.data])
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
    showLoading && loading.close();
  }).catch(err=>{
    console.log('err', err)
    showLoading && loading.close();
  })
}
export default http