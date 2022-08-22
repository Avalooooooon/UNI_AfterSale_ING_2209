<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html,body,#app{
  height: 100%;
  width: 100%;
}

#app {
  width: 100%;
  height: 100vh;
  overflow: auto;
  font-family: PingFang SC, Microsoft YaHei, Arial, Helvetica, sans-serif, "宋体";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
}

/*::-webkit-scrollbar {*/
/*  width: 6px;*/
/*}*/

/*::-webkit-scrollbar-thumb {*/
/*  background: transparent;*/
/*  border-radius: 4px;*/
/*}*/

/*:hover::-webkit-scrollbar-thumb {*/
/*  background: #e9ebf4;*/
/*}*/

/*:hover::-webkit-scrollbar-track {*/
/*  background: #e9ebf4;*/
/*}*/
</style>
