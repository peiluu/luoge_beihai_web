// 数据字典
import { deleteOne, postJSON } from '@/utils/request';
import { config } from '@/config';

// 获取列表, 待我确认的 level: 2
export const getList = data =>
  postJSON(`${config.host}/redInvoice/redInvoiceList`, {
    ...data,
    level: '2',
    lrfsf: 1
  });

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);


// 删除
export const del = id => deleteOne(`${config.host}/redInvoice/deletionApply/${id}`, id);

// 通过
export const passRefuseList = data =>
  postJSON(`${config.host}/redInvoice/passRefuseList`, data);
