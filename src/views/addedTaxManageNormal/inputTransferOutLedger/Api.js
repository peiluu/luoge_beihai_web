import { postJSON, download } from '@/utils/request';
import { config } from "@/config"

/**
 * @description 查询进项转出台账
 */
export const selectList = data => postJSON(`${config.host}/ledgerInputTaxOut/selectList`, data);
/**
 * @description 重新统计转出台账
 */
export const reStatistics = data => postJSON(`${config.host}/ledgerInputTaxOut/reStatistics`, data);

/**
 * @desption 导出台账
 */
export const exportLedger = (data) => download(`${config.host}/ledgerInputTaxOut/export`, data);

 /**
 * @description 查询申报状态
 */
 export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);

