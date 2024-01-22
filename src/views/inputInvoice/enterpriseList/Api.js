import { postJSON } from '@/utils/request';

/**
 * @description 根据用户获取有权限的所有税务主体（分页）
 */
export const getList = data => postJSON(`/taxBody/getListByUserPage`, data);
