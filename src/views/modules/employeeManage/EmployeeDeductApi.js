import request from "@/utils/request";
import { config } from "@/config"

export const getList = function(data){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/SpecialAdditionalDeduction/page",
            JSON.stringify(data), {
                headers: {"Content-Type":"application/json","Data-Type":"json"},
            }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}




