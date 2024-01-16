// 数据字典
import { postJSON, download } from '@/utils/request';
import { config } from "@/config"



/**
 * @desption 初始化行政区划
 */
export const listCascaderDict = (data) =>
  postJSON(`${config.host}/Dict/listCascaderDict/1/3`, data);

/**
 * @desption 【组织管理】获取业态选择下拉
 */
export const selectYtList = (data) => postJSON(`${config.host}/taxBody/selectYtList`, data);

/**
 * @desption 【组织管理】获取区域选择下拉
 */
export const selectQyList = (data) => postJSON(`${config.host}/taxBody/selectQyList`, data);
/**
 * @desption 【组织管理】根据id获取纳税主体详情
 */
export const getDetailById = (data) => postJSON(`${config.host}/taxBody/getDetailById`, data);

/**
 * @desption 【组织管理】保存纳税主体
 */
export const addTaxBody = (data) =>
  postJSON(`/taxBody/addTaxBody`, data, null, true);

/**
 * @desption 【组织管理】获取所有总公司
 */
export const getZgsList = (data) => postJSON(`${config.host}/taxBody/getZgsList`, data);


/**
 * @desption 【组织管理】更新纳税主体
 */
export const updateTaxBody = (data) =>
  postJSON(`${config.host}/taxBody/updateTaxBody`, data, null, true);



/**
 * @desption 【组织管理】设置是否开通数电
 */
export const setIsDigital = (data) => postJSON(`${config.host}/taxBody/setIsDigital`, data);

export const openDigitalBatchApi = (data) =>
  postJSON(`${config.host}/taxBody/openDigitalBatch`, data);

/**
 * @description 获取所有主体（不分页）
 */
export const getListAll = (data) => postJSON(`${config.host}/taxBody/getListAll`, data);

/**
 * @description 获取主体扩展信息
 */
export const getTaxPayerInfo = (data) =>
  postJSON(`${config.host}/taxBody/getTaxPayerInfo`, data);

/**
 * @desption 获取当前用户可以开票的账套（不分页）
 */
export const getAllZt = (data) => postJSON(`${config.host}/taxBody/getAllZt`, data);

/**
 * @desption 获取所属税局
 */
export const getTaxArea = (data) => postJSON(`${config.host}/taxBody/tax-area`, data);

/**
 * @desption 【组织管理】设置启停
 */
export const setEnable = data => postJSON(`${config.host}/orgnization/setEnable`, data);



/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = data => postJSON(`${config.host}/orgnization/getOrgList`, data);
/**
 * @desption 【组织管理】纳税主体列表
 */
export const getList = (data) => postJSON(`${config.host}/Customer/customerPage`, data);
/**
 * @desption 【组织管理】 删除企业
 */
export const deleteBatch = (data) =>
  postJSON(`${config.host}/Customer/deleteBatch`, data.ids);

/**
 * @desption 修改客户信息
 */
export const update = (data) => postJSON(`${config.host}/Customer/update`, data);

