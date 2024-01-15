import { postJSON } from '@/utils/request';
import { config } from "@/config"

/**
 * @desption 查询可抵扣蓝字发票信息
 */
export const getList = data => postJSON(`${config.host}/blueInvoice/queryBlueInvoice`, data);


  /**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
  export const getOrgList = data => postJSON(`${config.host}/orgnization/getOrgList`, data);

/**
 * @desption 发票状态信息查询 是否可红冲
 */
export const invoiceUsedStatus = data =>
  postJSON(`${config.host}/redInvoice/invoiceUsedStatus`, data);


// 查看红字申请单详情
export const getRedInvoice = data =>
  postJSON(`${config.host}/redInvoice/getRedInvoice/${data.id}`);
