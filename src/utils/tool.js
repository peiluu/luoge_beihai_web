import { config } from "@/config"
import { numberMap, slListMap } from '@/config/constant'
import moment from 'moment';

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

/**
 * @description 格式化时间
 */
export function dateFormat(fmt, value) {
  let date = value ? new Date(value) : new Date();
  let ret;
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
      );
    }
  }
  return fmt;
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
  /**
 * @description 发票预览
 */
 const previewPdf = (data, url = '/previewPdf') => {
    const href = `${config.host}${url}/${data.id}`;
    const openObj = window.open(href,'发票预览');
    // const loop = setInterval(() => {
    //   if (window.closed) {
    //     clearInterval(loop);
    //   } else {
    //     openObj.document.title = '发票预览';
    //   }
    // }, 1000);
  };

  /**
 * @description 获取当前的属期
 */
const getCurrentSsq = () => {
  const defaultDate = new Date();
  const currentMonth = defaultDate.getMonth() + 1
  const currentYear = defaultDate.getFullYear();
  // 按月申报 1月的属期的是上年度12月
  const month = currentMonth == 1 ? 12 : currentMonth
  const year = currentMonth == 1 ? currentYear - 1 : currentYear;
  // 按季度申报 1、2、3月的属期的是上年度第四季度(10月起)
  const quarterMonth = currentMonth < 4 ? 10 : currentMonth - 3
  const quarterYear = currentMonth < 4 ? currentYear - 1 : currentYear;
  return {
    // 按月申报
    monthValue: `${year}${month < 10 ? '0' + month : month}`,
    formatMonthValue: `${year}-${month < 10 ? '0' + month : month}`,
    // 按季申报
    quarterValue: `${quarterYear}${InitialTime(whitchQuarter(quarterMonth))}`,
    formatQuarterValue: `${quarterYear}年${whitchQuarter(quarterMonth)}季度`,
      // 单季度 （第一季度）
    singleQuarter: `第${numberMap[whitchQuarter(month)].label}季度`,
  };
};
/**
 * @description 按照年月转化为季度和月度
 * @param propsMonth 需要转化为的月份
 */
const getCurrentDate = (propsMonth) => {
  if (!propsMonth) {
    return { }
  }
  const defaultDate = new Date(moment(propsMonth))
  const month = defaultDate.getMonth() + 1;
  const year = defaultDate.getFullYear();
  return {
    formatQuarterValue: `${year}年${whitchQuarter(month)}季度`,
    formatMonthValue: `${year}-${month < 10 ? '0' + month : month}`,
    monthValue: `${year}${month < 10 ? '0' + month : month}`,
    quarterValue: `${year}${InitialTime(whitchQuarter(month))}`,

  };
};
// 季度时间判定
const InitialTime = (val) => {
  let num = '';
  val = Number(val);
  switch (val) {
    case 1:
      num = '03';
      break;
    case 2:
      num = '06';
      break;
    case 3:
      num = '09';
      break;
    case 4:
      num = '12';
      break;
    default:
      // console.error('时间格式有误！');
  }
  return num;
};
/**
 * @description 获取税率代码对应的计算税率
 * @param slCode 税率代码 1 => 10% => 0.1
 */
export const geComputedSl = (slCode) => {
  return parseFloat(slListMap[slCode].replace('%', '') / 100)
};
/**
 * @description 根据输入的月份判断是哪一个季节
 */
export const whitchQuarter = (month) => {
  let quarter = '';
  month = Number(month);
  switch (month) {
    case 1:
    case 2:
    case 3:
      quarter = '1';
      break;
    case 4:
    case 5:
    case 6:
      quarter = '2';
      break;
    case 7:
    case 8:
    case 9:
      quarter = '3';
      break;
    case 10:
    case 11:
    case 12:
      quarter = '4';
      break;
    default:
      // console.error('The entered time is incorrect');
  }
  return quarter;
};
/**
 * @description 获取当前年份倒数n年的年份
 * @param n 倒数的年份, 默认值为5
 */
export const getPreYearList = (nowYear, n) => {

  const yearNumber = n || 5;
  let now = new Date(nowYear);
  let year = now.getFullYear() -1 ;
  const list = [];
  let index = 1;
  for (let i = year; i > year - yearNumber; i--) {

    list.push({
      label: `前${numberMap[index].label}年度（${i}年）`,
      propsKey: numberMap[index].propsKey
    });
    index ++
  }
  return list;
};
/**
 * @description 获取当前月份的属期的xx： 格式比如： 2023年7月
//  * @param next 当前属期的后next月，默认值0
 */
export const getCurrentMonthSsq = () => {
  // 1月的属期的是上年度12月
  let now = new Date();
  let currentYear = now.getFullYear();
  let currentMonth = now.getMonth() + 1
  const month = currentMonth == 1 ? 12 : currentMonth - 1;
  const year = currentMonth == 1 ? currentYear - 1 : currentYear;
  return {
    dateValue: `${year}${month < 10 ? '0' + month : month}`,
    dateValueLine: `${year}${month < 10 ? '-0' + month : '-' + month}`,
    dateLabel: `${year}年${month}月`,
  };
};
/**
 * @description 获取当前年份倒数n年的年份列表
 * @param n 倒数的年份, 默认值为5
 */
export const getCurrentYearList = (n) => {
  const yearNumber = n || 5;
  let now = new Date();
  let year = now.getFullYear();
  const list = [];
  for (let i = year; i > year - yearNumber; i--) {
    list.push(i);
  }
  return list;
};
/**
 * @description 获取属期数组
 */
export const getssqArr = (ssq, tbzq) => {
  // 按月
  const formatSsq = moment(ssq).format('YYYY-MM');
  if (tbzq == '月') {
    return [formatSsq, formatSsq]
  } else {
    // 按季度，起始月份往前推2月
    const ssqStart = moment(ssq).subtract(2, "months").format("YYYY-MM");
    return [ssqStart, formatSsq]
  // 按季度
  }
};
// 节流throttle代码（定时器）：
export const throttle = (func, delay, type = false) => {
  var timer = null;
  return function () {
    var context = this;
    var args = arguments;

    if (!timer) {
      timer = setTimeout(function () {
        func.apply(context, args);
        clearTimeout(timer);
        timer = null;
      }, delay);
    }
  };
};
// 防抖
export const debounce = (func, wait, immediate) => {
  let timer;
  return function () {
    let context = this;
    let args = arguments;

    if (timer) clearTimeout(timer);
    if (immediate) {
      var callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timer = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  };
};
/**
   * 根据自身节点寻找上级，并返回所有上级和自身
   * 类多叉树查找如：[ {id:1,children:[{id:11},{id: 12}],... }, {id:2,children:[{id:21,...},{id: 22,...}],...} ]
   * 查找id===22, 返回 [{id:2, ...},{id:22, ...}]
   * @param {数据源} data 
   * @param {查询目标：对象形式{fieldName: '查询比较的字段名',value: '要查询的值'}} target 
   * @param {子元素key名称 有的树并不是用children名称做子节点} child 
   * @param {数组：[]} indexArray 
   * @returns 查询到则返回数组：[..., targetGrandfather, targetParent, target] ，否则返回 布尔类型 false
   */
export const findAllAncestors = (data, target, child = 'children', indexArray = []) => {
  let arr = Array.from(indexArray); // 数组浅拷贝
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i];
    // 过滤掉children节点，避免返回数据过大
    const targetArr = Object.keys(item).reduce((pre, curr) => {
      if (curr !== child) {
        pre[curr] = item[curr]
      }
      return pre;
    }, {})
    arr.push(targetArr);
    if (item[target.fieldName] === target.value) {
      return arr;
    }
    let children = item[child];
    if (children && children.length) {
      let result = findAllAncestors(children, target, child, arr);
      if (result) return result;
    }
    arr.pop();
  }
  return false;
}
export {
    getUUID,
    getFontFamily,
    formatNumber,
    notEmpty,
    isEmpty,
    formatResponse,
    numToCny,
    previewPdf,
    getCurrentSsq,
    getCurrentDate,
    InitialTime
}