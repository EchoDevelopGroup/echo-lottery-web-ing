<template>
  <div class="lottery">
    <lottery-background>
      <div class="lottery-people-counter">
        <span class="lottery-people-counter-text">999</span>
      </div>
    </lottery-background>
  </div>
</template>

<script>
import LotteryBackground from '@/components/LotteryBackground'

export default {
  name: 'Lottery',
  components: {
    LotteryBackground
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
  background-image: url('~@/assets/echo-counter.png');
}
.lottery-people-counter-text {
  text-align: center;
  color: #fff;
  font-size: 40px;
}
</style>
