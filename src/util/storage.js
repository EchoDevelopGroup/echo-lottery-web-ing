export const canLocalStorage = typeof window.localStorage !== 'undefined'

/**
 * 指定键名 返回该键名对应的LocalStorage封装
 * 调用has返回键值是否存在
 * 调用get返回本地存储的JSON
 * 调用set设置本地存储的JSON
 * @param {string} key 键名
 */
export function makeLocalStorage(key) {
  const fetch = () => localStorage.getItem(key)
  const remove = () => localStorage.removeItem(key)
  const write = value => localStorage.setItem(key, value)
  return {
    /**
     * 检查是否有本地存储
     */
    has() {
      if (!canLocalStorage) {
        return false
      }
      const v = fetch()
      return typeof v === 'string'
    },
    /**
     * 获取本地存储
     * @returns {object|null}
     */
    get() {
      if (!canLocalStorage) {
        return null
      }
      const v = fetch()
      if (typeof v === 'string') {
        try {
          const d = JSON.parse(v)
          return d
        } catch (err) {
          console.log('[Storage]' + key + ' is no json, removed')
          try {
            remove()
          } catch (err) {
            console.log('[Storage]' + key + ' remove failed, ignore')
          }
        }
      }
      return null
    },
    /**
     * 设置本地存储
     * @param {*} d 数据
     */
    set(d) {
      if (!canLocalStorage) {
        return
      }
      try {
        const v = JSON.stringify(d)
        write(v)
      } catch (err) {
        console.log('[Storage]' + key + ' write failed, ignore')
      }
    }
  }
}
