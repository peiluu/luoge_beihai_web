// 数据字典
import { postJSON, download } from '@/utils/request';
import { config } from '@/config';

  // 获取列表
  export const getList = data => postJSON(`${config.host}/income/queryCustomsPayment`, data)

// 批量上传增值税代扣代缴完税凭证抵扣勾选
export const batchWithhold = data =>
  postJSON(`${config.host}/income/submitRevokeWithhold`, data, null, true);

/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = data => postJSON(`${config.host}/orgnization/getOrgList`, data);

  /**
   * @desption 导出查询结果
   */
  export const exportInvoiceCheck = data => download(`${config.host}/income/exportInvoiceCheck`, data);
    /**
   * @desption 获取当前用户会计科目（不分页）
   */
    export const getKjList = data => postJSON(`${config.host}/mtc/accountingSubjects/list`, data);
       /**
   * @desption 提交勾选
   */
       export const checkCustomsPayment = data => postJSON(`${config.host}/income/checkCustomsPayment`, data);
       /**
 * @desption 提交撤销预勾选
 */
export const checkPreOneHgjks = data =>
postJSON(`${config.host}/income/checkPreOneHgjks/`, data);
/**
 * @desption 计算税额
 */
export const cstateHgjks = data =>
  postJSON(`${config.host}/income/cstateHgjks/${data.nsrsbh}/${data.skssq}`, data);