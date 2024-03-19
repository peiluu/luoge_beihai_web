<template>
    <el-empty description="Oops，访问的页面不见了!">
        <el-button type="primary" @click="$router.replace('/')">返回首页</el-button>
        <el-button @click="contactManager">联系管理员</el-button>
    </el-empty>
</template>

<script>
export default {
    methods: {
        contactManager() {
            this.$message.success('已联系管理员处理')
        }
    }
}
</script>