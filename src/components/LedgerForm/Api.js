import { postJSON } from '@/utils/request';
import { config } from '@/config';
/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = (data) => postJSON(`${config.host}/taxBody/getListByUser`, data);


/**
 * @description 根据用户获取有权限的所有主体（不分页） 含有纳税人类型
 */
export const selectTaxBody = (data) => postJSON(`${config.host}/taxBody/selectTaxBody`, data);


/**
 * @description 根据用户获取有权限的开票点 / 受票点
 */
export const getOrgList = (data) => postJSON(`${config.host}/orgnization/getOrgList`, data);
