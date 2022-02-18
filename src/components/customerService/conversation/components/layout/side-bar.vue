<template>
  <div class="side-bar-wrapper">
<!--    <div class="bar-left">-->
<!--      <my-profile />-->
<!--      <div class="tab-items" @click="handleClick">-->
<!--        <div-->
<!--          id="conversation-list"-->
<!--          class="iconfont icon-conversation"-->
<!--          :class="{ active: showConversationList }"-->
<!--          title="会话列表"-->
<!--        >-->
<!--          <sup class="unread" v-if="totalUnreadCount !== 0">-->
<!--            <template v-if="totalUnreadCount > 99">99+</template>-->
<!--            <template v-else>{{totalUnreadCount}}</template>-->
<!--          </sup>-->
<!--        </div>-->
<!--        <div-->
<!--          id="group-list"-->
<!--          class="iconfont icon-group"-->
<!--          :class="{ active: showGroupList }"-->
<!--          title="群组列表"-->
<!--        ></div>-->
<!--        <div-->
<!--          id="friend-list"-->
<!--          class="iconfont icon-contact"-->
<!--          :class="{ active: showFriendList }"-->
<!--          title="好友列表"-->
<!--        >-->
<!--&lt;!&ndash;          &lt;!&ndash; <sup class="unread" v-if="applicationUnreadCount !== 0">&ndash;&gt;-->
<!--&lt;!&ndash;            <template v-if="applicationUnreadCount > 99">99+</template>&ndash;&gt;-->
<!--&lt;!&ndash;            <template v-else>{{applicationUnreadCount}}</template>&ndash;&gt;-->
<!--&lt;!&ndash;          </sup> &ndash;&gt;&ndash;&gt;-->
<!--        </div>-->
<!--        <div-->
<!--          id="black-list"-->
<!--          class="iconfont icon-blacklist"-->
<!--          :class="{ active: showBlackList }"-->
<!--          title="黑名单列表"-->
<!--        ></div>-->
<!--        <div-->
<!--          id="group-live"-->
<!--          class="group-live"-->
<!--          title="群直播"-->
<!--        ></div>-->
<!--      </div>-->
<!--      <div class="bottom">-->
<!--        <div class="iconfont icon-tuichu" @click="$store.dispatch('logout')" title="退出"></div>-->
<!--      </div>-->
<!--    </div>-->
    <div class="bar-right">
      <div class="top-bar">
          <span class="headimg">
            <img style="width: 50px;height: 50px" :src="url + headimg" alt="">
          </span>
        <div class="customerServiceInfo">
          <div style="width: 100%;height: 25px;display: flex">
            <h6>会话客服{{userId}}</h6>
            <div
              style="font-size: 11px;margin-left: 20px;padding: 0 5px;color: #d79432;border: 1px solid #d79432;border-radius: 3px;height: 16px;line-height: 16px;cursor:pointer">
              提交下线
            </div>
<!--            <div id="icon" style="font-size: 20px">-->
<!--              <i @click="rebackVideo()" v-if="camera" class="el-icon-video-camera"></i>-->
<!--              <i @click="rebackList()" v-if="time" class="el-icon-time"></i>-->
<!--            </div>-->
          </div>
          <div style="width: 100%;height: 25px">
            <span style="font-size: 11px;color: #d79432">在线</span>
            <span style="font-size: 11px;margin-left: 20px">本次工作时长：1小时20分钟</span>
          </div>
        </div>
      </div>
      <div class="callInfo">
        <span>暂无用户请求</span>
<!--        <span v-if="none">暂无用户请求</span>-->
<!--        <span v-if="shout">用户 '{{ this.inviterName }}' 呼叫... </span>-->
<!--        <span v-if="connect">正在接入用户 '{{ this.inviterName }}' ... </span>-->
<!--        <span v-if="calling">正在与 '{{ this.inviterName }}' 通话</span>-->
<!--        <el-button v-if="turnOn" class="turnOn" type="warning" size="mini" @click="handleAccept">接通</el-button>-->
      </div>
      <conversation-list v-show="showConversationList" />
      <!-- <group-list v-show="showGroupList" /> -->
      <!-- <friend-list v-show="showFriendList" /> -->
      <!-- <black-list v-show="showBlackList" /> -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import MyProfile from '../my-profile'
import ConversationList from '../conversation/conversation-list'
// import GroupList from '../group/group-list'
// import FriendList from '../friend/friend-list'
// import BlackList from '../blacklist/blacklist'

const activeName = {
  CONVERSATION_LIST: 'conversation-list',
  GROUP_LIST: 'group-list',
  FRIEND_LIST: 'friend-list',
  BLACK_LIST: 'black-list',
  GROUP_LIVE: 'group-live'
}
export default {
  name: 'SideBar',
  components: {
    MyProfile,
    ConversationList
    // GroupList,
    // FriendList,
    // BlackList
  },
  data () {
    return {
      active: activeName.CONVERSATION_LIST,
      activeName: activeName,
      url: 'http://www.bizspace.cn:8690',
      headimg: '',
      userId: ''
    }
  },
  created () {
    this.headimg = sessionStorage.getItem('headimg')
    this.userId = sessionStorage.getItem('video_id')
  },
  computed: {
    ...mapGetters(['totalUnreadCount']),
    ...mapState({
      userID: state => state.user.userID
      // applicationUnreadCount: state => state.friend.unreadCount,
    }),
    showConversationList () {
      return this.active === activeName.CONVERSATION_LIST
    },
    showGroupList () {
      return this.active === activeName.GROUP_LIST
    },
    showFriendList () {
      return this.active === activeName.FRIEND_LIST
    },
    showBlackList () {
      return this.active === activeName.BLACK_LIST
    },
    showAddButton () {
      return [activeName.CONVERSATION_LIST, activeName.GROUP_LIST].includes(
        this.active
      )
    }
  },
  mounted () {
    this.$bus.$on('checkoutConversation', () => {
      this.checkoutActive(activeName.CONVERSATION_LIST)
    })
    // console.error(this.userID, '0000')
  },
  methods: {
    checkoutActive (name) {
      this.active = name
    },

    handleClick (event) {
      switch (event.target.id) {
        case activeName.CONVERSATION_LIST:
          this.checkoutActive(activeName.CONVERSATION_LIST)
          break
        case activeName.GROUP_LIST:
          this.checkoutActive(activeName.GROUP_LIST)
          break
        case activeName.FRIEND_LIST:
          this.checkoutActive(activeName.FRIEND_LIST)
          break
        case activeName.BLACK_LIST:
          this.checkoutActive(activeName.BLACK_LIST)
          break
        case activeName.GROUP_LIVE:
          this.groupLive()
          break
      }
    },
    handleRefresh () {
      switch (this.active) {
        case activeName.CONVERSATION_LIST:
          this.tim.getConversationList().catch(error => {
            this.$store.commit('showMessage', {
              type: 'error',
              message: error.message
            })
          })
          break
        case activeName.GROUP_LIST:
          this.getGroupList()
          break
        case activeName.FRIEND_LIST:
          this.getFriendList()
          break
        case activeName.BLACK_LIST:
          this.$store.dispatch('getBlacklist')
          break
      }
    },
    getGroupList () {
      this.tim
        .getGroupList()
        .then(({ data: groupList }) => {
          this.$store.dispatch('updateGroupList', groupList)
        })
        .catch(error => {
          this.$store.commit('showMessage', {
            type: 'error',
            message: error.message
          })
        })
    },
    getFriendList () {
      this.tim
        .getFriendList()
        .then(({ data: friendList }) => {
          this.$store.commit('upadteFriendList', friendList)
        })
        .catch(error => {
          this.$store.commit('showMessage', {
            type: 'error',
            message: error.message
          })
        })
        .catch(error => {
          this.$store.commit('showMessage', {
            type: 'error',
            message: error.message
          })
        })
    },
    groupLive () {
      this.$store.commit('updateGroupLiveInfo', {
        groupID: 0,
        anchorID: this.userID
      })
      this.$bus.$emit('open-group-live', { channel: 2 })
    }
  }
}
</script>

<style lang="stylus" scoped>
.top-bar {
  width: 100%;
  height: 100px;
  border-bottom: 1px solid #D5D7DD;
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
.side-bar-wrapper {
  height: 100%;
  color: $black;
  display: flex;
  width: 100%;
  overflow: hidden;

  .bar-left {
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    width: 80px;
    height: $height;
    background-color: $background-deep-dark;

    .tab-items {
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      .iconfont {
        position: relative;
        margin: 0;
        height: 70px;
        line-height: 70px;
        text-align: center;
        font-size: 30px;
        cursor: pointer;
        color: $first;
        user-select: none;
        -moz-user-select: none;
      }

      .active {
        color: $white;
        background-color: $background-dark;

        &::after {
          content: ' ';
          display: block;
          position: absolute;
          top: 0;
          z-index: 0;
          height: 70px;
          // border-left 4px solid $border-highlight
          border-left: 4px solid $light-primary;
        }
      }

      .unread {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 999;
        display: inline-block;
        height: 18px;
        padding: 0 6px;
        font-size: 12px;
        color: #FFF;
        line-height: 18px;
        text-align: center;
        white-space: nowrap;
        border-radius: 10px;
        background-color: $danger;
      }
    }

    .bottom {
      height: 70px;

      &>span {
        display: block;
      }

      .btn-more {
        width: 100%;
        height: 70px;
        line-height: 70px;
        font-size: 30px;
        color: $first;
        text-align: center;
        cursor: pointer;
      }

      .iconfont {
        height: 70px;
        line-height: 70px;
        text-align: center;
        font-size: 30px;
        cursor: pointer;
        color: $first;
        user-select: none;
        -moz-user-select: none;
      }

      .iconfont:hover {
        color: white;
      }
    }

    .btn-more:hover {
      color: $white;
    }
  }

  .bar-right {
    // flex 1
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    height: $height;
    position: relative;
    background-color: $background-dark;
  }
  .group-live {
    position relative
    top 10px
    left 25px
    width 30px
    height 30px
    background url('../../assets/image/live-icon-gray.png') center no-repeat
    background-size cover
    cursor pointer
  }
}
</style>
