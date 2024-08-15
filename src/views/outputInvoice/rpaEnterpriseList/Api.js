import { postJSON, getJSON } from '@/utils/request';
import { config } from "@/config"
/**
 * @desption 查询开通RPA的纳税主体
 */
export const getList = (data) => postJSON(`${config.host}/rpa/queryBodyList`, data);

/**
 * @desption 登录验证
 */
export const rpaLogin = (data) => postJSON(`${config.host}/rpa/login`, data, null, true);

/**
 * @desption rpa/获取人脸识别二维码
 */
export const getFaceImg = (data) => postJSON(`${config.host}/rpa/getFaceImg`, data, null, true);

/**
 * @desption rpa/获取人脸识别二维码
 */
export const refreshLoginState = (data) => postJSON(`${config.host}/rpa/refreshLoginState/` + data.nsrsbh);

