/*
 * @Author: zhongxiaowen xiaowen@eastmoney.com
 * @Date: 2023-07-12 09:42:07
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-21 17:22:59
 * @FilePath: \ImEmchat\src\libs\IMSDK2\config\config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 测试线配置
 */
const defaultConfig = {
  appKey: 'YrmEHcrnXP',
  apiUrl: 'https://imcpftest.eastmoney.com:26060',
  websocketUrl: 'wss://imcpftest.eastmoney.com:18080',
}

/**
 * 配置
 */
const config = {
  ...defaultConfig,
  /**
   * 重连间隔
   */
  reconnetInterval: 3 * 1e3,

  /**
   * 是否开启debug
   */
  debug: false,
  /**
   * 如果需要获取发送消息的时间 需要走轮询发送消息
   * 一般默认走的还是WebSocket发
   */
  sendBypoll: false,
  /**
   * 轮询从0 开始 还是从最大索引开始
   */
  pollbyZero: false,
  /**
   * 重连只重连WebSocket
   */
  websocketOnly: false
}

type Config = typeof defaultConfig & Partial<typeof config>

/**
 * 更新配置
 */
const updateConfig = (options: Config) => {
  Object.assign(config, options)
}

export { config, updateConfig, Config }
