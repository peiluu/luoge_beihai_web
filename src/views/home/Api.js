import { postJSON } from '@/utils/request';
import { config } from '@/config';

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @desption 获取发票数据
 */
export const getInvoiceData = (data) => postJSON(`${config.host}/home/invoiceData`, data);

/**
 * @description 获取待办列表
 */
export const getList = data => postJSON(`${config.host}/home/redApplyList`, data);

/**
 * @description 获取快捷列表
 */
export const getQueryMenu = data => postJSON(`${config.host}/home/queryMenu`, data);

/**
 * @description 保存快捷列表
 */
export const saveMenu  = data => postJSON(`${config.host}/home/saveMenu `, data);

/**
 * @description 保存快捷列表
 */
export const getEchartData = data => postJSON(`${config.host}/home/queryMenu `, data);

/**
 * @description 保存快捷列表
 */
export const getBillStatistics  = data => postJSON(`${config.host}/home/billStatistics/${data}`);