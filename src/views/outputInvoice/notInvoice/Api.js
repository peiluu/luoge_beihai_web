// 数据字典
import {
  postJSON, download
  } from '@/utils/request'

  import { config } from "@/config"
  // 获取列表
  export const getList = data => postJSON(`${config.host}/applyInvoiceUpload/queryNotInvoiced`, data)

  // 开票
  export const openInvoice = (data) => postJSON(`${config.host}/applyInvoiceUpload/openInvoice`, data)

  // 删除
  export const deleteInvoice = (data) => postJSON(`${config.host}/applyInvoiceUpload/deleteInvoice`, data)

  // 校验是否可以开票
  export const checkOpenInvoice = (data) => postJSON(`${config.host}/applyInvoiceUpload/checkOpenInvoices`, data)

  /**
   * @desption 导出
   */
  export const downLoadNoOpenList = data => download(`${config.host}/applyInvoiceUpload/downLoadNoOpenList`, data);

  /**
   * @desption 获取当前用户可以开票的开票点（不分页）
   */
  export const getOrgList = data => postJSON(`${config.host}/orgnization/getOrgList`, data);
