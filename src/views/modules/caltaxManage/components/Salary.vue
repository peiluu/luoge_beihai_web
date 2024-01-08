<!-- 正常工资薪金所得 -->
<template>
    <div>
        <div class="form-title">本期收入及免税收入</div>
        <!--<el-form-item label="适用公式" prop="sygs">
            <el-select disabled class="form-inline-input" v-model="form.sygs">
                <el-option key="exp1" label="不超过90天(非高管)" value="不超过90天(非高管)"></el-option>
                <el-option key="exp2" label="超过90天不满183天(非高管)" value="超过90天不满183天(非高管)"></el-option>
                <el-option key="exp3" label="超过90天不满183天(高管)" value="超过90天不满183天(高管)"></el-option>
                <el-option key="exp4" label="不超过90天(高管)" value="不超过90天(高管)"></el-option>
                <el-option key="exp5" label="满183天的年度连续满六年" value="满183天的年度连续满六年"></el-option>
                <el-option key="exp6" label="有住所居民" value="有住所居民"></el-option>
                <el-option key="exp7" label="税收协定居民不超过183天" value="税收协定居民不超过183天"></el-option>
                <el-option key="exp8" label="税收协定居民超过183天，但满183天的年度连续不满六年" value="税收协定居民超过183天，但满183天的年度连续不满六年"></el-option>
                <el-option key="exp9" label="满183天的年度连续不满六年" value="满183天的年度连续不满六年"></el-option>
            </el-select>
        </el-form-item>-->
        <el-form-item label="本期收入" prop="sre">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.sre" type="text" @blur="blurDecrypt(form, 'sre', 'sreReal')" @focus="focusEnDecrypt(form, 'sre', 'sreReal')"></el-input>
        </el-form-item>
        <el-form-item label=" 本期免税收入" prop="mssd">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.mssd" type="number" @blur="ceil(form, 'mssd',2)"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <div class="form-title">本期专项扣除</div>
        <el-form-item label="基本养老保险费" prop="jbylaobxf">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.jbylaobxf" type="number" @input="calBqzxfjkc" @blur="ceil(form, 'jbylaobxf',2, calBqzxfjkc)"></el-input>
        </el-form-item>
        <el-form-item label="基本医疗保险费" prop="jbylbxf">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.jbylbxf" type="number" @input="calBqzxfjkc" @blur="ceil(form, 'jbylbxf',2, calBqzxfjkc)"></el-input>
        </el-form-item>
        <el-form-item label=" 失业保险费" prop="sybxf">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.sybxf" type="number" @input="calBqzxfjkc" @blur="ceil(form, 'sybxf',2, calBqzxfjkc)"></el-input>
        </el-form-item>
        <el-form-item label=" 住房公积金" prop="zfgjj">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.zfgjj" type="number" @input="calBqzxfjkc" @blur="ceil(form, 'zfgjj',2, calBqzxfjkc)"></el-input>
        </el-form-item>
        <el-form-item label=" 小计" prop="bqzxfjkc" class="sum">
            <el-input class="form-inline-input" v-model="bqzxfjkc" disabled></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <div class="form-title">累计专项附加扣除</div>
        <el-form-item label="子女教育" prop="znjyzc">
            <el-input disabled class="form-inline-input" v-model="form.ljznjyzc" type="number" @input="calLjzxfjkc"></el-input>
        </el-form-item>
        <el-form-item label="住房贷款利息" prop="zfdklxzc">
            <el-input disabled class="form-inline-input" v-model="form.ljzfdklxzc" type="number" @input="calLjzxfjkc"></el-input>
        </el-form-item>
        <el-form-item label=" 住房租金" prop="zfzjzc">
            <el-input disabled class="form-inline-input" v-model="form.ljzfzjzc" type="number" @input="calLjzxfjkc"></el-input>
        </el-form-item>
        <el-form-item label=" 赡养老人" prop="sylrzc">
            <el-input disabled class="form-inline-input" v-model="form.ljsylrzc" type="number" @input="calLjzxfjkc"></el-input>
        </el-form-item>
        <el-form-item label=" 继续教育" prop="jxjyzc">
            <el-input disabled class="form-inline-input" v-model="form.ljjxjyzc" type="number" @input="calLjzxfjkc"></el-input>
        </el-form-item>
        <el-form-item label=" 3岁以下婴幼儿照护" prop="yyezhzc">
            <el-input disabled class="form-inline-input" v-model="form.ljyyezhzc" type="number" @input="calLjzxfjkc"></el-input>
        </el-form-item>
        <el-form-item label=" 小计" prop="ljzxfjkc" class="sum">
            <el-input class="form-inline-input" v-model="ljzxfjkc" disabled></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <div class="form-title">本期其他扣除</div>
        <el-form-item label="企业（职业）年金" prop="nj">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.nj" type="number" @input="calBqqtkc" @blur="ceil(form, 'nj', 2, calBqqtkc)"></el-input>
        </el-form-item>
        <!--<el-form-item label="商业健康保险" prop="syjkbx">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.syjkbx" type="number" @input="calBqqtkc" @blur="ceil(form, 'syjkbx', calBqqtkc)"></el-input>
        </el-form-item>
        <el-form-item label=" 税延养老保险" prop="syylbx">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.syylbx" type="number" @input="calBqqtkc" @blur="ceil(form, 'syylbx', calBqqtkc)"></el-input>
        </el-form-item>-->
        <el-form-item label=" 其他" prop="qt">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.qt" type="number" @input="calBqqtkc" @blur="ceil(form, 'qt',2, calBqqtkc)"></el-input>
        </el-form-item>
        <el-form-item label=" 小计" prop="bqqtkc" class="sum">
            <el-input class="form-inline-input" v-model="bqqtkc" disabled></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <div class="form-title">本期其他</div>
       <!-- <el-form-item label="准予扣除的捐赠额" prop="zykcjze">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.zykcjze" type="number" @blur="ceil(form, 'zykcjze')"></el-input>
        </el-form-item>-->
        <el-form-item label="减免税额" prop="jmse">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.jmse" type="number" @blur="ceil(form, 'jmse',2)"></el-input>
        </el-form-item>
        <el-form-item label="累计减除费用" prop="ljjcfye">
            <el-input class="form-inline-input" v-model="form.ljjcfye" disabled></el-input>
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
        name: "Salary",
        props: {
            form: Object,
            rules: Object,
            opt: String
        },
        data() {
            return {
                bqzxfjkc:"",
                ljzxfjkc:"",
                bqqtkc:"",
            }
        },
        watch: {
            form(){
                this.calXj();
            }
        },
        methods: {
            calBqzxfjkc(){
                this.bqzxfjkc = Calc.Add(Calc.Add(Calc.Add(this.form.jbylaobxf || 0,this.form.jbylbxf || 0), this.form.sybxf || 0), this.form.zfgjj || 0);
            },
            calLjzxfjkc(){
                this.ljzxfjkc = Calc.Add(Calc.Add(Calc.Add(Calc.Add(Calc.Add(this.form.ljznjyzc || 0, this.form.ljzfdklxzc || 0), this.form.ljzfzjzc || 0), this.form.ljsylrzc || 0), this.form.ljjxjyzc || 0), this.form.ljyyezhzc || 0);
            },
            calBqqtkc(){
                this.bqqtkc = Calc.Add(Calc.Add(Calc.Add(this.form.nj || 0, this.form.syjkbx || 0), this.form.syylbx || 0), this.form.qt || 0);
            },
            calXj(){
                this.calBqzxfjkc();
                this.calLjzxfjkc();
                this.calBqqtkc();
            }
        },
    };
</script>