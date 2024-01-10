export const urlMapEnv = {
  // 测试环境 - 本地地址
  development: {
    // 税控蓝票开具
    handBlueInvoice1: {
      url: 'http://127.0.0.1:3000/ent-views/#/handInvoice/handByInvType_wb/1',
      title: '增值税电子普通发票',
    },
    handBlueInvoice2: {
      url: 'http://127.0.0.1:3000/ent-views/#/handInvoice/handByInvType_wb/2',
      title: '增值税电子专用发票',
    },
    handBlueInvoice3: {
      url: 'http://127.0.0.1:3000/ent-views/#/handInvoice/handByInvType_wb/3',
      title: '增值税普通发票',
    },
    handBlueInvoice4: {
      url: 'http://127.0.0.1:3000/ent-views/#/handInvoice/handByInvType_wb/4',
      title: '增值税专用发票',
    },
    // 红票开具
    handRedInvoice: {
      url: 'http://127.0.0.1:3000/ent-views/#/handRedInvoice/handRedInvoice_wb',
      title: '红票开具',
    },
    // 红票填开
    redinfoApply: {
      url: 'http://127.0.0.1:3000/ent-views/#/redinfoApply/RedinfoApply/',
      title: '红票填开',
    },
    // 进项管理
    checkSave: {
      url: 'http://127.0.0.1:3000/ent-views/#/checkSave/checkAuth_wb',
      title: '发票勾选',
    },
    confirmTick: {
      url: 'http://127.0.0.1:3000/ent-views/#/confirmTick/confirmCheck_wb',
      title: '抵扣勾选统计',
    },
    // 待支付税金
    taxPayment: {
      url: 'https://127.0.0.1:3000/ent-views/#/taxPayment/taxPayment',
      title: '待支付税金',
    },
    // 消息通知
    warningMessage: {
      url: 'https://127.0.0.1:3000/ent-views/#/warningMessage/warningMessage_wb',
      title: '消息通知',
    },
    // 企业纳税概览详情
    corporateIncomeTax: {
      url: 'https://127.0.0.1:3000/ent-views/#/home/taxStatisticsQuery/corporateIncomeTax/',
      title: '企业纳税概览详情',
    },
  },
  // 测试环境 - 线上地址
  production: {
    // 销项管理
    // 税控蓝票开具
    handBlueInvoice1: {
      url: 'https://mtc-sit-k8s.mideazy.com/ent-views/#/handInvoice/handByInvType_wb/1',
      title: '增值税电子普通发票',
    },
    handBlueInvoice2: {
      url: 'https://mtc-sit-k8s.mideazy.com/ent-views/#/handInvoice/handByInvType_wb/2',
      title: '增值税电子专用发票',
    },
    handBlueInvoice3: {
      url: 'https://mtc-sit-k8s.mideazy.com/ent-views/#/handInvoice/handByInvType_wb/3',
      title: '增值税普通发票',
    },
    handBlueInvoice4: {
      url: 'https://mtc-sit-k8s.mideazy.com/ent-views/#/handInvoice/handByInvType_wb/4',
      title: '增值税专用发票',
    },
    // 红票开具
    handRedInvoice: {
      url: 'https://mtc-sit-k8s.mideazy.com/ent-views/#/handRedInvoice/handRedInvoice_wb',
      title: '红票开具',
    },
    // 红票填开
    redinfoApply: {
      url: 'https://mtc-sit-k8s.mideazy.com/ent-views/#/redinfoApply/RedinfoApply',
      title: '红票填开',
    },
    // 进项管理
    checkSave: {
      url: 'https://mtc-sit-k8s.mideazy.com/ent-views/#/checkSave/checkAuth_wb',
      title: '发票勾选',
    },
    // 待支付税金
    taxPayment: {
      url: 'https://mtc-sit-k8s.mideazy.com/ent-views/#/taxPayment/taxPayment',
      title: '待支付税金',
    },
    // 消息通知
    warningMessage: {
      url: 'https://mtc-sit-k8s.mideazy.com/ent-views/#/warningMessage/warningMessage_wb',
      title: '消息通知',
    },
      // 企业纳税概览详情
    corporateIncomeTax: {
      url: 'https://mtc-sit-k8s.mideazy.com/ent-views/#/home/taxStatisticsQuery/corporateIncomeTax',
      title: '企业纳税概览详情',
    },
  },
};

/**
 * @description 台账配置
 *
 */
export const ledgerConfig = {
  allowUpdatePreData: false, // 允许修改往期数据
  allowAddNextData: false, // 允许添加后期数据
}

/**
 * @description 访问税务平台对应环境的页面地址
 */
export const urlMap = urlMapEnv[process.env.NODE_ENV];

function transformUrlMap() {
  const map = {};
  for (let key in urlMap) {
    map[urlMap[key].url] = urlMap[key].title;
  }
  return map;
}

/**
 * @description 税务平台iframe页面url对应的tab页标题
 */
export const urlTitleMap = transformUrlMap();

function transformFplx(list) {
  const map = {};
  list.forEach((item) => {
    map[item.value] = item.label;
  });
  return map;
}

/**
 * @description 发票种类List - 进项销项通用
 */
export const fplxList = [
  { value: '01', label: '增值税专用发票' },
  { value: '02', label: '货物运输业增值税专用发票' },
  { value: '03', label: '机动车销售统一发票' },
  { value: '04', label: '增值税普通发票' },
  { value: '08', label: '增值税电子专用发票' },
  { value: '10', label: '增值税电子普通发票' },
  { value: '11', label: '卷式发票' },
  { value: '14', label: '通行费发票' },
  { value: '15', label: '二手车销售统一发票' },
  { value: '31', label: '电子发票（增值税专用发票）' },
  { value: '32', label: '电子发票（普通发票）' },
  // { value: '85', label: '纸质发票（增值税专用发票））' },
  // { value: '86', label: '纸质发票（普通发票）' },
  // { value: '51', label: '电子发票（铁路电子客票）' },
  // { value: '61', label: '电子发票（航空运输客票电子行程单）' }
];
/**
 * @description 发票种类Map
 */
export const fplxMap = transformFplx(fplxList);
/**
 * @description 进项发票种类List
 */
export const inputFplxList = [
  { value: '01', label: '增值税专用发票' },
  { value: '02', label: '货物运输业增值税专用发票' },
  { value: '03', label: '机动车销售统一发票' },
  { value: '04', label: '增值税普通发票' },
  { value: '08', label: '增值税电子专用发票' },
  { value: '10', label: '增值税电子普通发票' },
  { value: '11', label: '卷式发票' },
  { value: '14', label: '通行费发票' },
  { value: '15', label: '二手车销售统一发票' },
  { value: '81', label: '数电增值税专用发票' },
  { value: '82', label: '数电增值税普通发票' },
  // { value: '51', label: '电子发票（铁路电子客票）' },
  // { value: '61', label: '电子发票（航空运输客票电子行程单）' }
];

/**
 * @description 进项发票种类Map
 */
export const inputFplxMap = transformFplx(inputFplxList);

/**
 * @description 销项发票种类List
 */
export const outputFplxList = [
  { value: '01', label: '数电增值税专用发票' },
  { value: '02', label: '数电增值税普通发票' },
];

/**
 * @description 销项发票种类Map
 */
export const outputFplxMap = {
  '01': '数电增值税专用发票',
  '02': '数电增值税普通发票',
};

export const dynamicUrlMap = {
  // 测试环境 - 本地地址
  development: {
    mtcLoginUrl: 'https://mtc-sit-k8s.mideazy.com/piaoeda-cloud/cas/',
    frontUrl: 'https://mtclq-uat.mideazy.com/',
    testUrl: 'https://mtc-sit-k8s.mideazy.com/ent-views/#/warningMessage/warningMessage_wb/',
  },
  // 测试环境 - 线上地址
  uat: {
    mtcLoginUrl: 'https://mtc-sit-k8s.mideazy.com/piaoeda-cloud/cas/',
    frontUrl: 'https://mtclq-uat.mideazy.com/',
    testUrl: 'https://mtc-sit-k8s.mideazy.com/ent-views/#/warningMessage/warningMessage_wb/',
  },
  // 测试环境 - 线上地址
  production: {
    mtcLoginUrl: 'https://mtc-sit-k8s.mideazy.com/piaoeda-cloud/cas/',
    frontUrl: 'https://mtclq-uat.mideazy.com/',
    testUrl: 'https://mtc-sit-k8s.mideazy.com/ent-views/#/warningMessage/warningMessage_wb/',
  },
};

/**
 * @description 表单输入正则限制合集
 */
export const regCollection = {
  // 电话（包含十几号）
  phone: {
    pattern:
      /^((0\d{2,3})-?)?(\d{7,8})(-(\d{3,}))?$|^1[3|4|5|6|7|8|9]\d{9}$|^400[0-9]{7}$/,
    message: '电话号码格式不正确',
  },
  // 纳税人识别号
  nsrsbh: {
    pattern:
      /^[a-zA-Z0-9]{8}$|^[a-zA-Z0-9]{9}$|^[a-zA-Z0-9]{11}$|^[a-zA-Z0-9]{12}$|^[a-zA-Z0-9]{15}$|^[a-zA-Z0-9]{16}$|^[a-zA-Z0-9]{17}$|^[a-zA-Z0-9]{18}$|^[a-zA-Z0-9]{19}$|^[a-zA-Z0-9]{20}$/,
    message: '请输入正确的纳税人识别号',
  },
  // 金额（两位小数）
  money: {
    pattern:
      /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
    message: '请输入正确的金额格式',
  },
  // 发票开具限额
  limit: {
    pattern: /^([1-9][0-9]{0,8})(\.[0-9]{1,2})?$|^([0])(\.[0-9]{1,2})?$/,
    message: '请输入非0开头，不超过9位数(允许有两位小数)',
  },
  // 发票代码
  fpdm: {
    pattern: /^\d{10}$|^\d{12}$/,
    message: '请输入正确的发票代码',
  },
  // 发票号码
  fphm: {
    pattern: /^\d{8}$/,
    message: '请输入正确的发票代码',
  },
  // 身份证号码
  idCard: {
    pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    message: '请输入正确的身份证号码',
  },
};

/**
 *@description 数字映射大写
 */
export const numberMap = {
  1: { label: '一', propsKey: 'first' },
  2: { label: '二', propsKey: 'second' },
  3: { label: '三', propsKey: 'third' },
  4: { label: '四', propsKey: 'fourth' },
  5: { label: '五', propsKey: 'fifth' },
  6: { label: '六', propsKey: 'sixth' },
  7: { label: '七', propsKey: 'seventh' },
  8: { label: '八', propsKey: 'eighth' },
  9: { label: '九', propsKey: 'ninth' },
  10: { label: '十', propsKey: 'tenth' },
};

/**
 *@description  限制输入两位小数的金额
 */

export const limitMoneyMsg = [
  { required: true, message: '请输入', trigger: 'blur' },
  {
    pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/,
    message: '请输入最多2位小数的数字',
  },
];

/**
 *@description 台账税率映射
 */
export const slListMap = {
  1: '1%',
  2: '3%',
  3: '5%',
  4: '6%',
  5: '9%',
  6: '13%',
  7: '免税',
  8: '不征税',
  9: '免抵退',
  10: '4%',
};

/**
 *@description 征税项目映射
 */
export const zsxmMap = {
  1: '销售不动产',
  3: '服务、不动产和无形资产',
  // 1: '货物',
  // 2: '加工修理修配劳务',
  // 3: '服务、不动产和无形资产',
  // 4: '货物及加工修理修配劳务',
  5: '其中:销售使用过的固定资产和旧货',
  // 6: '货物及劳务',
  // 7: '其中：销售不动产',
};
