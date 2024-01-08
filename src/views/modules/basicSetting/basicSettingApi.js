import request from '@/utils/request';
import { config } from '@/config';

/**
 * @desption - 基础设置 - 查询当前用户基础信息设置
 */
export const getDetail = function (data) {
	return request.get(config.host + '/basicSetting/detail');
};

/**
 * @desption - 基础设置 - 新增、修改基础设置。
 */
export const editBasicSetting = function (data) {
	return new Promise((resolve, reject) => {
		request
			.post(config.host + '/basicSetting/setting', JSON.stringify(data), {
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
 * @desption - 基本设置 - 获取三方账户信息
 */
export const getBankInfo = function (data) {
	return new Promise((resolve, reject) => {
		request
			.post(
				config.host + '/Agreement/getBankInfo/' + data.nsrsbm,
				JSON.stringify(data),
				{
					headers: { 'Content-Type': 'application/json', 'Data-Type': 'json' },
				}
			)
			.then(res => {
				resolve(res);
			})
			.catch(err => {
				reject(err);
			});
	});
};

/**
 * @desption - 基本设置 - 获取三方信息列表
 */
export const getByTaxpayer = function (data) {
	return new Promise((resolve, reject) => {
		request
			.post(
				config.host + '/Agreement/getByTaxpayer/' + data.nsrsbm,
				JSON.stringify(data),
				{
					headers: { 'Content-Type': 'application/json', 'Data-Type': 'json' },
				}
			)
			.then(res => {
				resolve(res);
			})
			.catch(err => {
				reject(err);
			});
	});
};

/**
 * @desption - 基本设置 - 同步第三方账户
 */
export const queryAgreement = function (data) {
	return new Promise((resolve, reject) => {
		request
			.post(
				config.host + '/Agreement/queryFromTax/' + data.nsrsbm,
				JSON.stringify(data),
				{
					headers: { 'Content-Type': 'application/json', 'Data-Type': 'json' },
				}
			)
			.then(res => {
				resolve(res);
			})
			.catch(err => {
				reject(err);
			});
	});
};

/**
 * @desption - 基本设置 - 修改默认三方
 */
export const updateDefaultAgreement = function (data) {
	console.log(data);
	return new Promise((resolve, reject) => {
		request
			.post(
				config.host + '/Agreement/updateDefaultAgreement',
				JSON.stringify(data),
				{
					headers: { 'Content-Type': 'application/json', 'Data-Type': 'json' },
				}
			)
			.then(res => {
				resolve(res);
			})
			.catch(err => {
				reject(err);
			});
	});
};
