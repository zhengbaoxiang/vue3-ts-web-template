/*
 * @Date: 2023-07-31 14:12:21
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-13 16:15:32
 * @descript: 文件描述
 */
import { Utils } from './shared'
import { config } from '../config'

export { eventManager, type EventHandler } from './EventManager'

export const utils: Utils = {
  triggerCallback(fun?: Function, ...args: any[]) {
    if (typeof fun === 'function') {
      fun.apply(null, args)
    }
  },
  triggerCallbackbyresult: function (res, success, fail) {
    if (res?.result == 1) {
      this.triggerCallback(success, res)
    } else {
      this.triggerCallback(fail, res)
    }
  },
  log: (...args: any[]) => {
    try {
      config.debug && console?.log.apply(null, args)
    } catch (error) { }
  },
  warn: (...args: any[]) => {
    try {
      config.debug && console?.warn.apply(null, args)
    } catch (error) { }
  },
  info: (...args: any[]) => {
    try {
      config.debug && console?.info.apply(null, args)
    } catch (error) { }
  },
  /**
   * 用于计算耗时
   */
  Timer: {
    data: {},
    start: function (key) {
      this.data[key] = +new Date()
    },
    stop: function (key) {
      const time = this.data[key]
      if (time) this.data[key] = +new Date() - time
    },
    getTime: function (key) {
      return this.data[key] + 'ms'
    }
  },
  device: () => {
    const inBrowser = typeof window !== 'undefined'
    const UA = inBrowser && window.navigator.userAgent.toLowerCase()
    const isAndroid = UA && UA.indexOf('android') > 0
    const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA)
    if (isAndroid) return 'Android'
    if (isIOS) return 'IOS'
    return 'PC'
  }
}
