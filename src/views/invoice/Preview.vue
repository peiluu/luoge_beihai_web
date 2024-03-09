<template>
  <div class="preview-body">
    <el-form ref="form" :inline="true" :model="form" size="mini">
      <div class="preview-title">发票预览</div>
      <div class="preview-content">
        <div class="invoice-head">
          <div>
            <div  class="head-left" :style="(form.tdys && form.cezslxDm ? 'line-height:30px':'')+ '; ' +(!form.tdys && !form.cezslxDm ? 'border:0' : '')">
              <div v-if="form.tdys=='03'">建筑服务</div>
              <div v-else-if="form.tdys=='05'">不动产销售</div>
              <div v-else-if="form.tdys=='06'">不动产经营租赁服务</div>

              <div v-if="form.cezslxDm=='01'">差额征税-全额开票</div>
              <div v-else-if="form.cezslxDm=='02'">差额征税-差额开票</div>
            </div>
          </div>
          <div class="head-center">
            电子发票（<template v-if="form.fppz=='01'">增值税专用发票</template><template v-else>普通发票</template>）
            <div class="bottom-line"></div>
            <div class="bottom-line2"></div>
          </div>
          <div class="head-right">发票号码：-</div>
        </div>

        <div class="invoice-form">
          <div class="invoice-form-content">
            <!--购买方 -->
            <div class="invoice-form-seller">
              <div class="seller-name">
                <div class="seller-name-text">购买方信息</div>
              </div>
              <div class="seller-form-items">
                <el-form-item label="名称:" class="whole">
                  <template>{{form.gmfmc}}</template>
                </el-form-item>
                <el-form-item label="统一社会信用代码/纳税人识别号:" class="whole">
                  <template>{{form.gmfnsrsbh}}</template>
                </el-form-item>
              </div>
            </div>
            <!--销售方-->
            <div class="invoice-form-seller">
              <div class="seller-name" style="border-left: 2px solid #a15f3b;">
                <div class="seller-name-text">销售方信息</div>
              </div>
              <div class="seller-form-items">
                <el-form-item label="名称:" class="whole">
                  <template>{{form.xsfmc}}</template>
                </el-form-item>
                <el-form-item label="统一社会信用代码/纳税人识别号:" class="whole">
                  <template>{{form.xsfnsrsbh}}</template>
                </el-form-item>
              </div>
            </div>
          </div>

          <div class="invoice-form-goods">
            <!-- 头部-->
            <div class="goods-hearder">
              <div style="width: 15%;text-align: center;">项目名称</div>
              <div v-if="form.tdys=='' || !form.tdys" style="width: 8%;text-align: center;">规格型号</div>
              <div v-if="form.tdys=='' || !form.tdys" style="width: 8%;text-align: center;">单位</div>

              <div v-if="form.tdys=='03'" style="width: 15%;text-align: center;">建筑服务发生地</div>
              <div v-if="form.tdys=='03'" style="width: 15%;text-align: center;">建筑项目名称</div>

              <div v-if="form.tdys=='05'||form.tdys=='06'" style="width: 22%;text-align: center;">房屋产权证书/不动产权证号</div>
              <div v-if="form.tdys=='05'||form.tdys=='06'" style="width: 8%;text-align: center;">面积单位</div>

              <div v-if="form.tdys=='05'||form.tdys=='06'||form.tdys=='' || !form.tdys" style="width: 8%;text-align: center;">数量</div>
              <div v-if="form.tdys=='05'||form.tdys=='06'||form.tdys=='' || !form.tdys" style="width: 8%;text-align: center;">单价</div>

              <div style="width: 12%;text-align: center;">金额</div>
              <div style="width: 8.5%;text-align: center;">税率/征收率</div>
              <div style="width: 12%;text-align: right;">税额</div>
            </div>
            <!-- 内容-->
            <div class="goods-content">
              <div class="row" v-for="(fpmx ,index) in getUrlParam('id')?form.detailList :form.fpmxList" :key="index">
                <div style="width: 15%;text-align: center;">{{fpmx.hwhyslwfwmc}}</div>

                <div v-if="form.tdys=='' || !form.tdys" style="width: 8%;text-align: center;">{{fpmx.ggxh}}</div>
                <div v-if="form.tdys==''|| !form.tdys" style="width: 8%;text-align: center;">{{fpmx.dw}}</div>

                <div v-if="form.tdys=='03'" style="width: 15%;text-align: center;">{{fpmx.fphxz!='01' ? (form.jzfwfsd[0]==form.jzfwfsd[1] ? '' : form.jzfwfsd[0]) + (form.jzfwfsd[1] || '') + (form.jzfwfsd[2]||'') + (form.xxdz||'')  : '' }}</div>
                <div v-if="form.tdys=='03'" style="width: 15%;text-align: center;">{{fpmx.fphxz!='01' ? form.jzxmmc: ''}}</div>

                <div v-if="form.tdys=='05'||form.tdys=='06'" style="width: 22%;text-align: center;">{{form.cqzsbh || fpmx.cqzsbh}}</div>
                <div v-if="form.tdys=='05'||form.tdys=='06'" style="width: 8%;text-align: center;">{{form.mjdw || fpmx.dw}}</div>

                <div v-if="form.tdys=='05'||form.tdys=='06'||form.tdys=='' || !form.tdys" style="width: 8%;text-align: center;">{{fpmx.sl}}</div>
                <div v-if="form.tdys=='05'||form.tdys=='06'||form.tdys=='' || !form.tdys" style="width: 8.5%;text-align: center;">{{fpmx.dj}}</div>

                <div style="width: 12%;text-align: center;">{{getFpmxJe(fpmx)}}</div>
                <div style="width: 8%;text-align: center;">
                  {{getTaxDesc(fpmx, index)}}
                </div>
                <div style="width: 12%;text-align: right;">
                  {{getTaxDesc(fpmx, index) == "不征税" ? "" : getTaxDesc(fpmx, index) == "免税" ? "***" : fpmx.se ? fpmx.se.toFixed(2) : fpmx.se}}
                </div>
              </div>
            </div>
            <!-- 合计-->
            <div class="goods-footer">
              <div style="width: 15%;text-align: center;color:#a15f3b;">合计</div>
              <div style="width: 22%;text-align: center;"></div>
              <div style="width: 8%;text-align: right;"></div>
              <div style="width: 8%;text-align: right;"></div>
              <div style="width: 8%;text-align: right;"></div>
              <div style="width: 12%;text-align: right;">￥{{jshj ? parseFloat(jshj).toFixed(2): jshj}}</div>
              <div style="width: 8%;text-align: center;"></div>
              <div style="width: 12%;text-align: right;">{{getHjjeDesc()}}</div>
            </div>
          </div>

          <div class="invoice-form-price">
            <div class="price-left">价税合计（大写）</div>
            <div class="price-right">
              <div><i style="font-size: 16px;" class="el-icon-circle-close"></i><span style="margin-left: 5px;color: #000;">{{form.jshjCny}}</span></div>
              <div>（小写）<span style="margin-left: 5px;color: #000;">￥{{form.hjse ? parseFloat(form.jshj).toFixed(2):form.jshj}}</span></div>
            </div>
          </div>

          <div class="invoice-form-remark">
            <div class="remark-name">
              <div class="remark-name-text">备注</div>
            </div>
            <div class="remark-content">
              <template v-if="form.remarkMap">
                <div v-if="form.remarkMap.kce" style="margin-bottom: 10px;">
                  <div class="remark-content-key">扣除额：</div>
                  <div class="remark-content-value">{{form.remarkMap.kce}}</div>
                </div>
              </template>
              <div>
                <template v-if="form.remarkMap">
                  <div v-for="(value, key) in form.remarkMap.remarkMap" :key="key" v-if="key!='customBz'" style="width: 33.3%;display: flex">
                    <div class="remark-content-key">{{key}}</div>
                    <div class="remark-content-value">{{value}}</div>
                  </div>
                </template>
              </div>
              <template v-if="form.remarkMap">
                <div style="white-space: normal;word-break: break-word;margin-top: 10px;" v-if="form.remarkMap.customBz">{{form.remarkMap.customBz}}</div>
              </template>
            </div>
          </div>
        </div>
        <div class="footer"><span class="title">开票人：</span><span>{{form.kpr}}</span></div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { numToCny } from '@/utils/tool'
  import { Calc } from '@/utils/calc'
  import {getBatchData} from '../outputInvoice/batchBlueInvoice/api'
  export default {
    name: "Preview",
    components: {

    },
    data() {
      return {
        api: require('../outputInvoice/blueInvoice/Api'),
        jshj: '',
        form:{},
      }
    },
    mounted() {
      if(this.$route.query.id && (this.$route.query.id??'')!==''){
        this.handleBatchDes(this.$route.query.id);
      }else{
        this.getInvoiceData();
      }
      
    },
    methods: {
      getInvoiceData(){
        let url = this.getUrlParam("url");
        let fpqqlsh = this.getUrlParam("fpqqlsh");
        this.api.getInvoicePreview({"url": decodeURIComponent(url), "fpqqlsh":fpqqlsh}).then(res =>{
          if(res.data){
            this.form = res.data;
            this.jshj = Calc.Sub(res.data.jshj, res.data.hjse)
            this.form.jshjCny = numToCny(this.form.jshj + "");
          } else {
            this.$message.error('数据获取错误！')
          }
        });
      },
      /* 获取批量开具发票详情 */
      handleBatchDes(data){
        let params = {
          id:data || '',
        }
        getBatchData(params).then(res=>{
          console.log(res)
          if([0,'0'].includes(res.code)){
            this.form = res.data;
            this.jshj = Calc.Sub(res.data.jshj, res.data.hjse)
            this.form.jshjCny = numToCny(this.form.jshj + "");
          }else{
            this.$message.error('数据获取错误！')
          }
        })
      },
      getFpmxJe(fpmx){
        if(this.form.sfhs=='Y'){
          return Calc.Sub(fpmx.je || 0, fpmx.se || 0) || ''
        }else {
          return fpmx.je ? fpmx.je.toFixed(2) : fpmx.je
        }
      },
      getTaxDesc(row, rowIndex) {
        if(row.fphxz =='01'){
          const lastRow = this.form.fpmxList[rowIndex - 1];
          return this.getTaxDesc(lastRow)
        }else if(this.form.cezslxDm=='02'){
          return '***';
        }else if(row.zzstsgl == "不征税" || row.zzstsgl == "免税"){
          return row.zzstsgl;
        }else {
          return parseFloat(row.slv) * 100 + '%';
        }
      },
      getHjjeDesc(){
        if(this.form && this.form.fpmxList){
          if(this.form.fpmxList[0].zzstsgl=="不征税"){
            return '';
          }
        }
        return this.form.hjse ? '￥'+parseFloat(this.form.hjse).toFixed(2):'￥'+ this.form.hjse;
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../styles/variables";
  .preview-body{
    width: 1000px;
    height: 800px;
    margin: auto;
    margin-top: 3%;
    top: 50px;
    background: #fff;
    border: 1px solid #fafafa;
    border-left: none;
    border-radius: 5px;
    box-shadow: 0 0 20px 0 rgba(0,0,0,.2);
    padding: 0 8px 6px;
    transition-delay: 0;
    transition-duration: .4s;
    transition-property: width;
    transition-timing-function: cubic-bezier(.08,.82,.17,1);
    z-index: 1001;

    .preview-title{
      font-size: 14px;
      font-weight: 700;
      padding: 10px;
    }

    .preview-content{
      padding: 10px 30px;

      .footer{
        padding: 10px 20px;
        .title{
          color: $ticket-color;
        }
      }

      .invoice-head{
        display: flex;
        justify-content: space-between;
        height: 60px;
        .head-left{
          border: 2px dashed $ticket-color;
          margin: auto;
          text-align: center;
          width: 150px;
          font-size: 14px;
          font-weight: 700;
          color: $ticket-color;
          line-height: 60px;
        }
        .head-center{
          display: inline-block;
          padding: 2px 0;
          color: $ticket-color;
          text-align: center;
          font-size: 24px;
          height: 40px;
          line-height: 40px;
          .bottom-line{
            width: 100%;height: 2px;background-color: $ticket-color;margin-top: 3px;
          }
          .bottom-line2{
            width: 100%;height: 2px;background-color: $ticket-color;margin-top: 4px;
          }
        }

        .head-right{
          width: 150px;
          font-size: 12px;
          color: $ticket-color;
        }
      }

      .invoice-form {
        width: 100%;
        margin-top: 10px;
        border: 2px solid $ticket-color;

        .invoice-form-content {
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid $ticket-color;

          .invoice-form-seller {
            display: flex;
            width: 50%;
            .seller-name {
              display: grid;
              width: 20px;
              text-align: center;
              border-right: 2px solid $ticket-color;
              .seller-name-text{
                color: $ticket-color;
                font-size: 12px;
                margin: auto;
              }
            }

            .seller-form-items {
              width: 100%;
              padding: 12px 12px 0 12px;

              .whole {
                width: 100%;
                margin-bottom: 0;
               ::v-deep .el-form-item__label {
                  color: $ticket-color;
                  font-size: 12px;
                }
                ::v-deep .el-form-item__content {
                  font-size: 12px;
                }
              }

              .half {
                width: calc(50% - 10px);
                margin-bottom: 5px;
                ::v-deep .el-form-item__label {
                  font-size: 12px;
                  color: $ticket-color;
                }
                ::v-deep .el-form-item__content {
                  font-size: 12px;
                }
              }
            }
          }
        }
        .invoice-form-goods{
          padding: 0 5px;
          height: 200px;
          border-bottom: 2px solid $ticket-color;

          .goods-hearder{
            display: flex;
            justify-content: space-between;
            overflow: auto;
            height: 20px;
            div{
              display: inline-flex;
              flex-direction: column;
              color: $ticket-color;
            }
          }
          .goods-content{
            height: 160px;
            overflow: auto;
            .row{
              display: flex;
              justify-content: space-between;
              div{
                display: inline-flex;
                flex-direction: column;
                word-break: break-all;
                padding: 3px 0;
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
        .invoice-form-price{
          display: flex;
          font-size: 12px;
          color: $ticket-color;
          border-bottom: 2px solid $ticket-color;
          .price-left{
            width: 15%;
            padding: 5px 0;
            text-align: center;
            border-right: 2px solid $ticket-color;
          }
          .price-right{
            width: 85%;
            display: flex;
            justify-content: space-between;
            padding: 5px 20px;
            text-align: center;
          }
        }
        .invoice-form-remark {
          display: flex;
          .remark-name {
            height: 120px;
            display: grid;
            width: 20px;
            text-align: center;
            border-right: 2px solid $ticket-color;
            .remark-name-text{
              color: $ticket-color;
              font-size: 12px;
              margin: auto;
            }
          }
          .remark-content{
            width: 100%;
            padding: 10px ;
            font-size: 12px;
            div{
              display: flex;
              flex-wrap: wrap;
              .remark-content-key{
                color: $ticket-color;
              }
              .remark-content-value{
                margin-right: 20px;
              }
            }
          }
        }
      }
    }
  }
</style>
