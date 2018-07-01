<template>
  <div class="login">
    {{name}}
  </div>
</template>

<script>
export default {
  name: 'login',
  data(){
    return {
      name: 'login'
    }
  },
  props: {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login {
    font-size: 32px;
  }
</style>
