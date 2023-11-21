/*
 * @Date: 2023-07-31 14:12:21
 * @LastEditors: zbx
 * @LastEditTime: 2023-08-23 15:28:34
 * @descript: 文件描述
 */
import './IMSDK/IMClientSDK'
import './IMSDK/ProtoBuf'
import './IMSDK/gunzip'
import { logger } from '../utils/tools'
// import Logger from 'emrn-common/utils/logger'

interface Options {
  config: {
    imUserID: string
    device: string
    refreshToken: string
    accessToken: string
    channelId: string
  }
  onMessage: (data: EMIMData.RecieveIMHasParsed) => void
  onSuccess: (data?: any) => void
  onError: (data?: any) => void
  onRefreshToken: (token: string) => void
}

interface Socket {
  loginByIMToken: (
    imUserID: string,
    accessToken: string,
    device: string,
    version: '1',
    refreshToken: string
  ) => void
  joinChannel: (
    channelId: string,
    type: null,
    success: Function,
    error: Function
  ) => void
  sendToChannel: (
    channelId: string,
    data: string,
    protocol: 0,
    success: Function,
    error: Function
  ) => void
  on: (event: string, success: Function, error?: Function) => void
  logout: () => void
}

class WebSocketClient {
  private options: Options | null = null
  private _clinetSDK: Socket | null = null
  constructor(options: Options) {
    this.options = options
    this.init()
  }

  private init = () => {
    if (!this.options) return

    if (this._clinetSDK) {
      this.close()
    }

    const { imUserID, device, refreshToken, accessToken } = this.options.config
    if (!imUserID || !device || !refreshToken || !accessToken) {
      this.options.onError('初始化参缺失')
      return
    }

    const { WebSocketConfig } = global.config
    this._clinetSDK = new IMClientSDK({
      ...WebSocketConfig,
    })

    this.onListenSoketInitError()

    this.onListenSoketConnected(() => {
      if (!this.options?.config) return
      this.loginByIMToken()
      this.joinChannel()
      this.onListenRefreshToken()
      this.onListenJoinChannelSuccess()
      this.onListenProtocol()
      this.onListenMessage()
    })
  }

  /* 发送信息 */
  public sendToChannel = (data: string, success: Function, error: Function) => {
    if (!this._clinetSDK || !this.options?.config) return
    logger(`【发送给频道的问题】${data}`, true, false)
    this._clinetSDK.sendToChannel(
      this.options.config.channelId,
      data,
      0,
      (res: any) => {
        logger(`【发送给频道消息成功】${JSON.stringify(res)}`, true, false)
        success()
      },
      (err: any) => {
        try {
          err = typeof error === 'object' ? JSON.stringify(error) : ''
        } catch (error) { }
        logger(`【发送给频道消息失败】${err}`)
        error()
      }
    )
  }

  /* 关闭socket */
  public close = () => {
    logger(`【websocket关闭】`)
    this._clinetSDK?.logout()
    this._clinetSDK = null
  }

  /* 监听websocket启动失败 */
  private onListenSoketInitError = () => {
    if (!this._clinetSDK) return
    this._clinetSDK.on('error', (error: any) => {
      try {
        error = typeof error === 'object' ? JSON.stringify(error) : ''
      } catch (error) { }
      logger(`【websocket启动失败】${error}`)
      this.options?.onError(error)
    })
  }

  /* socket连接成功 */
  private onListenSoketConnected = (success: Function) => {
    if (!this._clinetSDK) return
    this._clinetSDK.on('connected', () => {
      logger('【即将开始登录】', true, false)
      success()
    })
  }

  /* socket开始登录 */
  private loginByIMToken = () => {
    if (!this.options?.config || !this._clinetSDK) return
    const { imUserID, device, refreshToken, accessToken } = this.options.config
    logger(
      `【_clinetSDK.loginByIMToken登录的参数】${JSON.stringify(
        this.options.config
      )}`,
      true,
      false
    )
    this._clinetSDK.loginByIMToken(
      imUserID,
      accessToken,
      device,
      '1',
      refreshToken
    )
  }

  /* 加入频道 */
  private joinChannel = () => {
    if (!this.options?.config || !this._clinetSDK) return
    const channelId = this.options.config.channelId
    this._clinetSDK.joinChannel(
      channelId,
      null,
      () => {
        logger(`【加入Channel成功】${channelId}`, true, false)
        this.options?.onSuccess('加入Channel成功')
      },
      () => {
        logger(`【加入Channel失败`)
        this.options?.onError('加入Channel失败')
      }
    )
  }

  /* 刷新token */
  private onListenRefreshToken = () => {
    if (!this._clinetSDK) return
    this._clinetSDK.on('refreshToken', (accessToken: string) => {
      this.options?.onRefreshToken(accessToken)
      logger(`【刷新Token】${accessToken}`, true, false)
    })
  }

  /* 订阅频道反馈 */
  private onListenJoinChannelSuccess = () => {
    if (!this._clinetSDK) return
    this._clinetSDK.on('joinChannelSuccess', (data: string) => {
      logger(`【joinChannelSuccess】${data}`)
      this.options?.onSuccess()
    })
  }

  /* 收到协议 */
  private onListenProtocol = () => {
    if (!this._clinetSDK) return
    this._clinetSDK.on(
      'protocol',
      (protocolNum: number, protocolCHN: string, data: object) => {
        logger(
          `【收到协议】协议编号：${protocolNum} 协议对应的中文：${protocolCHN}`,
          true,
          false
        )
      }
    )
  }

  /* 收到消息 */
  private onListenMessage = () => {
    if (!this._clinetSDK) return
    this._clinetSDK.on('messages', async (data: EMIMData.RecieveIMUnParse) => {
      this.options?.onSuccess()
      if (!data?.Content) return
      Logger.log(`【收到频道消息messages】【时间：${new Date()}】`)
      console.log(
        `【收到频道消息messages】【时间：${new Date()}】` + data.Content
      )
      try {
        const mesData = JSON.parse(data.Content)
        this.options?.onMessage(mesData)
      } catch (error) {
        logger(`【消息格式解析错误】${error}`)
      }
    })
  }
}

export default WebSocketClient
