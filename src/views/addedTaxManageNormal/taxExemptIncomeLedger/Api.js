import { postJSON, download } from '@/utils/request';
import { config } from "@/config"

/**
 * @description 查询免税收入台账
 */
export const queryLedgerTaxFreeIncome = data => postJSON(`${config.host}/ledgerTaxFreeIncome/page`, data);

/**
 * @description 查询减免性质代码
 */
export const queryDicJmdm= data => postJSON(`${config.host}/dicJmdm/list`, data);
/**
 * @description 查询免税收入台账详情
 */
export const detail = data => postJSON(`${config.host}/ledgerTaxFreeIncome/detail`, data);
/**
 * @description 修改
 */
export const update = data => postJSON(`${config.host}/ledgerTaxFreeIncome/update`, data);
/**
 * @description 删除
 */
export const deleteObj = data => postJSON(`${config.host}/ledgerTaxFreeIncome/delete`, data);

/**
 * @description 新增
 */
export const add = data => postJSON(`${config.host}/ledgerTaxFreeIncome/add`, data, null, true);

/**
 * @description 批量修改
 */
export const saveOrUpdateBatch = data => postJSON(`${config.host}/ledgerTaxFreeIncome/saveOrUpdateBatch`, data);

/**
 * @description 免税收入台账数据初始化
 */
export const dataInitialization = data => postJSON(`${config.host}/ledgerTaxFreeIncome/dataInitialization`, data);

/**
 * @description 修改减免项目
 */

export const modifiedDeductionItem = data => postJSON(`${config.host}/ledgerTaxFreeIncome/modifiedDeductionItem`, data, null, true);

/**
 * @description 修改减免项目查询
 */

export const queryDetail = data => postJSON(`${config.host}/ledgerTaxFreeIncome/query/${data.id}`, data);

/**
 * @desption 导出台账
 */
export const exportLedger = (data) => download(`${config.host}/ledgerTaxFreeIncome/downLoadList`, data);
/**
 * @description 查询申报状态
 */
export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);

