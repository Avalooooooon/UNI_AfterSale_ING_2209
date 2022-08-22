<template>
  <div>
    <div id="box">
      <div class="box-left">
        <div class="top-bar">
          <span class="headimg">
            <img style="width: 50px;height: 50px" :src="url + headimg" alt="">
          </span>
          <div class="customerServiceInfo">
            <div style="width: 100%;height: 25px;display: flex">
              <h6>会话客服{{ userId }}</h6>
              <div
                style="font-size: 11px;margin-left: 20px;padding: 0 5px;color: #d79432;border: 1px solid #d79432;border-radius: 3px;height: 16px;line-height: 16px;cursor:pointer">
                提交下线
              </div>
              <div id="icon" style="font-size: 20px">
                <i @click="rebackVideo()" v-if="camera" class="el-icon-video-camera"></i>
                <i @click="rebackList()" v-if="time" class="el-icon-time"></i>
              </div>
            </div>
            <div style="width: 100%;height: 25px">
              <span style="font-size: 11px;color: #d79432">在线</span>
              <span style="font-size: 11px;margin-left: 20px">本次工作时长：1小时20分钟</span>
            </div>
          </div>
        </div>
        <div class="callInfo">
          <span v-if="none">暂无用户请求</span>
          <span v-if="shout">用户 '{{ this.inviterName }}' 呼叫... </span>
          <span v-if="connect">正在接入用户 '{{ this.inviterName }}' ... </span>
          <span v-if="calling">正在与 '{{ this.inviterName }}' 通话</span>
          <el-button v-if="turnOn" class="turnOn" type="warning" size="mini" @click="handleAccept">接通</el-button>
        </div>
        <div class="video-conference-list" v-if="videoModel">
          <div
            v-for="userId in meetingUserIdList.filter(userId => userId === this.inviterName)"
            :key="`video-${userId}`"
            :id="`video-${userId}`"
            :class="{'user-video-container': true, 'is-me': userId === loginUserInfo.userId}"
          >
            <div class="user-status">
              <div
                :class="{'user-video-status': true, 'is-mute': isUserMute(muteVideoUserIdList, userId)}"
              ></div>
              <div
                :class="{'user-audio-status': true, 'is-mute': isUserMute(muteAudioUserIdList, userId)}"
              ></div>
            </div>
            <div class="video-item-username">{{ userId2Name[userId] || userId }}</div>
          </div>
        </div>
        <div class="videoList" v-if="listModel">
          <div class="videoList-line" v-for="(item, index) in videoList" v-bind:key="index"
               @click="handleCustomer(item)">
            <div class="image"><img style="width: 100%;height: 100%;border-radius: 5px" :src="item.img" alt=""></div>
            <span style="margin-left: 30px;font-size: 14px">{{ item.name }}</span>
            <span style="position: absolute;right: 100px;font-size: 12px;color: #B2B7C5">{{ item.type }}</span>
            <span style="position: absolute;right: 30px;font-size: 12px">{{ item.date }}</span>
          </div>
        </div>
      </div>
      <div class="box-middle">
<!--        历史记录单-->
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
<!--          <div class="box" style="width: 280px;height: 280px;line-height: 280px;border: 1px solid black;text-align: center;vertical-align: middle;">-->
<!--            <img style="width: 100px;height: 100px;vertical-align: middle" src="https://img2.baidu.com/it/u=429697566,1955344911&fm=253&fmt=auto&app=138&f=JPEG?w=200&h=200" alt="">-->
<!--            文字信息-->
<!--          </div>-->
        </div>
<!--        视频聊天-->
        <div class="video-call-section" v-if="videoCall">
          <div :class="{ 'video-conference': true, 'is-show': isShowVideoCall }">

            <div class="video-conference-list">
              <div
                v-for="userId in meetingUserIdList.filter(userId => userId === loginUserInfo.userId)"
                :key="`video-${userId}`"
                :id="`video-${userId}`"
                :class="{'user-video-container': true, 'is-me': userId === loginUserInfo.userId}"
              >
                <div class="user-status">
                  <div
                    :class="{'user-video-status': true, 'is-mute': isUserMute(muteVideoUserIdList, userId)}"
                  ></div>
                  <div
                    :class="{'user-audio-status': true, 'is-mute': isUserMute(muteAudioUserIdList, userId)}"
                  ></div>
                </div>
                <div class="video-item-username">{{ userId2Name[userId] || userId }}</div>
              </div>
            </div>
            <div class="video-conference-action" v-if="operation">
              <el-button
                class="action-btn"
                type="success"
                @click="toggleVideo"
              >{{ isVideoOn ? '关闭摄像头' : '打开摄像头' }}
              </el-button>

              <el-button
                class="action-btn"
                type="success"
                @click="toggleAudio"
              >{{ isAudioOn ? '关闭麦克风' : '打开麦克风' }}
              </el-button>

              <el-button class="action-btn" type="danger" @click="handleHangup">挂断</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="box-right-top">
        <div class="box-right">
          <span class="tab" v-on:click="handleClickTab('historySlip')" v-bind:class="{'selected':buttonSelected==='historySlip'}">历史服务单</span>
          <span class="tab" style="margin-top: 50px;" v-on:click="handleClickTab('consationSlip')" v-bind:class="{'selected':buttonSelected==='consationSlip'}">会话服务单</span>
          <!--会话服务单-->
          <div class="historyServiceInfo" v-if="conversationSlip">
            <h4 style="width: 100%; text-align: center">会话服务单</h4>
            <el-form style="margin-top: 30px;position: relative" ref="form" :model="form" label-width="100px">
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
              <el-form-item label="会话截图 :">
                <div class="screenshot">
                  <div class="screenshot-picture"></div>
                  <div class="screenshot-picture"></div>
                  <div class="screenshot-picture"></div>
                  <div class="screenshot-picture"></div>
                </div>
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
            <h4 style="width: 100%; text-align: center">服务详情</h4>
            <h6 style="width: 100%; text-align: center; margin-top: 20px">包装破损需要退款</h6>
            <table style="width: 100%;margin-top: 20px">
              <tr>
                <td class="table-row-title">用户名称：</td>
                <td class="table-row-value">{{ detailInfo.name }}</td>
                <td class="table-row-title">用户id：</td>
                <td class="table-row-value">{{ detailInfo.id }}</td>
              </tr>
              <tr>
                <td class="table-row-title">联系方式：</td>
                <td class="table-row-value">{{ detailInfo.phone }}</td>
                <td class="table-row-title">会话类型：</td>
                <td class="table-row-value">{{ detailInfo.type }}</td>
              </tr>
              <tr>
                <td class="table-row-title">接待客服：</td>
                <td class="table-row-value">{{ detailInfo.customerServiceName }}</td>
                <td class="table-row-title">会话时间：</td>
                <td class="table-row-value">{{ detailInfo.time }}</td>
              </tr>
              <tr>
                <td class="table-row-title">资讯产品：</td>
                <td class="table-row-value" colspan="3">{{ detailInfo.product }}</td>
              </tr>
              <tr>
                <td class="table-row-title">用户问题：</td>
                <td class="table-row-value" style="padding-top: 20px" colspan="3">{{ detailInfo.problem }}</td>
              </tr>
              <tr>
                <td class="table-row-title">会话截图：</td>
                <td colspan="3">
                  <!--                <span style="font-size: 12px;color: #D79432">全部 > </span>-->
                  <div class="screenshot">
                    <div class="screenshot-picture"></div>
                    <div class="screenshot-picture"></div>
                    <div class="screenshot-picture"></div>
                    <div class="screenshot-picture"></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="table-row-title">解决方式：</td>
                <td class="table-row-value" colspan="3">{{ detailInfo.way }}</td>
              </tr>
              <tr>
                <td class="table-row-title">售后单：</td>
                <td colspan="3"></td>
              </tr>
            </table>
          </div>
          <!--历史服务单结束-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {log} from '../../../utils'
import {getUsernameByUserid} from '../../../service'

let timeout

export default {
  watch: {
    isLogin: function (newIsLogin, oldIsLogin) {
      if (newIsLogin !== oldIsLogin) {
        if (newIsLogin) {
          if (this.$router.history.current.path === '/login') {
            // 防止已在 '/' 路由下再次 push
            this.$router.push('/')
          }
        } else {
          this.$router.push('/login')
        }
      }
    },
    callStatus: function (newStatus, oldStatus) {
      // 作为被邀请者, 建立通话连接
      if (newStatus !== oldStatus && newStatus === 'connected') {
        this.startMeeting()
        this.updateUserId2Name(this.meetingUserIdList)
      }
    },
    meetingUserIdList: function (newList, oldList) {
      if (newList !== oldList || newList.length !== oldList) {
        this.updateUserId2Name(newList)
      }
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.isLogin,
      loginUserInfo: state => state.loginUserInfo,
      callStatus: state => state.callStatus,
      isAccepted: state => state.isAccepted,
      meetingUserIdList: state => state.meetingUserIdList,
      muteVideoUserIdList: state => state.muteVideoUserIdList,
      muteAudioUserIdList: state => state.muteAudioUserIdList,
      isInviter: state => state.isInviter
    })
  },
  data () {
    return {
      width: '', // 页面宽度
      SDKAPPIDConfig: 1400589788,
      SECRETKEYConfig: 'ca448d4e7634381fabfb70462588c6d0a768a2a2b9d560581c737fb4b7b170f3',
      url: 'https://www.uniwarm.net',
      headimg: '',
      labelPosition: 'left',
      // form: {
      //   name: '',
      //   phone: '',
      //   production: '',
      //   problem: '',
      //   type: ''
      // },
      userId: '',
      userSig: '',
      callTypeDisplayName: '',
      isShowNewInvitationDialog: false,
      isInviterCanceled: false,
      isVideoOn: true,
      inviteID: '',
      inviteData: {},
      inviterName: '',
      isShowVideoCall: true,
      isAudioOn: true,
      userId2Name: {},
      callFlag: false,
      cancelFlag: false,
      loading: false,
      none: true,
      shout: false,
      connect: false,
      calling: false,
      turnOn: false,
      operation: false,
      videoCall: false,
      camera: true,
      time: false,
      videoModel: false,
      listModel: true,
      historyService: true,
      detailInfo: [],
      historyList: [],
      checkDetail: false,
      conversationSlip: true,
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
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
      videoList: [
        {
          id: '01',
          img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2022%252F0302%252Fc2d81864j00r843200014c000bl00blg.jpg%26thumbnail%3D660x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653794014&t=c4e2c7084d5d8d23f739528abf04fc40',
          name: '熊大',
          type: '已结束',
          date: '15:30',
          historyServiceList: [
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
              name: '客服001',
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
          ]
        },
        {
          id: '02',
          img: 'https://img0.baidu.com/it/u=2243311923,806496101&fm=253&fmt=auto&app=120&f=JPEG?w=640&h=637',
          name: '熊二',
          type: '已结束',
          date: '15:30'
        }
      ],
      buttonSelected: 'consationSlip'
    }
  },
  mounted () {
    if (this.callStatus === 'connected' && !this.isInviter) {
      this.startMeeting()
      this.updateUserId2Name(this.meetingUserIdList)
    }
  },
  destroyed () {
    this.removeListener()
    this.$store.commit('updateMuteVideoUserIdList', [])
    this.$store.commit('updateMuteAudioUserIdList', [])
    if (this.callStatus === 'connected') {
      this.$trtcCalling.hangup()
      this.$store.commit('updateCallStatus', 'idle')
    }
  },
  created () {
    this.headimg = sessionStorage.getItem('headimg')
    this.userId = sessionStorage.getItem('video_id')
    this.userSig = sessionStorage.getItem('usersig')
    // console.log(this.userId, '0000000000')
    this.login()
    this.initListener()
    this.handleClickTab('consationSlip')
    // await this.handleAutoLogin();
  },
  methods: {
    // 登录 trtcCalling
    login () {
      const userId = this.userId
      this.$store.commit('userLoginSuccess')
      const userSig = this.userSig
      this.$store.commit('setLoginUserInfo', {
        userId,
        userSig
      })
      this.$trtcCalling.login({
        userID: this.userId,
        userSig: this.userSig
      })
      console.log(this.userId, '视频')
      console.log(this.userSig, '视频')
    },
    handleAutoLogin: async function () {
    },
    initListener: function () {
      this.$trtcCalling.on(this.TrtcCalling.EVENT.ERROR, this.handleError)
      this.$trtcCalling.on(
        this.TrtcCalling.EVENT.INVITED,
        this.handleNewInvitationReceived
      )
      this.$trtcCalling.on(
        this.TrtcCalling.EVENT.USER_ACCEPT,
        this.handleUserAccept
      )
      this.$trtcCalling.on(
        this.TrtcCalling.EVENT.USER_ENTER,
        this.handleUserEnter
      )
      this.$trtcCalling.on(
        this.TrtcCalling.EVENT.USER_LEAVE,
        this.handleUserLeave
      )
      this.$trtcCalling.on(
        this.TrtcCalling.EVENT.REJECT,
        this.handleInviteeReject
      )
      this.$trtcCalling.on(
        this.TrtcCalling.EVENT.LINE_BUSY,
        this.handleInviteeLineBusy
      )
      this.$trtcCalling.on(
        this.TrtcCalling.EVENT.CALLING_CANCEL,
        this.handleInviterCancel
      )
      this.$trtcCalling.on(
        this.TrtcCalling.EVENT.KICKED_OUT,
        this.handleKickedOut
      )
      this.$trtcCalling.on(
        this.TrtcCalling.EVENT.CALLING_TIMEOUT,
        this.handleCallTimeout
      )
      this.$trtcCalling.on(
        this.TrtcCalling.EVENT.NO_RESP,
        this.handleNoResponse
      )
      this.$trtcCalling.on(
        this.TrtcCalling.EVENT.CALLING_END,
        this.handleCallEnd
      )
      this.$trtcCalling.on(
        this.TrtcCalling.EVENT.USER_VIDEO_AVAILABLE,
        this.handleUserVideoChange
      )
      this.$trtcCalling.on(
        this.TrtcCalling.EVENT.USER_AUDIO_AVAILABLE,
        this.handleUserAudioChange
      )
    },
    removeListener: function () {
      this.$trtcCalling.off(this.TrtcCalling.EVENT.ERROR, this.handleError)
      this.$trtcCalling.off(
        this.TrtcCalling.EVENT.INVITED,
        this.handleNewInvitationReceived
      )
      this.$trtcCalling.off(
        this.TrtcCalling.EVENT.USER_ACCEPT,
        this.handleUserAccept
      )
      this.$trtcCalling.off(
        this.TrtcCalling.EVENT.USER_ENTER,
        this.handleUserEnter
      )
      this.$trtcCalling.off(
        this.TrtcCalling.EVENT.USER_LEAVE,
        this.handleUserLeave
      )
      this.$trtcCalling.off(
        this.TrtcCalling.EVENT.REJECT,
        this.handleInviteeReject
      )
      this.$trtcCalling.off(
        this.TrtcCalling.EVENT.LINE_BUSY,
        this.handleInviteeLineBusy
      )
      this.$trtcCalling.off(
        this.TrtcCalling.EVENT.CALLING_CANCEL,
        this.handleInviterCancel
      )
      this.$trtcCalling.off(
        this.TrtcCalling.EVENT.KICKED_OUT,
        this.handleKickedOut
      )
      this.$trtcCalling.off(
        this.TrtcCalling.EVENT.CALLING_TIMEOUT,
        this.handleCallTimeout
      )
      this.$trtcCalling.off(
        this.TrtcCalling.EVENT.NO_RESP,
        this.handleNoResponse
      )
      this.$trtcCalling.off(
        this.TrtcCalling.EVENT.CALLING_END,
        this.handleCallEnd
      )
      this.$trtcCalling.off(
        this.TrtcCalling.EVENT.USER_VIDEO_AVAILABLE,
        this.handleUserVideoChange
      )
      this.$trtcCalling.off(
        this.TrtcCalling.EVENT.USER_AUDIO_AVAILABLE,
        this.handleUserAudioChange
      )
    },
    handleError: function () {
    },
    handleNewInvitationReceived: async function (payload) {
      // this.isShowNewInvitationDialog = true
      this.none = false
      this.shout = true
      this.turnOn = true
      const {inviteID, sponsor, inviteData} = payload
      log(`handleNewInvitationReceived ${JSON.stringify(payload)}`)
      if (inviteData.callEnd) {
        // 最后一个人发送 invite 进行挂断
        this.$store.commit('updateCallStatus', 'idle')
        return
      }
      if (sponsor === this.loginUserInfo.userId) {
        // 邀请人是自己, 同一个账号有可能在多端登录
        return
      }
      // 这里需要考虑忙线的情况
      if (this.callStatus === 'calling' || this.callStatus === 'connected') {
        await this.$trtcCalling.reject({inviteID, isBusy: true})
        return
      }

      const {callType} = inviteData
      this.inviteData = inviteData
      this.inviteID = inviteID
      this.isInviterCanceled = false
      this.$store.commit('updateIsInviter', false)
      this.$store.commit('updateCallStatus', 'calling')
      const userName = sponsor
      this.inviterName = userName
      this.callTypeDisplayName =
        callType === this.TrtcCalling.CALL_TYPE.AUDIO_CALL
          ? '语音通话'
          : '视频通话'
      this.isShowNewInvitationDialog = true
    },
    handleRejectCall: async function () {
      try {
        const {callType} = this.inviteData
        await this.$trtcCalling.reject({
          inviteID: this.inviteID,
          isBusy: false,
          callType
        })
        this.dissolveMeetingIfNeed()
      } catch (e) {
        this.dissolveMeetingIfNeed()
      }
    },

    handleAccept: function () {
      this.connect = true
      this.turnOn = false
      this.shout = false
      this.listModel = false
      this.historyService = false
      this.videoModel = true
      this.videoCall = true
      this.historyService = false
      this.historyService = false
      this.videoCall = true
      this.handleDebounce(this.handleAcceptCall(), 500)
    },

    handleDebounce: function (func, wait) {
      let context = this
      let args = arguments
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    },
    handleAcceptCall: async function () {
      try {
        const {callType, roomID} = this.inviteData
        console.log(this.loginUserInfo.userId)
        console.log(this.inviteID)
        this.$store.commit('userJoinMeeting', this.loginUserInfo.userId)
        await this.$trtcCalling.accept({
          inviteID: this.inviteID,
          roomID,
          callType
        })
        this.operation = true
      } catch (e) {
        this.dissolveMeetingIfNeed()
      }
      this.connect = false
      this.none = false
      this.calling = true
    },
    handleUserAccept: function ({userID}) {
      this.$store.commit('userAccepted', true)
      console.log(userID, 'accepted')
    },
    handleUserEnter: function ({userID}) {
      // 建立连接
      this.$store.commit('userJoinMeeting', userID)
      if (this.callStatus === 'calling') {
        // 如果是邀请者, 则建立连接
        this.$nextTick(() => {
          // 需要先等远程用户 id 的节点渲染到 dom 上
          this.$store.commit('updateCallStatus', 'connected')
        })
      } else {
        // 第n (n >= 3)个人被邀请入会, 并且他不是第 n 个人的邀请人
        this.$nextTick(() => {
          // 需要先等远程用户 id 的节点渲染到 dom 上
          this.$trtcCalling.startRemoteView({
            userID: userID,
            videoViewDomID: `video-${userID}`
          })
        })
      }
    },
    handleUserLeave: function ({userID}) {
      if (this.meetingUserIdList.length === 2) {
        this.$store.commit('updateCallStatus', 'idle')
      }
      this.$store.commit('userLeaveMeeting', userID)
    },
    handleInviteeReject: async function ({userID}) {
      const userName = await getUsernameByUserid(userID)
      this.$message.warning(`${userName}拒绝通话`)
      this.dissolveMeetingIfNeed()
    },
    handleInviteeLineBusy: async function ({userID}) {
      const userName = await getUsernameByUserid(userID)
      this.$message.warning(`${userName}忙线`)
      this.shout = false
      this.turnOn = false
      this.dissolveMeetingIfNeed()
    },
    handleInviterCancel: function () {
      // 邀请被取消
      this.isShowNewInvitationDialog = false
      this.$message.warning('通话已取消')
      this.shout = false
      this.none = true
      this.turnOn = false
      this.dissolveMeetingIfNeed()
    },
    handleKickedOut: function () {
      // 重复登陆，被踢出房间
      this.$store.commit('userAccepted', false)
      this.$trtcCalling.logout()
      this.$store.commit('userLogoutSuccess')
    },
    // 作为被邀请方会收到，收到该回调说明本次通话超时未应答
    handleCallTimeout: function () {
      this.isShowNewInvitationDialog = false
      this.$message.warning('通话超时未应答')
      this.shout = false
      this.turnOn = false
      this.dissolveMeetingIfNeed()
    },
    handleCallEnd: function () {
      this.$message.success('通话已结束')
      this.$trtcCalling.hangup()
      this.dissolveMeetingIfNeed()
      // this.$router.push('/')
      this.operation = false
      this.calling = false
      this.none = true
      this.turnOn = false
      this.videoCall = false
      this.videoModel = false
      this.listModel = true
      this.$store.commit('userAccepted', false)
    },
    handleNoResponse: async function ({userID}) {
      const userName = await getUsernameByUserid(userID)
      this.$message.warning(`${userName}无应答`)
      this.dissolveMeetingIfNeed()
    },
    handleUserVideoChange: function ({userID, isVideoAvailable}) {
      log(
        `handleUserVideoChange userID, ${userID} isVideoAvailable ${isVideoAvailable}`
      )
      if (isVideoAvailable) {
        const muteUserList = this.muteAudioUserIdList.filter(
          currentID => currentID !== userID
        )
        this.$store.commit('updateMuteVideoUserIdList', muteUserList)
      } else {
        const muteUserList = this.muteAudioUserIdList.concat(userID)
        this.$store.commit('updateMuteVideoUserIdList', muteUserList)
      }
    },
    handleUserAudioChange: function ({userID, isAudioAvailable}) {
      log(
        `handleUserAudioChange userID, ${userID} isAudioAvailable ${isAudioAvailable}`
      )
      if (isAudioAvailable) {
        const muteUserList = this.muteAudioUserIdList.filter(
          currentID => currentID !== userID
        )
        this.$store.commit('updateMuteAudioUserIdList', muteUserList)
      } else {
        const muteUserList = this.muteAudioUserIdList.concat(userID)
        this.$store.commit('updateMuteAudioUserIdList', muteUserList)
      }
    },
    dissolveMeetingIfNeed () {
      this.$store.commit('updateCallStatus', 'idle')
      this.isShowNewInvitationDialog = false
      if (this.meetingUserIdList.length < 2) {
        this.$store.commit('dissolveMeeting')
      }
    },
    handleCallUser: function ({param}) {
      this.callFlag = true
      this.$trtcCalling.call({
        userID: param,
        type: this.TrtcCalling.CALL_TYPE.VIDEO_CALL
      }).then(() => {
        this.callFlag = false
        this.$store.commit('userJoinMeeting', this.loginUserInfo.userId)
        this.$store.commit('updateCallStatus', 'calling')
        this.$store.commit('updateIsInviter', true)
      })
    },
    handleCancelCallUser: function () {
      this.cancelFlag = true
      this.$trtcCalling.hangup().then(() => {
        this.cancelFlag = false
        this.$store.commit('dissolveMeeting')
        this.$store.commit('updateCallStatus', 'idle')
      })
    },
    startMeeting: function () {
      if (this.meetingUserIdList.length >= 3) {
        // 多人通话
        const lastJoinUser = this.meetingUserIdList[this.meetingUserIdList.length - 1]
        this.$trtcCalling.startRemoteView({
          userID: lastJoinUser,
          videoViewDomID: `video-${lastJoinUser}`
        })
        return
      }
      this.isShowVideoCall = true
      this.$trtcCalling.startLocalView({
        userID: this.loginUserInfo.userId,
        videoViewDomID: `video-${this.loginUserInfo.userId}`
      })
      const otherParticipants = this.meetingUserIdList.filter(
        userId => userId !== this.loginUserInfo.userId
      )
      otherParticipants.forEach(userId => {
        this.$trtcCalling.startRemoteView({
          userID: userId,
          videoViewDomID: `video-${userId}`
        })
      })
    },
    handleHangup: function () {
      this.$confirm('确认结束通话吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$trtcCalling.hangup()
        this.isShowVideoCall = true
        this.calling = false
        this.none = true
        this.videoCall = false
        this.historyService = true
        this.$store.commit('updateCallStatus', 'idle')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    toggleVideo: function () {
      this.isVideoOn = !this.isVideoOn
      if (this.isVideoOn) {
        this.$trtcCalling.openCamera()
        const muteUserList = this.muteVideoUserIdList.filter(
          userId => userId !== this.loginUserInfo.userId
        )
        this.$store.commit('updateMuteVideoUserIdList', muteUserList)
      } else {
        this.$trtcCalling.closeCamera()
        const muteUserList = this.muteVideoUserIdList.concat(
          this.loginUserInfo.userId
        )
        this.$store.commit('updateMuteVideoUserIdList', muteUserList)
      }
    },
    toggleAudio: function () {
      this.isAudioOn = !this.isAudioOn
      this.$trtcCalling.setMicMute(!this.isAudioOn)
      if (this.isAudioOn) {
        const muteUserList = this.muteAudioUserIdList.filter(
          userId => userId !== this.loginUserInfo.userId
        )
        this.$store.commit('updateMuteAudioUserIdList', muteUserList)
      } else {
        const muteUserList = this.muteAudioUserIdList.concat(
          this.loginUserInfo.userId
        )
        this.$store.commit('updateMuteAudioUserIdList', muteUserList)
      }
    },
    isUserMute: function (muteUserList, userId) {
      return muteUserList.indexOf(userId) !== -1
    },
    updateUserId2Name: async function (userIdList) {
      let userId2Name = {}
      let loginUserId = this.loginUserInfo.userId
      for (let i = 0; i < userIdList.length; i++) {
        const userId = userIdList[i]
        if (!this.userId2Name[userId]) {
          const userName = await getUsernameByUserid(userId)
          userId2Name[userId] = userName
          if (loginUserId === userId) {
            userId2Name[userId] += '(me)'
          }
        }
      }
      this.userId2Name = {
        ...this.userId2Name,
        ...userId2Name
      }
    },
    goto: function (path) {
      this.$router.push(path)
    },
    // 返回视频列表
    rebackList () {
      this.time = false
      this.camera = true
      this.listModel = true
      this.videoModel = false
    },
    // 返回视频
    rebackVideo () {
      this.camera = false
      this.time = true
      this.videoModel = true
      this.listModel = false
    },
    // 保存并结束会话
    handleEnd () {
      this.$confirm('确认保存并结束通话?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 查看历史服务单详情
    handleClick (hs) {
      // console.log(hs.id)
      this.detailInfo = hs.detail
      this.conversationSlip = false
      this.checkDetail = true
      this.buttonSelected = 'historySlip'
    },
    // 查看通话客户历史服务单
    handleCustomer (item) {
      console.log(item.id)
      this.historyList = item.historyServiceList
    },
    // 保存并结束会话
    onSubmit () {
      this.$message.success('保存成功')
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
    // 添加售后单
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    uploadFile (file) {
      console.log(file, '上传的文件')
      this.form.fileList.push(file.file)
      console.log(this.fileList)
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
  min-width: 350px;
  height: 100%;
  overflow: hidden;
  /*border-right: 1px solid lightgrey;*/
}

.top-bar {
  width: 100%;
  height: 100px;
  /*border-bottom: 1px solid #D5D7DD;*/
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
  background-color: #f3f4f9;
  /*border: 1px solid black;*/
}
.box-right {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 30px;
  /*position: relative;*/
  overflow-y: scroll;
  /*overflow-x: scroll;*/
  /*border: 1px solid red;*/
  /*background-color: #f3f4f9;*/
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

.video-conference-list {
  z-index: 100;
}

@media screen and (max-width: 767px) {
}

.video-call-section {
  width: 100%;
  height: 100%;
  /*border: 1px solid white;*/
}

.video-conference {
  display: none;
  width: 100%;
  height: 100%;
  background-color: #E9EBF4;
  position: relative;
  z-index: 1000;
}

.video-conference.is-show {
  display: block;
  width: 100%;
  height: calc(100vh - 170px);
}

.video-conference-list {
  display: flex;
  flex-direction: row;
}

.user-video-container {
  position: relative;
  text-align: left;
  width: 100%;
  height: 613px;
  margin: 10px;
}

.user-video-status {
  position: absolute;
  right: 50px;
  bottom: 20px;
  width: 24px;
  height: 27px;
  z-index: 10;
  background-image: url("../../../assets/camera-on.png");
  background-size: cover;
}

.user-video-status.is-mute {
  background-image: url("../../../assets/camera-off.png");
}

.user-audio-status {
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 22px;
  height: 27px;
  z-index: 10;
  background-image: url("../../../assets/mic-on.png");
  background-size: cover;
}

.user-audio-status.is-mute {
  background-image: url("../../../assets/mic-off.png");
}

.video-conference-action {
  width: 100%;
  text-align: center;
  margin-top: 70px;
  position: absolute;
  bottom: 30px;
}

.video-item-username {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  color: #ffffff;
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
/deep/ .el-upload-list__item-name {
  color: #d79432;
}
/deep/ .el-icon-document:before{
  color: #d79432;
}
/deep/ .el-upload-list__item .el-icon-upload-success{
  color: #d79432;
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

.turnOn {
  position: absolute;
  right: 20px;
  /*top: 5px;*/
}

.videoList {
  width: 100%;
  /*height: calc(100% - 130px);*/
  /*border: 1px solid red;*/
  /*border: 1px solid black;*/
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

.videoList-line {
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #E1E1E1;
  display: flex;
  line-height: 60px;
  position: relative;
  cursor: pointer;
}

.videoList-line:hover {
  background-color: #E9EBF4;
}

.image {
  width: 40px;
  height: 40px;
  border-radius: 50px;
  margin-top: 10px;
  margin-left: 40px;
}

.historyService {
  width: 100%;
  height: 100%;
  padding: 30px 30px;
  box-sizing: border-box;
  background-color: #E9EBF4;
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

.save {
  height: 30px;
  font-size: 14px;
  position: absolute;
  right: 0;
  line-height: 5px;
}

.historyService-message {
  font-size: 13px;
  font-weight: 600;
}

.historyService-date {
  position: absolute;
  right: 20px;
  font-size: 12px;
}

.historyService-code {
  position: absolute;
  bottom: 10px;
  left: 20px;
  font-size: 12px;
}

.historyService-name {
  position: absolute;
  right: 20px;
  bottom: 10px;
  font-size: 12px;
}

.historyServiceInfo {
  width: 100%;
  height: 100%;
  padding: 30px 0;
  box-sizing: border-box;
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

.screenshot {
  width: 100%;
  /*height: 80px;*/
  /*border: 1px solid black;*/
  /*display: block;*/
  margin-top: 30px;
  display: flex;

}

.screenshot-picture {
  width: 60px;
  height: 60px;
  border: 1px solid lightgray;
  margin-right: 5px;
}
</style>
