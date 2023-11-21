/*
 * @Date: 2023-07-18 13:57:24
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-14 11:17:19
 * @descript: 文件描述
 */
import { defineStore } from 'pinia';
import { getAvator, getLocal, setLocal, formatTime, debounce, accountTimer, msgTimer } from '@/utils/tools';
import { AnyObject, AccountInfo, ChatInfo, UserInfo } from '@/types/global';
import { getAccountAndAutoOnline, getAccounts, IsUserCanceled } from '@/api/user';
import { ChatListApi, MessageApi } from '@/api/chat-list';
import { IMSDK_methods } from '@/store/plugins/sdkClientEvents';
import { msgParse, MsgItem, RealMsg, msgTypes } from '@/store/msgParse';
import { useUserStore } from '@/store';
import EventBus from '@/utils/eventBus';
import { Message, Modal } from '@arco-design/web-vue';
import { use } from 'echarts';
import user from '@/router/modules/user';


const useComStore = defineStore('comData', {
  state: (): AnyObject => ({
    ImUserId: '',
    Token: '',
    RefreshToken: '',
    accountList: [],
    currentAccount: {
      PassportId: '',
      ImUserId: '',
      AccountName: '',
      Description: 'string',
      PermittedGroup: 'string',
      BanedGroup: 'string',
      IsCanceled: true,
      IsDel: true,
      State: 0,
      OccupiedUser: 'string',
      accAvatar: '',
    },
    chatUserlist: [],
    currentUser: {
      imuserId: '',
      isNotDisturbed: false,
      isSetTop: false,
      islater: false,

      unread: 0,
      passportId: '',

      newestMsgTxt: '',
      sendDateTime: null,
      sendDateTimeStr: '',

      userName: '',
      userAvatar: '',

      recordList: [],
      quto: null
    },
  }),

  getters: {
    getAPIHeader(state: AnyObject) {
      return {
        accessToken: state.Token,
        imUserID: state.ImUserId,
      }

    },
    getChatListByKey(state: AnyObject) {
      return (key: string) => {
        let list = this.chatUserlist;
        list.forEach((item: UserInfo) => {
          item.sendDateTimeStr = formatTime(item.sendDateTime);
        });
        const result = list.filter((item: UserInfo) => {
          return item.userName.includes(key) || item.passportId.includes(key)
        });
        // console.table(result, ['userName'])
        return result
      }
    },
  },

  actions: {
    start_loginIM(data: AnyObject) {
      this.ImUserId = data.ImUserId;
      IMSDK_methods.loginIM(this)
    },
    s_auth_user(data: AnyObject) {
      this.Token = data.Token;
      this.RefreshToken = data.RefreshToken;
      IMSDK_methods.createClient(this)
    },
    refreshToken(accessToken) {
      this.Token = accessToken
    },
    closeIM() {
      IMSDK_methods.closeIM()
    },
    async get_accountList(flag: boolean = false) {
      const userStore = useUserStore();
      try {
        const params = {
          "autoOnline": flag
        }
        //  超管获取全部，其余只获取配置的官方号
        let api = userStore.role === "Admin" ? getAccounts : getAccountAndAutoOnline
        const res = await api(params);
        const list = res.data;
        list.forEach((item: AccountInfo) => {
          item.accAvatar = getAvator(item.PassportId);
          if (item.OccupiedUserId !== this.ImUserId && item.State === 1) {
            item.State = 3;
          }
          if (item.PassportId === this.currentAccount.PassportId && item.State !== 1) {
            this.currentAccount = {}
          }
        });
        this.accountList = list;
        if (this.accountList[0] && this.accountList[0].State === 1 && flag) {
          this.set_curAccount(this.accountList[0]);
        }
      } catch (error) {
        console.log('-error>', error)
      }
    },
    update_accountList() {
      const store = this
      accountTimer(() => {
        console.log('update_accountList>',)
        store.get_accountList()
      }, 1000)
    },

    update_accountInfo(partInfo: AnyObject) {
      const temp = this.accountList
      temp.forEach((item: AccountInfo) => {
        if (item.PassportId === partInfo.PassportId) {
          item.OccupiedUserId = partInfo.OccupiedUserId
          item.OccupiedUserName = partInfo.OccupiedUserName
          item.State = partInfo.State
          if (item.OccupiedUserId !== this.ImUserId && item.State === 1) {
            item.State = 3;
          }
        }
      });
      temp.sort(function (a: AccountInfo, b: AccountInfo) {
        return a.State > b.State ? 1 : -1
      })
    },
    // 选择当前账号
    set_curAccount(data: AccountInfo) {
      console.log(`%c Set-${data.PassportId}`, "color:red;font-size:14px;");
      this.currentAccount = data;
      this.get_chatUserList();
    },

    update_chatUserList(isSend = true) {
      let msg = isSend ? '发送' : '撤回'
      this.get_chatUserList()
      Message.info({
        content: `当前官方号批量${msg}了消息,页面已刷新数据`,
        duration: 5 * 1000
      })
    },

    //首次 获取当前账户的聊天列表,未读消息数量？
    async get_chatUserList(searchUserId: string = '') {
      if (!this.currentAccount.PassportId) return
      try {
        const params = {
          accoutPassportId: this.currentAccount.PassportId,
          searchUserId: searchUserId
        };
        const res = await ChatListApi.getList(params);
        const list = res.data || []
        let temp = list.map((item: ChatInfo) => {
          const user: UserInfo = {
            imuserId: item.ImId,
            isNotDisturbed: item.IsNotDisturbed,
            isSetTop: item.IsSetTop,
            passportId: item.PassportId,

            unread: item.OfflineMessageCount || 0,
            msgIndexID: item.LatestMsg ? item.LatestMsg.MsgIndexID : 0,

            newestMsgTxt: msgParse.getOfflineMsgStr(item.LatestMsg),
            sendDateTime: item.LatestMsg ? item.LatestMsg.SendDateTime * 1000 : 0,
            sendDateTimeStr: '',

            userName: item.SenderName || '',
            userAvatar: getAvator(item.PassportId),

            recordList: [],
            quto: null,
            key: this.currentAccount.PassportId + '_' + item.ImId,
          }
          return user
        })
        this.chatUserlist = temp;
        // 方案1 获取聊天列表的同时，获取聊天记录
        // this.getAllMsg()
      } catch (error) {
        console.log('->', error)
      } finally {
        this.currentUser = {}
      }
    },
    // 异步,一次性拉取全部，废弃
    async getAllMsg() {
      this.chatUserlist.forEach(async (item: UserInfo) => {
        await this.get_his_msgList(item, item.msgIndexID)
      });

    },
    // 删除对话
    async del_dialogue(user: UserInfo) {
      let index = this.chatUserlist.findIndex((item: UserInfo) => {
        return item.passportId === user.passportId //
      })
      this.chatUserlist.splice(index, 1)

      const params = {
        accountPasportId: this.currentAccount.PassportId,
        senderId: user.passportId,
      };
      await ChatListApi.remove(params);
    },
    async setTop(user: UserInfo) {
      const params = {
        accountPasportId: this.currentAccount.PassportId,
        senderId: user.passportId,
        isTop: !user.isSetTop,
      };
      user.isSetTop = !user.isSetTop
      this.diag_sort()
      await ChatListApi.setTop(params);

    },
    async setLaterRead(user: UserInfo) {
      user.islater = !user.islater
    },

    async setNotDisturbed(user: UserInfo) {
      const params = {
        accountPasportId: this.currentAccount.PassportId,
        senderId: user.passportId,
        isNotDisturb: !user.isNotDisturbed,
      };
      await ChatListApi.setNotDisturb(params);
      user.isNotDisturbed = !user.isNotDisturbed
    },
    // 前端排序
    diag_sort() {
      let temp: UserInfo[] = [], topList: UserInfo[] = [], otherList: UserInfo[] = []
      temp = [...this.chatUserlist]
      temp.sort(function (a: UserInfo, b: UserInfo) {
        return a.sendDateTime > b.sendDateTime ? -1 : 1
      })
      temp.forEach((item: UserInfo) => {
        if (item.isSetTop) {
          topList.push(item)
        } else {
          otherList.push(item)
        }
      })

      this.chatUserlist = topList.concat(otherList)

    },

    // 选择要聊天的用户
    set_currentUser(user: UserInfo) {
      // 清掉输入框的内容

      this.currentUser = user;
      // 方案2 当前用户改变，需要重新获取聊天记录,
      this.get_his_msgList(this.currentUser, this.currentUser.msgIndexID);
      //  调用设置已读接口，
      this.set_msgRead(this.currentUser)

      this.set_userStatus(this.currentUser)

      // 点击则去掉稍后再读
      user.islater = false

      // 滚动至底部
      EventBus.emit('scrollMsgList', {
        scroll: true,
        milliseconds: 50
      })
    },
    // 点击当前用户全部设为已读 
    async set_msgRead(user: UserInfo) {
      // console.log('1-set_msgRead>',)
      user.unread = 0;
      const params = {
        "accountImId": this.currentAccount.ImUserId,
        "senderImId": user.imuserId
      }
      msgTimer(() => {
        // console.log('4-SetOfflineMsgRead>', 4)
        MessageApi.SetOfflineMsgRead(params)
        // 设置已读后，重新拉列表状态
        this.update_accountList()
      }, 500)
    },

    // 获取用户历史聊天记录，包含离线消息 
    async get_his_msgList(user: UserInfo, msgIndexID: number, from: string = '') {
      console.log('0-before-gethis_msgList>', from)
      // 如果需要本地存消息，就打开这个，现在改为滚动加载，不需要本地消息了
      // let recordList = this.getMsgListFromLocal(user.key)
      // let recordList: RealMsg[] =  user.recordList

      let recordList: RealMsg[] = []

      if (user.unread) {// 有未读消息，意味着有新的msgIndexID，清空重新拉取，没有就不清空，需要优化
        recordList = []
      } else if (user.recordList.length > 0) {
        // 没有未读消息，且已经拉取过一次数据了，则不再重复获取
        return
      }
      // 没有未读消息，也没拉过数据的，调接口拉取


      if (msgIndexID) {
        const params = {
          "accountImId": this.currentAccount.ImUserId,
          "senderImId": user.imuserId,
          "msgIndexID": msgIndexID,
          "pageSize": user.unread
        }
        try {
          const res = await MessageApi.GetHistoryMessage(params);
          const list = res.data.Content || []
          list.reverse()

          const temp: RealMsg[] = [];
          list.forEach((item: AnyObject) => {
            const realMsg: RealMsg | null = msgParse.dealHisMsg(item, this)
            if (realMsg) {
              temp.push(realMsg)
            }
          })
          // 拼接消息列表数组，
          user.recordList = temp.concat(recordList)
          console.log('3-after-gethis_msgList>', 'done')

          EventBus.emit('scrollMsgList', {
            scroll: true,
            milliseconds: 50
          })
        } catch (error) {
          console.log('-error>', error)
        }
      }
    },
    // 滚动到顶部触发
    async scroll_get_his_msgLisg(user: UserInfo, msgIndexID: number) {
      console.log('before_scroll_to_get_his_msgLisg>', 'scroll')

      let recordList: RealMsg[] = user.recordList
      if (msgIndexID) {
        const params = {
          "accountImId": this.currentAccount.ImUserId,
          "senderImId": user.imuserId,
          "msgIndexID": msgIndexID,
          "pageSize": user.unread
        }
        try {
          const res = await MessageApi.GetHistoryMessage(params);
          const list = res.data.Content || []
          list.reverse()
          // 滚动加载时，会把当前msgIndexID返回，会有一条重复的，要去掉
          list.pop()

          if (list.length === 0) return

          const temp: RealMsg[] = [];
          list.forEach((item: AnyObject) => {
            const realMsg: RealMsg | null = msgParse.dealHisMsg(item, this)
            if (realMsg) {
              temp.push(realMsg)
            }
          })
          // 拼接消息列表数组
          user.recordList = temp.concat(recordList)
          console.log('3-after-scroll_gethis_msgList>', 'done')

        } catch (error) {
          console.log('-error>', error)
        }
      }

    },
    // 当前用户是否注销
    async set_userStatus(user: UserInfo) {
      IsUserCanceled
      const params = {
        "userPassportId": user.passportId
      }
      const { data } = await IsUserCanceled(params)
      user.isCanceled = data || false
    },

    // 主动开启会话，未发送消息 判断是否在列表里，无则新增
    add_dialogue(userData: AnyObject) {
      const key = this.currentAccount.PassportId + '_' + userData.imuserId
      let tempUser = this.chatUserlist.find((user: UserInfo) => {
        return user.imuserId === userData.ImId
      })
      // 列表已存在
      if (tempUser) {
        this.set_currentUser(tempUser)
      } else {
        const newUser: UserInfo = {
          imuserId: userData.ImId,
          passportId: userData.PassportId,
          userName: userData.Alias,

          userAvatar: userData.userAvatar,
          isNotDisturbed: false,
          isSetTop: false,
          unread: 0,
          msgIndexID: 2147483647, //  新开窗口,传int最大值，加载历史消息
          newestMsgTxt: '',
          sendDateTime: new Date().getTime(),
          sendDateTimeStr: '',
          recordList: [],
          quto: null,
          key
        }
        this.chatUserlist.unshift(newUser)
        this.diag_sort()
        this.set_currentUser(newUser)
      }
    },

    // 统一处理监听到的所有消息
    handleMsg(msg: MsgItem) {
      msgParse.dealMsg(msg, this);
    },
    // 处理完成后，更新会话
    update_dialogue(msg: RealMsg) {
      // 遍历账号，遍历用户，找到对应的recordList 再push,没找到的话，新增对话
      let tempUser = this.chatUserlist.find((user: UserInfo) => {
        return user.imuserId === msg.senderId
      })
      // 列表已存在
      if (tempUser) {
        this.msgListPushHook(tempUser.recordList, tempUser.sendDateTime)
        tempUser.recordList.push(msg)
        tempUser.newestMsgTxt = msgParse.getNewestMsgStr(msg)
        tempUser.sendDateTime = msg.sendDateTime
        tempUser.msgIndexID = msg.msgIndexID

        // 收到的消息为其它窗口
        if (tempUser.imuserId !== this.currentUser.imuserId) {
          tempUser.unread++
        } else {
          // 收到的消息，恰好当前窗口，立刻设置已读
          this.set_msgRead(this.currentUser)
        }
        const key = this.currentAccount.PassportId + '_' + tempUser.imuserId
        // this.saveMsgListToLocal(key, tempUser.recordList)

        this.diag_sort()
        // 滚动,图片视频下载需要时间
        EventBus.emit('scrollMsgList', {
          scroll: true,
          milliseconds: 500
        })
      } else {
        // 列表里没有，则重新调接口拉列表
        this.get_chatUserList();
      }


    },
    // 处理监听到的撤回消息
    handleCancleMessage(cancelMsg: AnyObject) {
      console.log('-cancelMsg>', cancelMsg)
      this.chatUserlist.forEach((item: UserInfo) => {
        if (item.imuserId === cancelMsg.ImUserID) {
          item.recordList.forEach((msg: RealMsg) => {
            if (msg.msgId === cancelMsg.OldMsgID) {

              msg.replaceMsg = cancelMsg.ReplaceMsg
              msg.originContentType = msg.contentType
              msg.contentType = msgTypes.m_withdraw
            }
          });
          item.newestMsgTxt = cancelMsg.ReplaceMsg
          // 撤回消息，不要更新索引 msgIndexID

          // const key = this.currentAccount.PassportId + '_' + item.imuserId
          // this.saveMsgListToLocal(key, item.recordList)
        }
      });
    },
    // 发送消息前，先统一格式化
    beforeSendMsg(msg: AnyObject) {
      msgParse.beforeSendMsg(msg, this);
    },
    // 格式化消息后，追加到列表里，此时消息尚未发送成功
    add_Msg(msg: RealMsg) {
      this.msgListPushHook(this.currentUser.recordList, this.currentUser.sendDateTime)
      this.currentUser.recordList.push(msg);
      this.currentUser.newestMsgTxt = msgParse.getNewestMsgStr(msg)
      this.currentUser.sendDateTime = msg.sendDateTime
      // 新增消息，新索引 msgIndexID
      this.currentUser.msgIndexID = 0


      this.diag_sort()
      // 滚动
      EventBus.emit('scrollMsgList', {
        scroll: true,
        milliseconds: 100
      })
    },
    // 发送消息，或者新增消息前，判断是否新增一条时间提醒
    msgListPushHook(list: Array<RealMsg>, lastTime: number) {
      const curTime = new Date().getTime()
      if (curTime > lastTime + 120 * 1000) {
        const timeMsg: RealMsg = {
          content: { Text: '' },
          contentType: 104,
          msgId: 'time_' + curTime,
          msgIndexID: 0,
          receiverId: '',
          senderId: '',
          sendDateTime: curTime,
        }
        list.push(timeMsg)
      }
    },
    // 将格式化后的消息，发送
    sengMsg(msg: RealMsg) {
      IMSDK_methods.sendMsg(this, msg)
    },
    // 更新发送消息的状态，成功或者失败
    update_msg_status(msg: RealMsg) {
      this.currentUser.recordList.forEach((item: RealMsg) => {
        if (item.msgId === msg.msgId) {
          item.msgStatus = msg.msgStatus
        }
      });
      this.saveCurUserRecordList()
    },

    // 撤回消息，直接调接口处理
    beforeWithdraw(data: AnyObject) {
      IMSDK_methods.withdrawMsg(this, data);
    },
    // 接口成功后，直接替换展示
    replaceWithdraw(data: AnyObject) {
      this.currentUser.recordList.forEach((item: RealMsg) => {
        if (item.msgId === data.msgID) {

          item.replaceMsg = '你撤回了一条消息'
          item.originContentType = item.contentType
          item.contentType = msgTypes.m_withdraw
        }
      });
      this.currentUser.newestMsgTxt = '你撤回了一条消息'
      // 撤回消息，不要更新索引 msgIndexID

      this.saveCurUserRecordList()
    },
    saveCurUserRecordList() {
      const key = this.currentAccount.PassportId + '_' + this.currentUser.imuserId
      this.saveMsgListToLocal(key, this.currentUser.recordList)
    },
    saveMsgListToLocal(key: string, list: Array<any>) {
      // setLocal(key, list)
    },
    getMsgListFromLocal(key: string) {
      return getLocal(key) || []
    },
  },
});

export default useComStore;
