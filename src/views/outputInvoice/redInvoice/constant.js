/**
 * @desption 红字发票信息确认单状态列表
 */
export const confirmStatusList = [
  { value: '00', label: '草稿中', class: 'orange-cell' },
  { value: '01', label: '无需确认', class: 'green-cell' },
  { value: '02', label: '销方录入待购方确认', class: 'orange-cell' },
  { value: '03', label: '购方录入待销方确认', class: 'orange-cell' },
  { value: '04', label: '购销双方已确认', class: 'green-cell' },
  { value: '05', label: '作废（销方录入购方否认）', class: 'red-cell' },
  { value: '06', label: '作废（购方录入销方否认）', class: 'red-cell' },
  { value: '07', label: '作废（超72小时未确认）', class: 'red-cell' },
  { value: '08', label: '发起方撤销', class: 'red-cell' },
  { value: '09', label: '作废（确认后撤销）', class: 'red-cell' },
  { value: '10', label: '作废（异常凭证）', class: 'red-cell' },
  { value: '11', label: '审核中', class: 'orange-cell' },
  { value: '12', label: '审核不通过', class: 'red-cell' }
];

/**
 * @desption 红字发票信息确认单审核状态list
 */
export const examineStatusList = [
  { value: 0, label: '无需审核', class: 'green-cell' },
  { value: 1, label: '待审核', class: 'orange-cell' },
  { value: 2, label: '审核通过', class: 'green-cell' },
  { value: 3, label: '审核不通过', class: 'red-cell' }
];

function transformMap(list) {
  const map = {};
  list.forEach(item => {
    map[item.value] = {
      label: item.label,
      class: item.class
    };
  });
  return map;
}

/**
 * @description 红字发票信息确认单状态映射MAP
 */
export const confirmStatusMap = transformMap(confirmStatusList);

/**
 * @description 红字发票信息审核状态映射MAP
 */
export const examineStatusMap = transformMap(examineStatusList);

/**
 * @description 红冲原因代码
 */
export const chyyDmMap = {
  '01': '开票有误',
  '02': '销货退回',
  '03': '服务中止',
  '04': '销售折让'
};
