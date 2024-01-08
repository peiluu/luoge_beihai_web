import request from "./pts/request";
import { config } from "@/config"
//上传
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

//获取当前自然月的上个月份
export const lastMonth = function(cb){
    return new Promise((resolve, reject) => {
        request.post(config.host + "/commom/getMonth", {}, {
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(res => {
            cb(res);
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export const getPeriodRange = function(period, cb){
    return new Promise((resolve, reject) => {
        request.post(config.host + "/commom/getPeriodRange/"+period, {}, {
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(res => {
            cb(res);
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
