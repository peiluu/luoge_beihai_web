// 数据字典
import { postJSON, download } from '@/utils/request';
import { config } from '@/config';

// 查询分页
export const getList = data =>
  postJSON(`${config.host}/ledgerKeynoteGroupDetail/page` ,data);

/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = data => postJSON(`${config.host}/orgnization/getOrgList`, data);


export const previousOffsetDetail = data => postJSON(`${config.host}/ledgerRetiredSoldiers/detail`, data);
/**
 * @description 新增
 */
export const saveOrg = data =>
  postJSON(`${config.host}/ledgerKeynoteGroupDetail/add`, data, null, true);

/**
 * @description 修改
 */
export const updateOrg = data =>
  postJSON(`${config.host}/ledgerKeynoteGroupDetail/update`, data, null, true);
/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @desption 刪除
 */

export const del = data => postJSON(`${config.host}/ledgerKeynoteGroupDetail/delete`, data);

/**
 * @desption 下载excel模板
 */
export const downExcel = data => download(`${config.host}/taxBody/downExcel/3`, data);

/**
 * @desption 导出
 */
export const downLoadList = data =>
  download(`${config.host}/ledgerKeynoteGroupDetail/downLoadList`, data);
