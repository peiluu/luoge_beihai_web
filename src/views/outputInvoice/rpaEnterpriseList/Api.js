import { postJSON, getJSON } from '@/utils/request';

/**
 * @desption 查询开通RPA的纳税主体
 */
export const getList = (data) => postJSON('/rpa/queryBodyList', data);

/**
 * @desption 登录验证
 */
export const rpaLogin = (data) => postJSON('/rpa/login', data, null, true);

/**
 * @desption rpa/获取人脸识别二维码
 */
export const getFaceImg = (data) => postJSON('/rpa/getFaceImg', data, null, true);

/**
 * @desption rpa/获取人脸识别二维码
 */
export const refreshLoginState = (data) => postJSON('/rpa/refreshLoginState/' + data.nsrsbh);

