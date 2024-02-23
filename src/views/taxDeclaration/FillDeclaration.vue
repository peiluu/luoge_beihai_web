<template>
  <div class="FillDeclaration">
    <div class="header-opt">
      <el-button v-show="searchParam.status==0||searchParam.status==1" :disabled="loading" type="primary" @click="calcDeclaration">计算</el-button>
      <el-button v-show="searchParam.status==0||searchParam.status==1" :disabled="loading" type="primary" @click="saveDeclaration">保存</el-button>
      <el-button v-show="searchParam.status==1" :disabled="loading" type="primary" @click="submitDeclaration">提交</el-button>
      <el-button v-show="searchParam.status==2" :disabled="loading" type="primary" @click="undoDeclaration">撤销</el-button>
      <el-button :disabled="loading" type="primary" @click="downloadExcel">下载</el-button>
    </div>
    <div
      id="luckysheet3" v-loading="loading"
      :element-loading-text="loadingText"
      element-loading-spinner="el-icon-loading"
      ></div>
  </div>
</template>

<script>
  import LuckyExcel from 'luckyexcel'
  import {exportExcel} from './export'
  import { luckySetting } from '../reportTools/settings.js'

  export default {
    name: 'FillDeclaration',
    props: {
      msg: String
    },
    data(){
      return {
        api: require('./Api'),
        templateApi: require('../reportTools/templateMng/Api'),
        loading: false,
        loadingText: '疯狂加载中',
        inputs:[],
        cellValueData: {},
        dynamicRows:{},
        offsetRows:{},

        declaration: {},
        lastId:'',
        lastTemplateId: '',
      }
    },
    computed:{
      searchParam(){
        return this.$route.query
      },
      calcTaxIdTempId(){
        const { query } = this.$route
        return query.taxDeclarationId + '_' + query.templateId
      }
    },
    watch: {
      // taxDeclarationId 和 templateId 其中任一个id变动都需要重新执行loadTemplate
      'calcTaxIdTempId'(newVal, oldVal){
        if(/^[0-9]/.test(newVal) && newVal != this.lastId + '_' + this.lastTemplateId){
          this.loadTemplate(this.searchParam.taxDeclarationId, this.searchParam.templateId);
        }
      },
    },
    created(){
      this.$nextTick(() => {
        this.loadTemplate(this.searchParam.taxDeclarationId, this.searchParam.templateId);
      });
    },
    methods:{
      loadTemplate(taxDeclarationId, templateId){
        let that = this;
        that.templateApi.getTemplateDetailJson(templateId).then(res=>{
          if(res.data){
            that.loadExcelJson('luckysheet3', res.data.template)
          }else {
            if(templateId){
              that.templateApi.loadTemplate(templateId).then(blob =>{
                let excelFile = new File([blob], '申报表模板.xlsx');
                that.uploadExcel(excelFile)
              });
            }
          }
          that.lastId = taxDeclarationId;
          that.lastTemplateId = templateId;
        });
      },
      uploadExcel(file){
        let that = this;
        let name = file.name;
        let suffixArr = name.split("."), suffix = suffixArr[suffixArr.length-1];
        if(suffix!="xlsx"){
          this.$message.error('只能支持xlsx格式的文件')
          return;
        }
        LuckyExcel.transformExcelToLucky(file, function(exportJson, luckysheetfile){
        //  that.processCellData(exportJson.sheets);
          if(exportJson.sheets==null || exportJson.sheets.length==0){
            this.$message.error('加载文件失败')
            return;
          }
          that.loadExcelJson('luckysheet3', exportJson.sheets)
        });
      },
      loadExcelJson(id, excelJson){
        let that = this;
        that.processCellData(excelJson);
        window.luckysheet.destroy();
        window.luckysheet.create({
          ...luckySetting,
          container: id,
          data: excelJson,
          hook:{
            workbookCreateAfter:function(){
              //  luckysheet.setRangeConditionalFormat('icons',{format:'threeWayArrowMultiColor',row:[9,9],column:[8,8],order:5})
              //加载数据
              that.loadFilledData();
              // 动态设置每一个sheet表的最大列数
              excelJson.forEach((item,index)=>{
                let maxLen = 0
                item.data.forEach(dItem => {
                  let dLen = 0
                  dItem.forEach((v,i) => {
                    if(v !== null && Reflect.has(v,'v')) {
                      dLen = dLen > i + 1 ? dLen : i + 1
                    }
                  })
                  maxLen = maxLen > dLen ? maxLen : dLen
                })
                luckysheet.hideColumn(maxLen + 2 , item.data[0].length,{order: index})
              })
            },
            cellUpdateBefore:function(r,c,v){
              that.addToCellData(r,c,v);
            },
            cellEditBefore:function (cell) {
              var flag = false;
              that.inputs.forEach(item=>{
                if(item.rowStart==cell[0].row[0] &&  item.colStart==cell[0].column[0]){
                  flag = true;
                  return;
                }
              })
              return flag;
            },
          },
        });
      },
      addToCellData(r,c,v,order){
        if(!order) order = luckysheet.getSheet().order;
        if(!this.cellValueData[order]) this.cellValueData[order] = [];
        const cellDatas = this.cellValueData[order];
        let cellData = cellDatas.filter(item =>{return item.rowStart== r && item.colStart == c})
        if(v && !v.f ){
          if(cellData.length>0){
            cellData[0].cellValue = v;
          }else {
            cellDatas.push({rowStart:r, colStart:c, cellValue: v})
          }
        }
      },
      downloadExcel(){
        exportExcel(luckysheet.getAllSheets(),`${this.declaration.nsrmc}${this.declaration.nsrsbh}${this.declaration.templateName}${this.declaration.declareDate}`)
      },
      loadFilledData(){
        let that = this;
        that.api.listDeclarationDetail(this.searchParam.taxDeclarationId).then(res=>{
          //已填报的数据
          that.declaration = res.data.declaration
          //手工输入
          that.inputs = res.data.inputs
          //加载动态行数据
          that.loadDynamicData(res.data.dynamic, function(){
            /**加载已填报数据*/
            for(var key in res.data.ledger){
              luckysheet.setSheetActive(key)
              const data = res.data.ledger[key];
              for(var i=0; i<data.length; i++){
                let offset = that.calcRowAddOffset(data[i].rowStart,key, 1)
                if(!that.checkInnerFunc(data[i].rowStart + offset,data[i].colStart)){
                  luckysheet.setCellValue(data[i].rowStart + offset, data[i].colStart, data[i].cellValue);
                }
              }
            }
            //加载下拉框数据
            that.loadDropdownData(res.data.dropdown);

            //加载基础配置数据
            that.loadBasicData(res.data.basics);
            //自动计算
            that.calcDeclaration();
          });
          luckysheet.setSheetActive(0)
        });
      },
      /**加载动态行数据并增行*/
      loadDynamicData(dynamic ,cb){
        let that = this;
        that.dynamicRows = {};
        that.offsetRows = {}
        /**加载动态行数据*/
        this.api.getDynamicRowData(this.searchParam.taxDeclarationId).then(res=>{
          for(var key in res.data){
            luckysheet.setSheetActive(key);
            if(!that.dynamicRows[key]){
              that.dynamicRows[key] = [];
            }
            if(!that.offsetRows[key]){
              that.offsetRows[key] = [];
            }
            let cellData = res.data[key]
            let preStart;
            let offset = 0, preOffset = 0;
            let j=0;
            let k = 0;
            cellData.forEach((e,index)=>{
              if(!preStart || preStart!=e.start){
                j=0;
                k=0;
                preStart = e.start;
                preOffset = offset;
                if(e.total > 2){
                  luckysheet.insertRow(preStart + 1 + offset, {number: e.total - 2});
                  offset = offset + e.total - 2;
                  that.offsetRows[key].push({offset: offset, start: e.start})
                }
              }
              let r = e.rowIndex + preOffset;
              that.dynamicRows[key].push(r);
              e.rowData.forEach(cell=>{
                if(cell.colStart!=cell.colEnd && !this.checkCellMerge(cell, r)){
                  luckysheet.setRangeMerge("horizontal", {range: {row:[r,r],column:[cell.colStart-1,cell.colEnd-1]}})
                }
                luckysheet.setCellFormat(r, cell.colStart-1, "tb", 2)
                luckysheet.setCellFormat(r, cell.colStart-1, "ht", cell.ht)
                luckysheet.setCellFormat(r, cell.colStart-1, "bg", cell.bg)
                luckysheet.setCellFormat(r, cell.colStart-1, "ff", cell.ff)
                luckysheet.setCellFormat(r, cell.colStart-1, "fs", cell.fs)
                if(cell.fa){
                  luckysheet.setCellFormat(r, cell.colStart-1, "ct", {fa:cell.fa, t:"n"})
                }
                //1:取字段，2文本, 3函数，4整数自增 5小数点自增
                if(cell.vlType==1 || cell.vlType==2){
                  luckysheet.setCellValue(r, cell.colStart-1, cell.v);
                }else if(cell.vlType==3){
                  if(cell.v){
                    luckysheet.setCellValue(r, cell.colStart-1, {f: cell.v.replace(/_r/g, r+1)});
                  }
                }else if(cell.vlType==4){
                  luckysheet.setCellValue(r, cell.colStart-1, parseInt(cell.v)+j);
                  j++;
                }else if(cell.vlType==5){
                  luckysheet.setCellValue(r, cell.colStart-1, (parseFloat(cell.v)+k).toFixed(1));
                  k += 0.1;
                }
              })
            })
            if(dynamic[key]){
              dynamic[key].forEach(e=>{
                luckysheet.setCellValue(e.rowStart, e.colStart, e.cellValue);
              })
            }
          }
          cb();
          luckysheet.setSheetActive(0)
        });
      },
      loadDropdownData(dropdown){
        dropdown.forEach((e=>{
          let offset = this.calcRowAddOffset(e.rowStart, e.sheetOrder, 1)
          luckysheet.setDataVerification({
              type:'dropdown',
              value1:e.expression
            },{range:{row:[e.rowStart + offset,e.rowEnd + offset],column:[e.colStart,e.colEnd]},order: e.sheetOrder}
          )
        }))
      },
      loadBasicData(basics){
        basics.forEach(e=>{
          let offset = this.calcRowAddOffset(e.rowStart, e.sheetOrder, 1)
          if(e.sheetOrder || e.sheetOrder==0){
            luckysheet.setSheetActive(e.sheetOrder );
            if(e.type=='checkbox'){
            //□     //   //√☑
              if(e.cellValue){
                luckysheet.setCellValue(e.rowStart + offset, e.colStart, "☑" + e.viewer);
              }
              /*luckysheet.setDataVerification({
                type:'checkbox',
                value1: e.viewer,
                value2: e.viewer,
                checked: e.cellValue
              },{range:{row:[e.rowStart + offset,e.rowEnd + offset],column:[e.colStart,e.colEnd]},order: e.sheetOrder})*/
            }else if(e.cellValue){
              luckysheet.setCellValue(e.rowStart + offset, e.colStart, e.cellValue);
            }
            luckysheet.setCellFormat(e.rowStart + offset, e.colStart, "ht", 1)
          //  luckysheet.setCellFormat(e.rowStart + offset, e.colStart, "tb", 2)
          }
        })
      },
      /**仅加载动态行数据不增行*/
      loadDynamicDataNoInsertRow(){
        this.api.getDynamicRowData(this.searchParam.taxDeclarationId).then(res=>{
          for(var key in res.data){
            luckysheet.setSheetActive(key);
            let cellData = res.data[key]
            cellData.forEach((e,index)=>{
              let offset = this.calcRowAddOffset(e.start, key, 1)
              e.rowData.forEach(cell=>{
                if(cell.vlType==1 || cell.vlType==2){
                  luckysheet.setCellValue(e.rowIndex + offset, cell.colStart-1, cell.v);
                }else if(cell.vlType==3){
                  if(cell.v){
                    luckysheet.setCellValue(e.rowIndex + offset, cell.colStart-1, {f: cell.v.replace(/_r/g, e.rowIndex+offset+1)});
                  }
                }
              })
            })
          }
          luckysheet.setSheetActive(0);
        })
      },
      calcDeclaration(){
        this.loadingText='拼命计算中'
        this.loading = true;
        this.api.calcDeclaration(this.searchParam.taxDeclarationId).then(res =>{
          for(var key in res.data){
            luckysheet.setSheetActive(key)
            const data = res.data[key];
            for(var i=0; i<data.length; i++){
              let offset = this.calcRowAddOffset(data[i].rowStart, key, 1)
              luckysheet.setCellValue(data[i].rowStart + offset, data[i].colStart, data[i].cellValue);
            }
          }
        //  this.loadDynamicDataNoInsertRow();
          luckysheet.setSheetActive(0)
          this.loading = false
        });
      },
      saveDeclaration(){
        this.processCellValue();
        const dynamicData = {};
        //动态行数据不保存到mongo，分开保存
        for(var key in this.dynamicRows){
          if(!dynamicData[key]){
            this.$set(dynamicData,key,[]);
          }
          if(this.cellValueData[key]){
            let values = this.cellValueData[key];
            for(var i=0;i<values.length;i++){
              let value = values[i];
              if(this.dynamicRows[key].indexOf(value.rowStart)!=-1){
                dynamicData[key].push(value);
                values.splice(i--,1);
              }else {
                let offset = this.calcRowSubOffset(value.rowStart, key,1);
                values.splice(i,1, {...value,rowStart:value.rowStart-offset})
              }
            }
          }
        }
        this.api.saveDeclarationDetail({cellData: this.cellValueData, dynamicRowData:dynamicData }, this.searchParam.taxDeclarationId).then(res=>{
          if (res && res.code == 0) {
            this.$message.success("保存成功");
            this.$router.push({
              path: "/taxDeclaration/index"
            });
          }
        });
      },
      //计算行减去偏移量
      calcRowSubOffset(rowStart, key, i){
        if(!this.offsetRows || !this.offsetRows[key]){
          return 0;
        }
        let pre = this.offsetRows[key][i-1];
        let cur = this.offsetRows[key][i];
        if(!pre){
          return 0;
        }
        if(rowStart < pre.start+pre.offset+2){
          return 0;
        }
        if(!cur){
          return pre.offset;
        }
        if(rowStart < cur.start + pre.offset){
          return pre.offset
        }
        return this.calcRowSubOffset(rowStart, key, i+1);
      },
      //计算行增加偏移量
      calcRowAddOffset(rowStart, key, i){
        if(!this.offsetRows || !this.offsetRows[key]){
          return 0;
        }
        let pre = this.offsetRows[key][i-1];
        let cur = this.offsetRows[key][i];
        if(!pre){
          return 0;
        }
        if(rowStart <= pre.start){
          return 0;
        }
        if(!cur){
          return pre.offset;
        }
        if(rowStart < cur.start){
          return pre.offset
        }
        return this.calcRowAddOffset(rowStart, key, i+1);
      },
      processCellData(data) {
      //  let data = JSON.parse(excelData);
        for (const item of data) {
          // 遍历limitMoneyMsg
          let index = item.index;
          let calcChain = [];
          for (const item2 of item.celldata) {
            if (typeof(item2.v.f) !== 'undefined') {
              calcChain.push({
                r: item2.r,
                c: item2.c,
                index,
              })
            }
          }
          item.calcChain = calcChain;
        }
        return JSON.stringify(data);
      },
      //判断单元格是否已合并
      checkCellMerge(cell, rowStart){
        let cfg = luckysheet.getConfig();
        for(var key in cfg.merge){
          let mrg = cfg.merge[key]
          if(mrg.r==rowStart && mrg.c==cell.colStart-1){
            return true;
          }
        }
      },
      //判断单元格是否有表内表间公式
      checkInnerFunc(r, c){
        let sheets = luckysheet.getSheetData();
        let cell = sheets[r][c];
        if(!cell || !cell.f){
          return false;
        }
        return true;
      },
      processCellValue(){
        let sheets = luckysheet.getAllSheets();
        for(var key in sheets){
          let sheetData = sheets[key].data
          sheetData.forEach((row,rowIndex)=>{
            row.forEach((cell,colIndex)=>{
              if(!cell || !cell.f){
                return;
              }
              this.addToCellData(rowIndex,colIndex,cell.v, key);
              return;
            })
          })
        }
      },
      submitDeclaration(){
        this.api.batchUpdateStatus({ids: [this.searchParam.taxDeclarationId], status: 2}).then(res=>{
          this.$message.success("操作成功");
          this.$router.push({
            path: "/taxDeclaration/index"
          });
        });
      },
      undoDeclaration(){
        this.api.batchUpdateStatus({ids: [this.searchParam.taxDeclarationId], status: 1}).then(res=>{
          this.$message.success("操作成功");
          this.$router.push({
            path: "/taxDeclaration/index"
          });
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
.FillDeclaration {
  position: relative;
  height: calc(100vh - 50px - 38px);
  .header-opt {
    padding: 8px;
    font-size: 14px;
    background-color: #fff;
  }
  #luckysheet3 {
    position: relative;
    height: calc(100% - 44px);
  }
}
</style>
