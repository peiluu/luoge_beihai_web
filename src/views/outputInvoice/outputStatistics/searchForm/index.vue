<template>
  <div class="">
    <el-form ref="form" :model="searchForm" label-width="80px">
      <el-card shadow="never">
        <el-row :gutter="10" :align="'middle'">
          <el-col :span="8">
            <el-form-item label="活动名称">
              <el-date-picker
                style="width: 100%"
                v-model="searchForm.time"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" label-width="2px">
              <el-radio-group
                v-model="radio1"
                style="width: 100%"
                @change="handleRadioChange"
              >
                <el-radio-button :label="1">本月</el-radio-button>
                <el-radio-button :label="2">上月</el-radio-button>
                <el-radio-button :label="3">本季度</el-radio-button>
                <el-radio-button :label="4">上季度</el-radio-button>
                <el-radio-button :label="5">本年</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="发票种类">
              <el-select
                v-model="searchForm.fppz"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in fpzlOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="纳税主体">
              <el-select
                v-model="searchForm.nsrsbh"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in typeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item
              label=""
              label-width="0"
              style="text-align: right; margin-bottom: 10px"
            >
              <el-button type="primary" @click="handleSearch">搜 索</el-button>
              <el-button @click="handleRest">重 置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import { getListByUser } from "../api/index.js";
export default {
  name: "outputStatisticsSearchFormPage",
  components: {},
  props: {},
  data() {
    return {
      searchForm: {
        time: [],
        fppz: "",
        nsrsbh: "",
      },
      typeOption: [],
      fpzlOptions: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "数电增值税专用发票",
          value: "01",
        },
        {
          label: "数电增值税普通发票",
          value: "02",
        },
      ],
      radio1: 1,
    };
  },
  computed: {},
  watch: {},
  methods: {
    /* search */
    handleSearch() {
      this.$emit("handleFormSearch", this.searchForm);
    },

    /* 重置 */
    handleRest() {
      this.searchForm = { time: this.getDateRangeByCondition(1), fppz: "" };
      this.handleSearch();
    },
    /* 日期取值  1 2 3 4 5 */
    getDateRangeByCondition(condition) {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();

      let start, end;

      switch (condition) {
        case 1: // 本月
          start = new Date(year, month, 1);
          end = new Date(year, month + 1, 0);
          break;
        case 2: // 上月
          start = new Date(year, month - 1, 1);
          end = new Date(year, month, 0);
          break;
        case 3: // 本季度
          const currentQuarter = Math.floor(month / 3);
          start = new Date(year, currentQuarter * 3, 1);
          end = new Date(year, currentQuarter * 3 + 3, 0);
          break;
        case 4: // 上季度
          const lastQuarter = Math.floor(month / 3) - 1;
          start = new Date(year, lastQuarter * 3, 1);
          end = new Date(year, lastQuarter * 3 + 3, 0);
          break;
        case 5: // 本年
          start = new Date(year, 0, 1);
          end = new Date(year, 11, 31);
          break;
        default:
          throw new Error("Invalid condition");
      }

      // 格式化为 el-date-picker daterange 类型需要的格式
      return [this.formatDate(start), this.formatDate(end)];
    },
    formatDate(date) {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    },
    /* 单选变化 */
    handleRadioChange(val) {
      this.$set(this.searchForm, "time", this.getDateRangeByCondition(val));
    },
    /* 获取主体 */
    async handleSelectList() {
      try {
        const res = await getListByUser();
        if (res.code === "0") {
          this.typeOption = res.data.map((item) => {
            return {
              ...item,
              value: item.nsrsbh,
              label: item.nsrmc + " " + item.nsrsbh,
            };
          });
          this.searchForm.nsrsbh = data[0]?.nsrsbh || "";
        }
      } catch (error) {
        throw(`Select NSRSBH error:${error}`)
      }
    },
  },
  created() {},
  mounted() {
    this.handleSelectList();
    this.searchForm.time = this.getDateRangeByCondition(1);
    
    this.handleSearch();
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
};
</script>
<style scoped>
/*@import url(); 引入公共css类*/
::v-deep .el-row {
  display: flex;
  flex-wrap: wrap;
}
</style>