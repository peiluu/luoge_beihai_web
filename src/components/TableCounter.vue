<template>
  <div class="com-table-counter">
    <div class="counter-check">已勾选<span>{{ selecedInfo.number }}</span>条 / 金额<span>{{ selecedInfo.hjje }}</span>元 / 税额<span>{{ selecedInfo.hjse }}</span> 元 / 价税合计<span>{{ selecedInfo.jshj }}</span> 元</div>
    <!-- <div>税额总额<span>{{ formatMoney(totalEntity.totalSeSum) || 0 }}</span>元，
      金额总额<span>{{ formatMoney(totalEntity.totalJeSum) || 0 }}</span>元
      ，价税合计总额 <span>{{ formatMoney(totalEntity.totalJshjSum) || 0 }}</span>元</div> -->
  </div>
</template>

<script>
export default {
  name: 'TableCounter',
  props: {
    // totalEntity: {
    //   type: Object,
    //   default: () => new Object(),
    // },
    tableCounterShow: {
      type: Boolean,
      default: false
    },
    tableCounterConfig: {
      type: Object,
      default: () => new Object(
        {
          hjje: 'hjje',
          hjse: 'hjse',
        },
      ),
    }
  },
  data() {
    return {
      selecedInfo: {
        number: 0,
        hjje: 0,
        hjse: 0,
        jshj: 0,
        
      },
      totalData: {},
      totalEntity: {}
    }
  },
  wactch: {
    totalEntity(val) {
      console.log(val.totalHjseSum)
      if (val) {
        this.totalData = val;
        
      }
    }
  },
  activated() {

     console.log(this.tableCounterConfig,"-=-=-=")
  },


  methods: {
    getTotalEntity(data) {
      this.totalEntity = data
    },

    // 获取多选的数据
    getSelecedInfo(rows) {
      let hjje = 0,
        hjse = 0,
        jshj = 0;
      rows.forEach(item => {
        hjje += parseFloat(item[this.tableCounterConfig['hjje']])
        hjse += parseFloat(item[this.tableCounterConfig['hjse']])
      });
      jshj = hjje + hjse
      this.selecedInfo = {
        number: rows.length,
        hjje: this.formatMoney(hjje) || 0,
        hjse: this.formatMoney(hjse) || 0,
        jshj: this.formatMoney(jshj) || 0
      };
    },
    setInfo(selecedInfo){
      console.log(selecedInfo,"--")
      this.selecedInfo = selecedInfo
    }
  }

};
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

.com-table-counter {
  padding-top: 8px;
  color: $mainTextColor;
  .counter-check{
    display: flex;
    align-items: center;
  }

  span {
    padding: 0 5px;
    font-size: 14px;
    color: #00b390;
    font-weight: bold;
  }
}
</style>
