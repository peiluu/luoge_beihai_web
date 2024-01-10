// 数据字典
import { postJSON, download } from '@/utils/request';

/**
 * @desption 【组织管理】纳税主体列表
 */
export const getList = (data) => postJSON(`/taxBody/selectPage`, data);

/**
 * @desption 初始化行政区划
 */
export const listCascaderDict = (data) =>
  postJSON('/Dict/listCascaderDict/1/3', data);

/**
 * @desption 【组织管理】获取业态选择下拉
 */
export const selectYtList = (data) => postJSON(`/taxBody/selectYtList`, data);

/**
 * @desption 【组织管理】获取区域选择下拉
 */
export const selectQyList = (data) => postJSON(`/taxBody/selectQyList`, data);
/**
 * @desption 【组织管理】根据id获取纳税主体详情
 */
export const getDetailById = (data) => postJSON(`/taxBody/getDetailById`, data);

/**
 * @desption 【组织管理】保存纳税主体
 */
export const addTaxBody = (data) =>
  postJSON(`/taxBody/addTaxBody`, data, null, true);

/**
 * @desption 【组织管理】获取所有总公司
 */
export const getZgsList = (data) => postJSON(`taxBody/getZgsList`, data);

/**
 * @desption 初始化行政区划 - 税务局
 */
export const listCascaderDictTaxArea = (data) =>
  postJSON('/Dict/listCascaderDict/1/1', data);

/**
 * @desption 【组织管理】更新纳税主体
 */
export const updateTaxBody = (data) =>
  postJSON(`/taxBody/updateTaxBody`, data, null, true);

/**
 * @desption 【组织管理】 删除企业
 */
export const delTaxBodyBatch = (data) =>
  postJSON(`/taxBody/delTaxBodyBatch`, data.ids);

/**
 * @desption 【组织管理】设置是否开通数电
 */
export const setIsDigital = (data) => postJSON(`/taxBody/setIsDigital`, data);

export const openDigitalBatchApi = (data) =>
  postJSON(`/taxBody/openDigitalBatch`, data);

/**
 * @description 获取所有主体（不分页）
 */
export const getListAll = (data) => postJSON(`/taxBody/getListAll`, data);

/**
 * @description 获取主体扩展信息
 */
export const getTaxPayerInfo = (data) =>
  postJSON(`/taxBody/getTaxPayerInfo`, data);

/**
 * @desption 【组织管理】纳税主体列表Excel导出
 */
export const exportTaxBodyInfo = (data) =>
  download('/taxBody/exportTaxBodyInfo', data);

/**
 * @desption 【组织管理】纳税主体列表Excel导入
 */
export const importTaxBodyExcelInfo = (data) =>
  download('/taxBody/importTaxBodyExcelInfo', data);

/**
 * @desption 下载excel模板
 */
export const downExcel = (data) => download(`/taxBody/downExcel/1`, data);

/**
 * @desption 获取当前用户可以开票的账套（不分页）
 */
export const getAllZt = (data) => postJSON(`/taxBody/getAllZt`, data);

/**
 * @desption 获取所属税局
 */
export const getTaxArea = (data) => postJSON(`/taxBody/tax-area`, data);

