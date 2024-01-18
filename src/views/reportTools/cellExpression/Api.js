// 数据字典
import {
  getJSON,
  postJSON,
} from '@/utils/request'
import { config } from '@/config';
/**
 * 查询业态
 * @param data
 * @returns {*}
 */
export const selectBusinessList = data => postJSON(`${config.host}/taxBody/selectYtList`, data)

/**selectTaxBodyList
 * 根据业态查询主体
 * @param data
 * @returns {*}
 */
export const selectTaxBodyList = data => getJSON(`${config.host}/taxBody/selectTaxBodyList`, data)
/**
 * 保存公式配置
 * @param data
 * @returns {*}
 */
export const saveCellExpression = data => postJSON(`${config.host}/expCellExpression/add` , data)

/**
 * 查询出已配置的公式
 * @param data
 * @returns {*}
 */
export const listCellExpressions = data => postJSON(`${config.host}/expCellExpression/list` , data)

/**
 * 保存申报动态行设置
 * @param data
 * @returns {*}
 */
export const saveExpDynamicSetting = data => postJSON(`${config.host}/expDynamicSetting/add` , data)

/**
 * 查询申报动态行设置
 * @param data
 * @returns {*}
 */
export const detailExpDynamicSetting = data => postJSON(`${config.host}/expDynamicSetting/detail` , data)



