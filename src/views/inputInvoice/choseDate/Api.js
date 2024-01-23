import { postJSON } from '@/utils/request';
import { config } from '@/config';

/**
 * @desption 属期选择
 */
export const getList = data => postJSON(`${config.host}/income/sqCheck`, data);

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);
