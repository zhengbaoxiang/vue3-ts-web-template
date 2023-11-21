<!--
 * @Date: 2023-07-18 17:48:30
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-14 14:46:17
 * @descript: 文件描述
-->
<template>
  <a-modal v-model:visible="visible" :title="pageForm.id ? '编辑' : '新增'" titleAlign="start" :width="600"
    :mask-closable="true" draggable>
    <a-form :model="pageForm" :rules="rules" ref="formRef" layout="horizontal" auto-label-width>
      <!-- :label-col-props="{ span: 6 }" -->
      <!-- :wrapper-col-props="{ span: 18 }" -->
      <a-form-item field="AccountName" label="账号名称：" feedback>
        <a-input v-model="pageForm.AccountName" readonly />
      </a-form-item>
      <a-form-item field="Description" label="业务描述：" feedback>
        <a-input v-model="pageForm.Description" />
      </a-form-item>
      <a-form-item field="PermittedGroup" label="正向群组：" feedback>
        <a-input v-model="pageForm.PermittedGroup" />
      </a-form-item>
      <a-form-item field="BanedGroup" label="反向群组：" feedback>
        <a-input v-model="pageForm.BanedGroup" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="visible = false">关闭</a-button>
      <a-button @click="confirmPage" type="primary" :loading="loading">确定</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { Message, Modal } from '@arco-design/web-vue';
import { Pagination, Options, AnyObject } from '@/types/global';
import { AccountApi, AccountRecord } from '@/api/account';
import useLoading from '@/hooks/loading';
const { loading, setLoading } = useLoading(false);

// defineProps(['title']);
// const props = defineProps(['foo'])

// defineEmits(['enlarge-text'])
const emit = defineEmits(['refresh']);
// emit('refresh')

const formRef = ref<FormInstance>();
const visible = ref(false);

const pageForm = ref<AnyObject>({ id: null });
// 真个表单的校验规则
const rules = {
  AccountName: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  ],
  PermittedGroup: [
    {
      required: false,
      message: '请输入数字',
      trigger: 'blur',
      match: /^\d+?$/
    },
  ],
  BanedGroup: [
    {
      required: false,
      message: '请输入数字',
      trigger: 'blur',
      match: /^\d+?$/
    },
  ],
};

const toAdd = (row: AnyObject) => {
  pageForm.value = {
    id: null,
    ...row,
  };
  formRef.value?.resetFields();
  visible.value = true;
};
const toEdit = (row: AnyObject) => {
  pageForm.value = {
    id: row.PassportId,
    ...row,
  };
  // this.$refs.pageForm.resetFields();
  formRef.value?.resetFields();
  visible.value = true;
};
// 确认
const confirmPage = async () => {
  const errors = await formRef.value?.validate();
  if (!errors) {
    const params = {
      ...pageForm.value,
    };
    if (pageForm.value.id) {
      edit(params);
    } else {
      add(params);
    }
  }
};
const add = async (params: AnyObject) => {
  setLoading(true);
  try {
    await AccountApi.add(params);
    Message.success('操作成功');
    visible.value = false;
    emit('refresh');
  } catch (error) {
  } finally {
    setLoading(false);
  }
};
const edit = async (params: AnyObject) => {
  setLoading(true);
  try {
    await AccountApi.edit(params);
    Message.success('操作成功');
    visible.value = false;
    emit('refresh');
  } catch (error) {
  } finally {
    setLoading(false);
  }
};

// 使用了 <script setup> 的组件是默认私有的：
// 一个父组件无法访问到一个使用了 <script setup> 的子组件中的任何东西，
// 除非子组件在其中通过 defineExpose 宏显式暴露：
defineExpose({
  toAdd,
  toEdit,
});
</script>
