// 数据字典
import { postJSON, download } from '@/utils/request';
import { config } from '@/config';

// 查询重点人群
export const getList = (data) =>
  postJSON(`${config.host}/ledgerKeynoteGroupDeduction/page`, data);

/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = (data) => postJSON(`${config.host}/orgnization/getOrgList`, data);
/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = (data) => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @desption 导出
 */
export const downLoadList = (data) =>
  download(`${config.host}/ledgerKeynoteGroupDeduction/downLoadList`, data);
