import {
    getJSON,
    download,
    postJSON
} from '@/utils/request.js'
import { config } from "@/config"

export const getListData = data => postJSON(`${config.host}/invoiceUpload/staticsInvoice`, data);

/* down */
export const downListData = data => download(`${config.host}/invoiceUpload/exportStaticsInvoice`, data,null,true);

/**
 * @description 根据用户获取有权限的所有主体（不分页）
 */
export const getListByUser = data => postJSON(`${config.host}/taxBody/getListByUser`, data);