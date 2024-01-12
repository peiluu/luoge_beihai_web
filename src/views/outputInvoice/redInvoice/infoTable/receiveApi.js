// 数据字典
import { postJSON } from '@/utils/request';

// 获取列表, 我收到的 level: 1
export const getList = data =>
  postJSON(`/redInvoice/redInvoiceList`, {
    ...data,
    level: '1'
  });
