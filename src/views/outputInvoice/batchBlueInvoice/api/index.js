import {
    getJSON,
    download,
    postJSON
} from '@/utils/request.js'
import { config } from "@/config"
/**
 * 获取开票点列表
 * @param data
 * @returns {*}
 */
export const getInvoiceQuota = data => getJSON(`${config.host}/management/warningSetting/getByOrgId`, data);

export const getUploadedData = data => postJSON(`${config.host}/excelInvoice/page`, data);

export const getBatchData = data => postJSON(`${config.host}/excelInvoice/detail`, data);

export const getBatchTaskData = data => postJSON(`${config.host}/invoiceExcelTask/queryPage`, data);

export const postBatchDoOnvoice = data => getJSON(`${config.host}/excelInvoice/openInvoice`, data);

/* del */
export const delBatchSingleData = data => getJSON(`${config.host}/invoiceExcelTask/remove?pch=${data}`, );

/* down */
export const downBatchTelleData = data => download(`${config.host}/invoiceExcelTask/downLoadTemplate`, data,null,true);



