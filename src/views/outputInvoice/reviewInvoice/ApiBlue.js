// 数据字典
import {
  postJSON
  } from '@/utils/request'

  import { config } from "@/config"
  // 获取列表
  export const getList = data => postJSON(`${config.host}/applyInvoiceUpload/queryProcess`, data)

  // 修改
  export const editBatch = (data) => postJSON(`${config.host}/applyInvoiceUpload/passRefuseList`, data)
