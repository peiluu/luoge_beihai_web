// 数据字典
import { deleteOne, postJSON } from '@/utils/request';
import { config } from "@/config"

// 获取列表
export const getList = (data) =>
  postJSON(`${config.host}/home/redApplyDealtList`, data);
   /**
   * @desption 导出
   */
   export const downLoadNoOpenList = data => download(`${config.host}/applyInvoiceUpload/downLoadNoOpenList`, data);

