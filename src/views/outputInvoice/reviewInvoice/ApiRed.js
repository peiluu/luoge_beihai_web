// 数据字典
import {
  postJSON
  } from '@/utils/request'


  // 获取列表
  export const getList = data => postJSON(`/redInvoice/redInvoiceCheckList`, data)

  // 修改
  export const editBatch = (data) => postJSON(`/redInvoice/passRefuseList`, data)
