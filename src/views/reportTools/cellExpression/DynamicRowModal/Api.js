import {
  postJSON
} from '@/utils/request'
import { config } from '@/config';
/**
 * 根据类型获取数据源
 * @param data
 * @returns {*}
 */
export const selectExpDynamicRowList = data => postJSON(`${config.host}/expDynamicRow/selectExpDynamicRowList/` , data)
