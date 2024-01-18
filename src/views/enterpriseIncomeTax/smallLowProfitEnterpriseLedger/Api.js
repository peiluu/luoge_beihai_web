import { postJSON } from '@/utils/request';
import { config } from '@/config';
/**
 * @description 所有总机构名称、识别号
 */
export const querySameAllOrg = (data) => postJSON(`${config.host}/ledger/querySameAllOrg`, data);
/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @description 查询
 */
export const querySmall = data => postJSON(`${config.host}/ledger/querySmall`, data);
/**
 * @description 修改
 */
export const updateSmall = data => postJSON(`${config.host}/ledger/updateSmall`, data);

/**
 * @description 取数
 */
export const fetchSmall = data => postJSON(`${config.host}/ledger/fetchSmall`, data);
/**
 * @description 查询申报状态
 */
export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);
