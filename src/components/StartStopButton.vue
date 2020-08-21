<template>
  <div
    class="start-stop-button"
    :class="{ active: status }"
    @click="handleClick"
  >
    <img class="start-button-img" src="@/assets/start-button.png" alt="" />
    <img class="stop-button-img" src="@/assets/stop-button.png" alt="" />
  </div>
</template>

<script>
export default {
  name: 'StartStopButton',
  data() {
    return {
      status: false
    }
  },
  methods: {
    handleClick() {
      if (this.status) {
        this.$emit('stop')
      } else {
        this.$emit('start')
      }
      this.status = !this.status
    }
  }
}
</script>

<style>
.start-stop-button {
  position: relative;
  z-index: 110;
  width: 220px;
  height: 220px;
  cursor: pointer;
}
.start-button-img,
.stop-button-img {
  display: block;
  position: absolute;
  z-index: 111;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  transition: transform 0.4s cubic-bezier(0.57, 1.49, 0.59, 1.49);
}
.stop-button-img {
  z-index: 110;
  transform: scale(0);
}

.start-stop-button.active .start-button-img {
  z-index: 110;
  transform: scale(0);
}
.start-stop-button.active .stop-button-img {
  z-index: 111;
  transform: scale(1);
}
</style>
