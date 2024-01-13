import { postJSON } from '@/utils/request';
import { config } from "@/config"

/**
 * @desption 获取设置记录
 */
export const getDetailList = data =>
  postJSON(`${config.host}/management/warningSetting/getDetailList`, data);

/**
 * @desption 更新预警信息
 */
export const updateDetail = data =>
  postJSON(`${config.host}/management/warningSetting/updateDetail`, data, null, true);


  
/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);