import { postJSON, download } from '@/utils/request';
import { config } from "@/config"

/**
 * @description 查询进项台账
 */
export const selectList = data => postJSON(`${config.host}/ledgerInputVoucher/selectList`, data);
/**
 * @description 进项台账重新统计
 */
export const reStatisticsVoucher = data => postJSON(`${config.host}/ledgerInputVoucher/reStatisticsVoucher`, data);

/**
 * @desption 导出台账
 */
export const exportLedger = (data) => download(`${config.host}/ledgerInputVoucher/export`, data);
 /**
 * @description 查询申报状态
 */
 export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);

