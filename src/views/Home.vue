<template>
  <div class="home">
    <div class="lottery-main">
      <h3>恭喜中奖</h3>
    </div>
    <div class="lottery-aside">
      <p>当前直播间</p>
    </div>
    <!-- <img alt="Vue logo" src="../assets/logo.png" />
    <el-button type="primary">ECHO</el-button>
    <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    // HelloWorld
  }
}
</script>

<style scoped>
.home {
  display: flex;
  margin: 0 auto;
  max-width: 1080px;
}
.lottery-main {
  flex: 1 auto;
  border: 1px solid #aaa;
}
.lottery-aside {
  flex: 0 0 300px;
  border: 1px solid #aaa;
}
</style>
