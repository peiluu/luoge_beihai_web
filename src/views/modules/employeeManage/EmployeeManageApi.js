import request from "@/utils/request";
import { config } from "@/config"

const axios = require('axios')
export const getList = function(data){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/Taxpayer/ygpage",
            JSON.stringify(data), {
                headers: {"Content-Type":"application/json","Data-Type":"json"},
            }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export const saveEmployee = function(data, cb){
    //涉税事由在前端是数组，在后端是string，转换处理
    var json = JSON.parse(JSON.stringify(data));        //处理深拷贝
    json.sssx = convertToStr(json.sssx);
    let url ;
    if(data.id){
        url = config.host+"/Employees/update";
    }else {
        url = config.host+"/Employees/add"
    }
    //处理地址
    if(data.jcjzd){
        data.lxdzSheng = data.jcjzd[0] || '';
        data.lxdzShi = data.jcjzd[1] || '';
        data.lxdzQx = data.jcjzd[2] || '';
        data.lxdzJd = data.jcjzd[3] || '';
    }
    if(data.wjrlxdz){
        data.wjrlxdzSheng = data.wjrlxdz[0] || '';
        data.wjrlxdzShi = data.wjrlxdz[1] || '';
        data.wjrlxdzQx = data.wjrlxdz[2] || '';
        data.wjrlxdzJd = data.wjrlxdz[3] || '';
    }
    if(data.hjszd){
        data.hjszdSheng = data.hjszd[0] || '';
        data.hjszdShi = data.hjszd[1] || '';
        data.hjszdQx = data.hjszd[2] || '';
        data.hjszdJd = data.hjszd[3] || '';
    }
    return new Promise((resolve, reject) => {
        request.post(url,JSON.stringify(json), {
                headers: {"Content-Type":"application/json","Data-Type":"json"},
            }).then(res => {
            resolve(res)
            cb(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export const convertToStr = function(array){
    let str = "";
    if(array && array.length > 0){
        array.forEach(e => {
            str += e + ",";
        })
    }
    if(str.length > 0){
        str = str.substring(0, str.length - 1);
    }
    return str;
}

export const doReport = function(data,cb){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/Employees/declareEmployeeBatch",
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

export const doExport = function(data, cb){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/Employees/downEmployeeLoadExcel",
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
                /*const fileName = '合作方员工.xlsx'*/
                const fileName = '员工列表.xlsx'
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

export const doSpecialsUpdate = function(data,taxperiod, cb){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/SpecialAdditionalDeduction/getSpecialAmount/"+taxperiod,
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

export const doSpecialsExport = function(data,period, cb){
    return new Promise((resolve, reject) => {
        request.post(config.host+"/SpecialAdditionalDeduction/downLoadSpecialAmount/"+period,
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
                    /*const fileName = '合作方专项附加.zip'*/
                    const fileName = '专项附加.zip'
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


