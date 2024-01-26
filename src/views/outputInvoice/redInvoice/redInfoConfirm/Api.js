import { postJSON } from '@/utils/request';
import { config } from "@/config"
/**
 * @desption 新增红字申请单 - 保存
 */
export const addRedInvoice = data =>
  postJSON(`${config.host}/redInvoice/addRedInvoice`, data, null, true);

/**
 * @desption 新增红字申请单 - 提交
 */
export const submitRedInvoice = data =>
  postJSON(`${config.host}/redInvoice/submitRedInvoice`, data, null, true);

/**
 * @desption 蓝字发票详情查询 - 新增红字信息单入口
 */
// export const queryBlueInvoiceById = data =>
//   postJSON(`${config.host}/blueInvoice/queryBlueInvoiceById/${data.id}`, data);

  export const queryBlueInvoiceById = data =>
  postJSON(`${config.host}/invoiceUpload/invoiceInfo/${data.id}`, data);

/**
 * @desption 蓝字发票详情查询 - 已开票红冲入口
 */
export const invoiceInfo = data =>
  postJSON(`${config.host}/invoiceUpload/invoiceInfo/${data.id}`, data);

/**
 * @desption 获取可用税率
 */
export const getTaxRates = data => postJSON(`${config.host}/blueInvoice/getTaxRates`, data);

/**
 * @desption 查看红字申请单详情
 */
export const getRedInvoice = data =>
  postJSON(`${config.host}/redInvoice/getRedInvoice/${data.id}`);

/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = data => postJSON(`${config.host}/orgnization/getOrgList`, data);
