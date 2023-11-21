import { eventManager, EventHandler } from './utils/EventManager'
import { utils } from './utils'
import { api, config, updateConfig } from './config'
import { Config } from './config/shared'
import { WebsocketStrategy, PollingStrategy, Http, RootProto } from './plugins'
import { Parttern, Root } from './plugins/shared'
import { EventEnum } from './constants'

const global = window

class ImSdk {
  /**
   * 默认设置当前模式是socket
   */
  currentParttern: Parttern = Parttern.websocket

  options: Config | null = null
  currentStrategy: WebsocketStrategy | PollingStrategy | null = null

  rootProto: Root | null = null

  imUserID: string = ''
  accessToken: string = ''
  refreshToken: string = ''
  joinedChannelId: string = ''

  websocketUrl: string = ''

  hasAuth: boolean = false

  /**
   * loginByIMToken中定时调用RefreshToken去刷新token
   */
  refreshTokenTimer: undefined | number

  /**
   * 刷新token失败计数器，类似3次会触发订阅事件：refreshTokenFail
   */
  refreshTokenNum = 0

  constructor(props: Config) {
    this.initailize(props)
  }

  private initailize(options: Config) {
    if (!options || !Object?.keys(options).length) {
      alert('实例化IMClientSDK参数不全，请检查')
      return
    }

    updateConfig(options)
    this.options = Object.assign({}, config, options)

    // 如果指定轮询
    if (!this.options.websocketUrl) {
      this.currentParttern = Parttern.polling
    }

    utils.log('[options]', this.options)

    /**
     * ie10+ 才能使用WebSocket 因为使用了ArrayBuffer 只支持到ie10+
     * 没有这两个对象 强制启动到轮询
     */
    if (
      config.sendBypoll ||
      // @ts-ignore
      typeof global.protobuf == 'undefined' ||
      !window.WebSocket ||
      this.currentParttern == Parttern.polling
    ) {
      this.currentParttern = Parttern.polling
      this.init()
      return
    }

    if (this.currentParttern === Parttern.websocket) {
      try {
        this.rootProto = RootProto.root
      } catch (e) {
        // 如果初始化protobuf失败，则变更模式为轮询
        utils.warn('[初始化protobuf失败]', e)
        this.currentParttern = Parttern.polling
      }
    }

    this.init()
  }

  private init() {
    const { rootProto, options, currentParttern } = this
    if (!options) return
    const strategtObj = {
      rootProto: rootProto!,
      options,
      currentParttern
    }

    if (this.currentParttern === Parttern.websocket) {
      this.currentStrategy = new WebsocketStrategy(strategtObj)
    } else {
      this.currentStrategy = new PollingStrategy(strategtObj)
    }

    utils.log('[初始化成功，正在start...]', this.currentParttern)
    this.currentStrategy.start()
  }

  // todo 这里需要将ws模式下已经启动的相关定时器都要清除，否则会引发内存泄漏
  // 如果ws停止了，则开始轮询操作
  startLongpoll() {
    this.currentParttern = Parttern.polling
    if (!this.options) return
    this.currentStrategy = new PollingStrategy({
      options: this.options,
      currentParttern: this.currentParttern
    })
    this.currentStrategy.start()
    this.currentStrategy.joinChannel(this.joinedChannelId)
  }

  /**
   * 根据 refreshToken  刷新token
   */
  handleRefreshToken(success?: Function, fail?: Function) {
    const tokenUrl = api.RefreshToken()
    utils.log('[刷新token Url]' + tokenUrl)
    const data = {
      refreshToken: this.refreshToken,
      oldToken: this.accessToken,
      accessToken: this.accessToken,
      imUserID: this.imUserID
    }
    Http.httpRequest(
      tokenUrl,
      data,
      (res: any) => {
        if (res.result == 1 && res.data) {
          const { RefreshToken, Token, IMUserID } = res.data
          utils.log('[刷新token success]', res.data)
          this.refreshToken = RefreshToken
          this.accessToken = Token
          this.imUserID = IMUserID
          eventManager.trigger(EventEnum.refreshToken, this.accessToken)
        } else {
          utils.log('[token不合法或者必填值为空~]')
          this.refreshTokenNum++
          this.tryRefreshToken(success, fail)
        }
      },
      () => utils.log('[刷新token fail]')
    )
  }

  /**
   *  登录IM
   *  定时刷新Token
   */
  loginByIMToken(
    uid: string,
    token: string,
    device: string,
    version: string,
    rt: string,
    success?: Function,
    fail?: Function
  ) {
    if (!this.currentStrategy) return
    this.imUserID = uid
    this.accessToken = token
    this.refreshToken = rt

    this.currentStrategy.loginByIMToken(uid, token, device, version)

    this.hasAuth = true

    /**
     * 需要不断定时刷新token 8min/次
     * stop时候，需要清空定时器
     */
    this.refreshTokenTimer = setInterval(() => {
      if (!this.refreshToken) return
      this.handleRefreshToken(success, fail)
    }, 8 * 60 * 1e3)
  }

  /**
   * 刷新失败，尝试继续刷新
   * oldName: getRefreshToken
   */
  tryRefreshToken(success?: Function, fail?: Function) {
    if (!this.refreshToken) return
    // 如果刷新token已经失败3次了
    if (this.refreshTokenNum >= 3) {
      const data = {
        result: -1,
        message: '刷新token已经失败3次了'
      }
      utils.triggerCallback(fail, data)
      eventManager.trigger(EventEnum.refreshTokenFail, this.accessToken)

      // 重置定时器
      clearInterval(this.refreshTokenTimer)
      this.refreshTokenTimer = undefined
      return
    }

    this.handleRefreshToken(success, fail)
  }

  /**
   * 重置
   */
  reset() {
    this.currentStrategy?.reset()
    this.resetParams()
  }

  resetParams() {
    this.currentStrategy = null
    this.rootProto = null
    this.imUserID = ''
    this.accessToken = ''
    this.refreshToken = ''
    this.joinedChannelId = ''
    this.hasAuth = false
    this.refreshTokenNum = 0

    if (this.refreshTokenTimer) {
      clearInterval(this.refreshTokenTimer)
      this.refreshTokenTimer = undefined
    }
  }

  /**
   * 加入频道
   */
  joinChannel(channel: string, type = 0, success?: Function, fail?: Function) {
    // 如果传入的id和已加入的channelId相同，则不作处理
    if (!channel || channel === this.joinedChannelId || !this.currentStrategy) {
      return
    }

    this.joinedChannelId = channel

    // 对于WebSocket方式，认证之后才能joinchannel  但轮询就不需要
    if (this.currentParttern === Parttern.websocket && !this.hasAuth) return

    this.currentStrategy.joinChannel(channel, type, success, fail)

    // const device = utils.device()
    //   Http.userEnter(
    //     this.joinedChannelId,
    //     device,
    //     this.accessToken,
    //     this.imUserID,
    //     () => {
    //       this.currentStrategy.joinChannel(channel, type)
    //       utils.log('joinChannel', channel)
    //     }
    //   )
  }

  exitChannel(channel: string) {
    if (this.currentParttern === Parttern.polling) return
      ; (this.currentStrategy as WebsocketStrategy).exitChannel(channel)
  }

  logout() {
    eventManager.clear()
    this.currentStrategy?.logout()
    this.currentStrategy = null
    clearInterval(this.refreshTokenTimer)
    this.refreshTokenTimer = undefined
  }

  sendToChannel(
    ch: string,
    content: string,
    protocol: number,
    success?: Function,
    fail?: Function
  ) {
    // 因为WebSocket不给发送者推消息，发送者得不到消息的时间
    this.currentStrategy?.sendToChannel(ch, content, protocol, success, fail)
  }

  startHeart() {
    ; (this.currentStrategy as WebsocketStrategy)?.startHeart()
  }

  /**
   * 发送私信
   */
  sendMessage(rid: string, content: string, ack: boolean, persist: string, success?: Function, fail?: Function) {
    this.currentStrategy?.sendMessage(
      rid,
      content,
      ack,
      !!persist,
      success,
      fail
    )
  }


  /**
   * 发送私信消息（基金专用）
   */
  sendMessageForApp(rid: string, content: string, contentType: number, ack: boolean, persist: string, success?: Function, fail?: Function) {
    this.currentStrategy?.sendMessageForApp(
      rid,
      content,
      contentType,
      ack,
      !!persist,
      success,
      fail
    )
  }




  /**
   * 订阅事件
   * @param type 事件类型
   * @param event 事件回调
   */
  on = (type: EventEnum, event: EventHandler) => {
    eventManager.addEventListener(type, event)
  }

  /**
   * 移除订阅
   * @param type 事件类型
   * @param event 事件回调
   */
  off = (type: EventEnum, event: EventHandler) => {
    eventManager.removeEventListener(type, event)
  }
}

export default ImSdk
