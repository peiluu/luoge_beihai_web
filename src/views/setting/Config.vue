<template>
    <div class="custom-content">
        <el-form ref="form" :model="form" label-width="180px">
            <el-form-item label="是否多页签模式">
                <el-checkbox v-model="form.tab">{{ form.tab ? '开启' : '关闭' }}</el-checkbox>
            </el-form-item>
            <el-form-item label="显示水印">
                <el-checkbox v-model="form.water">{{ form.water ? '开启' : '关闭' }}</el-checkbox>
            </el-form-item>
            <el-form-item label="是否开启页面切换动画">
                <el-checkbox v-model="form.animate">{{ form.animate ? '开启' : '关闭' }}</el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formLayout: "horizontal",
            form: {
                tab: false,
                animate: true,
                water: true,
            }
        };
    },
    mounted () {
        this.form.tab = this.$store.state.app.useTab
        this.form.animate = this.$store.state.app.useAnimate
        this.form.water = this.$store.state.app.useWater
    },
    methods: {
        handleSubmit() {
            this.$store.dispatch('app/saveUseTab', this.form.tab)
            this.$store.dispatch('app/saveUseAnimate', this.form.animate)
            this.$store.dispatch('app/saveUseWater', this.form.water)
        },
    },
};
</script>
