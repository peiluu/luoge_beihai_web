<template>
    <div>
        <div class="form-title">算税结果</div>
        <el-form-item label="应纳税所得额" prop="ynssde">
            <el-input class="form-inline-input" v-model="form.ynssde" disabled></el-input>
        </el-form-item>
        <el-form-item label=" 应补退税额" prop="ybtse">
            <el-input class="form-inline-input" v-model="form.ybtse" disabled></el-input>
        </el-form-item>
    </div>
</template>
<script>
    export default {
        name: "CaltaxResult",
        props: {
            form: Object,
            rules: Object
        },
        data() {
            return {

            }
        },
        methods: {

        },
    };
</script>