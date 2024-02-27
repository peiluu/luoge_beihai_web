import { postJSON, download } from '@/utils/request';
import { config } from "@/config"
/**
 * @description 查询增值税应纳税额计算表
 */
export const selectTaxPayable = (data) =>
  postJSON(`${config.host}/ledgerTaxPayable/selectTaxPayable`, data);

/**
 * @description 增值税应纳税额计算表取数
 */
export const reStatistics = (data) =>
  postJSON(`${config.host}/ledgerTaxPayable/reStatistics`, data);

/**
 * @description 增值税应纳税额计算表保存
 */
export const updateLedger = (data) =>
  postJSON(`${config.host}/ledgerTaxPayable/update`, data);
/**
 * @desption 导出台账
 */
export const exportLedger = (data) =>
  download(`${config.host}/ledgerTaxPayable/export`, data);


  /**
 * @description 查询申报状态
 */
export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);

