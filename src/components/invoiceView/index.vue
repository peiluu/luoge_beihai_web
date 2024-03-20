<template>
     <div class="invoice-container">
    <div class="invoice_header flex">
      <div>
        <span class="font_famaily font_color font_size">发票代码：</span><span class="font_famaily_1"></span>
      </div>
      <div >
        <div>
            <span class="font_famaily font_color font_size">发票号码：</span><span class="font_famaily_1">23512000000023489461</span>
        </div>
        <div style="margin-top:2px">
            <span class="font_famaily font_color font_size">开票日期：</span><span class="font_famaily_1">2023年05月10日</span>
        </div>
      </div>
    </div>
    <div class="invoice_body border_c" style="margin-top: 12px;">
      <div class="invoice-section">
        <div class="flex body_header">
            <div class="vertical_text center width_common height_common line_height border_r border_b font_famaily font_color font_size">购买方信息</div>
            <div class="height_common name_common flex border_b padding_l padding_r">
                <div>
                    <span class="font_famaily font_color font_size">名称：</span><span class="font_famaily_1">广州南沙区美多莉房地立开发有限公司</span>
                </div>
                <div>
                    <span class="font_famaily font_color font_size">统一社会信用代码/纳税人识别号：</span><span class="font_famaily_1">91449191MACWU2F96</span>
                </div>
            </div>
            <div class="vertical_text center width_common line_height border_r border_b border_l font_color font_size">销售方信息</div>
            <div class="height_common name_common flex border_b padding_l padding_r">
                <div>
                    <span class="font_famaily font_color font_size">名称：</span><span class="font_famaily_1">华润(上海)有限公司广州顺丰速运有限公司</span>
                </div>
                <div>
                    <span class="font_famaily font_color font_size">统一社会信用代码/纳税人识别号：</span><span class="font_famaily_1">914401017248329968</span>
                </div>
            </div>
        </div>
      </div>
      <div class="invoice_details border_t">
       <article style="padding: 8px;height: 170px;overflow: auto;">
            <table>
            <thead>
                <tr>
                <th width="240px">货物或应税劳务、服务名称</th>
                <th>规格型号</th>
                <th>单位</th>
                <th>数量</th>
                <th>单价</th>
                <th>金额</th>
                <th>税率</th>
                <th>税额</th>
                </tr>
            </thead>
            <tbody class="tbody">
                <tr  v-for="(item, index) in items" :key="index" style="height:24px" class="font_famaily_1">
                <td>{{ item.description }}</td>
                <td>{{ item.ggxh }}</td>
                <td>{{ item.dw }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.dj }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.sl | currency }}</td>
                <td>{{ item.je }}</td>
                </tr>
            </tbody>
            </table>
        </article>
        <article class="flex justify_content border_t">
            <div class="border_r total center">
                <span class="font_famaily font_color font_size">价税合计（大写）</span>
            </div>
            <div class="flex right_account padding_l padding_r" >
                <div>
                        <span class="font_famaily_1">ⓧ 贰佰元整</span>
                    </div>
                    <div>
                        <span class="font_famaily font_color font_size">(小写)</span><span class="font_famaily_1">￥ <span>200.00</span></span>
                    </div>
            </div>
        </article>
        <article class="border_t ">
            <div class="border_r vertical_text des_bottom">
                <span class="font_famaily font_color font_size">备注</span>
            </div>
            <div></div>
        </article>
      </div>
     
      
    </div>
    <div class="make_name">
        <span class="font_famaily font_color font_size">开票人：</span><span class="font_famaily_1">张清水</span>
    </div>
  </div>
</template>

<script>

export default {
    name:'InvoiceViewPage',
    components: {},
    props: {
        invoice: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            items:[
                {
                description:'*物流辅助服务*收派服务费',
                ggxh:undefined,
                dw:undefined,
                quantity:undefined,
                dj:undefined,
                price:190.47,
                sl:'6%',
                je:9.53
            },
            {
                description:'*物流辅助服务*收派服务费',
                ggxh:undefined,
                dw:undefined,
                quantity:undefined,
                dj:undefined,
                price:190.47,
                sl:'6%',
                je:9.53
            },
            {
                description:'*物流辅助服务*收派服务费',
                ggxh:undefined,
                dw:undefined,
                quantity:undefined,
                dj:undefined,
                price:190.47,
                sl:'6%',
                je:9.53
            },
            {
                description:'*物流辅助服务*收派服务费',
                ggxh:undefined,
                dw:undefined,
                quantity:undefined,
                dj:undefined,
                price:190.47,
                sl:'6%',
                je:9.53
            },{
                description:'*物流辅助服务*收派服务费',
                ggxh:undefined,
                dw:undefined,
                quantity:undefined,
                dj:undefined,
                price:190.47,
                sl:'6%',
                je:9.53
            },{
                description:'*物流辅助服务*收派服务费',
                ggxh:undefined,
                dw:undefined,
                quantity:undefined,
                dj:undefined,
                price:190.47,
                sl:'6%',
                je:9.53
            },{
                description:'*物流辅助服务*收派服务费',
                ggxh:undefined,
                dw:undefined,
                quantity:undefined,
                dj:undefined,
                price:190.47,
                sl:'6%',
                je:9.53
            },{
                description:'*物流辅助服务*收派服务费',
                ggxh:undefined,
                dw:undefined,
                quantity:undefined,
                dj:undefined,
                price:190.47,
                sl:'6%',
                je:9.53
            },
            {
                description:'*物流辅助服务*收派服务费',
                ggxh:undefined,
                dw:undefined,
                quantity:undefined,
                dj:undefined,
                price:190.47,
                sl:'6%',
                je:9.53
            },{
                description:'*物流辅助服务*收派服务费',
                ggxh:undefined,
                dw:undefined,
                quantity:undefined,
                dj:undefined,
                price:190.47,
                sl:'6%',
                je:9.53
            },{
                description:'*物流辅助服务*收派服务费',
                ggxh:undefined,
                dw:undefined,
                quantity:undefined,
                dj:undefined,
                price:190.47,
                sl:'6%',
                je:9.53
            },{
                description:'*物流辅助服务*收派服务费',
                ggxh:undefined,
                dw:undefined,
                quantity:undefined,
                dj:undefined,
                price:190.47,
                sl:'6%',
                je:9.53
            },{
                description:'*物流辅助服务*收派服务费',
                ggxh:undefined,
                dw:undefined,
                quantity:undefined,
                dj:undefined,
                price:190.47,
                sl:'6%',
                je:9.53
            },{
                description:'*物流辅助服务*收派服务费',
                ggxh:undefined,
                dw:undefined,
                quantity:undefined,
                dj:undefined,
                price:190.47,
                sl:'6%',
                je:9.53
            },{
                description:'*物流辅助服务*收派服务费',
                ggxh:undefined,
                dw:undefined,
                quantity:undefined,
                dj:undefined,
                price:190.47,
                sl:'6%',
                je:9.53
            },{
                description:'*物流辅助服务*收派服务费',
                ggxh:undefined,
                dw:undefined,
                quantity:undefined,
                dj:undefined,
                price:190.47,
                sl:'6%',
                je:9.53
            }
            ],
        };
    },
    computed: {},
    watch: {},
    methods: {},
    created() {},
    mounted() {},
    beforeCreate() {},
    beforeMount() {},
    beforeUpdate() {},
    updated() {},
    beforeDestroy() {},
    destroyed() {},
    activated() {},
    filters: {
        currency(value) {
        return `$${parseFloat(value).toFixed(2)}`;
        },
    },
    }
</script>
<style scoped lang='scss'>
/*@import url(); 引入公共css类*/
.invoice-container {
  width: 100%;
  
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.vertical_text {
  writing-mode: vertical-rl;
  
}
.flex{
    display: flex;
}
.justify_content{
    justify-content:flex-start;
}
.border_c{
    border: 1px solid rgba(128, 0, 0, 1);
}
.border_l{
    border-left: 1px solid rgba(128, 0, 0, 1);
}
.border_t{
    border-top: 1px solid rgba(128, 0, 0, 1);
}
.border_r{
    border-right: 1px solid rgba(128, 0, 0, 1);
}
.border_b{
    border-bottom: 1px solid rgba(128, 0, 0, 1);
}
.center{
    text-align: center;
}
.line_height{
    line-height: 3;
}
.width_common{
    width: 48px;
   
}
.height_common{
    height: 100px;
}
.invoice_header{
    justify-content: space-between;
    align-items: center;
}
.invoice_body{
    
}
.body_header{
    justify-content: space-between;
}
.name_common{
    flex-direction: column;
    justify-content: center;
    line-height: 3;
    width: 445px;
}
.invoice_details{
   
}
.total{
    width: 230px;
    height:40px;
    line-height: 40px;
}
table{
    width: 100%;
    overflow: auto;
    max-height: 170px;
    
    thead{
        width: 100%;
        max-width: 100%;
        overflow: auto hidden;
    }
    tbody{
        width: 100%;
        max-height: 100%;
        overflow: hidden auto;
        td{
        height: 15px;
        max-width: 240px;
        white-space: break-spaces;
        text-align: right;
    }
    }
    th{
        font-family: '楷体 Regular', '楷体';
        color: #800000;
        font-size: 14px;
        font-weight: 400;
        
    }
}
.right_account{
    width: calc(100% - 230px);
    justify-content: space-between;
    align-items: center;
}
.des_bottom{
    width: 62px;
    height: 70px;
    line-height: 70px;
    text-align: center;
}
.make_name{
    margin-top: 10px;
    margin-left: 45px;
}
.padding_r{
    padding-right: 8px;
    
}
.padding_l{
    padding-left: 8px;
}
.font_famaily{
    font-family: '楷体 Regular', '楷体';
}
.font_color{
    color: #800000;
}
.font_size{
    font-size: 14px;
}

.font_famaily_1{
    font-family: '新宋体 常规', '新宋体'; 
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    color: #0033FF;
}

</style>
<style lang="scss">

</style>