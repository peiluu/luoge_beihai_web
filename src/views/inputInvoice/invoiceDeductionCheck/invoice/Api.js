// 数据字典
import { postJSON, download } from '@/utils/request';
import { config } from '@/config';

// 获取列表
export const getList = data =>
  postJSON(`${config.host}/income/queryInvoiceCheck`, {
    ...data,
    sign: data.cljg == '01' ? 'Y' : ''
  });

// 提交勾选 / 撤销勾选
export const submitRevokeInvoiceCheck = data =>
  postJSON(`${config.host}/income/submitRevokeInvoiceCheck`, data, null, true);

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
 * @description 设置进销比例
 */
export const incomeOutputScale = data =>
  postJSON(`${config.host}/income/incomeOutputScale`, data);

/**
 * @description 查询进销比例
 */
export const queryScale = data =>
  postJSON(`${config.host}/income/queryScale/${data.nsrsbh}`, data);

/**
 * @desption 对接物业的预勾选导出
 */
export const exportPreCheck = data =>
  download(`${config.host}/income/exportPreCheck/${data.reqData.nsrsbh}`, data);

/**
 * @desption 预勾选计算
 */
export const calPreCheck = data =>
  postJSON(`${config.host}/income/calPreCheck/${data.nsrsbh}`, data);

/**
 * @desption 提交撤销预勾选
 */
export const checkPreOneZzsfp = data =>
  postJSON(`${config.host}/income/checkPreOneZzsfp`, data);

/**
 * @desption 导出
 */
export const exportInvoiceCheck = data =>
  download(`${config.host}/income/exportInvoiceCheck`, data);

/**
 * @desption 查询时候否是物业
 */
export const queryBusinessFormat = data =>
  postJSON(`${config.host}/income/queryBusinessFormat/${data.nsrsbh}`, data);

/**
 * @desption 查询时候否是物业
 */
export const getDetailById = data =>
  postJSON(`${config.host}/taxBody/getDetailById`, data);

export const cstateZzsfp = data =>
  postJSON(`${config.host}/income/cstateZzsfp/${data.nsrsbh}`, data);
  