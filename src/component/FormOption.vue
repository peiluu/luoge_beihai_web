<template>
    <div class="option">
        <div class="header">
            <div class="title" :style="{ fontSize: titleSize + 'px' }">
                <span>|</span>
                <span>{{ title }}</span>
            </div>
            <slot name="optionRight">
                <div v-if="rightButton">
                    <el-button size="mini" round icon="el-icon-arrow-left" @click="back">{{ rightButton.title ? rightButton.title : '返回'}}</el-button>
                </div>
            </slot>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'FormOption',
    props: {
        title: {
            type: String,
            require: true
        },
        titleSize: {
            type: Number,
            default: 15
        },
        rightButton: {
            type: Object,
            default: null
        }
    },
    methods: {
        back() {
            this.$router.back()
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.option {
    padding: 16px 16px 0;
    background-color: #FFFFFF;
    border-radius: 10px;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .title {
        color: #000000;
        margin-bottom: 15px;
        &>span:first-child {
            color: $blueColor;
            font-weight: bolder;
            margin-right: 8px;
        }
    }
}
</style>