// 数据字典
import { postJSON } from '@/utils/request';
import { config } from '@/config';

// 获取列表
export const historyDeductionStatisticsDetail = data => postJSON(`${config.host}/income/historyDeductionStatisticsDetail`, {...data, isCurrent: 'true' });

/**
 * @description 统计申请 / 撤销
 */
export const applyRevokeInvoiceCheckStatistics = data => postJSON(`${config.host}/income/applyRevokeInvoiceCheckStatistics`, data);


/**
 * @description 统计确认申请 / 撤销
 */
export const applyConfirmationDeduction = data => postJSON(`${config.host}/income/applyConfirmationDeduction`, data);


/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @description 申请统计状态查询
 */
export const queryApplyStatisticsStatus = data => postJSON(`${config.host}/income/queryApplyStatisticsStatus`, data);


/**
 * @description 勾选抵扣列表
 */
export const queryInvoiceCheck = data => postJSON(`${config.host}/income/queryInvoiceCheck`, data)
