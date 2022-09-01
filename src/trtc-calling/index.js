import TRTCCalling from 'trtc-calling-js'
import config from '../config'
import TIM from '../tim'

export function createTrtcCalling () {
  return new TRTCCalling({
    SDKAppID: config.SDKAppID,
    tim: TIM
  })
}
