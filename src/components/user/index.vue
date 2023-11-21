<!--
 * @Date: 2023-07-18 10:20:50
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-12 16:40:42
 * @descript: 文件描述
-->
<template>
  <a-layout-content class="userContain">
    <div class="imgContain">
      <a-dropdown trigger="click">
        <a-avatar :size="45" :style="{ margin: '2px' }">
          <img alt="avatar" :src="avatar" class="avatarClass" />
        </a-avatar>
        <template #content>
          <a-doption>
            <a-space @click="logout">
              <icon-export />
              <span>
                {{ $t('messageBox.logout') }}
              </span>
            </a-space>
          </a-doption>
        </template>
      </a-dropdown>
    </div>
    <a-typography-title :style="{ margin: 0, fontSize: '16px' }" class="pt10" :heading="5">
      {{ RealName + (collapse ? '' : '，欢迎您') }}
    </a-typography-title>
  </a-layout-content>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore, useUserStore } from '@/store';
import useUser from '@/hooks/user';
import config from '@/config';

export default defineComponent({
  setup() {
    const appStore = useAppStore();
    const userStore = useUserStore();
    const router = useRouter();

    const collapse = computed(() => {
      return appStore.menuCollapse;
    });

    const RealName = userStore.RealName;
    const avatar = computed(() => {
      return userStore.avatar;
    });

    const logout = async () => {
      const data = await userStore.handleLogOut();
      // 如果是接口退出，就打开
      // router.push({
      //   name: 'login',
      //   query: {},
      // });
    };
    return {
      RealName,
      avatar,
      collapse,
      logout,
      //
    };
  },
});
</script>

<style scoped lang="less">
.userContain {
  width: 100%;
  height: 100%;
  text-align: center;
  padding-top: 10px;
  border-right: 1px solid var(--color-neutral-3);
}
</style>
