<template>
  <div class="page1">
    {{name}}
    <p>
      <button @click="increat">click</button>
    </p>
    {{count}}
  </div>
</template>

<script>
import jsTools from '@/assets/js/jsTools';
export default {
  name: 'page1',
  data(){
    return {
      name: 'page1'
    }
  },
  computed: {
    count(){
      return this.$store.state.count;
    }
  },
  created(){
    console.log(jsTools);
  },
  methods: {
    increat(){
      this.$store.commit('increment');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page1 {
    width: 100%;
    height: 450px;
    font-size: 32px;
  }
</style>
