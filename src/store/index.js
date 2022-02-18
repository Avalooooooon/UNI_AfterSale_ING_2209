import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import {Message} from 'element-ui'


// 引入TIM相关的store

import conversation from './modules2/conversation'
import group from './modules2/group'
// import user2 from './modules/user'
import video from './modules2/video'
import friend from './modules2/friend'
import blacklist from './modules2/blacklist'
import groupLive from './modules2/groupLive'




Vue.use(Vuex)

function createStore () {
  return new Vuex.Store({
    state: {
      isLogin: false,
      loginUserInfo: null,
      // trtc 相关
      callStatus: '', // 状态, idle, calling, connected
      isInviter: false, // c2c 通话，说不定一开始不是 inviter, 后面邀请了别人就是 inviter 了
      isAccepted: false,
      meetingUserIdList: [],
      muteVideoUserIdList: [],
      muteAudioUserIdList: [],
      current: Date.now(), // 当前时间
      intervalID: 0,
      message: undefined,

      // 新增
      current: Date.now(), // 当前时间
      intervalID: 0,
      // message: undefined
    },
    getters: {
      hidden (state) {
        // eslint-disable-next-line no-unused-vars
        const temp = state.current
        if (typeof document.hasFocus !== 'function') {
          return document.hidden
        }
        return !document.hasFocus()
      }
    },
    mutations: {
      userLoginSuccess (state) {
        state.isLogin = true
      },
      userLogoutSuccess (state) {
        state.isLogin = false
        state.loginUserInfo = null
      },
      setLoginUserInfo (state, payload) {
        const {userId, userSig} = payload
        state.loginUserInfo = {
          userId, userSig
        }
      },
      updateIsInviter (state, isInviter) {
        state.isInviter = isInviter
      },
      updateCallStatus (state, callStatus) {
        state.callStatus = callStatus
      },
      userJoinMeeting (state, userId) {
        if (state.meetingUserIdList.indexOf(userId) === -1) {
          state.meetingUserIdList.push(userId)
        }
      },
      userAccepted (state, isAccepted) {
        state.isAccepted = isAccepted
      },
      userLeaveMeeting (state, userId) {
        const index = state.meetingUserIdList.findIndex(item => item === userId)
        if (index >= 0) {
          state.meetingUserIdList.splice(index, 1)
        }
      },
      dissolveMeeting (state) {
        state.meetingUserIdList = []
        state.isMuteVideoUserIdList = []
        state.isMuteAudioUserIdList = []
      },
      updateMuteVideoUserIdList (state, userIdList) {
        state.muteVideoUserIdList = userIdList
      },
      updateMuteAudioUserIdList (state, userIdList) {
        state.muteAudioUserIdList = userIdList
      },
      // 即时通信IM
      startComputeCurrent (state) {
        state.intervalID = setInterval(() => {
          state.current = Date.now()
        }, 500)
      },
      stopComputeCurrent (state) {
        clearInterval(state.intervalID)
        state.intervalID = 0
      },
      showMessage (state, options) {
        if (state.message) {
          state.message.close()
        }
        state.message = Message({
          message: options.message,
          type: options.type || 'success',
          duration: options.duration || 2000,
          offset: 40
        })
      }
    },
    modules: {
      user,
      conversation,
      group,
      friend,
      blacklist,
      // user2,
      video,
      groupLive,
    }
  })
}

const store = createStore()
export default store
