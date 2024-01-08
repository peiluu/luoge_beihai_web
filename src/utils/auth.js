import Cookies from 'js-cookie'

import { notEmpty } from './tool'

export const auth = {
    isLogin: () => {
        return notEmpty(auth.getToken())
    },
    
    getToken: () => {
        const key = process.env.VUE_APP_ENV_PACK
        return Cookies.get(key);
    },
    saveToken: token => {
        let exp = new Date()
        exp.setTime(exp.getTime() + 1*24*60*60*1000);
        const key = process.env.VUE_APP_ENV_PACK
        if (process.env.NODE_ENV == 'development') {
            Cookies.set(key, token, { expires: exp })
        }
        else {
            Cookies.set(key, token, { expires: exp, domain: 'mideazy.com' })
        }
    },
    removeToken: () => {
        const key = process.env.VUE_APP_ENV_PACK
        Cookies.remove(key);
        Cookies.remove(key, { domain: 'mideazy.com' })
    },

    getUserInfo: () => {
        const key = process.env.VUE_APP_ENV_USER;
        let user = Cookies.get(key);
        if (user && user.length > 0) {
            user = decodeURIComponent(user)
            return JSON.parse(user) 
        }
        return null
    },
    saveUserInfo: userInfo => {
        const info = encodeURIComponent(JSON.stringify(userInfo))
        const key = process.env.VUE_APP_ENV_USER;
        if (process.env.NODE_ENV == 'development') {
            Cookies.set(key, info)
        }
        else {
            Cookies.set(key, info, { domain: 'mideazy.com' })
        }
    },
    removeUserInfo: () => {
        const key = process.env.VUE_APP_ENV_USER;
        Cookies.remove(key)
        Cookies.remove(key, { domain: 'mideazy.com' })
    },

    getCurrentApp: () => {
        const key = process.env.VUE_APP_ENV_APP;
        return localStorage.getItem(key);
    },
    saveCurrentApp: appCode => {
        const key = process.env.VUE_APP_ENV_APP;
        localStorage.setItem(key, appCode)
    },
    removeCurrentApp: () => {
        const key = process.env.VUE_APP_ENV_APP;
        localStorage.removeItem(key);
    },

    changeApp: () => {
        location.reload();
    },
    logout: () => {
        auth.removeToken();
        auth.removeUserInfo();
        location.href = process.env.VUE_APP_SSO_LOGOUT + location.href.split('/#/')[0];
    }
}