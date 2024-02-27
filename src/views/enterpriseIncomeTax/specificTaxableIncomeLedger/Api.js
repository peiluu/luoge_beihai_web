import { postJSON, download } from '@/utils/request';
import { config } from '@/config';
// 获取列表
export const getList = (data) => postJSON(`${config.host}/ledgerSdsTdyw/page`, data);

/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = (data) => postJSON(`${config.host}/orgnization/getOrgList`, data);

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = (data) => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @description 取数
 */
export const dataInitialization = (data) => postJSON( `${config.host}/ledgerSdsTdyw/dataInitialization`, data);

/**
 * @desption 导出台账
 */

export const exportLedger = (data) =>
  download(`${config.host}/ledgerSdsTdyw/downLoadList`, data);

/**
 * @description 查询申报状态
 */
export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);


/**
 * @description 更新
 */
export const update = (data) => postJSON(`${config.host}/ledgerSdsTdyw/update`, data);


