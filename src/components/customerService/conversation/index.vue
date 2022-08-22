<template>
    <div id="box">
      <div class="box-left">
        <div class="top-bar">
          <span class="headimg">
            <img style="width: 50px;height: 50px" :src="'https://www.uniwarm.net' + headimg" alt="">
          </span>
          <div class="customerServiceInfo">
            <div style="width: 100%;height: 25px;display: flex">
              <span style="font-size: 14px;font-weight: bold;">会话客服{{ userId }}</span>
              <div
                style="font-size: 11px;margin-left: 20px;padding: 0 5px;color: #d79432;border: 1px solid #d79432;border-radius: 3px;height: 16px;line-height: 16px;cursor:pointer">
                提交下线
              </div>
<!--              <div id="icon" style="font-size: 20px">-->
<!--                <i @click="rebackVideo()" v-if="camera" class="el-icon-video-camera"></i>-->
<!--                <i @click="rebackList()" v-if="time" class="el-icon-time"></i>-->
<!--              </div>-->
            </div>
            <div style="width: 100%;height: 25px">
              <span style="font-size: 11px;color: #d79432">在线</span>
              <span style="font-size: 11px;margin-left: 20px">本次工作时长：1小时20分钟</span>
            </div>
          </div>
        </div>
        <div class="callInfo">
          <span>暂无用户请求</span>
<!--          <span v-if="shout">用户 '{{ this.inviterName }}' 呼叫... </span>-->
<!--          <span v-if="connect">正在接入用户 '{{ this.inviterName }}' ... </span>-->
<!--          <span v-if="calling">正在与 '{{ this.inviterName }}' 通话</span>-->
<!--          <el-button v-if="turnOn" class="turnOn" type="warning" size="mini" @click="handleAccept">接通</el-button>-->
        </div>
        <div class="videoList">
          <side-bar />
        </div>
      </div>
      <div class="box-middle">
        <div class="video-call-section">
          <current-conversation />
        </div>
      </div>
      <div class="box-right-top">
        <div class="box-right">
          <span class="tab" v-on:click="handleClickTab('historySlip')" v-bind:class="{'selected':buttonSelected==='historySlip'}">历史服务单</span>
          <span class="tab" style="margin-top: 50px;" v-on:click="handleClickTab('consationSlip')" v-bind:class="{'selected':buttonSelected==='consationSlip'}">会话服务单</span>
          <!--会话服务单-->
          <div class="historyServiceInfo" style="padding: 30px" v-if="conversationSlip">
            <h4 style="width: 100%;text-align: center">会话服务单</h4>
            <el-form style="margin-top: 30px;" ref="form" :model="form" label-width="100px">
              <el-form-item label="服务单名称 :">
                <el-input size="small" v-model="form.name" placeholder="请输入服务单名称"></el-input>
              </el-form-item>
              <el-form-item label="联系方式 :">
                <el-input size="small" v-model="form.phone" placeholder="请输入联系方式"></el-input>
              </el-form-item>
              <el-form-item label="咨询产品 :">
                <el-select
                  size="small"
                  style="width: 100%"
                  v-model="form.consultProduct"
                  multiple
                  collapse-tags
                  placeholder="请选择咨询产品">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="用户问题 :">
                <el-input size="small" type="textarea" :rows="5" v-model="form.desc"></el-input>
              </el-form-item>
              <el-form-item label="解决方式 :">
                <el-select style="width: 100%" size="small" v-model="form.type" placeholder="请选择解决方式">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="售后单 :">
                <el-upload
                  class="upload-demo"
                  action="/"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  multiple
                  :http-request="uploadFile"
                  :file-list="form.fileList">
                  <el-button class="addlist" size="mini" type="primary">添加售后单</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button class="handleSaveEnd" size="mini" type="primary" @click="onSubmit">保存并结束会话</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!--历史服务单-->
          <div class="historyServiceInfo" v-if="checkDetail">
            <div class="historyService" v-if="historyService">
              <h4 style="width: 100%;text-align: center">历史服务单</h4>
              <div class="historyList">
                <div class="historyList-line" v-for="(hs, ind) in historyList" v-bind:key="ind" @click="handleClick(hs)">
                  <span class="historyService-message">{{ hs.message }}</span>
                  <span class="historyService-date">{{ hs.date }}</span>
                  <span class="historyService-code">{{ hs.code }}</span>
                  <span class="historyService-name">{{ hs.name }}</span>
                </div>
              </div>
            </div>
            <!--历史服务单详情-->
            <div class="historyDetail" v-if="historyDetail">
              <div style="color: #d79432; cursor: pointer" @click="toback">
                <i class="el-icon-arrow-left" />
                返回
              </div>
              <h4 style="width: 100%;text-align: center;">服务详情</h4>
              <table style="margin-top: 20px;">
                <tr>
                  <td class="table-row-title">20220411 (ID)</td>
                  <td class="table-row-value" style="color: #d79432">&nbsp;&nbsp;&nbsp;包装破损需要退款</td>
                </tr>
                <tr>
                  <td class="table-row-title">用户名称：</td>
                  <td class="table-row-value">{{ historyDetailInfo.name }}</td>
                  <td class="table-row-title">用户id：</td>
                  <td class="table-row-value">{{ historyDetailInfo.id }}</td>
                </tr>
                <tr>
                  <td class="table-row-title">联系方式：</td>
                  <td class="table-row-value">{{ historyDetailInfo.phone }}</td>
                  <td class="table-row-title">会话类型：</td>
                  <td class="table-row-value">{{ historyDetailInfo.type }}</td>
                </tr>
                <tr>
                  <td class="table-row-title">接待客服：</td>
                  <td class="table-row-value">{{ historyDetailInfo.customerServiceName }}</td>
                  <td class="table-row-title">会话时间：</td>
                  <td class="table-row-value">{{ historyDetailInfo.time }}</td>
                </tr>
                <tr>
                  <td class="table-row-title">资讯产品：</td>
                  <td class="table-row-value" colspan="3">{{ historyDetailInfo.product }}</td>
                </tr>
                <tr>
                  <td class="table-row-title">用户问题：</td>
                  <td class="table-row-value" style="padding-top: 20px" colspan="3">{{ historyDetailInfo.problem }}</td>
                </tr>
                <tr>
                  <td class="table-row-title">解决方式：</td>
                  <td class="table-row-value" colspan="3">{{ historyDetailInfo.way }}</td>
                </tr>
                <tr>
                  <td class="table-row-title">售后单：</td>
                  <td colspan="3"></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <image-previewer />
    </div>
</template>

<script>
import { Notification } from 'element-ui'
import { mapState } from 'vuex'
import CurrentConversation from './components/conversation/current-conversation'
import ImagePreviewer from './components/message/image-previewer.vue'
import SideBar from './components/layout/side-bar'
import Login from './components/user/login'
import { translateGroupSystemNotice } from './utils/common'
import { ACTION } from './utils/trtcCustomMessageMap'

export default {
  title: 'TIMSDK DEMO',
  data () {
    return {
      loginType: 2, // github 登录只使用默认账号登录
      userId: '',
      userSig: '',
      sdkAppID: 1400589788,
      checkDetail: true,
      conversationSlip: false,
      historyService: true,
      historyDetail: false,
      historyDetailInfo: {},
      headimg: '',
      form: {
        name: '',
        phone: '',
        consultProduct: '',
        desc: '',
        type: '',
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
          {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
        ]
      },
      historyList: [
        {
          id: '1',
          message: '关于快递停发通知造成的发货延误',
          date: '2022.2.10 14:47',
          code: 'SF14619616184583',
          name: '客服001',
          detail: {
            name: '小白',
            id: '1314520',
            phone: '123456789',
            type: '视频',
            customerServiceName: '0001',
            time: '2022.2.14 16:54',
            product: '黑色公文包',
            problem: '巴拉巴拉巴拉巴拉巴拉巴拉',
            way: '退换处理'
          }
        },
        {
          id: '2',
          message: '关于快递停发通知造成的发货延误',
          date: '2022.2.10 14:47',
          code: 'SF14619616184583',
          name: '客服002',
          detail: {
            name: '小黑',
            id: '16516161',
            phone: '18649461613',
            type: '电话',
            customerServiceName: '0001',
            time: '2022.2.14 16:54',
            product: '白色鳄鱼皮包',
            problem: '美国弄完就公婆我今儿个胖娃价格',
            way: '维修保养'
          }
        }
      ],
      buttonSelected: 'historySlip'
    }
  },
  components: {
    Login,
    SideBar,
    CurrentConversation,
    ImagePreviewer
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
    }),
    // 是否显示 Loading 状态
    showLoading () {
      return !this.isSDKReady
    }
  },
  mounted () {
    // 初始化监听器
    this.initListener()
  },
  created () {
    this.headimg = sessionStorage.getItem('headimg')
    this.userId = sessionStorage.getItem('video_id')
    console.log('当前登陆的客服的ID', this.userId)
    this.userSig = sessionStorage.getItem('usersig')
    this.login()
    this.handleClickTab('historySlip')
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
    login () {
      this.loading = true
      const userSig = this.userSig
      const sdkAppID = this.sdkAppID
      const userID = this.userId
      this.tim
        .login({
          userID: userID,
          userSig: userSig
        })
        .then(() => {
          this.loading = false
          this.$store.commit('toggleIsLogin', true)
          this.$store.commit('startComputeCurrent')
          this.$store.commit({
            type: 'GET_USER_INFO',
            userID: userID,
            userSig: userSig,
            sdkAppID: sdkAppID
          })
          console.log(this.userId, '聊天')
          console.log(this.userSig, '聊天')
          console.log(this.sdkAppID, '聊天')
          // this.$store.commit('showMessage', {
          //   type: 'success',
          //   message: '登录成功'
          // })
        })
      // .catch(error => {
      //   this.loading = false
      //   // this.$store.commit('showMessage', {
      //   //   message: '登录失败：' + error.message,
      //   //   type: 'error'
      //   // })
      // })
    },
    onFriendApplicationListUpdated (data) {
      this.$store.commit('updateApplicationList', data.data.friendApplicationList)
      this.$store.commit('updateUnreadCount', data.data.unreadCount)
    },
    onFriendListUpdated (data) {
      this.$store.commit('updateFriendList', data.data)
    },
    onFriendGroupListUpdated (data) {
      this.$store.commit('updateFriendGroupList', data.data)
    },

    onReceiveMessage ({ data: messageList }) {
      console.error(messageList, 'received msg')
      this.handleVideoMessage(messageList)
      this.handleQuitGroupTip(messageList)
      this.handleCloseGroupLive(messageList)
      this.$store.commit('pushCurrentMessageList', messageList)
      this.$store.commit('pushAvChatRoomMessageList', messageList)
    },

    onError ({ data }) {
      if (data.message !== 'Network Error') {
        this.$store.commit('showMessage', {
          message: data.message,
          type: 'error'
        })
      }
    },
    onMessageReadByPeer () {

    },
    onReadyStateUpdate ({ name }) {
      const isSDKReady = name === this.TIM.EVENT.SDK_READY
      this.$store.commit('toggleIsSDKReady', isSDKReady)

      if (isSDKReady) {
        this.tim
          .getMyProfile()
          .then(({ data }) => {
            this.$store.commit('updateCurrentUserProfile', data)
          })
          .catch(error => {
            this.$store.commit('showMessage', {
              type: 'error',
              message: error.message
            })
          })
        // this.$store.dispatch('getBlacklist')
        // // 登录trtc calling
        // this.trtcCalling.login({
        //   sdkAppID: this.sdkAppID,
        //   userID: this.userID,
        //   userSig:this.userSig
        // })
      }
    },
    kickedOutReason (type) {
      switch (type) {
        case this.TIM.TYPES.KICKED_OUT_MULT_ACCOUNT:
          return '由于多实例登录'
        case this.TIM.TYPES.KICKED_OUT_MULT_DEVICE:
          return '由于多设备登录'
        case this.TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED:
          return '由于 userSig 过期'
        default:
          return ''
      }
    },
    checkoutNetState (state) {
      switch (state) {
        case this.TIM.TYPES.NET_STATE_CONNECTED:
          return { message: '已接入网络', type: 'success' }
        case this.TIM.TYPES.NET_STATE_CONNECTING:
          return { message: '当前网络不稳定', type: 'warning' }
        case this.TIM.TYPES.NET_STATE_DISCONNECTED:
          return { message: '当前网络不可用', type: 'error' }
        default:
          return ''
      }
    },
    onNetStateChange (event) {
      this.$store.commit('showMessage', this.checkoutNetState(event.data.state))
    },

    onKickOut (event) {
      this.$store.commit('showMessage', {
        message: `${this.kickedOutReason(event.data.type)}被踢出，请重新登录。`,
        type: 'error'
      })
      this.$store.commit('toggleIsLogin', false)
      this.$store.commit('reset')
    },
    onUpdateConversationList (event) {
      this.$store.commit('updateConversationList', event.data)
    },

    onUpdateGroupList (event) {
      this.$store.commit('updateGroupList', event.data)
    },
    onReceiveGroupSystemNotice (event) {
      const isKickedout = event.data.type === 4
      const isCurrentConversation =
        `GROUP${event.data.message.payload.groupProfile.groupID}` ===
        this.currentConversation.conversationID
      // 在当前会话被踢，需reset当前会话
      if (isKickedout && isCurrentConversation) {
        this.$store.commit('resetCurrentConversation')
      }
      Notification({
        title: '新系统通知',
        message: translateGroupSystemNotice(event.data.message),
        duration: 3000,
        onClick: () => {
          const SystemConversationID = '@TIM#SYSTEM'
          this.$store.dispatch('checkoutConversation', SystemConversationID)
        }
      })
    },

    selectConversation (conversationID) {
      if (conversationID !== this.currentConversation.conversationID) {
        this.$store.dispatch('checkoutConversation', conversationID)
      }
    },
    // isJsonStr(str) {
    //   try{
    //     JSON.parse(str)
    //     return true
    //   }catch {
    //     return false
    //   }
    // },
    handleVideoMessage (messageList) {
      const videoMessageList = messageList.filter(
        message => message.type === this.TIM.TYPES.MSG_CUSTOM && JSON.parse(message.payload.data)
        // message => message.type === this.TIM.TYPES.MSG_CUSTOM && this.isJsonStr(message.payload.data)

      )
      if (videoMessageList.length === 0) return
      const videoPayload = JSON.parse(videoMessageList[0].payload.data)
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_DIALING) {
        if (this.isBusy) {
          this.$bus.$emit('busy', videoPayload, videoMessageList[0])
          return
        }
        this.$store.commit('GENERATE_VIDEO_ROOM', videoPayload.room_id)
        this.selectConversation(videoMessageList[0].conversationID) // 切换当前会话页
        if (videoMessageList[0].from !== this.userID) {
          this.$bus.$emit('isCalled')
        }
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_SPONSOR_CANCEL) {
        this.$bus.$emit('missCall')
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_REJECT) {
        this.$bus.$emit('isRefused')
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_SPONSOR_TIMEOUT) {
        this.$bus.$emit('missCall')
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_ACCEPTED) {
        this.$bus.$emit('isAccept')
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_HANGUP) {
        this.$bus.$emit('isHungUp')
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_LINE_BUSY) {
        this.$bus.$emit('isRefused')
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_ERROR) {
        this.$bus.$emit('isRefused')
      }
    },
    /**
     * 使用 window.Notification 进行全局的系统通知
     * @param {Message} message
     */
    notifyMe (message) {
      // 需检测浏览器支持和用户授权
      if (!('Notification' in window)) {

      } else if (window.Notification.permission === 'granted') {
        this.handleNotify(message)
      } else if (window.Notification.permission !== 'denied') {
        window.Notification.requestPermission().then(permission => {
          // 如果用户同意，就可以向他们发送通知
          if (permission === 'granted') {
            this.handleNotify(message)
          }
        })
      }
    },
    handleNotify (message) {
      const notification = new window.Notification('有人提到了你', {
        icon: 'https://web.sdk.qcloud.com/im/assets/images/logo.png',
        body: message.payload.text
      })
      notification.onclick = () => {
        window.focus()
        this.$store.dispatch('checkoutConversation', message.conversationID)
        notification.close()
      }
    },
    /**
     * 收到有群成员退群/被踢出的groupTip时，需要将相关群成员从当前会话的群成员列表中移除
     * @param {Message[]} messageList
     */
    handleQuitGroupTip (messageList) {
      // 筛选出当前会话的退群/被踢群的 groupTip
      const groupTips = messageList.filter(message => {
        return this.currentConversation.conversationID === message.conversationID &&
          message.type === this.TIM.TYPES.MSG_GRP_TIP &&
          (message.payload.operationType === this.TIM.TYPES.GRP_TIP_MBR_QUIT ||
            message.payload.operationType === this.TIM.TYPES.GRP_TIP_MBR_KICKED_OUT)
      })
      // 清理当前会话的群成员列表
      if (groupTips.length > 0) {
        groupTips.forEach(groupTip => {
          if (Array.isArray(groupTip.payload.userIDList) || groupTip.payload.userIDList.length > 0) {
            this.$store.commit('deleteGroupMemberList', groupTip.payload.userIDList)
          }
        })
      }
    },
    /**
     * 收到结束直播自定义消息，派发事件关闭组件
     * @param {Message[]} messageList
     */
    handleCloseGroupLive (messageList) {
      messageList.forEach(message => {
        if (this.currentConversation.conversationID === message.conversationID && message.type === this.TIM.TYPES.MSG_CUSTOM) {
          let data = {}
          try {
            data = JSON.parse(message.payload.data)
          } catch (e) {
            data = {}
          }
          if (data.roomId && Number(data.roomStatus) === 0) {
            this.$bus.$emit('close-group-live')
          }
        }
      })
    },
    // 点击历史服务单
    clickHistoryslip () {
      this.checkDetail = true
      this.conversationSlip = false
    },
    // 点击会话服务单
    clickConversationslip () {
      this.checkDetail = false
      this.conversationSlip = true
    },
    handleClickTab (e) {
      this.buttonSelected = e
      if (e === 'historySlip') {
        this.checkDetail = true
        this.conversationSlip = false
      } else if (e === 'consationSlip') {
        this.checkDetail = false
        this.conversationSlip = true
      }
    },
    // 历史服务单详情
    handleClick (hs) {
      console.log(hs)
      this.historyDetailInfo = hs
      this.historyDetail = true
      this.historyService = false
    },
    // 历史服务单详情返回
    toback () {
      this.historyService = true
      this.historyDetail = false
    }
  }
}
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#box {
  width: 100%;
  /*min-width: 100%;*/
  height: calc(100vh - 175px);
  margin: 0 auto;
  background-color: #F3F4F9;
  display: flex;
}

.box-left {
  width: 22%;
  height: 100%;
  min-width: 350px;
  overflow: hidden;
  /*border: 1px solid red;*/
  background-color: #f3f4f9;
}

.top-bar {
  width: 100%;
  height: 100px;
  /*border: 1px solid blue;*/
  display: flex;
}

.headimg {
  width: 50px;
  height: 50px;
  border-radius: 50px;
  margin: 25px 20px 25px 40px;
}

.customerServiceInfo {
  height: 50px;
  margin-top: 25px;
  width: calc(100% - 110px);
  position: relative;
}

#icon {
  width: 40px;
  height: 40px;
  font-size: 30px;
  position: absolute;
  right: 0;
  top: -5px;
  cursor: pointer;
}

.box-middle {
  width: 50%;
  height: 100%;
  min-width: 650px;
  background-color: #E9EBF4;
  position: relative;
  /*z-index: 1;*/
  overflow: hidden;
  /*border-right: 1px solid lightgrey;*/
  overflow-y: scroll;
}
.box-middle::-webkit-scrollbar {
  width: 10px;
}

.box-middle::-webkit-scrollbar-thumb {
  background: #D5D7DD;
  border-radius: 4px;
}

.box-middle:hover::-webkit-scrollbar-thumb {
  background: #D5D7DD;
}

.box-middle:hover::-webkit-scrollbar-track {
  background: rgb(233, 235, 244);
}
.box-right-top{
  width: 28%;
  height: 100%;
  min-width: 400px;
  position: relative;
}
.box-right {
  width: 100%;
  height: 100%;
  /*border: 1px solid black;*/
  background-color: #f3f4f9;
  box-sizing: border-box;
  padding: 0 30px;
  /*position: relative;*/
  overflow-y: scroll;
}
.box-right::-webkit-scrollbar {
  width: 10px;
}

.box-right::-webkit-scrollbar-thumb {
  background: #D5D7DD;
  border-radius: 4px;
}

.box-right:hover::-webkit-scrollbar-thumb {
  background: #D5D7DD;
}

.box-right:hover::-webkit-scrollbar-track {
  background: rgb(243, 244, 249);
}
.box-right .historyTag:focus{
  color: #d79432;
  font-weight: bold;
}
.tab{
  width: 100px;
  height: 30px;
  font-size: 12px;
  background-color: white;
  text-align: center;
  line-height: 30px;
  color: black;
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
  position: absolute;
  top: 10px;
  left: -101px;
  z-index: 1000;
  cursor: pointer;
}
.selected {
  color: #d79432;
  font-weight: bold;
}

@media screen and (max-width: 767px) {
}

.video-call-section {
  width: 100%;
  height: 100%;
  /*border: 1px solid white;*/
}

@media screen and (max-width: 767px) {
  .video-conference-list {
    margin: 0;
  }

  .user-video-container {
    margin: 5px;
  }
}
.upload-demo:hover {
  border-color: #409eff;
}
.upload-demo{
  padding: 10px;
  border-radius: 6px;
  border: 1px dashed #d9d9d9;
}
.addlist{
  background-color: rgb(243, 244, 249);
  color: #d79432;
  border:1px solid #d79432;
  border-radius: 3px;
}

.callInfo {
  width: 100%;
  height: 30px;
  background-color: #D5D7DD;
  line-height: 30px;
  text-align: center;
  position: relative;
  font-size: 12px;
  box-sizing: border-box;
}

.videoList {
  width: 100%;
  height: calc(100% - 130px);
  /*border: 1px solid blue;*/
  /*overflow: hidden;*/
  overflow-y: scroll;
}
.videoList::-webkit-scrollbar {
  width: 0;
}

.videoList::-webkit-scrollbar-thumb {
  background: #D5D7DD;
  border-radius: 4px;
}

.videoList:hover::-webkit-scrollbar-thumb {
  background: #D5D7DD;
}

.videoList:hover::-webkit-scrollbar-track {
  background: #F3F4F9;
}

.historyService {
  width: 100%;
  height: 100%;
  /*padding: 30px 30px;*/
  /*border: 1px solid red;*/
  box-sizing: border-box;
  background-color: #f3f4f9;
}

.historyList {
  /*border: 1px solid blue;*/
  margin-top: 40px;
  margin-left: 5%;
  margin-right: 5%;
}

.historyList-line {
  width: 100%;
  height: 80px;
  border-radius: 10px;
  background-color: white;
  margin-bottom: 20px;
  box-sizing: border-box;
  padding: 10px 20px;
  position: relative;
  cursor: pointer;
}
.historyList-line:hover{
  /*background-color: rgb(244, 245, 250);*/
}

.historyService-message {
  font-size: 13px;
  font-weight: 600;
}

.historyService-date {
  position: absolute;
  right: 20px;
  font-size: 12px;
  top: 13px;
}

.historyService-code {
  position: absolute;
  bottom: 10px;
  left: 20px;
  font-size: 12px;
  font-weight: 600;
}

.historyService-name {
  position: absolute;
  right: 20px;
  bottom: 10px;
  font-size: 12px;
  font-weight: 600;
}

.historyServiceInfo {
  width: 100%;
  height: 100%;
  padding: 30px 0;
  box-sizing: border-box;
}
.historyDetail{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #f3f4f9;
}

.table-row-title {
  width: 100px;
  height: 50px;
  line-height: 50px;
  font-weight: 600;
  font-size: 13px;
  min-width: 100px;
}
.handleSaveEnd{
  margin-bottom: 30px;
  position: absolute;
  right: 0;
}
.table-row-value {
  font-size: 13px;
}
</style>
