<template>
  <div class="step-footer">
    <el-button v-if="pre" class="step-footer-btn" type="primary" icon="el-icon-back" @click="handlePre">上一步</el-button>
    <el-button v-if="next" class="step-footer-btn" type="primary" icon="el-icon-right" @click="handleNext">下一步</el-button>
  </div>
</template>

<script>

export default {
  props: {
    pre:{
      type: Boolean,
      default: false,
    },
    next:{
      type: Boolean,
      default: false,
    },
  },
  methods:{
    handlePre() {
      this.$emit("handlePre");
    },
    handleNext() {
      this.$emit("handleNext");
    },
  }
}
</script>

<style lang="scss" scoped>
  .step-footer{
    margin-top: 15px;
    text-align: center;
    .step-footer-btn{
      background-color: #00B390;
      border-color: #00B390;
    }
  }
</style>
