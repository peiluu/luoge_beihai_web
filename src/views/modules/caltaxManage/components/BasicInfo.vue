<template>
    <div>
        <div class="form-title">基本信息</div>
        <el-form-item label="姓名" prop="xm">
            <el-select :disabled="opt=='detail'" @change="chooseXm" filterable class="form-inline-input" v-model="form.xm">
                <el-option v-for="item in options" :key="item.id" :label="item.xm" :value="item.xm"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label=" 证件号码" prop="zzhm">
            <el-select :disabled="opt=='detail'" @change="chooseZzhm" filterable class="form-inline-input" v-model="form.zzhm">
                <el-option v-for="item in options" :key="item.id" :label="item.zzhm" :value="item.zzhm"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="证件类型" prop="zzlx">
            <el-input disabled class="form-inline-input" v-model="form.zzlx"></el-input>
        </el-form-item>
        <el-form-item label="所得期间起" prop="sdqjq">
            <el-date-picker disabled v-model="sdqjq" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="所得期间止" prop="sdqjz">
            <el-date-picker disabled v-model="sdqjz" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item v-if="type==5" label="所得项目" prop="sdxm">
            <el-select :disabled="opt=='detail'" class="form-inline-input" v-model="form.sdxm" clearable>
                <el-option key="yblw" label="一般劳务报酬所得" value="一般劳务报酬所得"></el-option>
                <el-option key="qtflxlw" label="其他非连续劳务报酬" value="其他非连续劳务报酬"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-if="type==6" label="所得项目" prop="sdxm">
            <el-select :disabled="opt=='detail'" class="form-inline-input" v-model="form.sdxm" clearable>
               <!-- <el-option key="bxyxy" label="保险营销员佣金收入" value="保险营销员佣金收入"></el-option>
                <el-option key="zqjjr" label="证券经纪人佣金收入" value="证券经纪人佣金收入"></el-option>-->
                <el-option key="qtlxlw" label="其他连续劳务报酬" value="其他连续劳务报酬"></el-option>
            </el-select>
        </el-form-item>
        <el-divider></el-divider>
    </div>
</template>
<script>
    export default {
        name: "BasicInfo",
        props: {
            form: Object,
            rules: Object,
            kjywrid: String,
            opt: String,
            type: String,
            sdqjq: String,
            sdqjz: String,
        },
        data() {
            return {
                business: require('@/utils/business'),
                options: [],
            }
        },
        methods: {
            selectEmployeeOptions(id, type, taxPeriod){
                let that = this;
                that.business.customPost(that.request_host+"/Employees/selectEmployeeOptions/"+id+"/"+type+"/"+taxPeriod,
                    {'Content-Type': 'application/text'},
                    {},
                    res => {
                        that.options = res.data;
                    }
                );
            },
            chooseXm(value){
                let item = this.options.find((item)=>item.xm == value);
                this.form.xm = item.xm
                this.form.zzhm = item.zzhm;
                this.form.zzlx = item.zzlx;
                this.form.ryid = item.id;
            },
            chooseZzhm(value){
                let item = this.options.find((item)=>item.zzhm == value);
                this.form.xm = item.xm
                this.form.zzhm = item.zzhm;
                this.form.zzlx = item.zzlx;
                this.form.ryid = item.id;
            }
        },
        activated() {
            if(this.kjywrid){
                this.selectEmployeeOptions(this.kjywrid, this.type, this.$store.state.user.taxPeriod);
            }
        },
        mounted() {
            if(this.kjywrid){
                this.selectEmployeeOptions(this.kjywrid, this.type, this.$store.state.user.taxPeriod);
            }
        },
        computed: {
            request_host() {
                return this.$store.state.app.host
            },
        }
    };
</script>