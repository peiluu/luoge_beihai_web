<template>
  <div id="luckysheet2" class="luckysheet"></div>
</template>

<script>
  import LuckyExcel from 'luckyexcel'
  import { luckySetting } from './settings.js'
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
        templateApi: require('./templateMng/Api'),
        cellSettingApi: require('./cellSetting/Api'),
        currentCell: {},
        lastCell: {},

      }
    },
    watch: {
      dsId(newVal, oldVal){
        this.loadTemplate(newVal)
      }
    },
    computed:{
      dsId(){
        return this.$route.query.dsId
      }
    },
    created(){
      this.loadTemplate(this.$route.query.dsId)
      window.getCurrentCell = this.getCurrentCell;
    },
    methods: {
      getCurrentCell(){
        return this.currentCell;
      },
      loadTemplate(templateId){
        let that = this;
        that.templateApi.getTemplateDetailJson(templateId).then(res=>{
          if(res.data){
            that.loadExcelJson('luckysheet2', res.data)
          }else {
            that.templateApi.loadTemplate(templateId).then(blob =>{
              let excelFile = new File([blob], '申报表模板.xlsx');
              this.uploadExcel(excelFile)
            });
          }
        });
      },
      uploadExcel(file){
        let that = this;
        let name = file.name;
        let suffixArr = name.split("."), suffix = suffixArr[suffixArr.length-1];
        if(suffix!="xlsx"){
          that.$message.error('只能支持xlsx格式的文件')
          return;
        }
        LuckyExcel.transformExcelToLucky(file, function(exportJson, luckysheetfile){
          if(exportJson.sheets==null || exportJson.sheets.length==0){
            that.$message.error('加载文件失败')
            return;
          }
          that.loadExcelJson('luckysheet2', exportJson.sheets)
        });
      },
      loadExcelJson(id, excelJson){
        let that = this;
        window.luckysheet.destroy();
        window.luckysheet.create({
          ...luckySetting,
          container: id,
          data: excelJson,
          hook:{
            cellEditBefore:function(e){
              that.lastCell = {...that.currentCell};
              that.currentCell = e[0];
              that.currentCell.order = luckysheet.getSheet().order
              let data = {
                templateId: that.dsId,
                sheetOrder: that.currentCell.order,
                rowStart: that.currentCell.row[0],
                rowEnd: that.currentCell.row[1],
                colStart: that.currentCell.column[0],
                colEnd: that.currentCell.column[1]
              }
              //获取单元的描述
              that.cellSettingApi.detailCellSetting(data).then(res=> {
                if(res.data ){
                  that.currentCell.description = res.data.description
                }
              })
              if(that.lastCell.row && that.lastCell.column){
                luckysheet.setCellFormat(that.lastCell.row[0], that.lastCell.column[0], "bg", "", {order:that.lastCell.order});
              }
              luckysheet.setCellFormat(that.currentCell.row[0], that.currentCell.column[0], "bg", "#ffb628", {order:that.currentCell.order});
              return false;
            },
          },
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .luckysheet{
    width: 1258px;
    height: 580px;
  }
</style>
