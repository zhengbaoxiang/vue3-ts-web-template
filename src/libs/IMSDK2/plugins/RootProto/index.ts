/*
 * @Date: 2023-07-31 14:12:21
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-06 09:58:37
 * @descript: 文件描述
 */
import { initRoot } from './utils'
import { type Root } from './shared'
export { Root }

export default class RootProto {
  private static _rootProto: Root | null = null

  static get root() {
    if (!RootProto._rootProto) {
      RootProto.loadProto()
    }
    return RootProto._rootProto
  }

  static loadProto() {
    RootProto._rootProto = initRoot()
  }
}
