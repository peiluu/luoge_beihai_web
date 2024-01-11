import { postJSON } from '@/utils/request';
import { config } from "@/config"
/**
 * @desption 查询额度赋码票量信息
 */
export const getCreditInfo = data => postJSON(`${config.host}/InvoiceCredit/creditInfo`, data);

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @description 历史授信额度信息
 */
export const creditCredit = data => postJSON(`${config.host}/InvoiceCredit/creditCredit`, data);

/**
 * @description 历史票量额度信息
 */
export const creditCode = data => postJSON(`${config.host}/InvoiceCredit/creditCode`, data);

/**
 * @description 授信额度更新
 */
export const updateCredit = data => postJSON(`${config.host}/InvoiceCredit/updateCredit/${data.nsrsbh}`, data, null, true);
