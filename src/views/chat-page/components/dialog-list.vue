<!--
 * @Date: 2023-07-28 11:09:34
 * @LastEditors: zbx
 * @LastEditTime: 2023-08-30 13:05:33
 * @descript: 文件描述
-->
<template>
  <div class="chatListCon">
    <div class="search mb10">
      <a-input-search v-model="keyword" :placeholder="'搜索本地用户'" allow-clear @search="searchUser" />
    </div>
    <ul class="list" id="listId">
      <li class="listItem"
        :class="[currentUser.passportId === item.passportId ? 'current' : '', item.isSetTop ? 'topClass' : '']"
        v-for="item in chatList" :key="item.passportId" @click="chatClick(item)"
        @contextmenu="rightContext($event, item)">
        <div class="nameCircle">
          <a-avatar :size="40" :imageUrl="item.userAvatar"></a-avatar>
          <a-badge :count="item.unread" class="unread" :dot="item.isNotDisturbed" v-show="item.unread">
          </a-badge>
          <a-badge :count="1" class="islater" dot :dotStyle="{ height: '12px', width: '12px' }" v-show="item.islater">
          </a-badge>

        </div>
        <div class="userInfo">
          <p class="nameTitle">
            <span class="name">{{ item.userName }}</span>
            <span class="messageTime"> {{ item.sendDateTimeStr }}</span>
          </p>
          <p class="message">
            {{ item.newestMsgTxt }}
          </p>
          <icon-notification-close v-if="item.isNotDisturbed" class="notifyIcon" />
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, computed, reactive } from 'vue';
import { useAppStore, useUserStore, useComStore } from '@/store';
import { Message, Modal } from '@arco-design/web-vue';
import { Pagination, Options, AnyObject, UserInfo } from '@/types/global';
import { ChatListApi } from '@/api/chat-list';
const comStore = useComStore();

const keyword = ref('');

const currentUser = computed(() => {
  return comStore.currentUser;
});

const chatList = computed(() => {
  return comStore.getChatListByKey(keyword.value);
});

const searchUser = (key: string) => {
  console.log('-过滤>', key);
  keyword.value = key
};

const chatClick = (user: UserInfo) => {
  comStore.set_currentUser(user);
};
const rightContext = (e: any, user: UserInfo) => {
  const options = [
    {
      menuText: user.isSetTop ? '取消置顶' : '置顶',
      callBack: function () {
        return setTop(user);
      },
    },
    {
      menuText: user.islater ? '取消稍后再读' : '稍后再读',
      callBack: function () {
        return setLaterRead(user);
      },
    },
    {
      menuText: user.isNotDisturbed ? '开启提醒' : '消息免打扰',
      callBack: function () {
        return setNotDisturbed(user);
      },
    },
    {
      menuText: '不显示该聊天',
      callBack: function () {
        return deleteChat(user);
      },
    },
  ];
  // 有未读消息，则无法设置稍后再读
  if (user.unread) {
    options.splice(1, 1)
  }
  window?.$rightClick(e, options);
  e.preventDefault();
  e.stopPropagation();
};

const setTop = async (user: UserInfo) => {
  comStore.setTop(user);
};
const setLaterRead = async (user: UserInfo) => {
  comStore.setLaterRead(user);
};
const setNotDisturbed = (user: UserInfo) => {
  comStore.setNotDisturbed(user);
};
const deleteChat = (user: UserInfo) => {
  comStore.del_dialogue(user);
};
</script>
<style lang="less" scoped>
.chatListCon {
  height: 100%;
  padding: 0 2px;
}

.list {
  height: calc(100% - 50px);
  overflow: auto;

  // border-top: 0.5px solid rgb(201, 198, 198);
  .listItem {
    position: relative;
    height: 60px;
    padding: 10px 0px;
    border-top: 0.5px solid rgb(201, 198, 198);
    border-left: 3px solid #fff;

    &.topClass {
      background-color: rgba(223, 222, 222, 0.6);
    }

    &:hover {
      background-color: rgba(235, 235, 235, 0.5);
    }

    &.current {
      background-color: rgba(241, 203, 177, 0.5);
      border-left: 3px solid #ff6600;
    }

    &.current:hover {
      background-color: rgba(241, 203, 177, 0.5);
      border-left: 3px solid #ff6600;
    }


    .nameCircle {
      margin: 0 15px 0 5px;
      display: inline-block;
      vertical-align: middle;
      position: relative;

      .unread {
        position: absolute;
        display: inline-block;
        width: 18px;
        height: 18px;
        top: -8px;
        right: -4px;
        text-align: right;
      }

      .islater {
        position: absolute;
        display: inline-block;
        width: 18px;
        height: 18px;
        top: -8px;
        left: -4px;
        text-align: left;
      }
    }

    .userInfo {
      display: inline-block;
      vertical-align: middle;
      width: calc(100% - 65px);
      height: 100%;
      position: relative;

      .nameTitle {
        position: relative;
        height: 20px;

        .name {
          font-size: 14px;
          height: 20px;
        }

        .messageTime {
          font-size: 12px;
          color: grey;

          position: absolute;
          right: 0px;
          top: 0px;
        }
      }

      .message {
        margin-top: 5px;
        width: 90%;
        height: 16px;
        font-size: 12px;
        color: grey;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .notifyIcon {
        position: absolute;
        right: 10px;
        top: 20px;
      }
    }
  }
}
</style>
