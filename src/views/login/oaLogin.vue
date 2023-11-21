<template>
  <div class="container">
    <img :src="imgsrc" alt="图片出错了" style="width: 100%" />
    <div class="content">
      <div class="content-inner">
        <a-card class="general-card" title="">
          <a-space :size="40">
            <a-button type="primary" @click="oaLogin"> 集团OA登录 </a-button>
            <a-button type="primary" @click="secLogin" v-if="showBtn"> 证券OA登录 </a-button>
            <a-button status="success" @click="accLogin" v-if="showBtn"> 快捷登录 </a-button>
          </a-space>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, reactive, onMounted, computed } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import imgsrc from '@/assets/images/df_info.png';
import Cookies from 'js-cookie';

import globalConfig from '@/config';
import { Md5 } from 'ts-md5';
import { getToken, setToken, clearToken } from '@/utils/tools';
import config from '@/config';

const router = useRouter();
const userStore = useUserStore();

const oaLogin = () => {
  window.location.href = globalConfig.oaLoginUrl;
};
const secLogin = () => {
  window.location.href = globalConfig.secLoginUrl;
};
const accLogin = async () => {
  const params = {
    WorkNumber: '210595',
    password: Md5.hashStr('123456').toUpperCase(),
  };
  await userStore.login(params);
  router.push({
    name: 'home',
  });
};

const showBtn = computed(() => {
  let f = config.enviroment !== 'production'
  return f

})
/// <summary>
/// 登陆成功
/// </summary>
// Success = 0,
/// <summary>
/// 登录验证失败
/// </summary>
// ValidateFail = 1,

/// <summary>
/// 此工号的用户未被授权
/// </summary>
// UserNotAuth = 2,

/// <summary>
/// 未知异常
/// </summary>
// SystemError = 3,
/// <summary>
/// token过期
/// </summary>


// TokenOutOfDate = 4,

/// <summary>
/// 登出
/// </summary>
// LogOut = 5

onMounted(() => {
  handleErr();
});
// 处理验证失败的情况
const handleErr = () => {
  const errInfo = {
    '0': '登录成功',
    '1': '验证失败',
    '2': '用户未被授权,请联系管理员',
    '3': '未知异常',
    '4': 'token过期',
    '5': '已登出',
  }
  let token = getToken() || '';
  const query = router.currentRoute.value.query;
  const code = query.code || ''
  if (!code) {
    return
  } else if (code === '2') {
    Modal.info({
      title: '提示',
      content: `系统中不存在该账户，请联系管理员添加后再次登录`,
      okText: '确定',
      onOk: () => {
        const url = `${globalConfig.logoutUrl}?token=${token}`;
        window.location.href = url;
      },
    });
  } else {
    let msg = errInfo[code as string] || '登录认证失败，请重新登录！'
    Message.error(msg);
    setToken('')
  }
};


</script>

<style lang="less" scoped>
.container {
  height: 100vh;

  .content {
    position: relative;

    .content-inner {
      margin: 0 auto;
      height: 200px;
      width: 600px;
    }

    .general-card {
      height: 100%;
      padding: 80px 0 0;
      text-align: center;

      .arco-btn {
        width: 180px;
        height: 40px;
      }
    }
  }
}
</style>
