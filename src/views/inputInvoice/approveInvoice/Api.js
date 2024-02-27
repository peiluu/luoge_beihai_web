import { postJSON } from '@/utils/request';
import { config } from '@/config';
/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const approveInvoice = data => postJSON(`${config.host}/income/invoiceCheck`, data);
