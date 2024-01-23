// 数据字典
import { postJSON, download } from '@/utils/request';
import { config } from '@/config';

// 查询退役士兵明细
export const getList = data =>
  postJSON(`${config.host}/ledgerRetiredSoldiers/page` ,data);

/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = data => postJSON(`${config.host}/orgnization/getOrgList`, data);

/**
 * @description 新增退役士兵明细
 */
export const saveOrg = data =>
  postJSON(`${config.host}/ledgerRetiredSoldiers/add`, data, null, true);

/**
 * @description 修改退役士兵明细
 */
export const updateOrg = data =>
  postJSON(`${config.host}/ledgerRetiredSoldiers/update`, data, null, true);
/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @desption 根据ID删除退役士兵明细表接口
 */

export const del = data => postJSON(`${config.host}/ledgerRetiredSoldiers/delete`, data);

/**
 * @desption 导出
 */
export const detailDownload = data =>
  download(`${config.host}/ledgerRetiredSoldiers/detailDownload`, data);
