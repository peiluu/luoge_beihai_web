import { postJSON, download } from '@/utils/request';
import { config } from '@/config';

// 获取列表
export const getList = (data) =>
  postJSON(`${config.host}/ledgerDeemedSalesDetail/pages`, data);

/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = (data) => postJSON(`${config.host}/orgnization/getOrgList`, data);

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = (data) => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @desption 列表Excel导出
 */
export const exportDeemedSalesInfo = (data) =>
  download(`${config.host}/ledgerDeemedSalesDetail/download`, data);

/**
 * 新增视同销售明细
 * @param {*} data
 * @returns
 */
export const saveOrUpdateSalesInfo = (data) =>
  postJSON(`${config.host}/ledgerDeemedSalesDetail/saveOrUpdate`, data);

/*
 * 删除视同销售明细
 * @param {*} data
 * @returns
 */
export const del = (data) =>
  postJSON(`${config.host}/ledgerDeemedSalesDetail/delete`, data);

/**
 * @description 查询申报状态
 */
export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);

