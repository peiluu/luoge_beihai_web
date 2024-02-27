import { postJSON, download } from '@/utils/request';
import { config } from "@/config"
/**
 * @description 查询应税收入台账
 */
export const queryTaxableIncome = data => postJSON(`${config.host}/ledger/queryTaxableIncome`, data);
/**
 * @description 修改应税收入台账
 */
export const updateTaxableIncome = data => postJSON(`${config.host}/ledger/updateTaxableIncome`, data);

/**
 * @description 取数
 */
export const fetchTaxableIncome = data => postJSON(`${config.host}/ledger/fetchTaxableIncome`, data);

/**
 * @desption 导出台账
 */
export const exportLedger = (data) => download(`${config.host}/ledger/downloadTaxableIncome`, data);

/**
 * @description 查询申报状态
*/
export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);

