<template>
  <div class="lottery-box">
    <div class="lottery-box-message">
      <slot name="message"></slot>
    </div>

    <div class="lottery-box-main">
      <slot></slot>
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
  box-sizing: border-box;
  width: 1028px;
  height: 828px;
  padding: 80px 111px 101px 196px;
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
  height: 504px;
  padding: 63px 26px 40px 36px; /* 右边框宽度16px可以用来放滚动条 */
}
</style>
