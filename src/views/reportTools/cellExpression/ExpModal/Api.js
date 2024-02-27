// 数据字典
import {
  postJSON
} from '@/utils/request'
import { config } from '@/config';
/**
 * 根据类型获取数据源
 * @param data
 * @returns {*}
 */
export const listDsByType = data => postJSON(`${config.host}/expDatasource/listDsByType/` + data)

/**
 * 根据数据源获取属性
 * @param data
 * @returns {*}
 */
export const listDsField = data => postJSON(`${config.host}/expDatasourceField/listDsField/` + data)

