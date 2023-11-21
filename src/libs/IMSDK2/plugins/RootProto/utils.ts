import { utils } from '../../utils'
import '../../lib/ProtoBuf'

//@ts-ignore
const protobuf = window.protobuf

/**
 * 自动生成proto Js语句
 * http://www.javashuo.com/article/p-fhjmdegs-ky.html
 */

const createProto = (name: string, ...args: [string, string?, string?][]) => {
  let obj = new protobuf.Type(name)
  args.forEach((p, i) => {
    const key = i + 1
    obj.add(new protobuf.Field(p[0], key, p[1] || 'string'))
  })
  return obj
}

const createEnum = (name: string, list: string[]) => {
  let obj = new protobuf.Enum(name)
  list.forEach((p, i) => {
    obj.add(p, i)
  })
  return obj
}

export const initRoot = () => {
  // 说明浏览器加载失败
  if (typeof protobuf == 'undefined') return
  utils.Timer.start('proto')

  try {
    const root = new protobuf.Root().define('IMProtoEntity')
    root.add(
      createProto(
        'IM_LoginToken',
        ['UserID'],
        ['Token'],
        ['Device'],
        ['Version', 'int32'],
        ['Appkey']
      )
    )
    root.add(
      createProto(
        'IM_Feedback',
        ['ResultCode', 'int32'],
        ['ResultData'],
        ['Seq', 'int32'],
        ['MsgID']
      )
    )
    root.add(
      createProto(
        'IM_ServerNotice',
        ['Category', 'IM_NoticeCategory'],
        ['Content']
      )
    )
    root.add(createProto('IM_Channel', ['ChannelID'], ['Type', 'int32']))
    root.add(
      createProto(
        'IM_SendGroupMessage',
        ['Seq', 'int32'],
        ['GroupID'],
        ['Content'],
        ['Ack', 'bool'],
        ['Persist', 'bool'],
        ['ContentType', 'int32']
      )
    )
    root.add(
      createProto(
        'IM_ReceiveGroupMessage',
        ['MsgID'],
        ['MsgIndexID', 'int64'],
        ['SenderID'],
        ['GroupID'],
        ['Content'],
        ['Ack', 'bool'],
        ['SendDateTime', 'int32'],
        ['ContentType', 'int32']
      )
    )
    root.add(
      createProto(
        'IM_SendPrivateMessage',
        ['Seq', 'int32'],
        ['ReceiverID'],
        ['Content'],
        ['Ack', 'bool'],
        ['Persist', 'bool'],
        ['ContentType', 'int32']
      )
    )
    root.add(
      createProto(
        'IM_ReceivePrivateMessage',
        ['MsgID'],
        ['SenderID'],
        ['ReceiverID'],
        ['Content'],
        ['Ack', 'bool'],
        ['SendDateTime', 'int32'],
        ['ContentType', 'int32'],
        ["Sender", "IM_UserInfo"],
        ["NeedReceipt", "bool"],
        ["MsgIndexID", "int64"],
        ["Receiver", "IM_UserInfo"]
      )
    )
    root.add(
      createProto(
        'IM_SendChannelMessage',
        ['Seq', 'int32'],
        ['ChannelID'],
        ['ContentType', 'int32'],
        ['Content'],
        ['Persist', 'bool']
      )
    )
    root.add(
      createProto(
        'IM_ReceiveChannelMessage',
        ['MsgID'],
        ['MsgIndexID', 'int64'],
        ['SenderID'],
        ['ChannelID'],
        ['Content'],
        ['SendDateTime', 'int32'],
        ['ContentType', 'int32']
      )
    )
    root.add(
      createProto(
        'IM_SendPrivateReceipt',
        ['Seq', 'int32'],
        ['ReceiptType', 'IM_ReceiptType'],
        ['MsgID'],
        ['ReceiverID']
      )
    )
    root.add(
      createProto(
        'IM_ReceivePrivateReceipt',
        ['ReceiptType', 'IM_ReceiptType'],
        ['MsgID'],
        ['SendDateTime', 'int32'],
        ['SenderID']
      )
    )
    root.add(
      createProto(
        'IM_SendGroupReceipt',
        ['Seq', 'int32'],
        ['ReceiptType', 'IM_ReceiptType'],
        ['MsgID'],
        ['GroupID']
      )
    )
    root.add(
      createProto(
        'IM_ReceiveGroupReceipt',
        ['GroupID'],
        ['ReceiptType', 'IM_ReceiptType'],
        ['ReceiverID'],
        ['MsgID'],
        ['SendDateTime', 'int32']
      )
    )
    root.add(
      createProto(
        'IM_ReceiveRecallMsg',
        ["MsgID"],
        ["ImUserID"],
        ["Type", "int32"],
        ["OldMsgID"],
        ["ReplaceMsg"],
        ["ReferId"],
        ["ContentType", "int32"]
      )
    )

    root.add(
      createProto("IM_UserInfo",
        ["UserID"],
        ["Nick"],
        ["CertifiedType", "int32"]
      )
    )


    root.add(createEnum('IM_NoticeCategory', ['Unknown', 'Offline']))
    root.add(createEnum('IM_ReceiptType', ['Receive', 'Read']))
    utils.Timer.stop('proto')

    utils.log('[proto 加载完毕，耗时]', utils.Timer.getTime('proto'))

    return root
  } catch (e) {
    utils.warn('[proto 加载失败，请确定协议文件是否正确]', e)
  }
}
