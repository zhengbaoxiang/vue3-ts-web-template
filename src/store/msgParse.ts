/*
 * @Date: 2023-08-01 17:53:23
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-13 16:02:04
 * @descript: 文件描述
 */
import { defineComponent, ref, computed, reactive, onBeforeMount } from 'vue';
import { IMAPI } from "@/api/IMAPI";
import { AnyObject } from "@/types/global"
import { fileObjToStr } from "@/utils/tools";

//101文本消息 102图片消息 103视频消息 104时间提醒 105引用 903撤回
export const msgTypes = {
  m_text: 101,
  m_pic: 102,
  m_video: 103,
  m_time: 104,
  m_quto: 105,
  m_withdraw: 903,
}
export const msgStatus = {
  preSend: 0, // 预发送
  sending: 1, // 发送中
  sendSuccess: 2, // 发送成功
  sendFail: 3, // 发送失败
};

// socket收到的消息类型
export interface MsgItem {
  Ack: boolean,
  Content: string,  // Json 字符串
  ContentType: number,  // 消息类型
  MsgID: string,
  MsgIndexID: number,
  ReceiverID: string,
  SendDateTime: number,
  SenderID: string,
  Sender: { Nick: string, UserId: string }
}
// 项目内部使用的消息体
export interface RealMsg {
  content: Content,
  originContent?: string,
  contentType: number,

  msgId: string,
  msgIndexID: number  //历史消息索引
  receiverId: string,
  senderId: string,
  sendDateTime: number,
  senderName?: string,

  msgFrom?: number, // 0是对面 1是自己
  msgStatus?: number, // 发送状态

  originContentType?: number  // 撤销消息之前的类型
  replaceMsg?: string   // 是谁撤销了消息
  // [key: string]: any; // 任意未知属性
}
// content内容
export interface Content {
  Text: string, // 发送的文本， 可以是链接等
  type?: number,  // 客户端类型 0是app  1是pc
  account?: string,  // 官方号
  citationNick?: string,  // 引用的昵称
  citationContent?: string, // 引用内容
  citationContentType?: number, // 引用的消息类型
  videoPicUrl?: string, // 视频封面图
  videoDuration?: number, // 视频时长
  fileName?: string // 文件名
  fileSize?: string // 文件大小
  localCameraUri?: string // 文件本地地址 for app
}
// 晓文
export interface messageItem {
  ContentType: number //101文本消息 102图片消息 103视频消息 104时间提醒 105引用 903撤回
  Content: Content  // 消息内容

  customerId: string   // 发送者的IMID
  SenderUid: string   // 发送者的uid
  ReceiverID: string   // 接收者的IMID
  ReceiverUid: string   // 接收者的uid
  SendDateTime: number // 发送时间

  id: string //消息id
  headImg: string // 头像

  Nick: string  // 昵称
  Count?: number //当前发送者离线消息条数
  WCount?: number //当前撤回未读消息数

  MsgIndexID: number | null //消息索引
  OtherUid: string   // 对方的uid
  OtherImId: string   // 对方的IMID
  from: 0 | 1  // 0是对面 1是自己

  originContentType?: number  // 撤销消息之前的类型
  ReplaceMsg?: string   // 是谁撤销了消息
  messageStatus?: number  // 消息状态   1成功 2发送中 3发送失败
}

let msgId = new Date().getTime();
class MsgParse {
  curStore: AnyObject;
  constructor() {
    this.curStore = {}
  }
  getMsgID() {
    return 'self' + (msgId++);
  }
  dealMsg(Msg: MsgItem, store: any) {
    console.log('-originMsg>', Msg)
    let content
    try {
      content = JSON.parse(Msg.Content)
    } catch (error) {
      console.log('-消息格式不对，直接返回>', error)
      return
    }

    // 收到正常信息，不管是谁的，直接刷账号列表，有防抖不担心消耗
    store.update_accountList()

    if (Msg.ReceiverID === store.ImUserId) {
      // console.log('收到给自己的消息-账号信息>', content)
      const info = JSON.parse(content.Text)
      switch (Msg.ContentType) {
        case 1023:
          // 账号上线下线消息
          // const accountInfoPart = {
          //   PassportId: info.accountId,
          //   State: info.state,
          //   OccupiedUserId: info.occupiedUserId,
          //   OccupiedUserName: info.occupiedUserName,
          // }
          // store.update_accountInfo(accountInfoPart)
          break
        case 1024:
          // 批量发送的消息，通过审批时，账号登录的人收到
          if (info.accountImId === store.currentAccount.ImUserId) {
            const isSend = info.messageType === 1
            store.update_chatUserList(isSend)
          }
          break
      }

      return
    } else if (Msg.ReceiverID !== store.currentAccount.ImUserId) {
      console.log('-收到其它账号的消息>', Msg)
      return
    }


    // 当前账号的消息，格式化后分发
    // 大小写，全部转换为自定义的格式，
    let realMsg: RealMsg = {
      content: {
        ...content,
      },
      originContent: Msg.Content,
      contentType: Msg.ContentType,

      msgId: Msg.MsgID,
      msgIndexID: Msg.MsgIndexID,

      receiverId: Msg.ReceiverID,
      senderId: Msg.SenderID,

      sendDateTime: Msg.SendDateTime * 1000,
      msgFrom: 0,
      msgStatus: 0,

    }
    console.log("--realMsg->", realMsg);
    this.curStore = store
    switch (realMsg.contentType) {
      case msgTypes.m_text:
        this.decodeNormalMsg(realMsg)
        break
      case msgTypes.m_pic:
        this.decodePicMsg(realMsg)
        break
      case msgTypes.m_video:
        this.decodeVideoMsg(realMsg)
        break
      case msgTypes.m_quto:
        this.decodeNormalMsg(realMsg)
        break
    }
  }
  decodeNormalMsg(realMsg: RealMsg) {
    // 增加一些可能需要的属性， 返回格式化后的信息
    const formatMsg = {
      ...realMsg
    }
    this.curStore.update_dialogue(formatMsg)
  }
  decodePicMsg(realMsg: RealMsg) {
    // 增加一些可能需要的属性， 返回格式化后的信息
    // "{"Text":"https://imcpftest.eastmoney.com:26060/img/akgvtwcllx/f517b20ee28c41f0987cb3b52fc79e297328064887675612_1690968523207.png"}"
    const formatMsg = {
      ...realMsg
    }
    this.curStore.update_dialogue(formatMsg)
  }
  decodeVideoMsg(realMsg: RealMsg) {
    // 增加一些可能需要的属性， 返回格式化后的信息
    // Text: "https://imcpftest.eastmoney.com:26060/img/akgvtwcllx/ff0944ebf5f546e09049f5ff4abb94af1692239959310_uploadvideo.mp4"
    // fileName: "1692239959310_uploadvideo.mp4"
    // fileSize: "1108248"
    // videoDuration: "5558"
    // videoPicUrl: "https://imcpftest.eastmoney.com:26060/img/akgvtwcllx/92dce3dc115f44b1a85b9413665a7a227328064887675612_1
    const formatMsg = {
      ...realMsg
    }
    this.curStore.update_dialogue(formatMsg)
  }


  // 对接口里历史消息统一格式化
  dealHisMsg(Msg: AnyObject, store: any): RealMsg | null {
    // Ack: true
    // Content: "{\"Text\":\"https://imcpftest.eastmoney.com:26060/img/akgvtwcllx/4f65fb3d84224b9a920c1210343ec4717328064887675612_1692153037235.png\"}"
    // ContentType: 102
    // MsgID: "5693895941593787886"
    // MsgIndexID: 1691498930
    // OldMsgID: null
    // RecallMsgType: 0
    // ReceiverID: "1654134525802286"
    // ReferID: null
    // ReplaceMsg: null
    // SendDateTime: 1692153037
    // Sender: {UserID: "7328064887675612", Nick: "happygame", CertifiedCode: []}
    // SenderID: "5520188076798623437"
    this.curStore = store
    let content
    try {
      content = JSON.parse(Msg.Content)
    } catch (error) {
      // console.log('->', error)
      return null
    }
    // 大小写，全部转换为自定义的格式，
    let realMsg: RealMsg = {
      content: {
        ...content,
      },
      originContent: Msg.Content,
      contentType: Msg.ContentType,

      msgId: Msg.MsgID,
      msgIndexID: Msg.MsgIndexID || 0,
      receiverId: Msg.ReceiverID,
      senderId: Msg.SenderID,

      sendDateTime: Msg.SendDateTime * 1000,
      senderName: Msg.Sender && Msg.Sender.Nick,

      msgFrom: store.currentAccount.ImUserId === Msg.SenderID ? 1 : 0,
      msgStatus: 0,

      // originContentType?: 0  // 撤销消息之前的类型
      replaceMsg: Msg.ReplaceMsg
    }

    // console.log("--realMsg->", realMsg);
    switch (realMsg.contentType) {
      case msgTypes.m_text:
        return realMsg
        break
      case msgTypes.m_pic:
        return realMsg
        break
      case msgTypes.m_video:
        return realMsg
        break
      case msgTypes.m_quto:
        return realMsg
        break
      case msgTypes.m_withdraw:
        return realMsg
        break
      default:
        return null
    }
  }

  // 处理正常收发消息生成最新一条消息
  getNewestMsgStr(msg: RealMsg): string {
    const contentType: string = msg.contentType + ''
    const typeObj: AnyObject = {
      '101': msg.content.Text,
      '102': '[图片]',
      '103': '[视频]',
      '105': msg.content.Text,
    }
    return typeObj[contentType]
  }
  // 处理消息列表接口里最新的离线消息
  getOfflineMsgStr(msg: AnyObject): string {
    if (!msg || !msg.Content) return ''
    let content
    try {
      content = JSON.parse(msg.Content)
    } catch (error) {
      console.log('->', error)
      return ''
    }

    const contentType: string = msg.ContentType + ''
    const typeObj: AnyObject = {
      '101': content.Text,
      '102': '[图片]',
      '103': '[视频]',
      '105': content.Text,
      '903': msg.ReplaceMsg
    }
    return typeObj[contentType] || ''
  }

  // 发送消息前统一封装
  beforeSendMsg(msg: any, store: any) {
    this.curStore = store
    msg = reactive(msg)

    msg.msgId = this.getMsgID()
    msg.receiverId = store.currentUser.imuserId
    msg.senderId = store.ImUserId
    msg.sendDateTime = new Date().getTime()

    msg.msgFrom = 1
    msg.msgStatus = msgStatus.preSend

    switch (msg.contentType) {
      case msgTypes.m_text:
        this.sendText(msg)
        break
      case msgTypes.m_pic:
        this.sengImg(msg)
        break
      case msgTypes.m_video:
        this.sendVideo(msg)
        break
      case msgTypes.m_quto:
        this.sendText(msg)
        break
    }
  }
  sendText(msg: RealMsg) {
    this.curStore.add_Msg(msg)
    this.curStore.sengMsg(msg)
  }
  sengImg(msg: AnyObject) {
    const blobObj = msg.file
    delete msg.file

    const link = window.URL.createObjectURL(blobObj)
    msg.content.Text = link

    this.curStore.add_Msg(msg)

    // blob对象，转换，封装
    fileObjToStr(blobObj, (imgStr: string) => {
      // const params = {
      //   base64Str: imgStr,  //  base64
      //   name: blobObj.name,
      // }
      const params = {
        base64Content: imgStr.split(";base64,")[1],  //  base64
        imageName: blobObj.name,
      }

      // base64上传图片
      // this.curStore.sengMsg(msg)
      IMAPI.ImageUpLoad(params).then((res: any) => {
        msg.content.Text = res.data.Url
        msg.content.fileName = res.data.FileName
        // ，成功后，回调发送u
        this.curStore.sengMsg(msg)
      })
        .catch((err) => {
          msg.msgStatus = msgStatus.sendFail
        })
    })

  }
  sendVideo(msg: AnyObject) {
    console.log('-sengVideo>', msg)

    const blobObj = msg.file
    // delete msg.file
    const link = window.URL.createObjectURL(blobObj)
    msg.content.Text = link
    this.curStore.add_Msg(msg)

    // WebForm上传视频
    const formData = new FormData()
    formData.append('file', blobObj)
    // 移动端还需要视频封面 todo
    // videoPicUrl?: string, // 视频封面图
    // videoDuration?: number, // 视频时长
    // fileName?: string // 文件名
    // fileSize?: string // 文件大小

    IMAPI.WebFormMediaUpload(formData).then((res: any) => {
      msg.content.Text = res.data.Url
      msg.content.fileName = res.data.FileName
      // ，成功后，回调发送u
      this.curStore.sengMsg(msg)
    })
      .catch((err) => {
        msg.msgStatus = msgStatus.sendFail
      })
  }

}


export const msgParse = new MsgParse()