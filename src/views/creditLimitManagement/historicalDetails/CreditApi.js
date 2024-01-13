// 数据字典
import { postJSON } from '@/utils/request';
import { config } from "@/config"
/**

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @description 历史授信额度信息
 */
export const getList = data => postJSON(`${config.host}/InvoiceCredit/creditCredit`, data);

/**
 * @description 同步最新数据
 */
export const queryCredit = data => postJSON(`${config.host}/InvoiceCredit/queryCredit/${data.nsrsbh}`, data, null, true);
