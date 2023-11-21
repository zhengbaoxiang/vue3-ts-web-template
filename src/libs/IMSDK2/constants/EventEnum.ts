/*
 * @Date: 2023-07-31 14:12:21
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-06 15:28:15
 * @descript: 文件描述
 */
export enum EventEnum {
  /**
   * 连接
   */
  connected = 'connected',
  /**
   * 重连
   */
  reConnected = 'reConnected',
  /**
   * 关闭
   */
  disconnected = 'disconnected',
  /**
   * 启动轮询
   */
  start_long_poll = 'start_long_poll',
  /**
   * 错误信息
   */
  error = 'error',
  /**
   * 加入频道成功
   */
  joinChannelSuccess = 'joinChannelSuccess',
  /**
   * 加入频道失败
   */
  joinChannelFail = 'joinChannelFail',
  /**
   * 刷新Token
   */
  refreshToken = 'refreshToken',
  /**
   * 刷新Token 失败
   */
  refreshTokenFail = 'refreshTokenFail',
  /**
   * 频道普通消息
   */
  messages = 'messages',
  /**
   * 收到消息对应的协议
   */
  protocol = 'protocol',
  /**
   * 组群消息
   */
  groupMessages = 'groupMessages',
  /**
   * 发送私信回执反馈
   */
  sendPrivateReceiptFeedback = 'sendPrivateReceiptFeedback',

  /**
   * 对方私信撤回
   */
  recallMessages = 'recallMessages',

  /**
   * 登录反馈
   */
  imlogin = 'imlogin',
  /**
   * 发送到频道 成功反馈
   */
  sendToChannelFeedback_success = 'sendToChannelFeedback_success',
  /**
   * 发送到频道 失败反馈
   */
  sendToChannelFeedback_fail = 'sendToChannelFeedback_fail',
  /**
   * 私信
   */
  privateMessages = 'privateMessages',
  /**
   * 轮询消息
   */
  pollmessages = 'pollmessages'
}
