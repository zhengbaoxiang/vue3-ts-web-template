<!--
 * @Date: 2023-07-18 17:48:30
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-14 16:12:13
 * @descript: 文件描述
-->
<template>
  <a-drawer v-model:visible="visible" :title="pageForm.id ? '编辑' : '新增'" placement="right" :width="600"
    :mask-closable="true" unmountOnClose>
    <a-form :model="pageForm" :rules="rules" ref="formRef" layout="horizontal" auto-label-width>
      <a-form-item field="WorkNumber" label="工号" feedback :disabled="!!pageForm.id">
        <a-input v-model="pageForm.WorkNumber" allow-clear />
      </a-form-item>
      <a-form-item field="RealName" label="姓名" feedback>
        <a-input v-model="pageForm.RealName" allow-clear :max-length="10" />
      </a-form-item>
      <a-form-item field="PhoneNumber" label="手机号" feedback>
        <a-input v-model="pageForm.PhoneNumber" allow-clear />
      </a-form-item>
      <!-- <a-form-item field="Password" label="密码" feedback v-if="!pageForm.id">
        <a-input v-model="pageForm.Password" allow-clear />
      </a-form-item> -->
      <a-form-item field="UserRole" label="角色" feedback>
        <a-radio-group v-model="pageForm.UserRole">
          <a-radio :value="item.value" v-for="(item, index) in roleList" :key="index">{{ item.label }}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="PermittedAccounts" label="可操作官方号" feedback>
        <a-select v-model="pageForm.PermittedAccounts" multiple>
          <a-option :value="item.value" v-for="(item, index) in accountList" :key="index">{{ item.label }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="Remark" label="备注" feedback>
        <a-textarea v-model="pageForm.Remark" :max-length="100" allow-clear show-word-limit />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="visible = false">关闭</a-button>
      <a-button @click="confirmPage" type="primary" :loading="loading">确定</a-button>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { Message, Drawer } from '@arco-design/web-vue';
import { Pagination, Options, AnyObject } from '@/types/global';
import { AccountApi } from '@/api/account';
import { UserApi } from '@/api/auth-user';
import useLoading from '@/hooks/loading';
import { Md5 } from 'ts-md5';
const { loading, setLoading } = useLoading(false);

// defineProps(['title']);
// const props = defineProps(['foo'])

// defineEmits(['enlarge-text'])
const emit = defineEmits(['refresh']);
// emit('refresh')

const formRef = ref<FormInstance>();
const visible = ref(false);

const pageForm = ref<AnyObject>({ id: null });
// 整个表单的校验规则
const rules = {
  WorkNumber:
  {
    required: true,
    message: '请输入',
    trigger: 'blur',
  },
  RealName:
  {
    required: true,
    message: '请输入',
    trigger: 'blur',
  },
  Password:
  {
    required: false,
    message: '请输入',
    trigger: 'blur',
  },

  UserRole: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  PermittedAccounts: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
};

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
  } catch (error) {
  } finally {
    setLoading(false);
  }
};
getRoles();

let accountList: any[] = [];
const getAllAccount = async () => {
  try {
    const { data } = await UserApi.getAllAccount();
    accountList = data.map((item: AnyObject) => {
      return {
        value: item.PassportId,
        label: item.AccountName,
      };
    });
  } catch (error) {
  } finally {
    setLoading(false);
  }
};

getAllAccount();
onMounted(() => {
});

//  表单常用增加编辑逻辑
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
    id: row.WorkNumber,
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
    console.log('-表单>', params);
    if (pageForm.value.id) {
      edit(params);
    } else {
      // params.Password = Md5.hashStr(pageForm.value.Password).toUpperCase(),
      add(params);
    }
  }
};

const add = async (params: AnyObject) => {
  setLoading(true);
  try {
    await UserApi.add(params);
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
    await UserApi.edit(params);
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
