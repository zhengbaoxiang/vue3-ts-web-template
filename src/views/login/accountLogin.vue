<template>
  <div class="container">
    <img :src="imgsrc" alt="图片出错了" style="width: 100%" />
    <div class="content">
      <div class="content-inner">
        <div class="login-form-wrapper">
          <div class="login-form-title center">{{ globalConfig.title }}</div>
          <a-form ref="loginForm" :model="userInfo" class="login-form" layout="vertical" @submit="handleSubmit">
            <a-form-item field="username" :rules="[{ required: true, message: '请输入用户名' }]"
              :validate-trigger="['change', 'blur']" hide-label>
              <a-input v-model="userInfo.username" :placeholder="'请输入'" allow-clear @keyup.enter="handleSubmit">
                <template #prefix>
                  <icon-user />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item field="password" :rules="[{ required: true, message: '请输入密码' }]"
              :validate-trigger="['change', 'blur']" hide-label>
              <a-input-password v-model="userInfo.password" :placeholder="'请输入'" allow-clear @keyup.enter="handleSubmit">
                <template #prefix>
                  <icon-lock />
                </template>
              </a-input-password>
            </a-form-item>
            <a-space :size="16" direction="vertical">
              <a-button type="primary" html-type="submit" long :loading="loading">
                登录
              </a-button>
            </a-space>
          </a-form>
          <div class="login-form-error-msg">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';

import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
import useLoading from '@/hooks/loading';
import { LoginData } from '@/api/user';

import globalConfig from '@/config';
import { Md5 } from 'ts-md5';
import imgsrc from '@/assets/images/df_info.png';

const router = useRouter();
const errorMessage = ref('');
const { loading, setLoading } = useLoading();
const userStore = useUserStore();
const userInfo = reactive({
  username: '210595',
  password: '123456', // 转md5 E10ADC3949BA59ABBE56E057F20F883E
});
const handleSubmit = async ({
  errors,
  values,
}: {
  errors: Record<string, ValidatedError> | undefined;
  values: LoginData;
}) => {
  // debugger;
  if (!errors) {
    setLoading(true);
    try {
      const params = {
        WorkNumber: values.username,
        password: Md5.hashStr(values.password).toUpperCase(),
      };
      await userStore.login(params);
      const { redirect, ...othersQuery } = router.currentRoute.value.query;
      console.log('->', router);
      router.push({
        name: (redirect as string) || 'home',
        query: {
          ...othersQuery,
        },
      });
      Message.success('登录成功');
    } catch (err) {
      errorMessage.value = (err as Error).message;
    } finally {
      setLoading(false);
    }
  }
};
onMounted(() => { });
</script>

<style lang="less" scoped>
.container {
  height: 100vh;

  .content {
    padding-top: 40px;
    margin: 0 auto;
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  }

  .login-form {
    &-wrapper {
      width: 320px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
      margin-bottom: 20px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
}
</style>
