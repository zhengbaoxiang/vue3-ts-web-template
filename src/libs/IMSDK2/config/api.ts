import { config } from './config'

const getApiUrl = (tag: string) => config.apiUrl + tag

/**
 * api
 */
const api = {
    /**
     * 发送频道普通消息
     * 调用场景：发送频道消息成功后返回消息ID
     */
    sendChannelCommonMessage: () => getApiUrl('/IMAPI/SendChannelCommonMessage'),
    /**
     * 根据索引批量获取IM聊天频道消息
     * 调用场景：获取直播房间IM消息
     */
    getMessageListByIndex: () => getApiUrl('/IMAPI/GetMessageListByIndex'),
    /**
     * 用户离开频道
     * 调用场景：用户离开直播房间移除当前用户信息
     */
    userLeave: () => getApiUrl('/IMAPI/UserLeave'),
    /**
     * 用户进入频道
     * 调用场景：用户进入直播房间记录当前用户进房间是否成功
     */
    userEnter: () => getApiUrl('/IMAPI/UserEnter'),
    /**
     * 发送私信消息
     * 调用场景：接口发送私信消息，执行成功后返回消息ID
     */
    sendMessage: () => getApiUrl('/IMAPI/IMSendMessage'),
    /**
     * 获取当前频道聊天消息最新索引
     * 调用场景：Web版获取直播房间IM消息最新索引
     */
    getMsgMaxIndex: () => getApiUrl('/IMAPI/getMsgMaxIndex'),
    /**
     * Base64上传图片
     */
    httpFileUpLoad: () => getApiUrl('/ImageService/ImageUpLoad'),
    /**
     * 离线消息回执
     */
    OfflineMessageReceipt: () => getApiUrl('/IMAPI/OfflineMessageReceipt'),
    /**
     * 分页获取用户离线消息
     */
    GetUserOfflineMsg: () => getApiUrl('/IMAPI/GetUserOfflineMsg'),
    /**
     * 获取当前用户分类汇总消息
     */
    GetAllOfflineMsg: () => getApiUrl('/IMAPI/GetAllOfflineMsg'),
    /**
     * 其他登录
     */
    OtherLoginAuth: () => getApiUrl('/IMUser/OtherLoginAuth'),
    /**
     * 匿名登录
     */
    AnonymousUser: () => getApiUrl('/IMUser/anonymousUser'),
    /**
     * 获取最新认证Token
     */
    RefreshToken: () => getApiUrl('/IMToken/RefreshToken'),
    /**
     * 发送私信消息（基金专用）
     * 调用场景：接口发送私信消息，执行成功后返回消息ID
     */
    sendMessageForApp: () => getApiUrl('/IMAPI/IMSendMessageForApp')
}

export { api }
