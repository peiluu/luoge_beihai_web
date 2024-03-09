import { postJSON,getJSON } from '@/utils/request';
import { config } from "@/config"

/**
 * @desption 商品分类树形左边
 */
export const getcommondityTreeList = data => postJSON(`${config.host}/materialClass/tree`, data);

export const postcommondityAddSingle = data=> postJSON(`${config.host}/materialClass/add`,data); 

export const delectcommonditySingle = data=> postJSON(`${config.host}/materialClass/delete`,data);

export const updateCommonditySingle = data=> postJSON(`${config.host}/materialClass/update`,data);
/**
 * @desption 商品添加分类树形左边
 */
export const getcommondityAddTreeList = data => postJSON(`${config.host}/invoiceTaxCode/tree`, data);

export const addCommonditySingle = data=> postJSON(`${config.host}/material/add`,data); 

export const getTableSourceList = data=> postJSON(`${config.host}/material/page`,data);

/* 获取税率下拉 */
export const getTaxrateList = data=> postJSON(`${config.host}/dicZzsSl/list`,data);

/* 获取税率单位下拉 */
export const getUnitList = data=> postJSON(`${config.host}/dicDw/list`,data);

/* 获取税率单位下拉 */
export const delTableRowSingle = data=> postJSON(`${config.host}/material/delete`,data);

/* 获取所属开票点下拉 */
export const getallBilling = data=> postJSON(`${config.host}/orgnization/getOrgList`,data);

/* 获取商品详情 */
export const getCommodityDes = data=> postJSON(`${config.host}/invoiceTaxCode/detail`,data);

export const updateCommondityRow = data=> postJSON(`${config.host}/material/update`,data); 

/* 获取编辑详情 */
export const getCommondityDes = data=> postJSON(`${config.host}/material/detail`,data);
/* 离开请求 */
export const getNameDes = data=> getJSON(`${config.host}/invoiceTaxCode/getBySpmc`,data);

//   /**
//  * @desption 获取当前用户可以开票的开票点（不分页）
//  */
//   export const getOrgList = data => postJSON(`${config.host}/orgnization/getOrgList`, data);

// /**
//  * @desption 发票状态信息查询 是否可红冲
//  */
// export const invoiceUsedStatus = data =>
//   postJSON(`${config.host}/redInvoice/invoiceUsedStatus`, data);


// // 查看红字申请单详情
// export const getRedInvoice = data =>
//   postJSON(`${config.host}/redInvoice/getRedInvoice/${data.id}`);
