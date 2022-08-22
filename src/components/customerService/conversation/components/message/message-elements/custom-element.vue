<template>
<message-bubble :isMine=isMine :message=message>
  <div class="custom-element-wrapper">
    <div class="survey"  v-if="this.payload.data === 'survey'">
      <div class="title">对IM DEMO的评分和建议</div>
      <el-rate
          v-model="rate"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value}">
      </el-rate>
      <div class="suggestion">{{this.payload.extension}}</div>
    </div>
    <span class="text" title="您可以自行解析自定义消息" v-else>
      <template v-if="text.isFromGroupLive && text.isFromGroupLive === 1">
        <message-group-live-status :liveInfo='text' />
      </template>
      <template v-if="payload.description === '发送订单消息'">
        <div style="width: 300px;height: 80px;background-color: #f3f4f9;border-radius: 5px;color: black;display: flex;">
          <div style="width: 100px;height: 100%;">
            <img style="height: 100%;margin: 0 auto;" :src="this.url + this.productMessage.img" alt="">
          </div>
          <div style="width: 200px;height: 10vh;">
            <div style="width: 100%;height: 40px;line-height: 40px;display: flex;padding-left: 20px;box-sizing: border-box;">
              <span style="width: 70%;font-size: 12px;justify-content: flex-start;">{{ this.productMessage.name }}</span>
              <span style="width: 30%;font-size: 12px;color: #a9852a;display: flex;justify-content: flex-end;box-sizing: border-box;padding-right: 10px;">￥{{ this.productMessage.price }}</span>
            </div>
            <div style="width: 100%;height: 40px;line-height: 40px;display: flex;padding-left: 20px;box-sizing: border-box;">
              <span style="width: 70%;font-size: 12px;color: #666666;">规格分类：{{ this.productMessage.type }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <span>{{ text }}</span>
      </template>
    </span>
  </div>
</message-bubble>
</template>

<script>
import { mapState } from 'vuex'
import MessageBubble from '../message-bubble'
import { Rate } from 'element-ui'
import MessageGroupLiveStatus from '../message-group-live-status'

export default {
  name: 'CustomElement',
  data () {
    return {
      productMessage: {},
      url: 'https://www.uniwarm.net'
    }
  },
  props: {
    payload: {
      type: Object,
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    isMine: {
      type: Boolean
    }
  },
  components: {
    MessageBubble,
    ElRate: Rate,
    MessageGroupLiveStatus
  },
  computed: {
    ...mapState({
      currentUserProfile: state => state.user.currentUserProfile
    }),
    text () {
      // console.log(this.payload.data, '11111111111111111')
      // console.log(JSON.parse(this.payload.data))
      // let payContent = JSON.parse(this.payload.data)
      // console.log(typeof (payContent.data))
      this.payload.data.split(',').forEach(item => {
        let arr = item.split(':')
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.productMessage[arr[0]] = arr[1]
        // console.log(this.productMessage)
      })
      return this.translateCustomMessage(this.payload)
    },
    rate () {
      return parseInt(this.payload.description)
    }
  },
  methods: {
    translateCustomMessage (payload) {
      let videoPayload = {}
      try {
        videoPayload = JSON.parse(payload.data)
      } catch (e) {
        videoPayload = {}
      }
      if (payload.data === 'group_create') {
        return `${payload.extension}`
      }
      if (videoPayload.roomId) {
        videoPayload.roomId = videoPayload.roomId.toString()
        videoPayload.isFromGroupLive = 1
        return videoPayload
      }
      if (payload.text) {
        return payload.text
      } else {
        return '[自定义消息]'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.text
  font-weight bold
.title
  font-size 16px
  font-weight 600
  padding-bottom 10px
.survey
  background-color white
  color black
  padding 20px
  display flex
  flex-direction column
.suggestion
  padding-top 10px
  font-size 14px
</style>
