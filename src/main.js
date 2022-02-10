// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import './style/theme/index.css'
import ElementUI from 'element-ui'
import axios from 'axios'
import md5 from 'js-md5'
import jsCookie from 'js-cookie'
import TRTCCalling from 'trtc-calling-js'
import {createTrtcCalling} from './trtc-calling'
import store from './store'
import './assets/icon/iconfont.css'
import './assets/icon/tim.css'
import './assets/css/animate.css'
// import TIM from 'tim-js-sdk'
import tim from './tim'
import TIM from 'tim-js-sdk/tim-js-friendship.js'
// 发送图片、文件等消息需要腾讯云即时通信 IM 上传插件
// import TIMUploadPlugin from 'tim-upload-plugin'

window.tim = tim
window.TIM = TIM
window.store = store
Vue.prototype.tim = tim
Vue.prototype.TIM = TIM
// let options = {
//   SDKAppID: 1400623394 // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
// }
// // 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
// let tim = TIM.create(options) // SDK 实例通常用 tim 表示
//
// // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
// tim.setLogLevel(0) // 普通级别，日志量较多，接入时建议使用
// // tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
//
// // 注册腾讯云即时通信 IM 上传插件
// tim.registerPlugin({'tim-upload-plugin': TIMUploadPlugin})

axios.defaults.baseURL = '/api'
axios.defaults.withCredentials = true
Vue.prototype.$trtcCalling = createTrtcCalling()
Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.prototype.$md5 = md5
Vue.prototype.$cookie = jsCookie
Vue.prototype.$store = store

Vue.prototype.$TRTCCalling = TRTCCalling
Vue.prototype.TrtcCalling = TRTCCalling

Vue.config.productionTip = false
window.tim = Vue.prototype.$trtcCalling.tim
window.TIM = TIM
Vue.prototype.tim = tim
Vue.prototype.TIM = TIM

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
