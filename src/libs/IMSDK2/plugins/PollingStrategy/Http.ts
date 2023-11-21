import { utils } from '../../utils'
import { api } from '../../config'

interface RequestMessage {
  [key: string]: any
}

interface HttpResponse {
  count: number
  data: any[]
}

const fixMsgId = (str: string): HttpResponse | null => {
  if (!str) return null
  let res: HttpResponse = JSON.parse(str)
  if (res.count && res.data) {
    let reg = /"MsgID":(.*?),/g
    let arr: any[] = []
    str.replace(reg, (id: string) => {
      let raw = id.split(':')[1].split(',')[0]
      arr.push(raw)
      return ''
    })
    let items = res.data
    for (let i = 0; i < items.length; i++) {
      items[i].MsgID = arr[i]
    }
  }
  return res
}

export default {
  // 用户进入频道
  userEnter(
    channel: string,
    device: string,
    accessToken: string,
    imUserID: string,
    callback: Function
  ) {
    this.httpRequest(
      api.userEnter(),
      {
        channelID: channel,
        device: device,
        accessToken,
        imUserID
      },
      callback
    )
  },

  httpFileUpLoad(
    fileName: string,
    base64Content: string,
    success: Function,
    fail: Function
  ) {
    if (!fileName || !base64Content) {
      utils.triggerCallback(fail, '{"err":"传入参数为空"}')
      return
    }
    let msg: RequestMessage = {
      imageName: fileName,
      base64Content: base64Content
    }
    msg = JSON.stringify(msg)
    this.httpRequest(
      api.httpFileUpLoad(),
      msg,
      (data: any) => {
        utils.triggerCallback(success, data)
      },
      (err: any) => {
        utils.triggerCallback(fail, err)
      }
    )
  },

  httpRequest(
    url: string,
    msg: RequestMessage,
    success?: Function,
    fail?: Function
  ) {
    this.httpRequestBase('post', true, url, msg, success, fail)
  },

  httpRequestGet(
    url: string,
    msg: RequestMessage,
    success: Function,
    fail: Function
  ) {
    this.httpRequestBase('get', true, url, msg, success, fail)
  },

  httpRequestNoHeader(
    url: string,
    msg: RequestMessage,
    success: Function,
    fail: Function
  ): void {
    this.httpRequestBase('post', false, url, msg, success, fail)
  },

  httpRequestBase(
    type: string,
    hasHeader: boolean,
    url: string,
    msg: RequestMessage,
    success?: Function,
    fail?: Function
  ) {
    const { accessToken, imUserID } = msg
    // 空的token不能发送
    if (hasHeader && !accessToken) return
    type = type || 'post'
    let xhr = new XMLHttpRequest()
    xhr.open(type, url, true)

    if (hasHeader) {
      xhr.setRequestHeader('imUserID', imUserID)
      xhr.setRequestHeader('accessToken', accessToken)
    }
    xhr.setRequestHeader('Content-Type', 'application/json')
    // xhr.setRequestHeader('Access-Control-Allow-Origin', 'https://imcpftest.eastmoney.com:26060')
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          try {
            let res = fixMsgId(xhr.responseText)
            utils.triggerCallback(success, res, url)
          } catch (e) {
            utils.triggerCallback(fail, e, url)
          }
        } else {
          // 发送失败
          utils.triggerCallback(fail, xhr, url)
        }
      }
    }
    xhr.send(JSON.stringify(msg))
  }
}
