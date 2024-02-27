// 数据字典
import {
  postJSON,
} from '@/utils/request'
import { config } from '@/config';
/**
 * 查询模板配置列表
 * @param data
 * @returns {*}
 */
export const getList = data => postJSON(`${config.host}/expCellSetting/page` , data)

/**
 * 保存模板配置
 * @param data
 * @returns {*}
 */
export const saveCellSetting = data => postJSON(`${config.host}/expCellSetting/add` , data)

/**
 * 删除模板配置
 * @param data
 * @returns {*}
 */
export const delCellSetting = data => postJSON(`${config.host}/expCellSetting/delete/` + data)

/**
 * 复制模板配置
 * @param data
 * @returns {*}
 */
export const copyCellSetting = data => postJSON(`${config.host}/expCellSetting/copy` , data)
/**
 * 模板配置详情
 * @param data
 * @returns {*}
 */
export const detailCellSetting = data => postJSON(`${config.host}/expCellSetting/detail`, data)

