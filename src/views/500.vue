<template>
    <el-empty description="Oops，请您清除浏览器缓存，再重新登录！">
        <el-button type="primary" @click="logoutSys">重新登录</el-button>
    </el-empty>
</template>

<script>
    import { auth } from '@/utils/auth';
    export default {
        methods: {
            logoutSys() {
                auth.removeToken();
                auth.removeUserInfo();
                location.href = process.env.VUE_APP_SSO_LOGOUT + location.href.split('#')[0] + '#/home/index';
            },
        },
        created(){
            this.logoutSys();
        }
    }
</script>