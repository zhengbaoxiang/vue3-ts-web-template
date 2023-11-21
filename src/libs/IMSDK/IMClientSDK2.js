(function () {
  var parttern = {
    websocket: 'websocket',
    polling: 'polling',
  };
  var baseUrl = 'https://imcpftest.eastmoney.com:16060/IMAPI';
  var urlConfig = {
    websocketUrl: 'wss://imcpftest.eastmoney.com:18080',
    proxy: '/imapis',
    //anonymousUser: baseUrl + "/imuser/anonymousUser",
    sendChannelCommonMessage: function () {
      return getUrl('/SendChannelCommonMessage');
    },
    getMessageListByIndex: function () {
      return getUrl('/GetMessageListByIndex');
    },
    userLeave: function () {
      return getUrl('/UserLeave');
    },
    userEnter: function () {
      return getUrl('/UserEnter');
    },
    sendMessage: function () {
      return getUrl('/IMSendMessage');
    },
    getMsgMaxIndex: function () {
      return getUrl('/getMsgMaxIndex');
    },
    httpFileUpLoad: function () {
      return getUrl('/ImageUpLoad').replace('IMAPI', 'ImageService');
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
    OtherLoginAuth: function () {
      return getUrl('/OtherLoginAuth').replace('IMAPI', 'IMUser');
    },
    AnonymousUser: function () {
      return getUrl('/anonymousUser').replace('IMAPI', 'IMUser');
    },
    RefreshToken: function () {
      return getUrl('/RefreshToken').replace('IMAPI', 'IMToken');
    },
  };

  function getUrl(tag) {
    return baseUrl + tag;
  }

  var root = {},
    refreshToken = '';

  function createProto(name) {
    var args = [].slice.call(arguments, 1);
    var obj = new protobuf.Type(name);
    for (var i = 0; i < args.length; i++) {
      var p = args[i];
      var key = i + 1;
      obj.add(new protobuf.Field(p[0], key, p[1] || 'string'));
    }
    return obj;
  }

  function createEnum(name, list) {
    var obj = new protobuf.Enum(name);
    for (var i = 0; i < list.length; i++) {
      obj.add(list[i], i);
    }
    return obj;
  }

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
          'IM_ReceivePrivateMessage',
          ['MsgID'],
          ['SenderID'],
          ['ReceiverID'],
          ['Content'],
          ['Ack', 'bool'],
          ['SendDateTime', 'int32'],
          ['ContentType', 'int32'],
          ['Sender', 'IM_UserInfo'],
          ['NeedReceipt', 'bool'],
          ['MsgIndexID', 'int64'],
          ['Receiver', 'IM_UserInfo']
        )
      );
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
          'IM_SendPrivateReceipt',
          ['Seq', 'int32'],
          ['ReceiptType', 'IM_ReceiptType'],
          ['MsgID'],
          ['ReceiverID']
        )
      );
      root.add(
        createProto(
          'IM_ReceivePrivateReceipt',
          ['ReceiptType', 'IM_ReceiptType'],
          ['MsgID'],
          ['SendDateTime', 'int32'],
          ['SenderID']
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
          'IM_ReceiveGroupReceipt',
          ['GroupID'],
          ['ReceiptType', 'IM_ReceiptType'],
          ['ReceiverID'],
          ['MsgID'],
          ['SendDateTime', 'int32']
        )
      );
      root.add(
        createProto(
          'IM_ReceiveRecallMsg',
          ['MsgID'],
          ['ImUserID'],
          ['Type', 'int32'],
          ['OldMsgID'],
          ['ReplaceMsg'],
          ['ReferId'],
          ['ContentType', 'int32']
        )
      );
      root.add(
        createProto(
          'IM_AuditFeedback',
          ['MsgID'],
          ['ImUserID'],
          ['Type', 'int32'],
          ['Msg'],
          ['ChannelID']
        )
      );
      root.add(
        createProto(
          'IM_UserInfo',
          ['UserID'],
          ['Nick'],
          ['CertifiedType', 'int32']
        )
      );
      root.add(createEnum('IM_NoticeCategory', ['Unknown', 'Offline']));
      root.add(createEnum('IM_ReceiptType', ['Receive', 'Read']));
      util.Timer.stop('proto');
      util.log('proto 加载完毕,耗时', util.Timer.getTime('proto'));
      util.triggerCallback(callback);
    } catch (e) {
      util.triggerCallback(fail);
      util.error('proto 加载失败，请确定协议文件是否正确', e);
    }
  }

  var currentParttern = parttern.websocket; //polling
  var currentPollChannel;
  var _core = [],
    imUserID,
    channelId,
    accessToken;
  var loopInterval = 1000 * 2;
  var currentStrategy = null;
  //轮询对象
  var pollmessage;
  var maxId = 0;
  var configs = {
    isPoll: false,
    ip: urlConfig.websocketUrl,
    appKey: 'CaiFuHao',
    debug: false,
    //如果需要获取发送消息的时间 需要走轮询发送消息
    //一般默认走的还是WebSocket发
    sendBypoll: false,
    //轮询从0 开始 还是从最大索引开始
    pollbyZero: false,
    privateModal: false,
    //重连只重连WebSocket
    websocketOnly: false,
  };
  var protoCodes = {
    hearts: 0,
    reset: 1,
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
    receiveRecallMessage: 101,
    receiveAuditFeedback: 97,
  };
  var protoHooks = {
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
    97: '审核反馈',
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
    173: '收到组群消息回执',
    174: '收到频道消息',
    252: '收到服务器通知',
    254: '收到session info',
  };
  window.IMClientSDK = function (options) {
    if (options) {
      configs.isPoll = !!options.isPoll;
      configs.debug = !!options.debug;
      configs.sendBypoll = !!options.sendBypoll;
      configs.ip = options.ip || configs.ip;
      baseUrl = options.apiUrl || baseUrl;
      //代理地址可以配置
      urlConfig.proxy = options.proxyUrl || urlConfig.proxy;
      //轮询是否从最初开始

      //console.log(configs.ip,baseUrl);
      configs.appKey = options.appKey || configs.appKey;
      configs.pollbyZero = options.pollbyZero || configs.pollbyZero;
      configs.websocketOnly = options.websocketOnly || configs.websocketOnly;
      configs.privateModal = options.privateModal || configs.privateModal;

      //强制指定要代理
      if (options.proxy) {
        // true
        baseUrl = urlConfig.proxy;
      }
      if (!configs.ip || configs.isPoll === true) {
        currentParttern = parttern.polling;
      }
      util.log('baseUrl', baseUrl);
      util.log('websocketUrl', configs.ip);
      util.log('appKey', configs.appKey);
      util.log('websocketOnly', configs.websocketOnly);
      util.log('privateModal', configs.privateModal);
    }
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

    loadProto(init, function () {
      currentParttern = parttern.polling;
      init();
    });
  };
  var currentSocket = null,
    bufferLength = 0,
    readBuffer = null;
  var reconnectTimes = 4,
    hasAuthSuccess = true; //次
  var reconnetInterval = 2 * 1000; //s
  var websocketStrategy;

  function websocketStrategyCtr() {
    var me = {};
    me.start = function () {
      readBuffer = new ArrayBuffer(40960);
      connecting();
    };
    me.isStop = false;
    me.isReconnect = false;

    function reConnect() {
      util.log(reconnetInterval / 1000 + 's后开始重连...');
      setTimeout(connecting, reconnetInterval);
      me.isReconnect = true;
    }

    function connecting() {
      if (me.isStop) return;
      currentSocket && currentSocket.close();
      if (reconnectTimes <= 0) {
        if (currentParttern == parttern.polling) return; //说明已经启动了轮询
        util.log('已经重连3次,开始切换到轮询...');
        startLongpoll();
        return;
      }

      function onWebsocketOpen() {
        if (me.isStop) return;
        //如果Root还没有加载完 就需要等待
        //不然很快就会收到登录反馈，却不能解析
        eventManger.trigger('connected');
        me.isReconnect && eventManger.trigger('reConnected');

        util.log('成功启动', currentParttern);
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
        readBuffer = new ArrayBuffer(40960);
        eventManger.trigger('disconnected');
        msg.code != 1000 && reConnect();
      }

      function onWebsocketReceived(evt) {
        toContext(evt.data);
      }

      function onWebsocketError(err) {
        eventManger.trigger(
          'error',
          'websocket启动失败,原因:' + JSON.stringify(err)
        );
        if (reconnectTimes > 0) {
        } else {
          util.log('启动方式切换到轮询...');
          startLongpoll();
        }
      }

      //加入重连
      try {
        // console.log("configs.ip",configs.ip);
        currentSocket = new WebSocket(configs.ip, 'im');
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
      if (!configs.websocketOnly) reconnectTimes--;
    }

    function getChanelBuffer(channel, type) {
      var model = root.IM_Channel.create({
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
      var offset = 0;
      while (true) {
        if (offset >= bufferLength) {
          break;
        }
        var dv = new DataView(readBuffer);
        var len = dv.getInt16(offset, false);
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
        var protocol = dv.getUint8(2, false);
        try {
          var arBuf = new ArrayBuffer(len - 3);
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

    function socketMessageDispatcher(protocol, arBuf) {
      if (me.isStop) return;
      var buffer = decompress(arBuf);
      var obj = {};
      switch (protocol) {
        case 2: //  IMToken登陆反馈
          obj = root.IM_Feedback.decode(buffer);
          if (obj.ResultCode == 0) websocketStrategy.startHeart();
          break;
        case 174: // 频道普通消息
          obj = root.IM_ReceiveChannelMessage.decode(buffer);
          eventManger.trigger('messages', obj, protocol);
          // util.log(protocol, "收到频道消息", obj);
          break;
        case 172: // 组群消息
          obj = root.IM_ReceiveGroupMessage.decode(buffer);
          eventManger.trigger('groupMessages', obj, protocol);
          // util.log(protocol, "收到群组消息", obj);
          break;
        case 254: //
        case 161: //
        case 163: //
          obj = root.IM_Feedback.decode(buffer);

          eventManger.trigger('sendPrivateReceiptFeedback', obj);
          break;
        case 171: //
          obj = root.IM_ReceivePrivateReceipt.decode(buffer);
          break;
        case 253: //
          //  util.log(protocol, "登陆反馈", obj);
          obj = root.IM_Feedback.decode(buffer);
          if (obj.ResultCode == 0) {
            websocketStrategy.startHeart();
          }
          eventManger.trigger('imlogin', obj);
          break;
        case 224: //
          obj = root.IM_Feedback.decode(buffer);
          //util.log(protocol, "频道订阅反馈", obj);
          if (obj.ResultData) {
            eventManger.trigger('joinChannelSuccess', obj.ResultData);
            //if (me.isReconnect) {

            //}
          }
          break;
        case 167: //
          obj = root.IM_Feedback.decode(buffer);
          if (obj.ResultCode == 0) {
            eventManger.trigger('sendToChannelFeedback_success', obj);
          } else {
            eventManger.trigger('sendToChannelFeedback_fail', obj);
          }
          break;
        case 170: //
          obj = root.IM_ReceivePrivateMessage.decode(buffer);
          eventManger.trigger('privateMessages', obj, protocol);
          break;
        case protoCodes.serverNotice:
          obj = root.IM_ServerNotice.decode(buffer);
          //说明有离线消息
          // 启动离线轮询
          if (obj.Category == 1) {
            starOfflinepoll();
          }
          break;
        case 101: // 撤回消息
          obj = root.IM_ReceiveRecallMsg.decode(buffer);
          eventManger.trigger('recallMessages', obj, protocol);
        // util.log(protocol, "收到撤回消息", obj);
        case 97: // 撤回消息
          obj = root.IM_AuditFeedback.decode(buffer);
          eventManger.trigger('auditFeedback', obj, protocol);
          // util.log(protocol, "收到撤回消息", obj);
          break;
      }
      eventManger.trigger('allMessages', obj, protocol);
      util.log('收到协议', protocol, protoHooks[protocol], obj);
    }

    //将ut8Array转成字符串
    function toBuffer(protocol, buffer) {
      var newBuff = new ArrayBuffer(buffer ? buffer.byteLength + 3 : 3);
      var dv = new DataView(newBuff);
      dv.setInt16(0, newBuff.byteLength, false);
      dv.setInt8(2, protocol, false);
      if (buffer) {
        var byteBuff = new Uint8Array(newBuff);
        var temp = new Uint8Array(buffer);
        for (var i = 0; i < buffer.byteLength; i++) {
          byteBuff[i + 3] = temp[i];
        }
      }
      return newBuff;
    }

    function copyTo(source, start, destination, offset, length) {
      var s = new Uint8Array(source, start, length);
      var d = new Uint8Array(destination, offset, length);
      for (var i = 0; i < length; i++) {
        d[i] = s[i];
      }
    }

    function decompress(buffer) {
      var compressed = new Zlib.Gunzip(new Uint8Array(buffer));
      var res = compressed.decompress();
      return res;
    }

    me.loginByIMToken = function (uid, token, device, version) {
      var model = root.IM_LoginToken.create({
        UserID: uid,
        Token: token,
        Device: device,
        Version: version,
        Appkey: configs.appKey,
      });
      var imToken = root.IM_LoginToken.encode(model).finish();
      me.sendBuffer(protoCodes.login, imToken);
    };
    me.reset = function () {
      me.sendBuffer(protoCodes.reset);
    };
    //实际为监听这个频道
    me.joinChannel = function (channel, type) {
      var ch = getChanelBuffer(channel, type);
      me.sendBuffer(protoCodes.joinChannel, ch);
    };
    me.exitChannel = function (channel) {
      var ch = getChanelBuffer(channel, 0);
      me.sendBuffer(protoCodes.exitChannel, ch);
    };
    var cacheArgs;
    me.sendToChannel = function (ch, content, protocol, success, fail) {
      if (me.isStop) return;
      if (!ch) {
        util.log('channlid不能为空');
        util.triggerCallback(fail, 'channelId不能为空');
        return;
      }
      cacheArgs = arguments;
      var model = {
        Seq: new Date().getTime(),
        ChannelID: ch,
        ContentType: 1,
        Content: content,
        Persist: protocol !== 200,
      };
      var errMsg = root.IM_SendChannelMessage.verify(model);
      if (errMsg) {
        util.triggerCallback(fail, '模型验证错误');
        throw Error(errMsg);
      }
      var message = root.IM_SendChannelMessage.create(model);
      var buffer = root.IM_SendChannelMessage.encode(message).finish();
      me.sendBuffer(protoCodes.sendToChannel, buffer, success, fail);
    };

    me.sendMessage = function (rid, content, ack, persist, success, fail) {
      if (me.isStop) return;
      var model = {
        Seq: new Date().getTime(),
        ReceiverID: rid,
        Content: content,
        Ack: !!ack,
        Persist: !!persist,
      };
      var errMsg = root.IM_SendPrivateMessage.verify(model);
      if (errMsg) {
        util.triggerCallback(fail, '模型验证错误');
        throw Error(errMsg);
      }
      var message = root.IM_SendPrivateMessage.create(model);
      var buffer = root.IM_SendPrivateMessage.encode(message).finish();
      me.sendBuffer(protoCodes.sendPrivateMessage, buffer, success, fail);
    }; //todo 这下面几个还没和api对应
    me.sendGroupMessage = function (
      groupId,
      content,
      ack,
      persist,
      fail,
      success
    ) {
      if (me.isStop) return;
      var model = {
        Seq: new Date().getTime(),
        GroupID: groupId,
        Content: content,
        Ack: !!ack,
        Persist: !!persist,
      };
      var errMsg = root.IM_SendGroupMessage.verify(model);
      if (errMsg) {
        util.triggerCallback(fail, '模型验证错误');
        throw Error(errMsg);
      }
      var message = root.IM_SendGroupMessage.create(model);
      var buffer = root.IM_SendGroupMessage.encode(message).finish();
      me.sendBuffer(protoCodes.sendToGroupMessage, buffer, success, fail);
    };
    me.sendGroupReceipt = function (seq, receiptType, msgId, fail, success) {
      if (me.isStop) return;
      var model = { Seq: seq, IM_ReceiptType: receiptType, MsgID: msgId };
      var errMsg = root.IM_SendGroupReceipt.verify(model);
      if (errMsg) {
        util.triggerCallback(fail, '模型验证错误');
        throw Error(errMsg);
      }
      var message = root.IM_SendGroupReceipt.create(model);
      var buffer = root.IM_SendGroupReceipt.encode(message).finish();
      me.sendBuffer(protoCodes.IM_SendGroupReceipt, buffer, success, fail);
    };
    me.logout = function () {
      me.sendBuffer(protoCodes.logout);
    };

    var heartTime;
    me.startHeart = function () {
      if (me.isStop) return;
      clearTimeout(heartTime);
      heartTime = setTimeout(function () {
        me.sendBuffer(protoCodes.hearts);
        if (currentSocket && currentSocket.readyState == WebSocket.OPEN) {
          me.startHeart();
        }
      }, 60 * 1000);
    };

    //ReceiptType 0 已收回执，1已读回执
    me.sendPrivateReceipt = function (msgId, rId, type) {
      if (me.isStop) return;
      var seq = Math.floor(Math.random() * (9999 - 1000)) + 1000;
      var model = {
        Seq: seq,
        ReceiptType: type || 0,
        MsgID: msgId,
        ReceiverID: rId,
      };
      var message = root.IM_SendPrivateReceipt.create(model);
      var buffer = root.IM_SendPrivateReceipt.encode(message).finish();
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
        currentSocket.send(toBuffer(protocol, msg));
        util.triggerCallback(success);
      } else {
        reConnect();
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

  var util = {
    triggerCallback: function (fun) {
      var args = Array.prototype.slice.call(arguments, 1);
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
    log: function () {
      //debug才打印日志
      configs.debug && console.log.apply(null, arguments);
    },
    error: function () {
      //debug才打印日志
      configs.debug && console.error.apply(null, arguments);
    },
    info: function () {
      //debug才打印日志
      configs.debug && console.info.apply(null, arguments);
    },
    //用于计算耗时
    Timer: {
      data: {},
      start: function (key) {
        util.Timer.data[key] = new Date();
      },
      stop: function (key) {
        var time = util.Timer.data[key];
        if (time) util.Timer.data[key] = new Date() - time;
      },
      getTime: function (key) {
        return util.Timer.data[key] + 'ms';
      },
    },
    device: function () {
      var inBrowser = typeof window !== 'undefined';
      var UA = inBrowser && window.navigator.userAgent.toLowerCase();
      var isIE = UA && /msie|trident/.test(UA);
      var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
      var isEdge = UA && UA.indexOf('edge/') > 0;
      var isAndroid = UA && UA.indexOf('android') > 0;
      var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
      var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

      if (isAndroid) return 'Android';
      if (isIOS) return 'IOS';
      return 'PC';
    },
  };

  //1001 token过期 需要重新再拿
  var pollingStrategy = (function () {
    var me = {};
    me.start = function () {
      eventManger.trigger('connected');
    };
    me.loginByIMToken = function () {
      //imapi 没有提供这个方法
      hasAuthSuccess = true;
    };
    me.logout = function () {
      me.userLeave();
      clearInterval(pollmessage);
    };
    me.userEnter = function (channel, device, callback) {
      var ch = channel || channelId;
      me.httpRequest(
        urlConfig.userEnter(),
        JSON.stringify({
          channelID: ch,
          device: device,
        }),
        callback
      );
    };
    me.joinPriventmsg = function (receiveid) {
      setInterval(function () {
        loopBysenderId(1, receiveid);
      }, 1000);
    };
    me.joinChannel = function (channel) {
      channelId = channel || channelId;
      //避免重复启动
      if (!channelId) util.log('channelId不存在!');

      if (channelId == currentPollChannel) return;

      maxId = 0;
      //这是频道模式的走法
      if (configs.pollbyZero) {
        me.pollmessageInterval();
      } else {
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
    me.pollmessageInterval = function () {
      clearInterval(pollmessage);
      pollmessage = null;
      pollmessage = setInterval(function () {
        me.getMessage(channelId, maxId); //channel.toString(), maxId
      }, loopInterval);
    };
    me.getMaxIndex = function (channel, callback, fail) {
      var ch = channel || channelId;
      if (!ch) return;
      var data = {
        channelID: ch,
      };
      me.httpRequest(
        urlConfig.getMsgMaxIndex(),
        JSON.stringify(data),
        function (res) {
          util.triggerCallbackbyresult(res, callback, fail);
        },
        fail
      );
    }; //私信
    me.sendMessage = function (receiveId, msg, persist, success, fail) {
      me.httpRequest(
        urlConfig.sendMessage(),
        JSON.stringify({
          receiverID: receiveId,
          msgContent: msg,
          contentType: 1,
          persist: persist || true,
        }),
        success,
        fail
      );
    };
    //频道消息
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
      loopInterval = 1 * 1000;
      me.pollmessageInterval();
      var content = JSON.stringify({
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
      var ch = channel || channelId;
      if (!ch || currentParttern == parttern.websocket || me.isStop) {
        clearInterval(pollmessage);
        return;
      }
      var data = {
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
          util.log('pollmessages', result);
          if (result.result) eventManger.trigger('pollmessages', result);
        };
      }
      me.httpRequest(
        urlConfig.getMessageListByIndex(),
        JSON.stringify(data),
        callback
      );
    };

    me.getRefreshToken = function (success, fail) {
      if (!refreshToken) return;
      if (refreshTokenNum >= 3) {
        var data = {
          result: -1,
          message: '刷新token已经失败3次了',
        };
        util.triggerCallback(fail, data);
        eventManger.trigger('refreshTokenFail', accessToken);
        clearInterval(refreshTokenTimer);
        return;
      }
      pollingStrategy.RefreshToken(
        refreshToken,
        accessToken,
        function (res) {
          util.log('刷新token success');
          if (res.result == 1) {
            refreshToken = res.data.RefreshToken;
            accessToken = res.data.Token;
            refreshToken = res.data.RefreshToken;
            imUserID = res.data.IMUserID;
            eventManger.trigger('refreshToken', accessToken);
          } else {
            util.log('刷新token fail'); // 如果失败了3次，给用户提示
            refreshTokenNum++;
            me.getRefreshToken(success, fail);
          }
        },
        function (res) {
          util.log(res);
        }
      );
    };
    me.refreshTokenNow = function (success, fail) {
      if (!refreshToken) return;
      pollingStrategy.RefreshToken(
        refreshToken,
        accessToken,
        function (res) {
          util.log('刷新token success');
          if (res.result == 1) {
            refreshToken = res.data.RefreshToken;
            accessToken = res.data.Token;
            refreshToken = res.data.RefreshToken;
            imUserID = res.data.IMUserID;
            eventManger.trigger('refreshToken', accessToken);
          } else {
            util.log('token不合法或者必填值为空~');
            refreshTokenNum++;
            pollingStrategy.getRefreshToken(success, fail);
          }
        },
        function (res) {
          util.log('刷新token fail');
        }
      );
    };
    me.feedback = function (receiveData) {
      var reqData = {
        receipts: receiveData,
        type: 0,
      };
      me.httpRequest(
        urlConfig.OfflineMessageReceipt(),
        JSON.stringify(reqData),
        function (data) {},
        function (res) {}
      );
    };
    me.getUserOfflineMsg = function (index, senderId, callback) {
      //int pageIndex, int pageSize
      me.httpRequest(
        urlConfig.GetUserOfflineMsg(),
        JSON.stringify({
          pageIndex: index,
          senderID: senderId,
        }),
        callback
      );
    };
    me.getAllOfflineMsg = function (success, fail) {
      me.httpRequest(urlConfig.GetAllOfflineMsg(), '', success, fail);
    };
    me.RefreshToken = function (ref, oldToken, success, fail) {
      util.log('3==-------------:' + urlConfig.RefreshToken());
      var tokenUrl = urlConfig.RefreshToken().replace('imapis', 'imtoken');
      me.httpRequest(
        tokenUrl,
        JSON.stringify({ refreshToken: ref, oldToken: oldToken }),
        success,
        fail
      );
    };
    me.otherLoginAuth = function (a, b, c, d, e, f, suc, fal) {
      var data = JSON.stringify({
        NickName: a,
        Version: b,
        UserID: c,
        AppKey: d,
        AppSecret: e,
        Device: f,
      });
      me.httpRequest(urlConfig.OtherLoginAuth(), data, suc, fal);
    };
    me.anonymousUser = function (a, b, c, d, e, f, success, fail) {
      var data = JSON.stringify({
        NickName: a,
        Version: b,
        IMUserID: c,
        AppKey: d,
        AppSecret: e,
        Device: f,
        SourceType: 4,
      });
      me.httpRequestNoHeader(urlConfig.AnonymousUser(), data, success, fail);
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
        var msg = {
          imageName: fileName,
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
      if (hasHeader && !accessToken) {
        return; //空的token不能发送
      }
      type = type || 'post';
      var xhr = new XMLHttpRequest();
      xhr.open(type, url, true);
      //xhr.setRequestHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin");

      if (hasHeader) {
        xhr.setRequestHeader('imUserID', imUserID);
        xhr.setRequestHeader('accessToken', accessToken);
      }
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            try {
              var res = fixMsgId(xhr.responseText);
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
      var res = JSON.parse(str);
      if (res.count && res.data) {
        var reg = /"MsgID":(.*?),/g;
        var arr = [];
        str.replace(reg, function (id) {
          var raw = id.split(':')[1].split(',')[0];
          arr.push(raw);
        });
        var items = res.data;
        for (var i = 0; i < items.length; i++) {
          items[i].MsgID = arr[i];
        }
      }
      return res;
    }

    return me;
  })();

  function init() {
    if (window.WebSocket && !!ArrayBuffer && !websocketStrategy) {
      websocketStrategy = websocketStrategyCtr();
      _core[parttern.websocket] = websocketStrategy;
    }
    _core[parttern.polling] = pollingStrategy;
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

  //----------------共有方法--------------------

  //IMClientSDK.prototype.start = function () {
  //    util.log("正在启动...", currentParttern);
  //    currentStrategy.start();
  //};
  /**
   *  RefreshToken,第一次进来，就应该主动去刷新一次；后面，才每隔8分钟，刷新一次；
   *
   */

  var hasAuth = false;
  var refreshTokenTimer = null;
  var refreshTokenNum = 0;
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
    currentStrategy.loginByIMToken(uid, token, device, version);
    hasAuth = true;

    //需要不断定时刷新token
    refreshTokenTimer = setInterval(function () {
      // pollingStrategy.refreshTokenNow(success, fail);
      if (!refreshToken) return;
      pollingStrategy.RefreshToken(
        refreshToken,
        accessToken,
        function (res) {
          util.log('刷新token success');
          if (res.result == 1) {
            refreshToken = res.data.RefreshToken;
            accessToken = res.data.Token;
            refreshToken = res.data.RefreshToken;
            imUserID = res.data.IMUserID;
            eventManger.trigger('refreshToken', accessToken);
          } else {
            util.log('token不合法或者必填值为空~');
            refreshTokenNum++;
            pollingStrategy.getRefreshToken(success, fail);
          }
        },
        function (res) {
          util.log('刷新token fail');
        }
      );
    }, 8 * 60 * 1000); //8 * 60 * 1000
  };

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
  IMClientSDK.prototype.reset = function () {
    currentStrategy.reset();
  };
  IMClientSDK.prototype.joinChannel = function (channel, type) {
    if (channel == currentPollChannel) return;
    channelId = channel;
    //对于WebSocket方式，认证之后才能joinchannel  但轮询就不需要
    if ((currentParttern == parttern.websocket && !hasAuth) || !channel) return;
    var device = util.device();
    pollingStrategy.userEnter(channelId, device, function () {
      currentStrategy.joinChannel(channel, type);
      util.log('joinChannel', channel);
    });
  };
  IMClientSDK.prototype.joinPriventmsg = function (receiveid) {
    currentParttern == parttern.polling &&
      pollingStrategy.joinPriventmsg(receiveid);
  };
  IMClientSDK.prototype.exitChannel = function (channel) {
    currentParttern == parttern.websocket &&
      websocketStrategy.exitChannel(channel);
  };
  IMClientSDK.prototype.userEnter = function (channel) {
    currentParttern == parttern.websocket && pollingStrategy.userEnter(channel);
  };
  IMClientSDK.prototype.logout = function () {
    currentStrategy.logout();
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
  IMClientSDK.prototype.sendPrivateMessage = function (a, b, p, c, d) {
    if (configs.sendBypoll) {
      //因为WebSocket不给发送者推消息，发送者得不到消息的时间
      pollingStrategy.sendMessage(a, b, p, c, d);
    }
  };
  IMClientSDK.prototype.startHeart = function () {
    currentStrategy.startHeart();
  };
  IMClientSDK.prototype.feedback = function (receiveData, success, fail) {
    currentStrategy.feedback(receiveData, success, fail);
  };
  IMClientSDK.prototype.sendPrivateReceipt = function (msgId, rid, type) {
    currentParttern == parttern.websocket &&
      websocketStrategy.sendPrivateReceipt(msgId, rid, type);
  };

  //----------------longpollOnly--------------------
  IMClientSDK.prototype.getUserOfflineMsg = function (
    index,
    senderId,
    callback
  ) {
    pollingStrategy.getUserOfflineMsg(index, senderId, callback);
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
  IMClientSDK.prototype.sendMessage = function (a, b, p, c, d) {
    if (currentParttern == parttern.polling) {
      pollingStrategy.sendMessage(a, b, p, c, d);
    } else {
      websocketStrategy.sendMessage(a, b, !0, p, c, d);
    }
  };
  //最长8秒，最短1秒
  var saveTimes = 1;

  function fixloopTime(mid) {
    if (mid == maxId) {
      saveTimes++;
      if (saveTimes > 4) {
        saveTimes = 4;
        return;
      }
      loopInterval = saveTimes * 1000;
    } else {
      // util.log("loopInterval恢复");
      loopInterval = 1 * 1000;
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
    //频道模式才去joinchannel
    if (!configs.privateModal) pollingStrategy.joinChannel();
  }

  //先调用所有的
  //然后获取到senderId之后  逐个轮询
  var maxSenderId = [];

  function starOfflinepoll() {
    //1.拉不拉 私信 取决于WebSocket的消息。 那么轮询的时候 就要循环这个方法 但是目前客服用不到，做的叮咚也用不到，因为默认是chrome内核。这个问题先不管
    //流程 收到WebSocket消息 -- getall（得到所有的senderId 但只拉取了1页）-- 然后再调用getUserofflineMsg 拉完
    pollingStrategy.getAllOfflineMsg(
      function (data) {
        if (data.result == 1 && data.count > 0) {
          for (var i = 0; i < data.count; i++) {
            var itemarr = data.data[i].Content;
            util.log('离线消息', data.data[i]);
            //分两个方法很蛋疼，
            //就用这一个处理就行
            //反正也要保持不断的轮询 确保后续的消息能收到
            for (var j = 0; j < itemarr.length; j++) {
              var item = itemarr[j];
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
      },
      function (res) {
        util.log(res);
      }
    );
  }

  // 通过senderId来循环获取离线消息，发送接收回执并显示消息;
  function loopBysenderId(index, senderId) {
    pollingStrategy.getUserOfflineMsg(index, senderId, function (data) {
      if (data.result == 1) {
        var count = data.data.Content.length;
        var listarr = [];
        for (var i = 0; i < count; i++) {
          var list = {
            ReceiptType: '1',
            GroupID: '',
            MsgID: data.data.Content[i].MsgID,
            ReceiveUserID: senderId,
          };
          listarr.push(list);
          pollingStrategy.feedback(listarr);
          eventManger.trigger('privateMessages', data.data.Content[i]);
        }

        if (data.data.Content.length != 0) {
          //index +1 再去捞一次 捞完为止
          setTimeout(function () {
            loopBysenderId(index + 1, senderId);
          }, 1000);
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
    clearInterval(pollmessage);
    pollmessage = null;
    util.log('外部调用了stop');
  };
  //----------------websocketOnly--------------------

  //给外部绑定事件
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
  IMClientSDK.prototype.otherLoginAuth = function (
    name,
    uid,
    appkey,
    appsecret,
    device,
    s,
    f
  ) {
    pollingStrategy.otherLoginAuth(name, uid, appkey, appsecret, device, s, f);
  };
  IMClientSDK.prototype.anonymousUser = function (
    name,
    version,
    imUserid,
    appkey,
    appsecret,
    device,
    s,
    f
  ) {
    pollingStrategy.anonymousUser(
      name,
      version,
      imUserid,
      appkey,
      appsecret,
      device,
      s,
      f
    );
  };
  var eventManger = {
    cached: {},
    handlers: {},
    //类型,绑定事件
    addHandler: function (type, handler) {
      if (typeof handler !== 'function') return;

      if (typeof this.handlers[type] == 'undefined') {
        this.handlers[type] = [];
      }
      this.handlers[type].push(handler);

      if (this.cached[type] instanceof Array) {
        //说明有缓存的 可以执行
        handler.apply(null, this.cached[type]);
      }
    },
    removeHandler: function (type, handler) {
      var events = this.handlers[type];
      for (var i = 0, len = events.length; i < len; i++) {
        if (events[i] == handler) {
          events.splice(i, 1);
          break;
        }
      }
    },
    trigger: function (type) {
      //如果有订阅的事件，这个时候就触发了
      if (this.handlers[type] instanceof Array) {
        var handlers = this.handlers[type];
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, len = handlers.length; i < len; i++) {
          handlers[i].apply(null, args);
        }
      }
      //默认缓存 支持先触发后订阅
      this.cached[type] = Array.prototype.slice.call(arguments, 1);
    },
  };
  Date.prototype.Format = function (fmt) {
    var o = {
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
    for (var k in o)
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
