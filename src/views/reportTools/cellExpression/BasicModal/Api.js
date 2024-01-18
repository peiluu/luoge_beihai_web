import {
  postJSON
} from '@/utils/request'
import { config } from '@/config';
/**
 * 根据类型获取数据源
 * @param data
 * @returns {*}
 */
export const selectDeclareSettingList = data => postJSON(`${config.host}/taxDeclaration/selectDeclareSettingList/` , data)
