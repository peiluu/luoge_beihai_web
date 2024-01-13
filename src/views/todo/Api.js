// 数据字典
import { deleteOne, postJSON } from '@/utils/request';
import { config } from "@/config"

// 获取列表
export const getList = (data) =>
  postJSON(`${config.host}/home/redApplyList`, data);

// 通过
export const passRefuseList = (data) =>
  postJSON(`${config.host}/Customer/customerPage`, data);

