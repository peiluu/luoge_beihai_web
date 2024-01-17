import { postJSON, download, deleteOne } from '@/utils/request';
import { config } from "@/config"

// 获取列表
export const getList = (data) => postJSON(`${config.host}/ledger/findDrawback`, data);

/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = (data) => postJSON(`${config.host}/orgnization/getOrgList`, data);

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = (data) => postJSON(`${config.host}/taxBody/getListByUser`, data);

// 取数
export const fetchDrawback = (data) => postJSON(`${config.host}/ledger/fetchDrawback`, data);

/**
 * @desption 编辑
 */
export const updateDrawback = (data) => postJSON(`${config.host}/ledger/updateDrawback`, data, null, true);


/**
 * @description 查询申报状态
 */
export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);

/**
 * @desption 导出台账
 */

export const exportLedger = (data) => download(`${config.host}/ledger/downloadDrawback`, data);
