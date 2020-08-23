/**
 * 把URL转成代理后的URL
 * @param {string} url B站头像URL
 * @returns {string} 代理后的URL
 */
export function changeBilibiliImageToProxy(url) {
  if (!url) {
    return url
  }
  const groups = /^https?:\/\/(i\d)\.hdslb.com\/(.*)/.exec(url)
  if (groups) {
    const domain = groups[1]
    const path = groups[2]
    return `/hdslb-${domain}/${path}`
  } else {
    console.warn('[Proxy] url 无法识别: ', url)
    return url
  }
}

/**
 * 给定member数组 把其中所有的头像更改为代理地址
 * @param {MemberInfo[]} members 输入
 * @returns {MemberInfo[]} 输出
 */
export function modifyUserIconWithProxy(members) {
  if (members) {
    // 有内容的时候 把每一个的user_icon换成代理后的
    return members.map(item => {
      return {
        ...item,
        user_icon: changeBilibiliImageToProxy(item.user_icon)
      }
    })
  } else {
    // 内容为空的时候 后端返回null而不是空列表
    return []
  }
}
