import { config } from '../../config'
import { ProtoCodeToNum, ProtoCodeToCN } from '../../constants'
import { utils, eventManager } from '../../utils'
import { toBuffer, copyTo, decompress, closeCodeToExplain } from './utils'
import { Root } from '../RootProto'
import { CurrentParttenProps, Parttern, CurrentParttenOptions } from '../shared'
import { EventEnum } from '../../constants'

export default class WebsocketStrategy {
  bufferLength: number = 0
  readBuffer: ArrayBuffer | null = null
  heartTimer?: number
  /**
   * 是否停止
   */
  isStop: boolean = false
  /**
   * 是否重连
   */
  isReconnect: boolean = false
  /**
   * 当前的websocket对象
   */
  currentSocket: WebSocket | null = null
  /**
   * 重连次数
   */
  reconnectTimes: number = 5
  /**
   * 是否认证成功
   */
  hasAuthSuccess: boolean = true
  /**
   * 已经加入的频道id
   */
  joinedChannelId: string = ''

  options: CurrentParttenOptions
  /**
   * 当前的模式
   */
  currentParttern: Parttern
  rootProto: Root

  constructor(props: CurrentParttenProps) {
    const { options, currentParttern, rootProto } = props
    //初始化入参
    this.options = options
    this.currentParttern = currentParttern
    this.rootProto = rootProto
  }

  /**  -------websocket的4个功能方法------------ */

  private onopen = () => {
    if (this.isStop) return
    utils.log('[websocket onopen，当前模式是]', this.currentParttern)
    //重连不要触发重新登陆，不然100% 触发发送失败
    // eventManager.trigger(
    //   this.isReconnect ? EventEnum.reConnected : EventEnum.connected
    // )
    this.isReconnect && eventManager.trigger(EventEnum.reConnected)
    eventManager.trigger(EventEnum.connected)
  }

  /**
   * todo 这是一个等于无用的方法，并没有实质做什么操作
   */
  private onerror = (err: Event) => {
    utils.warn('[websocket onerror]', err)
    eventManager.trigger(EventEnum.error, 'websocket onerror')
    // if (this.reconnectTimes > 0) {
    //   console.log('-需要重连>', this.reconnectTimes)
    //   // 加入重连
    //   this.reConnect()
    // } else {
    //   utils.warn('[websocket onerror, 3次重连次数已经用完]')
    //   // utils.log('[启动方式切换到轮询...]')
    //   // eventManager.trigger(EventEnum.start_long_poll)
    // }
  }

  private onclose = (msg: CloseEvent) => {
    // 
    console.log(`%c [websocket onclose]-${closeCodeToExplain(msg?.code)}-${new Date().toLocaleTimeString()}`, "color:red;font-size:24px;");
    utils.warn('[websocket onclose]', closeCodeToExplain(msg?.code))
    this.readBuffer = new ArrayBuffer(40960)
    eventManager.trigger(EventEnum.disconnected, this.reconnectTimes)
    // 1000 是正常关闭，不需要重连，断网重连走的是onerror
    if (msg.code != 1000) {
      utils.log('[websocket关闭，msg.code !=1000，触发了reConnect]')
      this.reConnect()
    }
  }

  private onmessage = (evt: MessageEvent) => {
    utils.log('[websocket onmessage]', evt)
    // this.isReconnect = false
    this.toContext(evt.data)
  }

  /**  -------toContext------------ */

  private toContext(buffer: ArrayBuffer) {
    if (!this.readBuffer) return
    //  先放到本地缓冲区
    copyTo(buffer, 0, this.readBuffer, this.bufferLength, buffer.byteLength)
    this.bufferLength += buffer.byteLength
    //  解析本地缓冲区数据
    let offset = 0
    while (true) {
      if (offset >= this.bufferLength) {
        break
      }
      const dv = new DataView(this.readBuffer)
      const len = dv.getInt16(offset, false)
      if (len < 3) {
        // 为什么会出现这种情况?
        utils.warn('len小于3')
        break
      }

      if (this.bufferLength < len + offset) {
        // 解不出一个包
        break
      }

      const protocol = dv.getUint8(2)

      try {
        const arBuf = new ArrayBuffer(len - 3)
        copyTo(this.readBuffer, offset + 3, arBuf, 0, len - 3)
        offset += len
        // 如果是轮询这个就不触发了
        this.currentParttern == Parttern.websocket &&
          this.socketMessageDispatcher(protocol, arBuf)
      } catch (e) {
        utils.warn(e, len)
        break
      }
    }
    if (this.bufferLength > offset) {
      //  还有剩余数据
      this.bufferLength -= offset
      copyTo(this.readBuffer, offset, this.readBuffer, 0, this.bufferLength)
    } else {
      //  没有剩余数据
      this.bufferLength = 0
    }
  }

  /**  -------sendBuffer------------ */
  private sendBuffer(
    protocol: number,
    msg?: ArrayBuffer,
    success?: Function,
    fail?: Function
  ) {
    //@ts-ignore
    utils.log('[执行了sendBuffer]', ProtoCodeToCN[protocol])
    if (this.isStop) return
    if (!this.currentSocket) {
      eventManager.trigger(
        EventEnum.error,
        'sendBuffer:websocket不存在，正在重连'
      )
      // this.reConnect()
      fail && fail('websocket不存在')
      return
    }
    if (!this.hasAuthSuccess) {
      fail && fail('认证失败,发送无效')
      return
    }

    if (!protocol && protocol !== 0) {
      fail && fail('协议不能为空')
      return
    }

    if (this.currentSocket.readyState == WebSocket.OPEN) {
      this.currentSocket.send(toBuffer(protocol, msg))
      success && success('WebSocket.OPEN')
    } else {
      // this.reConnect()
      eventManager.trigger(EventEnum.error, 'sendBuffer:websocket未打开')
      fail && fail('sendBuffer：websocket未打开')
    }
  }

  /**  -------连接流程------------ */
  /**
   * 开始
   */
  public start() {
    utils.log('[执行了start]')
    this.readBuffer = new ArrayBuffer(40960)
    this.connecting()
  }

  /**
   * 连接
   */
  private connecting() {
    if (this.isStop) return
    this.currentSocket?.close()

    /**
     * websocket重连3次，如果还是失败，就切换到轮询模式
     * 如果是轮询模式，就不需要重连了；否则，切换到轮询模式
     */
    // if (this.reconnectTimes <= 0) {
    //   //说明已经启动了轮询
    //   if (this.currentParttern == Parttern.polling) return
    //   utils.log('[已经重连3次,开始切换到轮询...]')
    //   eventManager.trigger(EventEnum.start_long_poll)
    //   return
    // }

    try {
      // 开始创建socket对象
      this.currentSocket = new WebSocket(this.options.websocketUrl, 'im')
      utils.log('[websocket对象创建成功]', this.currentSocket)
    } catch (e) { }

    if (!this.currentSocket) return

    // 设置socket对象的binaryType
    this.currentSocket.binaryType = 'arraybuffer'

    // 绑定事件处理程序（仅当处理程序未绑定时）
    if (!this.currentSocket.onopen) {
      this.currentSocket.onopen = this.onopen
    }

    if (!this.currentSocket.onerror) {
      this.currentSocket.onerror = this.onerror
    }

    if (!this.currentSocket.onclose) {
      this.currentSocket.onclose = this.onclose
    }

    if (!this.currentSocket.onmessage) {
      this.currentSocket.onmessage = this.onmessage
    }
  }

  /**
   * 重连有问题，暂且不写吧
   */
  private reConnect() {
    if (this.reconnectTimes <= 0) return
    this.isReconnect = true
    this.reconnectTimes--
    utils.log('[' + config.reconnetInterval / 1e3 + 's后开始重连...' + ']')
    setTimeout(() => {
      this.connecting.call(this)
    }, config.reconnetInterval)
  }

  /**
   * token登录
   */
  public loginByIMToken(
    uid: string,
    token: string,
    device: string,
    version: string
  ) {
    const key = this.options.appKey

    //入参protobuf封装
    const model = this.rootProto.IM_LoginToken.create({
      UserID: uid,
      Token: token,
      Device: device,
      Version: version,
      Appkey: key
    })
    //序列化
    const imToken = this.rootProto.IM_LoginToken.encode(model).finish()
    //发送消息
    this.sendBuffer(ProtoCodeToNum.login, imToken)
  }

  /**
   * 加入频道
   */
  public joinChannel(
    channel: string,
    type?: number,
    success?: Function,
    fail?: Function
  ) {
    try {
      if (!channel) {
        utils.log('[channelId不存在!]')
        return
      }
      this.joinedChannelId = channel
      const ch = this.getChanelBuffer(channel, type)
      this.sendBuffer(ProtoCodeToNum.joinChannel, ch, success, fail)
    } catch (e) {
      utils.warn('[joinChannel error]', e)
    }
  }

  // 根据channelId和type获取channel buffer
  private getChanelBuffer(channel: string, type?: number): ArrayBuffer {
    const model = this.rootProto.IM_Channel.create({
      ChannelID: channel,
      type: type || 0
    })
    return this.rootProto.IM_Channel.encode(model).finish()
  }

  /**
   * 退出频道
   */
  public exitChannel(channel: string) {
    const ch = this.getChanelBuffer(channel, 0)
    this.sendBuffer(ProtoCodeToNum.exitChannel, ch)
  }

  /**
   * 退出登录
   */
  public logout() {
    const callback = (params: any) => {
      utils.log('[websocket中 logout callback]', params)
      // clearTimeout(this.heartTimer)
      clearInterval(this.heartTimer)
      this.heartTimer = undefined
      this.currentSocket = null
    }
    this.sendBuffer(ProtoCodeToNum.logout, undefined, callback, callback)
  }

  /**
   * 给频道发送信息
   */
  public sendToChannel(
    ch: string,
    content: string,
    protocol: number,
    success?: Function,
    fail?: Function
  ) {
    if (this.isStop) return
    if (!ch) {
      utils.log('[channlid不能为空]')
      utils.triggerCallback(fail, 'channelId不能为空')
      return
    }
    utils.log('[sendToChannel，当前currentSocket对象]', this.currentSocket)
    const model = {
      Seq: new Date().getTime(),
      ChannelID: ch,
      ContentType: 1,
      Content: content,
      Persist: protocol !== 200
    }
    const errMsg = this.rootProto.IM_SendChannelMessage.verify(model)
    if (errMsg) {
      utils.triggerCallback(fail, '模型验证错误')
      throw Error(errMsg)
    }
    const message = this.rootProto.IM_SendChannelMessage.create(model)
    const buffer = this.rootProto.IM_SendChannelMessage.encode(message).finish()
    this.sendBuffer(ProtoCodeToNum.sendToChannel, buffer, success, fail)
  }

  /**
   * 登录反馈成功，
   * 1分钟进行一次心跳检测,这个写法有问题
   */
  // public startHeart_old() {
  //   console.log('startHeart-isStop', this.isStop);
  //   if (this.isStop) return
  //   clearTimeout(this.heartTimer)
  //   this.heartTimer = setTimeout(() => {
  //     utils.log(`%c [发送心跳检测]-${new Date().toLocaleTimeString()}`, "color:blue;font-size:20px;")
  //     this.sendBuffer(ProtoCodeToNum.hearts)
  //     if (
  //       this.currentSocket &&
  //       this.currentSocket.readyState == WebSocket.OPEN
  //     ) {
  //       this.startHeart()
  //     }
  //   }, 60 * 1000)
  // }

  public startHeart() {
    clearInterval(this.heartTimer)
    this.heartTimer = setInterval(() => {
      if (this.isStop) return

      if (this.currentSocket &&
        this.currentSocket.readyState == WebSocket.OPEN
      ) {
        utils.log(`%c [发送心跳检测]-${new Date().toLocaleTimeString()}`, "color:yellow;font-size:20px;")
        this.sendBuffer(ProtoCodeToNum.hearts)
      } else {
        utils.log(`%c [发送心跳检测异常]-${new Date().toLocaleTimeString()}`, "color:red;font-size:20px;")
        clearInterval(this.heartTimer)
      }
    }, 30 * 1000)
  }

  private socketMessageDispatcher(protocol: number, arBuf: ArrayBuffer) {
    if (this.isStop) return
    const buffer = decompress(arBuf)
    let obj: any = {}
    switch (protocol) {
      // IMToken 登录反馈(与即时通讯团队张少帅沟通得知：已经不用了)
      // case 2:
      //   obj = this.rootProto.IM_Feedback.decode(buffer)
      //   if (obj.ResultCode == 0) this.startHeart()
      //   break

      // 161: '发送私信反馈'
      // 163: '发送私信回执反馈'
      // 171: 收到私信回执
      // 254 收到session info

      // 对方私信撤回
      case 101:
        obj = this.rootProto.IM_ReceiveRecallMsg.decode(buffer)
        eventManager.trigger(EventEnum.recallMessages, obj, protocol)
        break
      case 161:
      case 163:
      case 171:
      case 254:
        obj = this.rootProto.IM_Feedback.decode(buffer)
        eventManager.trigger(EventEnum.sendPrivateReceiptFeedback, obj, protocol)
        break
      // 发送到频道反馈
      case 167:
        obj = this.rootProto.IM_Feedback.decode(buffer)
        if (obj.ResultCode == 0) {
          /**
           * 发送到频道反馈成功
           */
          eventManager.trigger(EventEnum.sendToChannelFeedback_success, obj)
        } else {
          /**
           * 发送到频道反馈失败
           */
          utils.warn('[发送到频道反馈失败]')
          eventManager.trigger(EventEnum.sendToChannelFeedback_fail, obj)
        }
        break
      case 170:
        // protocol：170  obj：私信消息
        obj = this.rootProto.IM_ReceivePrivateMessage.decode(buffer)
        eventManager.trigger(EventEnum.privateMessages, obj, protocol)
        break
      // 组群消息
      case 172:
        obj = this.rootProto.IM_ReceiveGroupMessage.decode(buffer)
        eventManager.trigger(EventEnum.groupMessages, obj, protocol)
        break
      // 频道普通消息
      case 174:
        obj = this.rootProto.IM_ReceiveChannelMessage.decode(buffer)
        eventManager.trigger(EventEnum.messages, obj, protocol)
        break
      // 收到服务器通知
      case 252:
        obj = this.rootProto.IM_ServerNotice.decode(buffer)
        // if (obj.Category == 1) {
        //   utils.log('[收到服务器通知]', obj)
        // }
        break
      // 取消频道订阅的反馈
      case 223:
        break
      //订阅频道反馈
      case 224:
        obj = this.rootProto.IM_Feedback.decode(buffer)
        if (obj?.ResultCode == 0) {
          /**
           * 订阅频道反馈成功
           */
          eventManager.trigger(EventEnum.joinChannelSuccess, obj.ResultData)
        } else {
          /**
           * 订阅频道反馈失败
           */
          utils.warn('[订阅频道反馈失败]')
          eventManager.trigger(EventEnum.joinChannelFail, obj)
        }
        break
      //  登录反馈
      case 253:
        obj = this.rootProto.IM_Feedback.decode(buffer)
        if (obj?.ResultCode == 0) {
          this.reconnectTimes = 5
          //登录成功，1分钟进行一次心跳检测
          this.startHeart()
        }
        eventManager.trigger(EventEnum.imlogin, obj)
        break
    }
    eventManager.trigger(
      EventEnum.protocol,
      protocol,
      //@ts-ignore
      ProtoCodeToCN[protocol],
      obj
    )
    //@ts-ignore
    utils.log('[收到协议]', protocol, ProtoCodeToCN[protocol], obj)
  }

  public reset() {
    this.bufferLength = 0
    this.readBuffer = null
    this.sendBuffer(ProtoCodeToNum.reset)
  }

  public stop() {
    this.isStop = true
    this.currentSocket && this.currentSocket.close(1000, 'Closing normally')
    this.currentSocket = null
  }

  /**
   * 私信已读回执
   */
  // ReceiptType 0 已收回执，1已读回执
  public sendPrivateReceipt(msgId: number, rId: string, type?: number) {
    if (this.isStop) return
    const Seq = Math.floor(Math.random() * (9999 - 1000)) + 1000
    const model = {
      Seq,
      ReceiptType: type || 0,
      MsgID: msgId,
      ReceiverID: rId
    }
    const message = this.rootProto.IM_SendPrivateReceipt.create(model)
    const buffer = this.rootProto.IM_SendPrivateReceipt.encode(message).finish()
    this.sendBuffer(ProtoCodeToNum.sendPrivateReceipt, buffer)
  }

  /**
   * 私信
   */
  public sendMessage(
    receiveId: string,
    content: string,
    ack: boolean,
    persist: boolean,
    success?: Function,
    fail?: Function
  ) {
    if (this.isStop) return
    const model = {
      Seq: +new Date(),
      ReceiverID: receiveId,
      Content: content,
      Ack: !!ack,
      Persist: !!persist
    }
    const errMsg = this.rootProto.IM_SendPrivateMessage.verify(model)
    if (errMsg) {
      utils.triggerCallback(fail, '模型验证错误')
      throw Error(errMsg)
    }
    const message = this.rootProto.IM_SendPrivateMessage.create(model)
    const buffer = this.rootProto.IM_SendPrivateMessage.encode(message).finish()
    this.sendBuffer(ProtoCodeToNum.sendPrivateMessage, buffer, success, fail)
  }
  /**
   * 发送私信消息（基金专用）
   */
  public sendMessageForApp(
    receiveId: string,
    content: string,
    contentType: number,
    ack: boolean,
    persist: boolean,
    success?: Function,
    fail?: Function
  ) {
    if (this.isStop) return
    const model = {
      Seq: +new Date(),
      ReceiverID: receiveId,
      ContentType: contentType,
      Content: content,
      Ack: !!ack,
      Persist: !!persist
    }
    const errMsg = this.rootProto.IM_SendPrivateMessage.verify(model)
    if (errMsg) {
      utils.triggerCallback(fail, '模型验证错误')
      throw Error(errMsg)
    }
    const message = this.rootProto.IM_SendPrivateMessage.create(model)
    const buffer = this.rootProto.IM_SendPrivateMessage.encode(message).finish()
    this.sendBuffer(ProtoCodeToNum.sendPrivateMessage, buffer, success, fail)
  }
}

