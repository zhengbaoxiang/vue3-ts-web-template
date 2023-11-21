<!--
 * @Date: 2023-07-28 11:09:34
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-25 17:58:57
 * @descript: 文件描述
-->
<template>
  <div class="inputCon">
    <div class="toolBar">
      <span class="viewHis fr" @click="openhis" title="历史会话">
        <icon-message />
      </span>
      <span class="picture">
        <input type="file" name="imgFile" @change="imgFileChange" accept="image/jpeg,image/jpg,image/bmp,image/png" />
      </span>
      <!-- <span class="fileSelect">
        <input type="file" name="imgFile" @change="videoFileChange" accept="video/mp4" />
      </span> -->
      <span class="emotion1" @click.stop="toEmotion" unselectable="on" onmousedown="return false;"></span>
    </div>
    <!-- @keyup="editChange(arguments[0], currentUser)" -->
    <!-- contenteditable="plaintext-only" -->
    <div ref="inputRef" class="editDiv" draggable="false" contenteditable="true" :id="currentUser.currentId"
      :text="inputValue" placeholder="请输入" @input="editChange($event)" @blur="divBLur"
      @keydown.enter.prevent="enterKeyDown" style=""></div>
    <button class="send" id="btn2" @click="send">发送</button>
    <div v-show="emotionfag">
      <Emotion @selecEmo="selecEmo" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useAppStore, useUserStore, useComStore } from '@/store';
import { Message, Modal } from '@arco-design/web-vue';
import { Pagination, Options, AnyObject } from '@/types/global';
import { filterfag, filterimg, transferTxtToEmotion } from '@/utils/tools';
import Emotion from './emotion.vue';
const comStore = useComStore();

const props = defineProps(['emotionfag']);
const emit = defineEmits(['emotionClick', 'hisClick']);

const currentUser = computed(() => {
  // console.log('-COMPUTED_currentUser>', comStore.currentUser.userName)
  return comStore.currentUser;
});

const inputRef = ref<HTMLDivElement | null>(null);
const inputValue = ref('');

const editChange = (e: any) => {
  let innerHTML = e.target.innerHTML;
  let innerText = e.target.innerText;

  // xu 先过滤图片，过滤表情剩code, 再过滤其他标签，剩下纯文字
  inputValue.value = filterfag(filterimg(inputRef.value.innerHTML));
};
watch(
  () => comStore.currentUser.imuserId,
  (imuserId) => {
    // console.log('-watch_>', imuserId)
    inputRef.value.innerHTML = '';
    inputValue.value = '';
  }
);

onMounted(() => {
  inputDivAddEventListener();
});

const divBLur = (e: Event) => {
  // console.log('-divBLur>', e);
};

function inputDivAddEventListener() {
  const editDiv = inputRef.value;
  editDiv.addEventListener(
    'paste',
    (e) => {
      var cbd = e.clipboardData;
      console.log('--cbd.getData->', cbd.getData('Text'), '<---');
      let text = cbd.getData('Text');
      if (text) {
        let emoHtml = transferTxtToEmotion(text);
        insertText(emoHtml);
      }
      e.preventDefault();
      return false;
    },
    false
  );
}

const toEmotion = () => {
  emit('emotionClick', !props.emotionfag);
};
const selecEmo = (emo) => {
  let emoHtml = transferTxtToEmotion(emo.code);
  insertText(emoHtml);
};
const insertText = (text) => {
  const editDiv = inputRef.value;
  let range, node;

  // console.log('-1>', [editDiv]);
  // console.log('-2>', document.activeElement);
  // console.log('-3>', text);

  if (editDiv !== document.activeElement) {
    editDiv.focus();
    moveToEnd();
  }
  if (window.getSelection && window.getSelection().getRangeAt) {
    range = window.getSelection().getRangeAt(0);
    range.collapse(false);
    node = range.createContextualFragment(text);
    var c = node.lastChild;
    range.insertNode(node);
    if (c) {
      range.setEndAfter(c);
      range.setStartAfter(c);
    }
    var j = window.getSelection();
    j.removeAllRanges();
    j.addRange(range);
    editDiv.focus();
  }
  inputValue.value = filterfag(filterimg(inputRef.value.innerHTML));
};
const moveToEnd = function () {
  let range = window.getSelection(); //创建range
  range.selectAllChildren(inputRef.value); //range 选择obj下所有子内容
  range.collapseToEnd(); //光标移至最后
};

const enterKeyDown = () => {
  send();
};
const send = () => {
  const htmlData = inputRef.value.innerHTML;
  const sendValue = inputValue.value;
  // console.log('-htmlData>', htmlData);
  // console.log('-sendValue>', sendValue);

  if (!htmlData) {
    console.log('--->', '内容为空', '<---');
    return;
  }

  // 发文本
  if (sendValue) {
    if (sendValue.length > 1000) {
      Message.error('超过1000字数限制');
      return;
    }
    // 判断是否有引用 消息 105
    let params = {};
    if (comStore.currentUser.quto) {
      params = {
        content: {
          Text: sendValue,
          type: 1,
          account: comStore.currentAccount.PassportId,
          ...comStore.currentUser.quto,
        },
        contentType: 105,
      };
    } else {
      params = {
        content: {
          Text: sendValue,
          type: 1,
          account: comStore.currentAccount.PassportId,
        },
        contentType: 101,
      };
    }

    comStore.beforeSendMsg(params);

    // 清除引用
    comStore.currentUser.quto = null;

    inputRef.value.innerHTML = '';
    inputValue.value = '';
  }
};
const imgFileChange = (e: AnyObject) => {
  console.log('-e?.target>', e?.target.files)

  if (e?.target?.files.length === 0) return
  if (!e?.target?.files[0].type.includes('image')) {
    Message.error('不支持当前格式的文件，请选择图片')
    return
  }

  const params = {
    content: {
      Text: '',
      type: 1,
      account: comStore.currentAccount.PassportId,
    },
    contentType: 102,
    file: e?.target?.files[0],
  };
  comStore.beforeSendMsg(params);
};
const videoFileChange = (e: AnyObject) => {
  const params = {
    content: {
      Text: '',
      type: 1,
      account: comStore.currentAccount.PassportId,
    },
    contentType: 103,
    file: e?.target?.files[0],
  };
  comStore.beforeSendMsg(params);
};
const openhis = () => {
  emit('hisClick');
};
</script>
<style lang="less" scoped>
.inputCon {
  background-color: rgb(255, 255, 255);
  position: relative;

  .toolBar {
    background-color: rgb(253, 253, 253);
    height: 30px;
    padding: 0 5px;

    &>span {
      display: inline-block;
      margin: 5px;
      width: 20px;
      height: 20px;
      vertical-align: middle;
      cursor: pointer;
      font-size: 18px;
    }

    .fontIcon {
      background: url('../../../assets/images/allbgs.png') no-repeat 0px -56px;
      height: 18px;
      width: 20px;
    }

    .emotion1 {
      background: url('../../../assets/images/allbgs.png') no-repeat 0px -108px;
      height: 20px;
      width: 20px;
    }

    .sendComment {
      background: url(../../../assets/images/allbgs.png) no-repeat 0px -42px;
      margin-top: 8px;
      height: 14px;
      width: 20px;
    }

    .fileSelect {
      background: url(../../../assets/images/allbgs.png) no-repeat 0px -91px;
    }

    .picture {
      background: url(../../../assets/images/allbgs.png) no-repeat 0px -74px;
    }

    .picture,
    .fileSelect {
      height: 17px;
      width: 20px;

      input {
        width: 20px;
        box-sizing: border-box;
        position: relative;
        background-color: #ccc;
        overflow: hidden;
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: 35px;
        opacity: 0;
        cursor: pointer;
      }
    }

    .capture {
      position: relative;
      width: 30px;
    }

    .captureDown {
      font-size: 12px;
      position: absolute;
      right: -3px;
      top: 5px;
    }

    .sendWarn {
      width: 200px;

      span {
        font-size: 14px;
      }
    }
  }

  textarea,
  .editDiv {
    display: block;
    width: 100%;
    height: calc(100% - 30px);
    box-sizing: border-box;
    padding: 5px;
    border: none;
    outline: none;
    font-size: 16px;
    background-color: rgb(255, 255, 255);
    overflow: auto;
    -webkit-user-modify: read-write-plaintext-only; // 控制文本样式

    img {
      max-height: 95%;
    }

    :deep(.emotion) {
      width: 24px;
      height: 24px;
      vertical-align: sub;
    }
  }

  .send {
    position: absolute;
    bottom: 5px;
    right: 10px;
    cursor: pointer;
    background-color: rgb(255, 255, 255);
    border: 1px solid rgb(209, 206, 206);
  }

  .transfer {
    position: absolute;
    bottom: 5px;
    left: 10px;
    cursor: pointer;
    background-color: rgb(255, 255, 255);
    border: 1px solid rgb(209, 206, 206);
  }
}
</style>
