// 数据字典
import { postJSON, download } from '@/utils/request';
import { config } from '@/config';

// 获取列表
export const getList = data =>
  postJSON(`${config.host}/ledgerIncomeDetail/queryList`, { ...data});

/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = data => postJSON(`${config.host}/orgnization/getOrgList`, data);

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @desption 列表Excel导出
 */
export const exportIncomeDetailInfo = data => download(`${config.host}/ledgerIncomeDetail/download`, data);

/**
 * 调整
 * @param {*} data
 * @returns
 */
export const adjustAmountInfo = data => postJSON(`${config.host}/ledgerIncomeDetail/adjustAmount`, { ...data })

  /**
 * @description 取数
 */
export const fetchSummaryDetail = data => postJSON(`${config.host}ledgerIncomeDetail/fetchSummaryDetail`, data);


