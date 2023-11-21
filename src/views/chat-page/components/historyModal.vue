<!--
 * @Date: 2023-08-17 09:13:39
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-11 17:51:20
 * @descript: 文件描述
-->
<template>
  <a-modal v-model:visible="visible" :title="`${currentUser.userName}-聊天记录`" titleAlign="start" :width="650"
    :mask-closable="true" :footer="false" draggable>
    <a-form :model="pageForm" layout="inline" auto-label-width>
      <a-form-item field="dataRange" label="时间范围">
        <a-range-picker v-model="pageForm.dataRange" show-time format="YYYY-MM-DD HH:mm"
          :time-picker-props="{ defaultValue: ['00:00:00', '23:59:59'] }" style="width: 320px" />
      </a-form-item>
      <a-button type="primary" @click="search" class="mr10">
        <template #icon>
          <icon-search />
        </template>
        查询
      </a-button>
    </a-form>
    <div class="pageCon">
      <a-pagination size="small" :total="pagination.total" show-total :default-page-size="pagination.pageSize"
        @change="onPageChange" />
    </div>

    <div class="scrollConatin">
      <ul class="chatHistory" ref="scrollZoneRef">
        <li v-for="(item, idx) in dataList" :key="item.msgId" :id="'his_' + item.msgId">
          <MsgItem :msgObj="item" :key="item.msgId" :show-time="true"></MsgItem>
        </li>
      </ul>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { defineComponent, ref, computed, reactive, onBeforeMount } from 'vue';
import { useAppStore, useUserStore, useComStore } from '@/store';
import MsgItem from './msgItem.vue';
import { Message, Modal } from '@arco-design/web-vue';
import { Pagination, Options, AnyObject } from '@/types/global';
import { AccountApi, AccountRecord } from '@/api/account';
import { MessageApi } from '@/api/chat-list';
import useLoading from '@/hooks/loading';
import { msgParse, RealMsg } from '@/store/msgParse';
const { loading, setLoading } = useLoading(false);

const emit = defineEmits(['refresh']);

const comStore = useComStore();
const currentUser = computed(() => {
  return comStore.currentUser;
});

const visible = ref(false);

const basePagination: Pagination = {
  pageIndex: 1,
  pageSize: 20,
  total: 0,
};
const pagination = reactive({
  ...basePagination,
});
const pageForm = reactive<AnyObject>({
  "beginTime": "",
  "endTime": "",
});
const dataList = ref<any[]>([]);

const show = () => {
  visible.value = true;
  fetchData();
};

const fetchData = async () => {
  console.log('-搜索>', pageForm);
  const params = {
    "accountImId": comStore.currentAccount.PassportId,
    "senderImId": comStore.currentUser.imuserId,
    beginTime: pageForm.dataRange && pageForm.dataRange[0] || '',
    endTime: pageForm.dataRange && pageForm.dataRange[1] || '',
    ...pagination,
  };
  try {
    const { data } = await MessageApi.GetMessageRecord(params);
    const list = data.Content || [];
    list.reverse()

    const temp: RealMsg[] = [];
    list.forEach((item: AnyObject) => {
      const realMsg: RealMsg | null = msgParse.dealHisMsg(item, comStore);
      if (realMsg) {
        temp.push(realMsg);
      }
    });
    dataList.value = temp;
    pagination.total = data.Count;
    scrollToView()
  } catch (error) {
    console.log('-error>', error);
  }
};
const scrollToView = () => {
  setTimeout(() => {
    // 滚动至最后一条消息
    const bottomMsg = dataList.value[dataList.value.length - 1]
    if (!bottomMsg) return

    const domId = 'his_' + bottomMsg.msgId
    const bottomMsgEle: HTMLElement | null = document.getElementById(domId)
    bottomMsgEle?.scrollIntoView()
  }, 200);
}

const onPageChange = (pageIndex: number) => {
  pagination.pageIndex = pageIndex || 1
  fetchData();
};
const search = () => {
  pagination.pageIndex = 1
  fetchData();
};

defineExpose({
  show,
});
</script>
<style lang="less" scoped>
.pageCon {
  padding: 10px 0;
  border-top: 1px solid rgb(230, 230, 230);

  .arco-pagination {
    justify-content: center;
  }
}

.scrollConatin {
  flex: 1;
  // max-height: calc(100% - 50px);
  max-height: 700px;
  background-color: rgba(238, 234, 234, 0.5);
  overflow: auto;
  padding: 2px;

  .chatHistory {
    min-height: calc(100% - 100px);
    padding-bottom: 10px;
  }
}
</style>
