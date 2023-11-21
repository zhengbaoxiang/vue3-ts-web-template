<!--
 * @Date: 2023-07-28 11:09:34
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-13 15:19:45
 * @descript: 文件描述
-->
<template>
  <div class="chatListCon">
    <div class="search mb10">
      <a-input-search v-model="searchUserId" :placeholder="'搜索用户'" allow-clear @change="searchUser"
        @search="searchUser" />
    </div>
    <a-list id="searchList">
      <a-list-item v-for="(item, idx) in dataList" :key="item.Uid" class="userItemCon">
        <a-list-item-meta :title="item.Alias" :description="item.des">
          <template #avatar>
            <a-avatar shape="circle" @click="toUserInfo(item)" style="cursor: pointer">
              <img alt="avatar" :src="item.userAvatar" />
            </a-avatar>
          </template>
        </a-list-item-meta>
        <template #actions>
          <a-button size="mini" type="primary" status="warning" v-if="item.CanChat" @click="chatClick(item)">
            聊天
          </a-button>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, computed, reactive } from 'vue';
import { useAppStore, useUserStore, useComStore } from '@/store';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { Message, Modal } from '@arco-design/web-vue';
import { Pagination, Options, AnyObject } from '@/types/global';
import { getToken, setToken, getAvator, formatDate } from '@/utils/tools';
import { UserApi } from '@/api/auth-user';
import { GetPassportUsers, StartChat } from '@/api/user';

const comStore = useComStore();
const searchUserId = ref('');
const dataList = ref<any[]>([]);
const fetchData = async () => {
  if (!searchUserId.value) return
  const params = {
    "pageIndex": 1,
    "pageSize": 10,
    keyword: searchUserId.value,
    searchByNickName: true

  };
  try {
    const { data } = await GetPassportUsers(params);
    const list = data || [];
    list.forEach((item: any) => {
      item.userAvatar = getAvator(item.PassportId);
      item.des = `${item.FansCount}粉丝 | ${item.UserFollowingCount}关注 | ${item.PostCount}帖子`
    });
    dataList.value = list;
  } catch (err) {
    console.log('->', err);
  } finally {
  }
};
fetchData();
const searchUser = (key: string) => {
  console.log('-搜索>', key);
  fetchData();
};
const toUserInfo = (user: AnyObject) => {
  const url = `https://i.eastmoney.com/${user.Uid}`
  window.open(url)
}
const chatClick = async (user: AnyObject) => {
  // 如果当前没有账号，则不展示，或者直接返回
  // 先调接口，获取Imid,然后才能聊天，
  const params = {
    "accountPassportId": comStore.currentAccount.PassportId,
    "receiverPassportId": user.PassportId,
    "alias": user.Alias
  }
  const { data } = await StartChat(params)
  console.log('->', data)
  user.ImId = data
  comStore.add_dialogue(user);
};
</script>
<style lang="less" scoped>
.chatListCon {
  height: 100%;
}

#searchList {
  height: calc(100% - 45px);

  .arco-spin.arco-list-spin {
    overflow: auto;
  }

  .userItemCon {
    padding: 10px;
  }
}
</style>
