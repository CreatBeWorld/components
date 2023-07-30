<template>
  <div id="app">
    <div class="icon-container">
      <svg-icon icon-class="bqgl" class-name="my-icon"/>
      <span>图标</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.my-icon{
  font-size:16px;
  color:red;
}
</style>
