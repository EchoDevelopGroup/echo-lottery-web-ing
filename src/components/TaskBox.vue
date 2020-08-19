<template>
  <div class="task-box">
    <!-- 左上角的人数计数 -->
    <span class="task-box-counter">10/189</span>
    <!-- 右上角的标题 -->
    <span class="task-box-title">舰长头像-已完成</span>

    <!-- 中间的人物显示区 -->
    <div class="task-box-main"></div>
  </div>
</template>

<script>
export default {
  name: 'TaskBox'
}
</script>

<style>
.task-box {
  position: relative;
  width: 492px;
  height: 317px;
  background-image: url('~@/assets/task-box.png');
}
.task-box-counter {
  position: absolute;
  left: 25px;
  top: 20px;
  font-size: 26px;
  font-family: 'firasans';
}
.task-box-title {
  position: absolute;
  left: 230px;
  top: 20px;
  font-size: 26px;
  font-family: 'zhscnmt';
}
.task-box-main {
  position: absolute;
  left: 25px;
  top: 65px;
  width: 400px;
  height: 210px;
  background-color: #ffb0d0;
}
</style>
