import request from "@/utils/request";
import { config } from "@/config"

export const getList = function(data){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/Employees/page",
            JSON.stringify(data), {
                headers: {"Content-Type":"application/json","Data-Type":"json"},
            }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export const doReport = function(data,cb){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/Employees/declareEmployee",
            JSON.stringify(data), {
                headers: {"Content-Type":"application/json","Data-Type":"json"},
            }).then(res => {
            resolve(res)
            cb(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export const doSpecialsUpdate = function(data,taxperiod, cb){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/SpecialAdditionalDeduction/getSpecialAmountByEmployee/"+taxperiod,
            JSON.stringify(data), {
                headers: {"Content-Type":"application/json","Data-Type":"json"},
            }).then(res => {
            resolve(res)
            cb(res);
        }).catch(err => {
            reject(err)
        })
    })
}

// 删除
export const del = function(data, cb){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/Employees/deleteById/"+data,
            {}, {
                headers: {"Content-Type":"application/text"},
            }).then(res => {
            resolve(res)
            cb(res)
        }).catch(err => {
            reject(err)
        })
    })
}



