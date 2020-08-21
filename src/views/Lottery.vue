<template>
  <div class="lottery">
    <!-- 页面背景 -->
    <lottery-background>
      <!-- 剩余人数计数器 -->
      <div class="lottery-people-counter">
        <span class="lottery-people-counter-text">999</span>
      </div>
    </lottery-background>

    <!-- 全局居中的主题框 -->
    <div class="lottery-main">
      <!-- 中心框上方的参与指令 -->
      <span class="lottery-main-command-display"
        ><b>参与指令</b>: {{ config.attendKeyword }}</span
      >

      <!-- 左侧的开始停止按钮 -->
      <start-stop-button
        class="lottery-main-action-button"
        @start="handleStart"
        @stop="handleStop"
      ></start-stop-button>

      <!-- 中心框和其内部 -->
      <lottery-box class="lottery-main-lottery">
        <!-- 顶部的消息框 黑色部分 -->
        <template #message>
          <div class="lottery-main-message">
            <p>sss</p>
            <p>sss</p>
            <p>sss</p>
          </div>
        </template>

        <!-- 底部的粉色框 显示人员信息 -->
        <template #default>
          <!-- 登录成功后的页面 -->
          <div v-if="isLogin">
            <ul class="lottery-main-users">
              <user-item></user-item>
              <user-item></user-item>
              <user-item></user-item>
              <user-item></user-item>
              <user-item></user-item>
              <user-item></user-item>
              <user-item></user-item>
              <user-item></user-item>
            </ul>
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

            <el-button
              type="primary"
              @click="handleLogin"
              :loading="loginLoading"
              >登录</el-button
            >
          </div>
        </template>
      </lottery-box>

      <!-- 右侧的两个人框 -->
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
import UserItem from '@/components/UserItem'
import StartStopButton from '@/components/StartStopButton'
import * as api from '@/api'
import { mapMutations } from 'vuex'

export default {
  name: 'Lottery',
  components: {
    LotteryBackground,
    TaskBox,
    ConfigBox,
    LotteryBox,
    ConfigControl,
    UserItem,
    StartStopButton
  },
  data() {
    return {
      isLogin: true,
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
    // 登录
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
    },
    // 开始
    handleStart() {
      console.log('start')
    },
    // 结束
    handleStop() {
      console.log('stop')
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
  top: calc(50vh - 485px);
}
.lottery-main-command-display {
  position: absolute;
  z-index: 101;
  left: calc((100vw - 1028px) / 2 + 80px);
  top: calc((100vh - 828px) / 2 - 50px);
  font-family: 'zhscnmt', 'Helvetica Neue', Helvetica, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  font-size: 40px;
}

.lottery-main-action-button {
  position: absolute;
  z-index: 104;
  left: calc(50vw - 807px);
  top: calc(50vh - 200px);
}

.lottery-main-message {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  padding: 8px;
}

.lottery-main-users {
  height: 400px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 15px;
}
</style>
