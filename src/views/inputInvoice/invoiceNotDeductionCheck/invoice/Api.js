// 数据字典
import { postJSON, download } from '@/utils/request';
import { config } from '@/config';

// 获取列表
export const getList = data =>
  postJSON(`${config.host}/income/queryInvoiceCheck`, {
    ...data,
    sign: data.cljg == '01' ? 'N' : ''
  });

// 提交勾选 / 撤销勾选
export const submitRevokeInvoiceCheck = data =>
  postJSON(`${config.host}/income/submitRevokeInvoiceCheck`, data, null, true);

// /**
//  * @desption 获取当前用户可以开票的开票点（不分页）
//  */
// export const getOrgList = data => postJSON(`${config.host}/orgnization/getOrgList`, data);

/**
 * @desption 获取当前用户的受票组织（不分页）
 */
export const getOrgList = data => postJSON(`${config.host}/orgnization/getOrgList`, data);

/**
 * @description 申请统计状态查询
 */
export const queryApplyStatisticsStatus = data =>
  postJSON(`${config.host}/income/queryApplyStatisticsStatus`, data);

/**
 * @desption 导出
 */
export const exportInvoiceCheck = data =>
  download(`${config.host}/income/exportInvoiceCheck`, data);
