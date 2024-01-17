<template>
  <div class="main-content" :style="'height: ' + contentHeight + 'px;'">
    <form-list :singleSelect="true" :columns="columns" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" ref="list">
      <template #isDigital="row">
        {{ row.data.isDigital == 'Y' ? '是' : '否' }}
      </template>

      <template #myscope="{ data }">
        <el-button v-if="data.isDigital === 'N'" @click.stop="hanldeInvoice(data, 'redinfoApply')">红字信息表填开</el-button>
        <el-button type="success" @click.stop="hanldeInvoice(data, 'handRedInvoice', '0')">红字发票开具</el-button>
        <el-button style="opacity: 0.8" v-if="data.isDigital === 'Y' && data.dqrsl > 0" type="danger" @click.stop="hanldeInvoice(data, 'handRedInvoice', '3')">需确认（{{ data.dqrsl }}）</el-button>
      </template>

    </form-list>
  </div>
</template>

<script>
import { urlMap } from '@/config/constant.js'
import FormList from '@/components/FormList.vue';
export default {
  name: "EnterpriseList",
  components: { FormList },
  data() {
    return {
      api: require('./Api'),
      loading: false,
      param: {},
      columns: [
        { title: "企业名称", dataIndex: "nsrmc",width:60, align: "left" },
        { title: "纳税人识别号", width:50, dataIndex: "nsrsbh", align: "left" },
        { title: "是否开通数电", width:30, dataIndex: "isDigital", align: "center", slot: 'isDigital' },
        { title: "操作", key: "action", width: 300, scopedSlots: { customRender: "action" } }
      ],
      searchList: [
        { index: 0, key: "nsrmc", val: "", type: "input", label: "搜索", placeholder: "企业名称/纳税人识别号" },
      ],
    };
  },
  methods: {
    hanldeInvoice(item, type, level) {
      
      const path = level == '3' ? '/todo/red-font' : '/outputInvoice/redInvoice/infoTable/Index';
      // 数电业务
      if (item.isDigital === 'Y') {
        this.$router.push({
          path,
          query: {
            level,
            nsrmc: item.nsrmc,
            nsrsbh: item.nsrsbh,
            taxBodyId: item.id
          }
        })
        // 查看待确认红字单时不需要关闭现有标签页
        if (level != 3) {
          this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
        }


        return;
      }
      // 税控业务
      // const resourceUrl = urlMap[type].url
      // this.$router.push({
      //   path: '/iframe',
      //   query: {
      //     resourceUrl: resourceUrl,
      //     nsrsbh: item.nsrsbh,
      //   }
      // })
      // this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);

    }
  },
  computed: {
    height() {
      return window.innerHeight - 250;
    },
    contentHeight() {
      return window.innerHeight - 132;
    }
  },
};
</script>

<style lang="scss" scoped>
.el-button {
  width: 110px;
}
</style>
