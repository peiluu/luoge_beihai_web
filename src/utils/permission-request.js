import { Message } from 'element-ui'
import { auth } from '@/utils/auth'
import { handleRequest, handleError } from './handleRequest'

const axios = require('axios')
const CancelToken = axios.CancelToken
const source = CancelToken.source()
const request = axios.create({
    baseURL: process.env.VUE_APP_AUTH_API,
    timeout: 60000,
    withCredentials: true
})

request.interceptors.request.use(config => {
    let tgTicket = auth.getToken()
    if (tgTicket){
        config.headers['accessToken'] = tgTicket;
    }
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

export default request