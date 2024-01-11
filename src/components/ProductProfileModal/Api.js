import { postJSON } from '@/utils/request';
import { config } from "@/config"

/**
 * @desption 查询商品档案分类
 */
export const getNextLayer = data => postJSON(`${config.host}/blueInvoice/next-layer/${data.id}`);

/**
 * @desption 查询商品档案
 */
export const queryProductProfile = data => postJSON(`${config.host}/blueInvoice/queryProductProfile`, data);


/**
 * @desption 查询商品档案
 */
export const queryColumn = data => postJSON(`${config.host}/blueInvoice/column/query?type=${data.type}`);


