import { postJSON } from '@/utils/request';
import { config } from "@/config"
/**
 * @desption 修改确认单状态
 */
export const confirmation = data => postJSON(`${config.host}/redInvoice/confirmation`, data, null, false);


