/**
 * @description 申请统计确认状态
 */
export const jqztMap = {
  '01': '处理成功（统计、撤销）',
  '07': '确认失败，未申请统计',
  '08': '确认失败，不能重复确认',
  '04': '税号不存在',
  '09': '不符合确认条件（当前月与属期相等时）',
  '10': '已确认统计不能撤销',
  '11': '不符合确认条件（当前月与属期相等时）',
  '12': '处理失败，存在异常数据',
  '13': '处理失败，无权限调用此接口',
  '99': '处理失败，汇总纳税人机构清单变化需重新确认'
};

/**
 * @description 不抵扣类型
 */
export const bdklxList = [
  { value: 1, label: '用于非应税项目' },
  { value: 2, label: '用于免税项目' },
  { value: 3, label: '用于集体福利或者个人消费' },
  { value: 4, label: '非正常损失' },
  { value: 5, label: '其他' }
];

function transformList(list) {
  const map = {};
  list.forEach(item => {
    map[item.value] = item.label;
  });
  return map;
}
/**
 * @description 不抵扣类型
 */
export const bdklxMap = transformList(bdklxList);

/**
 * @description 入账状态list
 */
export const purchaserstatusList = [
  // { value: '-1', label: '未设值' },
  { value: '30', label: '未收票' },
  // { value: '33', label: '待提交' },
  // { value: '34', label: '已归集' },
  // { value: '35', label: '未报销' },
  { value: '36', label: '报账中' },
  // { value: '37', label: '未记账' },
  // { value: '39', label: '已报销' },
  { value: '42', label: '已记账' }
];
/**
 * @description 入账状态Map
 */
export const purchaserstatusMap = {
  '-1': '未设值',
  '30': '未收票',
  '33': '待提交',
  '34': '已归集',
  '35': '未报帐',
  '36': '报账中',
  '37': '未记账',
  '39': '已报帐',
  '42': '已记账'
};
/* 入账状态 */
export const  enterAccountStatus = [
  {label:'未入账',value:'01'},
  {label:'入账（企业所得税税前扣除）',value:'02'},
  {label:'入账（企业所得税不扣除）',value:'03'},
  {label:'已入账撤销',value:'06'},
]
/**
 * @description 勾选失败原因
 */
export const failureReason = {
  '02': '查无此票',
  '03': '该票异常无法勾选',
  '04': '该票已经逾期无法认证',
  '05': '当期已锁定（已申请统计）',
  '06': '已勾选无法重复勾选',
  '07': '未到期发票不可勾选',
  '11': '低版本发票',
  '12': '机动车异常发票',
  '13': '该票号码重复',
  '31': '待处理农产品发票未确认',
  '99': '其他'

};
// /**
//  * @description 申请统计状态
//  */
// export const Map = {
//   '01': '未设值',
//   '30': '未收票',
//   '33': '待提交',
//   '34': '已归集',
//   '35': '未报销',
//   '36': '报销中',
//   '37': '未记账',
//   '39': '已报销',
//   '42': '已记账'
// };

/**
 * @description 发票状态List
 */
export const fpztList = [
  { value: 0, label: '正常' },
  { value: 2, label: '作废' },
  { value: 3, label: '已红冲' },
  { value: 7, label: '部分红冲' },
  { value: 8, label: '全额冲红' },
];
/**
 * @description 发票状态Map
 */
export const fpztMap = transformList(fpztList);
