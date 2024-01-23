// 数据字典
import { postJSON, download } from '@/utils/request';
import { config } from '@/config';

// 获取列表 查看历史统计
export const getList = data => postJSON(`${config.host}/income/historyDeductionStatisticsDetail`, {...data, isCurrent: 'false' } );

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @description 申请统计导出
 */
export const exportInvoiceCheckStatistics = data => download(`${config.host}/income/exportInvoiceCheckStatistics`, data);


