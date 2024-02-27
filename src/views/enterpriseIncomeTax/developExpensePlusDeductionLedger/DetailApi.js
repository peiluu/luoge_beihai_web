import { postJSON, download, deleteOne } from '@/utils/request';
import { config } from '@/config';
// 获取列表
export const getList = (data) => postJSON(`${config.host}/ledger/findYffyjjkctz`, data);

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


// 删除
export const del = (id) => deleteOne(`${config.host}/ledger/deleteYffyjjkctz/${id}`, id);

/**
 * @desption 新增
 */
export const add = (data) => postJSON(`${config.host}/ledger/addYffyjjkctz`, data);
/**
 * @desption 编辑研发费用明细
 */
export const update = (data) => postJSON(`${config.host}/ledger/updateYffyjjkctz`, data);

/**
 * @description 查询申报状态
 */
export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);

/**
 * @desption 导出台账
 */
export const exportLedger = (data) => download(`${config.host}/ledger/downloadYffyjjkctz`, data);
