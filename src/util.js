/**
 * 从后往前找首个不是neddle的字符的位置
 * @param {string} str 被查找字符串
 * @param {string} needle 被查找的字符
 */
export function lastCharBegins(str, needle) {
  for (let i = str.length - 1; i >= 0; i--) {
    if (str.charAt(i) != needle) {
      return i
    }
  }
  return -1
}

/**
 * 检查字符串末尾含有多少个needle
 * @param {string} str 被查找字符串
 * @param {string} needle 被查找的字符
 */
export function lastCharLength(str, needle) {
  return str.length - lastCharBegins(str, needle)
}

/**
 * 移除字符末尾的若干个needle
 * @param {string} str 被查找字符串
 * @param {string} needle 被查找的字符
 */
export function removeLastChars(str, needle) {
  return str.substr(0, str.length - lastCharLength(str, needle))
}

/**
 * 根据当前末尾needle个数修改字符串
 * @param {string} str 被查找字符串
 * @param {string} needle 被查找的字符
 * @param {number} mod 循环长
 * @param {number} offset 个数偏移
 */
export function iterateModifyNeedleCount(str, needle, mod, offset) {
  const lastLen = lastCharLength(str, needle) - offset
  const newLen = ((lastLen + 1) % mod) + offset
  return removeLastChars(str, needle) + needle.repeat(newLen)
}
