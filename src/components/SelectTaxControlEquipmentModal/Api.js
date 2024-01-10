import { postJSON } from '@/utils/request';

/**
 * @desption 【组织管理】获取税控设备列表
 */
export const getTaxMechList = data => postJSON(`/taxMech/getTaxMechList`, data);

/**
 * @desption 【组织管理】获取税控设备详
 */
export const queryProductProfile = data => postJSON('/taxMech/detail', data);
