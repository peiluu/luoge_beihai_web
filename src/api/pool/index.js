import {
    getJSON,
    postJSON,
    download
} from '@/utils/request.js'
import { config } from "@/config"
/**
 * 获取增值税发票列表
 * @param data
 * @returns {*}
 */
export const getPoolInvoiceList = data => postJSON(`${config.host}/income/invoicePage`, data);
/* 获取当个发票详情 */
export const getPoolInvoiceSingleDes = data => postJSON(`${config.host}/income/queryInvoiceGoodsIncome`,data);

/* 查看发票 */
export const getVerifyInvoice = data => postJSON(`${config.host}/income/queryInvoiceIncome/${data.id}`)

/* 发票验证 */
export const getRequiredInvoice = data => postJSON(`${config.host}/income/invoiceZzsCheck`,data)

/**
 * 获取海关缴款书列表
 * @param data
 * @returns {*}
 */
export const getPoolCustomsList = data => postJSON(`${config.host}/income/downloadCustomsPaymentPage`, data);
/* 获取当个发票详情 */
export const getPoolTableSingleDes = data => postJSON(`${config.host}/income/querycustomsPaymentDetail`,data);

/**
 * 获取代扣代缴列表
 * @param data
 * @returns {*}
 */
export const getPoolPayList = data => postJSON(`${config.host}/income/dkdjwspzPage`, data);
/* 获取代扣代缴Des */
export const getPoolPayTableSingleDes = data => postJSON(`${config.host}/income/querydDkdjwspzGoodsIncome/`,data);


/* 待修改认证科目 */
export const postPoolEditebook = data => postJSON(`${config.host}/income/queryCustomsPayment`,data);

/* 入账 */
export const postPoolInAccount = data => postJSON(`${config.host}/income/invoiceEntry`,data);
/* 收票 */
export const postPoolTick = data => postJSON(`${config.host}/income/receiptStatus`,data);

/**
 * 下拉获取
 * @param data
 * @returns {*}
 */
/* 纳税主体 */
export const getRatepayingMain = (data = {}) => postJSON(`${config.host}/taxBody/getListAll`,data);
/* 受票组织 */
export const getOrganList = (data = {}) => postJSON(`${config.host}/orgnization/getOrgList`,data);
/* 会计科目 */
export const getAccountantList = (data = {}) => postJSON(`${config.host}/mtc/accountingSubjects/list`,data);


/**
 * 导出
 * @param data
 * @returns {*}
 */
/* 增值税发票导出查询结果 */
export const postDownloadList = (data = {}) =>  download(`${config.host}/income/exportDownloadInvoice`, data,null,true);
//postJSON(`${config.host}/income/exportDownloadInvoice`,{data,responseType: 'blob'});


/* 增值税发票导出选中数据 */
export const postDownloadSelect = (data = {}) => download(`${config.host}/income/downloadZzsfpByIds`, data,null,true);
 //postJSON(`${config.host}/income/downloadZzsfpByIds`,data);

 export const postHGDownloadList = (data = {}) =>  download(`${config.host}/income/exportDownloadCustomsPayment`, data,null,true);
//postJSON(`${config.host}/income/exportDownloadInvoice`,{data,responseType: 'blob'});

/* 增值税发票导出选中数据 */
export const postHGDownloadSelect = (data = {}) => download(`${config.host}/income/downloadHgjksfpByIds`, data,null,true);

/*代扣代缴 */
export const postDKDJDownloadList = (data = {}) =>  download(`${config.host}/income/exportDownloadDkdjwspz`, data,null,true);
//postJSON(`${config.host}/income/exportDownloadInvoice`,{data,responseType: 'blob'});

/* 增值税发票导出选中数据 */
export const postDKDJDownloadSelect = (data = {}) => download(`${config.host}/income/downloadDkdjwspzByIds`, data,null,true);


