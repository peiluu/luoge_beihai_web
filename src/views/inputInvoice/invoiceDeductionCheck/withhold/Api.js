// 数据字典
import { postJSON, download } from '@/utils/request';
import { config } from '@/config';

// 获取列表
export const getList = data =>
  postJSON(`${config.host}/income/queryWithholdList`, {
    ...data,
    sign: data.cljg == '01' ? 'Y' : ''
  });

// 批量上传增值税代扣代缴完税凭证抵扣勾选
export const batchWithhold = data =>
  postJSON(`${config.host}/income/submitRevokeWithhold`, data, null, true);

/**
 * @desption 获取当前用户可以开票的开票点（不分页）
 */
export const getOrgList = data => postJSON(`${config.host}/orgnization/getOrgList`, data);

/**
 * @desption 导出
 */
export const exportWithholdList = data =>
  download(`${config.host}/income/exportWithholdList`, data);
