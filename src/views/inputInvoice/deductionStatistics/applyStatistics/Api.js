import { postJSON } from '@/utils/request';
import { config } from '@/config';

/**
 * @description 问题发票查查询
 */
export const queryProblemInvoice = data => postJSON(`${config.host}/income/queryProblemInvoice`, data);

/**
 * @description 查看统计表 - 抵扣类勾选统计结果
 */
export const queryHistoryInvoiceCheckStatistics = data => postJSON(`${config.host}/income/queryHistoryInvoiceCheckStatistics`, data);

/**
 * @description 申请确认抵扣统计
 */
export const applyConfirmationDeduction = data => postJSON(`${config.host}/income/applyConfirmationDeduction`, data);

/**
 * @description 申请统计状态查询
 */
export const queryApplyStatisticsStatus = data => postJSON(`${config.host}/income/queryApplyStatisticsStatus`, data);


