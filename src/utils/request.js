import { Message, Loading } from 'element-ui'
import axios from 'axios'
import Cookies from 'js-cookie'
import router from '@/router'
import qs from 'qs'
import { clearLoginInfo } from '@/utils'
import isPlainObject from 'lodash/isPlainObject'
import { config } from '@/config/index.js'

const CancelToken = axios.CancelToken
const source = CancelToken.source()
const http = axios.create({
  baseURL: config.hostUser,
  timeout: 600000,
  withCredentials: true
})
function goLogin(msg) {
  if(!Cookies.get('token'))return;
  clearLoginInfo()
  Message.warning(msg || '登录失效，请重新登录')
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
  const res = response.data;
  // console.log('--response--', response)
  if(res.type && res.size && !Reflect.has(res, 'code')){ // blob 数据流，直接返回
    return res
  }
  if (res.code === 401 || res.code === '5') {
    goLogin(res.msg)
    return res
  }
  // 兼容部分业务接口调用有的判断code，有的没有判断code
  // 注意登录和权限走的是同一个服务器，返回code=0为正常
  // 业务接口走的是另外一个服务器，返回code='0'为正常，因此此处只需要判断值
  if(res && res.code == 0){ 
    return res
  } else {
    Message.error(res.msg);
    source.cancel('Operation canceled.');
    return Promise.reject(response.data);
  }
  // if (res && res.code && res.code != 0) {
  //   if (res.msg && res.msg.length > 0) {
  //       Message.error(res.msg)
  //   }
  //   source.cancel('Operation canceled.')
  // }
  // return res
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
    code != 401 && Message.error(err.msg)
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
        if(cb && typeof cb === 'function')cb(err);
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
/**
 * @description 下载文件
 */
export function download(url, params, extendParamNames = null, showLoading = false) {
  let loading = {};
  if (showLoading){
    loading = Loading.service({
      lock: true,
      text: '下载中....请稍后',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0.5)'
    });
  }
  const { reqData, fileName = '' } = params
  // dealExtendParamNames(extendParamNames);
  return new Promise((resolve, reject)=>{
    http.post(url, reqData, {
      headers: {"Content-Type":"application/json","Data-Type":"json"},
      responseType: 'blob'
    }).then((res)=>{
      // ['application/vnd.ms-excel',] 
      const blob = new Blob([res],{ type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
     
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
      console.log(123)
      resolve(res)
    }).catch(err=>{
      showLoading && loading.close();

      reject(err)
    })
  }).catch(err=>{
    console.log('--ree--', err)
  })
  
}
export function postOne(url, id, params, extendParamNames = null) {
 
  dealExtendParamNames(extendParamNames);
  return new Promise((resolve, reject) => {
    http.post(`${url}`, params, {
          headers: {
              'Content-Type': 'application/json; charset=utf-8',
          },
      }).then(res => {
          resolve(res)
      }).catch(err => {
          reject(err)
      })
  })
}

export function getJSON(url, params, extendParamNames = null) {
  dealExtendParamNames(extendParamNames);
  return new Promise((resolve, reject) => {
      http.get(url, {
          headers: {
              'Content-Type': 'application/json; charset=utf-8'
          },
          params: params
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
export function openFile(url, params, extendParamNames = null, showLoading = false) {
  dealExtendParamNames(extendParamNames);
  return new Promise((resolve, reject) => {
    http.post(url, params, {
      headers: {'Content-Type': 'application/json; charset=utf-8'}
      ,responseType: 'blob'
    }).then(res => {

      resolve(res)
    }).catch(err => {

      reject(err)

    })
  })
}
export default http