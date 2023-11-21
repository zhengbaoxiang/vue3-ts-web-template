export interface TimerData {
  [key: string]: number
}

export interface Utils {
  /**
   * 回调：参数作为回调函数的参数
   */
  triggerCallback: (fun?: Function, ...args: any[]) => void
  /**
   * 根据res的result值触发成功还是失败的回调
   */
  triggerCallbackbyresult: (
    res: { result: number },
    success: Function,
    fail: Function
  ) => void
  /**
   * log
   */
  log: (...args: any[]) => void
  /**
   * warn
   */
  warn: (...args: any[]) => void
  /**
   * info
   */
  info: (...args: any[]) => void
  /**
   * 用于计算耗时
   * @example
   * utils.Timer.start('test')
   * utils.Timer.stop('test')
   * utils.Timer.getTime('test')
   */
  Timer: {
    data: TimerData
    start: (key: string) => void
    stop: (key: string) => void
    getTime: (key: string) => string
  }
  /**
   * 获取设备类型
   */
  device: () => 'Android' | 'IOS' | 'PC'
}
