import { postJSON, download } from '@/utils/request';
import { config } from "@/config"
/**
 * @description 查询差额征税台账
 */
export const queryDifferenceTax = (data) => postJSON(`${config.host}/ledger/queryDifferenceTax`, data);

/**
 * @description 修改差额征税台账
 */
export const updateDifferenceTax = (data) => postJSON(`${config.host}/ledger/updateDifferenceTax`, data, null, true );

/**
 * @description 差额征税取数
 */
export const fetchDifferenceTax = (data) => postJSON(`${config.host}/ledger/fetchDifferenceTax `, data);

/**
 * @desption 导出台账
 */
export const exportLedger = (data) => download(`${config.host}/ledger/downloadDifferenceTax`, data);

  /**
 * @description 查询申报状态
 */
  export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);

