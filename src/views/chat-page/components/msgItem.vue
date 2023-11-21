<!--
 * @Date: 2023-07-28 15:20:33
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-13 18:01:05
 * @descript: 文件描述
-->
<template>
  <div :class="computedClass" class="messageItemCon">
    <a-avatar :size="34" :imageUrl="getAvatar(msgObj)"
      v-if="[101, 102, 103, 105].includes(msgObj.contentType)"></a-avatar>
    <div class="msgContain">
      <p class="timeTitle" v-if="showTime">
        {{
          formatTimeToStr(msgObj.sendDateTime)
        }}
      </p>
      <div class="msgContent textCon" v-if="[101, 105].includes(msgObj.contentType)">
        <MsgQuto :qutoObj="msgObj.content" v-if="msgObj.content.citationContent"></MsgQuto>
        <p v-html="computedMsg" @click="msgClick($event, msgObj)" @contextmenu="rightContext($event, msgObj)"></p>
        <span class="statusCon" :class="statusClass[msgObj.msgStatus]"></span>
      </div>
      <div class="msgContent imgCon" v-if="msgObj.contentType === 102">
        <!-- v-html="msgObj.content.content" -->
        <p :title="msgObj.content.fileName" @click="msgClick($event, msgObj)" @contextmenu="rightContext($event, msgObj)">
          <!-- <img :src="msgObj.content.Text" alt="" /> -->
          <a-image style="max-width: 100%;" :src="msgObj.content.Text" :fit="'contain'" />
        </p>
        <!-- <span class="downLoadBtn" title="下载图片" @click="downloadIamge(msgObj)" v-show="msgObj.content.Text">
          <icon-to-bottom />
        </span> -->
        <span class="statusCon" :class="statusClass[msgObj.msgStatus]"></span>
      </div>
      <!-- 视频 -->
      <div class="msgContent videoCon" v-if="msgObj.contentType === 103" @click="msgClick($event, msgObj)">
        <p :title="msgObj.content.fileName" @click="msgClick($event, msgObj)" @contextmenu="rightContext($event, msgObj)">
          <video controls :poster="msgObj.content.videoPicUrl" style="width: 100%;max-height: 300px;">
            <source :src="msgObj.content.Text" type="video/mp4" />
            无法播放
          </video>
        </p>
        <span class="downLoadBtn" title="独立窗口打开" @click="openNewTab(msgObj)" v-show="msgObj.content.Text">
          <icon-rotate-right />
        </span>
        <span class="statusCon" :class="statusClass[msgObj.msgStatus]"></span>
      </div>
      <div class="msgContent tipsCon" v-if="[903].includes(msgObj.contentType)">
        <p>{{ msgObj.replaceMsg }}</p>
      </div>
      <div class="msgContent tipsCon" v-if="[104].includes(msgObj.contentType)">
        <p>{{ formatChatTime(msgObj.sendDateTime) }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue';
import { useAppStore, useUserStore, useComStore } from '@/store';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { Message, Modal } from '@arco-design/web-vue';
import { Pagination, Options, AnyObject } from '@/types/global';
import { transferTxtToEmotion, formatChatTime, copyText, downloadImgFromLink, formatDate } from '@/utils/tools';
import { BatchMessageApi, downLoadUserFile } from '@/api/batch-msg';
import { msgTypes, RealMsg } from '@/store/msgParse';
import MsgQuto from './msgQuto.vue';

const props = defineProps(['msgObj', 'showTime']);
const comStore = useComStore();
const userstore = useUserStore();

// //101文本消息 102图片消息 103视频消息 104时间提醒 105引用 903撤回
// const msgTypes = {
//   m_text: 101,
//   m_pic: 102,
//   m_video: 103,
//   m_time: 104,
//   m_quto: 105,
//   m_withdraw: 903,
// }
// 根据消息类型，设置几种样式
const statusClass: AnyObject = {
  1: 'sending',
  2: 'success',
  3: 'fail',
};

const getAvatar = (msg: RealMsg) => {
  if (msg.msgFrom === 1) {
    return comStore.currentAccount.accAvatar;
  } else if (msg.msgFrom === 0) {
    return comStore.currentUser.userAvatar;
  }
};

const computedClass = computed(() => {
  const msg = props.msgObj;
  if (msg.contentType == msgTypes.m_withdraw) {
    return 'tSystem';
  } else if (msg.contentType == msgTypes.m_time) {
    return 'tSystem';
  } else if (msg.msgFrom === 1) {
    return 'tStaff';
  } else if (msg.msgFrom === 0) {
    return 'tleft';
  } else {
    return 'tSystem';
  }
});
const getMsgClass = (msg: RealMsg) => {
  if (msg.contentType == msgTypes.m_withdraw) {
    return 'tSystem';
  } else if (msg.contentType == msgTypes.m_time) {
    return 'tSystem';
  } else if (msg.msgFrom === 1) {
    return 'tStaff';
  } else if (msg.msgFrom === 0) {
    return 'tleft';
  } else {
    return 'tSystem';
  }
};
const computedMsg = computed(() => {
  const msg = props.msgObj;
  let newContent = msg.content.Text || '';
  if ([101, 105].includes(msg.contentType)) {
    newContent = transferTxtToEmotion(newContent);
  }
  return newContent;
});

const formatMsg = (msg: RealMsg) => {
  let newContent = msg.content.Text;
  if ([101, 105].includes(msg.contentType)) {
    newContent = transferTxtToEmotion(newContent);
  }
  return newContent;
};
const formatTimeToStr = (time: number) => {
  return formatDate(time, 'yyyy/mm/dd hh:mm:ss');
}
const rightContext = (e: any, msgObj: RealMsg) => {
  // 根据消息类型，以及发送时间 是否展示，撤回，复制功能
  const options = [
    {
      menuText: '引用',
      callBack: function () {
        return quto(msgObj);
      },
    },
  ];
  // 撤回两分钟内的
  if (
    msgObj.sendDateTime + 120 * 1000 > new Date().getTime() &&
    msgObj.msgFrom == 1
  ) {
    options.push({
      menuText: '撤回',
      callBack: function () {
        return withDrawMsg(msgObj);
      },
    });
  }
  // 文本可复制
  if (msgObj.contentType === 101 || msgObj.contentType === 105) {
    options.push({
      menuText: '复制',
      callBack: function () {
        return copyStr(msgObj);
      },
    });
  }

  window?.$rightClick(e, options);
  e.preventDefault();
  e.stopPropagation();
};
const msgClick = (e: any, msgItem: RealMsg) => { };

const downloadIamge = (msgItem: RealMsg) => {
  downloadImgFromLink(msgItem.content.Text)
};
const openNewTab = (msgItem: RealMsg) => {
  window.open(msgItem.content.Text)
};

const quto = (msg: RealMsg) => {
  let name = msg.msgFrom ? comStore.currentAccount.AccountName : comStore.currentUser.userName;
  const params = {
    citationNick: name, // 引用的昵称
    citationContentType: msg.contentType,
    citationContent: msg.content.Text, // 引用内容
    citationFileName: msg.content.fileName, // 引用文件名
    citationLocalCameraUri: msg.content.localCameraUri, // 引用文件的本地地址
    videoPicUrl: msg.content.videoPicUrl, // 引用视频的封面
  };
  console.log('->', params);
  comStore.currentUser.quto = params;
};
const copyStr = (msg: RealMsg) => {
  console.log('->', msg.content.Text);
  const txt = msg.content.Text;
  copyText(txt);
};

const withDrawMsg = (msg: RealMsg) => {
  console.log('->', msg);
  const params = {
    receiverID: msg.receiverId,
    msgID: msg.msgId,

    replaceMsg: `“${comStore.currentAccount.AccountName}” 撤回了一条消息`,
  };
  comStore.beforeWithdraw(params);
};
</script>

<style lang="less" scoped>
.messageItemCon {
  font-size: 16px;
  position: relative;
  min-height: 36px;
  margin: 10px 50px;
  color: #030303;

  &.tStaff {
    .arco-avatar {
      position: absolute;
      right: -45px;
      top: 0;
    }

    .msgContain {
      text-align: right;
    }

    .msgContent.textCon {
      background-color: #28da10;
      border-color: #1eff00;
    }
  }

  &.tleft {
    .arco-avatar {
      position: absolute;
      left: -45px;
      top: 0;
    }

    .msgContain {
      text-align: left;
    }

    .msgContent.textCon {
      background-color: #fff;
      border: 1px solid #dbd8d8;
    }
  }

  &.tSystem {
    min-height: 26px;

    .msgContain {
      text-align: center;
      min-height: 26px;
    }

    .msgContent {
      max-width: 100%;
      font-size: 12px;
      color: grey;
      vertical-align: center;
      line-height: 14px;
    }
  }

  .msgContain {
    min-height: 36px;
  }

  .timeTitle {
    margin: 10px 0 5px;
    font-size: 12px;
    font-family: "Helvetica Neue";
    color: #817d7d;
  }

  .msgContent {
    display: inline-block;
    position: relative;
    margin-bottom: 0;
    font-weight: 400;
    white-space: normal;
    word-break: break-all;
    border-radius: 5px;
    vertical-align: middle;

    &.videoCon {
      max-width: 50%;
      text-align: center;
      cursor: pointer;

      &:hover .downLoadBtn {
        display: block;
        color: #ee7636;
      }

      .downLoadBtn {
        position: absolute;
        bottom: 0;
        right: 0;
        display: none;
        width: 20px;
        height: 20px;
        color: rgb(43, 42, 42);
        font-size: 24px;
      }
    }

    &.imgCon {
      max-width: 50%;
      cursor: pointer;

      :deep(.arco-image-img) {
        display: inline-block;
        max-width: 240px;
        max-height: 300px;
      }

      &:hover .downLoadBtn {
        display: block;
        color: #ee7636;
      }

      .downLoadBtn {
        position: absolute;
        bottom: 0;
        right: 0;
        display: none;
        width: 20px;
        height: 20px;
        color: rgb(43, 42, 42);
        font-size: 24px;
      }
    }

    &.textCon {
      max-width: 60%;
      text-align: left;
      padding: 5px 12px;
      line-height: 26px;
      white-space: pre-wrap;

      :deep(.emotion) {
        width: 24px;
        height: 24px;
        vertical-align: sub;
      }

      .fundCode {
        text-decoration: underline;
        color: rgb(64, 64, 241);
        cursor: pointer;
      }
    }

    img {
      max-height: 200px;
      max-width: 100%;
      border-radius: 5px;
      vertical-align: middle;
    }

    img.emotion {
      width: 24px;
      height: 24px;
    }

    .statusCon {
      position: absolute;
      top: 35%;
      left: -18px;
      width: 14px;
      height: 14px;

      &.sending {
        background: url('../../../assets/images/loading.gif');
        background-size: contain;
      }

      &.success {
        background: url('../../../assets/images/allbgs.png') no-repeat 0px -0;
      }

      &.fail {
        background: url('../../../assets/images/allbgs.png') no-repeat 0px -28px;
      }
    }
  }
}
</style>
