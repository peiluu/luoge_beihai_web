<template>
  <span>{{ title }}<template v-if="isSHowTime">{{ time ? time + 's' : '' }}</template></span>
</template>
<script>
export default {
  name: 'CountDown',
  props: {
    count: {
      type: Number,
      default: 60,
    },
    title: {
      type: String,
      default: '',
    },
    isSHowTime: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      time: 0,
    };
  },
  watch: {
    count(n) {
      if (n) {
        this.time = n;
        this.startDown();
      }
    },
  },
  methods: {
    startDown() {
      this.t = setInterval(() => {
        if (this.time <= 0) {
          this.$emit('callback')
          clearInterval(this.t);
          this.t = null;
        } else {
          this.time -= 1;
        }
      }, 1000);
    },
  },
};
</script>
