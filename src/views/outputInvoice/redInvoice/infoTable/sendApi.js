// 数据字典
import { deleteOne, postJSON, download } from '@/utils/request';
import { config } from "@/config"
// 获取列表, 我发出的 level: 0
export const getList = data =>
  postJSON(`/redInvoice/redInvoiceList`, {
    ...data,
    level: '0'
  });

/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = data => postJSON(`${config.host}/orgnization/getOrgList`, data);

// 删除
export const del = id => deleteOne(`${config.host}/redInvoice/deletionApply/${id}`, id);

// 检查风险信息
export const check = data => deleteOne(`${config.host}/redInvoice/check/${data.nsrsbh}`);
/**
 * @desption 导出
 */
export const downLoadApplyList = data => download(`${config.host}/redInvoice/downLoadApplyList`, data);
