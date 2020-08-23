<template>
  <div class="lottery-box">
    <div class="lottery-box-message">
      <slot name="message"></slot>
    </div>

    <div class="lottery-box-main">
      <slot></slot>
    </div>

    <div class="lottery-box-instruments">
      <slot name="instruments"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LotteryBox'
}
</script>

<style>
.lottery-box {
  position: relative;
  box-sizing: border-box;
  width: 1028px;
  height: 846px;
  padding: 80px 111px 119px 196px;
  background-image: url('~@/assets/lottery-box.png');
}
.lottery-box-message {
  box-sizing: border-box;
  width: 723px;
  height: 121px;
  padding: 33px 3px 3px 3px;
}
.lottery-box-main {
  box-sizing: border-box;
  width: 723px;
  height: 529px;
  padding: 62px 26px 42px 36px; /* 右边框宽度16px可以用来放滚动条 */
}
.lottery-box-instruments {
  position: absolute;
  top: 755px;
  left: 320px;
  width: 480px;
  height: 40px;
}
</style>
