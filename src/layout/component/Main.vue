<template>
    <div class="main">
        <transition :name="useAnimate?'fade-transform':''" mode="out-in">
            <router-view v-if="(editRoutes.contains($route.name)&&$route.query.opt=='add') || importRoutes.contains($route.name)"/>
            <keep-alive v-else>
                <router-view />
            </keep-alive>
        </transition>
    </div>
</template>

<script>

Array.prototype.contains = function (fn) {
    var arr = this, //数组本身
        len = arr.length, //数组长度
        arg = arguments[0] || window,
        item;
    for (var i = 0; i < len; i++) {
        item = JSON.parse(JSON.stringify(arr[i]))
        if(item==arg){
            return true;
        }
    }
    return false;
}
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