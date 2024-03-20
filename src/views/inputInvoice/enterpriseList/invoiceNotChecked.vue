<template>
  <ComIndex
    dec="发票不勾选"
    :businessType="'2'"
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