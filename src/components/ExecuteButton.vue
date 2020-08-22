<template>
  <div class="execute-button">
    <div class="execute-button-through" @click="$emit('execute-through')"></div>
    <div class="execute-button-half" @click="$emit('execute-half')"></div>
  </div>
</template>

<script>
export default {
  name: 'ExecuteButton'
}
</script>

<style>
.execute-button {
  display: flex;
  width: 214px;
  height: 204px;
}
.execute-button-through {
  height: 184px;
  width: 92px;
  border-radius: 92px 0 0 92px;
  background-color: #fff;
  box-shadow: 20px 20px 0 #e65c1080;
  background-image: url('~@/assets/execute-through.png');
  background-repeat: no-repeat;
  background-position: 100% 50%;
}
.execute-button-half {
  margin-left: 10px;
  height: 184px;
  width: 92px;
  border-radius: 0 92px 92px 0;
  background-color: #fff;
  box-shadow: 20px 20px 0 #e65c1080;
  background-image: url('~@/assets/execute-half.png');
  background-repeat: no-repeat;
  background-position: 0 50%;
}
.execute-button-half,
.execute-button-through {
  cursor: pointer;
  transition: transform 0.2s;
  transform: scale(1);
}
.execute-button-half:hover,
.execute-button-through:hover {
  transform: scale(1.1);
}
</style>
