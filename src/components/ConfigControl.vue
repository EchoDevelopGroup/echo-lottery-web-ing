<template>
  <div class="config-control">
    <span class="config-control-label">模式选择</span>
    <div></div>
    <div>
      <el-switch
        v-model="isAvatarMode"
        active-text="头像"
        inactive-text="普通"
      />
    </div>

    <span class="config-control-label">中奖人数</span>
    <div></div>
    <div>
      <el-input-number
        v-model="championNumber"
        controls-position="right"
        size="small"
      ></el-input-number>
    </div>

    <span class="config-control-label">参与指令</span>
    <div></div>
    <div>
      <el-input v-model="attendKeyword" size="small"></el-input>
    </div>

    <span class="config-control-label">粉丝勋章</span>
    <div>&ge;</div>
    <div>
      <el-input-number
        v-model="medalLevel"
        controls-position="right"
        size="small"
      ></el-input-number>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfigControl',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isAvatarMode: true,
      championNumber: 8,
      attendKeyword: 'Echo',
      medalLevel: 5
    }
  },
  computed: {
    form() {
      return {
        lotteryPattern: this.isAvatarMode ? 1 : 0,
        championNumber: this.championNumber,
        attendKeyword: this.attendKeyword,
        medalLevel: this.medalLevel
      }
    }
  },
  watch: {
    form: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    },
    value() {
      this.loadFromValue()
    }
  },
  created() {
    this.loadFromValue()
  },
  methods: {
    loadFromValue() {
      this.isAvatarMode = !!this.value.lotteryPattern
      this.championNumber = this.value.championNumber
      this.attendKeyword = this.value.attendKeyword
      this.medalLevel = this.value.medalLevel
    }
  }
}
</script>

<style>
.config-control {
  display: grid;
  grid-template-columns: 100px 25px 1fr;
  grid-template-rows: repeat(4, 50px);
  align-items: center;
  color: #ef5594;
  font-size: 1.4em;
}
.config-control-label {
  /* height: 50px; */
}
</style>
