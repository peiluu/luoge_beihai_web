// 数据字典
import { postJSON, download } from '@/utils/request';
import { config } from "@/config"

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
export const getListall = data => postJSON(`${config.host}/taxBody/getListAll`, data);
/**
 * @desption 【组织管理】纳税主体列表
 */
export const getList = (data) => postJSON(`${config.host}/invoice-kpxz/kpxzPage`, data);
/**
 * @desption 【组织管理】 删除企业
 */
export const deleteBatch = (data) =>
  postJSON(`${config.host}/invoice-kpxz/delete`, data);

/**
 * @desption 修改客户信息
 */
export const updateInvoicekpxz = (data) => postJSON(`${config.host}/invoice-kpxz/update`, data);

/**
 * @desption 新增客户信息
 */
export const  addInvoicekpxz  = (data) => postJSON(`${config.host}/invoice-kpxz/add`, data);
/**
 * @desption 黑名单
 */
export const  hmdCustomer  = (data) => postJSON(`${config.host}/Customer/hmd`, data);

/**
 * @desption 新增客户信息
 */
export const  getDetailById  = (data) => postJSON(`${config.host}/Customer/getDetail`, data);
/**
 * @desption 获取税率list
 */
export const  getDicZzsSl  = (data) => postJSON(`${config.host}/dicZzsSl/list`, data);
