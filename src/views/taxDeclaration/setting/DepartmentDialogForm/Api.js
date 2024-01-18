import { postJSON } from '@/utils/request';
import { config } from  '@/config';
/**
 * @desption 获取当前用户可以开票的账套（不分页）
 */
export const getAllZt = (data) => postJSON(`${config.host}/taxBody/getAllZt`, data);
