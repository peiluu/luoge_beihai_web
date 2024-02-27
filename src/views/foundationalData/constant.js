/**
 * @description 征税项目
 */
export const zsxmList = [
  { value: '1', label: '货物' },
  { value: '2', label: '劳务' },
  { value: '3', label: '服务' },
  { value: '4', label: '无形资产' },
  { value: '5', label: '不动产' },
  { value: '6', label: '不征税项目' },
];

/**
 * @description 视同销售收入征税项目
 */
export const zsxm_stxs = [
  { value: '1', label: '货物' },
  { value: '2', label: '劳务' },
  { value: '3', label: '服务、不动产和无形资产' },
];
/**
 * @description 计税项目
 */
export const jsxm_stxs = [
  { value: '0', label: '一般项目' },
  { value: '1', label: '即征即退项目' },
];

/**
 * @description 发票类型
 */
export const fplxList = [
  { value: '1', label: '增值税电子普通发票' },
  { value: '2', label: '增值税电子专用发票' },
  { value: '3', label: '增值税普通发票' },
  { value: '4', label: '增值税专用发票' },
  { value: '31', label: '数电增值税专用发票' },
  { value: '32', label: '数电增值税普通发票' },
];

/**
 * @description 计税方式
 */
export const jsfsList = [
  { value: '1', label: '一般计税' },
  { value: '2', label: '简易计税' },
  { value: '3', label: '免税' },
  { value: '4', label: '其他' },
];

/**
 * @description 一般纳税人税率
 */
export const slvList = [
  { value: '0.13', label: '13%' },
  { value: '0.09', label: '9%' },
  { value: '0.06', label: '6%' },
  { value: '0.05', label: '5%' },
  { value: '0.04', label: '4%' },
  { value: '0.03', label: '3%' },
  { value: '0.01', label: '1%' },
  { value: '0', label: '免税' },
  // {value: '', label: '不征税'},
];

/**
 * @description 小规模纳税人税率
 */
export const slvListSmall = [
  { value: '0.05', label: '5%' },
  { value: '0.03', label: '3%' },
  { value: '0.01', label: '1%' },
  { value: '0', label: '免税' },
  // {value: '', label: '不征税'},
];

/**
 * @description 视同销售交易类型
 */
export const jylxList = [
  { value: '1', label: '将货物交付其他单位或个人代销' },
  { value: '2', label: '销售代销货物' },
  { value: '3', label: '非同一市县机构间移送' },
  { value: '4', label: '将自产、委托加工的货物用于非增值税应税项目' },
  { value: '5', label: '将自产、委托加工的货物用于集体福利/个人消费' },
  { value: '6', label: '将自产、委托加工、购进的货物用于对外投资' },
  { value: '7', label: '将自产、委托加工、购进的货物用于分配给股东或投资者' },
  {
    value: '8',
    label: '将自产、委托加工、购进的货物用于无偿赠送他人/对外捐赠',
  },
  { value: '9', label: '向其他单位或者个人无偿提供服务' },
  { value: '10', label: '向其他单位或者个人无偿转让无形资产或者不动产' },
];

/**
 * @description 科目类型
 */
export const kmlxList = [
  { value: '1', label: '会计确认收入' },
  { value: '2', label: '预收账款收入' },
  { value: '3', label: '其他应付款' },
  { value: '4', label: '财务费用' },
  { value: '5', label: '其他应收款' },
];
/**
 * @description 业态
 */
export const ytList = [
  { value: '1', label: '房地产' },
  { value: '2', label: '物业' },
  { value: '3', label: '睿住' },
  { value: '4', label: '商业' },
  { value: '5', label: '材料公司' },
  { value: '6', label: '集团总部' },
];

/**
 * @description 计税方式
 */
export const jsfs_List = [
  { value: '0', label: '一般纳税人一般计税' },
  { value: '1', label: '一般纳税人简易计税' },
  { value: '2', label: '小规模纳税人简易计税' },
];
