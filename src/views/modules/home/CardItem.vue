<template>
    <a class="card-item" @click="transferTo(route)" href="javascript:void(0)" style="text-decoration:none;">
        <div class="card-content">
            <div class="card-content-left">
                <div class="p-title">{{title}}</div>
                <a class="p-value">{{total}}</a>
            </div>
            <div class="card-content-right">
                <img :src="icon">
            </div>
        </div>
    </a>
</template>
<script>
    export default {
        name: "CardItem",
        props: {
            label: String,
            options: Array,
            optionValue: Number,
            title: String,
            total: Number,
            route: Object,
            icon: String
        },
        data() {
            return {

            }
        },
        methods: {
            transferTo(route){
                this.$emit("setPeriod");
                this.$router.push(route)
            }
        },
    };
</script>
