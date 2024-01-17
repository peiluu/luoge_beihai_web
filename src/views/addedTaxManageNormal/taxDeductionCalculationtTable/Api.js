import { postJSON, download } from '@/utils/request';
import { config } from "@/config"

/**
 * @description 查询税额抵减计算表
 */
export const selectLedger = (data) =>
  postJSON(`${config.host}/ledgerReductionSheet/selectLedger`, data);

/**
 * @description 查询免税收入台账详情
 */
export const detail = (data) => postJSON(`${config.host}/ledgerReductionSheet/detail`, data);
/**
 * @description 修改
 */
export const update = (data) => postJSON(`${config.host}/ledgerReductionSheet/update`, data);
/**
 * @description 删除
 */
export const deleteObj = (data) =>
  postJSON(`${config.host}/ledgerReductionSheet/delete`, data);

/**
 * @description 新增
 */
export const add = (data) =>
  postJSON(`${config.host}/ledgerReductionSheet/add`, data, null, true);

/**
 * @description 批量修改
 */
export const saveOrUpdateBatch = (data) =>
  postJSON(`${config.host}/ledgerReductionSheet/saveOrUpdateBatch`, data);

/**
 * @description 税额抵减计算表数据初始化
 */
export const dataInitialization = (data) =>
  postJSON(`${config.host}/ledgerReductionSheet/dataInitialization`, data);

/**
 * @description 查询税额加计抵减计算表
 */
export const queryAmountDeduct = (data) =>
  postJSON(`${config.host}/ledger/queryAmountDeduct`, data);
/**
 * @description 税额加计抵减取数
 */
export const fetchAmountDeduct = (data) =>
  postJSON(`${config.host}/ledger/fetchAmountDeduct`, data);


/**
 * @description 查询减免性质代码
 */
export const queryDicSedjjmlx = data => postJSON(`${config.host}/dicSedjjmlx/list`, data);

  /**
 * @description 查询申报状态
 */
  export const queryStatus = data => postJSON(`${config.host}/taxDeclaration/queryStatus`, data);

    /**
 * @desption 导出税额抵减计算表
 */
export const exportLedgerReductionSheet = (data) => download(`${config.host}/ledgerReductionSheet/downLoadList`, data);

  /**
 * @desption 导出税额加计抵减计算表
 */
  export const downloadAmountDeduct = (data) => download(`${config.host}/ledger/downloadAmountDeduct`, data);
