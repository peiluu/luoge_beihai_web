import {
    getJSON,
    postJSON
} from '@/utils/request.js'
import { config } from "@/config"
/**
 * 获取增值税发票列表
 * @param data
 * @returns {*}
 */
export const getPoolInvoiceList = data => postJSON(`${config.host}/income/invoicePage`, data);
/* 获取当个发票详情 */
export const getPoolInvoiceSingleDes = data => postJSON(`${config.host}/income/queryInvoiceGoodsIncome/${data.id}`,);

export const getVerifyInvoice = data => postJSON(`${config.host}/income/queryInvoiceGoodsIncome/${data.id}`)
/**
 * 获取海关缴款书列表
 * @param data
 * @returns {*}
 */
export const getPoolCustomsList = data => postJSON(`${config.host}/income/downloadCustomsPaymentPage`, data);
/* 获取当个发票详情 */
export const getPoolTableSingleDes = data => postJSON(`${config.host}/income/querycustomsPaymentDetail/${data?.id}`,);

/**
 * 获取代扣代缴列表
 * @param data
 * @returns {*}
 */
export const getPoolPayList = data => postJSON(`${config.host}/income/dkdjwspzPage`, data);
/* 获取当个发票详情 */
export const getPoolPayTableSingleDes = data => postJSON(`${config.host}/income/querydDkdjwspzGoodsIncome/`,data);

/* 待修改认证科目 */
export const postPoolEditebook = data => postJSON(`${config.host}/income/queryCustomsPayment`,data);

/* 待修改认证科目 */
export const postPoolInAccount = data => postJSON(`${config.host}/income/queryCustomsPayment`,data);
