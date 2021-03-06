import axios from 'axios'

// 创建axios实例
const _axios = axios.create({
  baseURL: '/echo-api' // api的base_url
})

_axios.auth = {
  getter: null,
  get username() {
    return this.getter ? this.getter.username : ''
  },
  get password() {
    return this.getter ? this.getter.password : ''
  }
}

// request拦截器 用于添加身份验证信息
_axios.interceptors.request.use(
  config => {
    if (config.auth) {
      config.admin_name = _axios.auth.username
      config.admin_password = _axios.auth.password
    }
  },
  error => {
    return Promise.reject(error)
  }
)

// response拦截器==>处理后端返回相应
_axios.interceptors.response.use(
  response => {
    if (response) {
      if (response.data) {
        const data = response.data
        if (data.code === 0) {
          return data.data
        } else {
          return Promise.reject(new Error(data.message))
        }
      } else {
        return Promise.reject(new Error('网络异常'))
      }
    } else {
      return Promise.reject(new Error('运行时异常'))
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default _axios
