export default {
	namespaced: true,

	state: {
		id: 0,
		name: '',
		superAdmin: 0,
		// 企业信息
		taxpayerInfo: {},
	},
	// 从store 中的 state 中派生出一些经过二次处理的状态，
	getters: {
		nsrsbm: state => {
			return state.taxpayerInfo.nsrsbm;
		},
	},

	mutations: {
		saveUser(state, params) {
			state = {
				...state,
				...params,
			};
		},
	},
	actions: {
		updateUser(context, params) {
			context.commit('saveUser', params);
		},
	},
};
