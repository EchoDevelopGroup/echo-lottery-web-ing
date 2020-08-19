<template>
  <div class="lottery">
    <!-- 页面背景 -->
    <lottery-background>
      <!-- 剩余人数计数器 -->
      <div class="lottery-people-counter">
        <span class="lottery-people-counter-text">999</span>
      </div>
    </lottery-background>

    <div class="main">
      <task-box></task-box>
    </div>
  </div>
</template>

<script>
import LotteryBackground from '@/components/LotteryBackground'
import TaskBox from '@/components/TaskBox'

export default {
  name: 'Lottery',
  components: {
    LotteryBackground,
    TaskBox
  }
}
</script>

<style>
.lottery {
  position: relative;
}
.lottery-people-counter {
  box-sizing: border-box;
  width: 170px;
  height: 220px;
  padding-top: 100px;
  text-align: center;
  background-image: url('~@/assets/echo-counter.png');
}
.lottery-people-counter-text {
  color: #fff;
  font-size: 40px;
  font-family: 'zhscnmt';
}
.main {
  position: relative;
  z-index: 100;
}
</style>
