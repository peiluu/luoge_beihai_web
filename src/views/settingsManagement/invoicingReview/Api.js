// 数据字典
import { postJSON,getJSON } from '@/utils/request.js';
import { config } from "@/config"
// 获取列表
export const getList = data => postJSON(`${config.host}/orgnization/getAuditList`, data);

/**
 * @desption 开票审核设置 审核设置
 */
export const auditSet = data => postJSON(`${config.host}/orgnization/auditSet `, data, null, false);
/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @description 查询审核人
 */
//export const selectShr = data => postJSON(`${config.host}/orgnization/selectShr`, data);

export const selectShr = data => getJSON(`${config.hostUser}/getUserList`, data);
/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = data => postJSON(`${config.host}/orgnization/getOrgList`, data);
