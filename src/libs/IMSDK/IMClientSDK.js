(function () {
  /**定义两种模式
   * 优先使用 ebsocket
   * 其次才是 polling
   */
  const parttern = {
    websocket: 'websocket',
    polling: 'polling',
  };

  //走api用到的所有接口
  let baseUrl = 'https://imcpftest.eastmoney.com:16060';
  let anonyUrl = '/IMUser/AnonymousUser';
  let tokenUrl = '/IMToken/RefreshToken';
  let imageServiceUrl = '/ImageService/ImageUpLoad';
  let configs = {
    isPoll: false,
    ip: '',
    appKey: '',
    debug: true,
    //如果需要获取发送消息的时间 需要走轮询发送消息
    //一般默认走的还是WebSocket发
    sendBypoll: false,
    //轮询从0 开始 还是从最大索引开始
    pollbyZero: false,
    //重连只重连WebSocket
    websocketOnly: false,
  };
  let urlConfig = {
    websocketUrl: 'ws://imsktest.eastmoney.com:18080',
    // 匿名登录
    anonymousUser: function () {
      return getanonyUrl('/AnonymousUser');
    },
    sendChannelCommonMessage: function () {
      return getUrl('/SendChannelCommonMessage');
    },
    //记录日志
    messageReceipt: function () {
      return getUrl('/MessageReceipt');
    },
    getMessageListByIndex: function () {
      return getUrl('/GetMessageListByIndex');
    },
    // 获取当前频道消息
    getMessageList: function () {
      return getUrl('/GetMessageList');
    },
    userLeave: function () {
      return getUrl('/UserLeave');
    },
    //userEnter: function () { return getUrl("/UserEnter"); },
    sendMessage: function () {
      return getUrl('/IMSendMessage');
    },
    getMsgMaxIndex: function () {
      return getUrl('/getMsgMaxIndex');
    },
    OfflineMessageReceipt: function () {
      return getUrl('/OfflineMessageReceipt');
    },
    GetUserOfflineMsg: function () {
      return getUrl('/GetUserOfflineMsg');
    },
    GetAllOfflineMsg: function () {
      return getUrl('/GetAllOfflineMsg');
    },
    RefreshToken: function () {
      return getImtokenUrl();
    },
    httpFileUpLoad: function () {
      return getHttpFileUpLoad('/ImageUpLoad');
    },
  };

  function getUrl(tag) {
    return baseUrl + tag;
  }

  function getanonyUrl(tag) {
    return anonyUrl + tag;
  }

  function getImtokenUrl() {
    return baseUrl + tokenUrl;
  }

  function getHttpFileUpLoad(tag) {
    return imageServiceUrl + tag;
  }

  let root = {},
    refreshToken = '';

  //当前的模式（websocket还是polling）
  let currentParttern = parttern.websocket;
  //轮询方式的channerId
  let currentPollChannel;
  let _core = [],
    imUserID,
    channelId,
    accessToken;
  //轮询时间
  let loopInterval = 2 * 1e3;
  let currentStrategy = null;
  //轮询对象
  let pollmessage;
  let maxId = 0;
  let protoCodes = {
    hearts: 0,
    login: 2,
    logout: 10,
    joinChannel: 31,
    exitChannel: 32,
    sendPrivateMessage: 160,
    sendPrivateReceipt: 162,
    sendToGroupMessage: 164,
    sendToGroupMessageFeedback: 165,
    sendToChannel: 166,
    sendToChannelFeedback: 167,
    sendGroupReceipt: 168,
    receiveGroupMessage: 172,
    receiveGroupReceipt: 173,
    receiveChannelMessage: 174,
    serverNotice: 252,
    receiveSessioninfo: 254,
  };
  const protoHooks = {
    0: '心跳',
    255: '心跳反馈',
    1: '通道重置',
    2: '登录',
    253: '登录反馈',
    10: '退出登录',
    31: '订阅频道',
    224: '订阅频道反馈',
    32: '取消订阅频道',
    223: '取消订阅频道反馈',
    33: '频道被关闭',
    160: '发送私信',
    161: '发送私信反馈',
    162: '发送私信回执',
    163: '发送私信回执反馈',
    164: '发送到组群',
    165: '发送到组群反馈',
    168: '发送组群消息回执',
    169: '发送群组消息反馈',
    166: '发送到频道',
    167: '发送到频道反馈',
    170: '收到私信',
    171: '收到私信回执',
    172: '收到组群消息',
    175: '频道最新20条缓存',
    173: '收到组群消息回执',
    174: '收到频道消息',
    252: '收到服务器通知',
    254: '收到session info',
  };

  /* protobuf相关 */
  //自动生成proto Js语句  http://www.javashuo.com/article/p-fhjmdegs-ky.html
  function createProto(name) {
    let args = [].slice.call(arguments, 1);
    let obj = new protobuf.Type(name);
    for (let i = 0; i < args.length; i++) {
      let p = args[i];
      let key = i + 1;
      obj.add(new protobuf.Field(p[0], key, p[1] || 'string'));
    }
    return obj;
  }

  /* protobuf相关 */
  function createEnum(name, list) {
    let obj = new protobuf.Enum(name);
    for (let i = 0; i < list.length; i++) {
      obj.add(list[i], i);
    }
    return obj;
  }

  /** protobuf相关
   *  创建 接口入参？还是出参？的解析体
   */
  function loadProto(callback, fail) {
    if (typeof protobuf == 'undefined') return; //说明浏览器加载失败
    util.Timer.start('proto');
    try {
      root = new protobuf.Root().define('IMProtoEntity');
      root.add(
        createProto(
          'IM_LoginToken',
          ['UserID'],
          ['Token'],
          ['Device'],
          ['Version', 'int32'],
          ['Appkey']
        )
      );
      root.add(
        createProto(
          'IM_Feedback',
          ['ResultCode', 'int32'],
          ['ResultData'],
          ['Seq', 'int32'],
          ['MsgID']
        )
      );
      root.add(
        createProto(
          'IM_ServerNotice',
          ['Category', 'IM_NoticeCategory'],
          ['Content']
        )
      );

      root.add(createProto('IM_Channel', ['ChannelID'], ['Type', 'int32']));
      root.add(
        createProto(
          'IM_SendChannelMessage',
          ['Seq', 'int32'],
          ['ChannelID'],
          ['ContentType', 'int32'],
          ['Content'],
          ['Persist', 'bool']
        )
      );
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
      );

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
      );
      root.add(
        createProto(
          'IM_SendPrivateReceipt',
          ['Seq', 'int32'],
          ['ReceiptType', 'IM_ReceiptType'],
          ['MsgID'],
          ['ReceiverID']
        )
      );
      root.add(
        createProto(
          'IM_ReceivePrivateMessage',
          ['MsgID'],
          ['SenderID'],
          ['ReceiverID'],
          ['Content'],
          ['Ack', 'bool'],
          ['SendDateTime', 'int32'],
          ['ContentType', 'int32']
        )
      );
      root.add(
        createProto(
          'IM_ReceivePrivateReceipt',
          ['Seq', 'int32'],
          ['ReceiptType', 'IM_ReceiptType'],
          ['MsgID'],
          ['SendDateTime', 'int32'],
          ['SenderID']
        )
      );

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
      );
      root.add(
        createProto(
          'IM_SendGroupReceipt',
          ['Seq', 'int32'],
          ['ReceiptType', 'IM_ReceiptType'],
          ['MsgID'],
          ['GroupID']
        )
      );
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
      );
      root.add(
        createProto(
          'IM_ReceiveGroupReceipt',
          ['GroupID'],
          ['ReceiptType', 'IM_ReceiptType'],
          ['ReceiverID'],
          ['MsgID'],
          ['SendDateTime', 'int32']
        )
      );

      root.add(createEnum('IM_NoticeCategory', ['Unknown', 'Offline']));
      root.add(createEnum('IM_ReceiptType', ['Receive', 'Read']));
      util.log('【root】', root);
      util.Timer.stop('proto');
      util.log('【proto 加载完毕,耗时】', util.Timer.getTime('proto'));
      util.triggerCallback(callback);
    } catch (e) {
      util.triggerCallback(fail);
      util.error('proto 加载失败，请确定协议文件是否正确', e);
    }
  }

  window.IMClientSDK = function (options) {
    //先清除，防止上一次的没清理干净
    eventManger.clear();
    if (!options) {
      alert('实例化IMClientSDK参数不全，请检查');
      return;
    }

    configs = options;
    baseUrl = options.baseUrl;
    anonyUrl = options.anonyUrl;
    tokenUrl = options.tokenUrl;
    imageServiceUrl = options.imageServiceUrl;

    //当前是wb还是轮询，参考之一是读取配置；参考之二是根据下面的后面的代码
    if (!configs.websocketUrl || configs.isPoll === true) {
      currentParttern = parttern.polling;
    }
    util.log('baseUrl', baseUrl);
    util.log('websocketUrl', configs.websocketUrl);
    util.log('appKey', configs.appKey);
    util.log('websocketOnly', configs.websocketOnly);

    //ie10+ 才能使用WebSocket 因为使用了ArrayBuffer 只支持到ie10+
    //没有这两个对象 强制启动到轮询
    if (
      typeof protobuf == 'undefined' ||
      !window.WebSocket ||
      currentParttern == parttern.polling
    ) {
      currentParttern = parttern.polling;
      init();
      return;
    }

    /**参数1：初始化loadProto
     * 参数2：失败处理
     */
    loadProto(init, function () {
      currentParttern = parttern.polling;
      init();
    });
  };

  let currentSocket = null,
    bufferLength = 0,
    readBuffer = null;
  let reconnectTimes = 3, //wb尝试重连3次，不行切换到polling
    hasAuthSuccess = true;
  let reconnetInterval = 2 * 1e3; //重连时间间隔
  let websocketStrategy;

  /** 封装websocket的相关功能
   *  return:
   *  @function isStop
   *  @function isReconnect
   *  @function loginByIMToken
   *  @function joinChannel
   *  @function exitChannel
   *  @function sendToChannel
   *  @function sendMessage
   *  @function sendGroupMessage
   *  @function sendGroupReceipt
   *  @function logout
   *  @function startHeart
   *  @function sendPrivateReceipt
   *  @function sendBuffer
   *  @function stop
   */
  function websocketStrategyCtr() {
    let me = { isStop: false, isReconnect: false };
    let callbackArr = [];

    me.start = function () {
      readBuffer = new ArrayBuffer(40960);
      connecting();
    };

    function reConnect(cb) {
      util.log(reconnetInterval / 1e3 + 's后开始重连...');
      setTimeout(connecting, reconnetInterval); // 每隔2s重连一次
      me.isReconnect = true;
      isReconnect = true;
      callbackArr.push(cb);
    }

    function connecting() {
      if (me.isStop) return;
      currentSocket && currentSocket.close();

      //wb重连3次失败后，启动轮询
      if (reconnectTimes <= 0) {
        if (currentParttern == parttern.polling) return;
        util.log('已经重连3次,开始切换到轮询...');
        startLongpoll();
        return;
      }

      function onWebsocketOpen() {
        if (me.isStop) return;
        //如果Root还没有加载完，就需要等待，不然很快就会收到登录反馈，却不能解析
        util.log('reConnected', currentParttern + ',   ' + me.isReconnect);
        me.isReconnect && eventManger.trigger('reConnected');
        eventManger.trigger('connected');
        util.log('【成功启动onWebsocketOpen】', currentParttern);
      }

      function onWebsocketClose(msg) {
        util.log('websocket关闭，代码:', msg.code);
        switch (msg.code) {
          case 1000:
            //正常关闭
            break;
          case 1001:
            //端点离开 服务关闭或导航到其他页面
            break;
          case 1002:
            //协议错误而终止
            break;
          case 1003:
          //收到了不能接收的数据类型
          case 1006:
            //连接异常关闭
            break;
          case 1007:
            //端点因为消息中接收到的数据是不符合消息类型而终止连接
            break;
          case 1008:
            //接收到的消息违反其策略而终止连接
            break;
          case 1009:
            //接收到的消息对它的处理来说太大而终止连接
            break;
          default:
        }
        //关闭为啥在这开辟一个新ArrayBuffer？
        readBuffer = new ArrayBuffer(40960);
        eventManger.trigger('disconnected');
        //todo:2021/12/6注释掉，调试外部调用_clinetSDK.stop()方法时候，不希望停止后还重新连接
        // reConnect()
      }

      function onWebsocketReceived(evt) {
        util.log('【****onWebsocketReceived****】', evt);
        toContext(evt.data);
      }

      function onWebsocketError(err) {
        eventManger.trigger('error', 'websocket启动失败,原因:' + err);
        if (reconnectTimes > 0) {
          //util.log('重连次数---：' + reconnectTimes);
          if (!configs.websocketOnly) reconnectTimes--; // 重连的过程中一直失败，用于计数;
        } else {
          util.log('启动方式切换到轮询...');
          startLongpoll();
        }
      }

      //加入重连
      try {
        currentSocket = new WebSocket(configs.websocketUrl, 'im');
      } catch (e) {
        util.error('websocket链接失败', e);
        reConnect();
        if (!configs.websocketOnly) reconnectTimes--;
        return;
      }

      currentSocket.binaryType = 'arraybuffer'; // We are talking binary
      currentSocket.onerror = onWebsocketError;
      currentSocket.onopen = onWebsocketOpen;
      currentSocket.onclose = onWebsocketClose;
      currentSocket.onmessage = onWebsocketReceived; //接收到服务器发来的消息的时触发的事件
      util.log('【currentSocket】', currentSocket);
      /*if (!configs.websocketOnly) {
                reconnectTimes--;
            }*/
    }

    function getChanelBuffer(channel, type) {
      let model = root.IM_Channel.create({
        ChannelID: channelId,
        type: type ? type : 0,
      });
      return root.IM_Channel.encode(model).finish();
    }

    function toContext(buffer) {
      //  先放到本地缓冲区
      copyTo(buffer, 0, readBuffer, bufferLength, buffer.byteLength);
      bufferLength += buffer.byteLength;
      //  解析本地缓冲区数据
      let offset = 0;
      while (true) {
        if (offset >= bufferLength) {
          break;
        }
        let dv = new DataView(readBuffer);
        let len = dv.getInt16(offset, false);
        if (len < 3) {
          //为什么会出现这种情况?
          //nobody no
          util.error('len小于3');
          break;
        }

        if (bufferLength < len + offset) {
          // 解不出一个包
          break;
        }
        let protocol = dv.getUint8(2, false);

        try {
          let arBuf = new ArrayBuffer(len - 3);
          copyTo(readBuffer, offset + 3, arBuf, 0, len - 3);
          offset += len;
          //如果是轮询这个就不触发了
          currentParttern == parttern.websocket &&
            socketMessageDispatcher(protocol, arBuf);
        } catch (e) {
          util.error(e, len);
          break;
        }
      }
      if (bufferLength > offset) {
        //  还有剩余数据
        bufferLength -= offset;
        copyTo(readBuffer, offset, readBuffer, 0, bufferLength);
      } else {
        //  没有剩余数据
        bufferLength = 0;
      }
    }

    // websocket相关的反馈结果
    function socketMessageDispatcher(protocol, arBuf) {
      if (me.isStop) return;
      let buffer = decompress(arBuf);
      let obj = {};
      switch (protocol) {
        /*  case 2: //  IMToken登陆反馈
                    obj = root.IM_Feedback.decode(buffer);
                    util.log(obj);
                    if (obj.ResultCode == 0)
                        websocketStrategy.startHeart();
                    break;*/
        case 174: // 频道普通消息
          obj = root.IM_ReceiveChannelMessage.decode(buffer);
          eventManger.trigger('messages', obj);
          // util.log(protocol, "收到频道消息", obj);
          break;
        case 254: // 收到session info
        case 161: // 发送私信反馈
        case 171: // 发送私信反馈
        case 163: // 收到私信反馈
          obj = root.IM_Feedback.decode(buffer);
          break;
        case 253: // 登录反馈
          obj = root.IM_Feedback.decode(buffer);
          util.log('【登录反馈253】', obj);
          if (obj.ResultCode == 0) {
            websocketStrategy.startHeart();
          } else {
            // 登录失败
            //reConnect();
            //eventManger.trigger("imLogin", obj);
          }

          break;
        case 224: //订阅频道反馈
          obj = root.IM_Feedback.decode(buffer);
          if (obj.ResultData) {
            eventManger.trigger('joinChannelSuccess', obj.ResultData);
            if (me.isReconnect) {
              for (let i = 0; i < callbackArr.length; i++) {
                util.triggerCallback(callbackArr[i]);
              }
            }
          }
          break;
        case 167: //发送到频道反馈
          obj = root.IM_Feedback.decode(buffer);
          break;
        case 170: //收到私信
          obj = root.IM_ReceivePrivateMessage.decode(buffer);
          eventManger.trigger('privateMessage', obj, protocol);
          break;
        case 172: //收到组群消息
          obj = root.IM_ReceiveGroupMessage.decode(buffer);
          eventManger.trigger('groupMessage', obj, protocol);
          break;
        /* case 171: //收到私信回执
                        obj = root.IM_ReceivePrivateReceipt.decode(buffer);
                        eventManger.trigger("receivePrivateReceiptSuccess", obj, protocol);
                        break;*/
        case protoCodes.serverNotice:
          obj = root.IM_ServerNotice.decode(buffer);
          //说明有离线消息
          // 启动离线轮询
          if (obj.Category == 1) {
            return; //2021/12/13 暂且不拉离线消息
            starOfflinepoll(); // ??
          }
          break;
      }
      eventManger.trigger('protocol', protocol, protoHooks[protocol], obj);
    }

    //将ut8Array转成字符串
    function toBuffer(protocol, buffer) {
      let newBuff = new ArrayBuffer(buffer ? buffer.byteLength + 3 : 3);
      let dv = new DataView(newBuff);
      dv.setInt16(0, newBuff.byteLength, false);
      dv.setInt8(2, protocol, false);
      if (buffer) {
        let byteBuff = new Uint8Array(newBuff);
        let temp = new Uint8Array(buffer);
        for (let i = 0; i < buffer.byteLength; i++) {
          byteBuff[i + 3] = temp[i];
        }
      }
      return newBuff;
    }

    function copyTo(source, start, destination, offset, length) {
      let s = new Uint8Array(source, start, length);
      let d = new Uint8Array(destination, offset, length);
      for (let i = 0; i < length; i++) {
        d[i] = s[i];
      }
    }

    function decompress(buffer) {
      let compressed = new Zlib.Gunzip(new Uint8Array(buffer));
      return compressed.decompress();
    }

    me.loginByIMToken = function (uid, token, device, version, success, fail) {
      //入参protobuf封装
      const model = root.IM_LoginToken.create({
        UserID: uid,
        Token: token,
        Device: device,
        Version: version,
        Appkey: configs.appKey,
      });
      //序列化
      const imToken = root.IM_LoginToken.encode(model).finish();
      //发送消息
      me.sendBuffer(protoCodes.login, imToken, success, fail);
    };
    //实际为监听这个频道
    me.joinChannel = function (channel, type, success, fail) {
      let ch = getChanelBuffer(channel, type);
      me.sendBuffer(protoCodes.joinChannel, ch, success, fail);
    };
    me.exitChannel = function (channel) {
      let ch = getChanelBuffer(channel, 0);
      me.sendBuffer(protoCodes.exitChannel, ch);
    };

    // 频道
    let cacheArgs;
    me.sendToChannel = function (ch, content, protocol, success, fail) {
      if (me.isStop) return;
      if (!ch) {
        util.log('channlid不能为空');
        util.triggerCallback(fail, 'channelId不能为空');
        return;
      }
      cacheArgs = arguments;
      let model = {
        Seq: new Date().getTime(),
        ChannelID: ch,
        ContentType: 1,
        Content: content,
        Persist: protocol !== 200,
      };
      let errMsg = root.IM_SendChannelMessage.verify(model);
      if (errMsg) {
        util.triggerCallback(fail, '模型验证错误');
        throw Error(errMsg);
      }
      let message = root.IM_SendChannelMessage.create(model);
      let buffer = root.IM_SendChannelMessage.encode(message).finish();
      me.sendBuffer(protoCodes.sendToChannel, buffer, success, fail);
    };
    // 私信
    me.sendMessage = function (
      rid,
      content,
      ack,
      persist,
      type,
      success,
      fail
    ) {
      if (me.isStop) return;
      let model = {
        Seq: new Date().getTime(),
        ReceiverID: rid,
        Content: content,
        Ack: !!ack,
        Persist: !!persist,
        ContentType: type,
      };
      let errMsg = root.IM_SendPrivateMessage.verify(model);
      if (errMsg) {
        util.triggerCallback(fail, '模型验证错误');
        throw Error(errMsg);
      }
      let message = root.IM_SendPrivateMessage.create(model);
      let buffer = root.IM_SendPrivateMessage.encode(message).finish();
      me.sendBuffer(protoCodes.sendPrivateMessage, buffer, success, fail);
    }; //todo 这下面几个还没和api对应
    me.sendGroupMessage = function (
      groupId,
      content,
      ack,
      persist,
      type,
      success,
      fail
    ) {
      if (me.isStop) return;
      let model = {
        Seq: new Date().getTime(),
        GroupID: groupId,
        Content: content,
        Ack: !!ack,
        Persist: !!persist,
        ContentType: type,
      };
      let errMsg = root.IM_SendGroupMessage.verify(model);
      if (errMsg) {
        util.triggerCallback(fail, '模型验证错误');
        throw Error(errMsg);
      }
      let message = root.IM_SendGroupMessage.create(model);
      let buffer = root.IM_SendGroupMessage.encode(message).finish();
      me.sendBuffer(protoCodes.sendToGroupMessage, buffer, success, fail);
    };
    me.sendGroupReceipt = function (
      msgId,
      groupId,
      receiptType,
      success,
      fail
    ) {
      if (me.isStop) return;
      let model = {
        Seq: new Date().getTime(),
        IM_ReceiptType: receiptType,
        MsgID: msgId,
        GroupID: groupId,
      };
      let errMsg = root.IM_SendGroupReceipt.verify(model);
      if (errMsg) {
        util.triggerCallback(fail, '模型验证错误');
        throw Error(errMsg);
      }
      let message = root.IM_SendGroupReceipt.create(model);
      let buffer = root.IM_SendGroupReceipt.encode(message).finish();
      me.sendBuffer(protoCodes.IM_SendGroupReceipt, buffer, success, fail);
    };
    me.logout = function () {
      me.sendBuffer(protoCodes.logout);
    };

    let heartTime;
    me.startHeart = function () {
      if (me.isStop) return;
      clearTimeout(heartTime);
      heartTime = setTimeout(function () {
        me.sendBuffer(protoCodes.hearts);
        if (currentSocket && currentSocket.readyState == WebSocket.OPEN) {
          util.log('【1分钟心跳检测一次 ●sendBuffer 0:"心跳"】');
          me.startHeart();
        }
      }, 60 * 1e3);
    };

    //发送私信回执,ReceiptType 0 已收回执，1已读回执
    me.sendPrivateReceipt = function (msgId, rId, type) {
      if (me.isStop) return;
      let model = {
        Seq: new Date().getTime(),
        ReceiptType: type || 0,
        MsgID: msgId,
        ReceiverID: rId,
      };
      let message = root.IM_SendPrivateReceipt.create(model);
      let buffer = root.IM_SendPrivateReceipt.encode(message).finish();
      me.sendBuffer(protoCodes.sendPrivateReceipt, buffer);
    };

    me.sendBuffer = function (protocol, msg, success, fail) {
      if (me.isStop) return;
      if (!currentSocket) {
        //Root加载慢会产生这种情况
        eventManger.trigger('error', 'sendBuffer:websocket不存在，正在重连');
        reConnect();
        util.triggerCallback(fail, 'websocket不存在');
        //重连之后再执行一次
        return;
      }
      if (!hasAuthSuccess) util.triggerCallback(fail, '认证失败,发送无效');

      if (!protocol) util.triggerCallback(fail, '协议不能为空');

      if (currentSocket.readyState == WebSocket.OPEN) {
        //send()向远程服务器发送数据
        //针对code和msg 再次toBuffer 发送出去
        currentSocket.send(toBuffer(protocol, msg));
        util.triggerCallback(success);
      } else {
        eventManger.trigger('error', 'sendBuffer:websocket未打开');
        util.triggerCallback(fail, 'sendBuffer:websocket未打开');
      }
    };
    me.stop = function () {
      me.isStop = true;
      //有的时候 没有启动WebSocket close()关闭该websocket链接
      currentSocket && currentSocket.close(1000, 'Closing normally');
      currentSocket = null;
    };
    return me;
  }

  function isios() {
    return /(iPhone|iPod|iPad|iTouch|iOS)/i.test(navigator.userAgent);
  }

  function isAndroid() {
    return /android/i.test(navigator.userAgent);
  }

  function isMobile() {
    return isios() || isAndroid();
  }

  let util = {
    triggerCallback: function (fun) {
      let args = Array.prototype.slice.call(arguments, 1);
      if (typeof fun == 'function') {
        fun.apply(null, args);
      }
    },
    triggerCallbackbyresult: function (res, success, fail) {
      if (res && res.result == 1) {
        util.triggerCallback(success, res);
      } else {
        util.triggerCallback(fail, res);
      }
    },
    log: function (msg) {
      //debug才打印日志
      try {
        configs.debug && console.log && console.log.apply(null, arguments); //zxw注释的第一个点
      } catch (error) {}

      //configs.debug && console.log(msg);
    },
    error: function () {
      //debug才打印日志
      try {
        configs.debug && console.error && console.error.apply(null, arguments); //zxw注释的第一个点
      } catch (error) {}
    },
    info: function () {
      //debug才打印日志
      try {
        configs.debug && console.info && console.info.apply(null, arguments); //zxw注释的第一个点
      } catch (error) {}
    },
    isios: function () {
      return /(iPhone|iPod|iPad|iTouch|iOS)/i.test(navigator.userAgent);
    },
    isAndroid: function () {
      return /android/i.test(navigator.userAgent);
    },
    isMobile: function () {
      return util.isios() || util.isAndroid();
    },
    //用于计算耗时
    Timer: {
      data: {},
      start: function (key) {
        util.Timer.data[key] = new Date();
      },
      stop: function (key) {
        let time = util.Timer.data[key];
        if (time) util.Timer.data[key] = new Date() - time;
      },
      getTime: function (key) {
        return util.Timer.data[key] + 'ms';
      },
    },
  };

  //1001 token过期 需要重新再拿（原作者注释）

  /** polling内的相关功能
   * return出的方法和websocket类似
   */
  let pollingStrategy = (function () {
    let me = {};
    me.start = function () {
      eventManger.trigger('connected');
    };
    me.loginByIMToken = function () {
      //imapi 没有提供这个方法
      hasAuthSuccess = true;
    };
    me.logout = function () {
      me.userLeave(); //这个方法也没有
      clearInterval(pollmessage);
    };
    /*  me.userEnter = function (channel, device, success, fail) {
              let ch = channel || channelId;
              me.httpRequest(urlConfig.userEnter(), JSON.stringify({
                  channelID: ch,
                  device: device
              }), success, fail);
          };*/
    me.messageReceipt = function (data, success, fail) {
      me.httpRequest(urlConfig.messageReceipt(), data, success, fail);
    };
    me.joinChannel = function (channel) {
      channelId = channel || channelId;
      //避免重复启动
      if (!channelId) util.log('channelId不存在!');

      if (channelId == currentPollChannel) return;

      maxId = 0;
      if (configs.pollbyZero) {
        me.pollmessageInterval();
      } else {
        util.log('polling channelid:' + channel + '   ,' + channelId);

        me.getMaxIndex(
          channelId,
          function (res) {
            maxId = res.data;
            me.pollmessageInterval();
          },
          function (res) {
            util.log('获取最大索引失败', res.message);
          }
        );
      }

      currentPollChannel = channelId;
      util.log('轮询启动成功');
      channelId && eventManger.trigger('joinChannelSuccess', channelId);
    };

    // 轮询去获取消息
    me.pollmessageInterval = function () {
      clearInterval(pollmessage);
      pollmessage = null;
      pollmessage = setInterval(function () {
        me.getMessage(channelId, maxId); //channel.toString(), maxId
      }, loopInterval);
    };
    me.getMaxIndex = function (channel, callback, fail) {
      let ch = channel || channelId;
      if (!ch) return;
      let data = {
        channelID: ch,
      };
      util.log('ch:' + ch);
      me.httpRequest(
        urlConfig.getMsgMaxIndex(),
        JSON.stringify(data),
        function (res) {
          util.triggerCallbackbyresult(res, callback, fail);
        },
        fail
      );
    }; //私信
    me.sendMessage = function (receiveId, msg, success, fail) {
      me.httpRequest(
        urlConfig.sendMessage(),
        JSON.stringify({
          receiverID: receiveId,
          msgContent: msg,
        }),
        success,
        fail
      );
    };
    //polling 频道消息
    me.sendToChannel = function (ch, msg, protocol, success, fail) {
      if (!ch) {
        util.log('channlid不能为空');
        util.triggerCallback(fail, 'channelId不能为空');
        return;
      }
      if (!accessToken) {
        util.log('sendToChannel', 'accessToken不能为空');
        util.triggerCallback(fail, 'accessToken不能为空,可能还未认证!');
        return;
      }
      //触发马上去拿消息
      loopInterval = 1 * 1e3;
      me.pollmessageInterval();
      let content = JSON.stringify({
        channelID: ch,
        msg: msg,
        appKey: configs.appKey,
        contentType: protocol,
        persist: protocol == 0,
      });
      me.httpRequest(
        urlConfig.sendChannelCommonMessage(),
        content,
        success,
        fail
      );
    };

    me.getMessage = function (channel, index, callback) {
      let ch = channel || channelId;
      if (!ch || currentParttern == parttern.websocket || me.isStop) {
        clearInterval(pollmessage);
        return;
      }
      let data = {
        channelID: ch,
        index: index,
      };
      //如果没有回调 就走轮询事件通知
      if (typeof callback != 'function') {
        callback = function (result) {
          //处理异常
          if (result.result != 1) {
            util.log(result.message);
            if (result.result == 2000) {
              //频道不存在！
              clearInterval(pollmessage);
              pollmessage = null;
              util.log('暂停轮询...');
            }
          }
          if (result.count == 0) {
            fixloopTime(maxId);
            return;
          }
          // util.log("pollmessages", result);
          if (result.result) {
            eventManger.trigger('pollmessages', result);
          }
        };
      }
      me.httpRequest(
        urlConfig.getMessageListByIndex(),
        JSON.stringify(data),
        callback
      );
    };

    me.getMessageList = function (msg, success, fail) {
      me.httpRequest(urlConfig.getMessageList(), msg, success, fail);
    };

    me.feedback = function (ids) {
      me.httpRequest(
        urlConfig.OfflineMessageReceipt(),
        JSON.stringify({ msgIDs: ids })
      );
    };
    me.getUserOfflineMsg = function (index, senderId, callback) {
      me.httpRequest(
        urlConfig.GetUserOfflineMsg(),
        JSON.stringify({
          pageIndex: index,
          senderID: senderId,
        }),
        callback
      );
    };
    me.getAllOfflineMsg = function (callback) {
      me.httpRequest(urlConfig.GetAllOfflineMsg(), '', callback);
    };
    me.RefreshToken = function (ref, oldToken, success, fail) {
      me.httpRequest(
        urlConfig.RefreshToken(),
        JSON.stringify({ refreshToken: ref, oldToken: oldToken }),
        success,
        fail
      );
    };
    me.anonymousUser = function (msg, success, fail) {
      if (!msg) {
        util.triggerCallback(fail, '传入的参数为空');
        return;
      }
      me.httpRequest(
        urlConfig.anonymousUser(),
        msg,
        function (data) {
          accessToken = data.data.Token;
          imUserID = data.data.IMUserID;
          util.triggerCallback(success, data);
        },
        function (err) {
          util.triggerCallback(fail, err);
        }
      );
    };

    me.isStop = false;
    me.stop = function () {
      //清掉轮询
      me.isStop = true;
      clearInterval(pollmessage);
      pollmessage = null;
    };

    me.httpFileUpLoad = function (fileName, base64Content, success, fail) {
      if (fileName && base64Content) {
        let msg = {
          md5Code: '',
          fileName: fileName,
          base64Content: base64Content,
        };
        msg = JSON.stringify(msg);
        me.httpRequest(
          urlConfig.httpFileUpLoad(),
          msg,
          function (data) {
            util.triggerCallback(success, data);
          },
          function (err) {
            util.triggerCallback(fail, err);
          }
        );
      } else {
        util.triggerCallback(fail, '{"err":"传入参数为空"}');
      }
    };
    me.httpRequest = function (url, msg, success, fail) {
      me.httpRequestBase('post', true, url, msg, success, fail);
    };
    me.httpRequestGet = function (url, msg, success, fail) {
      me.httpRequestBase('get', true, url, msg, success, fail);
    };
    me.httpRequestNoHeader = function (url, msg, success, fail) {
      me.httpRequestBase('post', false, url, msg, success, fail);
    };

    me.httpRequestBase = function (type, hasHeader, url, msg, success, fail) {
      /*   if (!imUserID) {
                   util.log(url + '，imUserID and accessToken 为空');
                   return;
               }*/
      if (url.indexOf('AnonymousUser') == -1) {
        // 匿名登录的接口，不需要验证accessToken
        if (!accessToken) {
          return;
        }
      }

      type = type || 'post';
      let xhr;
      if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xhr = new XMLHttpRequest();
      } else {
        // code for IE6, IE5
        xhr = new ActiveXObject('microsoft.XMLHTTP');
      }
      xhr.open(type, url, true);
      if (hasHeader) {
        /* try {
                     let accessTokens = JSON.stringify(accessToken);
                     accessToken = accessTokens.token;
                     imUserID = accessTokens.imUserID;
                 } catch (e) {

                 }*/
        xhr.setRequestHeader('imUserID', imUserID);
        xhr.setRequestHeader('accessToken', accessToken);
      }
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            try {
              let res = fixMsgId(xhr.responseText);
              // alert(url+",   "+JSON.stringify(res));
              util.triggerCallback(success, res, url);
            } catch (e) {
              util.triggerCallback(fail, e, url);
            }
          } else {
            //发送失败
            util.triggerCallback(fail, xhr, url);
          }
        }
      };
      xhr.send(msg);
    };

    //现在不需要了吧？
    function fixMsgId(str) {
      //fix msgId
      if (!str) return null;
      let res = JSON.parse(str);
      if (res.count && res.data) {
        let reg = /"MsgID":(.*?),/g;
        let arr = [];
        str.replace(reg, function (id) {
          let raw = id.split(':')[1].split(',')[0];
          arr.push(raw);
        });
        let items = res.data;
        for (let i = 0; i < items.length; i++) {
          items[i].MsgID = arr[i];
        }
      }
      return res;
    }
    return me;
  })();

  function init() {
    //websockt,数据初始化
    if (window.WebSocket && !!ArrayBuffer && !websocketStrategy) {
      websocketStrategy = websocketStrategyCtr();
      _core[parttern.websocket] = websocketStrategy;
    }
    //polling,数据初始化
    _core[parttern.polling] = pollingStrategy;
    //默认为'websocket'
    util.log('【_core】', _core);
    util.log('【_core[currentParttern]】', _core[currentParttern]);
    currentStrategy = _core[currentParttern];
    //在这个事件之后start比较好，因为策略对象都已经初始化成功
    //不然start过早 功能会不正常
    //eventManger.trigger("initSuccess");
    util.info('初始化成功');
    //自动
    util.log('正在启动...', currentParttern);
    currentStrategy.start();
  }

  //----------------内部方法--------------------

  //----------------对外暴露的共有方法--------------------

  //IMClientSDK.prototype.start = function () {
  //    util.log("正在启动...", currentParttern);
  //    currentStrategy.start();
  //};
  let hasAuth = false;
  let refreshTokenTimer = null;
  //rt:refreshToken

  //登录&&定时刷新token
  IMClientSDK.prototype.loginByIMToken = function (
    uid,
    token,
    device,
    version,
    rt,
    success,
    fail
  ) {
    if (!currentStrategy) return;
    imUserID = uid;
    accessToken = token;
    refreshToken = rt;
    currentStrategy.loginByIMToken(uid, token, device, version, success, fail);

    hasAuth = true;

    //需要不断定时刷新token
    refreshTokenTimer = setInterval(function () {
      if (!refreshToken) return;
      util.log('刷新token');
      pollingStrategy.RefreshToken(
        refreshToken,
        accessToken,
        function (res) {
          if (res.result == 1) {
            accessToken = res.data.Token;
            refreshToken = res.data.RefreshToken;
            imUserID = res.data.IMUserID;
            eventManger.trigger('refreshToken', accessToken);
          } else {
            util.log('token不合法或者必填值为空~');
          }
        },
        function (res) {
          util.log('获取token的接口失败：' + res);
        }
      );
    }, 8 * 60 * 1e3); //8分钟
  };

  //目前还没用
  IMClientSDK.prototype.refreshTokenNow = function (success, fail) {
    pollingStrategy.RefreshToken(
      refreshToken,
      accessToken,
      function (res) {
        if (res.result == 1) {
          accessToken = res.data.Token;
          refreshToken = res.data.RefreshToken;
          imUserID = res.data.IMUserID;
          let data = {
            imUserID: res.data.IMUserID,
            token: res.data.Token,
            refreshToken: res.data.RefreshToken,
          };
          eventManger.trigger('refreshToken', JSON.stringify(data));
          util.triggerCallback(success, JSON.stringify(data));
        } else {
          util.log('token不合法或者必填值为空~');
          util.triggerCallback(fail, JSON.stringify(res));
        }
      },
      function (res) {
        util.log('获取token的接口失败：' + res);
        util.triggerCallback(fail);
      }
    );
  };

  //目前还没使用，currentStrategy中只有loginByIMToken，没有loginByCUToken
  IMClientSDK.prototype.loginByCUToken = function (
    ctoken,
    utoken,
    uniqueId,
    uid,
    device,
    ptype,
    version
  ) {
    currentStrategy.loginByCUToken(
      ctoken,
      utoken,
      uniqueId,
      uid,
      device,
      ptype,
      version
    );
    hasAuth = true;
  };

  IMClientSDK.prototype.joinChannel = function (channel, type, success, fail) {
    if (channel == currentPollChannel) return;
    channelId = channel;
    //对于WebSocket方式，认证之后才能joinchannel  但轮询就不需要
    if ((currentParttern == parttern.websocket && !hasAuth) || !channel) return;
    currentStrategy.joinChannel(channel, type, success, fail);

    /*  pollingStrategy.userEnter(channelId, "pc", function (data) {
              currentStrategy.joinChannel(channel, type, success, fail);
              util.log("userEnter success ....");
          }, function () {
              util.log('userEnter fail ....');
          });*/
  };
  IMClientSDK.prototype.exitChannel = function (channel) {
    currentParttern == parttern.websocket &&
      websocketStrategy.exitChannel(channel);
  };

  /* IMClientSDK.prototype.userEnter = function (channel) {
         currentParttern == parttern.websocket && pollingStrategy.userEnter(channel);
     };*/
  IMClientSDK.prototype.logout = function () {
    //离开后需要清除eventManger缓存,不然再次进来后会重复触发事件
    try {
      eventManger.clear();
      currentStrategy.logout();
    } catch (error) {
      eventManger.clear();
    }
  };
  IMClientSDK.prototype.sendToChannel = function (
    ch,
    content,
    protocol,
    success,
    fail
  ) {
    //util.log("sendToChannel", ch, content, protocol);
    if (configs.sendBypoll) {
      //因为WebSocket不给发送者推消息，发送者得不到消息的时间
      pollingStrategy.sendToChannel(ch, content, protocol, success, fail);
    } else {
      currentStrategy.sendToChannel(ch, content, protocol, success, fail);
    }
  };
  //用于轮询接口，记录日志
  IMClientSDK.prototype.messageReceipt = function (data) {
    pollingStrategy.messageReceipt(data);
  };
  IMClientSDK.prototype.startHeart = function () {
    currentStrategy.startHeart();
  };
  IMClientSDK.prototype.feedback = function (msgIds) {
    currentStrategy.feedback(msgIds);
  };
  IMClientSDK.prototype.sendPrivateReceipt = function (msgId, rid, type) {
    websocketStrategy.sendPrivateReceipt(msgId, rid, type);
  };
  IMClientSDK.prototype.receivePrivateReceipt = function (
    msgId,
    rid,
    type,
    time
  ) {
    websocketStrategy.receivePrivateReceipt(msgId, rid, type, time);
  };
  IMClientSDK.prototype.sendGroupReceipt = function (msgId, gid, type) {
    websocketStrategy.sendGroupReceipt(msgId, gid, type);
  };
  IMClientSDK.prototype.getRoot = function () {
    return root;
  }; //----------------longpollOnly--------------------
  IMClientSDK.prototype.getUserOfflineMsg = function (
    index,
    senderId,
    callback
  ) {
    pollingStrategy.getUserOfflineMsg(index, senderId, callback);
  };
  IMClientSDK.prototype.sendPrivateMessage = function (
    receiveId,
    msg,
    success,
    fail
  ) {
    pollingStrategy.sendMessage(receiveId, msg, success, fail);
  };
  IMClientSDK.prototype.setTokenAnduserId = function (token, userid) {
    if (token && userid) {
      accessToken = token;
      imUserID = userid;
    } else {
      eventManger.trigger('error', 'token或userid不能为空');
    }
  };
  IMClientSDK.prototype.setMaxID = function (id) {
    //修改轮训时间
    currentParttern == parttern.polling && fixloopTime(id);
    if (id > maxId) {
      maxId = id;
    }
  };
  IMClientSDK.prototype.getMessage = function (channel, index, callback) {
    pollingStrategy.getMessage(channel, index, callback);
  };
  IMClientSDK.prototype.sendMessage = function (
    uid,
    msg,
    ack,
    persist,
    type,
    success,
    fail
  ) {
    if (currentParttern == parttern.polling) {
      pollingStrategy.sendMessage(uid, msg, success, fail);
    } else {
      websocketStrategy.sendMessage(
        uid,
        msg,
        ack,
        persist,
        type,
        success,
        fail
      );
    }
  };
  IMClientSDK.prototype.sendGroupMessage = function (
    gid,
    msg,
    ack,
    persist,
    type,
    success,
    fail
  ) {
    if (currentParttern == parttern.polling) {
      //pollingStrategy.sendGroupMessage(uid, msg, success, fail);
    } else {
      websocketStrategy.sendGroupMessage(
        gid,
        msg,
        ack,
        persist,
        type,
        success,
        fail
      );
    }
  };
  // 匿名登录
  IMClientSDK.prototype.anonymousUser = function (msg, success, fail) {
    pollingStrategy.anonymousUser(msg, success, fail);
  };
  // 获取当前频道消息
  IMClientSDK.prototype.getChanneMessage = function (msg, success, fail) {
    pollingStrategy.getMessageList(msg, success, fail);
  };

  //最长8秒，最短1秒
  let saveTimes = 1;

  function fixloopTime(mid) {
    if (mid == maxId) {
      saveTimes++;
      if (saveTimes > 4) {
        saveTimes = 4;
        return;
      }
      loopInterval = saveTimes * 1e3;
    } else {
      // util.log("loopInterval恢复");
      loopInterval = 1 * 1e3;
      saveTimes = 1;
    }
    //saveTimes > 1 && util.log("轮训时间切换为" + saveTimes + "秒");
    pollingStrategy.pollmessageInterval();
  }

  IMClientSDK.prototype.getMaxID = function () {
    return maxId;
  };

  IMClientSDK.prototype.httpFileUpLoad = function (name, str, success, fail) {
    pollingStrategy.httpFileUpLoad(name, str, success, fail);
  };

  function startLongpoll() {
    currentParttern = parttern.polling;
    currentStrategy = _core[currentParttern];
    pollingStrategy.start();
    pollingStrategy.joinChannel();
  }

  //先调用所有的
  //然后获取到senderId之后  逐个轮询
  let maxSenderId = [];

  /** 离线轮询
   *  拉不拉私信,取决于WebSocket的消息
   *  那么轮询的时候,就要循环这个方法。但是目前客服用不到，做的叮咚也用不到，因为默认是chrome内核。这个问题先不管。
   *  流程：收到WebSocket消息 -- getall（得到所有的senderId 但只拉取了1页）-- 然后再调用getUserofflineMsg 拉完
   */
  function starOfflinepoll() {
    pollingStrategy.getAllOfflineMsg(function (data) {
      if (data.result == 1 && data.count > 0) {
        for (let i = 0; i < data.count; i++) {
          let itemarr = data.data[i].Content;
          util.log('离线消息', data.data[i]);
          //分两个方法很蛋疼，
          //就用这一个处理就行
          //反正也要保持不断的轮询 确保后续的消息能收到
          for (let j = 0; j < itemarr.length; j++) {
            let item = itemarr[j];
            //去重复
            eventManger.trigger('privateMessages', item);
          }
          // 这个20 存在隐患
          if (
            data.data[i].Count >= itemarr.length &&
            data.data[i].Count >= 20
          ) {
            maxSenderId.push(itemarr[0].SenderID);
          }
        }
      }

      if (maxSenderId.length > 0) {
        maxSenderId.forEach(function (n) {
          loopBysenderId(2, n);
        });
      }
    });
  }

  function loopBysenderId(index, senderId) {
    pollingStrategy.getUserOfflineMsg(index, senderId, function (data) {
      if (data.result == 1) {
        // util.log(index, senderId, data);
        let count = data.data.Content.length;
        for (let i = 0; i < count; i++) {
          eventManger.trigger('privateMessages', data.data.Content[i]);
        }

        if (data.data.Content.length != 0) {
          //index +1 再去捞一次 捞完为止
          setTimeout(function () {
            loopBysenderId(index + 1, senderId);
          }, 1e3);
        }
      }
      // 没有获取到 超时,那就稍作等待再执行一遍
      //14 表示访问超时
      else if (data.result == 14) {
        setTimeout(function () {
          loopBysenderId(index, senderId);
        }, 2000);
      }
    });
  }

  IMClientSDK.prototype.startLongpoll = startLongpoll;
  IMClientSDK.prototype.stop = function () {
    //存在proto还没加载完，就被调用端stop的情况
    currentStrategy && currentStrategy.stop();
    clearInterval(refreshTokenTimer);
    refreshTokenTimer = null;
    /*  clearInterval(pollmessage);
          pollmessage = null;*/
    util.log('外部调用了stop');
  };
  //----------------websocketOnly--------------------

  //给外部绑定事件：外部实例化的on转化内部的eventManger.addHandler
  IMClientSDK.prototype.on = function (type, event) {
    eventManger.addHandler(type, event);
  };
  //移除事件
  IMClientSDK.prototype.off = function (type, event) {
    eventManger.removeHandler(type, event);
  };
  IMClientSDK.prototype.log = function () {
    util.log.apply(null, arguments);
  };
  IMClientSDK.prototype.info = function () {
    util.info.apply(null, arguments);
  };
  IMClientSDK.prototype.error = function () {
    util.error.apply(null, arguments);
  };
  IMClientSDK.prototype.currentParttern = function () {
    return currentParttern;
  };
  IMClientSDK.prototype.protoCodes = protoCodes;
  IMClientSDK.prototype.protoHooks = protoHooks;

  let eventManger = {
    cached: {},
    handlers: {},
    //类型,绑定事件
    addHandler: function (type, handler) {
      if (typeof handler !== 'function') return;
      //每个事件都可以绑定多次
      if (typeof this.handlers[type] == 'undefined') {
        this.handlers[type] = [];
      }
      this.handlers[type].push(handler);
      //说明有缓存的 可以执行
      if (this.cached[type] instanceof Array) {
        handler.apply(null, this.cached[type]);
      }
    },
    removeHandler: function (type, handler) {
      let events = this.handlers[type];
      for (let i = 0, len = events.length; i < len; i++) {
        if (events[i] == handler) {
          events.splice(i, 1);
          break;
        }
      }
    },
    trigger: function (type) {
      //如果有订阅的事件，这个时候就触发了
      if (this.handlers[type] instanceof Array) {
        let handlers = this.handlers[type];
        let args = Array.prototype.slice.call(arguments, 1);
        for (let i = 0, len = handlers.length; i < len; i++) {
          handlers[i].apply(null, args);
        }
      }
      //默认缓存 支持先触发后订阅
      this.cached[type] = Array.prototype.slice.call(arguments, 1);
    },
    //离开后清除缓存
    clear: function () {
      this.cached = {};
      this.handlers = {};
    },
  };

  Date.prototype.Format = function (fmt) {
    let o = {
      'M+': this.getMonth() + 1, //月份
      'd+': this.getDate(), //日
      'h+': this.getHours(), //小时
      'm+': this.getMinutes(), //分
      's+': this.getSeconds(), //秒
      'q+': Math.floor((this.getMonth() + 3) / 3), //季度
      'S': this.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (this.getFullYear() + '').substr(4 - RegExp.$1.length)
      );
    for (let k in o)
      if (new RegExp('(' + k + ')').test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        );
    return fmt;
  };
})();
