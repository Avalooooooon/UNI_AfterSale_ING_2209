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
import tim from './tim'
import TIM from 'tim-js-sdk/tim-js-friendship.js'
import './assets/icon/iconfont.css'
import './assets/icon/tim.css'
import './assets/css/animate.css'
import Avatar from './components/customerService/conversation/components/avatar.vue'

window.tim = tim
window.TIM = TIM
window.store = store
Vue.prototype.tim = tim
Vue.prototype.TIM = TIM
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
// 会话相关
Vue.prototype.$confirm = ElementUI.MessageBox.confirm
Vue.prototype.$bus = new Vue()
Vue.use(ElementUI.Button)
Vue.use(ElementUI.Row)
Vue.use(ElementUI.Col)
Vue.use(ElementUI.Input)
Vue.use(ElementUI.Loading)
Vue.use(ElementUI.Dialog)
Vue.use(ElementUI.Dropdown)
Vue.use(ElementUI.DropdownMenu)
Vue.use(ElementUI.DropdownItem)
Vue.use(ElementUI.Checkbox)
Vue.use(ElementUI.CheckboxGroup)
Vue.use(ElementUI.Divider)
Vue.use(ElementUI.Popover)
Vue.use(ElementUI.Collapse)
Vue.use(ElementUI.CollapseItem)
Vue.use(ElementUI.Form)
Vue.use(ElementUI.FormItem)
Vue.use(ElementUI.Select)
Vue.use(ElementUI.Option)
Vue.use(ElementUI.Menu)
Vue.use(ElementUI.MenuItem)
Vue.use(ElementUI.MenuItemGroup)
Vue.use(ElementUI.Submenu)
Vue.use(ElementUI.Tooltip)
Vue.component('avatar', Avatar)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
