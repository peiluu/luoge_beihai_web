// 发票下载记录
import { postJSON } from '@/utils/request';
import { config } from '@/config';


// 获取列表
export const getList = data =>
  postJSON(`${config.host}/income/querySyncIncomeInvoiceDownload`, data);

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);


/**
 * @desption 批量发票下载申请
 * @param url
 */
export const batchInvoiceDownload = data =>
  postJSON(`${config.host}/income/batchInvoiceDownload`, data, null, true);
