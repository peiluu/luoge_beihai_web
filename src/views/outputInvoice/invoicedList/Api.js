// 数据字典
import { postJSON, download } from '@/utils/request';
import { config } from "@/config"
// 获取列表
export const getList = data =>
  postJSON(`${config.host}/invoiceUpload/successfulInvoice`, { ...data, scope: '2' });

/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = data => postJSON(`${config.host}/orgnization/getOrgList`, data);

// 开票
export const openInvoice = data =>
  postJSON(`${config.host}/applyInvoiceUpload/openInvoice`, data);

// 删除
export const deleteInvoice = data =>
  postJSON(`${config.host}/applyInvoiceUpload/invoiceedList`, data);

/**
 * @desption 发票状态信息查询 是否可红冲
 */
export const invoiceUsedStatus = data =>
  postJSON(`${config.host}/redInvoice/invoiceUsedStatus`, data);

/**
 * @desption 根据id获取发票Pdf
 */
export const downLoadPdf = data => download(`${config.host}/invoiceUpload/downLoadPdf`, data);

/**
 * @desption  根据id集合下载多张发票【压缩包】
 */
export const downLoadPdfZip = data =>
  download(`${config.host}/invoiceUpload/downLoadPdfZip`, data);

/**
 * @desption 发送pdf
 */
export const sendPdf = data => postJSON(`${config.host}/invoiceUpload/sendPdf`, data, null, true);

/**
 * @desption 查询开票人
 */
export const selectKpr = data => postJSON(`${config.host}/invoiceUpload/selectKpr`, data);
/**
 * @desption 更新发票orgid
 */
export const updateInvoiceOrgId = data => postJSON(`${config.host}/invoiceUpload/updateInvoiceOrgId`, data);

/**
 * @desption 导出
 */
export const downLoadInvoiceList = data => download(`${config.host}/invoiceUpload/downLoadList`, data);
/**
 * @desption 获取区域选择下拉
 */
export const selectQyList = data => postJSON(`${config.host}/taxBody/selectQyList`, data);

/**
 * @desption 项目名称（房开）
 */
export const detailByOrgId = data => postJSON(`${config.host}/taxBody/detailByOrgId`, data);
