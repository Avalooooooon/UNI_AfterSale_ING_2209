import axios from 'axios'
import {Message} from 'element-ui'
import cookie from 'js-cookie'

// 创建axios实例
const service = axios.create({
  baseURL: '/api',
  timeout: 5 * 1000
})

// http request 拦截器
service.interceptors.request.use(
  config => {
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // 使用Cookie获取token
    console.log(`[请求路径] ${location.pathname}`)
    if (cookie.get('token')) {
      Object.assign(config.params, {token: cookie.get('token')})
    } else {
      window.location.href = '/'
    }

    Object.assign(config.params, {bizid: 'uniwarm'})
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// http response 拦截器
service.interceptors.response.use(
  response => {
    response.headers['Access-Control-Allow-Origin'] = '*'
    // 响应体
    const resp = response.data
    // 响应状态码
    const code = parseInt(resp.res)

    // 如果响应状态码不等于0，则弹出错误原因
    if (code !== 0) {
      // 输出错误日志到控制台
      console.log('[warn] ' + response)
      /*
       * res 错误码
       *
       * 1-接口URL错误
       * 401-用户已存在，402-用户不存在，403-密码输入错误，404-用户名或密码错误，405-AR文件不存在
       * 406-该企业不存在，407-该广告不存在，408-已经收藏过该企业，409-企业首页不存在，410-该方法不存在
       * 411-该数据不存在，412-该文章不存在，413-用户未登录，414-参数不合法，418-上传图片失败
       * 420-权限不够，不是SVIP，421-点过赞了，422-还没有点过赞，424-正在审核，不能提交，425-bizid格式不对
       * 426-bizid格式不对，427-已经有该bizid了，请重新换一个bizid，429-没有可用视频号
       * 5-管理员账号登录超时，501-该项不存在，502-该项已存在，503-操作无效
       */
      switch (code) {
        // 管理员账号登录超时清除cookie,并跳转到登录页
        case 5:
          Message({
            message: resp.status,
            type: 'warning',
            duration: 5 * 1000
          })
          cookie.remove('token')
          cookie.replace('/login')
          return
        /*
       ====自定义弹出框的输出信息(如果需要则配置， 可以配置多个)====

      // 传入的参数有误
      case 414:
        console.log(resp)
        Message({
          message: '参数参数有误，请重试!',
          type: 'error',
          duration: 5 * 1000
        })
        return
       */
        case 402:
          console.log(resp)
          Message({
            message: resp.status,
            type: 'error',
            duration: 5 * 1000
          })
          window.location.href = '/login'
          return
        case 414:
          console.log(resp)
          Message({
            message: '参数有误，请重试!',
            type: 'error',
            duration: 5 * 1000
          })
          return
        default:
          Message({
            message: resp.status || 'Error',
            type: 'error',
            duration: 5 * 1000
          })
      }
      return Promise.reject(new Error(resp.status || 'Error'))
    } else {
      return resp
    }
  },
  error => {
    // 输出异常日志到控制台
    console.log('[error] ' + error)

    // 处理异常
    if (!error.response) {
      Message({
        message: '接口响应失败，请稍后重试！',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }

    /*
    ====定制异常处理 (根据项目需求和实际情况自行定义)====

    switch (error.response.status) {
      case 404:
        Message({
          message: '[404]请求路径未找到',
          type: 'error',
          duration: 5 * 1000
        })
        break
      default:
        Message({
          message: '未知错误',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(error.response)
    }
    */

    return error
  })
export default service
