import { Message } from 'element-ui'
import { auth } from '@/utils/pts/auth'
import { handleRequest, handleError } from './handleRequest'
import Cookies from "js-cookie";

const axios = require('axios')
const CancelToken = axios.CancelToken
const source = CancelToken.source()
const request = axios.create({
    baseURL: process.env.VUE_APP_API,
    timeout: 10000,
})

request.interceptors.request.use(config => {
    config.headers['Accept-Language'] = Cookies.get('language') || 'zh-CN'
    config.headers['token'] = Cookies.get('token') || ''
    return config
}, error => {
    return Promise.reject(error)
})

request.interceptors.response.use((response) =>{
    const res = response.data;
    if (res && res.code && res.code != 0) {
        if (res.msg && res.msg.length > 0) {
            Message.error(res.msg)
        }
        source.cancel('Operation canceled.')
        handleRequest(res);
    }
    return res
},  (error) => {
    const msg = error.response && error.response.data && error.response.data.msg || error.message;
    if (msg && msg.length > 0) {
        Message.error(error.message)
    }
    handleError(error);
    return Promise.reject(error)
});

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

export function getOne(url, params, extendParamNames = null) {
    dealExtendParamNames(extendParamNames);
    return new Promise((resolve, reject) => {
        request.get(`${url}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            params: params
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function postOne(url, id, params, extendParamNames = null) {
    dealExtendParamNames(extendParamNames);
    return new Promise((resolve, reject) => {
        request.post(`${url}`, params, {
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

export function deleteOne(url, id, params) {
    return new Promise((resolve, reject) => {
        request.post(`${url}`, {
            id,
            ...params
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function postJSON(url, params, extendParamNames = null) {
    dealExtendParamNames(extendParamNames);
    return new Promise((resolve, reject) => {
        request.post(url, params, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
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
        request.get(url, {
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

export const customPost = function(url, hearders, params, cb){
    return new Promise((resolve, reject) => {
        request.post(url, params, {
            headers: hearders,
        }).then(res => {
            cb(res);
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export default request
