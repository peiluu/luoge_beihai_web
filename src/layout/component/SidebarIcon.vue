<template>
    <div class="my-icon">
        <template v-if="isHttp">
            <img :src="url" alt="" srcset="">
        </template>
        <template v-else>
            <i :class="url" />
        </template>
    </div>
</template>

<script>
export default {
    props: {
        url: {
            type: String,
            default: 'el-icon-s-promotion'
        }
    },
    computed: {
        isHttp() {
            if (this.url && this.url.indexOf('http') >= 0) {
                return true;
            }
            return false;
        },
    }
}
</script>

<style lang="scss">
.my-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-right: 8px;
    min-width: 20px;
    min-height: 20px;
    &>img {
        width: 100%;
    }
}
</style>