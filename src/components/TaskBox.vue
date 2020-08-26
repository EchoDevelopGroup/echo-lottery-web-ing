<template>
  <div class="task-box">
    <!-- 左上角的人数计数 -->
    <span class="task-box-counter">{{ counter }}</span>
    <!-- 右上角的标题 -->
    <span class="task-box-title">{{ title }}</span>

    <!-- 中间的人物显示区 -->
    <div class="task-box-main">
      <!-- <slot></slot>-->
      <ul class="task-box-main-list">
        <li
          v-for="(item, index) in list"
          :key="item.uid"
          :class="
            index % 2 === 0
              ? 'task-box-main-list-item-even'
              : 'task-box-main-list-item-odd'
          "
        >
          {{ item.user_name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskBox',
  props: {
    counter: {
      type: String,
      default: '0/0'
    },
    title: {
      type: String,
      default: '舰长头像'
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
}
</script>

<style>
.task-box {
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

  /* 滚动显示舰长 */
  overflow-y: scroll;
}
.task-box-main-list li {
  /* 花鸡设计的原尺寸傻大傻大的 改一下 */
  /*  height: 40px;
    line-height: 40px;
    font-size: 29px;*/
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  font-size: 20px;
  font-family: "Microsoft YaHei";
}
.task-box-main-list-item-odd {
  background: #ffb0d0;
}
.task-box-main-list-item-even {
  background: #ff80b3;
}
</style>
