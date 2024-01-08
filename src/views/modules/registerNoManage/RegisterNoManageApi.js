import request from "@/utils/request";
import { config } from "@/config"

export const getList = function(data){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/Partner/page",
            JSON.stringify(data), {
            headers: {"Content-Type":"application/json","Data-Type":"json"},
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

//注销
export const destroy = function(data,cb){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/Taxpayer/destroy",
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



