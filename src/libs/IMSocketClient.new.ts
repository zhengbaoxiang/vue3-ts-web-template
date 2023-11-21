
import IMSDK from './IMSDK2'
import { utils } from './IMSDK2/utils'
import { EventEnum } from './IMSDK2/constants'

interface Options {
  config: {
    imUserID: string
    device: string
    refreshToken: string
    accessToken: string
    channelId: string
  }
  //   onMessage: (data: EMIMData.RecieveIMHasParsed) => void   // 参数格式完善
  onMessage: (data: any) => void  // 接收正常消息
  onCancelMessage: (data: any) => void // 接收撤回消息
  onSuccess: (data?: any) => void
  onError: (data?: any) => void
  onDisconnected?: (data?: any) => void
  onRefreshToken: (token: string) => void
  WebSocketConfig: any
}

class WebSocketClient {
  private options: Options | null = null
  private _clinetSDK: IMSDK | null = null

  constructor(options: Options) {
    this.options = options
    this.init()
  }

  // 初始化
  private init = () => {
    if (!this.options) return
    const { imUserID, device, refreshToken, accessToken } = this.options.config
    if (!imUserID || !device || !refreshToken || !accessToken) {
      this.options.onError('初始化参缺失')
      return
    }

    if (this._clinetSDK) {
      this.close()
    }

    // 建里socket链接
    this._clinetSDK = new IMSDK({
      ...this.options.WebSocketConfig,
    })
    // 建立监听事件，将socket事件的回调数据传出
    this.onListenSoketConnectError()
    this.onListenSoketConnected()
    this.onListenSoketDisConnected()
    this.onListenPrivateMessage()
    this.onListenPrivateCancelMessage()
    this.onListenRefreshToken()
    // this.onListenJoinChannel()
    // this.onListenProtocol()
    // this.onListenMessage()
  }
  /* 关闭socket */
  public close = () => {
    utils.log(`[发起了IMSocketClient clsose，触发了logout]`)
    this._clinetSDK?.logout()
    this._clinetSDK = null
  }



  /* socket连接成功 时触发回调，开始登录 */
  private onListenSoketConnected = () => {
    this._clinetSDK.on(EventEnum.connected, () => {
      utils.log('[即将开始登录]', true, false)
      if (!this.options?.config) return
      this.options?.onSuccess('connected')
      this.loginByIMToken()
      // this.joinChannel()
    })
  }
  /* socket开始登录 */
  private loginByIMToken = () => {
    if (!this.options?.config || !this._clinetSDK) return
    const { imUserID, device, refreshToken, accessToken } = this.options.config
    this._clinetSDK.loginByIMToken(
      imUserID,
      accessToken,
      device,
      '1',
      refreshToken
    )
  }

  /* socket连接关闭 */
  private onListenSoketDisConnected = () => {
    this._clinetSDK.on(EventEnum.disconnected, (data) => {
      utils.log(`[websocket_disconnected]`, data)
      this.options.onDisconnected && this.options.onDisconnected(data)
    })
  }
  /* 监听websocket连接失败 */
  private onListenSoketConnectError = () => {
    this._clinetSDK.on(EventEnum.error, (error: any) => {
      try {
        error = typeof error === 'object' ? JSON.stringify(error) : error
      } catch (error) {
        console.log('-2>', error)
      }
      utils.log(`[websocket连接失败]${error}`)
      this.options.onError && this.options?.onError(error)
    })
  }

  /* 监听刷新token */
  private onListenRefreshToken = () => {
    this._clinetSDK.on(EventEnum.refreshToken, (accessToken: string) => {
      this.options?.onRefreshToken(accessToken)
      utils.log(`[刷新Token]-${new Date()}`)
    })
  }


  /* 收到私信消息 */
  private onListenPrivateMessage = () => {
    this._clinetSDK.on(
      EventEnum.privateMessages,
      async (data: any) => {
        if (!data?.Content) return
        // console.log(`[收到私信消息][时间：${new Date()}][消息内容：${data.Content}]`)
        this.options?.onMessage(data)
      }
    )
  }
  /* 收到私信撤回消息 */
  private onListenPrivateCancelMessage = () => {
    this._clinetSDK.on(
      EventEnum.recallMessages,
      async (data: any) => {
        if (!data) return
        console.log(`[收到私信撤回消息][时间：${new Date()}][消息内容：${data.ReplaceMsg}]`)
        this.options?.onCancelMessage(data)
      }
    )
  }

  /* 加入频道 */
  private joinChannel = () => {
    if (!this.options?.config || !this._clinetSDK) return
    const channelId = this.options.config.channelId
    this._clinetSDK.joinChannel(
      channelId,
      0,
      () => {
        utils.log(`[加入Channel操作发送成功]${channelId}`, true, false)
      },
      () => {
        utils.log(`[加入Channel操作发送失败]`)
      }
    )
  }
  /* 订阅频道反馈 */
  private onListenJoinChannel = () => {
    if (!this._clinetSDK) return
    this._clinetSDK.on(EventEnum.joinChannelSuccess, (data: string) => {
      utils.log(`[joinChannelSuccess]${data}`)
      this.options?.onSuccess('加入channel成功')
    })
    this._clinetSDK.on(EventEnum.joinChannelFail, (data: string) => {
      utils.log(`[joinChannelFail]${data}`)
      this.options?.onError('加入channel失败')
    })
  }
  /**
   * 收到协议
   * SDK中有，就不要单独打印了
   */
  private onListenProtocol = () => {
    if (!this._clinetSDK) return
    this._clinetSDK.on(
      EventEnum.protocol,
      (protocolNum: number, protocolCHN: string, data: object) => {
        utils.log(
          `[收到协议]协议编号：${protocolNum} 协议对应的中文：${protocolCHN}`,
          true,
          false
        )
      }
    )
  }
  /* 收到消息 */
  private onListenMessage = () => {
    if (!this._clinetSDK) return
    this._clinetSDK.on(
      EventEnum.messages,
      //   async (data: EMIMData.RecieveIMUnParse) => { // 参数格式完善
      async (data: any) => {
        if (!data?.Content) return
        console.log(`[收到频道消息][时间：${new Date()}]` + data.Content)
        try {
          const mesData = JSON.parse(data.Content)
          this.options?.onMessage(mesData)
        } catch (error) {
          utils.log(`[消息格式解析错误]${error}`)
        }
      }
    )
  }


  /* socket 私信 */
  public sendMessage = (receiveId: string, data: string, success: Function, error: Function) => {
    if (!this._clinetSDK || !this.options?.config) return
    utils.log(`[发送给私信的问题]${data}`, true, false)
    this._clinetSDK.sendMessage(
      receiveId,
      data,
      true,
      "true",
      (res: any) => {
        utils.log(`[发送给私信成功]${JSON.stringify(res)}`, true, false)
        success(res)
      },
      (err: any) => {
        try {
          err = typeof error === 'object' ? JSON.stringify(error) : ''
        } catch (error) { }
        utils.log(`[发送给私信失败]${err}`)
        error(err)
      }
    )
  }

  /* 发送私信消息（基金专用） */
  public sendMessageForApp = (receiveId: string, data: string, contentType: number, success: Function, error: Function) => {
    if (!this._clinetSDK || !this.options?.config) return
    utils.log(`[发送给私信的问题]${data}`, true, false)
    this._clinetSDK.sendMessageForApp(
      receiveId,
      data,
      contentType,
      true,
      "true",
      (res: any) => {
        utils.log(`[发送给私信成功]${JSON.stringify(res)}`, true, false)
        success()
      },
      (err: any) => {
        try {
          err = typeof error === 'object' ? JSON.stringify(error) : ''
        } catch (error) { }
        utils.log(`[发送给私信失败]${err}`)
        error()
      }
    )
  }

  /* 发送信息 */
  public sendToChannel = (data: string, success: Function, error: Function) => {
    if (!this._clinetSDK || !this.options?.config) return
    utils.log(`[发送给频道的问题]${data}`, true, false)
    this._clinetSDK.sendToChannel(
      this.options.config.channelId,
      data,
      0,
      (res: any) => {
        utils.log(`[发送给频道消息成功]${JSON.stringify(res)}`, true, false)
        success()
      },
      (err: any) => {
        try {
          err = typeof error === 'object' ? JSON.stringify(error) : ''
        } catch (error) { }
        utils.log(`[发送给频道消息失败]${err}`)
        error()
      }
    )
  }

}

export default WebSocketClient
