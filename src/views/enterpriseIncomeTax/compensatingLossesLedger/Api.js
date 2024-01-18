import { postJSON } from '@/utils/request';
import { config } from '@/config';
/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);

// 获取列表
export const getList = (data) => postJSON(`${config.host}/ledgerSdsMbks/getList`, data);


/**
 * @description 查询企业所得税弥补亏损台账
 */
export const queryLedgerSdsMbks = data => postJSON(`${config.host}/ledgerSdsMbks/query`, data);
/**
 * @description 企业所得税弥补亏损台账 保存
 */
export const saveLedgerSdsMbks = data => postJSON(`${config.host}ledgerSdsMbks/save`, data);

/**
 * @description 企业所得税弥补亏损台账 保存
 */
export const update = data => postJSON(`${config.host}ledgerSdsMbks/save`, data);

