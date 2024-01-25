// 数据字典
import {
  postJSON,
  getJSON
} from '@/utils/request'
import { config } from '@/config';
/**
 * 获取下拉框
 * @param data
 * @returns {*}
 */
export const getDicCommon = data => postJSON(`${config.host}/dicCommonSl/getList` , data)

/**
 * 获取主体列表
 * @param data
 * @returns {*}
 */
export const getTaxBody = data => postJSON(`${config.host}/taxBody/getListByUser` , data)


/**
 * 减免所得税优惠事项
 * @param data
 * @returns {*}
 */
export const getjmyhfl = data => postJSON(`${config.host}/dicSdsJmsdseyh/getjmyhfl` , data)

/**
 * 减免所得税优惠事项名称
 * @param data
 * @returns {*}
 */
export const getjmyhmc = data => getJSON(`${config.host}/dicSdsJmsdseyh/getjmyhmc` , data)

/**
 * 减免所得税优惠方式
 * @param data
 * @returns {*}
 */
export const getjmyhfs = data => postJSON(`${config.host}/dicSdsJmsdsfs/getList` , data)

/**
 * 保存申报基础设置
 * @param data
 * @returns {*}
 */
export const saveBaseSetting = data => postJSON(`${config.host}/reportSettings/saveSetting` , data)

/**
 * 保存所得税申报设置
 * @param data
 * @returns {*}
 */
export const saveIncomeSetting = data => postJSON(`${config.host}/reportIncomeTax/saveSetting` , data)

/**
 * 保存增值税申报设置
 * @param data
 * @returns {*}
 */
export const saveValueAddSetting = data => postJSON(`${config.host}/reportValueAddedTax/saveSetting` , data)

/**
 * 获取申报设置
 * @param data
 * @returns {*}
 */
export const getReportSetting = data => getJSON(`${config.host}/reportSettings/getReportSetting`, data)

/**
 * @desption 【组织管理】获取所有总公司
 */
export const getZgsList = (data) => postJSON(`${config.host}/taxBody/getZgsList`, data);

/**
 * @description 获取合并报表编码
 */
export const getDataHbbbCode = data => postJSON(`${config.host}/dataHbbbCode/getList` , data)

/**
 * @description 获取申报税种
 */
export const getTaxTypes = data => postJSON(`${config.host}/taxType/getTaxTypes` , data)

/**
 * @description 保存纳税主体选择的申报税种
 */
export const saveTaxCheckedTypes = data => postJSON(`${config.host}/taxCheckedType/add` , data)
