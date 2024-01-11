<template>
  <div>
    <el-button type="success" @click="showExtendInfo">扩展信息</el-button>
    <div class="info" v-if="infoShow">
      <div class="info-item">
        <div class="item-tit">登记序号</div>
        <div class="item-txt">{{ detail.djxh }}</div>
      </div>
      <div class="info-item">
        <div class="item-tit">行业代码</div>
        <div class="item-txt">{{ detail.hydm }}</div>
      </div>
      <div class="info-item">
        <div class="item-tit">开票方纳税人状态</div>
        <div class="item-txt">{{ nsrztdmMap[detail.nsrztdm] }}</div>

      </div>
      <div class="info-item" v-if="detail.ssdabh">
        <div class="item-tit">税收档案编号 </div>
        <div class="item-txt">{{ detail.ssdabh }}</div>
      </div>
      <div class="info-item">
        <div class="item-tit">税务机关代码</div>
        <div class="item-txt">{{ detail.zgswskfjdm }}</div>
      </div>
      <div class="info-item" v-if="detail.yxqq">
        <div class="item-tit">纳税人类型标签有效期起</div>
        <div class="item-txt">{{ detail.yxqq }}</div>
      </div>
      <div class="info-item">
        <div class="item-tit">纳税人类型标签</div>
        <div class="item-txt">{{ nsrlxMap[detail.nsrlx] }}</div>
      </div>
      <div class="info-item">
        <div class="item-tit">税务机关名称</div>
        <div class="item-txt">{{ detail.zgswskfjmc }}</div>
      </div>
      <div class="info-item" v-if="detail.yxqz">
        <div class="item-tit">纳税人类型标签有效期止</div>
        <div class="item-txt">{{ detail.yxqz }}</div>
      </div>
      <div class="info-item">
        <div class="item-tit">生产经营地址</div>
        <div class="item-txt">{{ detail.scjydz }}</div>
      </div>
      <div class="info-item">
        <div class="item-tit">财务负责人姓名</div>
        <div class="item-txt">{{ detail.cwfzrxm }}</div>
      </div>

      <div class="info-item">
        <div class="item-tit">注册地邮政编码</div>
        <div class="item-txt">{{ detail.zcdyzbm }}</div>
      </div>
      <div class="info-item">
        <div class="item-tit">企业办税人员姓名</div>
        <div class="item-txt">{{ detail.bsrxm }}</div>
      </div>
      <div class="info-item" v-if="detail.qyhyxzdm">
        <div class="item-tit">企业行业性质</div>
        <div class="item-txt">{{ detail.qyhyxzdm }}</div>
      </div>
      <div class="info-item">
        <div class="item-tit">注册地联系电话</div>
        <div class="item-txt">{{ detail.zcdlxdh }}</div>
      </div>
      <div class="info-item" v-if="detail.djzclxdm">
        <div class="item-tit">登记注册类型</div>
        <div class="item-txt">{{ detail.djzclxdm }}</div>
      </div>
      <div class="info-item" v-if="detail.xfsnsrlxdm">
        <div class="item-tit">消费税纳税人类型 </div>
        <div class="item-txt">{{ detail.xfsnsrlxdm }}</div>
      </div>
      <div class="info-item">
        <div class="item-tit">法人名称（法定代表人姓名）</div>
        <div class="item-txt">{{ detail.fddbrxm }}</div>
      </div>
      <div class="info-item">
        <div class="item-tit">新电票试点企业标识</div>
        <div class="item-txt">{{ detail.xdpsdqybz == 'Y' ? '是' : '否' }}</div>
      </div>

    </div>

  </div>
</template>

<script>
import { getTaxPayerInfo } from "./Api";

export default {
  name: "ExtendInfo",
  components: {},
  props: {
    nsrsbh: {
      type: String
    },
  },
  data() {
    return {
      detail: {},
      infoShow: false,
      nsrztdmMap: {
        '01': '受理',
        '02': '筹建期',
        '03': '正常',
        '04': '停业',
        '05': '非正常',
        '06': '清算',
        '07': '注销',
        '08': '非正常户注销',
        '09': '报验',
        '10': '核销报验',
        '11': '中断缴费',
        '12': '恢复缴费',
        '13': '简易注销无异议',
        '99': '其他',
      },
      nsrlxMap: {
        '1': '一般纳税人',
        '2': '小规模纳税人',
        '3': '转登记小规模纳税人',
        '4': '辅导期一般纳税人',
        '5': '自然人',
      },
    };
  },

  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
  },
  mounted() {
    this.getTaxPayerInfo()
  },

  methods: {
    async getTaxPayerInfo() {
      const { code = '', data = {} } = await getTaxPayerInfo({
        nsrsbh: this.nsrsbh
      })
      if (code === '0') {
        this.detail = data
      }
    },
    showExtendInfo() {
      // if (!this.infoShow) {
      //   this.getTaxPayerInfo();
      // }
      this.infoShow = !this.infoShow
    }
  }
}
</script>

<style lang="scss" scoped>
.el-button {
  margin-left: 2.2%;
}
.info {
  display: flex;
  flex-wrap: wrap;
  color: #606266;
  font-size: 14px;
  line-height: 24px;
}

.info-item {
  display: flex;
  flex-basis: 33.3%;
  margin-top: 12px;

  .item-tit {
    width: 47%;
    text-align: right;
  }

  .item-txt {
    padding-left: 12px;
    word-wrap: break-word;
  }

}
</style>

