<!--
 * @Date: 2023-07-25 09:57:48
 * @LastEditors: zbx
 * @LastEditTime: 2023-08-29 16:22:32
 * @descript: 文件描述
-->
<template>
  <div class="container" @click="handleClickHome">
    <div class="pageContent" v-show="curAccount.PassportId">
      <div class="leftContent">
        <DialogList></DialogList>
      </div>
      <div class="centerContent" id="dropZone" v-if="currentUser.passportId">
        <ChatContain></ChatContain>
        <InputCom @emotionClick="emotionClick" @hisClick="showHistory" :emotionfag="emotionfag"></InputCom>
      </div>
      <div class="centerContent" v-if="!currentUser.passportId">
        <div class="empty" draggable="false">
          <div class="center absCenter font20" style="color: grey">
            沟通，就要直接一点
          </div>
        </div>
      </div>
      <div class="rightContent">
        <SearchList></SearchList>
      </div>
    </div>
    <ul v-show="menuOption.visible" :style="{
      left: menuOption.left + 'px',
      top: menuOption.top + 'px',
    }" class="contextmenu">
      <li @click="item.callBack()" v-for="(item, idx) in menuOption.menus" :key="idx">{{ item.menuText }}</li>
    </ul>

    <HistoryModal ref="modalRef" />
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, reactive, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted, onActivated } from 'vue';
import { Pagination, Options, AnyObject, UserInfo } from '@/types/global';
import ChatContain from './components/chatContain.vue';
import DialogList from './components/dialog-list.vue';
import InputCom from './components/input.vue';
import SearchList from './components/search-list.vue';
import HistoryModal from './components/historyModal.vue';

import { useAppStore, useUserStore, useComStore } from '@/store';
const comStore = useComStore();

const currentUser = computed(() => {
  return comStore.currentUser;
});

const curAccount = computed(() => {
  return comStore.currentAccount;
});

const menuOption: AnyObject = reactive({
  visible: false,
  rightClickItem: null,
  left: 0,
  top: 0,
});

onMounted(() => {
  console.log('-chat-Page-onMounted>', 1)
  comStore.get_chatUserList()
  // handleDrop()
})
window.$rightClick = function (e: any, menus: any[]) {
  menuOption.rightClickItem = e;
  menuOption.top = e.clientY + 15;
  menuOption.left = e.clientX - 15;
  menuOption.menus = menus;
  menuOption.visible = true;
};
const handleDrop = () => {
  const dropEle = document.querySelector('#dropZone');
  dropEle.addEventListener('dragover', function (e) {
    // e.stopPropagation()
    // e.preventDefault()
    // console.log('->', e.target) // e.target
  }, false);

  dropEle.addEventListener('drop', function (e) {
    e.stopPropagation()
    e.preventDefault()
    console.log('->', e.target) // e.target
    var files = e['dataTransfer']?.files
    console.log('->', files)
    return false
  }, false); // useCapture：可选参数，一个布尔值，指定事件是在捕获阶段（true）还是冒泡阶段（false）执行函数。默认为 false。
}
onBeforeUnmount(() => {
  closeMenu();
});

const handleClickHome = () => {
  closeMenu();
  closeEmotion();
};
const closeMenu = () => {
  menuOption.rightClickItem = null;
  menuOption.visible = false;
};

let emotionfag = ref(false);
const closeEmotion = () => {
  emotionfag.value = false;
};
const emotionClick = (val: boolean) => {
  console.log('-emotionClick>', val);
  emotionfag.value = val;
};
const copyText = (item: AnyObject) => {
  console.log('->', item);
};

const modalRef = ref<InstanceType<typeof HistoryModal> | null>(null);
const showHistory = () => {
  modalRef.value?.show();
};



</script>

<style lang="less" scoped>
.container {
  // padding: 20px 20px 20px 20px;
  height: 100%;

  .pageContent {
    height: 100%;
    display: flex;
    justify-content: space-between;
    background-color: var(--color-bg-1);

    &>div {
      height: 100%;
      padding: 10px;
      border: 0.5px solid rgb(216, 216, 216);
    }

    .leftContent {
      padding: 10px 0;
      width: 20%;
    }

    .centerContent {
      width: 55%;
      padding: 0px;
      position: relative;

      .chatContain {
        height: 75%;
      }

      .inputCon {
        height: 25%;
      }

      .empty {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #fff;
      }
    }

    .rightContent {
      width: 25%;
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: fixed;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  }

  .contextmenu li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
  }

  .contextmenu li:hover {
    background-color: rgb(3, 125, 243);
    color: white;
  }
}
</style>
