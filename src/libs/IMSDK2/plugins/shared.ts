/*
 * @Date: 2023-07-31 14:12:21
 * @LastEditors: zbx
 * @LastEditTime: 2023-07-31 15:14:07
 * @descript: 文件描述
 */
import { type Root } from './RootProto'
export { Root }
export interface CurrentParttenOptions {
  websocketUrl: string
  appKey: string
}

export enum Parttern {
  websocket = 'websocket',
  polling = 'polling'
}

export interface CurrentParttenProps {
  currentParttern: Parttern
  rootProto: Root
  options: CurrentParttenOptions
}
