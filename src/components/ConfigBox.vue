<template>
  <div class="config-box">
    <slot>
      <p>无内容</p>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'ConfigBox'
}
</script>

<style>
.config-box {
  box-sizing: border-box;
  width: 322px;
  height: 269px;
  padding: 40px 40px 40px 20px;
  background-image: url('~@/assets/config-box.png');
}
</style>
