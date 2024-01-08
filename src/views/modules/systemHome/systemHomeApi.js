import request from '@/utils/request';
import { config } from '@/config';

/**
 * @desption -系统首页 - 获取首页企业信息
 */
export const getTaxpayer = function (data) {
	return new Promise((resolve, reject) => {
		request
			.post(config.host + '/basicSetting/taxpayer', JSON.stringify(data), {
				headers: { 'Content-Type': 'application/json', 'Data-Type': 'json' },
			})
			.then(res => {
				resolve(res);
			})
			.catch(err => {
				reject(err);
			});
	});
};

/**
 * @desption -系统首页 - 获取人员数量分析
 */
 export const getPersonnelData = function (data) {
	return new Promise((resolve, reject) => {
		request
			.post(config.host + '/Taxpayer/analyse/personnel', JSON.stringify(data), {
				headers: { 'Content-Type': 'application/json', 'Data-Type': 'json' },
			})
			.then(res => {
				resolve(res);
			})
			.catch(err => {
				reject(err);
			});
	});
};

/**
 * @desption -系统首页 - 获取缴税金额分析
 */
 export const getPayTaxesData = function (data) {
	return new Promise((resolve, reject) => {
		request
			.post(config.host + '/Taxpayer/analyse/payTaxes', JSON.stringify(data), {
				headers: { 'Content-Type': 'application/json', 'Data-Type': 'json' },
			})
			.then(res => {
				resolve(res);
			})
			.catch(err => {
				reject(err);
			});
	});
}; 	
