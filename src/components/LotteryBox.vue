<template>
  <div class="lottery-box">
    <slot></slot>
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
  padding: 115px 125px 115px 205px;
  background-image: url('~@/assets/lottery-box.png');
}
</style>
