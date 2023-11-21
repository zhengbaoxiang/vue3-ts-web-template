<!--
 * @Date: 2023-07-25 10:54:07
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-11 17:50:44
 * @descript: 文件描述
-->
<template>
  <a-card class="general-card pt15" title="">
    <a-form :model="queryInfo" class="form mb10" layout="inline" style="width: 100%">
      <a-form-item>
        <a-range-picker v-model="queryInfo.dataRange" show-time format="YYYY-MM-DD HH:mm"
          :time-picker-props="{ defaultValue: ['00:00:00', '23:59:59'] }" style="width: 320px" />
      </a-form-item>
      <a-form-item v-if="role === 'Admin'">
        <a-select v-model="queryInfo.sendAccount" style="width: 200px" placeholder="请选择账号" allow-clear>
          <a-option :value="item.value" v-for="(item, index) in accountList" :key="index">{{ item.label }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-select v-model="queryInfo.state" style="width: 150px" placeholder="请选择状态">
          <a-option :value="0">全部</a-option>
          <a-option :value="5">成功</a-option>
          <a-option :value="7">失败</a-option>
        </a-select>
      </a-form-item>
      <a-button type="primary" @click="search" class="mr10">
        <template #icon>
          <icon-search />
        </template>
        查询
      </a-button>
    </a-form>
    <a-list :max-height="590" :data="dataList" hoverable size="medium" class="list-demo-action-layout" :bordered="true">
      <a-list-item v-for="(item, idx) in dataList" :key="idx" class="list-demo-item" action-layout="horizontal">
        <a-row class="grid-demo">
          <a-col :span="8">
            <span>发送时间：{{ item.SendDateTime }}</span>
          </a-col>
          <a-col :span="8">
            <span>官方号：{{ item.AccountName }}</span>
          </a-col>
          <a-col :span="8">
            <span>操作人：{{ item.SendOperatorName }}</span>
          </a-col>
        </a-row>
        <p class="sendContent">
          <span class="spanTitle">消息内容：</span>
          <span class="content">
            <a-typography-text :ellipsis="{
              rows: 2,
              expandable: true,
              // showTooltip: true,
              showTooltip: {
                type: 'popover',
                props: {
                  style: { maxWidth: `600px` },
                },
              },
            }">
              {{ item.Content }}
            </a-typography-text>
          </span>
        </p>
        <a-row class="grid-demo">
          <a-col :span="8">
            <span>发送成功/总人数：{{ item.TargetUserSucessCount }} / {{ item.TargetUserCount }}</span>
          </a-col>
          <a-col :span="8">
            <span>发送结果： <a-link @click="downLoadFile(item)">{{ item.FileName }}</a-link></span>
          </a-col>
          <a-col :span="8">
            <span>失败人群：
              <a-link v-if="item.TargetUserCount !== item.TargetUserSucessCount"
                @click="downLoadFailFile(item)">失败人员名单</a-link>
              <span v-else>无</span>
            </span>
          </a-col>
        </a-row>
        <template #actions>
          <a-popconfirm content="确认要撤回该数据吗?" @ok="toDel(item)" v-if="item.State === 5 || item.State === 7">
            <a-button class="mr10" status="danger"> 撤回</a-button>
          </a-popconfirm>
          <a-button class="mr10" disabled v-if="item.State === 6"> 已撤回 </a-button>
          <a-button class="mr10" disabled v-if="item.State === 8"> 撤回中 </a-button>
          <a-button @click="toEdit(item)"> 详情 </a-button>
        </template>
      </a-list-item>
    </a-list>
    <div class="pt10">
      <a-pagination size="small" :total="pagination.total" :current="pagination.pageIndex" show-total show-page-size
        :default-page-size="pagination.pageSize" :page-size-options="[20, 50, 100]" @change="onPageChange"
        @page-size-change="onPageSizeChange" style="justify-content: flex-end;" />
    </div>
    <FormDarwer ref="modalRef" @refresh="refresh"></FormDarwer>
  </a-card>
</template>
<script lang="ts" setup>
import { defineComponent, ref, computed, reactive, onBeforeMount, onMounted } from 'vue';
import { useAppStore, useUserStore, useComStore } from '@/store';
import { Message, Modal } from '@arco-design/web-vue';
import { Pagination, Options, AnyObject } from '@/types/global';

import { getToken, setToken, formatDate, handleBLob } from '@/utils/tools';
import { BatchMessageApi, BatchTargetUserApi } from '@/api/batch-msg';
import FormDarwer from './formDarwer.vue';

const props = defineProps(['accountList'])


const comStore = useComStore();
const userStore = useUserStore();

const role = userStore.role;

const basePagination: Pagination = {
  pageIndex: 1,
  pageSize: 20,
  total: 0,
};
const pagination = reactive({
  ...basePagination,
});
const queryInfo = reactive({
  sendAccount: '',
  dataRange: [],
  state: 0,
});

onMounted(() => {
  setTimeout(() => {
    queryInfo.sendAccount = comStore.currentAccount.PassportId  //  初始值
    search();
  }, 100);
});
// 分页列表
const dataList = ref<any[]>([]);
const getDataList = async () => {
  if (role !== 'Admin') {
    queryInfo.sendAccount = comStore.currentAccount.PassportId // 更新
  }

  const params = {
    ...queryInfo,
    sendDateTimeStart: queryInfo.dataRange && queryInfo.dataRange[0] || '',
    sendDateTimeEnd: queryInfo.dataRange && queryInfo.dataRange[1] || '',
    ...pagination,
  };

  try {
    const { data, count } = await BatchMessageApi.getHistory(params);
    const list = data || [];
    list.forEach((item: any) => { });
    dataList.value = list;
    pagination.total = count;
  } catch (error) {
    console.log('-error>', error);
    dataList.value = [];
    pagination.total = 0;
  }
};
const refresh = () => {
  getDataList();
};
const search = () => {
  pagination.pageIndex = 1
  getDataList();
};

const onPageChange = (pageIndex: number) => {
  pagination.pageIndex = pageIndex || 1
  getDataList();
};
const onPageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize;
  getDataList();
};



// 下载文件逻辑
const downLoadFile = async (item: AnyObject) => {
  const params = {
    // fileId: item.FileId,
    batchMessageId: item.BatchMessageId,
    state: 0
  };
  const res = await BatchTargetUserApi.GetSendResult(params);
  handleBLob(res)
};

// 下载文件逻辑
// 获取发送结果  state =1 为成功、2为失败 3为撤回
const downLoadFailFile = async (item: AnyObject) => {
  const params = {
    batchMessageId: item.BatchMessageId,
    state: 2
  };
  const res = await BatchTargetUserApi.GetSendResult(params);
  handleBLob(res)

};

const modalRef = ref<InstanceType<typeof FormDarwer> | null>(null);

// 打开详情
const toEdit = (row: AnyObject) => {
  modalRef.value?.toView(row);
};
// 提示
const toDel = async (row: AnyObject) => {
  const params = {
    BatchMessageId: row.BatchMessageId,
  };
  await BatchMessageApi.batchMessageWithdraw(params);
  Message.success('撤回成功');
  getDataList();
};


defineExpose({
  refresh
})

</script>


<style lang="less" scoped>
:deep(.list-demo-item) {
  .arco-list-item-main {
    margin-right: 20px;
  }
}

.grid-demo .arco-col {
  height: 32px;
}

.sendContent {
  margin-top: 5px;

  span {
    display: inline-block;
    vertical-align: top;
  }

  .content {
    width: calc(100% - 70px);
    word-break: break-all;
  }
}
</style>
