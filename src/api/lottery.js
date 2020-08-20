import request from './request'

/**
 * @typedef MemberInfo
 * @property {string} uid 用户ID
 * @property {string} user_name 用户名
 * @property {string} user_icon 用户头像
 * @property {number} lottery_status 抽奖资格 0=有资格 1=曾中奖 2=粉丝牌等级等级不够
 */

/**
 * @typedef MemberInfoCommit
 * @property {string} uid 用户ID
 */

/**
 * @typedef MemberInfoShort
 * @property {string} uid 用户ID
 * @property {string} user_name 用户名
 * @property {string} user_icon 用户头像
 */

/**
 * @typedef MemberScheduleResponse
 * @property {MemberInfoShort[]} done_list 已完成列表
 * @property {MemberInfoShort[]} undone_list 未完成列表
 */

/**
 * 返回当前时间的秒级时间戳
 */
function now() {
  return Math.floor(new Date().getTime() / 1000)
}

/**
 * 开始弹幕抽奖
 * @param {string} attendKeyword 抽奖弹幕
 * @param {number} medalLevel 粉丝牌等级
 */
export function startProcess(attendKeyword, medalLevel) {
  return request({
    url: '/lottery/start',
    method: 'post',
    data: {
      timestamp: now(),
      keyword: attendKeyword,
      medal_level: medalLevel
    },
    auth: true
  })
}

/**
 * 停止弹幕抽奖
 */
export function stopProcess() {
  return request({
    url: '/lottery/stop',
    method: 'post',
    data: {
      timestamp: now()
    },
    auth: true
  })
}

/**
 * 获取抽奖参与者名单
 * @return {Promise<MemberInfo[]>}
 */
export function getLotteryMemberList() {
  return request({
    url: '/lottery/member/list',
    method: 'get'
  })
}

/**
 * 执行开奖过程(大逃杀)
 * @param {number} lotteryPattern 抽奖模式 0=普通 1=头像
 * @param {number} championNumber 存活个数
 * @param {MemberInfoCommit[]} acceptableMemberList 从这些人里面筛
 */
export function processBattle(
  lotteryPattern,
  championNumber,
  acceptableMemberList
) {
  return request({
    url: '/lottery/start',
    method: 'post',
    data: {
      lottery_pattern: lotteryPattern,
      champion_num: championNumber,
      member_data: acceptableMemberList
    },
    auth: true
  })
}

/**
 * 提交已画完的头像的人的信息
 * @param {MemberInfoCommit[]} finishedMemberList 这些人的头像画完了
 */
export function commitMemberSchedule(finishedMemberList) {
  return request({
    url: '/lottery/valhalla/commit',
    method: 'post',
    data: {
      member_data: finishedMemberList
    },
    auth: true
  })
}

/**
 * 获取舰长头像完成进度
 * @returns {Promise<MemberScheduleResponse>}
 */
export function getMemberSchedule() {
  return request({
    url: '/lottery/member/schedule',
    method: 'get'
  })
}
