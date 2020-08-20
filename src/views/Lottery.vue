<template>
  <div class="lottery">
    <!-- 页面背景 -->
    <lottery-background>
      <!-- 剩余人数计数器 -->
      <div class="lottery-people-counter">
        <span class="lottery-people-counter-text">999</span>
      </div>
    </lottery-background>

    <div class="lottery-main">
      <span class="lottery-main-command-display"
        ><b>参与指令</b>: {{ config.attendKeyword }}</span
      >
      <lottery-box class="lottery-main-lottery">
        <!-- 登录成功后的页面 -->
        <div v-if="isLogin">
          <p>欢迎使用桃抽奖</p>
        </div>

        <!-- 登录页面 -->
        <div v-else>
          <el-input
            type="primary"
            v-model="login.username"
            placeholder="用户名"
          ></el-input>
          <el-input
            type="primary"
            v-model="login.password"
            placeholder="密码"
          ></el-input>

          <el-button type="primary" @click="handleLogin" :loading="loginLoading"
            >登录</el-button
          >
        </div>
      </lottery-box>

      <task-box class="lottery-main-done-list"></task-box>
      <task-box class="lottery-main-undone-list"></task-box>

      <!-- 左侧的配置框 -->
      <config-box class="lottery-main-config">
        <config-control v-model="config"></config-control>
      </config-box>
    </div>
  </div>
</template>

<script>
import LotteryBackground from '@/components/LotteryBackground'
import TaskBox from '@/components/TaskBox'
import ConfigBox from '@/components/ConfigBox'
import LotteryBox from '@/components/LotteryBox'
import ConfigControl from '@/components/ConfigControl'
import * as api from '@/api'
import { mapMutations } from 'vuex'

export default {
  name: 'Lottery',
  components: {
    LotteryBackground,
    TaskBox,
    ConfigBox,
    LotteryBox,
    ConfigControl
  },
  data() {
    return {
      isLogin: false,
      loginLoading: false,
      config: {
        lotteryPattern: 1,
        championNumber: 8,
        attendKeyword: 'Echo',
        medalLevel: 5
      },
      login: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapMutations({
      setUsername: 'setUsername',
      setPassword: 'setPassword'
    }),
    async handleLogin() {
      this.loginLoading = true
      try {
        const { username, password } = this.login
        await api.login(username, password)
        this.setUsername(username)
        this.setPassword(password)
        this.isLogin = true
        this.$message.success('登录成功')
      } catch (err) {
        console.error('[Lottery/handleLoine]', err)
        this.$message.error('登录失败: ' + err.message)
      }
      this.loginLoading = false
    }
  }
}
</script>

<style>
.lottery {
  position: relative;
}
.lottery-people-counter {
  box-sizing: border-box;
  width: 170px;
  height: 220px;
  padding-top: 100px;
  text-align: center;
  background-image: url('~@/assets/echo-counter.png');
}
.lottery-people-counter-text {
  color: #fff;
  font-size: 40px;
  font-family: 'zhscnmt';
}
.lottery-main {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
}

.lottery-main-lottery {
  position: absolute;
  z-index: 101;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  color: #fff;
}
.lottery-main-done-list {
  position: absolute;
  z-index: 102;
  left: calc(50vw + 446px);
  top: calc(50vh - 353px);
}
.lottery-main-undone-list {
  position: absolute;
  z-index: 102;
  left: calc(50vw + 536px);
  top: calc(50vh);
}
.lottery-main-config {
  position: absolute;
  z-index: 103;
  left: calc(50vw - 781px);
  top: calc(50vh - 305px);
}
.lottery-main-command-display {
  position: absolute;
  z-index: 101;
  left: calc((100vw - 1028px) / 2);
  top: calc((100vh - 828px) / 2 - 50px);
  font-family: 'zhscnmt';
  font-size: 40px;
}
</style>
