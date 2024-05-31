// 数据字典
import {
  postJSON
  } from '@/utils/request'


  // 获取列表
  export const getList = data => postJSON(`/applyInvoiceUpload/queryProcess`, data)

  // 修改
  export const editBatch = (data) => postJSON(`/applyInvoiceUpload/passRefuseList`, data)
