// 数据字典
import { postJSON, download } from '@/utils/request';
import { config } from '@/config';

// 【会计科目与税率维护】获取列表
export const getList = data => postJSON(`${config.host}/ledgerAccountMapping/page`, { ...data});

// 【会计科目与税率维护】新增
export const addAccountMapping = data => postJSON(`${config.host}/ledgerAccountMapping/add`, { ...data});

// 【会计科目与税率维护】修改
export const updateAccountMapping = data => postJSON(`${config.host}/ledgerAccountMapping/update`, { ...data});

// 【会计科目与税率维护】删除
export const deleteAccountMapping = data => postJSON(`${config.host}/ledgerAccountMapping/delete`, { ...data});

/**
 * @desption 【会计科目与税率维护】列表Excel导出
 */
export const exportAccountMappingInfo = data => download(`${config.host}/ledgerAccountMapping/download`, data);
/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = (data) => postJSON(`${config.host}/taxBody/getListByUser`, data);

/**
 * @desption 查询科目编码与名称
 */
export const getAccountingSubject = data => postJSON(`${config.host}/mtc/accountingSubjects/list`, data);

/**
 * 查询业态
 * @param data
 * @returns {*}
 */
export const selectBusinessList = data => postJSON(`${config.host}/taxBody/selectYtList`, data)
