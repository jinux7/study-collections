<template>
  <i :class="['nux-iconfont', 'nux-icon-' + type]"></i>
</template>

<script>
export default {
  name: 'nux-icon',
  data() {
    return {
    }
  },
  props: {
    type: String,
  },
  computed: {
    
  }
}
</script>

<style lang="scss" scoped>

</style>