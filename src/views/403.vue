<template>
    <el-empty description="当前您没有权限访问该系统!">
        <el-button type="primary" @click="contactManager">重新登录</el-button>
    </el-empty>
</template>

<script>
import { auth } from '@/utils/auth';

export default {
    methods: {
        contactManager() {
            auth.logout()
        }
    }
}
</script>
