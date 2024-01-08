<!-- 解除劳动合同一次性补偿金 -->
<template>
    <div>
        <div class="form-title">本期收入及免税收入</div>
        <el-form-item label="一次性补偿收入" prop="sre">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.sre" type="text" @blur="blurDecrypt(form, 'sre', 'sreReal')" @focus="focusEnDecrypt(form, 'sre', 'sreReal')"></el-input>
        </el-form-item>
        <el-form-item label=" 免税收入" prop="mssd">
            <el-input disabled class="form-inline-input" v-model="form.mssd" type="number"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <div class="form-title">本期其他扣除</div>
        <el-form-item label="其他" prop="qt">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.qt" @input="calBqqtkc" type="number" @blur="ceil(form, 'qt',2, calBqqtkc)"></el-input>
        </el-form-item>
        <el-form-item label=" 小计" prop="bqqtkc" class="sum">
            <el-input class="form-inline-input" v-model="bqqtkc" disabled></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <div class="form-title">本期其他</div>
        <!--<el-form-item label="准予扣除的捐赠额" prop="zykcjze">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.zykcjze" type="number"></el-input>
        </el-form-item>-->
        <el-form-item label="减免税额" prop="jmse">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.jmse" type="number" @blur="ceil(form, 'jmse',2)"></el-input>
        </el-form-item>
        <el-form-item label=" 已缴税额" prop="ykjse">
            <el-input class="form-inline-input" v-model="form.ykjse" disabled @blur="ceil(form, 'ykjse',2)"></el-input>
        </el-form-item>
        <el-form-item label=" 备注" prop="bz" style="width:calc(100% - 55px);">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.bz"></el-input>
        </el-form-item>
        <el-divider v-if="opt!='add'"></el-divider>
    </div>
</template>
<script>
    import {Calc} from '@/utils/calc'
    export default {
        name: "Compensation",
        props: {
            form: Object,
            rules: Object,
            opt: String,
        },
        data() {
            return {
                bqqtkc: "",
            }
        },
        watch: {
            form(){
                this.calBqqtkc();
            }
        },
        methods: {
            calBqqtkc(){
                this.bqqtkc = this.form.qt || 0;
            },
        },
    };
</script>