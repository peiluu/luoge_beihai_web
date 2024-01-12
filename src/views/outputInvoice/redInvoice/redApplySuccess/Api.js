// 数据字典
import { getOne, postOne, deleteOne, postJSON } from '@/utils/request';

// 查看红字申请单详情
export const getRedInvoice = data => postOne(`redInvoice/getRedInvoice/${data.id}`);
