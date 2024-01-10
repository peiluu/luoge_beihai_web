<template>
  <div class="step">
    步骤：<div>{{stepData.current}}</div>/<div>{{stepData.total}}</div> <div>{{stepData.title}}</div>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: {
    stepData:{
      current: "",
      total: "",
      title: "",
    }
  },
  data() {
    return {
    }
  },
}
</script>

<style lang="scss" scoped>
    .step{
      display: flex;
      color: #00B390;
      font-weight: 700;
      font-size: 20px;
    }
</style>
