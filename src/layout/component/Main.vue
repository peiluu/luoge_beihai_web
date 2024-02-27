<template>
    <div class="main">
        <transition :name="useAnimate?'fade-transform':''" mode="out-in">
            <router-view v-if="(editRoutes.includes($route.name)&&$route.query.opt=='add') || importRoutes.includes($route.name)"/>
            <keep-alive v-else>
                <router-view />
            </keep-alive>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'Main',
    data () {
        return {
            editRoutes: ['employeeEdit','obligorAdd','salaryItemDetail'],
            importRoutes: ['obligorImport','employeeImport','incomeImport']
        }
    },
    computed: {
        useAnimate() {
            return this.$store.state.app.useAnimate
        },
    },
}
</script>

<style lang="scss" scoped>
.main {
    background-color: #F0F2F5;
}
</style>