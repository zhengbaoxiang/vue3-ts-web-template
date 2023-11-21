/*
 * @Date: 2023-07-31 14:12:21
 * @LastEditors: zbx
 * @LastEditTime: 2023-07-31 15:37:57
 * @descript: 文件描述
 */
import '../../lib/gunzip'

// 将ut8Array转成字符串
export const toBuffer = (
  protocol: number,
  buffer?: ArrayBuffer
): ArrayBuffer => {
  const newBuff = new ArrayBuffer(buffer ? buffer.byteLength + 3 : 3)
  const dv = new DataView(newBuff)
  dv.setInt16(0, newBuff.byteLength, false)
  dv.setInt8(2, protocol)
  if (buffer) {
    const byteBuff = new Uint8Array(newBuff)
    const temp = new Uint8Array(buffer)
    for (let i = 0; i < buffer.byteLength; i++) {
      byteBuff[i + 3] = temp[i]
    }
  }
  return newBuff
}

export const copyTo = (
  source: ArrayBuffer,
  start: number,
  destination: ArrayBuffer,
  offset: number,
  length: number
) => {
  const s = new Uint8Array(source, start, length)
  const d = new Uint8Array(destination, offset, length)
  for (let i = 0; i < length; i++) {
    d[i] = s[i]
  }
}

export const decompress = (buffer: ArrayBuffer): Uint8Array => {
  //@ts-ignore
  const compressed = new Zlib.Gunzip(new Uint8Array(buffer))
  return compressed.decompress()
}

export const closeCodeToExplain = (code: number) => {
  let text = ''
  switch (code) {
    case 1000:
      text = '正常关闭'
      break
    case 1001:
      text = '端点离开 服务关闭或导航到其他页面'
      break
    case 1002:
      text = '协议错误而终止'
      break
    case 1003:
      text = '收到了不能接收的数据类型'
      break
    case 1006:
      text = '连接异常关闭'
      break
    case 1007:
      text = '端点因为消息中接收到的数据是不符合消息类型而终止连接'
      break
    case 1008:
      text = '接收到的消息违反其策略而终止连接'
      break
    case 1009:
      text = '接收到的消息对它的处理来说太大而终止连接'
      break
    default:
      text = '未知code'
  }
  return code + ':' + text
}
