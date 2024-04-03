import { postJSON, download } from '@/utils/request';
import { config } from '@/config';

// 获取列表
export const getList = data =>
  postJSON(`${config.host}/dishonest/mghwPage`, data);

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @desption Excel导出
 */
export const exportMghw = data =>
  download(`${config.host}/dishonest/exportMghw`, data);

/**
 * @desption 删除
 */
export const delById = data =>
  postJSON(`${config.host}/dishonest/deleteMghw`, data);

/**
 * @desption 新增
 */
export const addMghw = data => postJSON(`${config.host}/dishonest/addMghw`, data);

/**
 * @desption 编辑
 */
export const updateMghw = data => postJSON(`${config.host}/dishonest/updateMghw`, data);