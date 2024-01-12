import { postJSON } from '@/utils/request';
import { config } from "@/config"
/**
 * @desption 根据用户获取有权限的所有纳税主体（分页）
 */
export const getList = data =>
  postJSON(`${config.host}/redInvoice/getListByUserPage`, {
    ...data,
    lrfsf: '0'
  });
