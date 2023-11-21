<!--
 * @Date: 2023-07-25 10:54:07
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-11 17:55:07
 * @descript: 文件描述
-->
<template>
  <a-card class="general-card pt15" title="">
    <a-form :model="queryInfo" class="form mb10" layout="inline" style="width: 100%">
      <a-form-item>
        <a-range-picker v-model="queryInfo.dataRange" show-time format="YYYY-MM-DD HH:mm"
          :time-picker-props="{ defaultValue: ['00:00:00', '23:59:59'] }" style="width: 320px" />
      </a-form-item>
      <a-form-item>
        <a-select v-model="queryInfo.sendAccount" style="width: 200px" placeholder="请选择账号" allow-clear>
          <a-option :value="item.value" v-for="(item, index) in accountList" :key="index">{{ item.label }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-select v-model="queryInfo.state" style="width: 120px" placeholder="请选择状态">
          <a-option :value="0">全部</a-option>
          <a-option :value="2">未审核</a-option>
          <a-option :value="4">已拒绝</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-input v-model="queryInfo.sendOperator" style="width: 155px" :placeholder="'请输入操作人员工号'" />
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
          <a-col :span="12">
            <span>更新时间：{{ item.UpdateTime }}</span>
          </a-col>
          <a-col :span="12">
            <span v-if="item.AuditReason" class="red">拒绝原因：{{ item.AuditReason }}</span>
          </a-col>
        </a-row>
        <a-row class="grid-demo" :gutter="[0, 5]">
          <a-col :span="12">
            <span>发送账号：{{ item.AccountName }}</span>
          </a-col>
          <a-col :span="12">
            <span>操作人员：{{ item.SendOperatorName }}</span>
          </a-col>
        </a-row>
        <a-row class="grid-demo">
          <a-col :span="12">
            <span>名单信息：
              <a-link @click="downLoadFile(item)">{{
                item.FileName
              }}</a-link></span>
          </a-col>
          <a-col :span="12">
            <span>发放人数：{{ item.TargetUserCount }}</span>
          </a-col>
        </a-row>
        <a-row class="grid-demo">
          <a-col :span="12">
            <p>目标对象：{{ item.TargetUser }}</p>
          </a-col>
          <a-col :span="12">
            <p>发送目的：{{ item.SendReason }}</p>
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
        <template #actions>
          <template v-if="item.State === 4">
            <a-popconfirm content="确认要删除该数据吗?" @ok="toDel(item)">
              <a-button class="mr10"> 删除</a-button>
            </a-popconfirm>
            <a-button @click="toEdit(item)" type="primary"> 编辑 </a-button>
          </template>
          <template v-else>
            <a-button @click="toAudit(item, false)" status="danger" class="mr10">
              拒绝</a-button>
            <a-button @click="toAudit(item, true)" status="success">
              通过
            </a-button>
          </template>
        </template>
      </a-list-item>
    </a-list>
    <div class="pt10">
      <a-pagination size="small" :total="pagination.total" :current="pagination.pageIndex" show-total show-page-size
        :default-page-size="pagination.pageSize" :page-size-options="[20, 50, 100]" @change="onPageChange"
        @page-size-change="onPageSizeChange" style="justify-content: flex-end;" />
    </div>
    <FormDarwer ref="modalRef" @refresh="refresh"></FormDarwer>
    <a-modal v-model:visible="visible" @ok="">
      <template #title> 审批 </template>
      <a-form :model="reviewForm" ref="formRef">
        <a-form-item field="reason" label="拒绝原因：" required :rules="[{ required: true, message: '请输入拒绝原因' }]"
          :validate-trigger="['change', 'blur']">
          <a-input v-model="reviewForm.reason" placeholder="请输入"></a-input>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button @click="visible = false">关闭</a-button>
        <a-button type="primary" @click="handleConfirm">确定</a-button>
      </template>
    </a-modal>
  </a-card>
</template>
<script lang="ts" setup>
import { defineComponent, ref, computed, reactive, onBeforeMount, onMounted } from 'vue';
import { useAppStore, useUserStore, useComStore } from '@/store';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { Message, Modal } from '@arco-design/web-vue';
import { Pagination, Options, AnyObject } from '@/types/global';

import { getToken, setToken, formatDate, handleBLob } from '@/utils/tools';
import { BatchMessageApi, BatchTargetUserApi } from '@/api/batch-msg';
import FormDarwer from './formDarwer.vue';

const props = defineProps(['accountList'])


const comStore = useComStore();

const basePagination: Pagination = {
  pageIndex: 1,
  pageSize: 20,
  total: 0,
};
const pagination = reactive({
  ...basePagination,
});

const queryInfo = reactive({
  sendAccount: comStore.currentAccount.PassportId,
  sendOperator: '',
  dataRange: [],
  state: 0,
});

onMounted(() => {
  setTimeout(() => {
    search();
  }, 100);
});

// 分页列表
const dataList = ref<any[]>([]);
const getDataList = async () => {
  const params = {
    ...queryInfo,
    sendDateTimeStart: queryInfo.dataRange && queryInfo.dataRange[0] || '',
    sendDateTimeEnd: queryInfo.dataRange && queryInfo.dataRange[1] || '',
    ...pagination,
  };
  try {
    const { data, count } = await BatchMessageApi.getAuditList(params);
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
  };
  const res = await BatchTargetUserApi.GetUsers(params);
  handleBLob(res)
};

// 审核功能
const toAudit = async (row: AnyObject, flag: boolean) => {
  const params = {
    batchMessageId: row.BatchMessageId,
    res: flag,
    reason: '',
  };
  if (flag) {
    Modal.open({
      title: '审批',
      titleAlign: 'center',
      content: '确认此条消息通过发放吗？',
      onOk: async () => {
        await BatchMessageApi.audit(params);
        Message.success('操作成功');
        refresh();
      },
    });
  } else {
    formRef.value?.resetFields();
    visible.value = true;
    reviewForm.value = params;
  }
};
const visible = ref(false);
const reviewForm = ref({
  batchMessageId: '',
  res: false,
  reason: '',
});
const formRef = ref<FormInstance>();

const handleConfirm = async () => {
  const errors = await formRef.value?.validate();
  console.log('-error>', errors);
  if (!errors) {
    const params = {
      ...reviewForm.value,
    };
    await BatchMessageApi.audit(params);
    Message.success('已拒绝');
    refresh();
    visible.value = false;
  }
};


// 弹窗逻辑
const modalRef = ref<InstanceType<typeof FormDarwer> | null>(null);
// 继续编辑
const toEdit = (row: AnyObject) => {
  modalRef.value?.toEdit(row);
};
// 删除提示
const toDel = async (row: AnyObject) => {
  const params = {
    batchMessageId: row.BatchMessageId,
  };
  await BatchMessageApi.deleteNotPassed(params);
  Message.success('删除成功');
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
