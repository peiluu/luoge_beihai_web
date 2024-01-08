import request from "@/utils/request";
import { config } from "@/config"
import store from '@/store'

export const getList = function(data){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/ComprehensiveTax/page/"+store.state.user.taxPeriod,
            JSON.stringify(data), {
                headers: {"Content-Type":"application/json","Data-Type":"json"},
            }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export const batchCaltax = function(data,cb){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/ComprehensiveIncome/calculationTaxOneTaxpayer",
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

export const batchConfirm = function(data,cb){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/ComprehensiveIncome/calculationTaxOneTaxpayerConfirm",
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

export const batchCancel = function(data,cb){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/ComprehensiveIncome/calculationTaxOneTaxpayerCancel",
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

export const batchExport = function(data,cb){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/ComprehensiveTax/downLoadExcelByIds",
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
                    const fileName = '员工薪资.xlsx'
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

