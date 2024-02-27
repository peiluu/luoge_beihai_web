<template>
  <el-container>
    <el-main class="ds_title">
      <div class="ds_title_item">
        <span class="_label">数据源类型</span>
        <el-select size="small" v-model="dsForm.dsType" @change="dsTypeChange">
          <el-option key="0" label="台账" :value="0"></el-option>
          <!--<el-option key="1" label="工作底稿" value="1"></el-option>-->
          <el-option key="2" label="申报表" :value="2"></el-option>
          <!--<el-option key="3" label="语义模型" value="3"></el-option>-->
        </el-select>
      </div>
      <div class="ds_title_item">
        <span class="_label">数据源</span>
        <el-select size="small" v-model="dsForm.dsId" @change="dsIdChange">
          <el-option v-for="ds in dsOptions" :key="ds.id" :label="ds.name" :value="ds.id"></el-option>
        </el-select>
      </div>
      <div class="ds_title_item">
        <el-button size="small" @click="addFilter">增行</el-button>
      </div>
    </el-main>
    <el-main v-if="dsForm.dsType==0">
      <div class="invoice-form-goods">
        <!-- 头部-->
        <div class="goods-hearder">
          <div style="width: 150px;">名称</div>
          <div style="width: 100px;">取值</div>
          <div style="width: 150px;"></div>
          <div></div>
        </div>
        <!-- 内容-->
        <div class="goods-content">
          <div class="row">
            <div style="width: 150px;">取数项</div>
            <div style="width: 100px;">等于</div>
            <div style="width: 150px;">sum</div>
            <div>
              <el-select size="small" v-model="dsForm.qsx">
                <el-option v-for="ds in collect_0" :key="ds.id" :label="ds.fieldName" :value="ds.id"></el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div style="width: 150px;">纳税主体</div>
            <div style="width: 100px;">等于</div>
            <div style="width: 150px;">
              <el-select size="small" v-model="dsForm.nszt">
                <el-option v-for="ds in collect_1" :key="ds.id" :label="ds.fieldName" :value="ds.id"></el-option>
              </el-select>
            </div>
            <div></div>
          </div>
          <div class="row" style="margin-bottom: 10px;">
            <div style="width: 150px;">期间</div>
            <div style="width: 100px;">等于</div>
            <div style="width: 150px;" >
              <el-select size="small" v-model="dsForm.qj">
                <el-option v-for="ds in collect_2" :key="ds.id" :label="ds.fieldName" :value="ds.id"></el-option>
              </el-select>
            </div>
            <div></div>
          </div>
          <div class="filter" v-for="(item, index) in dsForm.filters">
            <div style="width: 140px;">
              <el-select size="small" v-model="item.sxx" @change="changeFilterColumn(item)">
                <el-option v-for="ds in collect_3" :key="ds.id" :label="ds.fieldName" :value="ds.id"></el-option>
              </el-select>
            </div>
            <div style="width: 90px;margin-left: 10px;">
              <el-select size="small" v-model="item.opt">
                <el-option  key="eq" label="等于" value="="></el-option>
                <el-option  key="in" label="属于" value="in"></el-option>
                <el-option  key="bg" label="大于" value="gt"></el-option>
              </el-select>
            </div>
            <div style="width: 300px;margin-left: 10px;" >
              <el-select collapse-tags size="small" v-model="item.thresholdList" multiple>
                <el-option v-for="option in getThresholdOptions(collect_3, item.sxx)" :key="option.dm" :label="option.mc" :value="option.dm"></el-option>
              </el-select>
            </div>
            <div style="width: 60px;margin-left: 10px;" >
              <el-button size="small" type="primary" @click="removeFilter(item, index)">删除</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-main>
    <el-main v-else-if="dsForm.dsType==2" style="height: 580px;">
      <iframe ref="declareIframe" :src="'https://mtclq-dev.mideazy.com/#/declareSource?dsId='+dsForm.dsId" style="height: 100%" width="100%" frameborder="0"></iframe>
    </el-main>
    <el-footer style="height: 40px;">
      <el-button @click="handleCancleSub">取 消</el-button>
      <el-button type="success" @click="handleSubmitSub">确 定</el-button>
    </el-footer>
  </el-container>
</template>

<script>

  import {randomStr} from '@/utils/secret.js'
  export default {
    name: 'ExpSubModal',
    props: {
      innerVisible: {
        type: Boolean,
        default: false
      },
      editRow: {
        type: Object
      }
    },
    data() {
      return {
        api: require('./Api'),
        templateApi: require('../../templateMng/Api'),
        dsOptions: [],
        collect_0: [],        //取数项
        collect_1: [],        //纳税主体
        collect_2: [],        //期间
        collect_3: [],        //自定义筛选条件
        dsForm: {
          dsType: 0,
          dsId: '',
          qsx: '',
          nszt: '',
          qj: '',
          filters: [],
        },
        iframeSrc: ''
      }
    },
    methods: {
      initData(){
        this.getDsOptions(this.editRow.dsType);
      },
      getDsOptions(dsType){
        this.api.listDsByType(dsType).then(res => {
          this.dsOptions = res.data;
          this.getDsFiled(this.editRow.dsId || this.dsOptions[0].id);
        })
      },
      getDsFiled(dsId){
        this.api.listDsField(dsId).then(res => {
          this.collect_0 = res.data.collect_0
          this.collect_1 = res.data.collect_1
          this.collect_2 = res.data.collect_2
          this.collect_3 = res.data.collect_3
          if(this.editRow.dsId){
            this.dsForm = {...this.editRow}
          }else {
            this.dsForm = {...this.dsForm,id:'', dsId:dsId, qsx: '',nszt: '',qj: '',filters: []}
          }
        })
      },
      dsIdChange(e){
        this.getDsFiled(e);
      },
      dsTypeChange(e){
        this.getDsOptions(e)
      },
      handleCancleSub(){
        this.$emit("handleCancleSub");
      },
      handleSubmitSub(){
        if(this.dsForm.dsType==0){
          //台账
          if(this.validateDsFomr(this.dsForm)){
            this.dsForm.dsTypeView =  '台账';
            this.dsForm.dsIdView = this.dsOptions.filter(item => item.id == this.dsForm.dsId)[0].name
            this.dsForm.qsxView = this.collect_0.filter(item => item.id == this.dsForm.qsx)[0].fieldName
            this.dsForm.nsztView = this.collect_1.filter(item => item.id == this.dsForm.nszt)[0].fieldName
            this.dsForm.qjView = this.collect_2.filter(item => item.id == this.dsForm.qj)[0].fieldName
            this.dsForm.gsm = this.editRow.gsm || '#' + randomStr(8) + '#'
            this.$emit("handleSubmitSub", this.dsForm);
          }
        }else if(this.dsForm.dsType==2){
          //申报表
          const iframe = this.$refs.declareIframe;
          const currentCell = iframe.contentWindow.getCurrentCell();
          this.dsForm.dsTypeView = '申报表';
          this.dsForm.dsIdView = this.dsOptions.filter(item => item.id == this.dsForm.dsId)[0].name
          this.dsForm.declareCellDescrpiton = currentCell.description;
          this.dsForm.declareCell = 'o-'+currentCell.order+','+'r-'+currentCell.row[0]+'_'+currentCell.row[1]+','+'c-'+currentCell.column[0]+'_'+currentCell.column[1]
          this.dsForm.gsm = this.editRow.gsm || '#' + randomStr(8) + '#'
          this.dsForm.filters = [];
          this.$emit("handleSubmitSub", this.dsForm);
        }
      },
      validateDsFomr(_form){
        if(!_form.dsId){
          this.$message.warning('请选择数据源类型!')
          return false;
        }
        if(!_form.dsType && _form.dsType!=0){
          this.$message.warning('请选择数据源!')
          return false;
        }
        if(!_form.qsx){
          this.$message.warning('请选择取数项!')
          return false;
        }
        if(!_form.nszt){
          this.$message.warning('请选择纳税主体!')
          return false;
        }
        if(!_form.qj){
          this.$message.warning('请选择期间!')
          return false;
        }
        let flag = true;
        if(_form.filters && _form.filters.length > 0){
          _form.filters.map((item,index) =>{
            if(!item.sxx || !item.opt || !item.thresholdList){
              flag = false;
            }
          })
        }
        if(!flag){
          this.$message.warning('请选择增行数据!')
          return flag;
        }
        return true;
      },
      addFilter(){
        this.dsForm.filters.push({});
      },
      removeFilter(item, index){
        if(item.id){
          if(!this.dsForm.delIds){
            this.dsForm.delIds = []
          }
          this.dsForm.delIds.push(item.id)
        }
        this.dsForm.filters.splice(index, 1)
      },
      getThresholdOptions(collect, value){
        if(collect && collect.length>0 && value){
          let arr = collect.filter(item => item.id == value);
          if(arr.length > 0){
            return arr[0].options;
          }
        }
        return [];
      },
      changeFilterColumn(item){
        this.$set(item, 'thresholdList', [])
      },
    }
  };
</script>

<style lang="scss" scoped>
  .ds_title{
    padding: 20px;
    display: flex;
    justify-content: space-between;
    border-bottom: solid 1px #ccc;

    .ds_title_item{
      ._label{
        margin-right: 10px;
      }
    }
  }

  .invoice-form-goods{
    padding: 0 5px;
    border-bottom: 1px solid #ccc;
    .goods-hearder{
      display: flex;
      height: 30px;
      line-height: 30px;
      padding: 0 20px;
      background-color: #f4f4f4;
      border-bottom: 1px solid #ccc;
      div{
        display: inline-flex;
        flex-direction: column;
        text-align: left;
      }
    }
    .goods-content{
      height: 550px;
      overflow: auto;
      background-color: #f9f9f9;
      .row{
        display: flex;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        div{
          display: inline-flex;
          flex-direction: column;
          word-break: break-all;
          padding: 3px 0;
          text-align: left;
        }
      }
    }
    .goods-footer{
      display: flex;
      justify-content: space-between;
      overflow: auto;
      height: 20px;
      div{
        display: inline-flex;
        flex-direction: column;
      }
    }
  }
  .filter{
    display: flex;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    background-color: #ffffff;
    border-top: 1px solid #cccccc;
  }
  .el-footer{
    text-align: right;
    margin-top: 20px;
  }
</style>
