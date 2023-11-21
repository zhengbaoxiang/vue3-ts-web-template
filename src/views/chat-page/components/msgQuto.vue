<template>
  <div class="qutoCon">
    <p class="qutoName">{{ qutoObj.citationNick }}：</p>
    <div class="msgContain">
      <div class="msgContent textCon" v-if="[101, 105].includes(qutoObj.citationContentType)">
        <p v-html="formatMsg(qutoObj)"></p>
      </div>
      <div class="msgContent imgCon" v-if="qutoObj.citationContentType === 102">
        <p :title="qutoObj.citationFileName" @click="openNewTab(qutoObj)" style="cursor: pointer">
          <img :src="qutoObj.citationContent" alt="" />
        </p>
      </div>
      <!-- 视频 -->
      <div class="msgContent fileCon" v-if="qutoObj.citationContentType === 103">
        <p :title="qutoObj.citationFileName" @click="openNewTab(qutoObj)" style="cursor: pointer">
          [视频] {{ qutoObj.citationFileName || '' }}
        </p>
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
import { getToken, setToken, transferTxtToEmotion } from '@/utils/tools';
import { BatchMessageApi, downLoadUserFile } from '@/api/batch-msg';
import { RealMsg } from '@/store/msgParse';

const props = defineProps(['qutoObj']);
const userstore = useUserStore();
const comStore = useComStore();
const currentUser = computed(() => {
  return comStore.currentUser;
});
// //101文本消息 102图片消息 103视频消息 104时间提醒 105引用 903撤回
// const msgTypes = {
//   m_text: 101,
//   m_pic: 102,
//   m_video: 103,
//   m_quto: 105,
// }
const formatMsg = (qutoObj: AnyObject) => {
  let newContent = qutoObj.citationContent;
  if ([101, 105].includes(qutoObj.citationContentType)) {
    newContent = transferTxtToEmotion(newContent);
  }
  return newContent;
};
const openNewTab = (qutoObj) => {
  window.open(qutoObj.citationContent)
};
</script>
<style lang="less" scoped>
.qutoCon {
  position: relative;
  padding-left: 10px;
  border-left: 2px solid grey;
  // height: 100%;
  font-size: 14px;
  color: grey;

  .qutoName {
    height: 18px;
  }

  .msgContain {
    text-align: left;
    padding: 5px 0;
    min-height: 25px;

    .msgContent {
      white-space: normal;
      word-break: break-all;

      &.textCon {
        width: 99%;

        p {
          height: 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        :deep(.emotion) {
          width: 24px;
          height: 24px;
          vertical-align: sub;
        }
      }

      &.imgCon {
        max-width: 99%;
      }

      &.fileCon {
        max-width: 99%;
        text-align: left;
      }

      img {
        max-height: 50px;
        max-width: 100%;
        border-radius: 5px;
        vertical-align: middle;
      }

      img.emotion {
        width: 14px;
        height: 14px;
      }
    }
  }
}

.messageItemCon .textCon {
  width: 99%;

  p {
    white-space: wrap !important;
    height: 100% !important;
  }
}
</style>
