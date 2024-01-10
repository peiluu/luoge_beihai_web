// 数据字典
import { postJSON, download } from '@/utils/request';

// 【组织管理】获取组织列表
export const getList = data =>
  postJSON(`/orgnization/selectOrgPage`, { ...data, isInvoice: 'Y' });

/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = data => postJSON(`/orgnization/getOrgList`, data);

/**
 * @description 【组织管理】新增组织
 */
export const saveOrg = data =>
  postJSON(`/orgnization/saveOrg`, data, null, true);

/**
 * @description 【组织管理】修改组织
 */
export const updateOrg = data =>
  postJSON(`/orgnization/updateOrg`, data, null, true);

/**
 * @description 【组织管理】获取详情
 */
export const loadOrgDetail = data =>
  postJSON(`/orgnization/loadOrgDetail`, data);

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`/taxBody/getListByUser`, data);

/**
 * @desption 查询开票人
 */
export const selectKpr = data => postJSON('/invoiceUpload/selectKpr', data);

/**
 * @desption 【组织管理】获取编码版本号
 */

export const bmb_bbh = data => postJSON('/taxMech/bmb_bbh', data);

/**
 * @desption 【组织管理】删除组织
 */

export const delOrg = data => postJSON('/orgnization/delOrg', data);
/**
 * @desption 【组织管理】转移组织
 */

export const moveOrg = data => postJSON('/orgnization/moveOrg', data);

/**
 * @desption 【组织管理】设置启停
 */

export const setEnable = data => postJSON('/orgnization/setEnable', data);

/**
 * @desption 【组织管理】获取开票终端代码
 */
export const queryInvoicingTerminal = data =>
  postJSON('/invoicingTerminal/queryInvoicingTerminal', data);

/**
 * @description 获取所有主体（不分页）
 */
export const getListAll = data => postJSON(`/taxBody/getListAll`, data, null, true);

/**
 * @desption 下载excel模板
 */
export const downExcel = data => download(`/taxBody/downExcel/2`, data);

/**
 * @desption 【组织管理】开票点列表Excel导出
 */
export const exportOrganizationInfo = data =>
  download('/orgnization/exportOrganizationInfo', data);
