import request from "@/utils/request";
import { config } from "@/config"

export const getList = function(data){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/Taxpayer/page",
            JSON.stringify(data), {
            headers: {"Content-Type":"application/json","Data-Type":"json"},
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

// 删除
export const del = function(data, cb){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/Taxpayer/deleteByIds",
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

//报送
export const doReport = function(data,cb){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/Taxpayer/taxPayerRegister",
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

//导出
export const exportData = function(data, cb){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/Taxpayer/downLoadTaxPayerExcel",
            JSON.stringify(data),
            {
                headers: {"Content-Type":"application/json","Data-Type":"json"},
                responseType: 'blob'
            })
            .then(res => {
                if (res.success == false) {
                    this.$message.error(res.message)
                } else {
                    const content = res.data
                    const blob = new Blob([content])
                    const fileName = '扣缴义务人.xlsx'
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
                }
                cb(res);
            }).catch(err => {
            reject(err)
        })
    })
}


