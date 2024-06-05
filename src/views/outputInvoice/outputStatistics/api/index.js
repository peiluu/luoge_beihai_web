import {
    getJSON,
    download,
    postJSON
} from '@/utils/request.js'
import { config } from "@/config"

export const getListData = data => getJSON(`${config.host}/invoiceUpload/staticsInvoice`, data);

/* down */
export const downListData = data => download(`${config.host}/invoiceUpload/exportStaticsInvoice`, data,null,true);