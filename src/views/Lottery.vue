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
    <div class="lottery-main" :class="[currentInstrumentName]">
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

      <!-- 处刑按钮 -->
      <execute-button
        class="lottery-main-execute-button"
        @execute-through="handleExecuteThrough"
        @execute-half="handleExecuteHalf"
      ></execute-button>

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

        <!-- 刑具 -->
        <template #instruments>
          <div class="lottery-instrument-list">
            <div
              class="lottery-instrument-item"
              v-for="item in instruments"
              :key="item.id"
            >
              <img
                :src="item.url"
                :alt="item.alt"
                :title="item.alt"
                class="lottery-instrument-img"
                :class="{ active: item.active }"
                @click="handleSelectInstrument(item)"
              />
            </div>
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
                :can-kill="isSelectAnyInstrument && canKill"
                @kill-fail="handleKillFail()"
                @kill="handleKill(u)"
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

            <el-checkbox
              class="lottery-main-login-auto"
              v-model="login.autoLogin"
              >7天内免登录</el-checkbox
            >

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
      <task-box
        class="lottery-main-done-list"
        title="舰长头像-已完成"
        :counter="`${tasks.done_list.length}/${tasks.done_list.length + tasks.undone_list.length}`"
        :list="tasks.done_list"
      ></task-box>

      <task-box
        class="lottery-main-undone-list"
        title="舰长头像-未完成"
        :counter="`${tasks.undone_list.length}/${tasks.done_list.length + tasks.undone_list.length}`"
        :list="tasks.undone_list"
      ></task-box>

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
import ExecuteButton from '@/components/ExecuteButton'
import * as api from '@/api'
import { mapMutations, mapActions } from 'vuex'
import { modifyUserIconWithProxy } from '@/util'
import { now, nextWeek } from '@/util'
import { zhCN as lang } from '@/lang'
import instrumentPliersIcon from '@/assets/cursors/instruments-pliers.png'
import instrumentCatIcon from '@/assets/cursors/instruments-cat.png'

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
    StartStopButton,
    ExecuteButton
  },
  data() {
    return {
      // 是否已经登录 控制显示登录页或者应用页
      isLogin: false,
      // 登录页面的登录按钮前面是否出现加载动效
      loginLoading: false,
      // 组件内全局定时器
      timer: null,
      // 抽奖配置
      config: {
        // 0=普通 1=头像
        lotteryPattern: 1,
        // 抽奖人数
        championNumber: 2,
        // 参与指令
        attendKeyword: '',
        // 粉丝牌等级要求
        medalLevel: 21
      },

      // 在登录页面输入的用户名和密码
      login: {
        username: '',
        password: '',
        autoLogin: false // 仅仅表示选择框是否为真
      },
      // 是否要执行自动登录程序
      runAutoLogin: false, // 控制逻辑 created时根据store状态确定是否为真

      // 所有的刑具
      instruments: [
        {
          id: 1,
          active: false,
          name: 'pliers',
          alt: '小钳钳',
          url: instrumentPliersIcon
        },
        {
          id: 2,
          active: false,
          name: 'cat',
          alt: '猫爪爪',
          url: instrumentCatIcon
        }
      ],

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
      // 是否正在鲨人（非重入锁）
      isExecuting: false,
      // 是否提示过ESC
      isShowedESC: false,
      /**
       * 当前参与抽奖的所有人的信息
       * @type {api.MemberInfo[]}
       */
      members: [],
      //舰长头像绘制进度
      tasks:{
        done_list: [],
        undone_list:[]
      }
    }
  },
  created() {
    window.addEventListener('keydown', this.handleKeyDown)
    this.loadLogin()
    this.login.username = this.$store.getters.username
    this.login.password = this.$store.getters.password

    // 保存的自动登录有效期还没过 那么执行自动登录
    if (now() < this.$store.getters.autoLogin) {
      this.runAutoLogin = true
      this.handleLogin()
    }

    // 加载舰长头像绘制进度
    this.loadTasks()
  },
  mounted() {
    this.setClock(1000)
    if (!this.runAutoLogin) {
      this.addMessage(lang.inputLoginTips)
    }
    this.addMessage(lang.scaleScreenTips)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyDown)
    this.clearClock()
  },
  computed: {
    // 是否人数较多而不显示人数
    isTooManyPeople() {
      return this.members.length > MAX_FULL_DISPLAY_PEOPLE_NUMBER
    },
    // 是否选中了任何一种刑具
    isSelectAnyInstrument() {
      return this.instruments.reduce((prev, it) => prev || it.active, false)
    },
    // 当前选择的刑具
    currentInstrument() {
      return this.instruments.find(it => it.active)
    },
    // 当前刑具的别名
    currentInstrumentName() {
      return this.currentInstrument ? this.currentInstrument.name : ''
    },
    // 是否可以鲨人
    canKill() {
      return (
        !this.isCatching && this.members.length > this.config.championNumber
      )
    }
  },
  methods: {
    ...mapMutations({
      setUsername: 'setUsername',
      setPassword: 'setPassword',
      setAutoLogin: 'setAutoLogin'
    }),
    ...mapActions({
      loadLogin: 'loadLogin',
      saveLogin: 'saveLogin'
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
      this.modifyMessageLoadingDots()

      // 获取抓人的所有人状态
      this.catchingCounter = (this.catchingCounter + 1) % DOT_COUNT_MOD
      if (this.catchingCounter === 0 && this.isCatching) {
        this.loadMembers()
      }
    },
    handleKeyDown(evt) {
      if (evt.keyCode === 27) {
        this.handleCancelInstrument()
      }
    },
    // 把最后一条消息修改点的个数
    modifyMessageLoadingDots() {
      this.messages.forEach(msg => {
        msg.loadingIterator = (msg.loadingIterator + 1) % DOT_COUNT_MOD
      })
    },
    // 上方的消息框添加一条消息 自动删除最上面的消息
    // loading为true时，消息会呈现加载中状态
    // 通过返回的message，将loading改为false时，加载状态会取消
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
        // 如果是created中触发的自动登录 则不修改登录有效期
        if (!this.runAutoLogin) {
          // 如果是手动登录的，根据是否勾选 更新自动登录有效期
          this.setAutoLogin(this.login.autoLogin ? nextWeek() : 0)
        }
        this.saveLogin()
        this.isLogin = true
        this.addMessage(lang.loginSuccessTips)
      } catch (err) {
        console.error('[Lottery/handleLogin]', err)
        this.addMessage(lang.loginFailedTips(err))
      }
      this.loginLoading = false
    },
    // 开始 用户点击开始按钮时调用
    async handleStart() {
      try {
        this.handleCancelInstrument()
        this.addMessage(
          lang.pressStartTips1(
            this.config.attendKeyword,
            this.config.medalLevel
          )
        )
        const messgge = this.addMessage(lang.pressStartTips2, true)
        await api.startProcess(
          this.config.attendKeyword,
          this.config.medalLevel
        )
        messgge.loading = false
        this.addMessage(lang.pressStartTips3, true)

        // 设置开始抓人状态为真 此时开始loadMembers函数会被定时调用
        this.isCatching = true
      } catch (err) {
        console.error('[Lottery/handleStart]', err)
        this.addMessage(lang.startFailedTips(err))
      }
    },
    // 结束 用户点击结束按钮时调用
    async handleStop() {
      try {
        this.stopAllMessageLoading()
        const message = this.addMessage(lang.pressStopTips1, true)
        await api.stopProcess()
        message.loading = false
        this.addMessage(lang.pressStopTips2)

        // 此时将不会继续查人
        this.isCatching = false
        //结束抓取后刷新舰长列表
        this.loadTasks()
      } catch (err) {
        console.error('[Lottery/handleStop]', err)
        this.addMessage(lang.stopFailedTips(err))
      }
    },

    // 读取参与名单
    async loadMembers() {
      try {
        const members = await api.getLotteryMemberList()
        this.members = modifyUserIconWithProxy(members)
      } catch (err) {
        console.error('[Lottery/loadMembers]', err)
        this.addMessage(lang.loadMembersFailedTips(err))
      }
    },

    // 检查能否开鲨
    checkExecute() {
      if (this.isExecuting) {
        this.addMessage(lang.repeatExecutingTips)
        return false
      }
      if (this.isCatching) {
        this.addMessage(lang.executingBeforeStopTips)
        return false
      }
      if (this.members.length <= this.config.championNumber) {
        this.addMessage(lang.executingBeforeEnoughMembersTips)
        return false
      }
      return true
    },

    // 鲨完
    async handleExecuteThrough() {
      if (!this.checkExecute()) {
        return
      }
      this.isExecuting = true
      try {
        const { lotteryPattern, championNumber } = this.config
        const idList = this.members
          .filter(it => it.lottery_status === 0) // 只保留没中过奖 粉丝牌子等级足够的 该过程后端重复过 这里可以节约网络带宽
          .map(it => ({ uid: it.uid })) // 每个元素仅保留id 节约带宽

        // 调用后端接口 鲨掉除了最后剩下的人以外的所有人
        // 调用接口主要是为了解决前端没有头像的问题
        const members = await api.processBattle(
          lotteryPattern,
          championNumber,
          idList
        )
        this.members = modifyUserIconWithProxy(members)
      } catch (err) {
        console.error('[Lottery/handleExecuteThrough]', err)
        this.addMessage(lang.executeThroughFailedTips(err))
      }
      this.isExecuting = false
    },
    // 鲨一半
    async handleExecuteHalf() {
      if (!this.checkExecute()) {
        return
      }
      this.isExecuting = true
      try {
        const { lotteryPattern, championNumber } = this.config
        const idList = this.members
          .filter(it => it.lottery_status === 0) // 只保留没中过奖 粉丝牌子等级足够的 该过程后端重复过 这里可以节约网络带宽
          .map(it => ({ uid: it.uid })) // 每个元素仅保留id 节约带宽

        // 调用后端接口 鲨掉除了最后剩下的人以外的所有人
        // 调用接口主要是为了解决前端没有头像的问题
        const members = await api.processBattle(
          lotteryPattern,
          Math.max(championNumber, Math.floor(idList.length / 2)), // 鲨到只剩一半 但至少留最后剩余个数那么多个
          idList
        )
        this.members = modifyUserIconWithProxy(members)
      } catch (err) {
        console.error('[Lottery/handleExecuteHalf]', err)
        this.addMessage(lang.executeHalfFailedTips(err))
      }
      this.isExecuting = false
    },
    // 选中一个刑具
    handleSelectInstrument(instrument) {
      if (this.isCatching) {
        this.addMessage(lang.selectInstrumentWhileExecutingTips)
        return
      }
      this.instruments.forEach(it => {
        it.active = it.id === instrument.id
      })
      if (!this.isShowedESC) {
        this.isShowedESC = true
        this.addMessage(lang.selectInstrumentTips)
      }
    },
    // 取消选择刑具
    handleCancelInstrument() {
      this.instruments.forEach(it => {
        it.active = false
      })
    },
    // 并没法处刑的时候
    handleKillFail() {
      if (this.isSelectAnyInstrument) {
        if (this.isCatching) {
          this.addMessage(lang.executingWhileCatchingTips)
        } else if (this.members.length <= this.config.championNumber) {
          this.addMessage(lang.executingWhilePeopleNotEnough)
        }
      }
    },
    // 手动鲨人
    handleKill(u) {
      this.addMessage(lang.executingTips(u, this.currentInstrument))
      this.members = this.members.filter(it => it.uid !== u.uid)
    },
    // 加载舰团头像绘制进度
    async loadTasks() {
      try{
        const tasks = await api.getMemberSchedule()
        this.tasks = tasks
      }catch (err) {
        console.error('[Lottery/handleStart]', err)
        this.addMessage(lang.startFailedTips(err))
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
  top: calc((100vh - 846px) / 2 - 50px);
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
.lottery-main-login-auto {
  margin-bottom: 10px;
}

.lottery-main-action-button {
  position: absolute;
  z-index: 104;
  left: calc(50vw - 807px);
  top: calc(50vh - 200px);
}
.lottery-main-execute-button {
  position: absolute;
  z-index: 104;
  left: calc(50vw - 800px);
  top: calc(50vh + 60px);
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
  grid-template-rows: repeat(20, 38px);
}

.lottery-main.pliers {
  cursor: url('~@/assets/cursors/instruments-pliers.ico'),
    url('~@/assets/cursors/instruments-pliers.cur'),
    url('~@/assets/cursors/instruments-pliers.png'), auto;
}
.lottery-main.cat {
  cursor: url('~@/assets/cursors/instruments-cat.ico'),
    url('~@/assets/cursors/instruments-cat.cur'),
    url('~@/assets/cursors/instruments-cat.png'), auto;
}
.lottery-instrument-list {
  display: flex;
  flex-direction: row;
}
.lottery-instrument-item {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.lottery-instrument-img.active {
  display: none;
  max-width: 40px;
  max-height: 40px;
}
.lottery-instrument-img {
  max-width: 40px;
  max-height: 40px;
  cursor: pointer;
  transition: transform 0.2s;
}
.lottery-instrument-img:hover {
  transform: scale(1.15);
}
.lottery-instrument-img.active {
  display: none;
}
</style>
