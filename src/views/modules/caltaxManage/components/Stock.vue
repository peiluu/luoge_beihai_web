<!-- 个人股权激励收入 -->
<template>
    <div>
        <div class="form-title">本期收入及免税收入</div>
        <el-form-item label="适用公式" prop="sygs">
            <el-select :disabled="opt=='detail' || form.zzlx =='居民身份证'" class="form-inline-input" v-model="form.sygs" clearable>
                <el-option key="exp1" label="公式(1)不超过90天(非高管)" value="公式(1)不超过90天(非高管)"></el-option>
                <el-option key="exp4" label="公式(4)不超过90天(高管)" value="公式(4)不超过90天(高管)"></el-option>
                <el-option key="exp2" label="公式(2)超过90天不满183天(非高管)" value="公式(2)超过90天不满183天(非高管)"></el-option>
                <el-option key="exp3" label="公式(3)超过90天不满183天(高管)" value="公式(3)超过90天不满183天(高管)"></el-option>
                <el-option key="exp7" label="公式(1)税收协定居民不超过183天" value="公式(1)税收协定居民不超过183天"></el-option>
                <el-option key="exp9" label="公式(3)满183天的年度连续不满六年" value="公式(3)满183天的年度连续不满六年"></el-option>
                <el-option key="exp8" label="公式(2)税收协定居民超过183天，但满183天的年度连续不满六年" value="公式(2)税收协定居民超过183天，但满183天的年度连续不满六年"></el-option>
                <el-option key="exp5" label="公式(5)满183天的年度连续满六年" value="公式(5)满183天的年度连续满六年"></el-option>
                <el-option key="exp6" label="公式(5)有住所居民" value="公式(5)有住所居民"></el-option>
            </el-select>
        </el-form-item>
        <br/>
        <el-form-item label="本期股权激励收入" prop="sre" class="input-detail">
            <el-input :disabled="opt=='detail' || canInputDetail" style="width: calc(98% - 70px);padding-right: 2%;" class="form-inline-input" v-model="form.sre" type="text" @blur="blurDecrypt(form, 'sre', 'sreReal')" @focus="focusEnDecrypt(form, 'sre', 'sreReal')"></el-input>
            <el-button :disabled="!canInputDetail" plain style="width:70px;padding:3px;" type="primary" @click="inputDetail">录入明细</el-button>
        </el-form-item>
        <el-form-item label=" 本年累计股权激励收入（不含本月）" prop="ljsre">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.ljsre" type="number" @blur="ceil(form, 'ljsre', 2)"></el-input>
        </el-form-item>
        <el-form-item label="本年累计免税收入" prop="mssd">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.mssd" type="number" @blur="ceil(form, 'mssd' ,2)"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <div class="form-title">扣除及减除</div>
        <el-form-item label="本年累计其他" prop="qt">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.qt" type="number" @blur="ceil(form, 'qt', 2)"></el-input>
        </el-form-item>
       <!-- <el-form-item label="本年累计准予扣除的捐赠额" prop="zykcjze">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.zykcjze" type="number" @blur="ceil(form, 'zykcjze')"></el-input>
        </el-form-item>-->
        <el-divider></el-divider>
        <div class="form-title">其他</div>
        <el-form-item label="本年累计减免税额" prop="jmse">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.jmse" type="number" @blur="ceil(form, 'jmse',2)"></el-input>
        </el-form-item>
        <el-form-item label="本年累计已缴税额" prop="ykjse">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.ykjse" type="number" @blur="ceil(form, 'ykjse',2)"></el-input>
        </el-form-item>
        <el-form-item label=" 备注" prop="bz" style="width:calc(100% - 55px);">
            <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.bz"></el-input>
        </el-form-item>
        <el-divider v-if="opt!='add'"></el-divider>
        <el-dialog
            class="input-detail-dialog"
            title="境内外所得明细填写"
            :visible.sync="dialogVisible"
            width="1000px">
        <div class="form-label-info">
            <div class="form-label-cell">
                <div class="form-label-cell-left">姓名:</div>
                <div class="form-label-cell-right">{{form.xm}}</div>
            </div>
            <div class="form-label-cell">
                <div class="form-label-cell-left">证件类型:</div>
                <div class="form-label-cell-right">{{form.zzlx}}</div>
            </div>
            <div class="form-label-cell">
                <div class="form-label-cell-left">证件号码:</div>
                <div class="form-label-cell-right">{{form.zzhm}}</div>
            </div>
            <div class="form-label-cell">
                <div class="form-label-cell-left">所得期间起:</div>
                <div class="form-label-cell-right">{{sdqjq}}</div>
            </div>
            <div class="form-label-cell">
                <div class="form-label-cell-left">所得期间止:</div>
                <div class="form-label-cell-right">{{sdqjz}}</div>
            </div>
        </div>
        <el-divider></el-divider>
        <el-form ref="dialogForm" :inline="true" :model="form" :rules="rules" label-width="250px" @close="closeDialog">
            <el-form-item label="收入所属工作期间公历天数：">
                <el-input disabled class="form-inline-input" v-model="form.glts" type="number"></el-input>
            </el-form-item>
            <div class="form-title">其中:</div>
            <el-form-item label="境内工作天数:">
                <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.jngzts" type="number" @blur="ceil(form, 'jngzts',1)" @input="calGzts"></el-input>
            </el-form-item>
            <el-form-item label="境外工作天数:">
                <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.jwgzts" type="number" @blur="ceil(form, 'jwgzts',1)" @input="calGzts"></el-input>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item label=" 收入总额:">
                <el-input class="form-inline-input" v-model="form.srze" disabled></el-input>
            </el-form-item>
            <div class="form-title">其中:</div>
            <el-form-item label=" 境内支付">
                <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.jnzf" @input="calSrzh" @blur="ceil(form, 'jnzf',2)"></el-input>
            </el-form-item>
            <el-form-item label=" 境外支付">
                <el-input :disabled="opt=='detail'" class="form-inline-input" v-model="form.jwzf" @input="calSrzh" @blur="ceil(form, 'jwzf',2)"></el-input>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item style="width:100%; text-align: right;">
                <el-button type="default" @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="handleSubmit" style="margin-right: 20px;">确认</el-button>
            </el-form-item>
        </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import {Calc} from '@/utils/calc'
    export default {
        name: "Stock",
        props: {
            form: Object,
            rules: Object,
            opt: String,
            sdqjq: String,
            sdqjz: String,
        },
        data() {
            return {
                canInputDetail: false,
                dialogVisible: false,
            }
        },
        methods: {
            inputDetail(){
                this.calGzts();
                this.calSrzh();
                this.dialogVisible = true;
            },
            calGzts(){
                this.$set(this.form, 'glts', Calc.Add(this.form.jngzts || 0, this.form.jwgzts || 0))
            },
            calSrzh(){
                this.$set(this.form, 'srze', Calc.Add(this.form.jnzf || 0, this.form.jwzf || 0))
            },
            closeDialog(){
                this.calGzts();
                this.calSrzh();
                this.dialogVisible = false;
            },
            calcGqjlsr(){
                if(this.form.sygs == '公式(1)不超过90天(非高管)' || this.form.sygs == '公式(1)税收协定居民不超过183天'){
                    this.form.sre = Calc.Div(Calc.Mul(this.form.jnzf || 0, this.form.jngzts || 0), (Calc.Add(this.form.jngzts || 0, this.form.jwgzts || 0)), 2);
                }else if(this.form.sygs == '公式(4)不超过90天(高管)' || this.form.sygs == '不超过90天(高管)'){
                    this.form.sre = this.form.jnzf;
                }else if(this.form.sygs == '公式(2)超过90天不满183天(非高管)' || this.form.sygs == '公式(2)税收协定居民超过183天，但满183天的年度连续不满六年') {
                    this.form.sre = Calc.Div(Calc.Mul(Calc.Add(this.form.jnzf || 0, this.form.jwzf || 0), this.form.jngzts || 0), (Calc.Add(this.form.jngzts || 0, this.form.jwgzts || 0)), 2);
                }else if(this.form.sygs == '公式(3)超过90天不满183天(高管)' || this.form.sygs == '公式(3)满183天的年度连续不满六年'){
                    this.form.sre = Calc.Add(this.form.jnzf || 0, Calc.Div(Calc.Mul(this.form.jwzf || 0, this.form.jngzts || 0), (Calc.Add(this.form.jngzts || 0, this.form.jwgzts || 0)), 2));
                }
            },
            handleSubmit(){
                this.calcGqjlsr();
                this.closeDialog();
            },
        },
        watch:{
            zzlx(val){
                if(val=='居民身份证'){
                    this.$set(this.form, 'sygs', '');
                    this.sygschange();
                }
            },
            sygs(val){
                if(!val || val=='公式(5)满183天的年度连续满六年' || val=='公式(5)有住所居民'){
                    this.canInputDetail = false;
                }else {
                    this.canInputDetail = true;
                }
            }
        },
        computed:{
            zzlx(){
                return this.form.zzlx
            },
            sygs(){
                return this.form.sygs
            }
        }
    };
</script>

<style scoped lang="scss">
    .form-label-info{
        padding:20px 20px 0 20px;
        display: flex;
        flex-wrap: wrap;
        .form-label-cell{
            width: 33.3%;
            display: flex;
            height: 30px;
            .form-label-cell-left{
                width:120px;
                text-align: right;
            }
            .form-label-cell-right{
                width:calc(100% - 150px);
                padding-left:5px;
                text-align: left;
            }
        }
    }
    .input-detail{
        .el-form-item__content{
            display: flex;
        }
    }
    ::v-deep .el-dialog__header{
        background-color: #F5F5F5;
        box-shadow: 0 1px 2px #e9e9e9;
    }
    ::v-deep .el-dialog__body{
        padding: 0;
        .el-form>.el-form-item{
            width: calc(50% - 20px);
            margin-bottom: 10px;
        }
        .el-form .el-form-item .el-form-item__content {
            width: calc(100% - 250px) !important;
        }
    }
</style>