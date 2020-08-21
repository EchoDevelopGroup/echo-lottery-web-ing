<template>
  <div class="lottery">
    <!-- 页面背景 -->
    <lottery-background>
      <!-- 剩余人数计数器 -->
      <div class="lottery-people-counter">
        <span class="lottery-people-counter-text">{{ members.length }}</span>
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
            <p v-for="msg in messages" :key="msg.id">
              {{ getMessageText(msg) }}
            </p>
          </div>
        </template>

        <!-- 底部的粉色框 显示人员信息 -->
        <template #default>
          <!-- 登录成功后的页面 -->
          <div v-if="isLogin">
            <ul class="lottery-main-users" :class="{ small: isTooManyPeople }">
              <user-item
                v-for="u in members"
                :key="u.uid"
                :name="u.user_name"
                :avatar="u.user_icon"
                :size="isTooManyPeople ? 'small' : 'normal'"
              />
            </ul>
          </div>

          <!-- 登录页面 -->
          <div v-else class="lottery-main-login-view">
            <el-input
              class="lottery-main-login-username"
              type="primary"
              v-model="login.username"
              placeholder="用户名"
            ></el-input>
            <el-input
              class="lottery-main-login-password"
              type="password"
              v-model="login.password"
              placeholder="密码"
            ></el-input>

            <el-button
              class="lottery-main-login-button"
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
import { changeBilibiliImageToProxy } from '@/util'

// 消息加载状态下最多几个点
const DOT_COUNT_MOD = 3
// 最多显示几个消息
const MAX_MESSAGE_DISPLAY = 3
// 多于多少个人显示较小的视图 参数必须和后端匹配
const MAX_FULL_DISPLAY_PEOPLE_NUMBER = 8

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
      // 是否已经登录 控制显示登录页或者应用页
      isLogin: true,
      // 登录页面的登录按钮前面是否出现加载动效
      loginLoading: false,
      // 组件内全局定时器
      timer: null,
      // 抽奖配置
      config: {
        // 0=普通 1=头像
        lotteryPattern: 1,
        // 抽奖人数
        championNumber: 8,
        // 参与指令
        attendKeyword: 'Echo',
        // 粉丝牌等级要求
        medalLevel: 5
      },
      // 在登录页面输入的用户名和密码
      login: {
        username: '',
        password: ''
      },
      // 上方显示的所有消息
      messages: [],
      nextMessageId: 1,

      // 以下为抽奖核心逻辑状态
      // 是否正在抓人(从弹幕中抽人 加到列表中)
      isCatching: false,
      // 计数器 每clock一次加一 3个一循环 为0的时候再调用获取
      catchingCounter: 0,
      // 是否正在开奖
      isProcessing: false,
      /**
       * 当前参与抽奖的所有人的信息
       * @type {api.MemberInfo[]}
       */
      members: []
    }
  },
  created() {
    this.setClock(1000)
  },
  mounted() {
    this.addMessage('请在下方的输入框输入您的用户名和密码以登录')
  },
  beforeDestroy() {
    this.clearClock()
  },
  computed: {
    isTooManyPeople() {
      return this.members.length > MAX_FULL_DISPLAY_PEOPLE_NUMBER
    }
  },
  methods: {
    ...mapMutations({
      setUsername: 'setUsername',
      setPassword: 'setPassword'
    }),
    // 设置当前时钟 定时调用当前实例的clock方法
    setClock(delay) {
      this.clearClock()
      this.timer = setInterval(() => {
        this.clock()
      }, delay)
    },
    // 删除当前设的时钟
    clearClock() {
      if (this.timer !== null) {
        clearInterval(this.timer)
      }
    },
    // 定时时钟
    clock() {
      // 修改消息中点的个数
      if (this.loadingLastMessage) {
        this.modifyMessageLoadingDots()
      }

      // 获取抓人的所有人状态
      this.catchingCounter = (this.catchingCounter + 1) % DOT_COUNT_MOD
      if (this.catchingCounter === 0 && this.isCatching) {
        this.loadMembers()
      }
    },
    // 把最后一条消息修改点的个数
    modifyMessageLoadingDots() {
      this.messages.forEach(msg => {
        msg.loadingIterator = (msg.loadingIterator + 1) % DOT_COUNT_MOD
      })
    },
    // 上方的消息框添加一条消息 自动删除最上面的消息
    addMessage(text, loading = false) {
      const message = {
        id: this.nextMessageId,
        text,
        loading,
        loadingIterator: 0
      }
      this.nextMessageId++
      const messages = [...this.messages, message]
      this.messages = messages.slice(
        Math.max(0, messages.length - MAX_MESSAGE_DISPLAY)
      )
      return message
    },
    // 关闭所有消息的加载效果
    stopAllMessageLoading() {
      this.messages.forEach(msg => {
        msg.loading = false
      })
    },
    // 从消息中获取文本 带加载效果
    getMessageText(message) {
      if (message.loading) {
        return message.text + '.'.repeat(message.loadingIterator + 1)
      } else {
        return message.text
      }
    },
    // 登录
    async handleLogin() {
      this.loginLoading = true
      try {
        const { username, password } = this.login
        await api.login(username, password)
        this.setUsername(username)
        this.setPassword(password)
        this.isLogin = true
        // this.$message.success('登录成功')
        this.addMessage('登录成功！欢迎回来，黑桃影大小姐')
      } catch (err) {
        console.error('[Lottery/handleLoine]', err)
        // this.$message.error('登录失败: ' + err.message)
        this.addMessage('登录失败: ' + err.message)
      }
      this.loginLoading = false
    },
    // 开始 用户点击开始按钮时调用
    async handleStart() {
      try {
        this.addMessage(
          `只抓弹幕发送"${this.config.attendKeyword}"并且粉丝等级在${this.config.medalLevel}级或以上的人`
        )
        const messgge = this.addMessage('正在准备从弹幕中抓人', true)
        await api.startProcess(
          this.config.attendKeyword,
          this.config.medalLevel
        )
        messgge.loading = false
        this.addMessage('已经开始抓人...', true)

        // 设置开始抓人状态为真 此时开始loadMembers函数会被定时调用
        this.isCatching = true
      } catch (err) {
        console.error(err)
        this.addMessage('启动捕捉失败了，原因是: ' + err.message)
      }
    },
    // 结束 用户点击结束按钮时调用
    async handleStop() {
      try {
        this.stopAllMessageLoading()
        const message = this.addMessage('正在结束抓人', true)
        await api.stopProcess()
        message.loading = false
        this.addMessage('结束成功')
      } catch (err) {
        console.error(err)
        this.addMessage('结束捕捉失败了，原因是: ' + err.message)
      }
    },
    // 读取参与名单
    async loadMembers() {
      try {
        const members = await api.getLotteryMemberList()
        if (members) {
          this.members = members.map(item => {
            return {
              ...item,
              user_icon: changeBilibiliImageToProxy(item.user_icon)
            }
          })
        }
      } catch (err) {
        console.error(err)
        this.addMessage(
          '没能成功读取参与名单，原因时: ' + err.message + '，自动重试'
        )
      }
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

.lottery-main-login-view {
  box-sizing: border-box;
  height: 100%;
  padding: 12px 28px 12px 12px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
.lottery-main-login-username,
.lottery-main-login-password {
  width: 400px;
  margin-bottom: 20px;
}

.lottery-main-action-button {
  position: absolute;
  z-index: 104;
  left: calc(50vw - 807px);
  top: calc(50vh - 200px);
}

.lottery-main-message {
  overflow: hidden;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  padding: 8px;
}

.lottery-main-users {
  height: 400px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(4, 88px);
  row-gap: 15px;
}
.lottery-main-users.small {
  grid-template-rows: unset;
}
</style>
