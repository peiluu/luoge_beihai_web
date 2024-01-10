// 数据字典
import {
  getOne,
  postOne,
  deleteOne,
  postJSON
  } from '@/utils/request.js'

import { config } from "@/config"
/**
 * 获取开票点列表
 * @param data
 * @returns {*}
 */
export const getList = data => postJSON(`${config.host}/orgnization/getOrgListPage`, data)
/**
 * 开票点详情
 * @param data
 * @returns {*}
 */
export const getOrgDetail = data => postJSON(`${config.host}/taxBody/detailByOrgId`, data)
/**
 * 客户档案
 * @param data
 * @returns {*}
 */
export const getCustomerPage = data => postJSON(`${config.host}/Customer/getCustomerPage`, data)
/**
 * 常用客户
 * @param data
 * @returns {*}
 */
export const getFrequentCustomerPage = data => postJSON(`${config.host}/Customer/getCommonUseCustomerPage`, data)
/**
 * @desption 获取可用税率
 */
export const getTaxRates = data => postJSON(`${config.host}/blueInvoice/getTaxRates`, data);

// 校验是否可以开票
export const checkOpenInvoice = (data) => postJSON(`${config.host}/blueInvoice/checkOpenInvoice`, data)

/**
 * 保存发票
 * @param data
 * @returns {*}
 */
  export const saveInvoice = data => postJSON(`${config.host}/blueInvoice/issueInvoice`, data);

/**
 * 初始化行政区划
 * @param data
 * @returns {*}
 */
export const listDistrictDict = data => postJSON(`${config.host}/Dict/listCascaderDict/1/3`, data);

/**
 * 保存发票预览
 * @param data
 * @returns {*}
 */
export const saveInvoicePreview = data => postJSON('/invoicePreview/saveInvoicePreview', data);

/**
 * 查询发票预览
 * @param data
 * @returns {*}
 */
export const getInvoicePreview = data => postJSON(`${config.host}/invoicePreview/getInvoicePreview`, data);

/**
 * 根据id获取发票详情
 * @param data
 * @returns {*}
 */
export const getInvoiceDetailById = data => postJSON('/applyInvoiceUpload/getDetailById', data);

/**
 * 已开具发票详情
 * @param data
 * @returns {*}
 */
export const invoiceInfo = data => postJSON(`${config.host}/invoiceUpload/invoiceInfo/${data.id}`, data);

/**
 * 根据id获取发票详情 - 从已开票入口进入
 * @param data
 * @returns {*}
 */
export const getCopyDetailById = data => postJSON(`${config.host}/invoiceUpload/getCopyDetailById`, data);

/**
 * 获取开票点下拉框
 * @param data
 * @returns {*}
 */
export const getOrgSelections = data => postJSON(`${config.host}/orgnization/getOrgList`, data)

/**
 * 获取开票组织的项目下拉框
 * @param data
 * @returns {*}
 */
export const getProjectSelections = data => postJSON(`${config.host}/orgnization/getProjectList/`+data)

/**
 * 获取项目的房间信息
 * @param data
 * @returns {*}
 */
export const getRoomInfos = data => postJSON(`${config.host}/orgnization/getRoomInfos`, data)

/**
 * 获取项目获取分期下拉框
 * @param data
 * @returns {*}
 */
export const getInstallmentOptions = data => postJSON(`${config.host}/orgnization/getInstallmentOptions/`+data)

/**
 * 获取项目获取楼栋下拉框
 * @param data
 * @returns {*}
 */
export const getBlockOptions = data => postJSON(`${config.host}/orgnization/getBlockOptions/`+data)

export const getProductTypeOptions = data => postJSON(`${config.host}/orgnization/getProductTypeOptions/`)



