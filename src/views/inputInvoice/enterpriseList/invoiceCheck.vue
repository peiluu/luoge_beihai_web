<template>
  <ComIndex
    dec="发票勾选"
    :businessType="'1'"
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