import request from "@/utils/request";
import { config } from "@/config"

export const getList = function(data){
    return new Promise((resolve, reject) => {
        /** 产品化SaaS调用 */
        let requestUrl = config.host+"/monthly/traffic/list";
        /** 美的调用地址 */
        // let requestUrl = config.host+"/api/taxpayer/traffic";
        request.post(requestUrl,
            JSON.stringify(data), {
            headers: {"Content-Type":"application/json","Data-Type":"json"},
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}