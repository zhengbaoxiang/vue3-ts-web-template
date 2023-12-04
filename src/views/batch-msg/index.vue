<!--
 * @Date: 2023-07-25 09:56:43
 * @LastEditors: zbx
 * @LastEditTime: 2023-12-04 16:47:05
 * @descript: 文件描述
-->
<template>
  <div class="container">
    <a-tabs :type="'line'" :size="'medium'" lazy-load v-model:active-key="curKey" default-active-key="draft"
      @change="tabChange">
      <template #extra>
        <a-button @click="toAdd" class="fr" type="primary">
          <template #icon> <icon-plus /> </template>新增
        </a-button>
      </template>
      <a-tab-pane key="draft" title="草稿箱">
        <Draft ref="draftRef" :accountList="accountList" />
      </a-tab-pane>
      <!-- 只有管理员和审核权限业务员 才能查看-->
      <a-tab-pane key="review" title="审核列表" v-if="role === 'Admin' || role === 'Auditor'">
        <Review ref="reviewRef" :accountList="accountList" />
      </a-tab-pane>
      <a-tab-pane key="history" title="批量发送历史">
        <History ref="historyRef" :accountList="accountList" />
      </a-tab-pane>
    </a-tabs>
    <FormDarwer ref="modalRef0" @refresh="refresh"></FormDarwer>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, onBeforeMount, onMounted } from 'vue';
import { useUserStore, useComStore } from '@/store';
import { Message, Modal } from '@arco-design/web-vue';
import { AccountInfo, AnyObject } from '@/types/global';
import Draft from './components/draft.vue';
import History from './components/history.vue';
import Review from './components/review.vue';
import FormDarwer from './components/formDarwer.vue';

const userStore = useUserStore();
const role = userStore.role;

const comStore = useComStore();


const accountList = computed(() => {
  console.log('-computed>', 'batch-msg')
  if (role === 'Admin' || role === 'Auditor') {
    const list = comStore.accountList.map((item: AccountInfo) => {
      return {
        value: item.PassportId,
        label: item.AccountName,
      };
    });
    return list
  } else if (role === 'User') {
    return []
  }
});

onMounted(() => {
})

const curKey = ref('draft');
const draftRef = ref<InstanceType<typeof Draft> | null>(null);
const historyRef = ref<InstanceType<typeof History> | null>(null);
const reviewRef = ref<InstanceType<typeof Review> | null>(null);
// 新增，刷新三个列表
const refresh = () => {
  console.log('->', 'refresh');
  draftRef.value?.refresh()
  reviewRef.value?.refresh()
  historyRef.value?.refresh()
};
// 处理角色，审核等逻辑
const tabChange = (value: any) => {
  console.log('->', value);
  switch (value) {
    case 'draft':
      draftRef.value?.refresh()
      break
    case 'review':
      reviewRef.value?.refresh()
      break
    case 'history':
      historyRef.value?.refresh()
      break
  }
};

// 打开添加窗口 先检查是否已经登录了账号
const modalRef0 = ref<InstanceType<typeof FormDarwer> | null>(null);
const toAdd = () => {
  if (!comStore.currentAccount.PassportId) {
    Message.warning('请登录后选择当前官方账号');
    return;
  }
  modalRef0.value?.toAdd({
    SendAccount: comStore.currentAccount.PassportId,
  });
};


</script>
