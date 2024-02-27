import { postJSON, download } from '@/utils/request';
import { config } from '@/config'

// 获取列表
export const getList = (data) => postJSON(`${config.host}/ledger/queryPrepaidShare`, data);

/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = (data) => postJSON(`${config.host}/orgnization/getOrgList`, data);

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = (data) => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @desption Excel导出
 */
export const exportInvoiceDetailList = (data) =>
  download(`${config.host}/ledger/downloadOutputTax`, data);
/**
 * @description 取数
 */
export const fetchPrepaidShare = (data) =>
  postJSON(`${config.host}/ledger/fetchPrepaidShare `, data);

/**
 * @description 所有总机构名称、识别号
 */
export const queryAllOrg = (data) => postJSON(`${config.host}/ledger/queryAllOrg`, data);

// /**
//  * @description 所有分支机构名称、识别号
//  */
// export const queryBranchOrg = (data) =>
//   postJSON(`${config.host}/ledger/queryBranchOrg`, data);

/**
 * @description 通过总机构识别号获取所有分支机构名称、识别号
 */
export const queryBranchOrg = (data) => postJSON(`${config.host}/ledger/queryBranchOrg`, data);

/**
 * @description 通过分机构识别号获取总机构名称、识别号
 */
export const queryHeadOrgByNsrsbh = (data) =>
  postJSON(`${config.host}/ledger/getHeadOrg`, data);


/**
 * @desption 导出台账
 */
export const exportLedger = (data) => download(`${config.host}/ledger/downloadPrepaidShare`, data);

/**
 * @description 查询申报状态
 */
export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);
