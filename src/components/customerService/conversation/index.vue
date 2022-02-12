<template>
  <div class="box">
    <div class="box-left">
      <div class="list-container">
        <div class="header-bar">
          <button title="刷新列表" @click="handleRefresh">
            <i class="tim-icon-refresh"></i>
          </button>
          <button title="创建会话" @click="handleAddButtonClick">
            <i class="tim-icon-add"></i>
          </button>
        </div>
        <div class="scroll-container">
          <conversation-item
            :conversation="item"
            v-for="item in conversationList"
            :key="item.conversationID"
          />
        </div>
        <el-dialog title="快速发起会话" :visible.sync="showDialog" width="30%">
          <el-input placeholder="请输入用户ID" v-model="userID" @keydown.enter.native="handleConfirm"/>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showDialog = false">取 消</el-button>
            <el-button type="primary" @click="handleConfirm">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div
        class="conversation-item-container"
        :class="{ 'choose': conversation.conversationID === currentConversation.conversationID }"
        @click="selectConversation"
      >
        <div class="close-btn">
          <span class="tim-icon-close" title="删除会话" @click="deleteConversation"></span>
        </div>
        <div class="warp">
          <avatar :src="avatar" :type="conversation.type" />
          <div class="content">
            <div class="row-1">
              <div class="name">
                <div class="text-ellipsis">
                <span :title="conversation.userProfile.nick || conversation.userProfile.userID"
                      v-if="conversation.type ===  TIM.TYPES.CONV_C2C"
                >{{conversation.remark || conversation.userProfile.nick || conversation.userProfile.userID}}
                </span>
                  <span :title="conversation.groupProfile.name || conversation.groupProfile.groupID"
                        v-else-if="conversation.type ===  TIM.TYPES.CONV_GROUP"
                  >{{conversation.groupProfile.name || conversation.groupProfile.groupID}}
                </span>
                  <span
                    v-else-if="conversation.type === TIM.TYPES.CONV_SYSTEM"
                  >系统通知
                </span>
                </div>
              </div>
              <div class="unread-count">
              <span class="badge" v-if="showUnreadCount">
                {{conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}}
              </span>
              </div>
            </div>
            <div class="row-2">
              <div class="summary">
                <div v-if="conversation.lastMessage" class="text-ellipsis">
                  <span class="remind"  v-if="hasMessageAtMe">{{messageAtMeText}}</span>
                  <span class="text" :title="conversation.lastMessage.messageForShow">
                  {{messageForShow}}
                </span>
                </div>
              </div>
              <div class="date">
                {{date}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box-middle">
      <div class="chat-bubble" @mousedown.stop @contextmenu.prevent>
        <el-dropdown trigger="" ref="dropdown" placement="bottom-start" v-if="!message.isRevoked" @command="handleCommand">
          <div style="display: flex">
            <div v-if="isMine && messageReadByPeer" class="message-status">
              <span>{{messageReadByPeer}}</span>
            </div>
            <div class="message-content" :class="bubbleStyle">
              <slot></slot>
            </div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="revoke" v-if="isMine&&!isTimeout">撤回</el-dropdown-item>
            <el-dropdown-item command="relay" v-show="message.status !=='fail'">转发</el-dropdown-item>
            <el-dropdown-item command="merger" v-show="message.status !=='fail'">多选</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="group-tip-element-wrapper" v-if="message.isRevoked">
          {{text}}
          <el-button type="text" size="mini" class="edit-button" v-show="isEdit" @click="reEdit">&nbsp;重新编辑</el-button>
        </div>
      </div>
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
import { mapGetters, mapState } from 'vuex'
import callingMemberList from './trtc-calling/group-member-list'
import { isToday, getDate, getTime } from '../../../utils/date'
import {
  Form,
  FormItem,
  Input,
  Dialog,
  Popover,
  Tooltip,
  Rate
} from 'element-ui'
import { emojiMap, emojiName, emojiUrl } from '../../../utils/emojiMap'
export default {
  // props: ['conversation'],
  components: {
    callingMemberList: callingMemberList,
    ElInput: Input,
    ElForm: Form,
    ElFormItem: FormItem,
    ElDialog: Dialog,
    ElPopover: Popover,
    ElTooltip: Tooltip,
    ElRate: Rate
  },
  data () {
    return {
      videoId: '',
      userSig: 'eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwgYGBoZQ8eKU7MSCgswUJStDEwMDMyNjY0sTiExqRUFmUSpQ3NTU1AioAyJakpkLEjMzMTIzMbc0hYoWZ6YDjXXNqQoM9k8Oy0vLCSszMSlPDg11r-Rzds93CkzJL7F0N7d0y-CMTCmMyDKxVaoFAISkMIE_',
      sdkAppID: '1400623394',
      popoverVisible: false,
      showMessageAtMe_text: '',
      isTimeout: false,
      showConversationList: false,
      relayMessage: {},
      selectedConversation: [],
      testMergerMessage: {},
      callingList: [],
      groupAtList: [],
      listTpye: '',
      callingType: '',
      groupAt: false,
      showCallingMember: false,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      messageContent: '',
      isSendCustomMessage: false,
      sendCustomDialogVisible: false,
      surveyDialogVisible: false,
      form: {
        data: '',
        description: '',
        extension: ''
      },
      rate: 5, // 评分
      suggestion: '', // 建议
      file: '',
      emojiMap: emojiMap,
      emojiName: emojiName,
      emojiUrl: emojiUrl,
      showAtGroupMember: false,
      atUserID: '',
      focus: false,
      faceUrl: 'https://web.sdk.qcloud.com/im/assets/face-elem/',
      emojiShow: true,
      bigEmojiShow: false,
      bigEmojiList: [
        {
          icon: 'yz00',
          list: ['yz00', 'yz01', 'yz02', 'yz03', 'yz04', 'yz05', 'yz06', 'yz07', 'yz08', 'yz09', 'yz10', 'yz11', 'yz12', 'yz13', 'yz14', 'yz15', 'yz16', 'yz17']
        },
        {
          icon: 'ys00',
          list: ['ys00', 'ys01', 'ys02', 'ys03', 'ys04', 'ys05', 'ys06', 'ys07', 'ys08', 'ys09', 'ys10', 'ys11', 'ys12', 'ys13', 'ys14', 'ys15']
        },
        {
          icon: 'gcs00',
          list: ['gcs00', 'gcs01', 'gcs02', 'gcs03', 'gcs04', 'gcs05', 'gcs06', 'gcs07', 'gcs08', 'gcs09', 'gcs10', 'gcs11', 'gcs12', 'gcs13', 'gcs14', 'gcs15', 'gcs16']
        }
      ],
      curItemIndex: 0,
      curBigEmojiItemList: [],
      showDialog: false,
      userID: '',
      isCheckouting: false, // 是否正在切换会话
      timeout: null
    }
  },
  props: {
    isMine: {
      type: Boolean
    },
    isNew: {
      type: Boolean
    },
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      currentUserProfile: state => state.user.currentUserProfile,
      currentConversation: state => state.conversation.currentConversation,
      videoCall: state => state.conversation.videoCall,
      audioCall: state => state.conversation.audioCall,
      isLogin: state => state.user.isLogin,
      isSDKReady: state => state.user.isSDKReady,
      isBusy: state => state.video.isBusy
      // userID: state => state.user.userID,
      // userSig: state => state.user.userSig,
      // sdkAppID: state => state.user.sdkAppID,
      // conversationList: state => state.conversation.conversationList
    }),
    // 是否显示 Loading 状态
    showLoading () {
      return !this.isSDKReady
    },
    ...mapGetters(['toAccount', 'currentConversationType']),
    ...mapState({
      memberList: state => state.group.currentMemberList,
      userID: state => state.user.userID,
      groupProfile: state => state.conversation.currentConversation.groupProfile
    }),
    hasMessageAtMe () {
      return (
        this.currentConversation.conversationID !==
        this.conversation.conversationID && this.conversation.groupAtInfoList && this.conversation.groupAtInfoList.length > 0
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
    conversationName: function () {
      if (this.conversation.type === this.TIM.TYPES.CONV_C2C) {
        return this.conversation.userProfile.nick || this.conversation.userProfile.userID
      }
      if (this.conversation.type === this.TIM.TYPES.CONV_GROUP) {
        return this.conversation.groupProfile.name || this.conversation.groupProfile.groupID
      }
      if (this.conversation.type === this.TIM.TYPES.CONV_SYSTEM) {
        return '系统通知'
      }
      return ''
    },
    showGrayBadge () {
      if (this.conversation.type !== this.TIM.TYPES.CONV_GROUP) {
        return false
      }
      return (
        this.conversation.groupProfile.selfInfo.messageRemindType ===
        'AcceptNotNotify'
      )
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
    ...mapState({
      currentConversation: state => state.conversation.currentConversation,
      currentUserProfile: state => state.user.currentUserProfile
    }),
    ...mapGetters(['toAccount']),
    bubbleStyle () {
      let classString = ''
      if (this.isMine) {
        classString += 'message-send'
      } else {
        classString += 'message-received'
      }
      if (this.isNew) {
        classString += 'new'
      }
      return classString
    },
    text () {
      if (this.message.conversationType === this.TIM.TYPES.CONV_C2C && !this.isMine) {
        return '对方撤回了一条消息'
      }
      if (this.message.conversationType === this.TIM.TYPES.CONV_GROUP && !this.isMine) {
        return `${this.message.from}撤回了一条消息`
      }
      return '你撤回了一条消息'
    },
    messageReadByPeer () {
      if (this.message.status !== 'success') {
        return false
      }
      if (this.message.conversationType === this.TIM.TYPES.CONV_C2C && this.message.isPeerRead) {
        return '已读'
      }
      if (this.message.conversationType === this.TIM.TYPES.CONV_C2C && !this.message.isPeerRead) {
        return '未读'
      }
      return ''
    },
    isEdit () {
      if (!this.isMine) {
        return false
      }
      if (this.message.type !== this.TIM.TYPES.MSG_TEXT) {
        return false
      }
      return !this.isTimeout;

    }
  },
  mounted () {
    // 初始化监听器
    this.initListener()
    if (this.$refs.dropdown && this.$refs.dropdown.$el) {
      this.$refs.dropdown.$el.addEventListener('mousedown', this.handleDropDownMousedown)
    }
    this.$refs['text-input'].addEventListener('paste', this.handlePaste)
    this.$bus.$on('reEditMessage', this.reEditMessage)
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeDestroy () {
    if (this.$refs.dropdown && this.$refs.dropdown.$el) {
      this.$refs.dropdown.$el.removeEventListener('mousedown', this.handleDropDownMousedown)
    }
    this.$refs['text-input'].removeEventListener('paste', this.handlePaste)
  },
  destroyed () {
    window.removeEventListener('keydown', this.handleKeydown)
  },
  created () {
    this.videoId = sessionStorage.getItem('video_id')
    // console.log(this.videoId)
    this.login()
    this.isTimeoutHandler()
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
    // 聊天登录
    login () {
      this.tim
        .login({
          userID: this.videoId,
          userSig: this.userSig
        })
        .then(() => {
          // this.loading = false
          // this.$store.commit('toggleIsLogin', true)
          this.$store.commit('startComputeCurrent')
          this.$store.commit('showMessage', { type: 'success', message: '登录成功' })
          this.$store.commit({
            type: 'GET_USER_INFO',
            userID: this.videoId,
            userSig: this.userSig,
            sdkAppID: this.sdkAppID
          })
          this.$store.commit('showMessage', {
            type: 'success',
            message: '聊天客服登录成功'
          })
        })
        .catch(() => {
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
    showContextMenu () {
      this.popoverVisible = true
    },
    handleDropDownMousedown (e) {
      if (e.buttons === 2) {
        if (this.$refs.dropdown.visible) {
          this.$refs.dropdown.hide()
        } else {
          this.$refs.dropdown.show()
        }
      }
    },
    handleCommand (command) {
      switch (command) {
        case 'revoke':
          this.tim.revokeMessage(this.message).then(() => {
            this.isTimeoutHandler()
          }).catch((err) => {
            this.$store.commit('showMessage', {
              message: err,
              type: 'warning'
            })
          })
          break
        case 'relay':
          this.showConversationList = true
          this.$store.commit('setRelayType', 1)
          this.$store.commit('showConversationList', true)
          this.$store.commit('setRelayMessage', this.message)
          break
        case 'merger':
          this.$bus.$emit('mergerSelected', true)
          break
        default:
          break
      }
    },
    isTimeoutHandler () { // 从发送消息时间开始算起，两分钟内可以编辑
      let now = new Date()
      if (parseInt(now.getTime() / 1000) - this.message.time > 2 * 60) {
        this.isTimeout = true
        return
      }
      setTimeout(this.isTimeoutHandler, 1000)
    },
    reEdit () {
      this.$bus.$emit('reEditMessage', this.message.payload.text)
    },
    getList (value) {
      this.callingList = value.map((item) => {
        let obj = JSON.parse(item)
        return obj.userID
      })
      this.groupAtList = value.map((item) => {
        let data = JSON.parse(item)
        return data.nick
      })
    },
    cancelCalling () {
      this.showCallingMember = false
    },
    callingHandler () {
      if (this.callingList.length < 1) {
        this.$store.commit('showMessage', {
          type: 'warning',
          message: '请选择成员'
        })
        return
      }
      if (this.listTpye === 'groupAt') {
        this.groupAtList.forEach((item, index) => {
          if (index === 0) {
            this.messageContent += `${item} `
          } else {
            this.messageContent += `@${item} `
          }
        })
        this.showCallingMember = false
        this.$refs['text-input'].focus()
        return
      }
      if (this.listTpye === 'calling') {
        let callingData = {
          memberList: this.callingList,
          type: this.TIM.TYPES.CONV_GROUP
        }
        this.$store.commit('setCallingList', callingData)
        if (this.callingType === 'video') {
          this.$bus.$emit('video-call')
        }
        if (this.callingType === 'audio') {
          this.$bus.$emit('audio-call')
        }
        this.showCallingMember = false
      }
    },
    trtcCalling (type) {
      this.listTpye = 'calling'
      if (type === 'video') {
        this.callingType = 'video'
      }
      if (type === 'audio') {
        this.callingType = 'audio'
      }
      // 呼叫方设置
      if (this.currentConversationType === 'C2C') {
        let member = [this.toAccount]
        let callingData = {
          memberList: member,
          type: 'C2C'
        }
        this.$store.commit('setCallingList', callingData)
        this.$bus.$emit(`${type}-call`)
        return
      }
      if (this.currentConversationType === this.TIM.TYPES.CONV_GROUP) {
        this.showCallingMember = true
      }
      // this.$store.commit('pushCurrentMessageList', true)
    },
    handleEmojiShow () {
      this.emojiShow = true
      this.bigEmojiShow = false
    },
    handleBigEmojiShow (index) {
      let elm = document.getElementById('bigEmojiBox')
      elm && (elm.scrollTop = 0)
      this.curItemIndex = index
      this.curBigEmojiItemList = this.bigEmojiList[index].list
      this.emojiShow = false
      this.bigEmojiShow = true
    },
    chooseBigEmoji (item) {
      this.popoverVisible = false
      let message = this.tim.createFaceMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          index: this.curItemIndex + 1,
          data: `${item}@2x`
        }
      })
      this.$store.commit('pushCurrentMessageList', message)
      this.$bus.$emit('scroll-bottom')
      this.tim.sendMessage(message).catch(error => {
        this.$store.commit('showMessage', {
          type: 'error',
          message: error.message
        })
      })
    },
    reEditMessage (payload) {
      this.messageContent = payload
    },
    handleUp () {
      const index = this.memberList.findIndex(
        member => member.userID === this.atUserID
      )
      if (index - 1 < 0) {
        return
      }
      this.atUserID = this.memberList[index - 1].userID
    },
    handleDown () {
      const index = this.memberList.findIndex(
        member => member.userID === this.atUserID
      )
      if (index + 1 >= this.memberList.length) {
        return
      }
      this.atUserID = this.memberList[index + 1].userID
    },
    handleEnter () {
      this.sendTextMessage()
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
    handleLine () {
      this.messageContent += '\n'
    },
    handlePaste (e) {
      let clipboardData = e.clipboardData
      let file
      if (
        clipboardData &&
        clipboardData.files &&
        clipboardData.files.length > 0
      ) {
        file = clipboardData.files[0]
      }

      if (typeof file === 'undefined') {
        return
      }
      // 1. 创建消息实例，接口返回的实例可以上屏
      let message = this.tim.createImageMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          file: file
        },
        onProgress: percent => {
          this.$set(message, 'progress', percent) // 手动给message 实例加个响应式属性: progress
        }
      })
      this.$store.commit('pushCurrentMessageList', message)

      // 2. 发送消息
      let promise = this.tim.sendMessage(message)
      promise.catch(error => {
        this.$store.commit('showMessage', {
          type: 'error',
          message: error.message
        })
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
      if (this.currentConversationType === this.TIM.TYPES.CONV_GROUP && this.groupAt) {
        let message = this.tim.createTextAtMessage({
          to: this.toAccount,
          conversationType: this.TIM.TYPES.CONV_GROUP,
          payload: {
            text: this.messageContent,
            atUserList: this.callingList // 'denny' 'lucy' 都是 userID，而非昵称
          }
        })
        this.$store.commit('pushCurrentMessageList', message)
        this.$bus.$emit('scroll-bottom')
        this.tim.sendMessage(message).catch(error => {
          this.$store.commit('showMessage', {
            type: 'error',
            message: error.message
          })
        })
        this.messageContent = ''
        this.groupAt = false
        return
      }
      const message = this.tim.createTextMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: { text: this.messageContent }
      })
      this.$store.commit('pushCurrentMessageList', message)
      this.$bus.$emit('scroll-bottom')
      this.tim.sendMessage(message).catch(error => {
        this.$store.commit('showMessage', {
          type: 'error',
          message: error.message
        })
      })
      this.messageContent = ''
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
    random (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
    sendSurvey () {
      const message = this.tim.createCustomMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          data: 'survey',
          description: String(this.rate),
          extension: this.suggestion
        }
      })
      this.$store.commit('pushCurrentMessageList', message)
      Object.assign(this.form, {
        data: '',
        description: '',
        extension: ''
      })
      this.tim
        .sendMessage(message)
        .then(() => {
          Object.assign(this, {
            rate: 5,
            suggestion: ''
          })
        })
        .catch(error => {
          this.$store.commit('showMessage', {
            type: 'error',
            message: error.message
          })
        })
      this.surveyDialogVisible = false
    },
    chooseEmoji (item) {
      this.messageContent += item
    },
    handleSendImageClick () {
      this.$refs.imagePicker.click()
    },
    handleSendFileClick () {
      this.$refs.filePicker.click()
    },
    handleSendVideoClick () {
      this.$refs.videoPicker.click()
    },
    groupLive () {
      this.$store.commit('updateGroupLiveInfo', {
        groupID: this.toAccount,
        anchorID: this.userID
      })
      this.$bus.$emit('open-group-live', { channel: 1 })
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
    handleRefresh () {
      this.refreshConversation()()
    },
    refreshConversation () {
      let that = this
      return function () {
        if (!that.timeout) {
          that.timeout = setTimeout(() => {
            that.timeout = null
            that.tim.getConversationList().then(() => {
              that.$store.commit('showMessage', {
                message: '刷新成功',
                type: 'success'
              })
            })
          }, 1000)
        }
      }
    },
    handleAddButtonClick () {
      this.showDialog = true
    },
    handleConfirm () {
      if (this.userID !== '@TIM#SYSTEM') {
        this.$store
          .dispatch('checkoutConversation', `C2C${this.userID}`)
          .then(() => {
            this.showDialog = false
          }).catch(() => {
            this.$store.commit('showMessage', {
              message: '没有找到该用户',
              type: 'warning'
            })
          })
      } else {
        this.$store.commit('showMessage', {
          message: '没有找到该用户',
          type: 'warning'
        })
      }
      this.userID = ''
    },
    handleKeydown (event) {
      if ((event.keyCode !== 38 && event.keyCode !== 40) || this.isCheckouting) {
        return
      }
      const currentIndex = this.conversationList.findIndex(
        item => item.conversationID === this.currentConversation.conversationID
      )
      if (event.keyCode === 38 && currentIndex - 1 >= 0) {
        this.checkoutPrev(currentIndex)
      }
      if (
        event.keyCode === 40 &&
        currentIndex + 1 < this.conversationList.length
      ) {
        this.checkoutNext(currentIndex)
      }
    },
    checkoutPrev (currentIndex) {
      this.isCheckouting = true
      this.$store
        .dispatch(
          'checkoutConversation',
          this.conversationList[currentIndex - 1].conversationID
        )
        .then(() => {
          this.isCheckouting = false
        })
        .catch(() => {
          this.isCheckouting = false
        })
    },
    checkoutNext (currentIndex) {
      this.isCheckouting = true
      this.$store
        .dispatch(
          'checkoutConversation',
          this.conversationList[currentIndex + 1].conversationID
        )
        .then(() => {
          this.isCheckouting = false
        })
        .catch(() => {
          this.isCheckouting = false
        })
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
.conversation-item-container
  padding 15px 20px
  cursor pointer
  position relative
  overflow hidden
  transition .2s
// &:first-child
//   padding-top 30px
&:hover
  background-color $background
  .close-btn
    right 3px
.close-btn
  position absolute
  right -20px
  top 3px
  color $font-dark
  transition: all .2s ease;
  &:hover
    color $danger
.warp
  display flex
.avatar
  width 40px
  height 40px
  margin-right 10px
  border-radius 50%
  flex-shrink 0
.content
  flex 1
  height 40px
  overflow hidden
  .row-1
    display flex
    line-height 21px
    .name
      color $font-light
      flex 1
      min-width 0
    .unread-count
      padding-left 10px
      flex-shrink 0
      color $font-dark
      font-size 12px
      .badge
        vertical-align bottom
        background-color $danger
        border-radius 10px
        color #FFF
        display inline-block
        font-size 12px
        height 18px
        max-width 40px
        line-height 18px
        padding 0 6px
        text-align center
        white-space nowrap
  .row-2
    display flex
    font-size 12px
    padding-top 3px
    .summary
      flex 1
      overflow hidden
      min-width 0
      color: $secondary
      .remind
        color $danger
    .date
      padding-left 10px
      flex-shrink 0
      text-align right
      color $font-dark
.choose {
  background-color: $background;
}
.context-menu-button {
  padding: 10px
  border: 2px solid $primary;
  border-radius: 8px;
}
.conversation-container {
  position absolute
  top 0
  left 0
  width 100%
  background-color #fff
  z-index 999
}
.conversation-list-btn {
  width 140px
  display flex
  float right
  margin 10px 0
  .conversation-btn {
    cursor pointer
    padding 6px 12px
    background #00A4FF
    color #ffffff
    font-size 14px
    border-radius 20px
    margin-left 13px
  }
}
.chat-bubble
  /*position relative*/
  .message-status
    display: flex;
    min-width: 25px;
    margin-right: 10px;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #6e7981;
  .message-content
    outline: none
    font-size 14px
    position relative
    max-width 350px
    word-wrap break-word
    word-break break-all
    padding 10px
    box-shadow: 0 5px 10px 0 rgba(0,0,0,.1);
    /*overflow hidden*/
    span
      white-space pre-wrap
      margin 0
      text-shadow $regular 0 0 0.05em
    img
      vertical-align bottom
    &::before
      position: absolute
      top: 0
      width: 12px
      height: 40px
      content "\e900"
      // content "\e906"
      font-family 'tim' !important
      font-size 24px // 32px 在mac上会模糊 24px正常 , window 24px模糊 28px 32px正常  36px windows mac 基本一致，但是太大
  .message-received
    background-color $white
    margin-left 15px
    border-radius 0 4px 4px 4px
    &::before
      left -10px
      transform scaleX(-1)
      color $white
    &.new
      transform: scale(0);
      transform-origin: top left;
      animation: bounce 500ms linear both;
  .message-send
    background-color $light-primary
    margin-right 15px
    border-radius 4px 0 4px 4px
    color $white
    &::before
      right: -10px
      color $light-primary
    &.new
      transform: scale(0);
      transform-origin: top right;
      animation: bounce 500ms linear both;
  .el-dropdown {
    vertical-align: top;
    display flex
    outline none
    border none
    /deep/ .focusing {
      outline none
      border none
    }
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }

  /deep/ .el-dropdown .el-dropdown-selfdefine:focus:active, .el-dropdown .el-dropdown-selfdefine:focus:not(.focusing) {
    outline-width: 0;
  }
.group-tip-element-wrapper
  background $white
  padding 4px 15px
  border-radius 3px
  color $secondary
  font-size 12px
// text-shadow $secondary 0 0 0.05em
.edit-button
  padding-top 4px
  height 20px
  font-size 10px
@keyframes bounce {
  0% { transform: matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  4.7% { transform: matrix3d(0.45, 0, 0, 0, 0, 0.45, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  9.41% { transform: matrix3d(0.883, 0, 0, 0, 0, 0.883, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  14.11% { transform: matrix3d(1.141, 0, 0, 0, 0, 1.141, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  18.72% { transform: matrix3d(1.212, 0, 0, 0, 0, 1.212, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  24.32% { transform: matrix3d(1.151, 0, 0, 0, 0, 1.151, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  29.93% { transform: matrix3d(1.048, 0, 0, 0, 0, 1.048, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  35.54% { transform: matrix3d(0.979, 0, 0, 0, 0, 0.979, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  41.04% { transform: matrix3d(0.961, 0, 0, 0, 0, 0.961, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  52.15% { transform: matrix3d(0.991, 0, 0, 0, 0, 0.991, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  63.26% { transform: matrix3d(1.007, 0, 0, 0, 0, 1.007, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  85.49% { transform: matrix3d(0.999, 0, 0, 0, 0, 0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  100% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
}
</style>
