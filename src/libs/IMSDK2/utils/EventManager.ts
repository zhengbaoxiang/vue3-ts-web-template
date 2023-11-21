/*
 * @Date: 2023-07-31 14:12:21
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-11 14:34:30
 * @descript: 文件描述
 */
type EventHandler = (...args: any[]) => void

/**
 * 事件管理器
 */
class EventManager {
  private static instance: EventManager
  private cached: Map<string, any[]> = new Map()
  private handlers: Map<string, EventHandler[]> = new Map()

  /**
   * 获取单例
   */
  public static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager()
    }

    return EventManager.instance
  }

  /**
   * 订阅
   */
  public addEventListener(type: string, handler: EventHandler) {
    if (typeof handler !== 'function') return

    // const handlers = this.handlers.get(type) || []
    const handlers = [] // 每个事件监听一个方法，去重
    handlers.push(handler)
    this.handlers.set(type, handlers)

    // if (this.cached.has(type)) {
    //   console.log('2-缓存触发>', type)
    //   handler(...this.cached.get(type)!)
    // }
  }

  /**
   * 解绑
   */
  public removeEventListener(type: string, handler: EventHandler) {
    const handlers = this.handlers.get(type)
    if (!handlers) return

    this.handlers.set(
      type,
      handlers.filter(h => h !== handler)
    )
  }

  /**
   * 支持先触发后订阅
   */
  public trigger(type: string, ...args: any[]) {
    const handlered = this.handlers.get(type)
    if (handlered) {
      for (let handler of handlered) {
        handler(...args)
      }
    }

    // this.cached.set(type, args) 去掉缓存触发
  }

  /**
   * 离开后清除
   */
  public clear() {
    this.cached.clear()
    this.handlers.clear()
  }
}

const eventManager = EventManager.getInstance()

export { eventManager, EventHandler }
