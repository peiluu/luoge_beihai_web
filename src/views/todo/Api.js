// 数据字典
import { deleteOne, postJSON } from '@/utils/request';

// 获取列表
export const getList = (data) =>
  postJSON(`/home/redApplyList`, data);

// 通过
export const passRefuseList = (data) =>
  postJSON(`/redInvoice/passRefuseList`, data);
