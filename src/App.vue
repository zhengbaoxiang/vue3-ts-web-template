<!--
 * @Date: 2023-07-14 14:13:43
 * @LastEditors: zbx
 * @LastEditTime: 2023-11-21 16:01:31
 * @descript: 文件描述
-->
<template>
  <a-config-provider :locale="locale">
    <router-view></router-view>
  </a-config-provider>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
import useLocale from '@/hooks/locale';

export default defineComponent({
  components: {
  },
  setup() {
    const { currentLocale } = useLocale();
    const locale = computed(() => {
      switch (currentLocale.value) {
        case 'zh-CN':
          return zhCN;
        case 'en-US':
          return enUS;
        default:
          return zhCN;
      }
    });
    return {
      locale,
    };
  },
});
</script>
