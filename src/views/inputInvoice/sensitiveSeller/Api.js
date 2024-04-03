import { postJSON, download } from '@/utils/request';
import { config } from '@/config';

// 获取列表
export const getList = data =>
  postJSON(`${config.host}/dishonest/mgxfmcPage`, data);

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @desption Excel导出
 */
export const exportMghw = data =>
  download(`${config.host}/dishonest/exportMgxfmc`, data);

/**
 * @desption 删除
 */
export const delById = data =>
  postJSON(`${config.host}/dishonest/deleteMgxfmc`, data);

/**
 * @desption 新增
 */
export const addMghw = data => postJSON(`${config.host}/dishonest/addMgxfmc`, data);

/**
 * @desption 编辑
 */
export const updateMghw = data => postJSON(`${config.host}/dishonest/updateMgxfmc`, data);