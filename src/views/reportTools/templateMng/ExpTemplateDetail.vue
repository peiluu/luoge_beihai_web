<template>
  <div id="luckysheet5" class="luckysheet"></div>
</template>

<script>
  import LuckyExcel from 'luckyexcel'
  import { luckySetting } from './settings.js'
  import { getTemplateDetailJson, loadTemplate } from './Api.js'
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
      }
    },
    watch: {
      templateId(newVal, oldVal){
        //获取模板内容
        this.loadTemplate(newVal);
      }
    },
    computed:{
      templateId(){
        return this.$route.query.templateId
      }
    },
    created(){
      this.loadTemplate(this.$route.query.templateId)
      window.getExcelJsonData = this.getExcelJsonData;
    },
    methods: {
      loadTemplate(templateId){
        let that = this;
        getTemplateDetailJson(templateId).then(res=>{
          if(res.data){
            window.luckysheet.destroy();
            window.luckysheet.create({
              ...luckySetting,
              container: 'luckysheet5',
              data: res.data.template,
            });
          }else {
            if(templateId){
              loadTemplate(templateId).then(blob =>{
                let excelFile = new File([blob], '申报表模板.xlsx');
                that.uploadExcel(excelFile)
              });
            }
          }
        });
      },
      uploadExcel(file){
        let that = this;
        LuckyExcel.transformExcelToLucky(file, function(exportJson, luckysheetfile){
          if(exportJson.sheets==null || exportJson.sheets.length==0){
            that.$message.error('加载文件失败')
            return;
          }
          window.luckysheet.destroy();
          window.luckysheet.create({
            ...luckySetting,
            container: 'luckysheet5',
            data: exportJson.sheets,
          });
        });
      },
      getExcelJsonData(){
        var excel = luckysheet.getAllSheets();
        for(var i in excel) excel[i].data = undefined
        return excel
      }
    }
  };
</script>

<style lang="scss" scoped>
  .luckysheet{
    width: 1258px;
    height: 650px;
  }
</style>
