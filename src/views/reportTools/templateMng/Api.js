// 数据字典
import {
  postJSON,
  download,
  openFile
} from '@/utils/request'
import { config } from '@/config';

/**
 * 查询申报表模板列表
 * @param data
 * @returns {*}
 */
export const getList = data => postJSON(`${config.host}/expTemplate/page` , data)

/**
 * 保存申报表模板
 * @param data
 * @returns {*}
 */
export const saveTemplate = data => postJSON(`${config.host}/expTemplate/add` , data)

/**
 * 删除申报表模板
 * @param data
 * @returns {*}
 */
export const delTemplate = data => postJSON(`${config.host}/expTemplate/delete/` + data)

/**
 * 下载模板
 * @param data
 * @returns {*}
 */
export const downloadTemplate = data => download(`${config.host}/expTemplate/download`, data)
/**
 * 加载模板
 * @param data
 * @returns {*}
 */
export const loadTemplate = data => openFile(`${config.host}/expTemplate/load/` + data)

/**
 * 获取模板下拉列表
 * @param data
 * @returns {*}
 */
export const selectExpTemplateList = data => postJSON(`${config.host}/expTemplate/select` , data)

export const selectTemplateTypes = data => postJSON(`${config.host}/expTemplateType/selectTemplateTypes` , data)

export const getTemplateDetailJson = data => postJSON(`${config.host}/expTemplate/getTemplateDetail/` + data)


