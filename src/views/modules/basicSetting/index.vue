<template>
  <div class="p-basicSetting" v-loading="loading">
    <div class="main-left">
      <div class="left-item" v-for="(item, index ) in tabList" :key="index" :class="{ 'active': currentIndex === index}" @click="changeCurrentIndex(index)">{{item}}</div>
    </div>

    <div class="main-right">
      <!-- 基础设置 -->
      <BasicSetting v-if="currentIndex === 0" :detail="detail" />
      <!-- 短信预警 -->
      <MessageWarning v-if="currentIndex === 1" :detail="detail" />
    </div>
  </div>
</template>

<script>
import BasicSetting from "./BasicSetting";
import MessageWarning from "./MessageWarning";
import { getDetail } from "./basicSettingApi";

export default {
  components: { BasicSetting, MessageWarning },
  data() {
    return {
      currentIndex: 0,
      tabList: ["基本设置", "短信预警"],
      detail: {},
      loading: false,
      
    };
  },
  computed: {},
  mounted() {
    this.getDetail();
  },
  watch: {
    currentIndex() {
      this.getDetail();
    }
  },
  methods: {
    changeCurrentIndex(index) {
      this.currentIndex = index;
    },
    /**
     * @desption - 查询当前用户基础信息设置
     */
    async getDetail() {
      this.loading = true;
      const { data: { code, data = {} } } = await getDetail();
      if (code == 0) {
        this.loading = false;
        this.detail = {
          ...data,
          zdsb: data.zdsb == "1" ? true : false,
          zdjk: data.zdjk == "1" ? true : false
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.p-basicSetting {
  display: flex;
  background: #fff;
  border-radius: 8px;
  padding: 16px 0;

  .left-item {
    padding: 12px 16px;
    min-width: 160px;
    cursor: pointer;

    &.active {
      color: #2d7fcb;
      background: #e7f6ff;
      border-right: 4px solid #258be4;
    }
  }
}
</style>
