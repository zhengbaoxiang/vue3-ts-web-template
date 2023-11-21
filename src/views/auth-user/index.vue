<!--
 * @Date: 2023-07-17 15:37:17
 * @LastEditors: zbx
 * @LastEditTime: 2023-11-21 16:59:38
 * @descript: 文件描述
-->
<template>
  <div class="container">
    <a-card class="general-card" title="用户管理列表">
      <a-form :model="queryInfo" class="form mb10" layout="inline" style="width: 100%">
        <a-form-item :label="''">
          <a-select :style="{ width: '200px' }" v-model="queryInfo.userRole" allow-clear placeholder="请选择角色">
            <a-option :value="item.value" v-for="(item, index) in roleList" :key="index">{{ item.label }}</a-option>
          </a-select>
        </a-form-item>
        <a-button type="primary" @click="search" class="mr10">
          <template #icon>
            <icon-search />
          </template>
          查询
        </a-button>
        <a-button @click="toAdd" class="fr" status="success">
          <template #icon> <icon-plus /> </template>新增
        </a-button>
      </a-form>
      <a-table row-key="id" :loading="loading" :bordered="{ cell: true }" stripe :data="tableData"
        :pagination="pagination" @page-change="onPageChange">
        <template #columns>
          <a-table-column title="序号" data-index="index" :width="70" />
          <a-table-column title="工号" data-index="WorkNumber" :width="80" :align="'center'" />
          <a-table-column title="姓名" data-index="RealName" :width="100" :align="'center'" />
          <a-table-column title="手机号" data-index="PhoneNumber" :align="'center'" />
          <a-table-column title="角色" data-index="UserRole" :width="80" :align="'center'" />
          <a-table-column title="可操作账号" data-index="PermittedAccounts" :width="180" :align="'center'">
            <template #cell="{ record }">
              <a-space direction="vertical" :size="10">
                <a-typography-text v-for="(item, idx) in record.PermittedAccounts" :key="idx">
                  {{ item }}
                </a-typography-text>
              </a-space>
            </template>
          </a-table-column>
          <a-table-column title="备注" data-index="Remark" :width="200" />
          <a-table-column title="更新时间" data-index="UpdateTime" />
          <a-table-column title="操作人" data-index="OperatorName" :width="80" :align="'center'" />
          <a-table-column title="操作" data-index="operations" :align="'center'">
            <template #cell="{ record }">
              <a-button class="mr10" @click="toEdit(record)">
                <icon-edit />
              </a-button>
              <a-popconfirm content="确认要删除该数据吗?" @ok="toDel(record)">
                <a-button class="" status="danger">
                  <icon-delete />
                </a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <FormDarwer ref="modalRef" @refresh="refresh"></FormDarwer>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, computed, reactive } from 'vue';
import useLoading from '@/hooks/loading';
import { Message, Modal } from '@arco-design/web-vue';

import { Pagination, Options, AnyObject } from '@/types/global';
import { formatDate } from '@/utils/tools';
import { UserApi } from '@/api/auth-user';
import FormDarwer from './components/formDarwer.vue';

const { loading, setLoading } = useLoading(true);

const basePagination: Pagination = {
  pageIndex: 1,
  pageSize: 50,
  total: 0,
};
const pagination = reactive({
  ...basePagination,
});

const queryInfo = ref<AnyObject>({ passportId: '' });
const tableData = ref<any[]>([]);


// 获取列表数据
const fetchData = async () => {
  const params = {
    ...pagination,
    ...queryInfo.value,
  };
  setLoading(true);
  try {
    const { data, count } = await UserApi.getList(params);
    const list = data || [];
    list.forEach((item: AnyObject, index: number) => {
      item.index = index + 1;
      item.UpdateTime = formatDate(item.UpdateTime, 'dateTime')
      item.PermittedAccounts = item.PermittedAccounts || [];
      //  item.createTime = formateDate(item.createTime) //格式化
    });
    tableData.value = list;
    pagination.total = count;
    pagination.pageIndex = params.pageIndex;
  } catch (err) {
    console.log('-接口，catch>',err)
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
// 查询
const search = async () => {
  pagination.pageIndex = 1;
  fetchData();
};
// 页码编号
const onPageChange = (pageIndex: number) => {
  pagination.pageIndex = pageIndex || 1
  fetchData();
};
// 刷新
const refresh = () => {
  fetchData();
};
// 重置
const reset = () => {
  queryInfo.value = {};
  pagination.pageIndex = 1;
  fetchData();
};
search();

//  表单内选项
let roleList: any[] = [];
const getRoles = async () => {
  try {
    const { data } = await UserApi.getRoles();
    roleList = data.map((item: AnyObject) => {
      return {
        value: item.RoleId,
        label: item.RoleName,
      };
    });
  } catch (error) { }
};
getRoles();


const modalRef = ref<InstanceType<typeof FormDarwer> | null>(null);

// 打开添加窗口
const toAdd = (row: AnyObject = {}) => {
  modalRef.value?.toAdd(row);
};
// 打开编辑窗口
const toEdit = (row: AnyObject) => {
  modalRef.value?.toEdit(row);
};
// 删除提示
const toDel = async (row: any) => {
  const params = {
    WorkNumber: row.WorkNumber,
  };
  await UserApi.del(params);
  Message.success('删除成功');
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
