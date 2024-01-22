// 数据字典
import { postJSON } from '@/utils/request';

// 获取列表 进项
export const getList = data =>
  postJSON(`/income/queryIncomeInvoiceDownload`, {
    ...data,
    sjlx: '1'
  });

