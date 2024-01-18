// 数据字典
import {
  getJSON,
  postJSON,
  openFile,
  download
} from '@/utils/request';
import { config } from '@/config';
/**
 * 获取主体列表
 * @param data
 * @returns {*}
 */
export const getTaxBody = data => postJSON(`${config.host}/taxBody/getListByUser` , data)
/**
 * 查询纳税申报记录
 * @param data
 * @returns {*}
 */
export const getList = data => postJSON(`${config.host}/taxDeclaration/page` , data)

/**
 * 保存纳税申报
 * @param data
 * @returns {*}
 */
export const saveTaxDeclaration = data => postJSON(`${config.host}/taxDeclaration/add` , data)

/**
 * 删除纳税申报
 * @param data
 * @returns {*}
 */
export const delDeclaration = data => postJSON(`${config.host}/taxDeclaration/delete/` + data)

/**
 * 打开申报表
 * @param data
 * @returns {*}
 */
export const openDeclaration = data => openFile(`${config.host}/taxDeclaration/openDeclaration/`+data)

/**
 * 计算纳税申报数据
 * @param data
 * @returns {*}
 */
export const calcDeclaration = data => postJSON(`${config.host}/taxDeclaration/calcDeclaration/`+data)

/**
 * 保存申报表明细数据
 * @param data
 * @returns {*}
 */
export const saveDeclarationDetail = (data, taxDeclarationId) => postJSON(`${config.host}/taxDeclaration/saveDeclarationDetail/`+taxDeclarationId, data)

/**
 * 查询申报表明细数据
 * @param data
 * @returns {*}
 */
export const listDeclarationDetail = data => postJSON(`${config.host}/taxDeclaration/listDeclarationDetail/`+data)
/**
 * @param data
 * @returns {*}
 */
export const reportTemplate = data => getJSON(`${config.host}/reportSettings/reportTemplate` , data)
/**
 * 查询申报表动态行数据
 * @param data
 * @returns {*}
 */
export const getDynamicRowData = data => postJSON(`${config.host}/taxDeclaration/getDynamicRowData/`+data)
/**
 * 更新申报数据状态
 * @param data
 * @returns {*}
 */
export const batchUpdateStatus = data => postJSON(`${config.host}/taxDeclaration/batchUpdateStatus/`,data)

/**
 * 上传完税凭证
 * @param data
 * @returns {*}
 */
export const saveTaxReceipt = data => postJSON(`${config.host}/taxDeclaration/saveTaxReceipt`,data)

/**
 * @desption Excel导出
 */
export const exportDeclaration = (data) => download(`${config.host}/taxDeclaration/exportDeclaration`, data);
