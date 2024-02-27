import { postJSON, download } from '@/utils/request';
import { config } from '@/config';
/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = (data) => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @description 查询
 */
export const queryCalPrepaidShare = (data) =>
  postJSON(`${config.host}/ledger/queryCalPrepaidShare`, data);

/**
 * @description 取数
 */
export const fetchCalPrepaidShare = (data) =>
  postJSON(`${config.host}/ledger/fetchCalPrepaidShare`, data);

/**
 * @description 所有总机构名称、识别号
 */
export const queryAllOrg = (data) => postJSON(`${config.host}/ledger/queryAllOrg`, data);

/**
 * @desption 导出台账
 */
export const exportLedger = (data) =>
  download(`${config.host}/ledger/downloadCalPrepaidShare`, data);

/**
 * @description 查询申报状态
 */
export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);
