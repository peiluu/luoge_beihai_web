// 数据字典
import { postJSON } from '@/utils/request';
import { config } from "@/config"
/**

/**
 * @description 历史票量额度信息
 */
export const getList = data => postJSON(`${config.host}/InvoiceCredit/creditCode`, data);
