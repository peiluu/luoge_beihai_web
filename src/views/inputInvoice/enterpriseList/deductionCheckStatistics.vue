<template>
  <ComIndex
    dec="抵扣勾选统计"
    :businessType="'3'"
  />
</template>
<script>
import ComIndex from './Index.vue'
export default {
  name: 'EnterpriseListInvoiceCheck',
  components: {
    ComIndex
  }
}
</script>