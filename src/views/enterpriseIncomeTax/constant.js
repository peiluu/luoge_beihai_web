const transformMap = (list) => {
  const map = {};
  list.forEach((item) => {
    map[item.value] = item.label;
  });
  return map;
};

/**
 * @description 附报事项名称
 */
export const fbsxmcList = [
  { value: '1', label: '扶贫捐赠支出全额扣除' },
  { value: '2', label: '软件、集成电路企业优惠政策适用类型' },
  { value: '3', label: '高新技术企业证书发证时间' },
];
/**
 * @description 企业类型映射MAP
 */
export const fbsxmcMap = transformMap(fbsxmcList);

/**
 * @description 事项类型
 */
export const sxlxList = [
  { value: '1', label: '不征税收入类型' },
  { value: '2', label: '免税收入类型' },
  { value: '3', label: '减计收入类型' },
  { value: '4', label: '所得减免类型' },
];

/**
 * @description 企业类型
 */
export const qylxList = [
  { value: 57187, label: '一般企业' },
  { value: 57188, label: '免税收入跨地区经营汇总纳税企业总机构类型' },
  { value: 57185, label: '跨地区经营汇总纳税企业分支机构' },
];
/**
 * @description 企业类型映射MAP
 */
export const qylxMap = transformMap(qylxList);



/**
 * @description 研发费用加计扣除类型
 */
export const
  xmlxList = [
  {
    value: 1,
    kclx: 'Y',
    label:
      '一般企业开发新技术、新产品、新工艺发生的研究开发费用加计扣除（制造业按100%加计扣除）',
  },
  {
    value: 2,
    kclx: 'Y',
    label:
      '企业开发新技术、新产品、新工艺发生的研究开发费用加计扣除（其他企业按100%加计扣除）',
  },
  {
    value: 3,
    kclx: 'Y',
    label:
      '企业开发新技术、新产品、新工艺发生的研究开发费用加计扣除（科技型中小企业按100%加计扣除）',
  },
  {
    value: 4,
    kclx: 'N',
    label:
      '企业为获得创新性、创意性、突破性的产品进行创意设计活动发生的相关费用加计扣除（制造企业按100%加计扣除）',
  },
  {
    value: 5,
    kclx: 'N',
    label:
      '企业为获得创新性、创意性、突破性的产品进行创意设计活动发生的相关费用加计扣除（其他企业按100%加计扣除）',
  },
  {
    value: 6,
    kclx: 'N',
    label:
      '企业为获得创新性、创意性、突破性的产品进行创意设计活动发生的相关费用加计扣除（科技型中小企业按100%加计扣除）',
  },
  {
    value: 7,
    kclx: 'N',
    label: '企业投入基础研究支出加计扣除（按100%加计扣除）',
  },
];
/**
 * @description 研发费用加计扣除类型Map
 */
export const xmlxMap = transformMap(xmlxList);


/**
 *@description 扣除项目
 */
export const kcmxList = [
  { value: '0', label: '加速折旧、摊销（不含一次性扣除）' },
  { value: '1', label: '一次性扣除' },
];
