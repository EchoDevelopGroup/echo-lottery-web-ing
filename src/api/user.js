import request from './request'

/**
 * 用户登录验证
 * @param {string} userName 用户名
 * @param {string} userPassword 密码
 */
export function login(userName, userPassword) {
  return request({
    url: '/user/authority',
    method: 'post',
    data: {
      user_name: userName,
      user_password: userPassword
    }
  })
}
