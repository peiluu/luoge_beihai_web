import { postJSON, download } from '@/utils/request';
import { config } from '@/config';

// 获取列表
export const getList = data =>
  postJSON(`${config.host}/ledger/queryOutputTax`, data);

/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = data => postJSON(`${config.host}/orgnization/getOrgList`, data);

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @desption Excel导出
 */
export const exportInvoiceDetailList = data =>
  download(`${config.host}/ledger/downloadOutputTax`, data);
