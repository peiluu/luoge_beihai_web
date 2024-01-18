import { postJSON, download, deleteOne } from '@/utils/request';
import { config } from '@/config';
// 获取列表
export const getList = (data) => postJSON(`${config.host}/ledgerSdsBzs/page`, data);

/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = (data) => postJSON(`${config.host}/orgnization/getOrgList`, data);

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = (data) => postJSON(`${config.host}/taxBody/getListByUser`, data);

// 删除
export const del = (id) => deleteOne(`${config.host}/ledgerSdsBzs/delete/${id}`, id);

/**
 * @desption 新增
 */
export const add = (data) => postJSON(`${config.host}/ledgerSdsBzs/add`, data, null, true);
/**
 * @desption 编辑
 */
export const update = (data) => postJSON(`${config.host}/ledgerSdsBzs/update`, data, null, true);

/**
 * @desption 获取优惠事项列表
 */
export const getDicSdsQttzdm = (data) => postJSON(`${config.host}/dicSdsQttzdm/list`, data);

/**
 * @description 查询申报状态
 */
export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);

/**
 * @desption 导出台账
 */

export const exportLedger = (data) => download(`${config.host}/ledgerSdsBzs/downLoadList`, data);
