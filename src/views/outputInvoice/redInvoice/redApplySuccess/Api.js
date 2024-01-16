// 数据字典
import { getOne, postOne, deleteOne, postJSON } from '@/utils/request';
import { config } from "@/config"
// 查看红字申请单详情
export const getRedInvoice = data => postOne(`${config.host}/redInvoice/getRedInvoice/${data.id}`);
