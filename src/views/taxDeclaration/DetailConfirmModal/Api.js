import {
  postJSON
} from '@/utils/request'
import { config } from  '@/config';
export const listLegerConfirm = (id, sjlx) => postJSON(`${config.host}/taxDeclaration/listLegerConfirm/${id}/${sjlx}` )

export const doConfirm = (data) => postJSON(`${config.host}/taxDeclaration/doConfirm`, data)
