<template>
  <div class="lottery-background">
    <!-- 背景会动的那个love echo -->
    <div class="lottery-background-moving-echo"></div>

    <!-- 右边粉色栏 -->
    <div class="lottery-background-right-aside"></div>
    <!-- 下边粉色栏 -->
    <div class="lottery-background-bottom-aside">
      <!-- 左下角文字 -->
      <img
        class="lottery-background-bottom-left"
        src="@/assets/bottom-left-spade-echo.png"
        alt="Spade Echo"
      />
      <!-- 右下角文字 -->
      <img
        class="lottery-background-bottom-right"
        src="@/assets/bottom-right-lottery-machine.png"
        alt="Lottery Machine"
      />
    </div>

    <!-- 放计数器的地方 -->
    <div class="lottery-background-counter">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LotteryBackground'
}
</script>

<style>
@keyframes lottery-background-move-right {
  0% {
    background-position-x: 0;
  }
  100% {
    background-position-x: 224px;
  }
}
.lottery-background {
  position: relative;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  background-color: #ffec40;
  overflow: hidden;
}
.lottery-background-moving-echo {
  position: absolute;
  z-index: 11;
  /* cos(15deg) = 0.96593
  cos(75deg) = 0.25882 */

  /* 偏移量用宽高减去屏幕宽高除以二 */
  top: calc(100vh * 0.017 - 100vw * 0.13);
  left: calc(100vw * 0.017 - 100vh * 0.13);
  /* 宽高用三角函数算 */
  width: calc(100vw * 0.966 + 100vh * 0.259);
  height: calc(100vh * 0.966 + 100vw * 0.259);
  transform: rotate(15deg);
  background-image: url('~@/assets/love-echo.png');
  animation: lottery-background-move-right 4s linear 0s infinite;
}
.lottery-background-right-aside {
  position: absolute;
  z-index: 12;
  width: 200px;
  height: 100%;
  top: 0;
  right: 0;
  background-color: #ef5594;
}
.lottery-background-bottom-aside {
  position: absolute;
  z-index: 13;
  width: 100%;
  height: 200px;
  bottom: 0;
  left: 0;
  background-color: #ef5594;
}
.lottery-background-bottom-left {
  position: absolute;
  z-index: 14;
  left: 30px;
  bottom: 30px;
  display: block;
}
.lottery-background-bottom-right {
  position: absolute;
  z-index: 14;
  right: 30px;
  bottom: 30px;
  display: block;
}
.lottery-background-counter {
  position: absolute;
  z-index: 14;
  left: 30px;
  bottom: 199px;
}
</style>
