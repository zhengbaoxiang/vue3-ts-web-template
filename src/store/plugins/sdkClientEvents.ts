/*
 * @Date: 2023-08-04 10:19:01
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-21 14:12:51
 * @descript: 文件描述
 */
import { IMSocketClient } from '@/libs'
import { default as config, WebSocketConfig } from '@/config';
import { AnyObject } from '@/types/global';
import { IMAPI } from '@/api/IMAPI';
import { msgParse, msgStatus, msgTypes, MsgItem, RealMsg } from '@/store/msgParse';
import { Message, Modal } from '@arco-design/web-vue';

export function initPlugin() {
  // dosomething
  return (context: any) => {
    // console.log('-context>', context)
    const { store } = context
    // store.$subscribe((mutation: any, state: any) => {
    // 响应 store state 变化  
    // mutation.type // 'direct' | 'patch object' | 'patch function'
    // console.log('mutation->', mutation)
    // })
    store.$onAction((context: any) => {
      // 响应 store actions
      const {
        name, // action 名称
        store, // store 实例，类似 `someStore`
        args, // 传递给 action 的参数数组
        after, // 在 action 返回或解决后的钩子
        onError, // action 抛出或拒绝的钩子
      } = context
      // console.log('调试监听-action-args>', name, args)
    })
  }
}

export const loginIM = (store: any) => {
  let params = {
    AppKey: WebSocketConfig.appKey,
    AppSecret: WebSocketConfig.AppSecret,
    IMUserID: store.ImUserId,
    NickName: '',
    Version: '1',
    Device: 'pc',
    SourceType: "4",
  }
  IMAPI.AnonymousUser(params)
    .then((res) => {
      store.s_auth_user(res.data)
    })
    .catch((err) => {
      console.log('loginFailure', err)
    })
}
let WebSocketClient: AnyObject = {}
export const createClient = (store: any) => {
  let config = {
    imUserID: store.ImUserId,
    accessToken: store.Token,
    refreshToken: store.RefreshToken,
    device: 'pc',
    channelId: '',
  }
  WebSocketClient = new IMSocketClient(
    {
      config: config,
      WebSocketConfig: WebSocketConfig,
      onMessage: function (data: any) {
        store.handleMsg(data)
      },
      onCancelMessage: function (data: any) {
        store.handleCancleMessage(data)
      },
      onSuccess: function (data: any) {
        console.log('-onSuccess>', data)
        Message.success({
          content: `通信链接成功`,
          duration: 2 * 1000
        })
        store.get_accountList(true);
      },
      onDisconnected: function (data: any) {
        if (data > 0) {
          Message.info({
            content: `通信链接已断开,正在尝试重连`,
            duration: 3 * 1000
          })
        } else {
          Modal.confirm({
            title: '提示',
            titleAlign: 'start',
            content: '通信链接已断开,请重新加载页面',
            onOk: () => {
              window.location.reload()
            },
          });
        }
      },
      onError: function (data: any) {
        console.log('-onError>', data)
      },
      onRefreshToken: function (accessToken: any) {
        store.refreshToken(accessToken)
      },
    }
  )
}

export const closeIM = () => {
  WebSocketClient.close()
}

// 发送私信
export const sendMsg = (store: any, msg: RealMsg) => {
  console.log('-msg>', msg)
  msg.msgStatus = msgStatus.sending

  // 走接口
  const params = {
    receiverID: store.currentUser.imuserId,
    msgContent: JSON.stringify(msg.content),
    contentType: msg.contentType,
    persist: true
  }
  IMAPI.IMSendMessage(params).then((res: any) => {
    msg.msgStatus = msgStatus.sendSuccess
    msg.msgId = res.data
    store.update_msg_status(msg)
  })
    .catch((err) => {
      msg.msgStatus = msgStatus.sendFail
      store.update_msg_status(msg)
    })

  // 走通道，拿不到msgId
  // const data = {
  //   Content: msg.content,
  //   ContentType: msg.contentType,
  // }
  // WebSocketClient.sendMessage(store.currentUser.imuserId, JSON.stringify(data),
  //   (res: any) => {
  //     console.log('->', res)
  //     msg.msgStatus = msgStatus.sendSuccess
  //     msg.msgId = res.MsgID
  //     store.update_msg_status(msg)
  //   },
  //   (err: any) => {
  //     msg.msgStatus = msgStatus.sendFail
  //     store.update_msg_status(msg)
  //   }
  // )

}
//  撤回私信
export const withdrawMsg = (store: any, data: AnyObject) => {
  const params = data

  IMAPI.WithdrawMsg(params).then((res: any) => {
    if (res.data) {
      store.replaceWithdraw(params)
    }
  })
    .catch((err) => {
      console.log('->', err)
    })

}
//  获取离线消息
export const getOfflineMsg = (store: any) => {
  console.log('-获取离线消息>')
  const params = {
    pageIndex: 1,
    imUserID: store.ImUserId
  }

  IMAPI.GetAllOfflineMsg(params).then((res: any) => {
    if (res.data) {
      console.log('->', res)
    }
  })
    .catch((err) => {
      console.log('->', err)
    })

}

export const IMSDK_methods = {
  loginIM,
  createClient,
  sendMsg,
  withdrawMsg,
  getOfflineMsg,
  closeIM,
}

