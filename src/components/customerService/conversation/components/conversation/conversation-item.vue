<template>
    <div
        class="conversation-item-container"
        :class="{ 'choose': conversation.conversationID === currentConversation.conversationID }"
        @click="selectConversation"
    >
      <div class="close-btn">
        <span class="tim-icon-close" title="删除会话" @click="deleteConversation"></span>
      </div>
      <div class="warp">
        <avatar style="margin-top: 15px;margin-left: 30px" :src="avatar" :type="conversation.type" />
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
            <div class="date">
              {{date}}
            </div>
          </div>
          <div class="row-2">
            <div class="summary">
              <div v-if="conversation.lastMessage" style="font-size: 12px;">
                <span class="remind"  v-if="hasMessageAtMe">{{messageAtMeText}}</span>
                <span class="text" :title="conversation.lastMessage.messageForShow">
                  {{messageForShow}}
                </span>
              </div>
            </div>
            <div class="unread-count">
              <span class="badge" v-if="showUnreadCount">
<!--                {{conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}}-->
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { isToday, getDate, getTime } from '../../utils/date'
export default {
  name: 'conversation-item',
  props: ['conversation'],
  data () {
    return {
      popoverVisible: false,
      showMessageAtMe_text: '',
      conversationList: []
    }
  },
  created () {
    // console.log(this.conversation.conversationID, '5555555555555555')
    // this.conversationList.push(this.conversation.conversationID)
    // console.log(this.conversationList)
    // console.log(this.conversationList[0].conversationID, '6666666666')
  },
  computed: {
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
    ...mapGetters(['toAccount'])
  },
  mounted () {

  },
  methods: {
    selectConversation () {
      console.log(this.conversation.conversationID)
      console.log(this.currentConversation.conversationID)
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
    }
  }
}
</script>

<style lang="stylus" scoped>
//.conversation-item-container:hover{
//  background-color white
//}
.conversation-item-container
  //padding 15px 20px
  cursor pointer
  position relative
  overflow hidden
  transition .2s
  // &:first-child
  //   padding-top 30px
  &:hover
    background-color #e9ebf4
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
    width 100%;
    //border 1px solid black;
    display flex
    height 70px
    border-bottom 1px solid #E1E1E1
  .avatar
    width 40px
    height 40px
    margin-right 10px
    border-radius 50%
    flex-shrink 0
  .content
    flex 1
    height 40px
    margin-top 15px
    overflow hidden
    //border 1px solid red
    .row-1
      display flex
      line-height 21px
      .name
        color $font-light
        flex 1
        min-width 0
      .date
        padding-right 20px
        flex-shrink 0
        text-align right
        color $font-dark
        font-size 12px;
    .row-2
      display flex
      font-size 12px
      padding-top 3px
      padding-right 10px
      //border 1px solid black
      .summary
        flex 1
        overflow hidden
        min-width 0px
        color: $secondary
        .remind
          color $danger
      .unread-count
        padding-left 10px
        flex-shrink 0
        color $font-dark
        font-size 12px
        //border 1px solid black;
        padding-bottom 10px;
        .badge
          //vertical-align bottom
          background-color #EF0B0B
          border-radius 50px
          color #FFF
          display inline-block
          font-size 12px
          width 8px
          height 8px
          //max-width 40px
          //line-height 15px
          //padding 0 6px
          text-align center
          white-space nowrap
          margin-right 10px
.choose {
  background-color: #e9ebf4;
}
.context-menu-button {
  padding: 10px
  border: 2px solid $primary;
  border-radius: 8px;
}
  .text-ellipsis{
    font-size 13px;
    font-weight bold;
  }
</style>
