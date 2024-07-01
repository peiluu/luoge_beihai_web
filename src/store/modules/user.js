import {config} from '@/config/index.js'
import {
	getOne,
	postOne,
	deleteOne,
	postJSON,
	getJSON
	} from '@/utils/request.js'
export default {
	namespaced: true,

	state: {
		id: 0,
		username: '',
		superAdmin: 0,
		// 企业信息
		taxpayerInfo: {},
		dictionariesData:[],
	},
	// 从store 中的 state 中派生出一些经过二次处理的状态，
	getters: {
		nsrsbm: state => {
			return state.taxpayerInfo.nsrsbm;
		},
		/* 字典数据获取 */
		getDictionaries: (state) => state.dictionariesData
	},

	mutations: {
		saveUser(state, data) {
			for(let k in data){
				state[k] = data[k]
			}
		},
		/* 设置字典数据 */
		SET_DICTIONARIES_DATA(state, data) {
			state.dictionariesData = data;
		  },
		  /* 清除字典数据 */
		CLEAR_DICTIONARIES_DATA(state) {
			state.dictionariesData = {};
		}
	},
	actions: {
		updateUser(context, params) {
			context.commit('saveUser', params);
		},
		/* 请求获取字典数据 */
		async fetchDictionariesData({ commit }) {
			try {
			  const response = await getJSON(`${config.hostUser}/sys/dict/type/all`,);
			  console.log(response,"dict")
			  commit('SET_DICTIONARIES_DATA', response.data);
			} catch (error) {
			  console.error('Error fetching dictionaries data:', error);
			}
		  },
		  /* 清除字典数据 */
		  clearDictionariesData({ commit }) {
			commit('CLEAR_DICTIONARIES_DATA');
		  }
	},
};
