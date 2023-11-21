<!--
 * @Date: 2023-07-17 15:37:17
 * @LastEditors: zbx
 * @LastEditTime: 2023-11-07 13:22:13
 * @descript: 文件描述
-->
<template>
  <div class="container">
    <a-card class="general-card" title="添加官方号">
      <a-form ref="formRef" layout="inline" :model="queryInfo">
        <a-form-item label="" field="PassportId" validate-trigger="input"
          :rules="[{ type: 'string', match: /^\d+?$/, message: '只能填入数字' }]">
          <a-input style="width: 300px" v-model="queryInfo.PassportId" allow-clear :placeholder="'请输入用户UID'" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="search">
            <template #icon>
              <icon-search />
            </template>
            查询
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card>
      <a-list style="max-height:400px;overflow: auto;">
        <a-list-item v-for="(item, idx) in queryList" :key="idx">
          <a-list-item-meta :title="item.AccountName" :description="item.des">
            <template #avatar>
              <a-avatar shape="circle" @click="toUserInfo(item)" style="cursor: pointer">
                <img alt="avatar" :src="item.userAvatar" />
              </a-avatar>
            </template>
          </a-list-item-meta>
          <template #actions>
            <a-button class="mr10" @click="toAdd(item)"> 添加 </a-button>
          </template>
        </a-list-item>
      </a-list>
    </a-card>
    <a-divider />
    <a-card class="general-card" title="可管理官方号维护列表">
      <a-table row-key="id" :loading="loading" :bordered="true" :data="tableData" :pagination="pagination"
        @page-change="onPageChange">
        <template #columns>
          <a-table-column title="账户信息" data-index="AccountName">
            <template #cell="{ record }">
              <a-space>
                <a-avatar :size="30" shape="circle">
                  <img alt="avatar" :src="record.img" />
                </a-avatar>
                {{ record.AccountName }}
              </a-space>
            </template>
          </a-table-column>
          <a-table-column title="业务描述" data-index="Description" />
          <a-table-column title="群组" data-index="group">
            <template #cell="{ record }">
              <a-space direction="vertical" :size="10">
                <a-typography-text>
                  正向群组：{{ record.PermittedGroup }}
                </a-typography-text>
                <a-typography-text>
                  反向群组：{{ record.BanedGroup }}
                </a-typography-text>
              </a-space>
            </template>
          </a-table-column>

          <a-table-column title="操作" data-index="operations" :width="250" :align="'center'">
            <template #cell="{ record }">
              <a-typography-text type="secondary" v-if="record.IsDel">
                已移除
              </a-typography-text>
              <a-typography-text type="secondary" v-else-if="record.IsCanceled">
                已注销
              </a-typography-text>
              <template v-else>

                <a-popconfirm content="确认要注销该账号吗?" @ok="CancelPassportAccount(record)">
                  <a-button status="warning" class="mr10"> 注销</a-button>
                </a-popconfirm>


                <a-button class="mr10" @click="toEdit(record)"> 管理 </a-button>

                <a-popconfirm content="确认要删除该数据吗?" @ok="toDel(record)">
                  <a-button status="danger"> 移除</a-button>
                </a-popconfirm>
              </template>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <FormModal ref="modalRef" @refresh="refresh"></FormModal>
  </div>
</template>
<script lang="ts" setup>

import {ref, reactive, computed,  nextTick,defineComponent } from 'vue';
import useLoading from '@/hooks/loading';
import Form, { FormInstance } from '@arco-design/web-vue/es/form';
import { Message, Modal } from '@arco-design/web-vue';

import { Pagination, Options, AnyObject } from '@/types/global';
import { getToken, setToken, getAvator } from '@/utils/tools';
import { AccountApi, AccountRecord } from '@/api/account';
import { GetPassportUsers } from '@/api/user';
import FormModal from './components/formModal.vue';


const { loading, setLoading } = useLoading(true);

const basePagination: Pagination = {
  pageIndex: 1,
  pageSize: 20,
  total: 0
};
const pagination = reactive({
  ...basePagination,
});
// 返回一个对象的响应式代理。
const queryInfo = reactive({ PassportId: '' });

// 接受一个内部值，返回一个响应式的、可更改的 ref 对象，此对象只有一个指向其内部值的属性 .value。
const queryList = ref<any[]>([]);
const tableData = ref<any[]>([]);

// 声明一个 ref 来存放该元素的引用// 必须和模板里的 ref 同名
const modalRef = ref<InstanceType<typeof FormModal> | null>(null);

const fetchData = async () => {
  const params: Pagination = {
    ...pagination,
  };
  setLoading(true);
  try {
    const { data, count } = await AccountApi.getList(params);
    // console.log('-res>', data, count);
    const list = data || [];
    list.forEach((item: any) => {
      item.img = getAvator(item.PassportId);
    });
    tableData.value = list;
    pagination.total = count;
    pagination.pageIndex = params.pageIndex;
  } catch (err) {
    console.log('->', err);
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
const onPageChange = (pageIndex: number) => {
  pagination.pageIndex = pageIndex || 1
  fetchData();
};
const refresh = () => {
  console.log('->', 'refresh');
  fetchData();
};

fetchData();

const formRef = ref<FormInstance>();
const search = async () => {
  queryList.value = []
  if (!queryInfo.PassportId) return;
  const errors = await formRef.value?.validate();
  if (errors) return

  // let params = {
  //   PassportId: queryInfo.PassportId,
  // };
  // const { data } = await AccountApi.queryById(params);
  // queryList.value = [data];

  let params2 = {
    "pageIndex": 1,
    "pageSize": 10,
    keyword: queryInfo.PassportId,
    searchByNickName: false
  };
  const { data } = await GetPassportUsers(params2);
  const list = data || [];
  list.forEach((item: any) => {
    item.AccountName = item.Alias;
    item.userAvatar = getAvator(item.PassportId);
    item.des = `${item.FansCount}粉丝 | ${item.UserFollowingCount}关注 | ${item.PostCount}帖子`
  });
  queryList.value = list;
};
const toUserInfo = (user: AnyObject) => {
  const url = `https://i.eastmoney.com/${user.Uid}`
  window.open(url)
}

// 打开添加窗口
const toAdd = (row: AnyObject) => {
  modalRef.value?.toAdd(row);
};
// 打开编辑窗口
const toEdit = (row: AnyObject) => {
  modalRef.value?.toEdit(row);
};
// 删除提示
const toDel = async (row: any) => {
  const params = {
    passportId: row.PassportId,
  };
  await AccountApi.del(params);
  Message.success('删除成功');
  refresh();
  // 使用pop,不使用modal
  // Modal.confirm({
  //   title: '提示',
  //   titleAlign: 'start',
  //   content: '确定删除该数据吗？',
  //   onOk: async () => {
  //     await AccountApi.del(params);
  //     Message.success('删除成功');
  //     refresh();
  //   },
  // });
};
// 提示
const CancelPassportAccount = async (row: any) => {
  const params = {
    passportId: row.PassportId,
  };
  await AccountApi.CancelPassportAccount(params);
  Message.success('注销成功');
  refresh();
};
</script>
<style lang="less" scoped>
.container {
  padding: 20px 20px 20px 20px;
}

.operations {
  display: flex;
}
</style>
