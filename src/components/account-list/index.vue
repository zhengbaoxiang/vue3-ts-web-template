<!--
 * @Date: 2023-07-24 15:21:39
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-14 16:09:33
 * @descript: 文件描述
-->
<template>
  <div class="navbar">
    <p class="verticalTitle">官方号切换</p>
    <ul class="contain">
      <li class="accountCard" v-for="(item, idx) in accountList" :key="idx"
        :class="curAccount.PassportId === item.PassportId ? 'current' : ''">
        <div class="headImg" @click="clickAcc(item)">
          <a-avatar shape="circle" :size="50">
            <img alt="avatar" :src="item.accAvatar" />
          </a-avatar>
          <a-tag class="status" color="#00b42a" size="small" v-if="item.State == 1">在线</a-tag>
          <a-tag class="status" color="#86909c" size="small" v-if="item.State == 2">离线</a-tag>
          <a-tag class="status" color="#ffb400" size="small" v-if="item.State == 3">{{ item.OccupiedUserName }}占用</a-tag>
          <a-tag class="unread" color="#f53f3f" size="small" v-if="item.State == 1 && item.OfflineTotalCount">{{
            item.OfflineTotalCount
          }}</a-tag>
        </div>
        <div class="btmZone">
          <p class="accountTitle">{{ item.AccountName }}</p>
          <div>
            <a-popconfirm content="确认要下线吗?" @ok="offline(item)">
              <!-- @click.stop="offline(item)" -->
              <a-button class="mt5" status="success" size="mini" v-if="item.State == 1">
                下线
              </a-button>
            </a-popconfirm>

            <a-button class="mt5" status="warning" size="mini" v-if="item.State == 2" @click.stop="online(item)">
              上线
            </a-button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, computed, ref, onBeforeMount, onMounted } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore, useComStore } from '@/store';
import { AnyObject, AccountInfo } from '@/types/global';
import { getOnline, getOffline } from '@/api/user';

const comStore = useComStore();


const accountList = computed(() => {
  return comStore.accountList;
});
const curAccount = computed(() => {
  return comStore.currentAccount;
});

const clickAcc = (item: AccountInfo) => {
  if (item.PassportId === comStore.currentAccount.PassportId) return;
  if (item.State !== 1) return;
  Modal.confirm({
    title: '提示',
    titleAlign: 'start',
    content: `确定要切换到账号：${item.AccountName} 吗？`,
    onOk: async () => {
      comStore.set_curAccount(item);
    },
  });
};
onMounted(() => {

})
const online = async (item: AccountInfo) => {
  const params = {
    accountId: item.PassportId,
  };
  await getOnline(params);
  Message.success(item.AccountName + ' 已上线');
  comStore.update_accountList();
  comStore.set_curAccount(item)
};
const offline = async (item: AccountInfo) => {
  const params = {
    accountId: item.PassportId,
  };
  await getOffline(params);
  if (item.PassportId === comStore.currentAccount.PassportId) {
    comStore.currentAccount = {}
  };
  Message.success(item.AccountName + ' 已下线');
  comStore.update_accountList();
};
</script>
<style lang="less" scoped>
.navbar {
  display: flex;
  justify-content: flex-start;
  height: 100%;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
  border-left: 0.5px solid var(--color-neutral-3);
  width: calc(100% - 200px);
  padding: 0 20px;
  overflow-x: auto;
  overflow-y: hidden;
}

.verticalTitle {
  width: 20px;
  height: 100%;
  padding-top: 10px;
  font-size: 16px;
}

.contain {
  margin-left: 20px;
  width: calc(100% - 60px);
  display: flex;
  justify-content: flex-start;

  .accountCard {
    height: 100%;
    margin: 0 15px;
    padding: 5px 0;
    width: 85px;
    flex-shrink: 0;
    text-align: center;
    cursor: pointer;

    &.current {
      .arco-avatar {
        border: 0.5px solid red;
      }

      .accountTitle {
        color: red;
      }
    }

    .headImg {
      position: relative;
      width: 50px;
      height: 55px;
      margin: 0 auto;

      .status {
        position: absolute;
        top: 0;
        left: 30px;
      }

      .unread {
        position: absolute;
        bottom: 0;
        left: 30px;
      }
    }

    .btmZone {
      .accountTitle {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      margin-top: 8px;
    }
  }
}
</style>
