import { postJSON } from '@/utils/request';
import { config } from '@/config';
/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @description 查询
 */
export const queryLedgerSdsJmsdsejs = data => postJSON(`${config.host}/ledgerSdsJmsdsejs/page`, data);
/**
 * @description 修改
 */
export const saveOrUpdateBatch = data => postJSON(`${config.host}/ledgerSdsJmsdsejs/saveOrUpdateBatch`, data);

/**
 * @description 取数
 */
export const initialization = data => postJSON(`${config.host}/ledgerSdsJmsdsejs/initialization`, data);

/**
 * @description 查询申报状态
 */
export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);
