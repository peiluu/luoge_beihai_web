import { postJSON } from '@/utils/request';

/**
 * @description 问题发票查查询
 */
export const queryProblemInvoice = data => postJSON(`/income/queryProblemInvoice`, data);

/**
 * @description 查看统计表 - 抵扣类勾选统计结果
 */
export const queryHistoryInvoiceCheckStatistics = data => postJSON(`/income/queryHistoryInvoiceCheckStatistics`, data);

/**
 * @description 申请确认抵扣统计
 */
export const applyConfirmationDeduction = data => postJSON(`/income/applyConfirmationDeduction`, data);

/**
 * @description 申请统计状态查询
 */
export const queryApplyStatisticsStatus = data => postJSON(`/income/queryApplyStatisticsStatus`, data);


