// 数据字典
import { deleteOne, postJSON, download } from '@/utils/request';
import { config } from "@/config"

// 获取列表
export const getList = (data) =>
  postJSON(`${config.host}/dishonest/sxryhmdPage`, data);

/**
 * @desption Excel导出
 */
export const exportMghw = data =>
download(`${config.host}/dishonest/exportSxryhmd `, data);

/**
* @desption 删除
*/
export const delById = data =>
postJSON(`${config.host}/dishonest/deleteSxryhmd`, data);

/**
* @desption 新增
*/
export const addMghw = data => postJSON(`${config.host}/dishonest/addSxryhmd`, data);

/**
* @desption 编辑
*/
export const updateMghw = data => postJSON(`${config.host}/dishonest/updateSxryhmd`, data);


