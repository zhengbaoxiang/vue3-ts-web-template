import Http from './Http'
import { config, api } from '../../config'
import { utils, eventManager } from '../../utils'
import { CurrentParttenProps, Parttern, CurrentParttenOptions } from '../shared'
import { EventEnum } from '../../constants'

let pollmessageTimmer: number | undefined
let maxId = 0
let loopInterval = 1000 * 2
// 最长8秒，最短1秒
let saveTimes = 1

type Props = Omit<CurrentParttenProps, 'rootProto'>

export default class PollingStrategy {
  imUserID: string = ''
  accessToken: string = ''
  joinedChannelId: string = ''
  isStop: boolean = false
  currentParttern: Parttern
  options: CurrentParttenOptions
  hasAuthSuccess: boolean = false

  constructor(props: Props) {
    this.currentParttern = props.currentParttern
    this.options = props.options
  }

  start() {
    eventManager.trigger(EventEnum.connected)
  }

  loginByIMToken(uid: string, token: string, device: string, version: string) {
    // IM API 没有提供此方法，默认设置为 true
    this.hasAuthSuccess = true
    this.imUserID = uid
    this.accessToken = token
  }

  // 登出，清理轮询计时器和执行用户离开操作
  logout() {
    this.userLeave()
    clearInterval(pollmessageTimmer!)
  }

  // todo 该方法我看在logout里使用了，但是全局未定义，后续感觉要开发一下
  userLeave() { }

  joinPrivateMsg(receiveId: string): void {
    setInterval(() => {
      this.loopBySenderId(1, receiveId)
    }, 1e3)
  }

  // 通过senderId来循环获取离线消息，发送接收回执并显示消息
  loopBySenderId(index: number, senderId: string) {
    this.getUserOfflineMsg(index, senderId, (data: any) => {
      if (data.result == 1) {
        let count = data.data.Content.length
        let listarr = []
        for (let i = 0; i < count; i++) {
          let list = {
            ReceiptType: '1',
            GroupID: '',
            MsgID: data.data.Content[i].MsgID,
            ReceiveUserID: senderId
          }
          listarr.push(list)

          let reqData = {
            receipts: listarr,
            type: 0,
            imUserID: this.imUserID,
            accessToken: this.accessToken
          }
          Http.httpRequest(api.OfflineMessageReceipt(), reqData)
          eventManager.trigger(EventEnum.privateMessages, data.data.Content[i])
        }

        if (data.data.Content.length != 0) {
          // index +1 再去捞一次 捞完为止
          setTimeout(() => {
            this.loopBySenderId(index + 1, senderId)
          }, 1000)
        }
      } else if (data.result == 14) {
        // 没有获取到 超时,那就稍作等待再执行一遍
        // 14 表示访问超时
        setTimeout(() => {
          this.loopBySenderId(index, senderId)
        }, 2000)
      }
    })
  }

  joinChannel(channel: string) {
    // 避免重复启动
    if (!channel) {
      utils.log('[channelId不存在!]')
      return
    }
    this.joinedChannelId = channel
    maxId = 0
    // 这是频道模式的走法
    if (config.pollbyZero) {
      this.pollmessageInterval()
    } else {
      this.getMaxIndex(
        channel,
        (res: any) => {
          maxId = res.data
          this.pollmessageInterval()
        },
        (res: any) => {
          utils.log('[获取最大索引失败]', res.message)
        }
      )
    }
    utils.log('[轮询启动成功]')
    eventManager.trigger(EventEnum.joinChannelSuccess, channel)
  }

  pollmessageInterval() {
    clearInterval(pollmessageTimmer)
    pollmessageTimmer = undefined
    pollmessageTimmer = setInterval(() => {
      // channel.toString(), maxId
      this.getMessage(this.joinedChannelId, maxId)
    }, loopInterval)
  }

  getMaxIndex(channel: string, callback: Function, fail: Function) {
    let ch = channel
    if (!ch) return
    let data = {
      channelID: ch,
      imUserID: this.imUserID,
      accessToken: this.accessToken
    }
    Http.httpRequest(
      api.getMsgMaxIndex(),
      data,
      (res: any) => {
        utils.triggerCallbackbyresult(res, callback, fail)
      },
      fail
    )
  }

  // 私信
  sendMessage(
    receiveId: string,
    msg: string,
    _: boolean,
    persist: boolean,
    success?: Function,
    fail?: Function
  ) {
    Http.httpRequest(
      api.sendMessage(),
      {
        receiverID: receiveId,
        msgContent: msg,
        contentType: 1,
        persist: persist || true,
        imUserID: this.imUserID,
        accessToken: this.accessToken
      },
      success,
      fail
    )
  }
  // 发送私信消息（基金专用）
  sendMessageForApp(
    receiveId: string,
    msg: string,
    contentType: number,
    _: boolean,
    persist: boolean,
    success?: Function,
    fail?: Function
  ) {
    Http.httpRequest(
      api.sendMessageForApp(),
      {
        receiverID: receiveId,
        msgContent: msg,
        contentType: contentType,
        persist: persist || true,
        imUserID: this.imUserID,
        accessToken: this.accessToken
      },
      success,
      fail
    )
  }

  // 频道消息
  sendToChannel(
    ch: string,
    msg: string,
    protocol: number,
    success?: Function,
    fail?: Function
  ) {
    if (!ch) {
      utils.log('[channlid不能为空]')
      utils.triggerCallback(fail, 'channelId不能为空')
      return
    }

    if (!this.accessToken) {
      utils.log('[sendToChannel]', 'accessToken不能为空')
      utils.triggerCallback(fail, 'accessToken不能为空,可能还未认证!')
      return
    }

    // 触发马上去拿消息
    loopInterval = 1 * 1000
    this.pollmessageInterval()
    const content = {
      channelID: ch,
      msg: msg,
      appKey: this.options.appKey,
      contentType: protocol,
      persist: protocol == 0,
      imUserID: this.imUserID,
      accessToken: this.accessToken
    }
    Http.httpRequest(api.sendChannelCommonMessage(), content, success, fail)
  }

  getMessage(channel: string, index: number, callback?: Function) {
    let ch = channel
    if (!ch || this.currentParttern == Parttern.websocket || this.isStop) {
      clearInterval(pollmessageTimmer)
      return
    }
    let data = {
      channelID: ch,
      index: index,
      imUserID: this.imUserID,
      accessToken: this.accessToken
    }
    // 如果没有回调 就走轮询事件通知
    if (typeof callback != 'function') {
      callback = (result: any) => {
        // 处理异常
        if (result.result != 1) {
          utils.log(`[${result.message}]`)
          if (result.result == 2000) {
            // 频道不存在！
            clearInterval(pollmessageTimmer)
            pollmessageTimmer = undefined
            utils.log('[暂停轮询...]')
          }
        }
        if (result.count == 0) {
          this.fixloopTime(maxId)
          return
        }
        utils.log('[pollmessages]', result)
        if (result.result) {
          eventManager.trigger(EventEnum.pollmessages, result)
        }
      }
    }
    Http.httpRequest(api.getMessageListByIndex(), data, callback)
  }

  fixloopTime(mid: number) {
    if (mid == maxId) {
      saveTimes++
      if (saveTimes > 4) {
        saveTimes = 4
        return
      }
      loopInterval = saveTimes * 1000
    } else {
      // util.log("loopInterval恢复");
      loopInterval = 1 * 1000
      saveTimes = 1
    }
    // saveTimes > 1 && util.log("轮训时间切换为" + saveTimes + "秒");
    this.pollmessageInterval()
  }

  getUserOfflineMsg(index: number, senderId: string, callback?: Function) {
    // int pageIndex, int pageSize
    Http.httpRequest(
      api.GetUserOfflineMsg(),
      {
        pageIndex: index,
        senderID: senderId,
        imUserID: this.imUserID,
        accessToken: this.accessToken
      },
      callback
    )
  }

  getAllOfflineMsg(success?: Function, fail?: Function) {
    Http.httpRequest(api.GetAllOfflineMsg(), {}, success, fail)
  }

  stop() {
    this.isStop = true
    clearInterval(pollmessageTimmer)
    pollmessageTimmer = undefined
  }

  // add todo
  reset() { }
}
