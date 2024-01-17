import { postJSON, download } from '@/utils/request';
import { config } from "@/config"
/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @description 根据用户获取有权限的开票点 / 受票点
 */
export const getOrgList = (data) => postJSON(`${config.host}/orgnization/getOrgList`, data);

/**
 * @description 查询增值税及附加税费预缴台账
 */
export const queryTaxAdvancePayment = data => postJSON(`${config.host}/taxAdvancePayment/page`, data);

/**
 * @description 查询增值税及附加税费预缴台账详情
 */
export const detail = data => postJSON(`${config.host}/taxAdvancePayment/queryDetail`, data);
/**
 * @description 修改
 */
export const update = data => postJSON(`${config.host}/taxAdvancePayment/update`, data);
/**
 * @description 删除
 */
export const deleteObj = data => postJSON(`${config.host}/taxAdvancePayment/delete`, data);

/**
 * @description 新增
 */
export const add = data => postJSON(`${config.host}/taxAdvancePayment/add`, data,  null, true);

/**
 * @description 批量修改
 */
export const saveOrUpdateBatch = data => postJSON(`${config.host}/taxAdvancePayment/saveOrUpdateBatch`, data);

/**
 * @description 增值税及附加税费预缴台账数据初始化
 */
export const dataInitialization = data => postJSON(`${config.host}/taxAdvancePayment/dataInitialization`, data);

/**
 * @description 查询申报状态
 */
export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);

/**
 * @desption 导出台账
 */

export const exportLedger = (data) => download(`${config.host}/taxAdvancePayment/downLoadList`, data);

