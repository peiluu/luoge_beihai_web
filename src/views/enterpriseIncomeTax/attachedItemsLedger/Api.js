import { postJSON, download, deleteOne } from '@/utils/request';
import { config } from '@/config';

// 获取列表
export const getList = (data) => postJSON(`${config.host}/ledger/queryItem`, data);

/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = (data) => postJSON(`${config.host}/orgnization/getOrgList`, data);

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = (data) => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @desption Excel导出
 */
export const exportInvoiceDetailList = (data) =>
  download(`${config.host}/ledger/downloadOutputTax`, data);
/**
 * @desption 删除
 */
export const del = (id) => deleteOne(`${config.host}/ledger/deleteItem/${id}`, id);

/**
 * @desption 新增
 */
export const add = (data) => postJSON(`${config.host}/ledger/addItem`, data);
/**
 * @desption 编辑
 */
export const update = (data) => postJSON(`${config.host}/ledger/updateItem`, data);

/**
 * @desption 获取优惠事项列表
 */
export const getDicSdsZcjszjtx = (data) => postJSON(`${config.host}/dicSdsZcjszjtx/list`, data);

/**
 * @description 查询申报状态
 */
export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);


/**
 * @desption 导出台账
 */
export const exportLedger = (data) => download(`${config.host}/ledger/downloadItem`, data);
