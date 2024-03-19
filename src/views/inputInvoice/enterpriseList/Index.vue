<template>
  <div class="custom-content" :style="'height: ' + contentHeight + 'px;'">
    <form-list :singleSelect="true" :columns="columns" :searchRow="searchList" :api="api" :param="param" :height="height" v-loading="loading" ref="list">
      <template #isDigital="row">{{ row.data.isDigital == 'Y' ? '是' : '否' }} </template>
      <template #myscope="{ data }">
        <el-button type="success" @click.stop="hanldeEnter(data)">进入</el-button>
      </template>
    </form-list>
  </div>
</template>

<script>
import { urlMap } from '@/config/constant.js'
import FormList from '@/components/FormList.vue';
import { getRequest } from '@/utils'
export default {
  name: "InputInvoiceEnterpriseList",
  components: {
    FormList,
  },
  data() {
    return {
      api: require('./Api'),
      loading: false,
      param: {},
      columns: [
        { title: "企业名称", dataIndex: "nsrmc", align: "left" },
        { title: "纳税人识别号", dataIndex: "nsrsbh", align: "left" },
        { title: "是否开通数电", dataIndex: "isDigital", align: "center", slot: 'isDigital' },
        {
          title: "操作",
          key: "action",
          width: 100,
          scopedSlots: { customRender: "action" }
        }
      ],
      searchList: [
        { index: 0, key: "nsrmc", val: "", type: "input", label: "请输入企业名称", placeholder: "请输入企业名称" },
      ],
    };
  },
  methods: {
    hanldeEnter(item) {
      // 数电业务
      if (item.isDigital === 'Y') {
        const path = this.businessType === '3' ? '/deductionStatistics/list' : '/inputInvoice/choseDate';
        this.$router.push({
          path,
          query: {
            nsrmc: item.nsrmc,
            nsrsbh: item.nsrsbh,
            taxBodyId: item.id,
            businessType: this.businessType
          }
        })
        this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
        return;
      }
      // 税控业务 3 - 勾选统计 4 - 勾选抵扣
      const type = this.businessType === '3' ? 'confirmTick' : 'checkSave';
      const resourceUrl = urlMap[type].url
      this.$router.push({
        path: '/iframe',
        query: {
          resourceUrl: resourceUrl,
          nsrsbh: item.nsrsbh,
        }
      })
    }
  },
  computed: {
    contentHeight() {
      return window.innerHeight - 132;
    },
    height() {
      return window.innerHeight - 280;
    },
    // 业务类型 : 1: 勾选抵扣 2: 勾选不抵扣 3: 勾选统计（不需要选择属期）
    businessType() {
      const query = getRequest(location.href)
      return this.$route.query.businessType || query.businessType
    },
  },
};
</script>

