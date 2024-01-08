<!-- 劳务报酬(一般劳务、其他非连续劳务)-->
<template>
    <div>
        <div class="form-title">本期收入及免税收入</div>
        <el-form-item label="收入" prop="sre">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.sre" @input="calJcfy" @blur="blurDecrypt(form, 'sre', 'sreReal',calJcfy)" @focus="focusEnDecrypt(form, 'sre', 'sreReal',calJcfy)"></el-input>
        </el-form-item>
        <el-form-item label=" 费用" prop="jcfy">
            <el-input class="form-inline-input" v-model="form.jcfy" disabled></el-input>
        </el-form-item>
        <el-form-item label=" 免税收入" prop="mssd">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.mssd" @blur="ceil(form, 'mssd',2)"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <div class="form-title">本期其他扣除</div>
        <!--<el-form-item label="商业健康保险" prop="syjkbx">
            <el-input class="form-inline-input" v-model="form.syjkbx" @input="calBqqtkc" @blur="ceil(form, 'syjkbx', calBqqtkc)"></el-input>
        </el-form-item>
        <el-form-item label="税延养老保险" prop="syylbx">
            <el-input class="form-inline-input" v-model="form.syylbx" @input="calBqqtkc" disabled></el-input>
        </el-form-item>-->
        <el-form-item label="其他" prop="qt">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.qt" @input="calBqqtkc" @blur="ceil(form, 'qt',2, calBqqtkc)"></el-input>
        </el-form-item>
        <el-form-item label="允许扣除的税费" prop="yxkcsf">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.yxkcsf" @input="calBqqtkc" @blur="ceil(form, 'yxkcsf',2, calBqqtkc)"></el-input>
        </el-form-item>
        <el-form-item label="小计" prop="bqqtkc" class="sum">
            <el-input class="form-inline-input" v-model="bqqtkc" disabled></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <div class="form-title">本期其他</div>
        <el-form-item label="减免税额" prop="jmse">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.jmse" @blur="ceil(form, 'jmse',2)"></el-input>
        </el-form-item>
        <el-form-item label=" 已缴税额" prop="ykjse">
            <el-input class="form-inline-input" v-model="form.ykjse" disabled></el-input>
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
        name: "Labour",
        props: {
            form: Object,
            rules: Object,
            type: String,
            opt: String
        },
        data() {
            return {
                bqqtkc: ""
            }
        },
        watch: {
            form(){
                this.calBqqtkc();
                this.calJcfy();
            }
        },
        methods: {
            calBqqtkc(){
                this.bqqtkc = Calc.Add(Calc.Add(Calc.Add(this.form.syjkbx || 0, this.form.syylbx || 0), this.form.qt || 0), this.form.yxkcsf || 0);
            },
            calJcfy(){
                if(this.type == 5){
                    this.form.jcfy = (parseFloat(this.form.sre) <= 4000 ? 800 : Calc.Mul(parseFloat(this.form.sre), 0.2) || 0).toFixed(2);
                }else {
                    this.form.jcfy = (Calc.Mul(parseFloat(this.form.sre), 0.2) || 0).toFixed(2);
                }
            }
        },
    };
</script>