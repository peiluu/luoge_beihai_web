import { postJSON, download } from '@/utils/request';
import { config } from '@/config';

// 获取列表
export const getList = data => postJSON(`${config.host}/ledgerIncomeDetail/detailPage`, { ...data});

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
export const exportIncomeDetailList = data => download(`${config.host}/ledgerIncomeDetail/download/detail`, data);


  /**
 * @description 取数
 */
  export const fetchDetail = data => postJSON(`${config.host}/ledgerIncomeDetail/fetchDetail`, data);

