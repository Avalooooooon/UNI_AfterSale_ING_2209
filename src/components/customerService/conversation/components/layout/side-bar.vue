<template>
  <div class="side-bar-wrapper">
      <div style="width: 100%;height: calc(100vh - 300px);background-color: #f3f4f9">
        <conversation-list style="height: 100%;" v-show="showConversationList" />
      </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import MyProfile from '../my-profile'
import ConversationList from '../conversation/conversation-list'

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
.side-bar-wrapper {
  width: 100%;
  height: calc(100vh - 305px);
  color: $black;
  display: flex;
  overflow: hidden;
  //background-color red;

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
  .bar-right {
    // flex 1
    //flex: 1 1 auto;
    width: 100%;
    height: calc(100vh - 175px);
    //border 1px solid blue;
    min-width: 0;
    //height: $height;
    position: relative;
    background-color: $background-dark;
    .top-bar {
      width: 100%;
      height: 100px;
      display: flex;
      //border 1px solid black;
      .headimg {
        width: 50px;
        height: 100px;
        border 1px solid #f3f4f9
        border-radius: 50px;
        box-sizing border-box;
        padding-top 25px;
        margin-left 40px;
        margin-right 20px;
        //margin: 25px 20px 25px 40px;
      }

      .customerServiceInfo {
        height: 100px;
        //margin-top: 25px;
        width: calc(100% - 110px);
        border 1px solid #f3f4f9;
        position: relative;
        box-sizing border-box;
        padding-top 25px;
      }
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
  }
}
</style>
