// 数据字典
import { postJSON, download } from '@/utils/request';

// 获取列表
export const getList = data =>
  postJSON(`/income/queryInvoiceCheck`, {
    ...data,
    sign: data.cljg == '01' ? 'Y' : ''
  });

// 提交勾选 / 撤销勾选
export const submitRevokeInvoiceCheck = data =>
  postJSON(`/income/submitRevokeInvoiceCheck`, data, null, true);

/**
 * @desption 获取当前用户的受票组织（不分页）
 */
export const getOrgList = data => postJSON(`/orgnization/getOrgList`, data);

/**
 * @description 申请统计状态查询
 */
export const queryApplyStatisticsStatus = data =>
  postJSON(`/income/queryApplyStatisticsStatus`, data);

/**
 * @description 设置进销比例
 */
export const incomeOutputScale = data =>
  postJSON(`/income/incomeOutputScale`, data);

/**
 * @description 查询进销比例
 */
export const queryScale = data =>
  postJSON(`/income/queryScale/${data.nsrsbh}`, data);

/**
 * @desption 对接物业的预勾选导出
 */
export const exportPreCheck = data =>
  download(`/income/exportPreCheck/${data.reqData.nsrsbh}`, data);

/**
 * @desption 预勾选计算
 */
export const calPreCheck = data =>
  postJSON(`/income/calPreCheck/${data.nsrsbh}`, data);

/**
 * @desption 提交撤销预勾选
 */
export const submitRevokePreCheck = data =>
  postJSON(`/income/submitRevokePreCheck`, data);

/**
 * @desption 导出
 */
export const exportInvoiceCheck = data =>
  download('/income/exportInvoiceCheck', data);

/**
 * @desption 查询时候否是物业
 */
export const queryBusinessFormat = data =>
  postJSON(`/income/queryBusinessFormat/${data.nsrsbh}`, data);
