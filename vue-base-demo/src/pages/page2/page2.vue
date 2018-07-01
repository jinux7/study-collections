<template>
  <div class="page2">
    {{name}}
    <br />
    {{count}}
  </div>
</template>

<script>
export default {
  name: 'page2',
  data(){
    return {
      name: 'page2'
    }
  },
  computed: {
    count(){
      return this.$store.state.count;
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page2 {
    width: 100%;
    height: 450px;
    font-size: 32px;
  }
</style>
