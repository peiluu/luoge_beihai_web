<template>
    <form-option title="实例清单">
        <el-form v-if="form && searchList" class="search_area" ref="searchForm" :model="form" :inline="true">
            <template v-for="each in searchList">
                <el-form-item :key="each.key" v-show="each.show" :label="each.label" :prop="each.key">
                    <template v-if="each.type == 'input'">
                        <el-input v-model="form[each.key]" size="small" placeholder="请输入"></el-input>
                    </template>
                    <template v-if="each.type == 'inputNumber'">
                        <el-input-number v-model="form[each.key]" size="small"></el-input-number>
                    </template>
                    <template v-if="each.type == 'select'">
                        <el-select v-model="form[each.key]" placeholder="请选择">
                            <el-option
                                v-for="item in each.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-form-item>
            </template>
            <el-form-item>
                <el-button type="primary" size="small" @click="handleSubmit">查询</el-button>
                <el-button @click="resetForm" size="small">重置</el-button>
                <el-button v-show="showMore" :class="moreStatus=='down'?'more':'more-down'" size="small" icon="el-icon-d-arrow-right" circle @click="handleMore"></el-button>
            </el-form-item>
        </el-form>
    </form-option>
</template>

<script>
import FormOption from './FormOption.vue';

export default {
    components: { FormOption },
    name: "FormSearch",
    props: {
        searchList: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            labelCol: 8,
            wrapperCol: 16,
            form: null,
            showMore: false, //是否显示更多
            moreStatus: "down", //up /down
        };
    },
    mounted() {
        this.handleBuildForm();
        if (this.searchList.length > 3) {
            this.showMore = true;
        }
    },
    methods: {
        handleSubmit() {
            this.$emit("search", this.form);
        },
        resetForm() {
            this.$refs.searchForm.resetFields();
            this.$emit("reset");
        },
        handleBuildForm() {
            let form = {};
            this.searchList.forEach((each, index) => {
                each.show = index < 3;
                form[each.key] = each.val;
            });
            this.form = form;
        },
        handleMore() {
            let moreStatus = this.moreStatus;
            let searchList = this.searchList;
            if (moreStatus == "up") {
                moreStatus = "down";
                this.searchList.map((item, index) => {
                    item.show = index < 3;
                });
            } else {
                moreStatus = "up";
                this.searchList.map(item => {
                    item.show = true;
                });
            }
            this.moreStatus = moreStatus;
        },
    },
};
</script>
<style scoped>
.search_area {
  margin-bottom: 5px !important;
}

.more {
    transform: rotate(90deg);
}
.more-down {
    transform: rotate(-90deg);
    transition-duration: 300ms;
}
</style>