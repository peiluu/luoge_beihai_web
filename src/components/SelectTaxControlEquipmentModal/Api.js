import { postJSON } from '@/utils/request';
import { config } from '@/config';

/**
 * @desption 【组织管理】获取税控设备列表
 */
export const getTaxMechList = data => postJSON(`${config.host}/taxMech/getTaxMechList`, data);

/**
 * @desption 【组织管理】获取税控设备详
 */
export const queryProductProfile = data => postJSON(`${config.host}/taxMech/detail`, data);
