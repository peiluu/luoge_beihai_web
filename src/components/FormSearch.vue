<template>
    <form-option>
        <div v-if="backpath" class="back-button" style="right: 30px;padding-top: 5px;">
            <el-button type="primary" icon="el-icon-back" size="small" @click="handleBack">返回</el-button>
        </div>
        <el-form @submit.native.prevent v-if="form && searchList" class="search_area" ref="searchForm" :model="form" :inline="true" style="padding-right: 80px;">
            <template v-for="each in searchList">
                <el-form-item :key="each.key" v-show="each.show" :label="each.label" :prop="each.key">
                    <template v-if="each.type == 'input'">
                        <el-input @keyup.enter="handleSubmit" v-model="form[each.key]" size="small" :placeholder="each.placeholder" style="width:170px;"></el-input>
                    </template>
                    <template v-if="each.type == 'inputNumber'">
                        <el-input-number v-model="form[each.key]" size="small" :placeholder="each.placeholder" style="width:170px;"></el-input-number>
                    </template>
                    <template v-if="each.type == 'select'">
                        <el-select v-model="form[each.key]" :placeholder="each.placeholder" size="small" style="width:130px;">
                            <el-option
                                v-for="item in each.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                    <template v-if="each.type == 'autocomplete'">
                        <el-autocomplete
                                style="width:170px;"
                                size="small"
                                class="inline-input"
                                v-model="form[each.key]"
                                :fetch-suggestions="each.fetchSuggestions"
                                :placeholder="each.placeholder"
                                @change="handleSubmit"
                                @select="handleSubmit">
                        </el-autocomplete>
                    </template>
                    <template v-if="each.type == 'monthrange'">
                        <el-date-picker
                                size="small"
                                v-model="form[each.key]"
                                :type="each.type"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM"
                                :picker-options="each.pickerOptions">
                        </el-date-picker>
                    </template>
                </el-form-item>
            </template>
            <el-form-item>
                <el-button type="primary" size="small" @click="handleSubmit">查询</el-button>
                <el-button @click="resetForm" size="small">重置</el-button>
                <!--<el-button v-show="showMore" :class="moreStatus=='down'?'more':'more-down'" size="small" icon="el-icon-d-arrow-right" circle @click="handleMore"></el-button>-->
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
        resetSearch: {
            Number,
            default: null,
        },
        searchList: {
            type: Array,
            default: () => [],
        },
        autocompleteList: {
            type: Array,
            default: () => [],
        },
        param: {
            type: Object,
            default: () => {},
        },
        backpath: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            labelCol: 8,
            wrapperCol: 16,
            form: null,
            showMore: true, //是否显示更多
            moreStatus: "down", //up /down
        };
    },
    activated() {
        this.handleBuildForm();
        if (this.searchList.length > 3) {
            this.showMore = true;
        }
        this.$nextTick(() => {
            Object.keys(this.param).map(key => {
                if(this.param[key]!=null){
                    if (this.param[key].length > 0) {
                        this.form[key] = this.param[key];
                    }
                }
            });
        });
    },
    watch: {
        resetSearch(val){
            if(val==1){
                this.resetForm();
            }
        }
    },
    methods: {
        handleSubmit() {
            this.$set(this.form, "pageNo", 1);
            this.$emit("search", JSON.parse(JSON.stringify(this.form)));
        },
        resetForm() {
            this.$refs.searchForm.resetFields();
            this.$emit("search", JSON.parse(JSON.stringify(this.form)));
        },
        handleBuildForm() {
            let form = {};
            this.searchList.forEach((each, index) => {
                each.show = true;
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
                    item.show = true;
                });
            } else {
                moreStatus = "up";
                this.searchList.map(item => {
                    item.show = true;
                });
            }
            this.moreStatus = moreStatus;
        },
        handleBack(){
            this.$router.push({path: this.backpath});
        }
    },
};
</script>
<style scoped lang="scss">
.more {
    transform: rotate(90deg);
}
.more-down {
    transform: rotate(-90deg);
    transition-duration: 300ms;
}
.el-form--inline .el-form-item{
    margin-bottom: 16px;
}
</style>