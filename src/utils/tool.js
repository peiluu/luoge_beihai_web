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
/**
 * @description 获取当前属期的xx： 格式比如： 2023年7月
 * @param pre 当前属期的上pre月，默认值0
 */
export const getCurrentMonth = (pre) => {
  const preNumber = pre || 0;
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1 - preNumber;
  return {
    dateValue: `${year}${month < 10 ? '0' + month : month}`,
    dateValueLine: `${year}${month < 10 ? '-0' + month : '-' + month}`,
    dateLabel: `${year}年${month}月`,
  };
};

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
/**
 * @desption 数字金额转大写，支持负数
 */
 function numToCny(money) {
    //汉字的数字
    var cnNums = new Array(
      '零',
      '壹',
      '贰',
      '叁',
      '肆',
      '伍',
      '陆',
      '柒',
      '捌',
      '玖'
    );
    //基本单位
    var cnIntRadice = new Array('', '拾', '佰', '仟');
    //对应整数部分扩展单位
    var cnIntUnits = new Array('', '万', '亿', '兆');
    //对应小数部分单位
    var cnDecUnits = new Array('角', '分');
    //整数金额时后面跟的字符
    var cnInteger = '整';
    //整型完以后的单位
    var cnIntLast = '圆';
    // 如果为负数
    var cnIntMinus = '负';
    // 负号处理后的数字
    var cash;
    //分离金额后用的数组，预定义
    var parts;
    //金额整数部分
    var integerNum;
    //金额小数部分
    var decimalNum;
    //输出的中文金额字符串
    var chineseStr = '';
  
    // 判断空
    if (money == '') {
      return '';
    }
    // 判断正负
    if (money.charAt(0) === '-') {
      chineseStr += cnIntMinus;
      cash = money.slice(1);
    } else {
      cash = money;
    }
    // 转换为浮点数类型,会自动去掉首尾的0
    cash = parseFloat(cash);
    if (cash == 0) {
      chineseStr = cnNums[0] + cnIntLast + cnInteger;
      return chineseStr;
    }
  
    // 转换为字符串
    cash = cash.toString();
    if (cash.indexOf('.') == -1) {
      integerNum = cash; //金额整数部分
      decimalNum = ''; //金额小数部分
    } else {
      parts = cash.split('.');
      integerNum = parts[0]; //金额整数部分
      decimalNum = parts[1].substr(0, 2); //金额小数部分
    }
  
    // 转换整数部分
    if (integerNum != '-' && parseInt(integerNum, 10) > 0) {
      var intLen = integerNum.length;
      var zero = 0; //标记零出现次数
      for (let i = 0; i < intLen; i++) {
        var intChar = integerNum.substr(i, 1);
        var intSlen = intLen - i - 1;
        var divided = intSlen / 4;
        var remain = intSlen % 4;
  
        if (intChar == '0') {
          zero++;
        } else {
          if (zero > 0) {
            chineseStr += cnNums[0];
          }
          zero = 0;
          chineseStr += cnNums[parseInt(intChar)] + cnIntRadice[remain];
        }
        if (remain === 0 && divided > 0) {
          chineseStr += cnIntUnits[divided];
        }
      }
      chineseStr += cnIntLast; //加上'元'字
    }
  
    if (decimalNum != '') {
      // 小数部分存在时
      var decLen = decimalNum.length;
      for (let i = 0; i < decLen; i++) {
        var decChar = decimalNum.substr(i, 1);
        if (decChar != '0') {
          chineseStr += cnNums[parseInt(decChar)] + cnDecUnits[i];
        }
        if (decChar == '0' && parseInt(integerNum, 10) > 0) {
          chineseStr += cnNums[parseInt(decChar)] + cnDecUnits[i];
        }
      }
    } else {
      chineseStr += cnInteger;
    }
    return chineseStr;
  }
export {
    getUUID,
    getFontFamily,
    formatNumber,
    notEmpty,
    isEmpty,
    formatResponse,
    numToCny
}