import { postJSON, download } from '@/utils/request';
import { config } from '@/config';
/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @description 查询
 */
export const queryLedgerSdsYjskjs = data => postJSON(`${config.host}/ledgerSdsYjskjs/query`, data);
/**
 * @description 取数
 */
export const initialization = data => postJSON(`${config.host}/ledgerSdsYjskjs/initialization`, data);

/**
 * @desption 导出台账
 */

export const exportLedger = (data) => download(`${config.host}/ledgerSdsYjskjs/downLoadList`, data);
/**
 * @description 查询申报状态
 */
export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);
