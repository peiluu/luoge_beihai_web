import { postJSON } from '@/utils/request';

/**
 * @desption 查询商品档案分类
 */
export const getNextLayer = data => postJSON(`/blueInvoice/next-layer/${data.id}`);

/**
 * @desption 查询商品档案
 */
export const queryProductProfile = data => postJSON('/blueInvoice/queryProductProfile', data);


/**
 * @desption 查询商品档案
 */
export const queryColumn = data => postJSON(`/blueInvoice/column/query?type=${data.type}`);


