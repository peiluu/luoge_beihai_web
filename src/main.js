import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import App from '@/App'
import i18n from '@/i18n'
import router from '@/router'
import store from '@/store'
import '@/icons'
import '@/element-ui/theme/index.css'
import '@/assets/scss/aui.scss'
import '@/styles/index.scss'
import '@/styles/transition.scss'
import './assets/iconfont/iconfont.css'
import http from '@/utils/request'
import renRadioGroup from '@/components/ren-radio-group'
import renSelect from '@/components/ren-select'
import renDeptTree from '@/components/ren-dept-tree'
import renRegionTree from '@/components/ren-region-tree'
import { hasPermission, getDictLabel,isBlank,getArrayName } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
import VXETable from 'vxe-table';
// import '../vxe-table-variables.scss'
import 'vxe-table/lib/style.css';
import './utils/dialogDrag.js'
import '@/utils/calc.js'
import { getCurrentSsq, getCurrentDate } from "@/utils/tool"
import moment from 'moment'
Vue.config.productionTip = false

Vue.use(Element, {
  size: 'mini',
  // zIndex: 3000,
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(renRadioGroup)
Vue.use(renSelect)
Vue.use(renDeptTree)
Vue.use(renRegionTree)
Vue.use(VXETable);
// 挂载全局
Vue.prototype.$http = http
Vue.prototype.$hasPermission = hasPermission
Vue.prototype.$getDictLabel = getDictLabel
Vue.prototype.isBlank = isBlank
Vue.prototype.getArrayName = getArrayName


//数组过滤
Vue.prototype.filterById = (arr, value) => {
  var len = arr.length, //数组长度
  item;
  for (var i = 0; i < len; i++) {
    item = JSON.parse(JSON.stringify(arr[i]))
    if(item.id==value){
      return item;
    }
  }
  return {};
}

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

String.format = function() { //字符串中赋值变量
  if (arguments.length == 0)
    return null;
  var str = arguments[0];
  for ( var i = 1; i < arguments.length; i++) {
    var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
    str = str.replace(re, arguments[i]);
  }
  return str;
};

new Vue({
  i18n,
  router,
  store, 
  beforeCreate(){
    Vue.prototype.$eventBus = this;
  },
  render: h => h(App)
}).$mount('#app')


Vue.prototype.ceil = (form, field, digit, cb) => {
  if(!form[field] && form[field]!==0) return;
  form[field] = parseFloat(form[field]||0).toFixed(digit);
  if(cb) cb();
}
Vue.prototype.ceil4 = (form, field, cb) => {
  if(!form[field]) return;
  form[field] = parseFloat(form[field]||0).toFixed(4);
  if(cb) cb();
}
//金额保留两位小数
Vue.prototype.numberFmt = (row, column, cellValue, index) => {
  if(cellValue===null) return cellValue;
  return parseFloat(cellValue).toFixed(2);
}
//证件号码脱敏
Vue.prototype.decryptZzhm = (cellValue) => {
  if(cellValue===null) return cellValue;
  let length = cellValue.length;
  if(length > 12){
    let count = length - 9;
    let stars = '';
    for(var i=0 ; i< count ;i++){
      stars += '*';
    }
    return cellValue.replace(/(\w{6})\w*(\w{3})/, '$1'+stars+'$2')
  }else if(length <= 12 && length >=8){
    let count = length - 5;
    let stars = '';
    for(var j=0 ; j< count ;j++){
      stars += '*';
    }
    return cellValue.replace(/(\w{1})\w*(\w{4})/, '$1'+stars+'$2')
  }else if(length <8){
    let count = length - 2;
    let stars = '';
    for(var k=0 ; k< count ;k++){
      stars += '*';
    }
    return cellValue.replace(/(\w{1})\w*(\w{1})/, '$1'+stars+'$2')
  }

}

//手机号码脱敏
Vue.prototype.decryptphone = (cellValue) => {
  if(cellValue===null) return cellValue;
  return cellValue.replace(/(\w{3})\w*(\w{4})/, '$1****$2')
}

//通用校验
//纳税人识别号         15-20位的字母数字组合
Vue.prototype.validateNsrsbm = (rule, value, callback) => {
  if(!value) callback();
  var re = /^[a-zA-Z0-9]+$/;
  if (!re.test(value) || (value.length < 15 || value.length > 20) ) callback(new Error('请输入15-20位数字和字母'));
  callback();
};

//地区编号      6位数字
Vue.prototype.validateDqbh = (rule, value, callback) => {
  if(!value) callback();
  var re = /^[1-9][0-9]{5}$/i;
  if (!re.test(value)) callback(new Error('请输入6位数字'));
  callback();
}

//外管证编号         字母数字组合
Vue.prototype.validateWgzbh = (rule, value, callback) => {
  if(!value) callback();
  var re = /^[a-zA-Z0-9]+$/;
  if (!re.test(value)) callback(new Error('请输入数字和字母'));
  callback();
};

//身份证号详细校验规则
Vue.prototype.verify_idcard = (rule, value, callback) => {
  if(!value) callback();
  let city={ 11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",
    22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",
    35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",
    45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",
    61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "
  };
  let tip = "";
  let pass= true;
  if(!value || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value)){
    tip = "请输入正确的身份证号码";
    pass = false;
  }else if(!city[value.substr(0,2)]){
    tip = "请输入正确的身份证号码";
    pass = false;
  }else {
    //18位身份证需要验证最后一位校验位if(code.length == 18){
    value = value.split('');
    // ∑(ai×Wi)(mod 11)//加权因子
    let factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
    //校验位
    let parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
    let sum = 0;
    let ai = 0;
    let wi = 0;
    for (let i = 0; i < 17; i++) {
      ai = value[i];
      wi = factor[i];
      sum += ai * wi;
    }
    let last = parity[sum % 11];
    if(parity[sum % 11] != value[17]){
      tip = "请输入正确的身份证号码";
      pass =false;
    }
  }
  if(!pass){
    callback(new Error(tip));
  }else {
    callback();
  }
}
//校验各类证件号码，不能有特殊字符
Vue.prototype.verifyZzhm = (rule, value, callback) => {
  if(!value) callback();
  var re = /!|@|#|\$|%|\^|&|\*|\\-|\+|=|<|>|\/|:|;|\\'|\\"|\||\\|`|~/;
  if (re.test(value)) callback(new Error('不能有特殊字符'));
  callback();
}

//校验中文姓名
Vue.prototype.verify_person_name = (rule, value, callback) => {
  if(!value) callback();
  var re = /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/;
  if (!re.test(value)) callback(new Error('格式不正确，请输入正确姓名'));
  callback();
}

//校验手机号码
Vue.prototype.verify_mobile = (rule, value, callback) => {
  if(!value) callback();
  var re = /^(0|86|17951)?(13[0-9]|14[01456789]|15[012356789]|16[567]|17[01345678]|18[0-9]|19[189])[0-9]{8}$/i;
  if (!re.test(value)) callback(new Error('请输入正确的手机号码'));
  callback();
}

//校验电子邮箱
Vue.prototype.verify_email = (rule, value, callback) => {
  if(!value) callback();
  var reg = /^([a-zA-Z]|[0-9])(\w|\.)+@[a-zA-Z0-9]+(\.([a-zA-Z]{2,}))+$/;
  if (!reg.test(value)) callback(new Error('邮箱格式不正确'));
  callback();
}

//根据身份证号码获取性别
Vue.prototype.getGender = (cardNo) => {
  if (cardNo.length === 18) {
    if (cardNo.charAt(16) >= '0' && cardNo.charAt(16) <= '9') {
      if (parseInt(cardNo.charAt(16)) % 2 === 0) {
        return 1
      } else {
        return 0
      }
    }
  }
  if (cardNo.length === 15) {
    if (cardNo.substr(14) >= '0' && cardNo.substr(14) <= '9') {
      if (parseInt(cardNo.charAt(14) % 2 === 0)) {
        return 1
      } else {
        return 0
      }
    }
  }
}

//失去焦点脱敏
Vue.prototype.blurDecrypt = (form, field, fieldReal, cb) => {
  if(!form[field] && form[field]!==0) return;
  var re = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
  if(form[field] == '****'){
      form[fieldReal] = parseFloat('0').toFixed(2);
      form[field] = form[fieldReal];
  }else if(!re.test(form[field])){
      form[fieldReal] = parseFloat('0').toFixed(2);
      form[field] = form[fieldReal];
  }else if(parseFloat(form[field]) == 0){
      form[fieldReal] = parseFloat('0').toFixed(2);
      form[field] = form[fieldReal];
  }else{
      form[fieldReal] = parseFloat(form[field]||0).toFixed(2);
      form[field] = '****';
  }
  if(cb) cb();
}
//获取焦点接触脱敏
Vue.prototype.focusEnDecrypt = (form, field, fieldReal) => {
  if(!form[field]) return;
  form[field] = form[fieldReal];
}



//姓名脱敏
Vue.prototype.decryptXm = (cellValue) => {
  if(cellValue===null) return cellValue;
  let length = cellValue.length;
  if(length > 2){
      let count = length - 2;
      let stars = '';
      for(var i=0 ; i< count ;i++){
          stars += '*';
      }
      return cellValue.substring(0,1)+ stars + cellValue.substring(cellValue.length - 1,cellValue.length)
  }else{
      let count = length - 1;
      let stars = '';
      for(var j=0 ; j< count ;j++){
          stars += '*';
      }
      return cellValue.substring(0,1)+ stars
  }
}
//金额保留两位小数
Vue.prototype.decryptJe = (row, column, cellValue, index) => {
  if(cellValue===null) return cellValue;
  return '****';
}

/**
 * @description 格式化金额,每个3位用逗号分隔
 * @param notFixed 不需要保留两位小数
 */
Vue.prototype.formatMoney = (data, notFixed) => {
  // const str = data ? notFixed ? data.toString() : parseFloat(data).toFixed(2).toString() : '0.00';
  // // const str = data ? data.toFixed(2).toString() : '0.00'
  // const intSum = str.split(".")[0].replace( /\B(?=(?:\d{3})+$)/g, ',' );//取到整数部分
  // // const dot = str.split(".")[1].replace(/\B(?=(?:\d{3})+$)/g, ',') //取到小数部分搜索
  // const dot = str.indexOf(".") > -1 ? str.substring(str.length,str.indexOf(".")) : '' //取到小数部分搜索
  // const ret = intSum + dot;

  return  data ? parseFloat(data).toLocaleString("zh", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) : '0.00'
}

//获取浏览器地址参数
Vue.prototype.getUrlParam = (key =>{
  var url = decodeURI(window.location.href);
  var arr = url.split("?");
  if(arr.length > 1){
    var paramArr = arr[1].split("&");
    for(var i = 0; i < paramArr.length; i++){
      var param = paramArr[i];
      if(param.split("=")[0] == key){
        return param.split("=")[1];
      }
    }
  }
})

/**
 * @description 判断是否是当前属期 从美的二期迁移过来需要找路姐确认
 * @param preSsq 往前的属期
 */
Vue.prototype.judgeIsCurrentSq = (date, type, preSsq) => {
  const { quarterValue, monthValue } = getCurrentSsq('', preSsq || 1, preSsq || 1)
  // return  type == '月' ? monthValue == date : quarterValue == date
  return true
}
/**
 * @description 格式化时间 ，返回属期月份
 * @param fmt 需要的格式
 * @param val 时间
 */
Vue.prototype.formatDate = (fmt, val) => {
  return moment(val).format(fmt)
}

/**
 * @description 格式化时间，支持返回月份或是季度
 * @param date 时间
 * @param returnType 返回类型
 */
Vue.prototype.formatAllDate = (date, returnType) => {
  const { formatQuarterValue = '', formatMonthValue = '' } = getCurrentDate(date)
  return returnType == '月' ? formatMonthValue : formatQuarterValue
}

// 配置输入框失去焦点时显示千分位
Vue.directive("thousands", {
  inserted: function (el, binding) {
    // debugger
    // 获取input节点
    if (el.tagName.toLocaleUpperCase() !== "INPUT") {
      el = el.getElementsByTagName("input")[0];
    }

    setTimeout(() => {
      el.value = el.value ? parseFloat(el.value).toLocaleString("zh", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) : ''
    }, 0)
    // 千分位格式化
    // 聚焦转化为数字格式（去除千分位）
    el.onfocus = e => {
      const a = el.value ? el.value.replace(/,/g, "") : ''; // 去除千分号的','
      el.value = a ? parseFloat(a).toFixed(2) : ''
    };
    // 失去焦点重新格式化
    el.onblur = e => {
      setTimeout(() => {
        // 恢复原始值
        // 格式化为千分位
        el.value = el.value ? parseFloat(el.value).toLocaleString("zh", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) : '0.00'
      }, 0);
    };
  },

});


