<template>
  <el-button icon="el-icon-back" size="mini" @click="handleBack" :style="{ marginRight: '8px', marginBottom: align == 'left' ? 0 : '8px' }">返回</el-button>
</template>

<script>
export default {
  name: 'BackBtn',
  props: {
    path: {
      type: String,
      default: '/home/index',
    },
    query: {
      type: Object,
      default: () => new Object()
    },
    align: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
    }
  },
  methods: {
    handleBack() {
      this.$router.push({
        path: this.path,
        query: this.query,
      })
      this.$store.dispatch('app/removeTab', this.$store.getters.activeTab);
    },
  }

};
</script>
