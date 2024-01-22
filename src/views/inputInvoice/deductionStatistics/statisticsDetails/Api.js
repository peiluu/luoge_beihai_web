// 数据字典
import { postJSON, download } from '@/utils/request';

// 获取列表
export const getList = data => postJSON(`/income/queryInvoiceCheckStatistics`, data);

/**
 * @description 申请撤销统计
 */
export const applyRevokeInvoiceCheckStatistics = data => postJSON(`/income/applyRevokeInvoiceCheckStatistics`, data);

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`/taxBody/getListByUser`, data);

/**
 * @description 申请统计状态查询
 */
export const queryApplyStatisticsStatus = data => postJSON(`/income/queryApplyStatisticsStatus`, data);


/**
 * @description 申请统计导出
 */
export const exportInvoiceCheckStatistics = data => download(`income/exportInvoiceCheckStatistics`, data);


