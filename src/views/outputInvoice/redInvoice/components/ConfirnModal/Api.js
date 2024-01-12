import { postJSON } from '@/utils/request';

/**
 * @desption 修改确认单状态
 */
export const confirmation = data => postJSON(`/redInvoice/confirmation`, data, null, false);


