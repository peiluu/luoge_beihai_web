// 数据字典
import { postJSON } from '@/utils/request';
import { config } from '@/config';

// 获取列表 销项
export const getList = data =>
  postJSON(`${config.host}/income/queryIncomeInvoiceDownload`, {
    ...data,
    sjlx: '2'
  });
