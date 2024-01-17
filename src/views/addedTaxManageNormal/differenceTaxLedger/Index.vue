<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <LedgerForm @search="handleSearch" ref="ledgerForm">
      <template #topTool>
        <el-button @click="updateDifferenceTax" type="primary" :disabled="!tableData.length || !queryParam.orgid || !canUpdate">保存</el-button>
        <el-button @click="fetchDifferenceTax" type="primary" :disabled="!queryParam.nsrsbh || !queryParam.srssq || !canUpdate">取数</el-button>
        <el-button @click="handleExport">导出</el-button>
      </template>
      <template #customeTable>
        <vxe-table :key="nsrlx" :data="tableData" :height="height" align="center" border show-overflow keep-source ref="xTable"
          :edit-config="{ trigger: 'click', mode: 'cell', showIcon: false, enabled: !!queryParam.orgid && canUpdate }" v-loading="loading" :edit-rules="validRules" :cell-style="cellStyle">
          <vxe-column type="seq" min-width="50" title="序号" />

          <vxe-colgroup title="票据种类" header-class-name="header-class" v-if="nsrlx == 2">
            <vxe-colgroup header-class-name="hidden">
              <vxe-colgroup field="pjzl" title="1" min-width="150">
                <template slot-scope="{ row }">{{ row.pjzl == 1 ? '增值税专用发票' : '其他' }}</template>
              </vxe-colgroup>
            </vxe-colgroup>
          </vxe-colgroup>
          <vxe-colgroup :title="nsrlx == 2 ? '征收率' : '税率'" header-class-name="header-class">
            <vxe-colgroup header-class-name="hidden">
              <vxe-colgroup field="sl" :title="nsrlx == 2 ? '2' : '1'" min-width="80">
                <template #default="{ row }">{{ slListMap[row.sl] }}</template>
              </vxe-colgroup>
            </vxe-colgroup>
          </vxe-colgroup>
          <vxe-colgroup title="征税项目" header-class-name="header-class" v-if="nsrlx == 2">
            <vxe-colgroup header-class-name="hidden">
              <vxe-colgroup field="zsxm" title="3" min-width="150">
                <template slot-scope="{ row }">{{ (row.sl == 3 && row.pjzl != 1 && row.zsxm == 1 || row.sl == 3 && row.pjzl == 1 && row.zsxm == 1) ? '其中：销售不动产' : zsxmMap[row.zsxm] }}</template>
              </vxe-colgroup>
            </vxe-colgroup>
          </vxe-colgroup>

          <vxe-colgroup title="扣除前">
            <vxe-colgroup title="不含税销售额">
              <vxe-column field="kcqbhsxse" :title="nsrlx == 2 ? '4' : '2'" min-width="120" :edit-render="{}">
                <template #edit="{ row }">
                  <vxe-input v-model="row.kcqbhsxse" type="number" min="0" :disabled="getDisabled(row)" @blur="calcTableData(row, 'kcqbhsxse')" />
                </template>
                <template #default="{ row }"> {{ formatMoney(row.kcqbhsxse) }} </template>
              </vxe-column>
            </vxe-colgroup>
            <vxe-colgroup :title="nsrlx == 2 ? '应纳税额' : '销项税额'">
              <vxe-column field="kcqxxse" :title="nsrlx == 2 ? '5' : '3'" min-width="120">
                <!-- <template #edit="{ row }">
                  <vxe-input v-model="row.kcqxxse" type="number" min="0" :disabled="getDisabled(row)" @blur="calcTableData(row, 'kcqxxse')" />
                </template> -->
                <template #default="{ row }"> {{ formatMoney(row.kcqxxse) }} </template>
              </vxe-column>
            </vxe-colgroup>
            <vxe-colgroup title="价税合计">
              <vxe-column field="kcqjshj" :title="nsrlx == 2 ? '6' : '4'" min-width="120">
                <template #default="{ row }"> {{ formatMoney(row.kcqjshj) }} </template>
              </vxe-column>
            </vxe-colgroup>
          </vxe-colgroup>

          <vxe-colgroup title="扣除项目">
            <vxe-colgroup title="期初余额">
              <vxe-column field="kcxmqcye" :title="nsrlx == 2 ? '7' : '5'" min-width="120">
                <template #default="{ row }"> {{ formatMoney(row.kcxmqcye) }} </template>
              </vxe-column>
            </vxe-colgroup>
            <vxe-colgroup title="本期发生额">
              <vxe-column field="kcxmbqfse" :title="nsrlx == 2 ? '8' : '6'" min-width="120" :edit-render="{}">
                <template #edit="{ row }">
                  <!-- 小规模的免抵退无法修改本期发生额- -->
                  <vxe-input v-model="row.kcxmbqfse" type="number" :disabled="nsrlx == 1 && row.sl == 9" min="0" @blur="calcTableData(row, 'kcxmbqfse')" />
                </template>
                <template #default="{ row }"> {{ formatMoney(row.kcxmbqfse) }} </template>
              </vxe-column>
            </vxe-colgroup>

            <vxe-colgroup title="本期应扣除金额">
              <vxe-column field="kcxmbqykcje" :title="nsrlx == 2 ? '9' : '7'" min-width="120">
                <template #default="{ row }"> {{ formatMoney(row.kcxmbqykcje) }} </template>
              </vxe-column>
            </vxe-colgroup>
            <vxe-colgroup title="本期实际扣除金额">
              <vxe-column field="kcxmbqsjkcje" :title="nsrlx == 2 ? '10' : '8'" min-width="120">
                <template #default="{ row }"> {{ formatMoney(row.kcxmbqsjkcje) }} </template>
              </vxe-column>
            </vxe-colgroup>
            <vxe-colgroup title="期末余额">
              <vxe-column field="kcxmqmye" :title="nsrlx == 2 ? '11' : '9'" min-width="120">
                <template #default="{ row }"> {{ formatMoney(row.kcxmqmye) }} </template>
              </vxe-column>
            </vxe-colgroup>
          </vxe-colgroup>

          <vxe-colgroup title="扣除后" v-if="nsrlx == 2">
            <vxe-colgroup title="含税销售额">
              <vxe-column field="kchhsxse" title="12" min-width="120">
                <template #default="{ row }"> {{ formatMoney(row.kchhsxse) }} </template>
              </vxe-column>
            </vxe-colgroup>
            <vxe-colgroup title="不含税销售额">
              <vxe-column field="kchbhsxse" title="13" min-width="120">
                <template #default="{ row }"> {{ formatMoney(row.kchbhsxse) }} </template>
              </vxe-column>
            </vxe-colgroup>
          </vxe-colgroup>
          <template #empty>
            <span>
              <img src="@/assets/no-data.png" style="width: 80px;height: 80px;">
              <p>未搜索到数据</p>
            </span>
          </template>
        </vxe-table>
      </template>
    </LedgerForm>
  </div>
</template>

<script>
import { slListMap, zsxmMap, limitMoneyMsg } from '@/config/constant';
import { geComputedSl } from "@/utils/tool";
import LedgerForm from "@/components/LedgerForm/Index";
import { queryDifferenceTax, updateDifferenceTax, fetchDifferenceTax, exportLedger, queryStatus } from "./Api";

export default {
  name: "DifferenceTaxLedger",
  components: {
    LedgerForm
  },
  data() {
    return {
      editForm: {},
      loading: false,
      queryParam: {},
      querySbStatus: false,
      tableData: [],
      nsrlx: 1,
      slListMap,
      zsxmMap,
      validRules: {
        kcxmbqfse: [{ pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请输入最多2位小数的数字', }],
        kcqbhsxse: limitMoneyMsg,
        // kcqxxse: limitMoneyMsg,
      }
    };
  },

  methods: {
    handleClose() {
      this.dialogVisible = false;
      this.editForm = {};
    },

    async handleSearch(queryParam) {
      this.queryParam = queryParam;
      this.queryStatus()
      const { code = "", data = {} } = await queryDifferenceTax(queryParam);
      if (code === "0") {
        this.tableData = data.list || []
        this.nsrlx = data.nsrlx
      }
    },
    // 更新台账
    async updateDifferenceTax() {
      const errMap = await this.$refs.xTable.fullValidate(true).catch(errMap => errMap)
      if (errMap) return
      let errMsg = ''
      // 其他 税率 5% 销售不动产的不含税销售额和本期发生额不能大于其他 税率 5%的服务、不动产和无形资产
      this.tableData.forEach((item) => {
        if (item.sl == 3 && item.pjzl != 1 && item.zsxm == 1) {
          errMsg = true
        }
      })
      // 其他 税率 5%的其中销售不动产
      const qzxsbdc = this.tableData.find((item) => item.sl == 3 && item.pjzl != 1 && item.zsxm == 1) || {}
      // 其他 税率 5%的服务、不动产和无形资
      const fwbdc = this.tableData.find((item) => item.sl == 3 && item.pjzl != 1 && item.zsxm == 3) || {}

      if (parseFloat(qzxsbdc.kcqbhsxse) > parseFloat(fwbdc.kcqbhsxse)) {
        this.$message.warning('税率5%的其他销售不动产的不含税销售额不能大于税率5%的的其他服务、不动产和无形资产的不含税销售额')
        return
      }
      if (parseFloat(qzxsbdc.kcxmbqfse) > parseFloat(fwbdc.kcxmbqfse)) {
        this.$message.warning('税率5%的其他销售不动产的不含税销售额不能大于税率5%的的其他服务、不动产和无形资产的本期发生额')
        return
      }
      const { code = "" } = await updateDifferenceTax({ list: this.tableData });
      if (code === "0") {
        this.$message.success("操作成功");
        this.handleSearch(this.queryParam);
      }
    },
    // 取数
    async fetchDifferenceTax() {
      const { code = '' } = await fetchDifferenceTax(this.queryParam)
      if (code === '0') {
        this.$message.success('操作成功');
        this.handleSearch(this.queryParam)
      }
    },
    saveData() {
      this.$refs["editForm"].validate(async valid => {
        if (!valid) return;
        const { code = "", data = [] } = await updateDifferenceTax({
          list: this.tableData
        });
        if (code === "0") {
          this.tableData = data;
        }
      });
    },
    getDisabled(row) {
      // 一般纳税人免抵退(SL = 9)可以修改不含税销售额（修改为无法调整-）
      if (this.nsrlx == 1) {
        // return row.sl != 9
        return true;
      }
      // 税率5%（sl = 3）的销售不动产(zsmx= 1)其他发票
      if (this.nsrlx == 2) {
        return !(row.sl == 3 && row.zsxm == 1 && row.pjzl == 2);
      }
      return false
    },

    // 表格数据计
    calcTableData(row, column) {
      switch (column) {
        // 本期发生额(6)、扣除前-不含税销售额（2）。应纳税额（3）
        case "kcxmbqfse":
        case "kcqbhsxse":
        case "kcqxxse":
          // 小规模纳税人
          if (this.nsrlx == 2) {
            // 扣除前应纳税额  = 不含税销售额 * 税率
            row.kcqxxse = (parseFloat(row.kcqbhsxse) * geComputedSl(row.sl)).toFixed(2)
            // 扣除前价税合计 = 2列+3列
            row.kcqjshj = parseFloat(row.kcqbhsxse) + parseFloat(row.kcqxxse);
            // 本期应扣除金额 =5列+6列
            row.kcxmbqykcje =
              parseFloat(row.kcxmqcye) + parseFloat(row.kcxmbqfse);
            // 本期实际扣除金额 =当第4列金额大于等于0时，=min（本表第4列，本表第7列）当第4列金额小于0时，则为0
            row.kcxmbqsjkcje = row.kcqjshj >= 0 ? Math.min(row.kcxmbqykcje, row.kcqjshj) : 0
            // 期末余额 =本行5列+本行6列-本行8列
            row.kcxmqmye = parseFloat(row.kcxmqcye) + parseFloat(row.kcxmbqfse) - parseFloat(row.kcxmbqsjkcje);

            // 扣除后含税销售额 =c本行4列-本行8列
            row.kchhsxse = parseFloat(row.kcqjshj) - parseFloat(row.kcxmbqsjkcje);
            // 扣除后不含税销售额  = 本行第10列( 其他免税。 服务、不动产和无形资产（sl = 7))
            if (row.sl == 7 && row.pjzl == 2 && row.zsxm == 3) {
              row.kchbhsxse = row.kchhsxse
            } else {
              // 扣除后不含税销售额 = 本行第10列/（1+本行1列）
              row.kchbhsxse = (row.kchhsxse / (1 + geComputedSl(row.sl))).toFixed(2)
            }
            // 一般纳税人
          } else {
            // 扣除前价税合计 = 2列+3列
            row.kcqjshj = parseFloat(row.kcqbhsxse) + parseFloat(row.kcqxxse);
            // 本期应扣除金额 '=5列+6列
            row.kcxmbqykcje =
              parseFloat(row.kcxmqcye) + parseFloat(row.kcxmbqfse);
            // 本期实际扣除金额 =当第4列金额大于等于0时，=min（本表第4列，本表第7列）当第4列金额小于0时，则为0
            row.kcxmbqsjkcje = row.kcqjshj >= 0 ? Math.min(row.kcxmbqykcje, row.kcqjshj) : 0
            // 期末余额  = 7列-8列
            row.kcxmqmye = parseFloat(row.kcxmbqykcje) - parseFloat(row.kcxmbqsjkcje);
            break;
          }

      }
    },
    // 修改单个格样式
    cellStyle({ row, column, }) {
      if (!this.queryParam.orgid || !this.canUpdate) {
        return null
      }
      // 一般纳税人免抵退无法修改本期发生额
      // 一般纳税人只有税率免抵退(sl = 9)的才能修改不含税销售额（后期修改为无法调整）
      if (
        (this.nsrlx == 1 && column.field == "kcxmbqfse" && row.sl != 9) ||
        // (this.nsrlx == "1" &&
        //   column.field == "kcqbhsxse" &&
        //   row.sl == 9) ||
        (this.nsrlx == 2 && column.field == "kcxmbqfse") ||
        // || 小规模纳税人其他 、5%税率（sl = 3）的销售不动产（zsmx = 1）可以修改不含税销售额和应纳税额
        (this.nsrlx == "2" &&
          ["kcqbhsxse"].includes(column.field) &&
          row.sl == 3 &&
          row.zsxm == 1 &&
          row.pjzl == 2)
      ) {
        return {
          background: "#D9F2FD",
          borderBottom: "1px solid #e8eaec"
        };
      }
    },

    // 导出
    async handleExport() {
      const fileName = `差额征税台账.xlsx`
      await exportLedger({
        reqData: { ...this.queryParam, pageNo: 1, pageSize: 99999 },
        fileName
      })
    },
    // 查询申报状态
    async queryStatus() {
      // false是当前还没有申报
      const { code = '', data } = await queryStatus({ ...this.queryParam, ssq: this.queryParam.srssq, sbsz: 'zzs' })
      if (code === '0') {
        this.querySbStatus = data
      }
    },
  },
  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
    height() {
      return window.innerHeight - 240;
    },
    ssqReturnType() {
      return this.$refs.ledgerForm.zzstbzq
    },
    canUpdate() {
      return !this.querySbStatus
      // return this.judgeIsCurrentSq(this.queryParam.srssq, this.queryParam.tbzq || '月') && !this.querySbStatus
    }
  }
};
</script>
<style scoped lang="scss">
/deep/ .header-class.vxe-header--column {
  position: relative;
  background-image: linear-gradient(#e8eaec, #e8eaec);

  .vxe-cell--title {
    top: 100%;
    text-align: center;
    transform: translate(-50%, -50%);
    position: absolute;
  }
}

/deep/ .hidden {
  opacity: 1;
}
</style>
