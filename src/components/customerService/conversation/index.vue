<template>
  <div class="box">
    <div class="box-left">
<!--      <div-->
<!--        class="conversation-item-container"-->
<!--        :class="{ 'choose': conversation.conversationID === currentConversation.conversationID }"-->
<!--        @click="selectConversation"-->
<!--      >-->
<!--        <div class="close-btn">-->
<!--          <span class="tim-icon-close" title="删除会话" @click="deleteConversation"></span>-->
<!--        </div>-->
<!--        <div class="warp">-->
<!--          <avatar :src="avatar" :type="conversation.type" />-->
<!--          <div class="content">-->
<!--            <div class="row-1">-->
<!--              <div class="name">-->
<!--                <div class="text-ellipsis">-->
<!--                <span :title="conversation.userProfile.nick || conversation.userProfile.userID"-->
<!--                      v-if="conversation.type ===  TIM.TYPES.CONV_C2C"-->
<!--                >{{conversation.remark || conversation.userProfile.nick || conversation.userProfile.userID}}-->
<!--                </span>-->
<!--                  <span :title="conversation.groupProfile.name || conversation.groupProfile.groupID"-->
<!--                        v-else-if="conversation.type ===  TIM.TYPES.CONV_GROUP"-->
<!--                  >{{conversation.groupProfile.name || conversation.groupProfile.groupID}}-->
<!--                </span>-->
<!--                  <span-->
<!--                    v-else-if="conversation.type === TIM.TYPES.CONV_SYSTEM"-->
<!--                  >系统通知-->
<!--                </span>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="unread-count">-->
<!--              <span class="badge" v-if="showUnreadCount">-->
<!--                {{conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}}-->
<!--              </span>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="row-2">-->
<!--              <div class="summary">-->
<!--                <div v-if="conversation.lastMessage" class="text-ellipsis">-->
<!--                  <span class="remind"  v-if="hasMessageAtMe">{{messageAtMeText}}</span>-->
<!--                  <span class="text" :title="conversation.lastMessage.messageForShow">-->
<!--                  {{messageForShow}}-->
<!--                </span>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="date">-->
<!--                {{date}}-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <div class="box-middle">
      <div id="message-send-box-wrapper" :style="focus ? {'backgroundColor': 'white'} : {}" @drop="dropHandler">
      <div class="send-header-bar">
        <el-popover placement="top" width="400" trigger="click">
          <div class="emojis">
            <div v-for="item in emojiName" class="emoji" :key="item" @click="chooseEmoji(item)">
              <img :src="emojiUrl + emojiMap[item]" style="width:30px;height:30px"/>
            </div>
          </div>
          <i class="iconfont icon-smile" slot="reference" title="发表情"></i>
        </el-popover>
        <i class="iconfont icon-tupian" title="发图片" @click="handleSendImageClick"></i>
        <i class="iconfont icon-zidingyi" title="发自定义消息" @click="sendCustomDialogVisible = true"></i>
      </div>
      <el-dialog title="发自定义消息" :visible.sync="sendCustomDialogVisible" width="30%">
        <el-form label-width="100px">
          <el-form-item label="data">
            <el-input v-model="form.data"></el-input>
          </el-form-item>
          <el-form-item label="description">
            <el-input v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item label="extension">
            <el-input v-model="form.extension"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="sendCustomDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendCustomMessage">确 定</el-button>
      </span>
      </el-dialog>
      <div class="bottom">
      <textarea
        ref="text-input"
        rows="4"
        resize="false"
        v-model="messageContent"
        class="text-input"
        @focus="focus = true"
        @blur="focus = false"
        @input="inputChange"
        @keydown.enter.exact.prevent="handleEnter"
        @keyup.ctrl.enter.prevent.exact="handleLine"
        @keydown.up.stop="handleUp"
        @keydown.down.stop="handleDown"
      >
      </textarea>
        <el-tooltip
          class="item"
          effect="dark"
          content="按Enter发送消息，Ctrl+Enter换行"
          placement="left-start"
        >
          <div class="btn-send" @click="sendTextMessage">
            <div class="tim-icon-send"></div>
          </div>
        </el-tooltip>
      </div>
      <input
        type="file"
        id="imagePicker"
        ref="imagePicker"
        accept=".jpg, .jpeg, .png, .gif, .bmp"
        @change="sendImage"
        style="display:none"
      />
<!--      <input type="file" id="filePicker" ref="filePicker" @change="sendFile" style="display:none"/>-->
<!--      <input type="file" id="videoPicker" ref="videoPicker" @change="sendVideo" style="display:none" accept=".mp4"/>-->
<!--      <div class="calling-member-list" v-if="currentConversationType === TIM.TYPES.CONV_GROUP && showCallingMember">-->
<!--        <calling-member-list @getList="getList" :type="listTpye"></calling-member-list>-->
<!--        <div class="calling-list-btn">-->
<!--          <span class="calling-btn" @click="cancelCalling">取消</span>-->
<!--          <span class="calling-btn" @click="callingHandler">确定</span>-->
<!--        </div>-->
<!--      </div>-->
    </div>
    </div>
    <div class="box-right">
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import {emojiMap, emojiName, emojiUrl} from '../../../utils/emojiMap'
import { isToday, getDate, getTime } from '../../../utils/date'
export default {
  props: ['conversation'],
  data () {
    return {
      focus: false,
      emojiMap: emojiMap,
      emojiName: emojiName,
      emojiUrl: emojiUrl,
      sendCustomDialogVisible: false,
      form: {
        data: '',
        description: '',
        extension: ''
      },
      messageContent: '',
      videoId: ''
      // userSig: 'eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwgYGBoZQ8eKU7MSCgswUJStDEwMDMyNjY0sTiExqRUFmUSpQ3NTU1AioAyJakpkLEjMzMTIzMbc0hYoWZ6YDjXXNqQoM9k8Oy0vLCSszMSlPDg11r-Rzds93CkzJL7F0N7d0y-CMTCmMyDKxVaoFAISkMIE_'
    }
  },
  computed: {
    ...mapGetters(['toAccount', 'currentConversationType']),
    ...mapState({
      // memberList: state => state.group.currentMemberList,
      userID: state => state.user.userID,
      groupProfile: state => state.conversation.currentConversation.groupProfile,
      conversationID: state => state.conversation.conversationID,
      currentConversation: state => state.conversation.currentConversation,
      currentUserProfile: state => state.user.currentUserProfile,
      videoCall: state => state.conversation.videoCall,
      audioCall: state => state.conversation.audioCall,
      isLogin: state => state.user.isLogin,
      isSDKReady: state => state.user.isSDKReady,
      isBusy: state => state.video.isBusy,
      userSig: state => state.user.userSig,
      sdkAppID: state => state.user.sdkAppID
    }),
    currentConversation: state => state.conversation.currentConversation,
    hasMessageAtMe () {
      return (
        this.currentConversation.conversationID !==
        this.conversation.conversationID && this.conversation.groupAtInfoList && this.conversation.groupAtInfoList.length > 0
      )
    },
    avatar: function () {
      switch (this.conversation.type) {
        case 'GROUP':
          return this.conversation.groupProfile.avatar
        case 'C2C':
          return this.conversation.userProfile.avatar
        default:
          return ''
      }
    },
    showUnreadCount () {
      if (this.$store.getters.hidden) {
        return this.conversation.unreadCount > 0
      }
      // 是否显示未读计数。当前会话和未读计数为0的会话，不显示。
      return (
        this.currentConversation.conversationID !==
        this.conversation.conversationID && this.conversation.unreadCount > 0
      )
    },
    messageAtMeText () {
      let text = ''
      if (this.conversation.groupAtInfoList.length > 0) {
        this.conversation.groupAtInfoList.forEach((item) => {
          if (item.atTypeArray[0] === this.TIM.TYPES.CONV_AT_ME) {
            text.indexOf('[@所有人]') !== -1 ? text = '[@所有人][有人@我]' : text = '[有人@我]'
          }
          if (item.atTypeArray[0] === this.TIM.TYPES.CONV_AT_ALL) {
            text.indexOf('[有人@我]') !== -1 ? text = '[有人@我][@所有人]' : text = '[@所有人]'
          }
          if (item.atTypeArray[0] === this.TIM.TYPES.CONV_AT_ALL_AT_ME) {
            text = '[@所有人][有人@我]'
          }
        })
      }
      return text
    },
    messageForShow () {
      if (this.conversation.lastMessage.isRevoked) {
        if (this.conversation.lastMessage.fromAccount === this.currentUserProfile.userID) {
          return '你撤回了一条消息'
        }
        if (this.conversation.type === this.TIM.TYPES.CONV_C2C) {
          return '对方撤回了一条消息'
        }
        return `${this.conversation.lastMessage.fromAccount}撤回了一条消息`
      }
      return this.conversation.lastMessage.messageForShow
    },
    date () {
      if (
        !this.conversation.lastMessage ||
        !this.conversation.lastMessage.lastTime
      ) {
        return ''
      }
      const date = new Date(this.conversation.lastMessage.lastTime * 1000)
      if (isToday(date)) {
        return getTime(date)
      }
      return getDate(date)
    }
  },
  mounted () {
    // 初始化监听器
    this.initListener()
  },
  created () {
    this.videoId = sessionStorage.getItem('video_id')
    // console.log(this.videoId)
    this.login()
  },
  methods: {
    initListener () {
      // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
      this.tim.on(this.TIM.EVENT.SDK_READY, this.onReadyStateUpdate, this)
      // SDK NOT READT
      this.tim.on(this.TIM.EVENT.SDK_NOT_READY, this.onReadyStateUpdate, this)
      // 被踢出
      this.tim.on(this.TIM.EVENT.KICKED_OUT, this.onKickOut)
      // SDK内部出错
      this.tim.on(this.TIM.EVENT.ERROR, this.onError)
      // 收到新消息
      this.tim.on(this.TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage)
      // 会话列表更新
      this.tim.on(this.TIM.EVENT.CONVERSATION_LIST_UPDATED, this.onUpdateConversationList)
      // 群组列表更新
      this.tim.on(this.TIM.EVENT.GROUP_LIST_UPDATED, this.onUpdateGroupList)
      // 网络监测
      this.tim.on(this.TIM.EVENT.NET_STATE_CHANGE, this.onNetStateChange)
      // 已读回执
      this.tim.on(this.TIM.EVENT.MESSAGE_READ_BY_PEER, this.onMessageReadByPeer)
      // 黑名单更新
      this.tim.on(this.TIM.EVENT.FRIEND_LIST_UPDATED, this.onFriendListUpdated)

      this.tim.on(this.TIM.EVENT.FRIEND_APPLICATION_LIST_UPDATED, this.onFriendApplicationListUpdated)

      this.tim.on(this.TIM.EVENT.FRIEND_GROUP_LIST_UPDATED, this.onFriendGroupListUpdated)
    },
    // submit () {
    //   this.$refs['login'].validate(valid => {
    //     if (valid) {
    //       this.login()
    //     }
    //   })
    // },
    login () {
      this.tim
        .login({
          userID: this.videoId,
          userSig: 'eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwgYGBoZQ8eKU7MSCgswUJStDEwMDMyNjY0sTiExqRUFmUSpQ3NTU1AioAyJakpkLEjMzMTIzMbc0hYoWZ6YDjXXNqQoM9k8Oy0vLCSszMSlPDg11r-Rzds93CkzJL7F0N7d0y-CMTCmMyDKxVaoFAISkMIE_'
        })
        .then(() => {
          // this.loading = false
          // this.$store.commit('toggleIsLogin', true)
          this.$store.commit('startComputeCurrent')
          this.$store.commit('showMessage', { type: 'success', message: '登录成功' })
          this.$store.commit({
            type: 'GET_USER_INFO',
            userID: this.videoId,
            userSig: 'eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwgYGBoZQ8eKU7MSCgswUJStDEwMDMyNjY0sTiExqRUFmUSpQ3NTU1AioAyJakpkLEjMzMTIzMbc0hYoWZ6YDjXXNqQoM9k8Oy0vLCSszMSlPDg11r-Rzds93CkzJL7F0N7d0y-CMTCmMyDKxVaoFAISkMIE_',
            sdkAppID: 1400623394
          })
          // this.$message.success('登录成功')
          this.$store.commit('showMessage', {
            type: 'success',
            message: '登录成功'
          })
        })
        .catch(() => {
          // this.$message.error('登录失败')
          // this.loading = false
          this.$store.commit('showMessage', {
            // eslint-disable-next-line no-undef
            message: '登录失败：' + error.message,
            type: 'error'
          })
        })
    },
    selectConversation () {
      if (this.conversation.conversationID !== this.currentConversation.conversationID) {
        this.$store.dispatch(
          'checkoutConversation',
          this.conversation.conversationID
        )
      }
    },
    deleteConversation (event) {
      // 停止冒泡，避免和点击会话的事件冲突
      event.stopPropagation()
      this.tim
        .deleteConversation(this.conversation.conversationID)
        .then(() => {
          this.$store.commit('showMessage', {
            message: `会话【${this.conversationName}】删除成功!`,
            type: 'success'
          })
          this.popoverVisible = false
          this.$store.commit('resetCurrentConversation')
        })
        .catch(error => {
          this.$store.commit('showMessage', {
            message: `会话【${this.conversationName}】删除失败!, error=${error.message}`,
            type: 'error'
          })
          this.popoverVisible = false
        })
    },
    dropHandler (e) {
      e.preventDefault()
      let file = e.dataTransfer.files[0]
      let message = {}
      if (file.type === 'video/mp4') {
        message = this.tim.createVideoMessage({
          to: this.toAccount,
          conversationType: this.currentConversationType,
          payload: {
            file: file
          },
          onProgress: percent => {
            this.$set(message, 'progress', percent) // 手动给message 实例加个响应式属性: progress
          }
        })
      } else {
        message = this.tim.createFileMessage({
          to: this.toAccount,
          conversationType: this.currentConversationType,
          payload: {
            file: file
          },
          onProgress: percent => {
            this.$set(message, 'progress', percent) // 手动给message 实例加个响应式属性: progress
          }
        })
      }
      this.$store.commit('pushCurrentMessageList', message)
      this.tim
        .sendMessage(message)
        .then(() => {
          this.$refs.videoPicker.value = null
        })
        .catch(imError => {
          this.$store.commit('showMessage', {
            message: imError.message,
            type: 'error'
          })
        })
    },
    handleSendImageClick () {
      this.$refs.imagePicker.click()
    },
    sendCustomMessage () {
      if (
        this.form.data.length === 0 &&
        this.form.description.length === 0 &&
        this.form.extension.length === 0
      ) {
        this.$store.commit('showMessage', {
          message: '不能发送空消息',
          type: 'info'
        })
        return
      }
      const message = this.tim.createCustomMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          data: this.form.data,
          description: this.form.description,
          extension: this.form.extension
        }
      })
      this.$store.commit('pushCurrentMessageList', message)
      this.tim.sendMessage(message).catch(error => {
        this.$store.commit('showMessage', {
          type: 'error',
          message: error.message
        })
      })
      Object.assign(this.form, {
        data: '',
        description: '',
        extension: ''
      })
      this.sendCustomDialogVisible = false
    },
    inputChange (value) {
      if (this.currentConversationType === this.TIM.TYPES.CONV_GROUP && value.data === '@') {
        this.groupAt = true
        this.listTpye = 'groupAt'
        this.showCallingMember = true
      }
      if (value.data === ' ' && this.messageContent.indexOf('@ ') !== -1) {
        this.groupAt = false
        this.listTpye = ''
        this.showCallingMember = false
      }
    },
    // 回车发送消息
    handleEnter () {
      this.sendTextMessage()
    },
    // 发送文本消息
    sendTextMessage () {
      if (
        this.messageContent === '' ||
        this.messageContent.trim().length === 0
      ) {
        this.messageContent = ''
        this.$store.commit('showMessage', {
          message: '不能发送空消息哦！',
          type: 'info'
        })
        return
      }
      // if (this.currentConversationType === this.TIM.TYPES.CONV_GROUP && this.groupAt) {
      if (this.messageContent !== '') {
        let message = this.tim.createTextAtMessage({
          to: '0002',
          // conversationType: this.TIM.TYPES.CONV_GROUP,
          payload: {
            text: this.messageContent
            // atUserList: this.callingList // 'denny' 'lucy' 都是 userID，而非昵称
          }
        })
        console.log(this.messageContent)
        // this.$store.commit('pushCurrentMessageList', message)
        // this.$bus.$emit('scroll-bottom')
        this.tim.sendMessage(message).catch(error => {
          this.$store.commit('showMessage', {
            type: 'error',
            message: error.message
          })
        })
        this.messageContent = ''
        // this.groupAt = false
        return
      }
      const message = this.tim.createTextMessage({
        to: '0002',
        // conversationType: this.currentConversationType,
        payload: {text: this.messageContent}
      })
      // this.$store.commit('pushCurrentMessageList', message)
      // this.$bus.$emit('scroll-bottom')
      this.tim.sendMessage(message).catch(error => {
        this.$store.commit('showMessage', {
          type: 'error',
          message: error.message
        })
      })
      this.messageContent = ''
    },
    sendImage () {
      const message = this.tim.createImageMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          file: document.getElementById('imagePicker') // 或者用event.target
        },
        onProgress: percent => {
          this.$set(message, 'progress', percent) // 手动给message 实例加个响应式属性: progress
        }
      })
      this.$store.commit('pushCurrentMessageList', message)
      this.tim
        .sendMessage(message)
        .then(() => {
          this.$refs.imagePicker.value = null
        })
        .catch(imError => {
          this.$store.commit('showMessage', {
            message: imError.message,
            type: 'error'
          })
        })
    },
    sendFile () {
      const message = this.tim.createFileMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          file: document.getElementById('filePicker') // 或者用event.target
        },
        onProgress: percent => {
          this.$set(message, 'progress', percent) // 手动给message 实例加个响应式属性: progress
        }
      })
      this.$store.commit('pushCurrentMessageList', message)
      this.tim
        .sendMessage(message)
        .then(() => {
          this.$refs.filePicker.value = null
        })
        .catch(imError => {
          this.$store.commit('showMessage', {
            message: imError.message,
            type: 'error'
          })
        })
    },
    sendVideo () {
      const message = this.tim.createVideoMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          file: document.getElementById('videoPicker') // 或者用event.target
        },
        onProgress: percent => {
          this.$set(message, 'progress', percent) // 手动给message 实例加个响应式属性: progress
        }
      })
      this.$store.commit('pushCurrentMessageList', message)
      this.tim
        .sendMessage(message)
        .then(() => {
          this.$refs.videoPicker.value = null
        })
        .catch(imError => {
          this.$store.commit('showMessage', {
            message: imError.message,
            type: 'error'
          })
        })
    },
    chooseEmoji (item) {
      this.messageContent += item
    }
  }
}
</script>

<style lang="stylus" scoped>
.box{
  width: 100%;
  height: calc(100vh - 170px);
  display flex ;
  //border 1px solid black
}
.box-left{
  width: 22%;
  height: 100%;
  border-right: 1px solid lightgrey;
}
.box-middle{
  width: 50%;
  height: 100%;
  position relative;
}
.box-right{
  width: 28%;
  height: 100%;
  border-left: 1px solid lightgrey;
}
#message-send-box-wrapper {
  width 100%
  box-sizing: border-box;
  overflow: hidden;
  padding: 3px 20px 20px 20px;
  border-top: 1px solid lightgrey
  position: absolute;
  bottom: 0;
}

.emojis {
  height: 160px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-y: scroll;
}

.emoji {
  height: 40px;
  width: 40px;
  box-sizing: border-box;
}

.send-header-bar {
  box-sizing: border-box;
  padding: 3px 0 0 0;
}

.send-header-bar i {
  cursor: pointer;
  font-size: 24px;
  color: gray;
  margin: 0 12px 0 0;
}

.send-header-bar i:hover {
  color: $black;
}

textarea {
  resize: none;
}

.text-input {
  font-size: 16px;
  width: 100%;
  box-sizing: box-sizing;
  border: none;
  outline: none;
  background-color: transparent;
}

.block {
  padding: 10px 0;
  display: flex;
  align-items: center;
}

.bottom {
  padding-top: 10px;
  position: relative;

  .btn-send {
    cursor: pointer;
    position: absolute;
    color: $primary;
    font-size: 30px;
    right: 0;
    bottom: -5px;
    padding: 6px 6px 4px 4px;
    border-radius: 50%;
  }
}

.group-live-icon-box {
  display inline-block
  position relative
  top 3px
  width 25px
  height 25px
  margin-right 12px

  .group-live-icon {
    display inline-block
    position absolute
    top 0
    left 0
    width 25px
    height 25px
    background url('../../../assets/image/live-icon.png') center no-repeat
    background-size cover
    z-index 2
  }

  .group-live-icon-hover {
    display inline-block
    position absolute
    top 0
    left 0
    width 25px
    height 25px
    background url('../../../assets/image/live-icon-hover.png') center no-repeat
    background-size cover
    z-index 1
  }
}

.group-live-icon-box:hover {
  .group-live-icon {
    z-index 1
  }

  .group-live-icon-hover {
    z-index 2
  }
}

.calling-member-list {
  position absolute
  top 50px
  background #fff
  margin-right 20px

  .calling-list-btn {
    width 140px
    display flex
    float right
    margin 10px 0

    .calling-btn {
      cursor pointer
      padding 6px 12px
      background #00A4FF
      color #ffffff
      font-size 14px
      border-radius 20px
      margin-left 13px
    }
  }
}

.el-popover {
  padding: 12px 0 0 0 !important;
}
</style>
