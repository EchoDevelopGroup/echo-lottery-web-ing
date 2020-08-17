import request from './request'

/**
 * @typedef MemberInfo
 * @property {string} uid 用户ID
 * @property {string} user_name 用户名
 * @property {string} user_icon 用户头像
 * @property {number} lottery_status 抽奖资格 0=有资格 1=曾中奖 2=粉丝牌等级等级不够
 */

/**
 * @typedef MemberInfoShort
 * @property {string} uid 用户ID
 */

/**
 * 返回当前时间的秒级时间戳
 */
function now() {
  return Math.floor(new Date().getTime() / 1000)
}

/**
 * 开始弹幕抽奖
 * @param {string} keyword 抽奖弹幕
 * @param {number} medalLevel 粉丝牌等级
 */
export function startProcess(keyword, medalLevel) {
  return request({
    url: '/lottery/start',
    method: 'post',
    data: {
      timestamp: now(),
      keyword,
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
 */
export function getLotteryMemberList() {
  return request({
    url: '/lottery/member/list',
    method: 'get'
  })
}

/**
 * 执行开奖过程(大逃杀)
 * @param {number} championNum 存活个数
 * @param {MemberInfoShort[]} acceptableMemberList 从这些人里面筛
 */
export function processBattle(championNum, acceptableMemberList) {
  return request({
    url: '/lottery/start',
    method: 'post',
    data: {
      champion_num: championNum,
      member_data: acceptableMemberList
    },
    auth: true
  })
}

/**
 * 提交已画完的头像的人的信息
 * @param {MemberInfoShort[]} finishedMemberList 这些人的头像画完了
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
 */
export function getMemberSchedule() {
  return request({
    url: '/lottery/member/schedule',
    method: 'get'
  })
}
