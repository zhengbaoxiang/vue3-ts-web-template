<!--
 * @Date: 2023-07-17 15:37:17
 * @LastEditors: zbx
 * @LastEditTime: 2023-08-23 13:41:05
 * @descript: 文件描述
-->
<template>
  <div class="container">
    <a-card class="general-card" title="添加官方号">
      <a-form class="form" layout="inline">
        <a-form-item :label="''">
          <a-input style="width: 300px" v-model="queryInfo.PassportId" :placeholder="'请输入用户UID'" />
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
      <a-list>
        <a-list-item v-for="(item, idx) in queryList" :key="idx">
          <a-list-item-meta :title="item.AccountName" :description="item.Description">
            <template #avatar>
              <a-avatar shape="circle">
                <img alt="avatar" :src="item.img" />
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

          <a-table-column title="操作" data-index="operations" :width="200" :align="'center'">
            <template #cell="{ record }">
              <a-typography-text type="secondary" v-if="record.IsDel">
                已移除
              </a-typography-text>
              <a-typography-text type="secondary" v-else-if="record.IsCanceled">
                已注销
              </a-typography-text>
              <template v-else>
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
import { getToken, setToken, getAvator } from '@/utils/tools';

import { defineComponent, ref, computed, reactive, nextTick } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import useLoading from '@/hooks/loading';
import { Pagination, Options, AnyObject } from '@/types/global';
import { AccountApi, AccountRecord } from '@/api/account';
import FormModal from './components/formModal.vue';
const { loading, setLoading } = useLoading(true);

const basePagination: Pagination = {
  pageIndex: 1,
  pageSize: 20,
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
    // tableData.value = [
    //   {
    //     PassportId: 1,
    //     permissionedGroup: 13333323123,
    //     banedGroup: 33444213223123,
    //     des: '业务描述信息1',
    //     status: 1,
    //     title: '狗蛋1',
    //     img: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/581b17753093199839f2e327e726b157.svg~tplv-49unhts6dw-image.image',
    //   },
    //   {
    //     PassportId: 1,
    //     permissionedGroup: 33333,
    //     banedGroup: 333444444444,
    //     des: '业务描述信息2',
    //     status: 0,
    //     title: '狗蛋2',
    //     img: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/581b17753093199839f2e327e726b157.svg~tplv-49unhts6dw-image.image',
    //   },
    // ];
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

const search = async () => {
  console.log('->', queryInfo);
  if (!queryInfo.PassportId) return;
  const params = {
    PassportId: queryInfo.PassportId,
  };

  await nextTick();

  try {
    const { data } = await AccountApi.queryById(params);
    data.img = getAvator(data.PassportId);
    queryList.value = [data];
    console.log('->', data);
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    // queryList.value = [
    //   {
    //     PassportId: 1,
    //     title: '狗蛋',
    //     img: '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/581b17753093199839f2e327e726b157.svg~tplv-49unhts6dw-image.image',
    //   },
    // ];
    setLoading(false);
  }
};

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
    PassportId: row.PassportId,
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
</script>
<style lang="less" scoped>
.container {
  padding: 20px 20px 20px 20px;
}

.operations {
  display: flex;
}
</style>
