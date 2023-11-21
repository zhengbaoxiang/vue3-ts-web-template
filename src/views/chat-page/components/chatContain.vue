<!--
 * @Date: 2023-07-28 11:09:34
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-11 11:13:59
 * @descript: 文件描述
-->
<template>
  <div class="chatContain">
    <div class="content">
      <div class="headTitle">
        <span class="name bold">{{ currentUser.userName }}</span>
        <span class="text" style="font-size: 14px;margin-left: 10px;vertical-align:sub">{{
          `(UID:${currentUser.passportId})` }} {{ currentUser.isCanceled ? '【账号已注销】' : '' }}</span>
      </div>
      <div class="scrollConatin">
        <ul class="chatHistory" ref="scrollZoneRef">
          <li v-for="(item, idx) in msgList" :key="item.msgId" :id="item.msgId">
            <MsgItem :msgObj="item" :key="item.msgId"></MsgItem>
          </li>
        </ul>
      </div>
      <div class="userQuto" v-if="currentUser.quto">
        <span class="close" @click="clearQuto">
          <icon-close size="16" />
        </span>
        <MsgQuto :qutoObj="currentUser.quto"></MsgQuto>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted, watchEffect } from 'vue';
import { useAppStore, useUserStore, useComStore } from '@/store';
import { Message, Modal } from '@arco-design/web-vue';
import { Pagination, Options, AnyObject } from '@/types/global';
import MsgItem from './msgItem.vue';
import EventBus from '@/utils/eventBus';
import MsgQuto from './msgQuto.vue';

const comStore = useComStore();
const currentUser = computed(() => {
  return comStore.currentUser;
});

const msgList = computed(() => {
  return comStore.currentUser.recordList;
});

watch(comStore.currentUser.recordList, (newVal) => {
  console.log('-watch>');
});


const clearQuto = () => {
  comStore.currentUser.quto = null;
};

onMounted(() => {
  console.log('-chatContain_mounted>', 1)
  initEvent()
});


const initEvent = () => {
  let box: HTMLDivElement | null = document.querySelector(".scrollConatin");
  box?.addEventListener("scroll", function (e) {
    // 距顶部
    let scrollTop = e?.target['scrollTop'];
    if (scrollTop === 0) {
      console.log('-scrollTop>', scrollTop)
      const topMsg = msgList.value[0]
      if (!topMsg) return
      const msgIndexID = topMsg.msgIndexID ? topMsg.msgIndexID : 0
      comStore.scroll_get_his_msgLisg(comStore.currentUser, msgIndexID)
      const topMsgEle: HTMLElement | null = document.getElementById(topMsg.msgId)
      topMsgEle?.scrollIntoView()
    }
  })

  EventBus.on('scrollMsgList', (params: any) => {
    const { scroll, milliseconds } = params
    scrollToView(scroll, milliseconds);
  });
}
// 收到消息后，滚动消息列表至最底部
const scrollZoneRef = ref<HTMLUListElement | null>(null);
const scrollToView = (flag: boolean, milliseconds: number = 0) => {
  setTimeout(() => {
    const cr = scrollZoneRef.value?.getBoundingClientRect();
    if ((cr && cr.bottom < document.body.clientHeight) || flag) {
      // 滚动至最后一条消息
      const bottomMsg = msgList.value && msgList.value[msgList.value.length - 1]
      if (!bottomMsg) return
      const bottomMsgEle: HTMLElement | null = document.getElementById(bottomMsg.msgId)
      bottomMsgEle?.scrollIntoView()
    }
  }, milliseconds);
};
</script>
<style lang="less" scoped>
.chatContain {
  position: relative;

  .content {
    height: 100%;
    display: flex;
    flex-direction: column;

    .userQuto {
      max-height: 90px;
      background-color: #eaeeea;
      padding: 10px;
      position: relative;

      .close {
        cursor: pointer;
        position: absolute;
        right: 8px;
        top: 0;
        display: inline-block;
        width: 15px;
        height: 15px;
      }
    }

    .headTitle {
      height: 50px;
      padding: 10px 20px;

      span {
        display: inline-block;
        vertical-align: middle;
        font-size: 22px;
        height: 30px;
        line-height: 30px;
        vertical-align: middle;
      }

    }

    .scrollConatin {
      flex: 1;
      max-height: calc(100% - 50px);
      background-color: rgba(238, 234, 234, 0.5);
      overflow: auto;
      padding: 2px;

      .chatHistory {
        min-height: calc(100% - 100px);
        padding-bottom: 10px;
      }
    }
  }
}
</style>
