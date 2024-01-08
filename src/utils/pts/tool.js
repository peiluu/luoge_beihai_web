const getUUID = function (len, radix) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } 
    else {
        let r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

const getFontFamily = function() {
    const agent = navigator.userAgent.toLowerCase()
    const isMac = /macintosh|mac os x/i.test(navigator.userAgent)
    if (isMac) {
        return {
            fontFamily: 'PingFangSC-Regular'
        }
    }
    else {
        return {
            fontFamily: 'Microsoft YaHei'
        }
    }
}

const formatNumber = function(num) {
    return (num + '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
}

const notEmpty = v => {
    return v && v.length > 0
}

const isEmpty = v => {
    return !notEmpty(v)
}

const formatResponse = function(code, msg, data) {
    return new Promise(resolve => {
        const res = {
            code,
            msg,
            data
        }
        resolve(res)
    })
}

export function dateFormat(fmt, date) {
    if (!date) {
        date = new Date();
    }
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt
}

export {
    getUUID,
    getFontFamily,
    formatNumber,
    notEmpty,
    isEmpty,
    formatResponse,
}