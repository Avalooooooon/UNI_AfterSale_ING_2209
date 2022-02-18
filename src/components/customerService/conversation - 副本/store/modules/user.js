import tim from '../../tim'
const user = {
  state: {
    currentUserProfile: {},
    isLogin: false,
    isSDKReady: false, // TIM SDK 是否 ready
    userID: '0001',
    userSig: 'eJwtzM0KgkAUBeB3udtC7vxZCa5CKBJa5IAuDUe5TcXgSBjRuzepy-MdzvlAkV*il*khAR4hrKdMjXkO1NLEiMgW942tnaMGEiYRYy7ETs6NGR31JrhSiofFrAM9-hZLueWKqXh5oS7c3vPDJhvOx*LttLR7LYqxyk66W2msK*7b0tubM6K01yqF7w9xDzBU',
    sdkAppID: 1400623394
  },
  mutations: {
    updateCurrentUserProfile (state, userProfile) {
      state.currentUserProfile = userProfile
    },
    toggleIsLogin (state, isLogin) {
      state.isLogin = typeof isLogin === 'undefined' ? !state.isLogin : isLogin
    },
    toggleIsSDKReady (state, isSDKReady) {
      // state.isSDKReady = typeof isSDKReady === 'undefined' ? !state.isSDKReady : isSDKReady
      state.isSDKReady = !state.isSDKReady
    },
    reset (state) {
      Object.assign(state, {
        currentUserProfile: {},
        isLogin: false,
        isSDKReady: false // TIM SDK 是否 ready
      })
    },
    GET_USER_INFO (state, payload) {
      state.userID = payload.userID
      state.userSig = payload.userSig
      state.sdkAppID = payload.sdkAppID
    }
  },
  created () {
    this.userID = sessionStorage.getItem('video_id')
  },
  actions: {
    // login(context, userID) {
    //   tim
    //     .login({
    //       userID,
    //       userSig: window.genTestUserSig(userID).userSig
    //     })
    //     .then(() => {
    //       context.commit('toggleIsLogin', true)
    //       context.commit('startComputeCurrent')
    //       window.$message({ type: 'success', message: '登录成功' })
    //     })
    //     .catch(imError => {
    //       if (imError.code === 2000) {
    //         window.$message.error(imError.message + ', 请检查是否正确填写了 SDKAPPID')
    //       } else {
    //         window.$message.error(imError.message)
    //       }
    //     })
    // },
    logout (context) {
      // 若有当前会话，在退出登录时已读上报
      if (context.rootState.conversation.currentConversation.conversationID) {
        tim.setMessageRead({ conversationID: context.rootState.conversation.currentConversation.conversationID })
      }
      tim.logout().then(() => {
        context.commit('toggleIsLogin')
        context.commit('stopComputeCurrent')
        context.commit('reset')
      })
    }
  }
}

export default user
