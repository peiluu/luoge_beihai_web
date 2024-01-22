import { postJSON } from '@/utils/request';
/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const approveInvoice = data => postJSON(`/income/invoiceCheck`, data);
